import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { PostsProvider } from "./(router)/community/posts/context";

export const metadata: Metadata = {
    metadataBase: new URL("https://sicklesense.vercel.app/"),
    title: "TwinCare — The Chronic Care Companion of the Future",
    description: "TwinCare is an all-in-one platform bridging the gap between you, your data, and better health outcomes for chronic care patients worldwide.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
        title: "TwinCare — The Chronic Care Companion of the Future",
        description: "TwinCare is an all-in-one platform bridging the gap between you, your data, and better health outcomes for chronic care patients worldwide.",
        images: [{ url: "/preview-light.png" }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <TRPCReactProvider>
                        <PostsProvider>{children}</PostsProvider>
                    </TRPCReactProvider>
                    <Toaster closeButton richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
