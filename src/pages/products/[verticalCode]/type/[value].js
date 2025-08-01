// pages/products/[verticalCode]/type/[value].js
import React from "react";
import Seo from "@/components/SEO/seo";
import Jewellery from "@/components/Jewellery/Jewellery/jewellery";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const { verticalCode, value } = context.params;
  const origin = context.req?.headers?.host;
  const api = new Commanservice(origin);

  let storeEntityIds = {};
  let menuData = [];
  let matchedSeoData = null;

  try {
    // 🔹 1. Get store data
    const storeRes = await api.postApi("/EmbeddedPageMaster", {
      a: "GetStoreData",
      store_domain: api.domain,
      SITDeveloper: "1",
    });

    storeEntityIds = storeRes?.data?.data || {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    // 🔹 2. Get mega menu
    const menuRes = await api.postLaravelApi("/NavigationMegamenu", {
      SITDeveloper: "1",
      a: "GetHomeNavigation",
      store_id: storeEntityIds.mini_program_id,
      type: "B2C",
    });

    menuData = menuRes?.data?.data?.navigation_data || [];

    // 🔹 3. Flatten menu and match SEO data
    const flatMenu = [];
    const flattenMenu = (items) => {
      items.forEach((item) => {
        flatMenu.push(item);
        if (Array.isArray(item.child)) flattenMenu(item.child);
      });
    };
    flattenMenu(menuData);

    matchedSeoData = flatMenu.find(
      (item) =>
        item.menu_name.replaceAll(" ", "-").toLowerCase() ===
        verticalCode.toLowerCase()
    );
  } catch (err) {
    console.error("SSR Error:", err.message);
  }

  const seoData = {
    title: matchedSeoData?.seo_titles || "Zurah Jewellery",
    description: matchedSeoData?.seo_description || "",
    keywords: matchedSeoData?.seo_keyword || "",
    image: matchedSeoData?.image_preview || "",
    url: `${api.domain}/products/${verticalCode}/type/${value}`,
  };

  return {
    props: {
      seoData,
      entityData: {
        storeEntityIds,
        menuData,
        verticalCode,
        value,
      },
    },
  };
}

export default function JewelleryTypePage({ seoData, entityData }) {
  return (
    <>
      <Seo {...seoData} type="product" />
      <Jewellery
        storeEntityIds={entityData.storeEntityIds}
        verticalCode={entityData.verticalCode}
        typeFilter={entityData.value}
        menuData={entityData.menuData}
      />
    </>
  );
}
