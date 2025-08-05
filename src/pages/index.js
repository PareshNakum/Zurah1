// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import { storeEntityId } from "@/Redux/action";
import Head from "next/head";

// app/page.js
export async function getServerSideProps() {
  const origin = "https://zurah1.vercel.app/";

  const response = await fetch("https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      prefer: origin,
    },
    body: JSON.stringify({
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    }),
  });

  const result = await response.json();
  const storeEntityIds = result?.success === 1 ? result?.data : {};

  return {
    props: {
      storeEntityIds,
      seoData: {
        title: storeEntityIds?.seo_titles || "Zurah Jewellery",
        description: storeEntityIds?.seo_description || "Elegant jewellery for all occasions",
        keywords: storeEntityIds?.seo_keyword || "Zurah, Jewellery",
        image: storeEntityIds?.preview_image,
        url: origin,
      },
    },
  };
}

export async function generateMetadata() {
  const origin = "https://zurah1.vercel.app/";

  const response = await fetch("https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      prefer: origin,
    },
    body: JSON.stringify({
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    }),
  });

  const result = await response.json();
  const storeEntityIds = result?.success === 1 ? result?.data : {};

  const previewImage = storeEntityIds?.preview_image?.startsWith("http")
    ? storeEntityIds?.preview_image
    : `${origin}/default-og.jpg`;

  return {
    title: storeEntityIds?.seo_titles || "Zurah Jewellery",
    description: storeEntityIds?.seo_description || "Elegant jewellery for all occasions",
    keywords: storeEntityIds?.seo_keyword || "Zurah, Jewellery",
    openGraph: {
      title: storeEntityIds?.seo_titles || "Zurah Jewellery",
      description: storeEntityIds?.seo_description,
      url: origin,
      images: [{ url: previewImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: storeEntityIds?.seo_titles,
      description: storeEntityIds?.seo_description,
      images: [previewImage],
    },
  };
}


export default function Page({ storeEntityIds, seoData }) {
  return (
    <>
      {/* <Head>
        <title>{seoData?.title}</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.keywords} />

        <meta property="og:title" content={seoData?.title} />
        <meta property="og:description" content={seoData?.description} />
        <meta property="og:image" content={seoData?.image} />
        <meta property="og:url" content={seoData?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData?.title} />
        <meta name="twitter:description" content={seoData?.description} />
        <meta name="twitter:image" content={seoData?.image} />
      </Head> */}

      <Homes entityData={storeEntityIds} />
    </>
  )
}
