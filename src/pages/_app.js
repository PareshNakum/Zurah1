import React, {
  useEffect,
  useCallback,
  Suspense,
  useState,
  useMemo,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import Script from "next/script";
import { wrapper } from "@/Redux/wrapper";
import Loader from "@/CommanUIComp/Loader/Loader";
import Footer from "@/components/HeaderFooter/Footer/footer";
import commanService from "@/CommanService/commanService";
import { storeCurrency, storeEntityId } from "@/Redux/action";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// Styles
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

// Dynamic Header import
const Header = dynamic(() => import("@/components/HeaderFooter/Header/header"), {
  ssr: false,
});

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const storeEntityIds = useSelector((state) => state?.storeEntityId || {});
  const storeCurrencyState = useSelector((state) => state?.storeCurrency || "");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRY_ATTEMPTS = 3;
  const STORE_DOMAIN = "https://zurah1.vercel.app/";
  const TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  const safeDispatch = useCallback((action) => {
    try {
      dispatch(action);
    } catch (error) {
      console.error("Dispatch error:", error);
    }
  }, [dispatch]);

  const isStoreDataValid = useMemo(() => {
    return storeEntityIds && typeof storeEntityIds === "object" && storeEntityIds.tenant_id;
  }, [storeEntityIds]);

  const getStoreData = useCallback(
    async (attempt = 1, controller = null) => {
      try {
        const payload = {
          a: "GetStoreData",
          store_domain: STORE_DOMAIN,
          SITDeveloper: "1",
        };

        console.log(`⏳ Fetching store data (Attempt ${attempt}/${MAX_RETRY_ATTEMPTS})`);
        const res = await commanService.postApi("/EmbeddedPageMaster", payload, {
          headers: { origin: STORE_DOMAIN },
          signal: controller?.signal,
        });

        if (res?.data?.success === 1 && res.data.data?.tenant_id) {
          const data = res.data.data;

          safeDispatch(storeEntityId(data));
          safeDispatch(storeCurrency(data?.store_currency || "USD"));

          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", JSON.stringify({
              timestamp: Date.now(),
              data,
            }));
          }

          setLoaded(true);
          setRetryCount(0);
          console.log("✅ Store data fetched successfully");
        } else {
          throw new Error("Invalid response or missing tenant_id");
        }
      } catch (err) {
        console.error(`❌ Store fetch error (Attempt ${attempt}):`, err.message);

        if (attempt < MAX_RETRY_ATTEMPTS) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          setTimeout(() => getStoreData(attempt + 1, controller), delay);
          setRetryCount(attempt);
        } else {
          setError("Failed to load store data");
          setLoaded(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", "false");
          }
        }
      }
    },
    [safeDispatch]
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const initializeStoreData = async () => {
      try {
        if (typeof window === "undefined") return;

        const cached = sessionStorage.getItem("storeData");
        if (cached && cached !== "false") {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.timestamp && Date.now() - parsed.timestamp < TTL) {
              safeDispatch(storeEntityId(parsed.data));
              safeDispatch(storeCurrency(parsed.data?.store_currency || "USD"));
              setLoaded(true);
              console.log("⚡ Loaded store data from cache");
              return;
            }
          } catch (parseErr) {
            console.warn("Session cache parse error:", parseErr.message);
            sessionStorage.removeItem("storeData");
          }
        }

        if (pageProps?.storeEntityIds?.tenant_id) {
          safeDispatch(storeEntityId(pageProps.storeEntityIds));
          safeDispatch(storeCurrency(pageProps.storeEntityIds?.store_currency || "USD"));
          sessionStorage.setItem("storeData", JSON.stringify({
            timestamp: Date.now(),
            data: pageProps.storeEntityIds,
          }));
          setLoaded(true);
          console.log("📦 Loaded store data from SSR");
          return;
        }

        await getStoreData(1, controller);
      } catch (err) {
        console.error("Store data initialization error:", err);
        if (isMounted) {
          setError("Initialization failed");
          setLoaded(true);
        }
      }
    };

    initializeStoreData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pageProps?.storeEntityIds, getStoreData, safeDispatch]);

  if (!loaded) return <Loader />;

  if (!isStoreDataValid) {
    console.warn("⚠️ Store data is incomplete, app will continue with fallback.");
  }

  return (
    <>
      {/* Analytics and Scripts */}
      <Script id="ga-js" async src="https://www.googletagmanager.com/gtag/js?id=G-R6XBQY8QGN" />
      <Script id="ga-init" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R6XBQY8QGN');
        `,
      }} />
      <Script id="jquery" src="/Assets/Js/jquery-3.6.1.min.js" defer />
      <Script id="tangiblee" async src="https://cdn.tangiblee.com/integration/3.1/managed/www.tangiblee-integration.com/revision_1/variation_original/tangiblee-bundle.min.js" />

      {/* Layout */}
      <Suspense fallback={<Loader />}>
        <Header storeData={storeEntityIds} />
        <Component {...pageProps} />
        <Footer />
      </Suspense>
    </>
  );
}

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <InnerApp Component={Component} pageProps={props.pageProps} />
      </Suspense>
    </Provider>
  );
}

export default App;
