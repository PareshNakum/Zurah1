// pages/products/[verticalCode].js
import Jewellery from "@/components/Jewellery/Jewellery/jewellery";
import Seo from "@/components/SEO/seo";
import { Commanservice, domain } from "@/CommanService/commanService";
import Head from "next/head";

export async function getServerSideProps(context) {
  const { params, req } = context;
  const verticalCode = params?.verticalCode;
  // const origin = req?.headers?.host;
  const origin = "https://zurah1.vercel.app/";
  const api = new Commanservice(origin);
  let storeEntityIds = {};
  let menuData = [];
  let matchedSeoData = null;

  try {
    // 1️⃣ Get Store Data

    const response = await fetch(
      "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
      {
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
      }
    );
    const result = await response.json();
    const storeEntityIds = result?.success === 1 ? result?.data : {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    // 2️⃣ Get Menu Navigation Data
    const menuRes = await fetch(
      "https://apiuat-ecom.upqor.com/api/call/NavigationMegamenu",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin,
          prefer: origin,
        },
        body: JSON.stringify({
          SITDeveloper: "1",
          a: "GetHomeNavigation",
          store_id: storeEntityIds.mini_program_id,
          type: "B2C",
        }),
      }
    );
    const menuDatas = await menuRes.json();
    menuData = menuDatas?.data?.navigation_data || [];

    // 3️⃣ Flatten & Match SEO item
    const flatMenu = [];

    function flattenMenu(items) {
      items.forEach((item) => {
        flatMenu.push(item);
        if (Array.isArray(item.child)) flattenMenu(item.child);
      });
    }

    flattenMenu(menuData);

    matchedSeoData = flatMenu.find(
      (item) =>
        item.menu_name.replaceAll(" ", "-").toLowerCase() ===
        verticalCode.toLowerCase()
    );
  } catch (error) {
    console.error("SSR Error:", error.message);
  }

  const seoDataMenu = {
    title: matchedSeoData?.seo_titles || "Zurah Jewellery",
    description: matchedSeoData?.seo_description || "",
    keywords: matchedSeoData?.seo_keyword || "",
    url: `${api.domain}/products/${verticalCode}`,
  };
  return {
    props: {
      seoDataMenu,
      entityData: {
        storeEntityIds,
        seoDataMenu,
        verticalCode,
      },
    },
  };
}

// ✅ Page Component
export default function ProductsPage({ seoDataMenu, entityData }) {
  return (
    <>
      <Head>
        <title>{seoDataMenu?.title}</title>
        <meta name="description" content={seoDataMenu?.description} />
        <meta name="keywords" content={seoDataMenu?.keywords} />

        <meta property="og:title" content={seoDataMenu?.title} />
        <meta property="og:description" content={seoDataMenu?.description} />
        <meta property="og:image" content={seoDataMenu?.image} />
        <meta property="og:url" content={seoDataMenu?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoDataMenu?.title} />
        <meta name="twitter:description" content={seoDataMenu?.description} />
        <meta name="twitter:image" content={seoDataMenu?.image} />
      </Head>
      <Jewellery
        storeEntityIds={entityData.storeEntityIds}
        verticalCode={entityData.verticalCode}
        menuData={entityData.menuData}
      />
    </>
  );
}
