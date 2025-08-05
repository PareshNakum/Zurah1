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
import Seo from "@/components/SEO/seo";

// Dynamic imports for better performance
const Header = dynamic(
  () => import("@/components/HeaderFooter/Header/header"),
  {
    ssr: false,
  }
);

function InnerApp({ Component, pageProps }) {
  console.log(pageProps);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux selectors with error handling
  const storeEntityIds = useSelector((state) => state?.storeEntityId || {});
  const storeCurrencyState = useSelector((state) => state?.storeCurrency || "");

  // Local state
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Constants
  const MAX_RETRY_ATTEMPTS = 3;
  const STORE_DOMAIN = "https://zurah1.vercel.app/";

  // Safe dispatch wrapper
  const safeDispatch = useCallback(
    (action) => {
      try {
        if (dispatch && typeof dispatch === "function") {
          dispatch(action);
        }
      } catch (error) {
        console.error("Dispatch error in _app.js:", error);
      }
    },
    [dispatch]
  );

  // Memoized store data validation
  const isStoreDataValid = useMemo(() => {
    return (
      storeEntityIds &&
      typeof storeEntityIds === "object" &&
      storeEntityIds.tenant_id
    );
  }, [storeEntityIds]);

  // Get store data with retry logic
  const getStoreData = useCallback(
    async (attempt = 1) => {
      try {
        const payload = {
          a: "GetStoreData",
          store_domain: STORE_DOMAIN,
          SITDeveloper: "1",
        };

        console.log(
          `🚀 Fetching store data (attempt ${attempt}/${MAX_RETRY_ATTEMPTS})`
        );

        const res = await fetch(
          "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              STORE_DOMAIN,
              prefer: STORE_DOMAIN,
            },
            body: JSON.stringify({
              a: "GetStoreData",
              store_domain: STORE_DOMAIN,
              SITDeveloper: "1",
            }),
          }
        );

        if (res?.data?.success === 1) {
          const data = res.data.data;

          // Validate required data
          if (!data || !data.tenant_id) {
            throw new Error("Invalid store data received");
          }

          safeDispatch(storeEntityId(data));
          safeDispatch(storeCurrency(data?.store_currency || "USD"));

          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", JSON.stringify(data));
          }

          setLoaded(true);
          setError(null);
          setRetryCount(0);

          console.log("✅ Store data loaded successfully");
        } else {
          throw new Error(res?.data?.message || "Failed to fetch store data");
        }
      } catch (err) {
        console.error(
          `❌ Error fetching store data (attempt ${attempt}):`,
          err
        );

        if (attempt < MAX_RETRY_ATTEMPTS) {
          setRetryCount(attempt);
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          setTimeout(() => {
            getStoreData(attempt + 1);
          }, delay);
        } else {
          setError(err.message || "Failed to load store data");
          setLoaded(true);

          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", "false");
          }
        }
      }
    },
    [safeDispatch]
  );

  // Initialize store data
  useEffect(() => {
    let isMounted = true;

    const initializeStoreData = async () => {
      try {
        if (typeof window === "undefined") return;

        // Check for cached data first
        const stored = sessionStorage.getItem("storeData");

        if (stored && stored !== "false") {
          try {
            const parsed = JSON.parse(stored);

            if (parsed && parsed.tenant_id) {
              safeDispatch(storeEntityId(parsed));
              safeDispatch(storeCurrency(parsed?.store_currency || "USD"));

              if (isMounted) {
                setLoaded(true);
                console.log("✅ Store data loaded from cache");
              }
              return;
            }
          } catch (parseError) {
            console.error("Error parsing cached store data:", parseError);
            sessionStorage.removeItem("storeData");
          }
        }

        // Check for SSR data
        if (pageProps?.storeEntityIds && pageProps.storeEntityIds.tenant_id) {
          safeDispatch(storeEntityId(pageProps.storeEntityIds));
          safeDispatch(
            storeCurrency(pageProps.storeEntityIds?.store_currency || "USD")
          );

          sessionStorage.setItem(
            "storeData",
            JSON.stringify(pageProps.storeEntityIds)
          );

          if (isMounted) {
            setLoaded(true);
            console.log("✅ Store data loaded from SSR");
          }
          return;
        }

        // Fetch fresh data
        if (isMounted) {
          await getStoreData();
        }
      } catch (error) {
        console.error("Error initializing store data:", error);
        if (isMounted) {
          setError(error.message);
          setLoaded(true);
        }
      }
    };

    initializeStoreData();

    return () => {
      isMounted = false;
    };
  }, [pageProps?.storeEntityIds, getStoreData, safeDispatch]);

  // Show loading state
  if (!loaded) {
    return <Loader />;
  }

  // Show warning if store data is invalid but continue
  if (!isStoreDataValid) {
    console.warn(
      "⚠️ Store data is invalid or incomplete, continuing with defaults"
    );
  }

  return (
    <>
      <Seo
        title={pageProps.seoData.title}
        keyword={pageProps.seoData.keyword}
        description={pageProps.seoData.description}
        image={pageProps.seoData.image}
        url={pageProps.seoData.url}
      />
      <Script
        id="google-analytics1"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-R6XBQY8QGN"
      />
      <Script
        id="google-analytics2"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R6XBQY8QGN');
        `,
        }}
      />
      <Script id="jquery" src="/Assets/Js/jquery-3.6.1.min.js" defer />
      <Script
        id="tangiblee"
        async
        src="https://cdn.tangiblee.com/integration/3.1/managed/www.tangiblee-integration.com/revision_1/variation_original/tangiblee-bundle.min.js"
      />

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
