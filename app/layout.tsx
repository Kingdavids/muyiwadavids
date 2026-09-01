import type {
    Metadata,
    Viewport,
} from "next";

import {
    Syne,
    Space_Grotesk,
    IBM_Plex_Mono,
} from "next/font/google";

import "./globals.css";

const SITE_URL = "https://muyiwadavids.com";

const syne = Syne({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default:
            "Muyiwa Davids | Media, Technology & Podcast",
        template: "%s | Muyiwa Davids",
    },

    description:
        "The digital home of Muyiwa Davids — creative technologist, photographer, filmmaker and storyteller exploring media, software, cloud technology and podcasting from Toronto, Canada.",

    applicationName: "Muyiwa Davids",

    authors: [
        {
            name: "Muyiwa Davids",
            url: SITE_URL,
        },
    ],

    creator: "Muyiwa Davids",
    publisher: "Muyiwa Davids",

    category: "Media & Creative Technology",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        type: "website",

        locale: "en_CA",

        url: SITE_URL,

        siteName: "Muyiwa Davids",

        title:
            "Muyiwa Davids | Media, Technology & Podcast",

        description:
            "Media. Technology. Podcast. Explore the creative world of Muyiwa Davids — filmmaking, photography, software, cloud technology and storytelling.",
    },

    twitter: {
        card: "summary_large_image",

        title:
            "Muyiwa Davids | Media, Technology & Podcast",

        description:
            "Media. Technology. Podcast. The digital home of Muyiwa Davids.",
    },

    robots: {
        index: true,
        follow: true,

        googleBot: {
            index: true,
            follow: true,

            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    other: {
        "geo.region": "CA-ON",
        "geo.placename": "Toronto",
    },
};

export const viewport: Viewport = {
    themeColor: "#090a0b",
    colorScheme: "dark",
};

const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
        {
            "@type": "WebSite",

            "@id": `${SITE_URL}/#website`,

            url: SITE_URL,

            name: "Muyiwa Davids",

            description:
                "The digital home of Muyiwa Davids spanning media, creative technology and podcasting.",

            inLanguage: "en-CA",

            publisher: {
                "@id": `${SITE_URL}/#person`,
            },
        },

        {
            "@type": "ProfilePage",

            "@id": `${SITE_URL}/#profile`,

            url: SITE_URL,

            name: "Muyiwa Davids",

            isPartOf: {
                "@id": `${SITE_URL}/#website`,
            },

            mainEntity: {
                "@id": `${SITE_URL}/#person`,
            },
        },

        {
            "@type": "Person",

            "@id": `${SITE_URL}/#person`,

            name: "Muyiwa Davids",

            url: SITE_URL,

            description:
                "Creative technologist, photographer, filmmaker, visual storyteller and podcast creator based in Toronto, Canada.",

            sameAs: [
                "https://www.instagram.com/lords_nta10ment",
                "https://www.youtube.com/@lordsnta10ment61",
                "https://github.com/Kingdavids",
            ],

            knowsAbout: [
                "Photography",
                "Filmmaking",
                "Visual Storytelling",
                "Software Development",
                "Cloud Technology",
                "Creative Technology",
                "Podcasting",
            ],

            homeLocation: {
                "@type": "Place",
                name: "Toronto, Ontario, Canada",
            },
        },

        {
            "@type": "WebPage",

            "@id": `${SITE_URL}/#webpage`,

            url: SITE_URL,

            name:
                "Muyiwa Davids | Media, Technology & Podcast",

            isPartOf: {
                "@id": `${SITE_URL}/#website`,
            },

            about: {
                "@id": `${SITE_URL}/#person`,
            },

            inLanguage: "en-CA",
        },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-CA">
        <body
            className={`
                    ${syne.variable}
                    ${spaceGrotesk.variable}
                    ${plexMono.variable}
                `}
        >
        {children}

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                    structuredData
                ).replace(/</g, "\\u003c"),
            }}
        />
        </body>
        </html>
    );
}