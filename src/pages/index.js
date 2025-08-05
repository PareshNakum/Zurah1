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

  // Return inside .then() by wrapping everything in a Promise
  return axios
    .post(
      "https://apiuat-ecom-store.upqor.com/api/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: origin,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin,
          prefer: origin,
        },
      }
    )
    .then((res) => {
      const success = res?.data?.success === 1;
      const data = res?.data?.data || {};

      return {
        props: {
          seoData: {
            title: success ? data?.seo_titles : "Zurah Jewellery",
            description: success
              ? data?.seo_description
              : "Elegant jewellery for all occasions",
            keywords: success
              ? data?.seo_keywords
              : "Zurah, Jewellery, Diamonds",
            image: success
              ? data?.preview_image
              : "https://zurah1.vercel.app/default-og.jpg",
            url: origin,
          },
          entityData: success ? data : {},
        },
      };
    })
    .catch((err) => {
      console.error("❌ Server-side fetch error:", err);
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
    });
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
