import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Muyiwa Davids",
        short_name: "Muyiwa",

        description:
            "Media, technology, filmmaking, photography and podcasting by Muyiwa Davids.",

        start_url: "/",

        display: "standalone",

        background_color: "#090a0b",

        theme_color: "#090a0b",

        icons: [
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}