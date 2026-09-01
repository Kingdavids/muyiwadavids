import OpenAI from "openai";

import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

let client: OpenAI | null = null;

async function getProductionApiKey() {
    const secretId =
        process.env.OPENAI_SECRET_ID;

    if (!secretId) {
        return null;
    }

    const region =
        process.env.AWS_REGION ||
        process.env.SES_REGION ||
        "us-east-1";

    const secrets =
        new SecretsManagerClient({
            region,
        });

    const result = await secrets.send(
        new GetSecretValueCommand({
            SecretId: secretId,
        })
    );

    if (!result.SecretString) {
        return null;
    }

    try {
        const parsed =
            JSON.parse(result.SecretString);

        return (
            parsed.OPENAI_API_KEY ||
            parsed.apiKey ||
            null
        );
    } catch {
        return result.SecretString;
    }
}

export async function getOpenAIClient() {
    if (client) {
        return client;
    }

    // Local development
    let apiKey =
        process.env.OPENAI_API_KEY;

    // Amplify production
    if (!apiKey) {
        apiKey =
            (await getProductionApiKey()) ||
            undefined;
    }

    if (!apiKey) {
        throw new Error(
            "OpenAI API key is not configured."
        );
    }

    client = new OpenAI({
        apiKey,
    });

    return client;
}