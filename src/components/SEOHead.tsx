import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "Jokova - Book Sports Grounds & Find Professional Coaches",
  description = "Book sports grounds, find certified sports professionals, and join events. Jokova is your one-stop platform for all sports activities.",
  keywords = "sports, ground booking, sports professionals, coaches, sports events, fitness",
  canonicalUrl,
  ogImage = "/jokova_socialmedia_og.jpg",
  ogType = "website",
  structuredData,
}: SEOHeadProps) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const fullTitle = title.includes("Jokova") ? title : `${title} | Jokova`;

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Jokova" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Jokova" />
      <meta name="theme-color" content="#1f2937" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
