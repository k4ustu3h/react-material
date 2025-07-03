import Head from "next/head";
import { useRouter } from "next/router";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
}

const defaultDescription = "Material Design 3 Expressive Implementation in React";
const defaultKeywords = "react, material design, ui components, frontend, web development";
const defaultTitle = "React Material";
const siteName = "React Material";

export default function SEO({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
}: SEOProps) {
  const router = useRouter();
  const fullTitle = (title || defaultTitle) + ` - ${description}`;
  const currentUrl =
    canonicalUrl ||
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://material.miukyo.my.id"}${router.asPath}`;

  // Get the appropriate OG image URL based on the current page path
  const finalOgImage =
    "/og-images/" + (title || "home")?.toLowerCase().replace(/\s+/g, "-") + ".png";

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  );
}
