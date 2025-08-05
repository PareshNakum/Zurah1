// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { Commanservice } from "@/CommanService/commanService";

export async function generateMetadata({ params, searchParams }) {
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://zurah1.vercel.app/';
  const apiUrl = "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      a: "GetStoreData",
      store_domain: host,
    }),
  });

  const json = await res.json();
  const data = json?.data || {};

  return {
    title: data?.seo_titles || "Zurah Jewellery",
    description: data?.seo_description || "Elegant fine jewellery for all occasions.",
    keywords: data?.seo_keywords || "Zurah, Jewellery, Diamonds",
    openGraph: {
      images: [
        {
          url: data?.preview_image || "https://zurah1.vercel.app/default-og.jpg",
        },
      ],
      url: host,
    },
  };
}

export default function HomePage({ seoData, entityData }) {
  return (
    <>
      <Seo {...pageProps.seoData} />
      <Homes entityData={entityData} />
    </>
  );
}
