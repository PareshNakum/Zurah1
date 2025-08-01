import React, { useEffect, useState, useCallback } from "react";
import styles from './homes.module.scss';
import { useDispatch, useSelector } from "react-redux";
import Skeleton from 'react-loading-skeleton';
import { Carousel } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import {OwlCarousel} from "react-owl-carousel2";
import 'react-loading-skeleton/dist/skeleton.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { RandomId, isEmpty, changeUrl } from "../../../CommanFunctions/commanFunctions";
import Commanservice from "../../../CommanService/commanService";
import DiamondShape from '../DiamondShape/diamondshape';
import ZurahProduct from '../ZurahProduct/zurahproduct';
import Loader from "../../../CommanUIComp/Loader/Loader";
import Notification from "../../../CommanUIComp/Notification/Notification";
import noRecordFound from "./../../../Assets/Images/ZURAH-1.png";
import { addFilterAction, allBlogDataList, editDiamondAction, selectedDiamondObject, selectedDiamondShapeName, selectedJewelRing, selectedRingData, SelectFilterAction } from "../../../Redux/action";
import Seo from "../../SEO/seo";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import dynamic from "next/dynamic";

// Ensure jQuery is available in the browser environment
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

// const div = dynamic(() => import("react-div-css"), { ssr: false });
// import AOS from 'aos';
// import 'aos/dist/aos.css';

const Homes = (props) => {
    //States and Variables declarations
    const navigate = useRouter();
    const storeEntityIds = useSelector((state) => state.storeEntityId);
    const HeaderLogoData = useSelector((state) => state.HeaderLogoData);
    const loginData = useSelector((state) => state.loginData);
    const sliderAlignment = useSelector((state) => state.sliderAlignment);
    const productNameLists = useSelector((state) => state.productNameList);
    const dispatch = useDispatch();

    // Loader 
    const [loader, setLoader] = useState(false);
    const [skeletonLoader, setSkeletonLoader] = useState(false);
    const [skeletonLoaderProduct, setSkeletonLoaderProduct] = useState([]);

    // Tost Message
    const [isSuccess, setIsSuccess] = useState(false);
    const [toastShow, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    // On Scroll API
    const [typeArrFlag, settypeArrFlag] = useState([]);
    const [onTimeApiCall, setOnTimeApiCall] = useState('');

    // One Time API call
    const [onceUpdated, setOnceUpdated] = useState(true);

    // Home Page Data
    const [sliderDataList, setSliderDataList] = useState([]);
    const [sectionDataList, setSectionDataList] = useState([]);
    const [blogDataList, setBlogDataList] = useState([]);
    const [mostSearchableDataList, setMostSearchableDataList] = useState([])
    const [journeyDataList, setJourneyDataList] = useState([])

    //Meta
    var storeData = JSON.parse(typeof window !== "undefined" && sessionStorage.getItem("storeData"))

    const metaConfig = {
        title: storeEntityIds?.seo_titles,
        description: storeEntityIds?.seo_description,
        keywords: storeEntityIds?.seo_keyword,
        image: HeaderLogoData?.[0]?.image,
        url: typeof window !== "undefined" && window.location.href,
    }

    //Function for most searchable product by API calling 
    const mostSearchableData = useCallback((sectionDataList, mainData, index) => {
        const obj = {
            a: "GetMostSearchProduct",
            store_id: props.entityData.mini_program_id,
            tenant_id: props.entityData.tenant_id,
            entity_id: props.entityData.entity_id,
            origin: props.entityData.cmp_origin,
            consumer_id: "",
            search_type: "",
            number: "0",
            per_page: "0",
        };
        Commanservice.postLaravelApi('/MostSearchProduct', obj,{
        headers: {
          origin: "https://uat.zurahjewellery.com",
        },
      }).then((res) => {
            if (res.data.success === 1) {
                if (res.data.data !== null) {
                    if (res.data.data.length > 0) {
                        setMostSearchableDataList(res.data.data);
                        sectionDataList.seleton = true;
                        mainData[index] = sectionDataList;
                        setSectionDataList([...mainData]);
                    } else {
                        sectionDataList.seleton = false;
                        mainData[index] = sectionDataList;
                        setSectionDataList([...mainData]);
                    }
                } else {
                    sectionDataList.seleton = false;
                    mainData[index] = sectionDataList;
                    setSectionDataList([...mainData]);
                }
            } else {
                sectionDataList.seleton = false;
                mainData[index] = sectionDataList;
                setSectionDataList([...mainData]);
            }
        })
    }, [loginData, props.entityData])

    //Function for products data by filter
    const productData = useCallback((sectionDataList, type, mainData, index) => {
        const objProduct = {
            a: "getStoreItems",
            SITDeveloper: "1",
            miniprogram_id: props.entityData.mini_program_id,
            tenant_id: (props.entityData.tenant_id),
            entity_id: (props.entityData.entity_id),
            per_page: "15",
            number: "1",
            filters: "[]",
            // filters: `[{"key":"mi_jewellery_product_type","value": ["${type}"] }]`,
            from_price: "",
            to_price: "",
            extra_currency: storeCurrency,
            secret_key: props.entityData.secret_key,
            product_diy: "PRODUCT",
            store_type: "B2C",
            vertical_code: sectionDataList?.vertical_code,
            user_id: Object.keys(loginData).length > 0 ? loginData.member_id : RandomId,
            view_price: "NO",
        };
        if (isEmpty(sectionDataList?.dimension) !== "") {
            objProduct.dimension = sectionDataList?.dimension
        }
        if (isEmpty(sectionDataList?.segment) !== "[]") {
            objProduct.segments = sectionDataList?.segment
        }
        if (isEmpty(sectionDataList?.item_group) !== "") {
            objProduct.item_group = sectionDataList?.item_group
        }
        // if (isEmpty(sectionDataList.finish_type) != '') {
        //     objProduct['filters'] = `[{"key":"mi_jewellery_product_type","value": ["${type}"] },{"key":"master_jewelry_type","value": ["${sectionDataList.finish_type}"] }]`;
        // }
        Commanservice.postApi('/EmbeddedPageMaster', objProduct,{
        headers: {
          origin: "https://uat.zurahjewellery.com",
        },
      }).then((res1) => {
            if (res1.data.success === 1) {
                const datas = res1.data.data.resData;
                if (datas.length > 0) {
                    var ProductList = [];
                    for (let d = 0; d < datas.length; d++) {
                        // if (isEmpty(datas[d].jewellery_product_type) === isEmpty(type)) {
                        //     ProductList.push(datas[d])
                        // }
                        // if (isEmpty(sectionDataList.finish_type) != '') {
                        ProductList.push(datas[d])
                        // }
                    }
                    sectionDataList.ProductList = ProductList;
                    sectionDataList.seleton = true;
                    mainData[index] = sectionDataList;
                    setSectionDataList([...mainData]);
                } else {
                    sectionDataList.ProductList = [];
                    sectionDataList.seleton = false;
                    mainData[index] = sectionDataList;
                    setSectionDataList([...mainData]);
                }
            } else {
                setToastOpen(true);
                setIsSuccess(false);
                setToastMsg(res1.data.message);
            }
        }).catch(() => { });
    }, [loginData, props.entityData]);

    //Function for Slider and collection section data by API calling
    const collectionData = useCallback((value) => {
        setLoader(true);
        setSkeletonLoader(true);
        var obj = {
            a: "getHomeSectionDetail",
            store_id: props.entityData.mini_program_id,
            type: "B2C"
        };
        Commanservice.postLaravelApi('/SectionDetail', obj,{
        headers: {
          origin: "https://uat.zurahjewellery.com",
        },
      }).then((res) => {
            if (res.data.success === 1) {
                var data = res.data.data;
                if (Object.keys(data).length > 0) {
                    var sectionDataList = data.section_data;
                    var sliderDataList = data.slider_data;
                    for (let c = 0; c < sliderDataList.length; c++) {
                        if (isEmpty(sliderDataList[c].slider_logo).includes('mp4')) {
                            sliderDataList[c].slider_type = 'video';
                        } else {
                            sliderDataList[c].slider_type = 'image';
                        }
                    }
                    var blogDataList = data.blog_list;
                    var typeArr = [];
                    let arr1 = [];
                    for (let i = 0; i < Number(15); i++) {
                        arr1.push(i)
                    }
                    setSkeletonLoaderProduct(arr1);
                    if (sliderDataList.length > 0) {
                        setSliderDataList(sliderDataList)
                    }
                    if (blogDataList.length > 0) {
                        setBlogDataList(blogDataList);
                        dispatch(allBlogDataList(blogDataList));
                    }
                    if (sectionDataList.length > 0) {
                        for (let c = 0; c < sectionDataList.length; c++) {
                            if (sectionDataList[c].section_type === 'PRODUCTS') {
                                if (sectionDataList[c].vertical_code !== "DIAMO" && sectionDataList[c].vertical_code !== "LGDIA" && sectionDataList[c].vertical_code !== "LDIAM" && sectionDataList[c].vertical_code !== "GEMST") {
                                    sectionDataList[c].ProductList = [];
                                    sectionDataList[c].seleton = true;
                                    typeArr.push({ name: sectionDataList[c].product_type, flag: true, finish_type: sectionDataList[c].finish_type, unique_id: sectionDataList[c].unique_id })
                                }
                            } else if (sectionDataList[c].section_type === "MOST SEARCHABLE") {
                                sectionDataList[c].seleton = true;
                                typeArr.push({ name: sectionDataList[c].section_type, flag: true })
                            }
                        }
                        setSectionDataList(sectionDataList)
                        settypeArrFlag(typeArr);
                        setLoader(false);
                        setSkeletonLoader(false);
                    }
                    else {
                        setLoader(false);
                        setSkeletonLoader(false);
                    }
                }
                else {
                    setLoader(false);
                }
            }
            else {
                setToastOpen(true);
                setToastMsg(res.data.message);
                setIsSuccess(false);
                setLoader(false);
                setSkeletonLoader(false);
            }
        }).catch(() => {
            setLoader(false)
            setSkeletonLoader(false);
        })
    }, [dispatch, productData])

    //States updates for home page path
    useEffect(() => {
        // dispatch(selectedDiamondShapeName([]));
        // dispatch(selectedDiamondObject({}))
        setOnceUpdated(false);
        // if (typeof window !== "undefined" && window.location.pathname === "/") {
        //     dispatch(addFilterAction([]));
        //     dispatch(SelectFilterAction(true));
        // }
        typeof window !== "undefined" && sessionStorage.removeItem('filterJson');
    }, [dispatch])

    //default Animation and API call for home page
    useEffect(() => {
        // AOS.init({
        //     duration: 1000, // Animation duration in milliseconds
        // });
        if (typeof window !== "undefined" && sessionStorage.getItem("storeUrl") !== null) {
            typeof window !== "undefined" && sessionStorage.removeItem("storeUrl")
        }
        if (Object.keys(props.entityData).length > 0) {
            if (!onceUpdated) {
                window.scrollTo(0, 0);
                setOnceUpdated(true);
                collectionData();
                journeyData();
            }
        } else {
            setLoader(false);
        }
    }, [props.entityData, onceUpdated, dispatch, collectionData]);


    // set scroll behaviour for products data and most searchable products data
    const handleScroll = () => {
        const $ = window.$;
        var heightClassname = document.getElementById('main-slider');
        if (heightClassname !== undefined && heightClassname !== null) {
            var sliderid = heightClassname.clientHeight;
            if (sliderid !== undefined) {
                var height = sliderid / 2
                var bodyHeight = document.documentElement.scrollTop
                if (bodyHeight > height) {
                    let categoryTitles = $('.homeProduct');
                    let topCat = categoryTitles.filter((i, el) => $(el).offset().top > $(window).scrollTop()).first();
                    if (topCat.prop('id') !== undefined) {
                        if (onTimeApiCall !== topCat.prop('id')) {
                            if (typeArrFlag.length > 0) {
                                for (let d = 0; d < typeArrFlag.length; d++) {
                                    if (typeArrFlag[d].unique_id === topCat.prop('id') || typeArrFlag[d].name === topCat.prop('id')) {
                                        if (typeArrFlag[d].flag === true) {
                                            typeArrFlag[d].flag = false;
                                            if (sectionDataList.length > 0) {
                                                // console.log(sectionDataList, topCat.prop('id'))
                                                for (let c = 0; c < sectionDataList.length; c++) {
                                                    if (sectionDataList[c].section_type === 'PRODUCTS') {
                                                        if (sectionDataList[c].vertical_code !== "DIAMO" && sectionDataList[c].vertical_code !== "LGDIA" && sectionDataList[c].vertical_code !== "LDIAM" && sectionDataList[c].vertical_code !== "GEMST") {
                                                            // if (sectionDataList[c].unique_id === topCat.prop('id')) {
                                                            productData(sectionDataList[c], sectionDataList[c].product_type, sectionDataList, c);
                                                            // }
                                                        }
                                                    } else if (sectionDataList[c].section_type === "MOST SEARCHABLE") {
                                                        if (sectionDataList[c].section_type === topCat.prop('id')) {
                                                            mostSearchableData(sectionDataList[c], sectionDataList, c);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                settypeArrFlag(typeArrFlag);
                            }
                        }
                    }
                }
            }
        }
    }

    //Call of Handlescroll function
    useEffect(() => {
        handleScroll()
    }, [handleScroll])

    //event hadler for handlescroll
    useEffect(() => {
        let arr = []
        for (let index = 0; index < typeArrFlag.length; index++) {
            if (typeArrFlag[index].flag !== true) {
                arr.push(typeArrFlag[index].flag)
            }
        }
        if (arr.length !== typeArrFlag.length) {
            window.addEventListener("scroll", handleScroll);
        } else {
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    //Click event for all navigation
    const onClickEvent = (event, c) => {
        var megaMenu = JSON.parse(typeof window !== "undefined" && sessionStorage.getItem("megaMenu"))?.navigation_data?.filter((item) => item.product_vertical_name?.toLowerCase() === c.vertical_code?.toLowerCase())[0];
        if (!(productNameLists || []).includes(c.product_title)) {
            dispatch(addFilterAction([...productNameLists, c.product_title]))
        }
        const productUrl = c.collection !== "" ?
            `/products/${megaMenu?.menu_name?.toLowerCase()}/collection/${changeUrl(isEmpty(c.collection_name))}`
            : c.section_type === 'OFFER' ?
                `/products/${megaMenu?.menu_name?.toLowerCase()}/offer/${changeUrl(isEmpty(c.offer_detail['code']))}`
                :
                c.product_type !== "" ?
                    `/products/${megaMenu?.menu_name?.toLowerCase()}/${changeUrl(isEmpty('type'))}/${changeUrl(isEmpty(c.product_title))}` :
                    `/#`;
        if (window.location.pathname !== (
            c.vertical_code === "DIAMO" ? `/certificate-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                c.vertical_code === "LGDIA" ? `/lab-grown-certified-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                    c.vertical_code === "GEMST" ? `/gemstone-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                        c.vertical_code === "LDIAM" ? `/loose-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                            c.collection !== "" ?
                                `/products/${megaMenu?.menu_name?.toLowerCase()}/collection/${changeUrl(isEmpty(c.collection_name))}`
                                : c.section_type === 'OFFER' ?
                                    `/products/${megaMenu?.menu_name?.toLowerCase()}/offer/${changeUrl(isEmpty(c.offer_detail['code']))}`
                                    :
                                    c.product_type !== "" ?
                                        `/products/${megaMenu?.menu_name?.toLowerCase()}/${changeUrl(isEmpty('type'))}/${changeUrl(isEmpty(c.product_title))}` :
                                        `/#`)) {
            //c.vertical_code === "JEWEL" ?
            event.stopPropagation();
            event.preventDefault();

            navigate.push("/-");
        }
        typeof window !== "undefined" && sessionStorage.setItem("storeUrl", (
            c.vertical_code === "DIAMO" ? `/certificate-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                c.vertical_code === "LGDIA" ? `/lab-grown-certified-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                    c.vertical_code === "GEMST" ? `/gemstone-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                        c.vertical_code === "LDIAM" ? `/loose-diamond/${changeUrl(isEmpty(c.section_type))}/${changeUrl(isEmpty(c.display_name))}` :
                            c.collection !== "" ?
                                `/products/${megaMenu?.menu_name?.toLowerCase()}/collection/${changeUrl(isEmpty(c.collection_name))}`
                                : c.section_type === 'OFFER' ?
                                    `/products/${megaMenu?.menu_name?.toLowerCase()}/offer/${changeUrl(isEmpty(c.offer_detail['code']))}`
                                    :
                                    c.product_type !== "" ?
                                        `/products/${megaMenu?.menu_name?.toLowerCase()}/${changeUrl(isEmpty('type'))}/${changeUrl(isEmpty(c.product_title))}` :
                                        `/#`))
        //c.vertical_code === "JEWEL" ? 
        typeof window !== "undefined" && sessionStorage.setItem("collection", c.product_type)
        if (isEmpty(c.collection) != '') {
            typeof window !== "undefined" && sessionStorage.setItem("collection_id", c.collection)
        } else {
            typeof window !== "undefined" && sessionStorage.removeItem("collection_id")
        }
        if (isEmpty(c.finish_type) != '') {
            typeof window !== "undefined" && sessionStorage.setItem("finish_type", c.finish_type)
        } else {
            typeof window !== "undefined" && sessionStorage.removeItem("finish_type")
        }
        // navigate.push(productUrl)
    }

    //get journey details function
    const journeyData = () => {
        var obj = {
            a: "GetJourney",
            store_id: props.entityData.mini_program_id,
            tenant_id: props.entityData.tenant_id,
            entity_id: props.entityData.entity_id,
            store_type: 'B2C',
            unique_id: ''
        };
        Commanservice.postLaravelApi("/WarrantyCard", obj).then((res) => {
            if (res["data"]["success"] === 1) {
                var data = res.data.data;
                setJourneyDataList(data);
            }
        })
    }

    useEffect(() => {
        if (sectionDataList.length === 0) {
            collectionData();
            journeyData();
        }
    }, [sectionDataList]);

    //Update states when first time rendering
    // useEffect(() => {
    //     dispatch(selectedDiamondObject({}))
    //     dispatch(editDiamondAction(""));
    //     dispatch(selectedJewelRing({}));
    //     dispatch(selectedRingData({}));
    // }, []);

    return (
        <React.Fragment>
            {/* <Seo title={metaConfig?.title} description={metaConfig?.description} keywords={metaConfig?.keywords} url={metaConfig?.url} image={metaConfig?.image} type="website" /> */}
            {loader && <Loader />}
            <section id={styles.BodyContent}>
                <div className={clsx(`homepage_slider section_margin mt-0`)}>
                    <div id={styles["main-slider"]}>
                        <Carousel>
                            {!skeletonLoader ? sliderDataList.length > 0 ? (sliderDataList.map((S, index) => (
                                <Carousel.Item key={index}>
                                    {!skeletonLoader ?
                                        <>
                                            {isEmpty(S.slider_type) == 'video' ?
                                                <div className={`${styles.banner_video}`}>
                                                    <video className={`${styles.videoTag}`} autoPlay loop muted>
                                                        <source src={S.slider_logo} type='video/mp4' />
                                                    </video>
                                                </div>
                                                :
                                                <Link className={clsx(`${styles["banner__bg2"]} d-flex align-items-center justify-content-center text-end`)}
                                                    style={{
                                                        background: S.slider !== '' ? 'url("' + S.slider + '") no-repeat center center/cover' : ""
                                                    }}
                                                    href={isEmpty(S.button_link_1) ? S.button_link_1 : isEmpty(S.button_link_2) ? S.button_link_2 : ""}
                                                >
                                                    <div className="container">
                                                        <div className={clsx(`${styles["banner-content"]} ${sliderAlignment}`)}>
                                                            {S.slider_logo &&
                                                                (
                                                                    <div>
                                                                        <div className={clsx(`${styles["slider-logo"]}`)} data-animation-in="fadeInRight">
                                                                            <Image src={S.slider_logo} className={clsx(`img-fluid wh-auto`)} alt={S.text} width={200} height={50} />
                                                                        </div>
                                                                    </div>)}
                                                            <div>
                                                                {/* <div className="banner-heading" data-animation-in="fadeInRight">{S.text}</div> */}
                                                                {index === 0 ? (
                                                                    <h1 className={clsx(`${styles["banner-heading"]}`)} data-animation-in="fadeInRight">{S.text}</h1>
                                                                ) : (
                                                                    <div className={clsx(`${styles["banner-heading"]}`)} data-animation-in="fadeInRight">{S.text}</div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className={clsx(`${styles["banner-sub-heading"]}`)} data-animation-in="fadeInLeft" dangerouslySetInnerHTML={{ __html: S.description }}></div>
                                                            </div>
                                                            <div className="homeslider_button hero-btn">
                                                                {isEmpty(S.button_link_1) != '' && isEmpty(S.button_title_1) != '' ?
                                                                    <button className={clsx(`btn ${styles["home-btn-edit"]} btn-white`)}>{S.button_title_1}</button>
                                                                    : ''}
                                                                {isEmpty(S.button_link_1) != '' && isEmpty(S.button_link_2) != '' ?
                                                                    <span className={clsx(`px-sm-4 ${styles["banner-sub-or"]}`)}>OR</span>
                                                                    : ''}
                                                                {isEmpty(S.button_link_2) != '' && isEmpty(S.button_title_2) != '' ?
                                                                    <button className={clsx(`btn ${styles["home-btn-edit"]} btn-white`)}>{S.button_title_2}</button>
                                                                    : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            }


                                        </>
                                        :
                                        <div className={clsx(`${styles["banner__bg2"]} d-flex align-items-center justify-content-center text-center`)}>
                                            <Skeleton />
                                        </div>}
                                </Carousel.Item>
                            ))) :
                                ''
                                :
                                <Carousel.Item>
                                    <div className={clsx(`${styles["banner__bg2"]} d-flex align-items-center justify-content-center text-center`)}>
                                        <Skeleton />
                                    </div>
                                </Carousel.Item>
                            }
                        </Carousel>
                    </div>
                </div>
                {sectionDataList.length > 0 && sectionDataList.map((c, index) => {
                    return (<React.Fragment key={index}>
                        {c.is_group !== 1 ?
                            <React.Fragment>
                                {c.section_type === "COLLECTION" ?
                                    <React.Fragment>
                                        {c.alignment === "background" ?
                                            <div className={clsx(`${styles["collection-poster"]} ${styles["section_margin"]}`)}>
                                                <div className={clsx(`${styles["collection-poster-image"]} position-relative cursor-pointer`)} style={{ backgroundImage: `url(${c.banner_image})` }} onClick={(e) => { onClickEvent(e, c) }}>
                                                    <div className={clsx(`container ${styles["collection_fullwith"]}`)}>
                                                        <div className={styles["collection_text"]}>
                                                            <div className={styles.title} data-aos="fade-up" data-aos-duration="600">
                                                                <h3 >{c.display_name}</h3>
                                                            </div>
                                                            <div className={styles.description} data-aos="fade-up" data-aos-duration="700">
                                                                <p dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                                            </div>
                                                            <div onClick={(e) => { onClickEvent(e, c) }} className={styles["shop_now"]} data-aos="fade-up" data-aos-duration="800"><button className="btn btn-white" type="button">Shop Now</button></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : c.alignment === "left" ?
                                                <div className={clsx(`${styles["first-poster"]} section_margin ${styles.CollectionLeftBox}`)}>
                                                    <div className={clsx(`container ${styles.A}`)}>
                                                        <div className='row'>
                                                            <div className={clsx(`col-12 col-md-6 ${styles["collection-images"]}`)}>
                                                                <div className="mb-0" data-aos="fade-left" data-aos-duration="500">
                                                                    <Image effect="blur" src={c.banner_image} className={clsx(`img-fluid wh-auto ms-auto d-block cursor-pointer`)} width={686} height={686} alt={c.display_name} onClick={(e) => { onClickEvent(e, c) }} />
                                                                </div>
                                                            </div>
                                                            <div className={clsx(`col-12 col-md-6 d-flex align-items-center ${styles["collection-text"]}`)}>
                                                                <div className={clsx(`${styles["first-poster-content"]} ${styles["first-poster-desc"]}`)}>
                                                                    <div className={clsx(`${styles['first-poster-title']}`)} data-aos="fade-up" data-aos-duration="600">
                                                                        <h3 className={styles.text} dangerouslySetInnerHTML={{ __html: c.display_name }}></h3>
                                                                    </div>

                                                                    <div className={clsx(`${styles["first-poster-foot"]}`)} data-aos="fade-up" data-aos-duration="700">
                                                                        <p dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                                                    </div>
                                                                    <div className={clsx(`${styles["first-poster-btn"]}`)} data-aos="fade-up" data-aos-duration="800">
                                                                        <div onClick={(e) => { onClickEvent(e, c) }} className={clsx(`${styles["shop_now"]}`)}><button className={clsx(`btn ${styles["btn-start-with"]}`)} type="button">Shop Now</button></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : c.alignment === "right" ?
                                                    <div className={clsx(`${styles["first-poster"]} section_margin ${styles["CollectionRightBox"]}`)} >
                                                        <div className={clsx(`container ${styles.B}`)}>
                                                            <div className='row'>
                                                                <div className={clsx(`col-12 col-md-6 d-flex align-items-center ${styles["collection-text"]}`)}>
                                                                    <div className={clsx(` ${styles["first-poster-content"]} ${styles["first-poster-desc"]}`)}>
                                                                        <div className={clsx(`${styles["first-poster-title"]}`)} data-aos="fade-up" data-aos-duration="600">
                                                                            <h3 className={clsx(`${styles["text"]}`)}>{c.display_name}</h3>
                                                                        </div>
                                                                        <div className={clsx(`${styles["first-poster-foot"]}`)} data-aos="fade-up" data-aos-duration="700">
                                                                            <p dangerouslySetInnerHTML={{ __html: c.description }} />
                                                                        </div>

                                                                        <div className={clsx(`${styles["first-poster-btn"]}`)} data-aos="fade-up" data-aos-duration="800">
                                                                            <div onClick={(e) => onClickEvent(e, c)} className={clsx(`${styles["shop_now"]}`)}>
                                                                            <button className="btn" type="button">Shop Now</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className={clsx(`col-12 col-md-6 ${styles["collection-images"]}`)} data-aos="fade-right" data-aos-duration="800">
                                                                    <Image
                                                                    effect="blur"
                                                                    src={c.banner_image}
                                                                    className={clsx(`img-fluid wh-auto me-auto d-block cursor-pointer`)}
                                                                    alt={c.display_name}
                                                                    width={686}
                                                                    height={686}
                                                                    onClick={(e) => onClickEvent(e, c)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : ""}
                                    </React.Fragment>
                                : <></>}

                                {c.section_type === "OFFER" ?
                                    <React.Fragment>
                                        {c.alignment === "background" ?
                                            <div className={clsx('section_margin', styles['collection-poster'])}>
                                                <div className={clsx(styles['collection-poster-image'], 'position-relative', 'cursor-pointer')} style={{ backgroundImage: `url(${c.banner_image})` }} onClick={(e) => { onClickEvent(e, c) }}>
                                                    <div className={clsx('container', styles['collection_fullwith'])}>
                                                        <div className={styles['collection_text']}>
                                                            <div className={styles['title']} data-aos="fade-up" data-aos-duration="600">
                                                                <h3>{c.display_name}</h3>
                                                            </div>
                                                            <div className={styles['description']} data-aos="fade-up" data-aos-duration="700">
                                                                <p dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                                            </div>
                                                            <div onClick={(e) => { onClickEvent(e, c) }} className={clsx(styles['shop_now'], 'cursor-pointer')} data-aos="fade-up" data-aos-duration="800"><button className="btn" type="button">Shop Now</button></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : c.alignment === "left" ?
                                                <div className={clsx('section_margin', styles['first-poster'])}>
                                                    <div className='row'>
                                                        <div className='col-12 col-md-6 p-0'>
                                                            <Image src={c.banner_image} className='img-fluid' alt={c.display_name} />
                                                        </div>
                                                        <div className='col-12 col-md-6 d-flex align-items-center'>
                                                            <div className={styles['first-poster-content']}>
                                                                <div className={styles['first-poster-title']}>
                                                                    <p className={clsx('fs-30px', styles['text'])}>{c.display_name}</p>
                                                                </div>
                                                                <div className={styles['first-poster-foot']}>
                                                                    <p className='fs-20px' dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : c.alignment === "right" ?
                                                    <div className={clsx('section_margin', styles['first-poster'])}>
                                                        <div className='row'>
                                                            <div className='col-12 col-md-6 d-flex align-items-center'>
                                                                <div className={styles['first-poster-content']}>
                                                                    <div className={styles['first-poster-title']}>
                                                                        <p className={clsx('fs-30px', styles['text'])} dangerouslySetInnerHTML={{ __html: c.display_name }}></p>
                                                                    </div>
                                                                    <div className={styles['first-poster-foot']}>
                                                                        <p className='fs-20px' dangerouslySetInnerHTML={{ __html: c.description }}></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='col-12 col-md-6 p-0'>
                                                                <Image src={c.banner_image} className='img-fluid' alt={c.display_name} />
                                                            </div>
                                                        </div>
                                                    </div> : ""}
                                    </React.Fragment>
                                    : <></>}

                                {c.section_type === "MOST SEARCHABLE" &&
                                    <React.Fragment>
                                        {c.seleton &&
                                            <div className={clsx('section_margin', styles['symbol-product'], styles['home-product'])} id={c.section_type}>
                                                <div className="container">
                                                    <div className='row align-items-center'>
                                                        <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
                                                            <div className={styles['symbol-product-left']}>
                                                                <div className='pb-4' data-aos="fade-right" data-aos-duration="900">
                                                                    {logoDetail.length > 0 && logoDetail.map((item, i) => {
                                                                        if (item.logo_type === "FOOTER") {
                                                                            return (
                                                                                <Image effect="blur" src={item.image !== "" && item.image !== null ? item.image : noRecordFound} alt='Logo Images' key={i} className='img-fluid wh-auto' width={300} height={50} />
                                                                            )
                                                                        }
                                                                    })}
                                                                </div>
                                                                <h2 data-aos="fade-right" data-aos-duration="1000">{c.display_name}</h2>
                                                                <p className={styles['content-box-desc']} dangerouslySetInnerHTML={{ __html: c.description }} data-aos="fade-right" data-aos-duration="1200"></p>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 col-lg-8'>
                                                            <div className={clsx('pl-lg-3', styles['product-slider'])}>
                                                                <OwlCarousel className="owl-theme" options={{ dots: false, responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 992: { items: 2 }, 1200: { items: 3 }, }, loop: false, margin: 19, responsiveClass: "true", nav: true, navText: ['<i class="ic_chavron_left p-2"></i>', '<i class="ic_chavron_right p-2"></i>',], }}>
                                                                    {mostSearchableDataList.length > 0 ? mostSearchableDataList.map((c, i) => (
                                                                        <Link className={clsx('h-100', 'product-box', 'color-black', 'bg-transparent', 'card')} href={`/products/${c?.menu_name?.toLowerCase()}/${changeUrl(isEmpty(c.product_name) + "-" + isEmpty(c.pv_unique_id))}`} key={i}>
                                                                            <div className="position-relative shadow-hover">
                                                                                <div className="bg-white">
                                                                                    <figure className={clsx('figure', 'product-img-separate', 'my-auto', 'd-flex', 'align-items-center', 'justify-content-center')}>
                                                                                        <Image effect="blur" src={c.image} alt={c.product_name} width='100%' height="290px" />
                                                                                    </figure>
                                                                                </div>
                                                                                <div className={styles['product-detail']}>
                                                                                    <div className={styles['detail-height']}>
                                                                                        <div className={styles['product-desc']}>
                                                                                            <p className={styles['most-viewable']}>{c.product_name}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    )) :
                                                                        skeletonLoaderProduct.map((c, i) => (
                                                                            <div className='h-100 product-box color-black bg-transparent card' key={i}>
                                                                                <div className="position-relative shadow-hover">
                                                                                    <div className="bg-white">
                                                                                        <figure className='figure product-img-separate my-auto d-flex align-items-center justify-content-center'>
                                                                                            <Skeleton height={"100%"} />
                                                                                        </figure>
                                                                                    </div>
                                                                                    <div className="product-detail">
                                                                                        <div className="detail-height">
                                                                                            <div className='mb-1 product-desc'>
                                                                                                <Skeleton />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                </OwlCarousel>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </React.Fragment>}

                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className={clsx('section_margin', styles['CollectionProducts'])} data-aos="fade-up">
                                    <div className="container">
                                        <div className={clsx('row', styles['collection-box'])}>
                                            {c.sub_data !== undefined && c.sub_data.length > 0 && c.sub_data.map((d, i) => (
                                                <React.Fragment key={i}>
                                                    {d.section_type === "COLLECTION" ?
                                                        <React.Fragment>
                                                            <div onClick={(e) => { onClickEvent(e, d) }} className={clsx('col-12 col-sm-6 col-md-4', styles['item-poster-resp'], 'cursor-pointer')} key={i}>
                                                                <div className={clsx(styles['item-poster'], 'cursor-pointer')}>
                                                                    <div className={clsx(styles['img-box'], 'text-center')}>
                                                                        <Image effect="blur" src={d.banner_image} className='img-fluid wh-auto' width={450} height={550} alt={d.display_name} />
                                                                    </div>
                                                                    <div className={styles['content-box']} data-aos="fade-right">
                                                                        <h3 className={styles['content-box-heading']}>{d.display_name}</h3>
                                                                        <p className={styles['content-box-desc']} dangerouslySetInnerHTML={{ __html: d.description }}></p>
                                                                        <div className={styles['shop-now']}><span>Shop Now</span> <i className="ic_long_arrow_right"></i></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                        : ""}

                                                    {d.section_type === "OFFER" ?
                                                        <React.Fragment>
                                                            <div className={clsx('col-12 col-sm-6 col-lg-4', styles.CollectionOffer)} key={i}>
                                                                <div className={clsx(styles['item-poster'], 'cursor-pointer')}>
                                                                    <div className={clsx(styles['img-box'], 'text-center')}>
                                                                        <Image effect="blur" src={d.banner_image} className={clsx('img-fluid', styles.whAuto)} alt={d.display_name} width={450} height={450} onClick={(e) => { onClickEvent(e, d) }} />
                                                                    </div>
                                                                    <div className={styles['ContentOffer']}>
                                                                        <h3 className={styles['ContentTitle']}>{d.display_name}</h3>
                                                                        <div className={styles['ContentText']} dangerouslySetInnerHTML={{ __html: d.description }}></div>
                                                                        <div onClick={(e) => { onClickEvent(e, d) }} className={styles['shop_now']}>
                                                                            <button className="btn"  type="button">Shop Now</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                        : ""}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </React.Fragment>)
                })}

                {blogDataList.length > 0 &&
                    <div className={clsx(`${"HomePageBlog"}`)}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className={clsx(`heading-main-title text-center`)} data-aos="fade-up" data-aos-duration="600" >
                                        <h2 className={clsx(`heading-title`)}>
                                            Our Blogs
                                        </h2>
                                    </div>
                                </div>

                                {blogDataList.length > 0 &&
                                    blogDataList.map((blogItem) => {
                                    const event = new Date(blogItem.created_at);
                                    return (
                                        <div key={blogItem.unique_id}
                                        className={clsx('col-sm-6 col-md-6 col-lg-3', styles['product-boxes'], styles['box-resp']
                                        )} data-aos="fade-up" data-aos-duration="700"
                                        >
                                            <Link
                                                href={`/blog/${changeUrl(blogItem?.title)}`}
                                                state={{
                                                params: {
                                                    unique_id: blogItem.unique_id,
                                                    category_id: blogItem.category_id,
                                                },
                                                }}
                                            >
                                                <Card className={clsx('h-100', styles['product-box'])}>
                                                    <div className={styles['blog_img']}>
                                                        <div
                                                        className={styles['blog_pic']}
                                                        style={{
                                                            backgroundImage: `url(${isEmpty(
                                                            blogItem.featured_image
                                                            )})`,
                                                        }}
                                                        />
                                                    </div>

                                                    <div className={clsx('p-10', styles['product-detail'])}>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h3 className={styles['blog-title']}>
                                                                {blogItem.title}
                                                                </h3>
                                                                {blogItem.content.length > 0 && (
                                                                <div
                                                                    className={styles['blog-text']}
                                                                    dangerouslySetInnerHTML={{
                                                                    __html: isEmpty(blogItem.content),
                                                                    }}
                                                                />
                                                                )}
                                                            </div>

                                                        <div className="col-12">
                                                            <div className="d-flex">
                                                            <div className={styles['readmore']}>
                                                                <div className="me-2 fs-14px fw-500">
                                                                Read More
                                                                </div>
                                                            </div>
                                                            <div className={styles['readmore-icon']}>
                                                                <i className="ic_chavron_right fs-12px fw-500" />
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                }

                {isEmpty(journeyDataList) !== "" && journeyDataList.length > 0 ?
                    <div className={clsx(`${"HomePagejourney"}`)}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className={clsx(`${"heading-main-title text-center"}`)} data-aos="fade-up" data-aos-duration="600">
                                        <h2 className={clsx(`${"heading-title"}`)}>Pics or It Didn’t Happen!</h2>
                                        <p className={clsx(`${"heading-title-desc"}`)}>View our customers’ engagement moments from around the world</p>
                                    </div>
                                </div>
                                {journeyDataList.map((journey, index) => (
                                    <>
                                        <div className={clsx('col-sm-6 col-md-6 col-lg-3', styles['product-boxes'], styles['box-resp']
                                        )} key={index} data-aos="fade-up" data-aos-duration="700">
                                            <Link href={`/dashboard/viewjourney?unique_id=${journey.unique_id}&type=${journey.type ?? 'S'}`}>
                                                <Card className={clsx('h-100', styles['product-box'])}>
                                                    <div className={styles['blog_img']}>
                                                        <div className={styles['blog_pic']} style={{ backgroundImage: `url(${isEmpty(journey.image)})` }}>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
            </section>

            <Notification toastMsg={toastMsg} toastShow={toastShow} isSuccess={isSuccess} Close={() => setToastOpen()} />
        </React.Fragment>

    );
}

export default Homes;