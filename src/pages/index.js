// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const { req } = context;
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const fullUrl = `${protocol}://${host}`;

  const subdomain = host.split(".")[0];
  let domain = fullUrl;

  // Setup your API URL
  const apiUrl = "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster";

  let seoData = {};
  let entityData = null;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        a: "GetStoreData",
        store_domain: domain,
      }),
    });

    const json = await res.json();
    const data = json?.data || {};

    entityData = data;

    seoData = {
      title: data?.seo_titles || "Zurah Jewellery",
      description: data?.seo_description || "Elegant fine jewellery for all occasions.",
      keywords: data?.seo_keywords || "Zurah, Jewellery, Diamonds",
      image: data?.preview_image || "https://zurah1.vercel.app/default-og.jpg",
      url: domain,
    };
  } catch (error) {
    console.error("SEO fetch error:", error);
  }

  return {
    props: {
      seoData,
      entityData,
    },
  };
}

export default function HomePage({ seoData, entityData }) {
  return (
    <>
      <Seo {...seoData} />
      <Homes entityData={entityData} />
    </>
  );
}
