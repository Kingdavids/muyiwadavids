"use client";

import Image from "next/image";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type LordsNta10mentSectionProps = {
    images: string[];
};

type Testimonial = {
    quote: string;
    label: string;
};

const cities = [
    "Toronto, ON",
    "Brampton, ON",
    "Mississauga, ON",
    "Vaughan, ON",
    "Hamilton, ON",
    "Niagara, ON",
    "Ottawa, ON",
    "Windsor, ON",
    "Barrie, ON",
    "Sarnia, ON",
    "Kitchener, ON",
    "Greater Sudbury, ON",
    "Montreal, QC",
    "Laval, QC",
];

const testimonials: Testimonial[] = [
    {
        quote: "Awwn, that’s so cute. I just saw it — the bride loves the video too.",
        label: "Wedding Film",
    },
    {
        quote: "This picture is too fine.",
        label: "Portrait Client",
    },
    {
        quote: "Everything blends so beautifully.",
        label: "Event Client",
    },
    {
        quote: "Ah… one of my favorite pictures of all time.",
        label: "Client Note",
    },
    {
        quote: "Your work really shows.",
        label: "Client Note",
    },
    {
        quote: "Awww, it’s a beautiful video.",
        label: "Video Client",
    },
    {
        quote: "Thank you, boss. 💯",
        label: "Client Note",
    },
    {
        quote: "Sharp visuals. So stunning.",
        label: "Client Note",
    },
    {
        quote: "It feels like I want to do the wedding all over again. This is so beautiful.",
        label: "Wedding Client",
    },
    {
        quote: "World-best videographer/photographer on this.",
        label: "Client Note",
    },
    {
        quote: "Beautiful.",
        label: "Client Note",
    },
    {
        quote: "Ayiii… on peut être belles comme ça?",
        label: "Client Note",
    },
    {
        quote: "So classy and demure.",
        label: "Client Note",
    },
    {
        quote: "Sharp.",
        label: "Client Note",
    },
    {
        quote: "Thank you for capturing all these beautiful moments.",
        label: "Event Client",
    },
    {
        quote: "Steeeeeeeeeze!! I always look forward to your posts every weekend.",
        label: "Returning Viewer",
    },
    {
        quote: "The second slide… all are so beautiful.",
        label: "Client Note",
    },
    {
        quote: "Wow, amazing shots!",
        label: "Client Note",
    },
];

export default function LordsNta10mentSection({
                                                  images,
                                              }: LordsNta10mentSectionProps) {
    const safeImages =
        useMemo(
            () =>
                images.filter(
                    Boolean
                ),
            [images]
        );

    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(0);

    const [
        nextIndex,
        setNextIndex,
    ] = useState(0);

    const [
        transitioning,
        setTransitioning,
    ] = useState(false);

    const [
        cityIndex,
        setCityIndex,
    ] = useState(0);

    const [
        testimonialIndex,
        setTestimonialIndex,
    ] = useState(0);

    const [
        testimonialVisible,
        setTestimonialVisible,
    ] = useState(false);

    const currentIndexRef =
        useRef(0);

    const transitioningRef =
        useRef(false);

    const intervalRef =
        useRef<number | null>(
            null
        );

    const commitTimerRef =
        useRef<number | null>(
            null
        );

    const settleTimerRef =
        useRef<number | null>(
            null
        );

    const testimonialTimerRef =
        useRef<number | null>(
            null
        );

    const mountedRef =
        useRef(true);

    const transitionCountRef =
        useRef(0);

    useEffect(() => {
        currentIndexRef.current =
            currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        transitioningRef.current =
            transitioning;
    }, [transitioning]);

    const clearTransitionTimers =
        () => {
            if (
                commitTimerRef.current !==
                null
            ) {
                window.clearTimeout(
                    commitTimerRef.current
                );

                commitTimerRef.current =
                    null;
            }

            if (
                settleTimerRef.current !==
                null
            ) {
                window.clearTimeout(
                    settleTimerRef.current
                );

                settleTimerRef.current =
                    null;
            }

            if (
                testimonialTimerRef.current !==
                null
            ) {
                window.clearTimeout(
                    testimonialTimerRef.current
                );

                testimonialTimerRef.current =
                    null;
            }
        };

    const getRandomIndex = (
        length: number,
        excludeIndex: number
    ) => {
        if (length <= 1) {
            return excludeIndex;
        }

        let randomIndex =
            excludeIndex;

        while (
            randomIndex ===
            excludeIndex
            ) {
            randomIndex =
                Math.floor(
                    Math.random() *
                    length
                );
        }

        return randomIndex;
    };

    const preloadImage = (
        src: string
    ) =>
        new Promise<void>(
            (resolve) => {
                const image =
                    new window.Image();

                image.onload =
                    () =>
                        resolve();

                image.onerror =
                    () =>
                        resolve();

                image.src =
                    src;
            }
        );

    const updateEditorialData =
        () => {
            setCityIndex(
                (currentCity) =>
                    getRandomIndex(
                        cities.length,
                        currentCity
                    )
            );

            transitionCountRef.current +=
                1;

            if (
                transitionCountRef.current %
                3 ===
                0
            ) {
                setTestimonialIndex(
                    (
                        currentTestimonial
                    ) =>
                        getRandomIndex(
                            testimonials.length,
                            currentTestimonial
                        )
                );

                setTestimonialVisible(
                    true
                );

                testimonialTimerRef.current =
                    window.setTimeout(
                        () => {
                            if (
                                mountedRef.current
                            ) {
                                setTestimonialVisible(
                                    false
                                );
                            }
                        },
                        3500
                    );
            }
        };

    const startTransition =
        async (
            targetIndex?: number
        ) => {
            if (
                transitioningRef.current ||
                safeImages.length <
                2
            ) {
                return;
            }

            const activeIndex =
                currentIndexRef.current;

            const resolvedNext =
                typeof targetIndex ===
                "number"
                    ? targetIndex
                    : getRandomIndex(
                        safeImages.length,
                        activeIndex
                    );

            if (
                resolvedNext ===
                activeIndex
            ) {
                return;
            }

            transitioningRef.current =
                true;

            await preloadImage(
                safeImages[
                    resolvedNext
                    ]
            );

            if (!mountedRef.current) {
                return;
            }

            setNextIndex(
                resolvedNext
            );

            window.requestAnimationFrame(
                () => {
                    window.requestAnimationFrame(
                        () => {
                            if (
                                !mountedRef.current
                            ) {
                                return;
                            }

                            setTransitioning(
                                true
                            );
                        }
                    );
                }
            );

            clearTransitionTimers();

            commitTimerRef.current =
                window.setTimeout(
                    () => {
                        if (
                            !mountedRef.current
                        ) {
                            return;
                        }

                        currentIndexRef.current =
                            resolvedNext;

                        setCurrentIndex(
                            resolvedNext
                        );

                        updateEditorialData();
                    },
                    760
                );

            settleTimerRef.current =
                window.setTimeout(
                    () => {
                        if (
                            !mountedRef.current
                        ) {
                            return;
                        }

                        transitioningRef.current =
                            false;

                        setTransitioning(
                            false
                        );
                    },
                    940
                );
        };

    useEffect(() => {
        mountedRef.current =
            true;

        if (
            safeImages.length <
            2
        ) {
            return;
        }

        intervalRef.current =
            window.setInterval(
                () => {
                    void startTransition();
                },
                5600
            );

        return () => {
            if (
                intervalRef.current !==
                null
            ) {
                window.clearInterval(
                    intervalRef.current
                );

                intervalRef.current =
                    null;
            }
        };

        // Intentionally keep one stable interval.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeImages.length]);

    useEffect(() => {
        return () => {
            mountedRef.current =
                false;

            if (
                intervalRef.current !==
                null
            ) {
                window.clearInterval(
                    intervalRef.current
                );
            }

            clearTransitionTimers();
        };
    }, []);

    if (!safeImages.length) {
        return null;
    }

    const currentImage =
        safeImages[
            currentIndex
            ];

    const upcomingImage =
        safeImages[
            nextIndex
            ] ??
        currentImage;

    const displayNumber =
        String(
            currentIndex + 1
        ).padStart(2, "0");

    const totalNumber =
        String(
            safeImages.length
        ).padStart(2, "0");

    return (
        <section
            className={`lords-cinema ${
                transitioning
                    ? "lords-cinema-transitioning"
                    : ""
            }`}
            id="lords-nta10ment"
        >
            <div className="lords-cinema-noise" />

            <div className="lords-cinema-frame">
                <div className="lords-cinema-stage">
                    <div className="lords-cinema-image lords-cinema-image-current">
                        <Image
                            src={
                                currentImage
                            }
                            alt="Lord's Nta10ment cinematic photography"
                            fill
                            sizes="100vw"
                            priority={
                                currentIndex ===
                                0
                            }
                            className="lords-cinema-photo"
                        />
                    </div>

                    <div className="lords-cinema-image lords-cinema-image-next">
                        <Image
                            src={
                                upcomingImage
                            }
                            alt=""
                            fill
                            sizes="100vw"
                            className="lords-cinema-photo"
                        />
                    </div>

                    <div className="lords-cinema-vignette" />
                    <div className="lords-cinema-exposure" />
                    <div className="lords-cinema-scan" />

                    <div className="lords-cinema-location">
                        <span>
                            NOW FRAMING
                        </span>

                        <strong
                            key={
                                cities[
                                    cityIndex
                                    ]
                            }
                        >
                            {
                                cities[
                                    cityIndex
                                    ]
                            }
                        </strong>
                    </div>

                    <aside
                        className={`lords-cinema-testimonial ${
                            testimonialVisible
                                ? "lords-cinema-testimonial-visible"
                                : ""
                        }`}
                        aria-live="polite"
                    >
                        <span>
                            CLIENT NOTE /
                            {String(
                                testimonialIndex +
                                1
                            ).padStart(
                                2,
                                "0"
                            )}
                        </span>

                        <blockquote>
                            “
                            {
                                testimonials[
                                    testimonialIndex
                                    ].quote
                            }
                            ”
                        </blockquote>

                        <small>
                            {
                                testimonials[
                                    testimonialIndex
                                    ].label
                            }
                        </small>
                    </aside>

                    <div className="lords-cinema-crosshair">
                        <span />
                        <span />
                        <span />
                        <span />
                        <i />
                    </div>

                    <div className="lords-cinema-topbar">
                        <div>
                            <span>
                                02 /
                                LORD&apos;S
                                NTA10MENT
                            </span>

                            <i />

                            <span>
                                CREATIVE
                                MEDIA HOUSE
                            </span>
                        </div>

                        <div className="lords-cinema-rec">
                            <i />
                            REC
                        </div>
                    </div>

                    <div className="lords-cinema-copy">
                        <div className="lords-cinema-kicker">
                            ONTARIO +
                            QUEBEC
                        </div>

                        <h2>
                            <span>
                                CINEMATIC.
                            </span>

                            <span>
                                HIGH END.
                            </span>

                            <span>
                                CLASSY.
                            </span>
                        </h2>

                        <p>
                            Photography,
                            film and
                            storytelling
                            shaped with
                            intention.
                        </p>

                        <a
                            href="#walk-with-me"
                            data-walk-mode="lords"
                            data-cursor="BOOK"
                            className="lords-cinema-book"
                        >
                            BOOK
                            LORD&apos;S
                            NTA10MENT
                            <span>↗</span>
                        </a>
                    </div>

                    <div className="lords-cinema-bottom">
                        <div className="lords-cinema-counter">
                            <strong>
                                {
                                    displayNumber
                                }
                            </strong>

                            <span>
                                /
                                {
                                    totalNumber
                                }
                            </span>
                        </div>

                        <div className="lords-cinema-meta">
                            <span>
                                ONTARIO
                            </span>

                            <i />

                            <span>
                                MONTREAL
                            </span>

                            <i />

                            <span>
                                LAVAL
                            </span>

                            <i />

                            <span>
                                TRAVEL
                                AVAILABLE
                            </span>
                        </div>

                        <div className="lords-cinema-dots">
                            {safeImages.map(
                                (
                                    _,
                                    index
                                ) => (
                                    <button
                                        key={
                                            index
                                        }
                                        type="button"
                                        aria-label={`Show frame ${
                                            index +
                                            1
                                        }`}
                                        className={
                                            index ===
                                            currentIndex
                                                ? "lords-cinema-dot-active"
                                                : ""
                                        }
                                        onClick={() =>
                                            void startTransition(
                                                index
                                            )
                                        }
                                    >
                                        <span />
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="lords-cinema-film-edge lords-cinema-film-edge-left">
                        {Array.from({
                            length: 9,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <i
                                    key={
                                        index
                                    }
                                />
                            )
                        )}
                    </div>

                    <div className="lords-cinema-film-edge lords-cinema-film-edge-right">
                        {Array.from({
                            length: 9,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <i
                                    key={
                                        index
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
