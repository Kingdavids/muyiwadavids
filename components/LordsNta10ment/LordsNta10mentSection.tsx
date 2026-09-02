"use client";

import Image from "next/image";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

type LordsNta10mentSectionProps = {
    images: string[];
};

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
        previousIndex,
        setPreviousIndex,
    ] = useState(0);

    const [
        transitioning,
        setTransitioning,
    ] = useState(false);

    useEffect(() => {
        if (
            safeImages.length <
            2
        ) {
            return;
        }

        const timer =
            window.setInterval(
                () => {
                    setPreviousIndex(
                        currentIndex
                    );

                    setTransitioning(
                        true
                    );

                    window.setTimeout(
                        () => {
                            let nextIndex =
                                currentIndex;

                            while (
                                nextIndex ===
                                currentIndex
                                ) {
                                nextIndex =
                                    Math.floor(
                                        Math.random() *
                                        safeImages.length
                                    );
                            }

                            setCurrentIndex(
                                nextIndex
                            );
                        },
                        260
                    );

                    window.setTimeout(
                        () => {
                            setTransitioning(
                                false
                            );
                        },
                        920
                    );
                },
                5200
            );

        return () =>
            window.clearInterval(
                timer
            );
    }, [
        currentIndex,
        safeImages.length,
    ]);

    if (!safeImages.length) {
        return null;
    }

    const currentImage =
        safeImages[
            currentIndex
            ];

    const previousImage =
        safeImages[
            previousIndex
            ];

    const displayNumber =
        String(
            currentIndex + 1
        ).padStart(2, "0");

    const totalNumber =
        String(
            safeImages.length
        ).padStart(2, "0");

    const selectSlide = (
        index: number
    ) => {
        if (
            index ===
            currentIndex
        ) {
            return;
        }

        setPreviousIndex(
            currentIndex
        );

        setTransitioning(
            true
        );

        window.setTimeout(
            () => {
                setCurrentIndex(
                    index
                );
            },
            220
        );

        window.setTimeout(
            () => {
                setTransitioning(
                    false
                );
            },
            880
        );
    };

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
                    <div className="lords-cinema-image lords-cinema-image-previous">
                        <Image
                            src={
                                previousImage
                            }
                            alt=""
                            fill
                            sizes="100vw"
                            priority={
                                previousIndex ===
                                0
                            }
                            className="lords-cinema-photo"
                        />
                    </div>

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

                    <div className="lords-cinema-slice lords-cinema-slice-left">
                        <Image
                            src={
                                currentImage
                            }
                            alt=""
                            fill
                            sizes="50vw"
                            className="lords-cinema-photo"
                        />
                    </div>

                    <div className="lords-cinema-slice lords-cinema-slice-right">
                        <Image
                            src={
                                currentImage
                            }
                            alt=""
                            fill
                            sizes="50vw"
                            className="lords-cinema-photo"
                        />
                    </div>

                    <div className="lords-cinema-vignette" />
                    <div className="lords-cinema-exposure" />
                    <div className="lords-cinema-scan" />

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
                            TORONTO +
                            BEYOND
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
                                TORONTO &
                                GTA
                            </span>

                            <i />

                            <span>
                                WEDDINGS
                            </span>

                            <i />

                            <span>
                                EVENTS
                            </span>

                            <i />

                            <span>
                                PORTRAITS
                            </span>

                            <i />

                            <span>
                                CINEMATIC
                                FILM
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
                                            selectSlide(
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