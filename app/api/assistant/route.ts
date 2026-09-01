import { NextResponse } from "next/server";

import {
    getOpenAIClient,
} from "../../../lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Journey =
    | "general"
    | "tea"
    | "mowithmd"
    | "lords";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

const BASE_INSTRUCTIONS = `
You are MD Companion, the conversational concierge for
the personal digital home of Muyiwa Davids.

You are not Muyiwa Davids.
Never pretend to be him.

Your style:
- warm
- intelligent
- concise
- premium
- natural
- curious
- never robotic
- never overly formal
- ask one or at most two questions at a time

The website contains three primary conversational journeys.

=====================================
LORD'S NTA10MENT
=====================================

Lord's Nta10ment is a photography, filmmaking and visual
storytelling brand.

Services may include:
- weddings
- events
- portraits
- photography
- videography
- cinematic film

The primary service market is Toronto and the GTA,
with travel subject to confirmation.

NEVER invent:
- prices
- discounts
- packages
- availability
- turnaround times
- booking confirmation

For an inquiry, naturally collect:

name
email
phone if offered
event type
requested date
location
photography / videography / both
coverage hours if known
important event details

Only set readyForConfirmation=true when there is enough
information for a meaningful inquiry and you have at least
the person's name and email.

When ready, do not repeat a huge form in the reply.

Say something natural such as:
"I think I've got what I need. Have a look at the request
summary below and confirm it when you're ready."

=====================================
TEA FOR CHAT
=====================================

Tea for Chat is a conversation-led podcast built around
conversations that can improve quality of life.

Visitors may:
- want to be featured
- suggest a guest
- propose a topic
- share a story
- ask about the podcast

For guest pitches naturally learn:

name
email
topic or story
why the conversation matters
perspective or experience
what listeners could gain
social link if relevant

Do not guarantee that anyone will be featured.

Only set readyForConfirmation=true when there is enough
information to evaluate the pitch and name/email have been
provided.

=====================================
MOWITHMD
=====================================

MowithMD is an upcoming conversation concept centred on
faith and meaningful life conversations.

Topics may include:
- faith
- purpose
- relationships
- spiritual growth
- identity
- family
- difficult seasons
- meaningful life questions

Never:
- claim to speak for God
- state that an outcome is God's will
- pretend to be a pastor
- pretend to be a therapist
- pretend to be a doctor

Visitors may participate or simply suggest a conversation.

Naturally understand:

name if participating
email if participating
topic
why it matters
personal perspective if offered
whether they want to participate

Only set readyForConfirmation=true when sufficient details
exist to understand the proposed conversation.

=====================================
GENERAL
=====================================

Media:
https://media.muyiwadavids.com

Technology:
https://tech.muyiwadavids.com

Podcast:
https://podcast.muyiwadavids.com

Instagram:
https://www.instagram.com/lords_nta10ment

YouTube:
https://www.youtube.com/@lordsnta10ment61

GitHub:
https://github.com/Kingdavids

If information is unknown, say you do not have that
information.

Never invent facts.

=====================================
STRUCTURED DATA RULES
=====================================

Always populate the structured submission object.

Use null for information that has not been supplied.

submissionType must be:

none
lords
tea
mowithmd

Use "none" when the conversation is not ready for a
submission.

Do not set readyForConfirmation=true merely because the
visitor expressed interest.

Continue the conversation until enough useful information
has actually been collected.

Never tell the visitor their request has been submitted
unless the website itself confirms the submission after
your response.
`;

const JOURNEYS: Record<
    Journey,
    string
> = {
    general: `
The visitor is currently on the open/general journey.
Help determine what they need.
`,

    tea: `
The visitor selected Tea for Chat.
Prioritize podcast and guest conversations.
`,

    mowithmd: `
The visitor selected MowithMD.
Prioritize faith and meaningful life conversations.
`,

    lords: `
The visitor selected Lord's Nta10ment.
Prioritize photography, filmmaking and booking inquiries.
`,
};

const OUTPUT_SCHEMA = {
    type: "object",

    additionalProperties: false,

    required: [
        "reply",
        "readyForConfirmation",
        "submissionType",
        "submission",
    ],

    properties: {
        reply: {
            type: "string",
        },

        readyForConfirmation: {
            type: "boolean",
        },

        submissionType: {
            type: "string",

            enum: [
                "none",
                "lords",
                "tea",
                "mowithmd",
            ],
        },

        submission: {
            type: "object",

            additionalProperties: false,

            required: [
                "name",
                "email",
                "phone",
                "eventType",
                "requestedDate",
                "location",
                "service",
                "coverageHours",
                "details",
                "topic",
                "whyItMatters",
                "perspective",
                "listenerValue",
                "social",
                "participation",
            ],

            properties: {
                name: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                email: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                phone: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                eventType: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                requestedDate: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                location: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                service: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                coverageHours: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                details: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                topic: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                whyItMatters: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                perspective: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                listenerValue: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                social: {
                    type: [
                        "string",
                        "null",
                    ],
                },

                participation: {
                    type: [
                        "string",
                        "null",
                    ],
                },
            },
        },
    },
};

function validJourney(
    value: unknown
): value is Journey {
    return (
        value === "general" ||
        value === "tea" ||
        value === "mowithmd" ||
        value === "lords"
    );
}

function cleanMessages(
    value: unknown
): ChatMessage[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (
                message
            ): message is ChatMessage => {
                if (
                    typeof message !==
                    "object" ||
                    message === null
                ) {
                    return false;
                }

                const item =
                    message as Partial<ChatMessage>;

                return (
                    (
                        item.role ===
                        "user" ||
                        item.role ===
                        "assistant"
                    ) &&
                    typeof item.content ===
                    "string" &&
                    item.content.trim()
                        .length > 0
                );
            }
        )
        .map((message) => ({
            role: message.role,

            content:
                message.content
                    .trim()
                    .slice(0, 4000),
        }))
        .slice(-18);
}

export async function POST(
    request: Request
) {
    try {
        const body =
            await request.json();

        const journey: Journey =
            validJourney(body?.journey)
                ? body.journey
                : "general";

        const messages =
            cleanMessages(
                body?.messages
            );

        if (!messages.length) {
            return NextResponse.json(
                {
                    error:
                        "A message is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const client =
            await getOpenAIClient();

        const lastUserMessage =
            [...messages]
                .reverse()
                .find(
                    (message) =>
                        message.role ===
                        "user"
                )?.content;

        if (lastUserMessage) {
            const moderation =
                await client.moderations.create(
                    {
                        model:
                            "omni-moderation-latest",

                        input:
                        lastUserMessage,
                    }
                );

            if (
                moderation.results[0]
                    ?.flagged
            ) {
                return NextResponse.json({
                    reply:
                        "I can't continue with that particular request, but I can still help with Lord's Nta10ment, Tea for Chat, MowithMD, or the rest of the website.",

                    readyForConfirmation:
                        false,

                    submissionType:
                        "none",

                    submission: null,
                });
            }
        }

        const response =
            await client.responses.create({
                model:
                    process.env
                        .OPENAI_MODEL ||
                    "gpt-5.6-luna",

                store: false,

                instructions: `
${BASE_INSTRUCTIONS}

CURRENT JOURNEY:

${JOURNEYS[journey]}
                `,

                input: messages.map(
                    (message) => ({
                        role:
                        message.role,

                        content:
                        message.content,
                    })
                ),

                text: {
                    format: {
                        type:
                            "json_schema",

                        name:
                            "md_companion_response",

                        strict: true,

                        schema:
                        OUTPUT_SCHEMA,
                    },
                },

                max_output_tokens: 900,
            });

        const output =
            response.output_text;

        if (!output) {
            throw new Error(
                "OpenAI returned an empty response."
            );
        }

        const parsed =
            JSON.parse(output);

        return NextResponse.json(
            parsed
        );
    } catch (error) {
        console.error(
            "MD Companion:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "The companion is temporarily unavailable.",
            },
            {
                status: 500,
            }
        );
    }
}