// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const origin = context.req.headers.origin || `https://${context.req.headers.host}`;
  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi("/EmbeddedPageMaster", {
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    });

    const data = res?.data?.data || {};

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Default Description",
          keywords: data?.seo_keywords || "Zurah, Jewellery",
          image: data?.preview_image || "",
          url: origin,
        },
        entityData: data,
      },
    };
  } catch (err) {
    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Default Description",
          keywords: "Zurah, Jewellery",
          url: origin,
        },
        entityData: {},
      },
    };
  }
}



export default function Home({ seoData, entityData }) {
  console.log(seoData)
  const dispatch = useDispatch();

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      dispatch(storeEntityId(entityData));
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
