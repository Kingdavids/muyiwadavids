import {
    SESClient,
    SendEmailCommand,
} from "@aws-sdk/client-ses";

import {
    NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmissionType =
    | "lords"
    | "tea"
    | "mowithmd";

const SUBJECTS:
    Record<
        SubmissionType,
        string
    > = {
    lords:
        "New Lord's Nta10ment Inquiry",

    tea:
        "New Tea for Chat Guest Pitch",

    mowithmd:
        "New MowithMD Conversation Idea",
};

const LABELS:
    Record<string, string> = {
    name: "Name",
    email: "Email",
    phone: "Phone",

    eventType:
        "Event / Session",

    requestedDate:
        "Requested Date",

    location: "Location",

    service:
        "Photo / Video",

    coverageHours:
        "Coverage Hours",

    details: "Details",

    topic: "Topic",

    whyItMatters:
        "Why It Matters",

    perspective:
        "Perspective",

    listenerValue:
        "Listener Value",

    social:
        "Social / Website",

    participation:
        "Participation",
};

function escapeHtml(
    value: string
) {
    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

function validType(
    value: unknown
): value is SubmissionType {
    return (
        value === "lords" ||
        value === "tea" ||
        value === "mowithmd"
    );
}

function cleanSubmission(
    value: unknown
) {
    if (
        typeof value !==
        "object" ||
        value === null
    ) {
        return null;
    }

    const input =
        value as Record<
            string,
            unknown
        >;

    const output:
        Record<
            string,
            string
        > = {};

    for (
        const [
            key,
            field,
        ] of Object.entries(
        input
    )
        ) {
        if (
            typeof field ===
            "string" &&
            field.trim()
        ) {
            output[key] =
                field
                    .trim()
                    .slice(
                        0,
                        4000
                    );
        }
    }

    return output;
}

export async function POST(
    request: Request
) {
    try {
        const body =
            await request.json();

        // Honeypot
        if (body?.website) {
            return NextResponse.json({
                success: true,
            });
        }

        const submissionType =
            body?.submissionType;

        if (
            !validType(
                submissionType
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid submission type.",
                },
                {
                    status: 400,
                }
            );
        }

        const submission =
            cleanSubmission(
                body?.submission
            );

        if (!submission) {
            return NextResponse.json(
                {
                    error:
                        "Submission data is missing.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !submission.name ||
            !submission.email
        ) {
            return NextResponse.json(
                {
                    error:
                        "Name and email are required before submission.",
                },
                {
                    status: 400,
                }
            );
        }

        const to =
            process.env
                .LEADS_TO_EMAIL;

        const from =
            process.env
                .LEADS_FROM_EMAIL;

        if (!to || !from) {
            return NextResponse.json(
                {
                    error:
                        "Submission email is not configured yet.",
                },
                {
                    status: 503,
                }
            );
        }

        const region =
            process.env
                .SES_REGION ||
            process.env
                .AWS_REGION ||
            "ca-central-1";

        const ses =
            new SESClient({
                region,
            });

        const rows =
            Object.entries(
                submission
            )
                .map(
                    ([
                         key,
                         value,
                     ]) => `
                        <tr>
                            <td
                                style="
                                    padding:10px 12px;
                                    border-bottom:1px solid #ddd;
                                    font-weight:600;
                                    vertical-align:top;
                                "
                            >
                                ${escapeHtml(
                        LABELS[
                            key
                            ] ||
                        key
                    )}
                            </td>

                            <td
                                style="
                                    padding:10px 12px;
                                    border-bottom:1px solid #ddd;
                                    white-space:pre-wrap;
                                "
                            >
                                ${escapeHtml(
                        value
                    )}
                            </td>
                        </tr>
                    `
                )
                .join("");

        const subject =
            SUBJECTS[
                submissionType
                ];

        const html = `
            <div
                style="
                    font-family:
                    Arial,
                    sans-serif;
                    max-width:700px;
                    margin:auto;
                    color:#171717;
                "
            >
                <p
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        color:#e85f35;
                    "
                >
                    MUYIWA DAVIDS /
                    AI COMPANION
                </p>

                <h1>
                    ${escapeHtml(
            subject
        )}
                </h1>

                <p>
                    A visitor confirmed
                    the following request
                    through
                    Take a Walk With Me.
                </p>

                <table
                    style="
                        width:100%;
                        border-collapse:collapse;
                        margin-top:20px;
                    "
                >
                    ${rows}
                </table>

                <p
                    style="
                        margin-top:25px;
                        font-size:12px;
                        color:#777;
                    "
                >
                    This submission does
                    not represent an
                    automatic booking or
                    acceptance.
                </p>
            </div>
        `;

        const text =
            Object.entries(
                submission
            )
                .map(
                    ([
                         key,
                         value,
                     ]) =>
                        `${
                            LABELS[
                                key
                                ] ||
                            key
                        }: ${value}`
                )
                .join("\n\n");

        await ses.send(
            new SendEmailCommand({
                Source: from,

                Destination: {
                    ToAddresses: [
                        to,
                    ],
                },

                ReplyToAddresses: [
                    submission.email,
                ],

                Message: {
                    Subject: {
                        Data:
                        subject,
                    },

                    Body: {
                        Html: {
                            Data:
                            html,
                        },

                        Text: {
                            Data:
                            text,
                        },
                    },
                },
            })
        );

        return NextResponse.json({
            success: true,

            reference:
                `MD-${Date.now()}`,
        });
    } catch (error) {
        console.error(
            "Lead submission:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "We couldn't send the request just now. Please try again.",
            },
            {
                status: 500,
            }
        );
    }
}
