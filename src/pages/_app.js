// pages/_app.js
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  Suspense,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import App from "next/app"; // ✅ Import base App to avoid recursive getInitialProps

import { wrapper } from "@/Redux/wrapper";
import { storeCurrency, storeEntityId } from "@/Redux/action";

import Loader from "@/CommanUIComp/Loader/Loader";
import Footer from "@/components/HeaderFooter/Footer/footer";
import Seo from "@/components/SEO/seo";

// CSS Imports
import "swiper/css";
import "swiper/css/navigation";
import "@/Assets/css/bootstrap.min.css";
import "@/styles/globals.scss";
import "@/styles/icon.scss";
import "@/Assets/css/animate.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-inner-image-zoom/lib/styles.min.css";

// Constants
const STORE_DOMAIN = "https://zurah1.vercel.app/";
const MAX_RETRY_ATTEMPTS = 3;

// Dynamic imports
const Header = dynamic(() => import("@/components/HeaderFooter/Header/header"), { ssr: false });

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const storeEntityIds = useSelector((state) => state?.storeEntityId || {});
  const [loaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  const isStoreDataValid = useMemo(() => storeEntityIds?.tenant_id, [storeEntityIds]);

  const safeDispatch = useCallback((action) => {
    if (typeof dispatch === "function") {
      try {
        dispatch(action);
      } catch (error) {
        console.error("Dispatch error:", error);
      }
    }
  }, [dispatch]);

  const getStoreData = useCallback(async (attempt = 1) => {
    try {
      const payload = {
        a: "GetStoreData",
        store_domain: STORE_DOMAIN,
        SITDeveloper: "1",
      };

      const response = await fetch("https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          STORE_DOMAIN,
          prefer: STORE_DOMAIN,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const data = result?.data?.data;

      if (result?.success === 1 && data?.tenant_id) {
        safeDispatch(storeEntityId(data));
        safeDispatch(storeCurrency(data?.store_currency || "USD"));
        sessionStorage.setItem("storeData", JSON.stringify(data));
        setLoaded(true);
        setRetryCount(0);
      } else {
        throw new Error("Invalid store data");
      }
    } catch (err) {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        setRetryCount(attempt);
        setTimeout(() => getStoreData(attempt + 1), 1000 * 2 ** (attempt - 1));
      } else {
        console.error("Store data load failed:", err);
        setError(err.message);
        sessionStorage.setItem("storeData", "false");
        setLoaded(true);
      }
    }
  }, [safeDispatch]);

  useEffect(() => {
    let isMounted = true;

    const initializeStoreData = async () => {
      if (typeof window === "undefined") return;

      const cached = sessionStorage.getItem("storeData");

      if (cached && cached !== "false") {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.tenant_id) {
            safeDispatch(storeEntityId(parsed));
            safeDispatch(storeCurrency(parsed?.store_currency || "USD"));
            if (isMounted) setLoaded(true);
            return;
          }
        } catch {
          sessionStorage.removeItem("storeData");
        }
      }

      if (pageProps?.storeEntityIds?.tenant_id) {
        safeDispatch(storeEntityId(pageProps.storeEntityIds));
        safeDispatch(storeCurrency(pageProps.storeEntityIds?.store_currency || "USD"));
        sessionStorage.setItem("storeData", JSON.stringify(pageProps.storeEntityIds));
        if (isMounted) setLoaded(true);
        return;
      }

      if (isMounted) await getStoreData();
    };

    initializeStoreData();

    return () => {
      isMounted = false;
    };
  }, [pageProps?.storeEntityIds, getStoreData, safeDispatch]);

  if (!loaded) return <Loader />;
  if (!isStoreDataValid) console.warn("⚠️ Store data invalid, proceeding with default.");

  return (
    <>
      {/* Scripts */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-R6XBQY8QGN" />
      <Script id="ga-script" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R6XBQY8QGN');
        `
      }} />
      <Script id="jquery" src="/Assets/Js/jquery-3.6.1.min.js" defer />
      <Script id="tangiblee" async src="https://cdn.tangiblee.com/integration/3.1/managed/www.tangiblee-integration.com/revision_1/variation_original/tangiblee-bundle.min.js" />

      <Header storeData={storeEntityIds} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

function CustomApp({ Component, pageProps, seoData }) {
  const { store } = wrapper.useWrappedStore({ pageProps });

  return (
    <Provider store={store}>
      <Seo
        title={seoData.title}
        keywords={seoData.keywords}
        description={seoData.description}
        url={seoData.url}
      />
      <InnerApp Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

// ✅ Fix: use Next.js built-in App.getInitialProps to prevent infinite loop
CustomApp.getInitialProps = async (appContext) => {
  const origin = STORE_DOMAIN;

  const res = await fetch("https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster", {
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

  const result = await res.json();
  const storeEntityIds = result?.data?.success === 1 ? result?.data?.data : {};

  const seoData = {
    title: storeEntityIds.seo_titles || "Zurah Jewellery",
    description: storeEntityIds.seo_description || "Elegant jewellery for all occasions",
    keywords: storeEntityIds.seo_keyword || "Zurah, Jewellery",
    url: origin,
  };

  const appProps = await App.getInitialProps(appContext); // ✅ Safe base call

  return {
    ...appProps,
    seoData,
    pageProps: {
      ...appProps.pageProps,
      storeEntityIds,
    },
  };
};

export default CustomApp;
