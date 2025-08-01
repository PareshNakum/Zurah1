// components/Seo.js
import Head from "next/head";

const Seo = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
}) => {
  const fallbackImage = "https://rpdiamondsandjewellery-uat.s3.ap-southeast-1.amazonaws.com/writable/uploads/1003/510/BRD5100001/mini_program/1003_510_BRD5100001_mini_program_566913517528287565785.png";
  const canonicalUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://uat.zurahjewellery.com");

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: canonicalUrl,  
    image: [image || fallbackImage],
  };

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || fallbackImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || fallbackImage} />
      <meta property="twitter:url" content={canonicalUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default Seo;
