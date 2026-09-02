"use client";

import {
    AssistantPayload,
} from "./types";

type Props = {
    draft: AssistantPayload;

    submitting: boolean;

    submitted: boolean;

    error: string;

    onSubmit: () => void;
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

    service: "Coverage",

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

function titleFor(
    type:
    AssistantPayload[
        "submissionType"
        ]
) {
    if (type === "lords") {
        return "BOOKING REQUEST";
    }

    if (type === "tea") {
        return "TEA FOR CHAT PITCH";
    }

    if (type === "mowithmd") {
        return "MOWITHMD IDEA";
    }

    return "REQUEST";
}

export default function ConfirmationCard({
                                             draft,
                                             submitting,
                                             submitted,
                                             error,
                                             onSubmit,
                                         }: Props) {
    if (!draft.submission) {
        return null;
    }

    const fields =
        Object.entries(
            draft.submission
        ).filter(
            ([, value]) =>
                value !== null &&
                value !== ""
        );

    return (
        <section className="walk-confirm">
            <div className="walk-confirm-top">
                <span>
                    READY /
                    CONFIRMATION
                </span>

                <i />
            </div>

            <h3>
                {titleFor(
                    draft.submissionType
                )}
            </h3>

            <div className="walk-confirm-fields">
                {fields.map(
                    ([key, value]) => (
                        <div
                            key={key}
                            className="walk-confirm-row"
                        >
                            <span>
                                {LABELS[
                                    key
                                    ] || key}
                            </span>

                            <strong>
                                {value}
                            </strong>
                        </div>
                    )
                )}
            </div>

            {submitted ? (
                <div className="walk-confirm-success">
                    <span>✓</span>

                    <div>
                        <strong>
                            REQUEST
                            RECEIVED
                        </strong>

                        <p>
                            Your details
                            have been sent
                            for human
                            review.
                        </p>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className="walk-confirm-button"
                    data-cursor="CONFIRM"
                    disabled={
                        submitting
                    }
                    onClick={
                        onSubmit
                    }
                >
                    <span>
                        {submitting
                            ? "SENDING..."
                            : "CONFIRM & SEND"}
                    </span>

                    <strong>
                        ↗
                    </strong>
                </button>
            )}

            {error && (
                <p className="walk-confirm-error">
                    {error}
                </p>
            )}

            <small>
                Submitting this request
                does not confirm
                availability,
                acceptance or booking.
            </small>
        </section>
    );
}