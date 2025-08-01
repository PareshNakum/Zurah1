import React, { useEffect } from 'react';
import './zurahproduct.module.scss'
import Card from "react-bootstrap/Card";
import Skeleton from 'react-loading-skeleton';
import { changeUrl, isEmpty } from "./../../../CommanFunctions/commanFunctions";
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from "next/dynamic";

// Ensure jQuery is available in the browser environment
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

const ReactOwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });
// import AOS from 'aos';
// import 'aos/dist/aos.css';

const ZurahProduct = (props) => {
    const ProductList = props.ProductList;
    const display_name = props.display_name;
    const description = props.description;
    const skeletonLoader = props.productSeletone;
    const sectionWiseData = props.sectionDatas
    const navigate = useRouter();
    var megaMenu = JSON.parse(sessionStorage.getItem("megaMenu"))?.navigation_data?.filter((item) => item.product_vertical_name === sectionWiseData?.vertical_code)[0];

    useEffect(() => {
        // AOS.init({
        //     duration: 1000, // Animation duration in milliseconds
        // });
    }, []);

    const handleShowmoreProduct = () => {
        navigate.push(`/products/${megaMenu?.menu_name?.toLowerCase()}`, {
            query: {
                getAllFilteredHome: true,
                dimension: sectionWiseData?.dimension,
                item_group: sectionWiseData?.item_group,
                segments: sectionWiseData?.segment,
            },
        });
    }
    return (
        <React.Fragment>
            <div id='best-product' className='section_margin'>
                <div className='container'>
                    <div className='row'>
                        <div className='heading-main-title' data-aos="fade-up" data-aos-duration="800">
                            <h2 className='text-center heading-title'>{display_name}</h2>
                            <p className='text-center heading-title-desc' dangerouslySetInnerHTML={{ __html: description }}></p>
                        </div>
                        <div className='product-tabs' data-aos="fade-up" data-aos-duration="1000">
                            <div className='product-slider'>
                                <ReactOwlCarousel className="owl-theme" options={{ dots: false, responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 992: { items: 4 }, 1400: { items: 4 }, }, loop: false, margin: 19, responsiveClass: "true", nav: true, navText: ['<i class="ic_chavron_left p-2"></i>', '<i class="ic_chavron_right p-2"></i>',], }}>
                                    {ProductList.length > 0 ? ProductList?.slice(0, 8).map((d, i) => {
                                        const menu_name = megaMenu?.product_vertical_name === d.vertical_code ? megaMenu?.menu_name?.toLowerCase() : d.vertical_code
                                        return (
                                            <Link className="product-box card" key={i} href={`/products/${menu_name}/${changeUrl(isEmpty(d.product_name) + "-" + isEmpty(d.variant_unique_id))}`}>
                                                <div className="bg-white position-relative shadow-hover">
                                                    <figure className='figure product-img-separate my-auto d-flex align-items-center justify-content-center'>
                                                        <LazyLoadImage effect="blur" src={d.image_urls[0]} alt={d.product_name} width='332px' height="332px" />
                                                    </figure>
                                                </div>
                                                <div className='product-detail'>
                                                    <div className="detail-height">
                                                        <div className='mb-0 product-desc'>
                                                            {d.product_name}
                                                        </div>

                                                    </div>
                                                    {/* <div className='product-price'>
                                                        <div className=''>
                                                            <h2 className="fs-16px">{selector.storeCurrency}{" "}{parseFloat(d.final_total).toFixed(2)}</h2>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </Link>
                                        )
                                    }) :
                                        skeletonLoader.map((c, i) => (
                                            <Card className="product-box" key={i}>
                                                <div className="bg-white position-relative shadow-hover">
                                                    <div className="">
                                                        <figure className='figure product-img-separate my-auto d-flex align-items-center justify-content-center'>
                                                            <Skeleton height={"100%"} />
                                                        </figure>
                                                    </div>
                                                </div>
                                                <div className='product-detail'>
                                                    <div className="detail-height">
                                                        <div className='mb-1 product-desc'>
                                                            <Skeleton />
                                                        </div>
                                                        <div className=''>
                                                            <Skeleton />
                                                        </div>
                                                    </div>
                                                    {/* <div className='product-price'>
                                                        <div className=''>
                                                            <h2 className="fs-16px">
                                                                <Skeleton />
                                                            </h2>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </Card>
                                        ))
                                    }
                                </ReactOwlCarousel>
                            </div>
                            <div className='d-flex justify-content-center mt-3'><button className='btn btn-back fs-18px' onClick={handleShowmoreProduct}>View more</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ZurahProduct