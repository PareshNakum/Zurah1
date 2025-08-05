// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";
import axios from "axios";

export async function getServerSideProps(context) {

 try {
    const res = await axios.post(
      "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: "https://zurah1.vercel.app/",
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: "https://zurah1.vercel.app/",
        },
      }
    );

    const data = res?.data?.data || {};

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Default Description",
          keywords: data?.seo_keywords || "Zurah, Jewellery",
          url: "https://zurah1.vercel.app/",
        },
        entityData: data
      }
    };
  } catch (error) {
    console.error("❌ SEO fetch failed:", error.message);
    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Default Description",
          keywords: "Zurah, Jewellery",
          url: "https://zurah1.vercel.app/",
        },
        entityData: {},
      }
    };
  }
}


export default function Home({ seoData, entityData }) {
  const dispatch = useDispatch();
console.log(seoData)
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
