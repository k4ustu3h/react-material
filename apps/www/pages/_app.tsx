import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProps } from "next/app";
import DocsLayout from "@/components/layout/docs-layout";
import { ThemeProvider } from "react-material";
import SEO from "@/components/misc/seo";

const roboto = localFont({
  src: "./fonts/RobotoVF.ttf",
  variable: "--font-roboto",
});
const dmsans = localFont({
  src: "./fonts/DMSansVF.ttf",
  variable: "--font-dmsans",
});

// This metadata is for Next.js App Router, but we're using Pages Router with our custom SEO component
export const metadata: Metadata = {
  title: "React Material",
  description: "Modern Material Design components for React",
};

export default function Root({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <SEO />
      <main className={`${roboto.variable} ${dmsans.variable}`}>
        <DocsLayout>
          <Component {...pageProps} />
        </DocsLayout>
      </main>
    </ThemeProvider>
  );
}
