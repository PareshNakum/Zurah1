// app/page.js
import Homes from "@/components/HomePage/Home/homes";

// Fetch store data
async function fetchStoreData(origin) {
  try {
    const res = await fetch("https://apiuat-ecom-store.upqor.com/api/EmbeddedPageMaster", {
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
      cache: "no-store", // prevent static caching for fresh SEO
    });

    const result = await res.json();
    return result?.data || {};
  } catch (err) {
    console.error("❌ Metadata fetch error:", err);
    return {};
  }
}

// 🔍 Metadata API
export async function generateMetadata(_, parent) {
  const origin = "https://zurah1.vercel.app/"; // You could also pass this via config/env
  const data = await fetchStoreData(origin);

  const previousImages = (await parent)?.openGraph?.images || [];

  return {
    title: data?.seo_titles || "Zurah Jewellery",
    description: data?.seo_description || "Elegant jewellery for all occasions",
    keywords: data?.seo_keywords || "Zurah, Jewellery",
    openGraph: {
      title: data?.seo_titles || "Zurah Jewellery",
      description: data?.seo_description || "Elegant jewellery for all occasions",
      url: origin,
      images: [data?.preview_image || "https://zurah1.vercel.app/default-og.jpg", ...previousImages],
    },
  };
}

// 🏠 Page Component
export default async function Page() {
  const origin = "https://zurah1.vercel.app/";
  const entityData = await fetchStoreData(origin);

  return <Homes entityData={entityData} />;
}
