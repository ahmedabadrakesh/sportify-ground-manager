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
  title = "Jokova - Redefining Sports Together | Find Sports Coaches, Events & Buy Sports Gear Online",
  description = "Jokova - Your all-in-one sports destination! Find and connect with certified coaches in Cricket, Football, Badminton, Tennis, Hockey, Kabaddi, and more. Shop 5000+ products across 50+ sports with top-quality gear for gym, fitness, cycling, hiking, trekking, and beyond. Stay updated with nearby events and join the action. With Jokova, you don’t just play sports – you live them.",
  keywords = "sports, sports professionals, coaches, sports events, fitness, Sports coaches in India, Find sports coach online, Connect with certified sports trainers, Sports events near me, Buy sports equipment online India, Sports gear online shopping, Cricket coach near me, Badminton coach in India, Football training online, Kabaddi trainers India, Gym and fitness accessories online, Trekking and hiking gear India, Cycling equipment online, Best sports coaching platform in India, One-stop shop for sports gear and coaching, How to find certified sports coaches online, Sports events and activities near me, Shop sports shoes and activewear online India",
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
