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

const CLIENT_SUBJECTS:
    Record<
        SubmissionType,
        string
    > = {
    lords:
        "We received your Lord's Nta10ment inquiry",

    tea:
        "We received your Tea for Chat pitch",

    mowithmd:
        "We received your MowithMD conversation idea",
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

function buildOwnerEmail(
    submissionType:
    SubmissionType,
    submission:
    Record<string, string>,
    reference: string
) {
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
        SUBJECTS[
            submissionType
            ]
    )}
            </h1>

            <p>
                A visitor confirmed
                the following request
                through
                Take a Walk With Me.
            </p>

            <p>
                Reference:
                <strong>
                    ${escapeHtml(
        reference
    )}
                </strong>
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
        [
            `Reference: ${reference}`,
            "",
            ...Object.entries(
                submission
            ).map(
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
            ),
        ].join("\n\n");

    return {
        html,
        text,
    };
}

function buildClientEmail(
    submissionType:
    SubmissionType,
    submission:
    Record<string, string>,
    reference: string
) {
    const name =
        submission.name ||
        "there";

    let heading =
        "We've received your request.";

    let intro =
        "Thanks for reaching out through Take a Walk With Me.";

    let summary = "";

    if (
        submissionType ===
        "lords"
    ) {
        heading =
            "Your inquiry is in.";

        intro =
            "Thanks for reaching out to Lord's Nta10ment. Your request has been received for human review.";

        const details = [
            submission.eventType,
            submission.requestedDate,
            submission.location,
            submission.service,
        ].filter(Boolean);

        summary =
            details.length
                ? `
                    <div
                        style="
                            margin:24px 0;
                            padding:18px;
                            border:1px solid #e7e2da;
                            background:#faf8f4;
                        "
                    >
                        ${details
                    .map(
                        (
                            value
                        ) => `
                                    <div
                                        style="
                                            margin:5px 0;
                                        "
                                    >
                                        ${escapeHtml(
                            value
                        )}
                                    </div>
                                `
                    )
                    .join("")}
                    </div>
                `
                : "";
    }

    if (
        submissionType ===
        "tea"
    ) {
        heading =
            "Your Tea for Chat idea is in.";

        intro =
            "Thanks for sharing your story, guest pitch, or conversation idea with Tea for Chat. It has been received for review.";

        summary =
            submission.topic
                ? `
                    <div
                        style="
                            margin:24px 0;
                            padding:18px;
                            border:1px solid #e7e2da;
                            background:#faf8f4;
                        "
                    >
                        <strong>
                            Topic
                        </strong>
                        <div
                            style="
                                margin-top:6px;
                            "
                        >
                            ${escapeHtml(
                    submission.topic
                )}
                        </div>
                    </div>
                `
                : "";
    }

    if (
        submissionType ===
        "mowithmd"
    ) {
        heading =
            "Your conversation idea is in.";

        intro =
            "Thanks for sharing your MowithMD conversation idea. It has been received for human review.";

        summary =
            submission.topic
                ? `
                    <div
                        style="
                            margin:24px 0;
                            padding:18px;
                            border:1px solid #e7e2da;
                            background:#faf8f4;
                        "
                    >
                        <strong>
                            Conversation
                        </strong>
                        <div
                            style="
                                margin-top:6px;
                            "
                        >
                            ${escapeHtml(
                    submission.topic
                )}
                        </div>
                    </div>
                `
                : "";
    }

    const html = `
        <div
            style="
                background:#f3efe8;
                padding:32px 16px;
                font-family:
                Arial,
                sans-serif;
                color:#171717;
            "
        >
            <div
                style="
                    max-width:620px;
                    margin:auto;
                    background:#ffffff;
                    border:1px solid #e5ded4;
                    padding:32px;
                "
            >
                <div
                    style="
                        font-size:11px;
                        letter-spacing:2px;
                        color:#e85f35;
                        margin-bottom:18px;
                    "
                >
                    MUYIWA DAVIDS /
                    TAKE A WALK WITH ME
                </div>

                <h1
                    style="
                        font-size:28px;
                        line-height:1.15;
                        margin:0 0 18px;
                    "
                >
                    ${escapeHtml(
        heading
    )}
                </h1>

                <p>
                    Hi
                    ${escapeHtml(
        name
    )},
                </p>

                <p
                    style="
                        line-height:1.7;
                    "
                >
                    ${escapeHtml(
        intro
    )}
                </p>

                ${summary}

                <div
                    style="
                        margin:26px 0;
                        padding:14px 16px;
                        border-left:3px solid #e85f35;
                        background:#fbf7f3;
                    "
                >
                    <div
                        style="
                            font-size:11px;
                            letter-spacing:1.5px;
                            color:#777;
                        "
                    >
                        REFERENCE
                    </div>

                    <strong>
                        ${escapeHtml(
        reference
    )}
                    </strong>
                </div>

                <p
                    style="
                        line-height:1.7;
                    "
                >
                    This message confirms
                    receipt only. It does
                    not confirm booking,
                    availability,
                    participation, or
                    acceptance.
                </p>

                <p
                    style="
                        margin-top:28px;
                    "
                >
                    Muyiwa Davids
                </p>
            </div>
        </div>
    `;

    const text = `
Hi ${name},

${intro}

Reference: ${reference}

This message confirms receipt only. It does not confirm booking, availability, participation, or acceptance.

Muyiwa Davids
    `.trim();

    return {
        html,
        text,
    };
}

export async function POST(
    request: Request
) {
    try {
        const body =
            await request.json();

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
            "us-east-1";

        const ses =
            new SESClient({
                region,
            });

        const reference =
            `MD-${Date.now()}`;

        const ownerEmail =
            buildOwnerEmail(
                submissionType,
                submission,
                reference
            );

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
                            SUBJECTS[
                                submissionType
                                ],
                    },

                    Body: {
                        Html: {
                            Data:
                            ownerEmail.html,
                        },

                        Text: {
                            Data:
                            ownerEmail.text,
                        },
                    },
                },
            })
        );

        let acknowledgementSent =
            false;

        const clientEmail =
            buildClientEmail(
                submissionType,
                submission,
                reference
            );

        try {
            await ses.send(
                new SendEmailCommand({
                    Source: from,

                    Destination: {
                        ToAddresses: [
                            submission.email,
                        ],
                    },

                    ReplyToAddresses: [
                        to,
                    ],

                    Message: {
                        Subject: {
                            Data:
                                CLIENT_SUBJECTS[
                                    submissionType
                                    ],
                        },

                        Body: {
                            Html: {
                                Data:
                                clientEmail.html,
                            },

                            Text: {
                                Data:
                                clientEmail.text,
                            },
                        },
                    },
                })
            );

            acknowledgementSent =
                true;
        } catch (error) {
            /*
             * Do not lose the lead just
             * because the acknowledgement
             * email could not be delivered.
             */
            console.error(
                "Client acknowledgement:",
                error
            );
        }

        return NextResponse.json({
            success: true,
            reference,
            acknowledgementSent,
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
