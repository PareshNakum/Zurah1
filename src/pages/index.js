// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";

// app/page.tsx or app/page.js

export async function generateMetadata({ params, searchParams }) {
  const apiUrl = "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://zurah1.vercel.app";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        a: "GetStoreData",
        store_domain: domain,
        SITDeveloper: "1",
      }),
    });

    const json = await res.json();
    const data = json?.data?.data || {};

    return {
      title: data.seo_titles || "Zurah Jewellery",
      description: data.seo_description || "Elegant fine jewellery for all occasions.",
      keywords: data.seo_keywords || "Zurah, Jewellery, Diamonds",
      openGraph: {
        images: [
          {
            url: data.preview_image || "https://zurah1.vercel.app/default-og.jpg",
          },
        ],
        url: domain,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Zurah Jewellery",
      description: "Elegant fine jewellery for all occasions.",
    };
  }
}


export default function Home({ seoData, entityData }) {
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      // dispatch(storeEntityId(entityData));
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }
  }, [dispatch, entityData]);

  return (
    <>
      <Seo
        title={seoData?.title}
        description={seoData?.description}
        keywords={seoData?.keywords}
        image={seoData?.image}
        url={seoData?.url}
      />
      <Homes entityData={entityData} />
    </>
  );
}
