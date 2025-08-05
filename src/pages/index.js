// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import axios from "axios";

export async function getServerSideProps(context) {
  const { req } = context;

  // Get full domain (including subdomain)
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https'; 
  const fullDomain = `${protocol}://${host}`;

  try {
    const res = await axios.post(
      "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: fullDomain,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: fullDomain,
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
          url: fullDomain,
        },
        entityData: data,
      },
    };
  } catch (error) {
    console.error("❌ SEO fetch failed:", error.message);

    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Default Description",
          keywords: "Zurah, Jewellery",
          url: fullDomain,
        },
        entityData: {},
      },
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
