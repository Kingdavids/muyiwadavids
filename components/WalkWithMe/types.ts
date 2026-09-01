export type SubmissionType =
    | "none"
    | "lords"
    | "tea"
    | "mowithmd";

export type SubmissionData = {
    name: string | null;
    email: string | null;
    phone: string | null;

    eventType: string | null;
    requestedDate: string | null;
    location: string | null;
    service: string | null;
    coverageHours: string | null;
    details: string | null;

    topic: string | null;
    whyItMatters: string | null;
    perspective: string | null;
    listenerValue: string | null;
    social: string | null;
    participation: string | null;
};

export type AssistantPayload = {
    reply: string;

    readyForConfirmation:
        boolean;

    submissionType:
        SubmissionType;

    submission:
        SubmissionData | null;
};