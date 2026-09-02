"use client";

import {
    FormEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import ConfirmationCard from "./ConfirmationCard";
import type {
    AssistantPayload,
} from "./types";

type Journey =
    | "general"
    | "tea"
    | "mowithmd"
    | "lords";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const WELCOME =
    "Come along. Tell me what brought you here — or choose a direction and we'll take it from there.";

const JOURNEYS = [
    {
        id: "tea" as Journey,
        number: "01",
        title: "TEA FOR CHAT",
        subtitle:
            "Guest • Story • Conversation",
    },
    {
        id: "mowithmd" as Journey,
        number: "02",
        title: "MOWITHMD",
        subtitle:
            "Faith • Life • Purpose",
    },
    {
        id: "lords" as Journey,
        number: "03",
        title: "LORD'S NTA10MENT",
        subtitle:
            "Photography • Film • Booking",
    },
];

const JOURNEY_STARTERS: Record<
    Journey,
    string
> = {
    general:
        "Where are we heading?",

    tea:
        "Tea for Chat it is. Are you looking to be featured, suggest someone, or bring a conversation idea?",

    mowithmd:
        "Let's talk MowithMD. What's the faith or life conversation that's been on your mind?",

    lords:
        "Let's plan something worth remembering. What are we capturing — a wedding, event, portrait session, film project, or something else?",
};

function messageId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

export default function WalkWithMe() {
    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const inputRef =
        useRef<HTMLTextAreaElement>(
            null
        );

    const [open, setOpen] =
        useState(false);

    const [journey, setJourney] =
        useState<Journey>("general");

    const [input, setInput] =
        useState("");

    const [thinking, setThinking] =
        useState(false);

    const [messages, setMessages] =
        useState<Message[]>([
            {
                id: "welcome",
                role: "assistant",
                content: WELCOME,
            },
        ]);

    const [draft, setDraft] =
        useState<AssistantPayload | null>(
            null
        );

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        submitted,
        setSubmitted,
    ] = useState(false);

    const [
        submissionError,
        setSubmissionError,
    ] = useState("");

    const beginJourney =
        useCallback(
            (nextJourney: Journey) => {
                setJourney(nextJourney);
                setDraft(null);
                setSubmitted(false);
                setSubmissionError("");
                setOpen(true);

                setMessages(
                    (current) => {
                        const starter =
                            JOURNEY_STARTERS[
                                nextJourney
                                ];

                        const last =
                            current[
                            current.length - 1
                                ];

                        if (
                            last?.role ===
                            "assistant" &&
                            last.content ===
                            starter
                        ) {
                            return current;
                        }

                        return [
                            ...current,
                            {
                                id: messageId(),
                                role:
                                    "assistant",
                                content:
                                starter,
                            },
                        ];
                    }
                );

                window.setTimeout(
                    () => {
                        inputRef.current?.focus();
                    },
                    250
                );
            },
            []
        );

    useEffect(() => {
        const handleJourneyClick = (
            event: MouseEvent
        ) => {
            const element = (
                event.target as HTMLElement
            ).closest<HTMLElement>(
                "[data-walk-mode]"
            );

            if (!element) {
                return;
            }

            event.preventDefault();

            const requested =
                element.dataset
                    .walkMode as Journey;

            if (
                requested === "tea" ||
                requested ===
                "mowithmd" ||
                requested === "lords" ||
                requested === "general"
            ) {
                beginJourney(
                    requested
                );
            }
        };

        document.addEventListener(
            "click",
            handleJourneyClick
        );

        return () => {
            document.removeEventListener(
                "click",
                handleJourneyClick
            );
        };
    }, [beginJourney]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (
            event: globalThis.KeyboardEvent
        ) => {
            if (
                event.key === "Escape"
            ) {
                setOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [messages, thinking, draft, submitted]);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (
            window.matchMedia(
                "(max-width: 760px)"
            ).matches
        ) {
            const previous =
                document.body.style
                    .overflow;

            document.body.style.overflow =
                "hidden";

            return () => {
                document.body.style.overflow =
                    previous;
            };
        }
    }, [open]);

    const sendMessage = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const value = input.trim();

        if (!value || thinking) {
            return;
        }

        const userMessage: Message = {
            id: messageId(),
            role: "user",
            content: value,
        };

        const nextMessages = [
            ...messages,
            userMessage,
        ];

        setMessages(nextMessages);
        setInput("");
        setThinking(true);
        setDraft(null);
        setSubmitted(false);
        setSubmissionError("");

        try {
            const response =
                await fetch(
                    "/api/assistant",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                journey,
                                messages:
                                    nextMessages.map(
                                        (
                                            message
                                        ) => ({
                                            role:
                                            message.role,
                                            content:
                                            message.content,
                                        })
                                    ),
                            }
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Request failed"
                );
            }

            setMessages(
                (current) => [
                    ...current,
                    {
                        id:
                            messageId(),
                        role:
                            "assistant",
                        content:
                            data.reply ||
                            "Tell me a little more.",
                    },
                ]
            );

            if (
                data.readyForConfirmation &&
                data.submission &&
                data.submissionType !==
                "none"
            ) {
                setDraft(
                    data as AssistantPayload
                );
                setSubmitted(false);
                setSubmissionError("");
            } else {
                setDraft(null);
            }
        } catch (error) {
            console.error(error);

            setMessages(
                (current) => [
                    ...current,
                    {
                        id:
                            messageId(),
                        role:
                            "assistant",
                        content:
                            "I couldn't reach the companion service just now. Give me a moment and try again.",
                    },
                ]
            );
        } finally {
            setThinking(false);
        }
    };

    const submitDraft = async () => {
        if (
            !draft ||
            !draft.submission ||
            submitting ||
            submitted
        ) {
            return;
        }

        setSubmitting(true);
        setSubmissionError("");

        try {
            const response =
                await fetch(
                    "/api/leads",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            {
                                submissionType:
                                draft.submissionType,
                                submission:
                                draft.submission,
                                website: "",
                            }
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Unable to submit request."
                );
            }

            setSubmitted(true);

            setMessages(
                (current) => [
                    ...current,
                    {
                        id:
                            messageId(),
                        role:
                            "assistant",
                        content:
                            "Perfect — your request has been received for human review. Nothing is confirmed yet, but you've given us what we need to continue from here.",
                    },
                ]
            );
        } catch (error) {
            setSubmissionError(
                error instanceof Error
                    ? error.message
                    : "Unable to submit request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <>
            <button
                type="button"
                className="walk-launcher"
                onClick={() =>
                    beginJourney(
                        "general"
                    )
                }
                aria-label="Open Take a Walk With Me"
            >
                <span className="walk-launcher-orbit">
                    <i />
                    <i />
                    <i />

                    <strong>
                        MD
                    </strong>
                </span>

                <span className="walk-launcher-copy">
                    <small>
                        AI COMPANION
                    </small>

                    <strong>
                        TAKE A WALK
                    </strong>

                    <em>
                        WITH ME ↗
                    </em>
                </span>

                <span className="walk-online">
                    <i />
                </span>
            </button>

            <div
                className={`
                    walk-backdrop
                    ${
                    open
                        ? "walk-backdrop-open"
                        : ""
                }
                `}
                onClick={() =>
                    setOpen(false)
                }
                aria-hidden="true"
            />

            <aside
                id="walk-with-me"
                className={`
                    walk-panel
                    ${
                    open
                        ? "walk-panel-open"
                        : ""
                }
                `}
                aria-hidden={!open}
                aria-label="Take a Walk With Me"
            >
                <div className="walk-panel-grid" />

                <header className="walk-head">
                    <div className="walk-brand">
                        <div className="walk-mark">
                            MD.
                        </div>

                        <div>
                            <span>
                                COMPANION /
                                ONLINE
                            </span>

                            <strong>
                                Take a Walk
                                With Me
                            </strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="walk-close"
                        onClick={() =>
                            setOpen(
                                false
                            )
                        }
                        aria-label="Close companion"
                    >
                        <span />
                        <span />
                    </button>
                </header>

                <div className="walk-route">
                    <span>
                        CURRENT PATH
                    </span>

                    <strong>
                        {journey ===
                        "general"
                            ? "OPEN WALK"
                            : journey ===
                            "tea"
                                ? "TEA FOR CHAT"
                                : journey ===
                                "mowithmd"
                                    ? "MOWITHMD"
                                    : "LORD'S NTA10MENT"}
                    </strong>

                    <i />
                </div>

                <div className="walk-journeys">
                    {JOURNEYS.map(
                        (item) => (
                            <button
                                key={
                                    item.id
                                }
                                type="button"
                                className={
                                    journey ===
                                    item.id
                                        ? "walk-journey walk-journey-active"
                                        : "walk-journey"
                                }
                                onClick={() =>
                                    beginJourney(
                                        item.id
                                    )
                                }
                            >
                                <span>
                                    {
                                        item.number
                                    }
                                </span>

                                <div>
                                    <strong>
                                        {
                                            item.title
                                        }
                                    </strong>

                                    <small>
                                        {
                                            item.subtitle
                                        }
                                    </small>
                                </div>

                                <i>
                                    ↗
                                </i>
                            </button>
                        )
                    )}
                </div>

                <div
                    className="walk-messages"
                    aria-live="polite"
                >
                    {messages.map(
                        (message) => (
                            <div
                                key={
                                    message.id
                                }
                                className={`walk-message walk-message-${message.role}`}
                            >
                                <div className="walk-message-label">
                                    {message.role ===
                                    "assistant"
                                        ? "MD / COMPANION"
                                        : "YOU"}
                                </div>

                                <div className="walk-message-bubble">
                                    {
                                        message.content
                                    }
                                </div>
                            </div>
                        )
                    )}

                    {draft && (
                        <ConfirmationCard
                            draft={draft}
                            submitting={
                                submitting
                            }
                            submitted={
                                submitted
                            }
                            error={
                                submissionError
                            }
                            onSubmit={
                                submitDraft
                            }
                        />
                    )}

                    {thinking && (
                        <div className="walk-message walk-message-assistant">
                            <div className="walk-message-label">
                                MD /
                                COMPANION
                            </div>

                            <div className="walk-thinking">
                                <i />
                                <i />
                                <i />
                            </div>
                        </div>
                    )}

                    <div
                        ref={
                            messagesEndRef
                        }
                    />
                </div>

                <form
                    className="walk-composer"
                    onSubmit={
                        sendMessage
                    }
                >
                    <div className="walk-input-wrap">
                        <textarea

                            ref={
                                inputRef
                            }
                            value={
                                input
                            }
                            onChange={(
                                event
                            ) =>
                                setInput(
                                    event
                                        .target
                                        .value
                                )
                            }
                            onKeyDown={
                                handleInputKeyDown
                            }
                            rows={1}
                            maxLength={
                                2000
                            }
                            placeholder="What's on your mind?"
                            aria-label="Message MD Companion"

                        />

                        <span>
                            {input.length}
                            /2000
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="walk-send"
                        disabled={
                            thinking ||
                            !input.trim()
                        }
                    >
                        <span>
                            SEND
                        </span>

                        <strong>
                            ↗
                        </strong>
                    </button>
                </form>

                <footer className="walk-foot">
                    <span>
                        AI COMPANION
                    </span>

                    <i />

                    <span>
                        HUMAN CONFIRMATION
                        REQUIRED FOR
                        BOOKINGS
                    </span>
                </footer>
            </aside>
        </>
    );
}