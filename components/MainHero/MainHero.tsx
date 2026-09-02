"use client";

import {
    MouseEvent,
    useRef,
} from "react";

export default function MainHero() {
    const visualRef =
        useRef<HTMLDivElement>(null);

    const handleMove = (
        event: MouseEvent<HTMLDivElement>
    ) => {
        const visual =
            visualRef.current;

        if (!visual) {
            return;
        }

        const rect =
            visual.getBoundingClientRect();

        const x =
            (event.clientX -
                rect.left) /
            rect.width;

        const y =
            (event.clientY -
                rect.top) /
            rect.height;

        visual.style.setProperty(
            "--hero-x",
            `${x * 100}%`
        );

        visual.style.setProperty(
            "--hero-y",
            `${y * 100}%`
        );

        visual.style.setProperty(
            "--hero-rotate-x",
            `${(0.5 - y) * 3.8}deg`
        );

        visual.style.setProperty(
            "--hero-rotate-y",
            `${(x - 0.5) * 5.4}deg`
        );
    };

    const resetVisual = () => {
        const visual =
            visualRef.current;

        if (!visual) {
            return;
        }

        visual.style.setProperty(
            "--hero-rotate-x",
            "0deg"
        );

        visual.style.setProperty(
            "--hero-rotate-y",
            "0deg"
        );
    };

    return (
        <section
            className="main-hero"
            id="home"
        >
            <div className="main-hero-noise" />
            <div className="main-hero-grid" />
            <div className="main-hero-ambient main-hero-ambient-one" />
            <div className="main-hero-ambient main-hero-ambient-two" />

            <div className="main-hero-shell">
                <div className="main-hero-copy">
                    <div className="main-hero-eyebrow">
                        <span>
                            MUYIWA DAVIDS
                        </span>

                        <i />

                        <span>
                            CREATIVE ECOSYSTEM
                        </span>
                    </div>

                    <h1 className="main-hero-title">
                        <span>
                            STORIES.
                        </span>

                        <span>
                            SYSTEMS.
                        </span>

                        <span className="main-hero-title-accent">
                            CONVERSATIONS.
                        </span>
                    </h1>

                    <p className="main-hero-description">
                        Media, technology
                        and meaningful
                        conversation —
                        one creative
                        ecosystem by
                        Muyiwa Davids.
                    </p>

                    <div className="main-hero-primary-line">
                        <a
                            href="#walk-with-me"
                            data-walk-mode="general"
                            data-cursor="WALK"
                            className="main-hero-walk"
                        >
                            <span>
                                TAKE A WALK
                                WITH ME
                            </span>

                            <strong>
                                ↗
                            </strong>
                        </a>

                        <a
                            href="#walk-with-me"
                            data-walk-mode="lords"
                            data-cursor="BOOK"
                            className="main-hero-book"
                        >
                            BOOK LORD&apos;S
                            NTA10MENT
                            <span>↗</span>
                        </a>
                    </div>

                    <div className="main-hero-footnote">
                        <span>
                            TORONTO /
                            CANADA
                        </span>

                        <i />

                        <span>
                            MEDIA
                        </span>

                        <i />

                        <span>
                            TECHNOLOGY
                        </span>

                        <i />

                        <span>
                            CONVERSATION
                        </span>
                    </div>
                </div>

                <div
                    ref={visualRef}
                    className="main-hero-visual"
                    onMouseMove={
                        handleMove
                    }
                    onMouseLeave={
                        resetVisual
                    }
                >
                    <div className="main-hero-visual-glow" />

                    <div className="main-hero-frame">
                        <div className="main-hero-frame-top">
                            <span>
                                MD.SYSTEM
                            </span>

                            <div>
                                <i />
                                LIVE
                            </div>
                        </div>

                        <div className="main-hero-side-index">
                            <span>01</span>
                            <span>02</span>
                            <span>03</span>
                        </div>

                        <div className="main-hero-world main-hero-world-media">
                            <div className="main-hero-world-label">
                                <span>
                                    MEDIA
                                </span>

                                <strong>
                                    CAPTURE
                                </strong>
                            </div>

                            <div className="main-hero-focus">
                                <span />
                                <span />
                                <span />
                                <span />

                                <div className="main-hero-focus-dot" />
                            </div>

                            <div className="main-hero-media-data">
                                <span>
                                    F2.8
                                </span>

                                <span>
                                    ISO 400
                                </span>

                                <span>
                                    1/125
                                </span>
                            </div>
                        </div>

                        <div className="main-hero-world main-hero-world-tech">
                            <div className="main-hero-world-label">
                                <span>
                                    TECHNOLOGY
                                </span>

                                <strong>
                                    BUILD
                                </strong>
                            </div>

                            <div className="main-hero-code">
                               <span>
    <em>const</em>{" "}
                                   vision =
                                   &quot;human&quot;;
</span>

                                <span>
    <em>const</em>{" "}
                                    systems =
                                    &quot;scalable&quot;;
</span>

                                <span>
                                    <em>
                                        return
                                    </em>{" "}
                                    experience;
                                </span>

                                <span className="main-hero-code-cursor">
                                    _
                                </span>
                            </div>

                            <div className="main-hero-nodes">
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                            </div>
                        </div>

                        <div className="main-hero-world main-hero-world-talk">
                            <div className="main-hero-world-label">
                                <span>
                                    CONVERSATION
                                </span>

                                <strong>
                                    CONNECT
                                </strong>
                            </div>

                            <div className="main-hero-wave">
                                {Array.from({
                                    length: 22,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <i
                                            key={
                                                index
                                            }
                                            style={{
                                                animationDelay:
                                                    `${index * 45}ms`,
                                            }}
                                        />
                                    )
                                )}
                            </div>

                            <div className="main-hero-onair">
                                <i />
                                ON AIR
                            </div>
                        </div>

                        <div className="main-hero-core">
                            <div className="main-hero-core-ring main-hero-core-ring-one" />
                            <div className="main-hero-core-ring main-hero-core-ring-two" />
                            <div className="main-hero-core-ring main-hero-core-ring-three" />

                            <div className="main-hero-surveillance">
                                <div className="main-hero-surveillance-beam" />
                                <div className="main-hero-surveillance-edge" />
                            </div>

                            <strong>
                                MD
                            </strong>

                            <span>
                                ONE CREATOR
                            </span>
                        </div>

                        <div className="main-hero-corner main-hero-corner-tl" />
                        <div className="main-hero-corner main-hero-corner-tr" />
                        <div className="main-hero-corner main-hero-corner-bl" />
                        <div className="main-hero-corner main-hero-corner-br" />

                        <div className="main-hero-radar-ring main-hero-radar-ring-one" />
                        <div className="main-hero-radar-ring main-hero-radar-ring-two" />

                        <div className="main-hero-scan" />
                    </div>

                    <div className="main-hero-visual-caption">
                        <span>
                            ONE MIND
                        </span>

                        <i />

                        <span>
                            MULTIPLE WORLDS
                        </span>
                    </div>
                </div>
            </div>

            <div className="main-hero-marquee">
                <div>
                    <span>MEDIA</span>
                    <i>✦</i>
                    <span>TECHNOLOGY</span>
                    <i>✦</i>
                    <span>PODCAST</span>
                    <i>✦</i>
                    <span>STORYTELLING</span>
                    <i>✦</i>
                    <span>FAITH</span>
                    <i>✦</i>
                    <span>CULTURE</span>
                    <i>✦</i>
                    <span>EXPERIENCE</span>
                    <i>✦</i>
                    <span>MEDIA</span>
                    <i>✦</i>
                    <span>TECHNOLOGY</span>
                    <i>✦</i>
                    <span>PODCAST</span>
                    <i>✦</i>
                </div>
            </div>
        </section>
    );
}
