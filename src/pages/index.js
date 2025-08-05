// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";

export async function getStaticProps() {
  // Use the deployed domain as origin during build
  const origin = "https://zurah1.vercel.app"; // <- Use your actual domain here
  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: origin,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin,
        },
      }
    );

    const data = res?.data?.data || {};

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Default description for Zurah",
          keywords: data?.seo_keywords || "zurah, jewellery",
          image: data?.preview_image || "",
          url: origin,
        },
        entityData: data,
      },
      revalidate: 60 * 60, // Optional: Rebuild every hour (ISR)
    };
  } catch (err) {
    console.error("❌ Static props fetch error:", err);
    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Fallback description for Zurah",
          keywords: "zurah, jewellery",
          url: origin,
        },
        entityData: {},
      },
    };
  }
}


export default function HomePage({ seoData, entityData }) {
  console.log(seoData)
  return (
    <>
      <Seo {...seoData} />
      <Homes entityData={entityData} />
    </>
  );
}
