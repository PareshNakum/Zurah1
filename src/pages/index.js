// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import { storeEntityId } from "@/Redux/action";

export async function getServerSideProps() {
  const origin = "https://zurah1.vercel.app/";

  const response = await fetch("https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      prefer: origin,
    },
    body: JSON.stringify({
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    }),
  });

  const result = await response.json();
  const storeEntityIds = result?.success === 1 ? result?.data : {};

  return {
    props: {
      storeEntityIds,
      seoData: {
        title: storeEntityIds?.seo_titles || "Zurah Jewellery",
        description: storeEntityIds?.seo_description || "Elegant jewellery for all occasions",
        keywords: storeEntityIds?.seo_keywords || "Zurah, Jewellery",
        image: storeEntityIds?.preview_image,
        url: origin,
      },
    },
  };
}

export default function Page({ storeEntityIds }) {
  return <Homes entityData={storeEntityIds} />;
}
