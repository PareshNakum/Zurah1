import Head from "next/head";

const Seo = ({
  title = "Zurah Jewellery",
  description = "Default Description",
  keywords = "Zurah, Jewellery",
  image = "https://zurah1.vercel.app/default-og.jpg",
  url = "https://zurah1.vercel.app/",
  noIndex = false,
  type = "website",
}) => {
  const canonicalUrl = url || "https://zurah1.vercel.app/";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default Seo;
