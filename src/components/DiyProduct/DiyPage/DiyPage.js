import React, { useCallback, useEffect, useState } from "react"
import "../DiyPage/DiyPage.scss"
import Loader from "../../../CommanUIComp/Loader/Loader"
import BreadcrumbModule from "../../../CommanUIComp/Breadcrumb/breadcrumb"
import DIYPageProcessStep from "../DIYProcessStepBar/DIYPageProcessStep"
import commanService, { domain } from "../../../CommanService/commanService"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import { firstWordCapital, isEmpty } from "../../../CommanFunctions/commanFunctions"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { DIYName, DiyStepersData } from "../../../Redux/action"
import { Card } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"
import NoRecordFound from "../../../CommanUIComp/NoRecordFound/noRecordFound"
import Notification from "../../../CommanUIComp/Notification/Notification"
import Seo from "../../SEO/seo"

const DiyPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const selector = useSelector((state) => state);
    const [loader, setLoader] = useState(false);
    let [onceUpdated, setOnceUpdated] = useState(false)

    // Tost
    const [toastShow, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [AllData, setAllData] = useState([]);
    const [storeItemsObj, setStoreItemsObj] = useState({});
    // Pagination
    const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
    const [hasMore, setHasMore] = useState(true)

    //Meta
    var megaMenu = JSON.parse(sessionStorage.getItem("megaMenu"))?.navigation_data?.filter((item) => item.menu_name?.replaceAll(" ","-")?.toLowerCase() === "make-your-customization")[0];

    const metaConfig = {
        title: `${isEmpty(megaMenu?.seo_titles) !== "" ? megaMenu?.seo_titles : megaMenu?.menu_name}`,
        description: megaMenu?.seo_description,
        keywords: megaMenu?.seo_keyword,
        url: window.location.href,
    }

    //API call to get DIY setup data
    var diyAllData = [];
    const allProductData = useCallback((obj, key) => {
        commanService.postApi('/Diy', obj).then((res) => {
            if (res.data.success === 1) {
                const diyData = res.data.data;
                if (key === "1" && diyData) {
                    if (diyData.length > 0) {
                        var data = [];
                        diyAllData = [];
                        for (let c = 0; c < diyData.length; c++) {
                            data.push(diyData[c]);
                            diyAllData.push(diyData[c]);
                        }
                        setAllData(data);
                    }
                } else if (key === "0" && diyData) {
                    if (diyData.length > 0) {
                        var data = [...diyAllData];
                        for (let c = 0; c < diyData.length; c++) {
                            data.push(diyData[c]);
                        }
                        diyAllData = data;
                        setAllData(data);
                    }
                }
                setLoader(false);
                setHasMore(false);
            } else {
                setAllData([]);
                setLoader(false);
                setToastOpen(true);
                setIsSuccess(false);
                setToastMsg(res.data.message);
            }
        }).catch((error) => {
            setLoader(false);
        });
    }, [])

    //function for click to details of selected Items
    const handleClickNavigate = (item) => {
        const stepps = item;

        if (stepps?.details && Array.isArray(stepps?.details) && stepps?.router_link?.includes("start-with-a-item")) {
            const updatedSteps = [
                { position: 0, display_name: stepps?.from_display_name, vertical: stepps?.vertical_code },
                ...stepps.details.map((step, index) => ({
                    ...step,
                    position: index + 1,
                })),
                { position: stepps.details.length + 1, display_name: "Complete" },
            ];
            dispatch(DiyStepersData(updatedSteps));
        } else {
            dispatch(DiyStepersData([]));
        }
        sessionStorage.setItem("DIYVertical", item.vertical_code)
        dispatch(DIYName(item.name))
        // if (item.router_link === "/start-with-a-setting") {
        //     dispatch(isDiamoDIY(false))
        //     dispatch(isJewelDIY(true))
        //     dispatch(storeSubNavbarName("JEWELDIYSearch"))
        //     dispatch(storeSectionUrl("JEWELDIY"))
        // } else if (item.router_link === "/start-with-a-diamond") {
        //     dispatch(isJewelDIY(false))
        //     dispatch(storeSubNavbarName("JEWELDIYSearch"))
        //     dispatch(storeSectionUrl("PRODUCT_DIY"))
        //     dispatch(isDiamoDIY(true))
        // } else if (item.router_link === "/start-with-a-item") {
        //     dispatch(isItemDIYs(true))
        //     dispatch(isJewelDIY(false))
        //     dispatch(isDiamoDIY(false));
        //     dispatch(storeSectionUrl("DIY"))
        // }
        navigate(`/make-your-customization${item.router_link}`, { state: { verticalCode: item.vertical_code } })
        sessionStorage.setItem("storeUrl", `/make-your-customization${item.router_link}`);
    }

    //first call of API for DIY tab setup
    useEffect(() => {
        if (Object.keys(selector.storeEntityId).length > 0) {
            if (!onceUpdated) {
                let arr1 = [];
                for (let i = 0; i < Number(4); i++) {
                    arr1.push(i)
                }
                setStoreSkeletonArr(arr1);
                setOnceUpdated(true);
                setLoader(true);
                const data = selector.storeEntityId;
                const obj = {
                    SITDeveloper: "1",
                    a: "SetupDiyVertical",
                    store_id: data.mini_program_id,
                    tenant_id: (data.tenant_id),
                    entity_id: (data.entity_id),
                    origin: domain,
                    unique_id: "",
                }
                setStoreItemsObj(obj)
                allProductData(obj, "1")
            }
        }
    }, [selector.storeEntityId])

    return (
        <React.Fragment>
            <Seo title={metaConfig?.title} description={metaConfig?.description} keywords={metaConfig?.keywords} image={metaConfig?.image} url={metaConfig?.url} />
            {loader && <Loader />}
            <section id='product-details'>
                <div className="container">
                    <div className="row">
                        <div className="col-12 pb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-18px showing-data">Showing {AllData.length} Results</p>
                            </div>
                        </div>
                        {/* <div className="col-12 col-sm-6"></div> */}
                    </div>
                    <div className="row">
                        <InfiniteScroll className="row" dataLength={AllData !== undefined && AllData.length > 0 && AllData.length} hasMore={hasMore} loader={storeSkeletonArr.map((a, i) => {
                            return (<div className={`col-12 col-sm-6 col-md-4 col-lg-4 product-boxes box-resp`} key={i}>
                                <Link>
                                    <Card className='product-box'>
                                        <div className="position-relative">
                                            <figure className='product-img-separate my-auto d-flex align-items-center justify-content-center Skeleton'>
                                                <Skeleton height={"100%"} />
                                            </figure>
                                        </div>
                                        <div className="product-detail d-flex justify-content-between w-100">
                                            <div className="w-100">
                                                <div className="detail-height w-100">
                                                    <div className="mb-1 product-desc w-100">
                                                        <Skeleton />
                                                    </div>
                                                </div>
                                                <div className='product-price w-100'>
                                                    <h2 className="fs-15px"><Skeleton /></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>)
                        })} endMessage={!loader && AllData?.length === 0 && <NoRecordFound />}>
                            <React.Fragment>
                                {AllData?.length > 0 && (AllData.map((e, index) => {
                                    if (e.router_link === "") {
                                        return
                                    }
                                    return (
                                        <div key={index} className='col-12 col-sm-6 col-md-4 col-lg-4 product-boxes box-resp'>
                                            <div onClick={() => handleClickNavigate(e)}>
                                                <Card className='product-box'>
                                                    <div className="position-relative">
                                                        <figure className='product-img-separate my-auto d-flex align-items-center justify-content-center' >
                                                            <LazyLoadImage effect="blur" src={e?.photo} alt={e.name} loading="lazy" width='100%' height="290px" />
                                                        </figure>
                                                    </div>
                                                    <div className="product-detail d-flex justify-content-between">
                                                        <div className="">
                                                            <div className="detail-height">
                                                                <div className="mb-1 product-desc">
                                                                    <p>{isEmpty(e.name) !== "" ? e.name.split("_").join(" ") : ""}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    )
                                }))}
                            </React.Fragment>
                        </InfiniteScroll>
                    </div>
                </div>
            </section>
            <Notification toastMsg={toastMsg} toastShow={toastShow} isSuccess={isSuccess} Close={() => setToastOpen()} />
        </React.Fragment>
    )
}
export default DiyPage