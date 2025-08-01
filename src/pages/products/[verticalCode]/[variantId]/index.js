// pages/products/[verticalCode]/[variantId].js

import { Commanservice } from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import SingleProductJewellery from "@/components/Jewellery/SingleProductJewellery/singleproductjewellery";
import Seo from "@/components/SEO/seo";
import axios from "axios";
import { Suspense } from "react";

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { verticalCode, variantId: variantSlug } = params;
  const variantId = variantSlug?.split("-").pop()?.toUpperCase();

  const origin = req?.headers?.host;
  const api = new Commanservice(origin);

  let storeEntityIds = {};

  // STEP 1: Get Store Data
  try {
    const storeRes = await api.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: api.domain,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: api.domain,
        },
      }
    );

    storeEntityIds = storeRes?.data?.data || {};
  } catch (err) {
    console.error("❌ Failed to fetch store data:", err.message);
    return { notFound: true };
  }

  if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
    return { notFound: true };
  }
  // STEP 2: Get item_id from variantId
  let item_id = null;
  try {
    const variantRes = await api.postApi(
      "/EmbeddedPageMaster",
      {
        SITDeveloper: "1",
        a: "getDynamicSearchParameter",
        calling: "1",
        default_variant_id: variantId,
        diamond_params: "[]",
        is_customize: "1",
        is_dc: "1",
        is_smc: "0",
        item_id: "",
        param: "[]",
        product_diy: "PRODUCT",
        secret_key: storeEntityIds.secret_key,
        src: "metal",
        stone_shape: "",
        tenant_id: storeEntityIds.tenant_id,
        variant_id: variantId,
      },
      {
        headers: {
          origin: api.domain,
        },
      }
    );

    item_id = variantRes?.data?.data?.item_id;
  } catch (err) {
    console.error("❌ Failed to fetch item_id:", err.message);
    return { notFound: true };
  }
  // STEP 3: Get product data (including SEO)
  let productData = {};
  try {
    const productRes = await api.postApi(
      "/EmbeddedPageMaster",
      {
        SITDeveloper: "1",
        a: "getStoreItemImageAndSpecificationDetails",
        entity_id: storeEntityIds.entity_id,
        extra_currency: storeEntityIds.store_currency,
        miniprogram_id: storeEntityIds.mini_program_id,
        origin: storeEntityIds.cmp_origin,
        extra_summary: "Yes",
        item_id: item_id,
        lang_id: 1,
        product_diy: "PRODUCT",
        secret_key: storeEntityIds.secret_key,
        store_type: "B2C",
        system_id: item_id,
        tenant_id: storeEntityIds.tenant_id,
        variant_unique_id: variantId,
      },
      {
        headers: {
          origin: api.domain,
        },
      }
    );
    productData = productRes?.data?.data[0] || {};
  } catch (err) {
    console.error("❌ Failed to fetch product data:", err.message);
    return { notFound: true };
  }

  return {
    props: {
      seoData: {
        title:
          productData?.seo_titles ||
          variantSlug?.split("pv")[0]?.replaceAll("-", " "),
        description: productData?.seo_description || "",
        keywords: productData?.seo_keyword || "Zurah, Jewellery",
        image: productData?.variant_data?.[0]?.image_urls?.[0] || "",
        url: `https://uat.zurahjewellery.com/products/${verticalCode}/${variantSlug}`,
      },
      entityData: productData,
    },
  };
}

// === PAGE ===
export default function ProductsDetailsPage({ seoData, entityData }) {
  return (
    <>
      <Seo
        title={seoData?.title}
        description={seoData?.description}
        keywords={seoData?.keywords}
        image={seoData?.image}
        url={seoData?.url}
        type="product"
      />
      <Suspense fallback={<Loader />}>
        <SingleProductJewellery seoData={seoData} entityData={entityData} />
      </Suspense>
    </>
  );
}
