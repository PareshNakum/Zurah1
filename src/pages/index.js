import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import axios from "axios";

export async function getServerSideProps(context) {
  const origin =
    context.req.headers.origin ||
    (context.req.headers.host
      ? `https://${context.req.headers.host}`
      : "https://zurah1.vercel.app/");

  try {
    const res = await axios.post(
      "https://apiuat-ecom-store.upqor.com/api/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: "https://zurah1.vercel.app/",
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: "https://zurah1.vercel.app/",
          prefer: "https://zurah1.vercel.app/ ",
        },
      }
    );

    const data = res?.data?.data || {};

    // Log to debug SEO payload
    console.log("✅ SEO Data from API:", data);

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Elegant jewellery for all occasions",
          keywords: data?.seo_keywords || "Zurah, Jewellery, Diamonds",
          image: data?.preview_image || "https://zurah1.vercel.app/default-og.jpg",
          url: origin,
        },
        entityData: data,
      },
    };
  } catch (err) {
    console.error("❌ API error:", err.message || err);

    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Elegant jewellery for all occasions",
          keywords: "Zurah, Jewellery, Diamonds",
          image: "https://zurah1.vercel.app/default-og.jpg",
          url: origin,
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
      dispatch(storeEntityId(entityData));
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }
  }, [dispatch, entityData]);

  return (
    <>
      <Seo {...seoData} />
      <Homes entityData={entityData} />
    </>
  );
}
