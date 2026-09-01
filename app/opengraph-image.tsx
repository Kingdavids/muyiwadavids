import { ImageResponse } from "next/og";

export const alt =
    "Muyiwa Davids — Media, Technology and Podcast";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",

                    display: "flex",
                    flexDirection: "column",

                    justifyContent: "space-between",

                    padding: "60px 70px",

                    background:
                        "radial-gradient(circle at 85% 15%, #361a16 0%, #090a0b 38%, #090a0b 100%)",

                    color: "#f4f0e8",

                    fontFamily:
                        "Arial, Helvetica, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",

                        fontSize: 18,

                        letterSpacing: "0.18em",

                        color: "#8f918d",
                    }}
                >
                    <span>MUYIWA DAVIDS</span>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            color: "#f26b42",
                        }}
                    >
    <span
        style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#f26b42",
        }}
    />

                        <span>
        BUILD IN PROGRESS
    </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 700,

                            lineHeight: 0.92,

                            letterSpacing: "-0.06em",
                        }}
                    >
                        SOMETHING
                    </div>

                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 700,

                            lineHeight: 0.92,

                            letterSpacing: "-0.06em",

                            color: "#f26b42",
                        }}
                    >
                        REMARKABLE
                    </div>

                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 700,

                            lineHeight: 0.92,

                            letterSpacing: "-0.06em",
                        }}
                    >
                        IS BEING BUILT.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: 16,

                            fontSize: 17,

                            letterSpacing: "0.13em",

                            color: "#a2a39f",
                        }}
                    >
                        <span>MEDIA</span>
                        <span>•</span>
                        <span>TECHNOLOGY</span>
                        <span>•</span>
                        <span>PODCAST</span>
                    </div>

                    <div
                        style={{
                            fontSize: 42,
                            fontWeight: 800,

                            letterSpacing: "-0.06em",
                        }}
                    >
                        MD.
                    </div>
                </div>
            </div>
        ),
        size
    );
}