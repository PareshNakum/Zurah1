import React, { Suspense } from "react";
import Loader from "../CommanUIComp/Loader/Loader";
import ProtectedRoute from "./ProtectedRoute/protectedRoute";
import DashRouterPage from "../CommanUIComp/DashRouterPage/dashRouterPage";
import { lazyWithRetry } from "./../CommanFunctions/commanFunctions";
const Homes = lazyWithRetry(() => import("../components/HomePage/Home/homes"));
const Jewellery = lazyWithRetry(() => import("./../components/Jewellery/Jewellery/jewellery"));
const SingleProductJewellery = lazyWithRetry(() => import("./../components/Jewellery/SingleProductJewellery/singleproductjewellery"));
const Profile = lazyWithRetry(() => import("./../components/Profile/Profile"));
const Cart = lazyWithRetry(() => import("./../components/Cart/Cart/cart"));
const Faq = lazyWithRetry(() => import("./../components/FAQ/Faq/faq"));
const WishList = lazyWithRetry(() => import("./../components/WishList/wishList"));
const ContentTypeList = lazyWithRetry(() => import("../components/FAQ/Content/contentType"));
const CertificateDiamond = lazyWithRetry(() => import("../components/CertificateDiamond/CertificateDiamond"));
const Blog = lazyWithRetry(() => import("../components/Blog/Blog/blog"));
const BlogDetails = lazyWithRetry(() => import("../components/Blog/BlogDetails/blogdetails"));
const ContactUs = lazyWithRetry(() => import("./../components/ContactUs/contactUs"));
const Empty404 = lazyWithRetry(() => import("../CommanUIComp/Empty404/empty404"));
const LooseDiamonds = lazyWithRetry(() => import("./../components/LooseDiamonds/looseDiamonds"));
const Education = lazyWithRetry(() => import("./../components/Education/education"));
const AboutUs = lazyWithRetry(() => import("./../components/AboutUs/aboustUs"));
const PaymentSuccessFail = lazyWithRetry(() => import("./../components/Cart/PaymentSuccessFail/paymentSuccessFail"));
const Viewjourney = lazyWithRetry(() => import("./../components/Profile/JourneyCatalogueView/Viewjourney"))
const CreateWithZurah = lazyWithRetry(() => import('./../components/CreateWithZurah/CreateWithZurah/CreateWithZurah'))
const ZurahDiamondDetail = lazyWithRetry(() => import('./../components/CreateWithZurah/ZurahDiamondDetail/ZurahDiamondDetail'));
const ZurahJewellery = lazyWithRetry(() => import('./../components/CreateWithZurah/ZurahJewellery/ZurahJewellery'));
const SinlgeProductDiy = lazyWithRetry(() => import('./../components/CreateWithZurah/SinlgeProductDiy/SinlgeProductDiy'));
const DiyProduct = lazyWithRetry(() => import('./../components/CreateWithZurah/DiyProduct/DiyProduct'));
const CampaignPreview = lazyWithRetry(() => import('./../components/CampaignPreview/campaignPreview'))
const DiyPage = lazyWithRetry(() => import('./../components/DiyProduct/DiyPage/DiyPage'))
const searchDetailspage = lazyWithRetry(() => import('../components/HeaderFooter/SearchPage/SearchDetails/searchDetailspage'))

export const RouteComponent = [
    // Error page
    {
        path: "*",
        component: Empty404,
        element: <Suspense fallback={<Loader />}><Empty404 /></Suspense>
    },
    // Home Page 
    {
        path: "/",
        component: Homes,
        element: <Suspense fallback={<Loader />} ><Homes /></Suspense>
    },
    // Refersh Page
    {
        path: "/-",
        component: DashRouterPage,
        element: <Suspense fallback={<Loader />}><DashRouterPage /></Suspense>
    },
    // Search Page
    {
        path: "/search",
        component: searchDetailspage,
        element: <Suspense fallback={<Loader />}><searchDetailspage /></Suspense>
    },
    // Reset Password
    {
        path: "/reset-password/:key",
        component: Homes,
        element: <Suspense fallback={<Loader />}><Homes /></Suspense>
    },
    {
        path: "/make-your-customization",
        component: DiyPage,
        element: <Suspense fallback={<Loader />} ><DiyPage /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-item",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-setting",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-diamond",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/make-your-customization/jewellery/start-with-a-diamond",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-item/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-setting/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-diamond/:variantId",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/make-your-customization/start-with-a-diamond/jewellery/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/make-your-customization/jewellery/start-with-a-diamond/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    // Certificate Diamond
    {
        path: "/certificate-diamond",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/certificate-diamond/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/natural-certified-diamond",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/natural-certified-diamond/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    // Certificate DIY
    {
        path: "/certificate-diamond/start-with-a-diamond",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/certificate-diamond/start-with-a-setting",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/certificate-diamond/start-with-a-diamond/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/certificate-diamond/start-with-a-setting/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    // Lab Grown Diamond
    {
        path: "/lab-grown-diamond",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/lab-grown-certified-diamond",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/lab-grown-certified-diamond/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/lab-grown-diamond/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/lab-grown-certified-diamond/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    // Lab Grown Diamond DIY
    {
        path: "/lab-grown-diamond/start-with-a-diamond",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/lab-grown-diamond/start-with-a-setting",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/lab-grown-diamond/start-with-a-diamond/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/lab-grown-diamond/start-with-a-setting/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    //gemstone ceert
    {
        path: "/lab-grown-gemstone",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    {
        path: "/lab-grown-gemstone/:shape/:item",
        component: CertificateDiamond,
        element: <Suspense fallback={<Loader />} ><CertificateDiamond /></Suspense>
    },
    // Lab Grown Diamond DIY
    {
        path: "/lab-grown-gemstone/start-with-a-diamond",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/lab-grown-gemstone/start-with-a-setting",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/lab-grown-gemstone/start-with-a-diamond/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/lab-grown-gemstone/start-with-a-setting/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    // Success Order page
    {
        path: "/success-order/:succesOrderId/:OrderAmnt",
        component: PaymentSuccessFail,
        element: <Suspense fallback={<Loader />} > <PaymentSuccessFail /></Suspense>
    },
    {
        path: "/success-order/:succesOrderId",
        component: PaymentSuccessFail,
        element: <Suspense fallback={<Loader />} > <PaymentSuccessFail /></Suspense>
    },
    {
        path: "/success-order",
        component: PaymentSuccessFail,
        element: <Suspense fallback={<Loader />} > <PaymentSuccessFail /></Suspense>
    },
    // Cancel Order page
    {
        path: "/cancel-order/:succesOrderId",
        component: PaymentSuccessFail,
        element: <Suspense fallback={<Loader />} > <PaymentSuccessFail /></Suspense>
    },
    // FAQ page
    {
        path: "/faq",
        component: Faq,
        element: <Suspense fallback={<Loader />} ><Faq /></Suspense>
    },
    // Profile
    {
        path: "/dashboard/",
        component: Profile,
        element: <Suspense fallback={<Loader />} > <Profile />  </Suspense>
    },
    {
        path: "/dashboard/:id",
        component: Profile,
        element: <Suspense fallback={<Loader />} > <Profile />  </Suspense>
    },
    //Order cancle profile
    {
        path: "/profile/order/:true",
        component: Profile,
        element: <Suspense fallback={<Loader />} > <Profile />  </Suspense>
    },
    // Profile Order Page
    {
        path: "/order-details/:orderId",
        component: Profile,
        element: <Suspense fallback={<Loader />} > <ProtectedRoute> <Profile /></ProtectedRoute></Suspense>
    },
    {
        path: "/order-details",
        component: Profile,
        element: <Suspense fallback={<Loader />} > <ProtectedRoute> <Profile /></ProtectedRoute></Suspense>
    },
    // PolicyPage
    {
        path: "/:policyName",
        component: ContentTypeList,
        element: <Suspense fallback={<Loader />} ><ContentTypeList /></Suspense>
    },
    // Cart Page
    {
        path: "/cart",
        component: Cart,
        element: <Suspense fallback={<Loader />} ><Cart /></Suspense>
    },
    // wishList
    {
        path: "/wishList",
        component: WishList,
        element: <Suspense fallback={<Loader />} ><WishList /></Suspense>
    },
    // Blog page
    {
        path: "/blog",
        component: Blog,
        element: <Suspense fallback={<Loader />} ><Blog /></Suspense>
    },
    // Blog Details page
    {
        path: "/blog/:title",
        component: BlogDetails,
        element: <Suspense fallback={<Loader />} ><BlogDetails /></Suspense>
    },
    {
        path: "/blog/:unique_id/:category_id",
        component: BlogDetails,
        element: <Suspense fallback={<Loader />} ><BlogDetails /></Suspense>
    },
    //contact US page
    {
        path: "/contact-us",
        component: ContactUs,
        element: <Suspense fallback={<Loader />} ><ContactUs /></Suspense>
    },
    // About US page
    {
        path: "/about-us",
        component: AboutUs,
        element: <Suspense fallback={<Loader />} ><AboutUs /></Suspense>
    },
    // Loose Diamond Page
    {
        path: "/loose-diamond",
        component: LooseDiamonds,
        element: <Suspense fallback={<Loader />} ><LooseDiamonds /></Suspense>
    },
    {
        path: "/loose-diamond/:shapeName/:shape",
        component: LooseDiamonds,
        element: <Suspense fallback={<Loader />}><LooseDiamonds /></Suspense>
    },
    // Gemston Page
    {
        path: "/gemstone-diamond",
        component: LooseDiamonds,
        element: <Suspense fallback={<Loader />}><LooseDiamonds /></Suspense>
    },
    {
        path: "/gemstone-diamond/:shapeName/:shape",
        component: LooseDiamonds,
        element: <Suspense fallback={<Loader />}><LooseDiamonds /></Suspense>
    },
    // Education
    {
        path: "/education",
        component: Education,
        element: <Suspense fallback={<Loader />}><Education /></Suspense>
    },
    // {
    //     path: "/dashboard/viewjourney/:unique_id",
    //     component: Viewjourney,
    //     element: <Viewjourney />
    // },
    {
        path: "/dashboard/viewjourney",
        component: Viewjourney,
        element: <Viewjourney />
    },
    {
        path: "/profile/journey-catalog/:type",
        component: Profile,
        element: <Profile />
    },
    {
        path: "/profile/journey-catalog/",
        component: Profile,
        element: <Profile />
    },
    //products
    {
        path: "/products/:verticalCode",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/products/:verticalCode/start-with-a-setting",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/products/:verticalCode/start-with-a-diamond",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    {
        path: "/products/:verticalCode/:productKey/:value",
        component: Jewellery,
        element: <Suspense fallback={<Loader />} ><Jewellery /></Suspense>
    },
    // Jewellery Details Page
    {
        path: "/products/:verticalCode/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/products/:verticalCode/:productKey/:value/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/products/:verticalCode/start-with-a-setting/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    {
        path: "/product/:verticalCode/start-with-a-diamond/:variantId",
        component: SingleProductJewellery,
        element: <Suspense fallback={<Loader />} ><SingleProductJewellery /></Suspense>
    },
    // {
    //     path: "/campaign/:campaign_id?/:email?/:un_id?/:name?",
    //     component: CampaignPreview,
    //     element: <Suspense fallback={<Loader />} ><CampaignPreview /></Suspense>
    // },
];