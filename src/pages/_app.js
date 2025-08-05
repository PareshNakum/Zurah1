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
import { storeCurrency, storeEntityId } from "@/Redux/action";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";

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

const Header = dynamic(() => import("@/components/HeaderFooter/Header/header"), { ssr: false });

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const storeEntityIds = useSelector((state) => state?.storeEntityId || {});
  const storeCurrencyState = useSelector((state) => state?.storeCurrency || "");

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRY_ATTEMPTS = 3;
  const domain = typeof window !== "undefined" ? window.location.origin : "";

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

  const isStoreDataValid = useMemo(() => {
    return storeEntityIds && typeof storeEntityIds === "object" && storeEntityIds.tenant_id;
  }, [storeEntityIds]);

  const getStoreData = useCallback(
    async (attempt = 1) => {
      try {
        const payload = {
          a: "GetStoreData",
          store_domain: domain,
          SITDeveloper: "1",
        };

        const res = await axios.post(
          "https://apiuat-ecom.upqor.com/call/EmbeddedPageMaster",
          payload,
          { headers: { origin: domain } }
        );

        if (res?.data?.success === 1) {
          const data = res.data.data;
          if (!data || !data.tenant_id) throw new Error("Invalid store data received");

          safeDispatch(storeEntityId(data));
          safeDispatch(storeCurrency(data?.store_currency || "USD"));
          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", JSON.stringify(data));
          }

          setLoaded(true);
          setError(null);
          setRetryCount(0);
        } else {
          throw new Error(res?.data?.message || "Failed to fetch store data");
        }
      } catch (err) {
        if (attempt < MAX_RETRY_ATTEMPTS) {
          setRetryCount(attempt);
          const delay = Math.pow(2, attempt - 1) * 1000;
          setTimeout(() => getStoreData(attempt + 1), delay);
        } else {
          setError(err.message || "Failed to load store data");
          setLoaded(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("storeData", "false");
          }
        }
      }
    },
    [safeDispatch, domain]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeStoreData = async () => {
      try {
        if (typeof window === "undefined") return;

        const stored = sessionStorage.getItem("storeData");
        if (stored && stored !== "false") {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.tenant_id) {
              safeDispatch(storeEntityId(parsed));
              safeDispatch(storeCurrency(parsed?.store_currency || "USD"));
              if (isMounted) setLoaded(true);
              return;
            }
          } catch (parseError) {
            sessionStorage.removeItem("storeData");
          }
        }

        if (pageProps?.storeEntityIds && pageProps.storeEntityIds.tenant_id) {
          safeDispatch(storeEntityId(pageProps.storeEntityIds));
          safeDispatch(storeCurrency(pageProps.storeEntityIds?.store_currency || "USD"));
          sessionStorage.setItem("storeData", JSON.stringify(pageProps.storeEntityIds));
          if (isMounted) setLoaded(true);
          return;
        }

        if (isMounted) await getStoreData();
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoaded(true);
        }
      }
    };

    initializeStoreData();
    return () => { isMounted = false; };
  }, [pageProps?.storeEntityIds, getStoreData, safeDispatch]);

  if (!loaded) return <Loader />;
  if (!isStoreDataValid) console.warn("⚠️ Store data is invalid or incomplete");

  return (
    <>
      <Script id="google-analytics1" async src="https://www.googletagmanager.com/gtag/js?id=G-R6XBQY8QGN" />
      <Script id="google-analytics2" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R6XBQY8QGN');
        `,
      }} />
      <Script id="jquery" src="/Assets/Js/jquery-3.6.1.min.js" defer />
      <Script id="tangiblee" async src="https://cdn.tangiblee.com/integration/3.1/managed/www.tangiblee-integration.com/revision_1/variation_original/tangiblee-bundle.min.js" />

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