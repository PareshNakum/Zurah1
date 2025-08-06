// pages/products/[verticalCode]/[variantId].js

import { Commanservice } from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import SingleProductJewellery from "@/components/Jewellery/SingleProductJewellery/singleproductjewellery";
import Seo from "@/components/SEO/seo";
import axios from "axios";
import Head from "next/head";
import { Suspense } from "react";

export async function getServerSideProps(context) {
  const { params, req } = context;
  const { verticalCode, variantId: variantSlug } = params;
  const variantId = variantSlug?.split("-").pop()?.toUpperCase();
  const origin = "https://zurah1.vercel.app/";
  // const origin = req?.headers?.host;
  const api = new Commanservice(origin);

  let storeEntityIds = {};

  // STEP 1: Get Store Data
  try {
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
    storeEntityIds = result?.success === 1 ? result?.data : {};
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
    const variantRes = await fetch(
      "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin,
          prefer: origin,
        },
        body: JSON.stringify({
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
        }),
      }
    );
    const variantResData = await variantRes.json();
    item_id = variantResData?.data?.item_id;
  } catch (err) {
    console.error("❌ Failed to fetch item_id:", err.message);
    return { notFound: true };
  }
  // STEP 3: Get product data (including SEO)
  let productData = {};
  try {
    const productRes = await fetch(
      "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin,
          prefer: origin,
        },
        body: JSON.stringify({
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
        }),
      }
    );
    const productRess = await productRes.json();
    productData = productRess?.data[0] || {};
  } catch (err) {
    console.error("❌ Failed to fetch product data:", err.message);
    return { notFound: true };
  }
  const seoData = {
    title:
      productData?.seo_titles ||
      variantSlug?.split("pv")[0]?.replaceAll("-", " "),
    description: productData?.seo_description || "",
    keywords: productData?.seo_keyword || "",
    image: productData?.variant_data?.[0]?.image_urls?.[0] || "",
    url: `https://zurah1.vercel.app//products/${verticalCode}/${variantSlug}`,
  };
  return {
    props: {
      seoData,
      entityData: storeEntityIds,
    },
  };
}

// === PAGE ===
export default function ProductsDetailsPage({ seoData, entityData }) {
  return (
    <>
      <Head>
        <title>{seoData?.title}</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.keywords} />

        <meta property="og:title" content={seoData?.title} />
        <meta property="og:description" content={seoData?.description} />
        <meta property="og:image" content={seoData?.image} />
        <meta property="og:url" content={seoData?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData?.title} />
        <meta name="twitter:description" content={seoData?.description} />
        <meta name="twitter:image" content={seoData?.image} />
      </Head>
      <SingleProductJewellery seoData={seoData} entityData={entityData} />
    </>
  );
}
