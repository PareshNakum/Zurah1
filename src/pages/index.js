// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";
import Head from "next/head";

export async function getServerSideProps(context) {
  const origin =
    context.req.headers.origin ||
    (context.req.headers.host
      ? `https://zurah1.vercel.app/`
      : "https://zurah1.vercel.app/");

  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: commanService.domain,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: commanService.domain,
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
          image: data?.preview_image || "",
          url: "https://zurah1.vercel.app/",
        },
        entityData: data,
      },
    };
  } catch (err) {
    console.error("❌ Server-side fetch error:", err);
    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Default Description",
          keywords: "Zurah, Jewellery",
          url: "https://zurah1.vercel.app/",
        },
        entityData: {},
      },
    };
  }
}


export default function Home({ seoData, entityData }) {
  const dispatch = useDispatch();

  useEffect(() => {
console.log(seoData)
    if (entityData && Object.keys(entityData).length > 0) {
      // dispatch(storeEntityId(entityData));
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }
  }, [dispatch, entityData]);

  return (
    <>
    <Head>
          <title>{title}</title>
          <meta name="description" content={description}></meta>
          <meta name="keywords" content={keywords}></meta>
          </Head>
      {/* <Seo
        title={seoData?.title}
        description={seoData?.description}
        keywords={seoData?.keywords}
        image={seoData?.image}
        url={seoData?.url}
      /> */}
      <Homes entityData={entityData} />
    </>
  );
}
