"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

/* =========================================================
   SITE LINKS
========================================================= */

const SITE = {
  media: "https://media.muyiwadavids.com",
  booking: "https://media.muyiwadavids.com/book",
  tech: "https://tech.muyiwadavids.com",
  podcast: "https://podcast.muyiwadavids.com",
  instagram: "https://www.instagram.com/lords_nta10ment",
  youtube: "https://www.youtube.com/@lordsnta10ment61",
  github: "https://github.com/Kingdavids",
};

/* =========================================================
   LORD'S NTA10MENT IMAGES
========================================================= */

const LORDS_IMAGES = [
  "/images/lords/lords-01.jpg",
  "/images/lords/lords-02.jpg",
  "/images/lords/lords-03.jpg",
  "/images/lords/lords-04.jpg",
  "/images/lords/lords-05.jpg",
  "/images/lords/lords-06.jpg",
  "/images/lords/lords-07.jpg",
  "/images/lords/lords-08.jpg",
  "/images/lords/lords-09.jpg",
  "/images/lords/lords-10.jpg",
  "/images/lords/lords-11.jpg",
  "/images/lords/lords-12.jpg",
  "/images/lords/lords-13.jpg",
  "/images/lords/lords-14.jpg",
  "/images/lords/lords-15.jpg",
  "/images/lords/lords-16.jpg",
  "/images/lords/lords-17.jpg",
  "/images/lords/lords-18.jpg",
  "/images/lords/lords-19.jpg",
];

/* =========================================================
   WORLD CARDS
========================================================= */

const WORLDS = [
  {
    number: "01",
    title: "MEDIA",
    kicker: "Lord's Nta10ment",
    description: "Photography • Film • Visual Stories",
    href: SITE.media,
    cursor: "CAMERA",
    className: "world-media",
  },
  {
    number: "02",
    title: "TECH",
    kicker: "Creative Technology",
    description: "Software • Cloud • Digital Experiences",
    href: SITE.tech,
    cursor: "CODE",
    className: "world-tech",
  },
  {
    number: "03",
    title: "PODCAST",
    kicker: "Ideas in conversation",
    description: "Stories • Perspectives • Conversations",
    href: SITE.podcast,
    cursor: "LISTEN",
    className: "world-podcast",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lordsRef = useRef<HTMLElement>(null);

  const [time, setTime] = useState("");
  const [cursorLabel, setCursorLabel] = useState("EXPLORE");
  const [showIntro, setShowIntro] = useState(true);

  const [lordImage, setLordImage] = useState(0);

  const [previousLordImage, setPreviousLordImage] =
      useState<number | null>(null);

  const [lordImageReady, setLordImageReady] =
      useState(false);

  const [lordsVisible, setLordsVisible] =
      useState(false);

  const [leavingSite, setLeavingSite] =
      useState(false);

  const [leavingLabel, setLeavingLabel] =
      useState("");

  /* =====================================================
     CLOCK
  ===================================================== */

  useEffect(() => {
    const updateTime = () => {
      setTime(
          new Intl.DateTimeFormat("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date())
      );
    };

    updateTime();

    const clock = window.setInterval(
        updateTime,
        1000
    );

    return () => {
      window.clearInterval(clock);
    };
  }, []);

  /* =====================================================
     INTRO
  ===================================================== */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setShowIntro(false);

      document.body.style.overflow = "";
    }, 1700);

    return () => {
      window.clearTimeout(timer);

      document.body.style.overflow = "";
    };
  }, []);

  /* =====================================================
     LORD'S SECTION VISIBILITY
  ===================================================== */

  useEffect(() => {
    const section = lordsRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
          setLordsVisible(
              entry.isIntersecting
          );
        },
        {
          rootMargin: "400px 0px",
          threshold: 0.01,
        }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =====================================================
     LORD'S AUTO SLIDESHOW
  ===================================================== */

  useEffect(() => {
    if (!lordsVisible) {
      return;
    }

    const slider = window.setTimeout(() => {
      setPreviousLordImage(lordImage);

      setLordImageReady(false);

      setLordImage(
          (lordImage + 1) %
          LORDS_IMAGES.length
      );
    }, 4500);

    return () => {
      window.clearTimeout(slider);
    };
  }, [lordImage, lordsVisible]);

  /* =====================================================
     REMOVE PREVIOUS IMAGE AFTER CROSSFADE
  ===================================================== */

  useEffect(() => {
    if (
        !lordImageReady ||
        previousLordImage === null
    ) {
      return;
    }

    const cleanup = window.setTimeout(() => {
      setPreviousLordImage(null);
    }, 1400);

    return () => {
      window.clearTimeout(cleanup);
    };
  }, [
    lordImageReady,
    previousLordImage,
  ]);

  /* =====================================================
     CUSTOM CURSOR POSITION
  ===================================================== */

  useEffect(() => {
    const moveCursor = (
        event: MouseEvent
    ) => {
      if (!cursorRef.current) {
        return;
      }

      cursorRef.current.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    window.addEventListener(
        "mousemove",
        moveCursor
    );

    return () => {
      window.removeEventListener(
          "mousemove",
          moveCursor
      );
    };
  }, []);

  /* =====================================================
    CUSTOM CURSOR LABELS
 ===================================================== */

  useEffect(() => {
    const items =
        document.querySelectorAll<HTMLElement>(
            "[data-cursor]"
        );

    const enterHandlers = new Map<
        HTMLElement,
        () => void
    >();

    const leaveHandlers = new Map<
        HTMLElement,
        () => void
    >();

    items.forEach((item) => {
      const enter = () => {
        setCursorLabel(
            item.dataset.cursor || "OPEN"
        );

        cursorRef.current?.classList.add(
            "cursor-active"
        );
      };

      const leave = () => {
        setCursorLabel("EXPLORE");

        cursorRef.current?.classList.remove(
            "cursor-active"
        );
      };

      enterHandlers.set(item, enter);
      leaveHandlers.set(item, leave);

      item.addEventListener(
          "mouseenter",
          enter
      );

      item.addEventListener(
          "mouseleave",
          leave
      );
    });

    return () => {
      items.forEach((item) => {
        const enter =
            enterHandlers.get(item);

        const leave =
            leaveHandlers.get(item);

        if (enter) {
          item.removeEventListener(
              "mouseenter",
              enter
          );
        }

        if (leave) {
          item.removeEventListener(
              "mouseleave",
              leave
          );
        }
      });
    };
  }, [showIntro]);


  /* =====================================================
     RESTORE LANDING PAGE AFTER BROWSER BACK
  ===================================================== */

  useEffect(() => {
    const restoreLandingPage = () => {
      setLeavingSite(false);
      setLeavingLabel("");

      document.body.style.overflow = "";
    };

    window.addEventListener(
        "pageshow",
        restoreLandingPage
    );

    return () => {
      window.removeEventListener(
          "pageshow",
          restoreLandingPage
      );
    };
  }, []);

  /* =====================================================
     WORLD CARD MOUSE TILT
  ===================================================== */

  const handleCardMove = (
      event: ReactMouseEvent<HTMLElement>
  ) => {
    const card = event.currentTarget;

    const rect =
        card.getBoundingClientRect();

    const x =
        event.clientX - rect.left;

    const y =
        event.clientY - rect.top;

    const rotateY =
        ((x - rect.width / 2) /
            rect.width) *
        5;

    const rotateX =
        -(
            (y - rect.height / 2) /
            rect.height
        ) * 5;

    card.style.setProperty(
        "--rx",
        `${rotateX}deg`
    );

    card.style.setProperty(
        "--ry",
        `${rotateY}deg`
    );

    card.style.setProperty(
        "--mx",
        `${x}px`
    );

    card.style.setProperty(
        "--my",
        `${y}px`
    );
  };

  const resetCard = (
      event: ReactMouseEvent<HTMLElement>
  ) => {
    event.currentTarget.style.setProperty(
        "--rx",
        "0deg"
    );

    event.currentTarget.style.setProperty(
        "--ry",
        "0deg"
    );
  };

  /* =====================================================
     LORD'S MANUAL SLIDE CHANGE
  ===================================================== */

  const changeLordImage = (
      index: number
  ) => {
    if (index === lordImage) {
      return;
    }

    setPreviousLordImage(lordImage);

    setLordImageReady(false);

    setLordImage(index);
  };

  const handleOutbound = (
      event: ReactMouseEvent<HTMLAnchorElement>,
      href: string,
      label: string
  ) => {
    if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    ) {
      return;
    }

    event.preventDefault();

    setLeavingLabel(label);
    setLeavingSite(true);

    window.setTimeout(() => {
      window.location.assign(href);
    }, 650);
  };

  return (
      <main className="landing">

        {leavingSite && (
            <div
                className="outbound-transition outbound-transition-active"
                aria-hidden="true"
            >
              <div className="outbound-grid" />

              <div className="outbound-scan" />

              <div className="outbound-content">
            <span>
                MD / TRANSFER SYSTEM
            </span>

                <strong>
                  {leavingLabel || "NEXT"}
                </strong>

                <p>
                  ENTERING CREATIVE WORLD
                </p>

                <div className="outbound-loader">
                  <i />
                </div>
              </div>
            </div>
        )}
        {/* =================================================
                INTRO
            ================================================= */}

        {showIntro && (
            <div className="intro-screen">
              <div className="intro-grid" />

              <div className="intro-noise" />

              <span className="intro-code">
                        MD / BUILD SYSTEM / 2026
                    </span>

              <div className="intro-center">
                        <span className="intro-mark">
                            MD.
                        </span>

                <p>
                  MEDIA
                  <i />
                  TECHNOLOGY
                  <i />
                  PODCAST
                </p>
              </div>

              <div className="intro-status">
                        <span>
                            BUILDING DIGITAL HOME
                        </span>

                <span>
                            INITIALIZING...
                        </span>
              </div>

              <div className="intro-loader">
                <span />
              </div>
            </div>
        )}

        {/* =================================================
                GLOBAL EFFECTS
            ================================================= */}

        <div className="page-grain" />

        <div
            ref={cursorRef}
            className="cursor"
        >
          <span>{cursorLabel}</span>
        </div>

        {/* =================================================
                NAVIGATION
            ================================================= */}

        <nav className="nav shell">
          <a
              href="#top"
              className="logo"
              data-cursor="HOME"
          >
            <strong>MD.</strong>

            <span>
                        MUYIWA

                        <small>
                            DAVIDS
                        </small>
                    </span>
          </a>

          <div className="nav-right">
            <div className="status">
              <i />

              BUILD IN PROGRESS
            </div>

            <span className="clock">
                        {time}
                    </span>

            <a
                href={SITE.booking}
                target="_blank"
                rel="noreferrer"
                className="nav-cta"
                data-cursor="BOOK"
            >
              BOOK ME ↗
            </a>
          </div>
        </nav>

        {/* =================================================
                HERO
            ================================================= */}

        <section
            id="top"
            className="hero shell"
        >
          <div className="hero-copy">
            <div className="hero-meta reveal r1">
                        <span>
                            CREATIVE TECHNOLOGIST
                        </span>

              <i />

              <span>
                            VISUAL STORYTELLER
                        </span>
            </div>

            <h1 className="reveal r2">
              Something
              <br />

              <em>
                remarkable
              </em>

              <br />

              is being built.
            </h1>

            <div className="hero-bottom reveal r3">
              <p>
                Media. Technology.
                Podcast.
                <br />

                One digital home by
                Muyiwa Davids.
              </p>

              <div className="hero-actions">
                <a
                    href="#worlds"
                    className="main-button"
                    data-cursor="EXPLORE"
                >
                  EXPLORE MY WORLD

                  <span>
                                    ↓
                                </span>
                </a>

                <a
                    href={SITE.booking}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-link"
                    data-cursor="BOOK"
                >
                  Book Lord&apos;s
                  Nta10ment ↗
                </a>
              </div>
            </div>
          </div>

          {/* =============================================
                    CONSTRUCTION PANEL
                ============================================= */}

          <div className="construction reveal r4">
            <div className="construction-grid" />

            <div className="construction-scan" />

            <div className="construction-top">
                        <span>
                            MD.SYSTEM
                        </span>

              <span>
                            SITE BUILD

                            <i />

                            ACTIVE
                        </span>
            </div>

            <div className="construction-stamp">
              <small>
                STATUS
              </small>

              <strong>
                UNDER
                <br />

                CONSTRUCTION
              </strong>

              <span>
                            EST. 2026
                        </span>
            </div>

            <div className="scaffold scaffold-one" />

            <div className="scaffold scaffold-two" />

            <div className="scaffold scaffold-three" />

            <div className="scaffold scaffold-four" />

            <div className="construction-orbit">
              <div className="orbit-ring orbit-a" />

              <div className="orbit-ring orbit-b" />

              <div className="orbit-ring orbit-c" />

              <div className="orbit-center">
                <strong>
                  MD
                </strong>

                <span>
                                BUILD
                            </span>
              </div>

              <span className="orbit-tag tag-media">
                            MEDIA
                        </span>

              <span className="orbit-tag tag-code">
                            CODE
                        </span>

              <span className="orbit-tag tag-film">
                            FILM
                        </span>

              <span className="orbit-tag tag-podcast">
                            AUDIO
                        </span>
            </div>

            <div className="build-data">
              <div>
                            <span>
                                UI
                            </span>

                <strong>
                  87%
                </strong>
              </div>

              <div>
                            <span>
                                MEDIA
                            </span>

                <strong>
                  74%
                </strong>
              </div>

              <div>
                            <span>
                                TECH
                            </span>

                <strong>
                  92%
                </strong>
              </div>
            </div>

            <div className="build-progress">
              <div>
                            <span>
                                BUILD PROGRESS
                            </span>

                <strong>
                  78%
                </strong>
              </div>

              <div className="progress-track">
                <span />
              </div>
            </div>

            <div className="construction-footer">
                        <span>
                            TORONTO / CANADA
                        </span>

              <span>
                            BUILDING IN PUBLIC
                        </span>
            </div>
          </div>
        </section>

        {/* =================================================
                CONSTRUCTION STRIP
            ================================================= */}

        <div className="caution-strip">
          <div>
                    <span>
                        UNDER CONSTRUCTION
                    </span>

            <i>{"///"}</i>

            <span>
                        CREATIVE SYSTEM ACTIVE
                    </span>

            <i>{"///"}</i>

            <span>
                        MEDIA
                    </span>

            <i>{"///"}</i>

            <span>
                        TECH
                    </span>

            <i>{"///"}</i>

            <span>
                        PODCAST
                    </span>

            <i>{"///"}</i>

            <span>
                        UNDER CONSTRUCTION
                    </span>

            <i>{"///"}</i>

            <span>
                        CREATIVE SYSTEM ACTIVE
                    </span>

            <i>{"///"}</i>

            <span>
                        MEDIA
                    </span>

            <i>{"///"}</i>

            <span>
                        TECH
                    </span>

            <i>{"///"}</i>

            <span>
                        PODCAST
                    </span>

            <i>{"///"}</i>
          </div>
        </div>

        {/* =================================================
                WORLDS
            ================================================= */}

        <section
            id="worlds"
            className="worlds shell"
        >
          <div className="section-head">
            <div>
                        <span>
                            01 / CHOOSE A WORLD
                        </span>

              <h2>
                Four sides.
                <br />

                <em>
                  One creator.
                </em>
              </h2>
            </div>

            <p>
              The main experience is
              being rebuilt. Everything
              important remains one
              click away.
            </p>
          </div>

          <div className="world-grid">
            {WORLDS.map((world) => (
                <article
                    key={world.title}
                    className={`world-card ${world.className}`}
                    onMouseMove={
                      handleCardMove
                    }
                    onMouseLeave={
                      resetCard
                    }
                >
                  <div className="card-light" />

                  {/* ================================
                                MEDIA ANIMATION
                            ================================ */}

                  {world.title === "MEDIA" && (
                      <div className="media-animation">
                        <div className="media-viewfinder-grid" />

                        <div className="camera-status">
            <span className="camera-rec">
                <i />
                REC
            </span>

                          <span>4K</span>
                        </div>

                        <div className="camera-target">
                          <div className="target-ring target-ring-outer" />

                          <div className="target-ring target-ring-middle" />

                          <div className="target-ring target-ring-inner" />

                          <span className="target-dot" />

                          <span className="target-axis target-axis-x" />

                          <span className="target-axis target-axis-y" />
                        </div>

                        <div className="focus-box">
                          <span className="focus-corner focus-tl" />
                          <span className="focus-corner focus-tr" />
                          <span className="focus-corner focus-bl" />
                          <span className="focus-corner focus-br" />

                          <span className="focus-label">
                AUTO FOCUS
            </span>
                        </div>

                        <div className="camera-aperture">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>

                        <div className="camera-focus-line" />

                        <div className="camera-lock">
                          <i />
                          SUBJECT LOCKED
                        </div>

                        <div className="camera-meta">
                          <span>1/250</span>
                          <span>F2.8</span>
                          <span>ISO 400</span>
                        </div>

                        <div className="camera-flash" />
                      </div>
                  )}

                  {/* ================================
                                TECH ANIMATION
                            ================================ */}

                  {world.title === "TECH" && (
                      <div className="tech-animation">
                        <div className="tech-grid" />

                        <div className="tech-terminal">
                          <div className="terminal-head">
                            <div>
                              <i />
                              <i />
                              <i />
                            </div>

                            <span>
                    muyiwa@creative-system
                </span>

                            <small>LIVE</small>
                          </div>

                          <div className="terminal-code">
                            <div className="code-line code-1">
                              <span className="code-number">01</span>

                              <code>
                                <b>const</b> creator ={" "}
                                <em>&quot;Muyiwa Davids&quot;</em>;
                              </code>
                            </div>

                            <div className="code-line code-2">
                              <span className="code-number">02</span>

                              <code>
                                <b>build</b>.
                                <span>experience</span>();
                              </code>
                            </div>

                            <div className="code-line code-3">
                              <span className="code-number">03</span>

                              <code>
                                cloud.
                                <span>deploy</span>(
                                <em>&quot;production&quot;</em>);
                              </code>
                            </div>

                            <div className="code-line code-4">
                              <span className="code-number">04</span>

                              <code>
                                media + software + ideas
                              </code>
                            </div>

                            <div className="code-line code-5">
                              <span className="code-number">05</span>

                              <code>
                                status:
                                <strong> online</strong>
                                <i className="code-cursor" />
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="tech-scan" />

                        <div className="tech-network">
                          <span className="network-node node-a" />
                          <span className="network-node node-b" />
                          <span className="network-node node-c" />
                          <span className="network-node node-d" />

                          <i className="network-line line-a" />
                          <i className="network-line line-b" />
                          <i className="network-line line-c" />
                        </div>

                        <div className="tech-deploy">
            <span>
                DEPLOYMENT
            </span>

                          <div>
                            <i />
                          </div>

                          <strong>
                            SUCCESS
                          </strong>
                        </div>
                      </div>
                  )}

                  {/* ================================
                                PODCAST ANIMATION
                            ================================ */}

                  {world.title ===
                      "PODCAST" && (
                          <div className="podcast-animation">
                                    <span className="on-air">
                                        ● ON AIR
                                    </span>

                            <div className="mic-ring">
                              <div className="mic-core">
                                <span />
                                <span />
                                <span />
                              </div>
                            </div>

                            <div className="wave">
                              {Array.from({
                                length: 20,
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
                                                `${index * 55}ms`,
                                          }}
                                      />
                                  )
                              )}
                            </div>
                          </div>
                      )}

                  <div className="world-top">
                                <span>
                                    {world.number}
                                </span>

                    <span>
                                    ↗
                                </span>
                  </div>

                  <div className="world-content">
                                <span>
                                    {world.kicker}
                                </span>

                    <h3>
                      {world.title}
                    </h3>

                    <p>
                      {
                        world.description
                      }
                    </p>
                  </div>

                  <a
                      href={world.href}
                      className="world-link"
                      data-cursor={world.cursor}
                      aria-label={`Open ${world.title}`}
                      onClick={(event) =>
                          handleOutbound(
                              event,
                              world.href,
                              world.title
                          )
                      }
                  />
                </article>
            ))}

            {/* =========================================
                        SOCIAL CARD
                    ========================================= */}

            <article
                className="world-card world-social"
                onMouseMove={
                  handleCardMove
                }
                onMouseLeave={
                  resetCard
                }
            >
              <div className="card-light" />

              <div className="world-top">
                            <span>
                                04
                            </span>

                <span>
                                ↗
                            </span>
              </div>

              <div className="social-animation">
                <div className="social-pulse pulse-one" />

                <div className="social-pulse pulse-two" />

                <div className="social-track social-track-one">
                  <span />
                </div>

                <div className="social-track social-track-two">
                  <span />
                </div>

                <div className="social-core">
                                <span>
                                    +
                                </span>
                </div>

                {/* INSTAGRAM */}

                <a
                    href={
                      SITE.instagram
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="social-node social-instagram"
                    data-cursor="FOLLOW"
                    aria-label="Open Instagram"
                >
                  <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                  >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="4"
                    />

                    <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        className="node-fill"
                    />
                  </svg>

                  <small>
                    IG
                  </small>
                </a>

                {/* YOUTUBE */}

                <a
                    href={
                      SITE.youtube
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="social-node social-youtube"
                    data-cursor="WATCH"
                    aria-label="Open YouTube"
                >
                  <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                  >
                    <path
                        d="M21 7.2C20.8 5.9 19.8 4.9 18.5 4.7C16.8 4.4 14.7 4.3 12 4.3C9.3 4.3 7.2 4.4 5.5 4.7C4.2 4.9 3.2 5.9 3 7.2C2.8 8.5 2.7 10.1 2.7 12C2.7 13.9 2.8 15.5 3 16.8C3.2 18.1 4.2 19.1 5.5 19.3C7.2 19.6 9.3 19.7 12 19.7C14.7 19.7 16.8 19.6 18.5 19.3C19.8 19.1 20.8 18.1 21 16.8C21.2 15.5 21.3 13.9 21.3 12C21.3 10.1 21.2 8.5 21 7.2Z"
                    />

                    <path
                        d="M10 8.7L15.5 12L10 15.3V8.7Z"
                        className="node-fill"
                    />
                  </svg>

                  <small>
                    YT
                  </small>
                </a>

                {/* GITHUB */}

                <a
                    href={
                      SITE.github
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="social-node social-github"
                    data-cursor="CODE"
                    aria-label="Open GitHub"
                >
                  <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                  >
                    <path
                        d="M12 2.8C6.9 2.8 2.8 6.9 2.8 12C2.8 16.1 5.4 19.5 9 20.7C9.5 20.8 9.7 20.5 9.7 20.2V18.4C7 19 6.4 17.3 6.4 17.3C6 16.2 5.3 15.9 5.3 15.9C4.4 15.3 5.4 15.3 5.4 15.3C6.4 15.4 6.9 16.3 6.9 16.3C7.8 17.8 9.2 17.4 9.8 17.1C9.9 16.4 10.2 15.9 10.5 15.6C8.3 15.4 6 14.5 6 10.8C6 9.7 6.4 8.9 7 8.2C6.9 8 6.6 7 7.1 5.7C7.1 5.7 7.9 5.4 9.8 6.7C10.5 6.5 11.3 6.4 12 6.4C12.7 6.4 13.5 6.5 14.2 6.7C16.1 5.4 16.9 5.7 16.9 5.7C17.4 7 17.1 8 17 8.2C17.6 8.9 18 9.7 18 10.8C18 14.5 15.7 15.4 13.5 15.6C13.9 15.9 14.2 16.6 14.2 17.6V20.2C14.2 20.5 14.5 20.8 15 20.7C18.6 19.5 21.2 16.1 21.2 12C21.2 6.9 17.1 2.8 12 2.8Z"
                    />
                  </svg>

                  <small>
                    GH
                  </small>
                </a>
              </div>

              <div className="world-content social-content">
                            <span>
                                Stay connected
                            </span>

                <h3>
                  SOCIAL
                </h3>

                <p>
                  Instagram •
                  YouTube • GitHub
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* =================================================
                LORD'S NTA10MENT
            ================================================= */}

        <section
            ref={lordsRef}
            className="lords shell"
        >
          <div className="lords-card">
            <div className="lords-slides">
              <div className="lords-image-placeholder">
                <span>LN</span>
              </div>

              {lordsVisible &&
                  previousLordImage !== null && (
                      <div
                          className={`
                            lords-image
                            lords-image-previous
                            ${
                              lordImageReady
                                  ? "lords-image-fade-out"
                                  : ""
                          }
                        `}
                      >
                        <Image
                            src={
                              LORDS_IMAGES[
                                  previousLordImage
                                  ]
                            }
                            alt=""
                            fill
                            quality={78}
                            sizes="
                                (max-width: 760px) 100vw,
                                (max-width: 1500px) calc(100vw - 72px),
                                1420px
                            "
                            className="lords-photo"
                        />
                      </div>
                  )}

              {lordsVisible && (
                  <div
                      className={`
                        lords-image
                        lords-image-current
                        ${
                          lordImageReady
                              ? "lords-image-active"
                              : ""
                      }
                    `}
                  >
                    <Image
                        key={LORDS_IMAGES[lordImage]}
                        src={LORDS_IMAGES[lordImage]}
                        alt=""
                        fill
                        quality={78}
                        sizes="
                            (max-width: 760px) 100vw,
                            (max-width: 1500px) calc(100vw - 72px),
                            1420px
                        "
                        className="lords-photo"
                        onLoad={() => {
                          setLordImageReady(true);
                        }}
                    />
                  </div>
              )}
            </div>

            <div className="lords-overlay" />

            <div className="lords-film-lines" />

            <div className="lords-top">
            <span>
                02 / LORD&apos;S NTA10MENT
            </span>

              <span>
                TORONTO + BEYOND
            </span>
            </div>

            <div className="lords-counter">
              <strong>
                {String(
                    lordImage + 1
                ).padStart(2, "0")}
              </strong>

              <span>
                /{" "}
                {String(
                    LORDS_IMAGES.length
                ).padStart(2, "0")}
            </span>
            </div>

            <div className="lords-copy">
            <span>
                CREATIVE MEDIA HOUSE
            </span>

              <h2>
                Cinematic.
                <br />

                High End.
                <br />

                <em>
                  Classy.
                </em>
              </h2>

              <p>
                Toronto & GTA Weddings • Events •
                Portraits • Cinematic Film
              </p>
            </div>

            <div className="lords-dots">
              {LORDS_IMAGES.map((_, index) => (
                  <button
                      key={index}
                      type="button"
                      className={
                        lordImage === index
                            ? "active"
                            : ""
                      }
                      onClick={() =>
                          changeLordImage(index)
                      }
                      aria-label={`Show Lord's Nta10ment image ${
                          index + 1
                      }`}
                  />
              ))}
            </div>

            <a
                href={SITE.booking}
                target="_blank"
                rel="noreferrer"
                className="booking-circle"
                data-cursor="BOOK"
            >
              <span>BOOK ME</span>

              <strong>↗</strong>
            </a>
          </div>
        </section>

        {/* =================================================
                FOOTER
            ================================================= */}

        <footer className="footer shell">
          <a
              href="#top"
              className="footer-brand"
          >
            MD.
          </a>

          <div className="footer-links">
            <a
                href={SITE.media}
                target="_blank"
                rel="noreferrer"
            >
              Media
            </a>

            <a
                href={SITE.tech}
                target="_blank"
                rel="noreferrer"
            >
              Tech
            </a>

            <a
                href={SITE.podcast}
                target="_blank"
                rel="noreferrer"
            >
              Podcast
            </a>

            <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
            >
              Instagram
            </a>

            <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer"
            >
              YouTube
            </a>

            <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
            >
              GitHub
            </a>
          </div>

          <span className="copyright">
                    ©{" "}
            {new Date().getFullYear()}{" "}
            MUYIWA DAVIDS
                </span>
        </footer>
      </main>
  );
}