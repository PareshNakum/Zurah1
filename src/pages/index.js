import Homes from "@/components/HomePage/Home/homes";

export async function generateMetadata() {
  const apiUrl = "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://zurah1.vercel.app/";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        a: "GetStoreData",
        store_domain: domain,
        SITDeveloper: "1",
      }),
    });

    const json = await res.json();
    const data = json?.data?.data || {};

    return {
      title: data.seo_titles || "Zurah Jewellery",
      description: data.seo_description || "Elegant fine jewellery for all occasions.",
      keywords: data.seo_keywords,
      openGraph: {
        images: [
          {
            url: data.preview_image || "https://zurah1.vercel.app/default-og.jpg",
          },
        ],
        url: domain,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Zurah Jewellery",
      description: "Elegant fine jewellery for all occasions.",
    };
  }
}

export default async function HomePage() {
  const apiUrl = "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://zurah1.vercel.app/";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      a: "GetStoreData",
      store_domain: domain,
      SITDeveloper: "1",
    }),
  });

  const json = await res.json();
  const entityData = json?.data?.data || {};

  return <Homes entityData={entityData} />;
}
