// components/SEO/seo.js
import Head from "next/head";

const Seo = ({ title, description, keywords, image, url, type = "website", noIndex = false }) => {
  const canonicalUrl = url || "https://zurah1.vercel.app/";
 const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: canonicalUrl,  
    image: [image],
  };

  return (
    <Head>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default Seo;
