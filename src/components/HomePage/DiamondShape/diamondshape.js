import React, { useEffect } from 'react';
import './diamondshape.module.scss';
import Skeleton from 'react-loading-skeleton';
import { changeUrl, isEmpty } from "./../../../CommanFunctions/commanFunctions";
import { useDispatch } from 'react-redux';
import { diamondPageChnages } from "../../../Redux/action";
import Link from 'next/link';
import dynamic from "next/dynamic";

// Ensure jQuery is available in the browser environment
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

const ReactOwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });
const DiamondShape = (props) => {
    useEffect(() => {
        // AOS.init({
        //   duration: 1000, // Animation duration in milliseconds
        // });
    }, []);

    const diamondList = props.diamondList;
    const displayName = props.displayName;
    const description = props.description;
    const skeletonLoader = props.skeletonLoader;
    const verticalCode = props.verticalCode;

    var url = '/certificate-diamond/shape';
    if (verticalCode == 'LGDIA') {
        url = '/lab-grown-certified-diamond/shape'
    }

    const dispatch = useDispatch();
    return (
        <React.Fragment>
            <div id='shape-design' className='section_margin ShopeByStone'>
                <div className='container'>
                    <div className='shape-design-row'>
                        <div className='heading-main-title' data-aos="fade-up">
                            <h2 className='text-center heading-title' >{displayName}</h2>
                            <p className='text-center heading-title-desc' dangerouslySetInnerHTML={{ __html: description }}></p>
                        </div>
                        <div className='shape-design-icon' data-aos="fade-up">
                            <ReactOwlCarousel className="owl-theme" options={{ dots: false, responsive: { 0: { items: 4 }, 576: { items: 5 }, 768: { items: 6 }, 992: { items: 9 }, 1400: { items: 9 }, }, loop: false, margin: 0, nav: true, responsiveClass: "true", navText: ['<i class="ic_chavron_left p-2"></i>', '<i class="ic_chavron_right p-2"></i>',], }}>
                                {!skeletonLoader ? diamondList.length > 0 && diamondList.map((d, index) => (
                                    <Link href={`${url}/${changeUrl(isEmpty(d.name) === "" ? "" : d.name)}`} className='stone-area' key={index} onClick={() => dispatch(diamondPageChnages(false))}>
                                        <div className='trans-effect'>
                                            <div className="shape-icon">
                                                <i className={`${d.icon}`}></i>
                                            </div>
                                            <p className='stone-name text-center'>{d.name.split(" ")?.join(" ")?.toLowerCase()}</p>
                                        </div>
                                    </Link>
                                )) :
                                    <Link href={null} className='stone-area w-100'>
                                        <div className='trans-effect w-100'>
                                            <div className="shape-icon w-100">
                                                <Skeleton height={"100%"} width={"100%"} />
                                            </div>
                                            <Skeleton />
                                        </div>
                                    </Link>
                                }
                            </ReactOwlCarousel>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default DiamondShape;