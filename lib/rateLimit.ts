import crypto from "crypto";

import {
    DynamoDBClient,
    UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const MAX_REQUESTS_PER_HOUR = 20;
const COOLDOWN_MS = 1500;

const localBuckets = new Map<
    string,
    {
        count: number;
        lastRequest: number;
        expiresAt: number;
    }
>();

function getClientIp(request: Request) {
    const forwarded =
        request.headers.get("x-forwarded-for");

    return (
        forwarded?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

function hashIp(ip: string) {
    return crypto
        .createHash("sha256")
        .update(ip)
        .digest("hex");
}

function getHourBucket(now: number) {
    return Math.floor(now / 3_600_000);
}

function localRateLimit(
    key: string,
    now: number
) {
    const existing =
        localBuckets.get(key);

    if (
        existing &&
        now - existing.lastRequest <
        COOLDOWN_MS
    ) {
        return {
            allowed: false,
            reason:
                "Please wait a moment before sending another message.",
            retryAfter: 2,
        };
    }

    const expiresAt =
        now + 3_700_000;

    const bucket =
        existing &&
        existing.expiresAt > now
            ? {
                count:
                    existing.count +
                    1,
                lastRequest: now,
                expiresAt:
                existing.expiresAt,
            }
            : {
                count: 1,
                lastRequest: now,
                expiresAt,
            };

    localBuckets.set(
        key,
        bucket
    );

    if (
        bucket.count >
        MAX_REQUESTS_PER_HOUR
    ) {
        return {
            allowed: false,
            reason:
                "You've reached the conversation limit for this hour. Please try again later.",
            retryAfter: 3600,
        };
    }

    return {
        allowed: true,
        remaining:
            MAX_REQUESTS_PER_HOUR -
            bucket.count,
    };
}

export async function checkAssistantRateLimit(
    request: Request
) {
    const now = Date.now();

    const ipHash =
        hashIp(
            getClientIp(request)
        );

    const bucketId =
        `assistant:${ipHash}:${getHourBucket(now)}`;

    const table =
        process.env.RATE_LIMIT_TABLE;

    if (!table) {
        return localRateLimit(
            bucketId,
            now
        );
    }

    const region =
        process.env.AWS_REGION ||
        process.env.DYNAMODB_REGION ||
        "us-east-1";

    const client =
        new DynamoDBClient({
            region,
        });

    const ttlSeconds =
        Math.floor(now / 1000) +
        3700;

    const cooldownCutoff =
        now - COOLDOWN_MS;

    try {
        const result =
            await client.send(
                new UpdateItemCommand({
                    TableName:
                    table,

                    Key: {
                        id: {
                            S: bucketId,
                        },
                    },

                    UpdateExpression:
                        "ADD requestCount :one SET lastRequest = :now, expiresAt = :ttl",

                    ConditionExpression:
                        "attribute_not_exists(lastRequest) OR lastRequest <= :cooldownCutoff",

                    ExpressionAttributeValues:
                        {
                            ":one": {
                                N: "1",
                            },

                            ":now": {
                                N: String(now),
                            },

                            ":ttl": {
                                N: String(
                                    ttlSeconds
                                ),
                            },

                            ":cooldownCutoff":
                                {
                                    N: String(
                                        cooldownCutoff
                                    ),
                                },
                        },

                    ReturnValues:
                        "ALL_NEW",
                })
            );

        const count =
            Number(
                result.Attributes
                    ?.requestCount
                    ?.N || "0"
            );

        if (
            count >
            MAX_REQUESTS_PER_HOUR
        ) {
            return {
                allowed: false,
                reason:
                    "You've reached the conversation limit for this hour. Please try again later.",
                retryAfter: 3600,
            };
        }

        return {
            allowed: true,
            remaining:
                Math.max(
                    0,
                    MAX_REQUESTS_PER_HOUR -
                    count
                ),
        };
    } catch (error) {
        const name =
            error instanceof Error
                ? error.name
                : "";

        if (
            name ===
            "ConditionalCheckFailedException"
        ) {
            return {
                allowed: false,
                reason:
                    "Please wait a moment before sending another message.",
                retryAfter: 2,
            };
        }

        console.error(
            "AI rate limiter:",
            error
        );

        if (
            process.env.NODE_ENV ===
            "production"
        ) {
            return {
                allowed: false,
                reason:
                    "The companion is temporarily busy. Please try again shortly.",
                retryAfter: 30,
            };
        }

        return localRateLimit(
            bucketId,
            now
        );
    }
}
