// pages/products/[verticalCode].js
import Jewellery from "@/components/Jewellery/Jewellery/jewellery";
import Seo from "@/components/SEO/seo";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const { params, req } = context;
  const verticalCode = params?.verticalCode;

  const origin = req?.headers?.host;
  const api = new Commanservice(origin);

  let storeEntityIds = {};
  let menuData = [];
  let matchedSeoData = null;

  try {
    // 1️⃣ Get Store Data
    const storeRes = await api.postApi("/EmbeddedPageMaster", {
      a: "GetStoreData",
      store_domain: api.domain,
      SITDeveloper: "1",
    },{
      headers:{
        origin: api.domain
      }
    });
    storeEntityIds = storeRes?.data?.data || {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    // 2️⃣ Get Menu Navigation Data
    const menuRes = await api.postLaravelApi("/NavigationMegamenu", {
      SITDeveloper: "1",
      a: "GetHomeNavigation",
      store_id: storeEntityIds.mini_program_id,
      type: "B2C",
    });

    menuData = menuRes?.data?.data?.navigation_data || [];

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

  const seoData = {
    title: matchedSeoData?.seo_titles || "Zurah Jewellery",
    description: matchedSeoData?.seo_description || "",
    keywords: matchedSeoData?.seo_keyword || "",
    url: `${api.domain}/products/${verticalCode}`,
  };
  return {
    props: {
      seoData,
      entityData: {
        storeEntityIds,
        menuData,
        verticalCode,
      },
    },
  };
}

// ✅ Page Component
export default function ProductsPage({ seoData, entityData }) {
  return (
    <>
      <Seo
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        url={seoData.url}
        type="product"
      />
      <Jewellery
        storeEntityIds={entityData.storeEntityIds}
        verticalCode={entityData.verticalCode}
        menuData={entityData.menuData}
      />
    </>
  );
}
