import React, { useEffect, useState } from "react";
import './DIYProcessStepBar.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
    activeDIYtabs, 
    activeImageData, 
    addedDiamondData, 
    addedRingData, 
    diamondNumber, 
    diamondPageChnages, 
    editDiamondAction, 
    finalCanBeSetData, 
    isRingSelected, 
    IsSelectedDiamond, 
    jeweleryDIYimage, 
    previewImageDatas, 
    saveEmbossings, 
    selectDiamondAction, 
    selectedDiamondObject, 
    selectedJewelRing, 
    selectedRingData, 
    SelectFilterAction, 
    storeActiveFilteredData, 
    storeDiamondNumber, 
    storeEmbossingData, 
    storeFilteredData, 
    storeProdData, 
    storeSelectedDiamondData, 
    storeSelectedDiamondPrice, 
    storeSpecData 
} from "../../../Redux/action";
import { numberWithCommas } from "@/CommanFunctions/commanFunctions";

const DIYProcessStepBar = (props) => {
    const selector = useSelector((state) => state);
    const router = useRouter();
    const dispatch = useDispatch();
    
    const extractNumber = (str) => typeof (str) === "string" ? parseFloat(str.replace(/[^0-9.]/g, '')) : 0;
    
    const data = props.finalCanBeSet?.[0]?.no_of_stone_array;
    const [selectedDiamond, setSelectedDiamond] = useState(data ?? selector.storeSelectedDiamondData);
    const [totalDiamondPrice, setTotalDiamondPrice] = useState(0);

    useEffect(() => {
        if (selectedDiamond && selectedDiamond.length > 0) {
            dispatch(storeSelectedDiamondData(selectedDiamond))
            const totalPrice = selectedDiamond
                .flatMap(diamond => diamond.stone_arr || [])
                .map(item => parseFloat(item?.ex_store_price_display?.replace(/,/g, '')) || 0)
                .reduce((acc, price) => acc + price, 0);
            const formattedTotalPrice = numberWithCommas(Number(totalPrice)?.toFixed(2));
            setTotalDiamondPrice(formattedTotalPrice);
            dispatch(storeSelectedDiamondPrice(formattedTotalPrice))
        } else {
            setTotalDiamondPrice('0');
        }
    }, [props.finalCanBeSet, selectedDiamond, dispatch]);

    const certificateNumbers = selectedDiamond?.length > 0 ? selectedDiamond
        .flatMap(item => item?.stone_arr || [])
        .map(stone => stone?.st_cert_no)
        .filter(certNo => certNo) : [];

    const handleClearRing = () => {
        if (router.pathname.includes("/start-with-a-diamond")) {
            dispatch(diamondPageChnages(false));
            dispatch(editDiamondAction(""));
            dispatch(storeFilteredData({}))
            dispatch(storeActiveFilteredData({}))
            dispatch(diamondNumber(""));
            dispatch(storeDiamondNumber(""));
            dispatch(addedRingData({}))
            dispatch(activeDIYtabs("Diamond"))
            dispatch(IsSelectedDiamond(false));
            dispatch(isRingSelected(false))
            dispatch(addedDiamondData({}))
            dispatch(finalCanBeSetData([]))
            dispatch(storeSpecData({}))
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            router.push("/make-your-customization/start-with-a-diamond")
        } else {
            dispatch(storeSelectedDiamondData([]))
            dispatch(addedDiamondData({}))
            dispatch(storeSelectedDiamondPrice(""))
            dispatch(finalCanBeSetData([]))
            dispatch(storeSpecData({}))
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            dispatch(activeDIYtabs("Jewellery"))
            router.push("/make-your-customization/start-with-a-setting")
        }
    }

    const handleFirstStepClick = () => {
        if (router.pathname.includes("/start-with-a-diamond")) {
            if (selector.addedRingData.variant_data?.length) {
                router.push("/make-your-customization/start-with-a-diamond")
                dispatch(activeDIYtabs("Diamond"));
                if (props.diamondStepFirst) {
                    props.diamondStepFirst();
                }
            }
        } else {
            if (props.handleFirstStep && typeof props.handleFirstStep === "function") {
                props.handleFirstStep();
            }
        }
    }

    const handleSecondStepClick = () => {
        if (router.pathname.includes("/start-with-a-diamond") && selector.addedRingData.variant_data?.length) {
            const productName = selector.addedRingData.variant_data[0].product_name.replaceAll(" ", "-").toLowerCase();
            const variantId = selector.addedRingData.variant_data[0].variant_unique_id.toLowerCase();
            
            if (props.diamondStepTwo) {
                props.diamondStepTwo()
                dispatch(isRingSelected(false));
                dispatch(activeDIYtabs("Jewellery"));
                router.push(`/make-your-customization/start-with-a-diamond/jewellery/${productName}-${variantId}`);
            } else {
                dispatch(isRingSelected(false));
                dispatch(activeDIYtabs("Jewellery"));
                router.push(`/make-your-customization/start-with-a-diamond/jewellery/${productName}-${variantId}`);
            }
        } else {
            if (typeof props.handleBackToDiamond === "function" && props.complete === true) {
                props.handleBackToDiamond();
                dispatch(activeDIYtabs("Diamond"));
            }
        }
    }

    const handleThirdStepClick = () => {
        if (router.pathname.includes("/start-with-a-diamond")) {
            if (selector.addedRingData.variant_data?.length > 0) {
                const productName = selector.addedRingData.variant_data[0].product_name.replaceAll(" ", "-").toLowerCase();
                const variantId = selector.addedRingData.variant_data[0].variant_unique_id.toLowerCase();
                
                dispatch(isRingSelected(true));
                dispatch(activeDIYtabs("Complete"));
                router.push(`/make-your-customization/start-with-a-diamond/jewellery/${productName}-${variantId}`);
            }
        } else {
            if (typeof props.handleComplete === "function" && props.complete === true) {
                props.handleComplete()
                dispatch(activeDIYtabs("Complete"));
            }
        }
    }

    return (
        <div className="process-step-bar">
            <div className="container">
                <div className="row">
                    <div className="col-12 px-0">
                        <div className="builder-block">
                            <div className="main-build-title">
                                <div className="build-title d-flex justify-content-between">
                                    <h3 className="fs-18px">Design Your Ring</h3>
                                    <div onClick={handleClearRing} className="action link button-clear">
                                        <p>Clear Ring</p>
                                    </div>
                                </div>
                            </div>
                            <div className="builder-progress">
                                <div className="build-title d-none d-md-block">
                                    <h3 className="mb-5px">Design Your Ring</h3>
                                    <div onClick={handleClearRing} className="action link button-clear">
                                        <p>Clear Ring</p>
                                    </div>
                                </div>
                                
                                {/* First Step */}
                                <div className={`progress-group first ${
                                    (router.pathname.includes("start-with-a-diamond") && selector.activeDIYtabs === "Diamond") ? "active" : 
                                    (router.pathname.includes("start-with-a-setting") && selector.activeDIYtabs === "Jewellery") ? "active" : 
                                    router.pathname.includes("products") && selector.activeDIYtabs === "Jewellery" ? "active" : ""
                                }`}>
                                    <div 
                                        className={`item-info ${selector.jeweleryDIYimage != '' ? 'cursor-pointer' : ''}`} 
                                        onClick={handleFirstStepClick}
                                    >
                                        <div className="build-step icon-builder-setting">
                                            {router.pathname.includes("/start-with-a-diamond") ? 
                                                selector.addedDiamondData.display_image ? 
                                                    <img src={selector.addedDiamondData.display_image || "/placeholder.svg"} alt="Selected Diamond" /> : 
                                                    <i className="ic_step_diamond fs-40px"></i> : 
                                                selector.jeweleryDIYimage === "" ?
                                                    <i className="ic_step_setting fs-40px" /> :
                                                    <img src={selector.jeweleryDIYimage || "/placeholder.svg"} alt="Product Image Step 1"/>
                                            }
                                        </div>
                                        <div className='text_dark'>
                                            <div className="section-label">
                                                <p>{router.pathname.includes("start-with-a-diamond") ? "1. Select a Diamond" : "1. Design Your Ring"}</p>
                                            </div>
                                            {router.pathname.includes("/start-with-a-diamond") ? 
                                                <div className="add-links">
                                                    {selector.addedDiamondData.st_cert_no ? 
                                                        <p className="fs-12px fw-600">
                                                            <span>certificate</span>: {selector.addedDiamondData.st_cert_no}
                                                        </p> : ""
                                                    }
                                                    {(selector.storeCurrency && selector.addedDiamondData.ex_store_price_display) ? 
                                                        <p className="fs-12px fw-600">
                                                            {selector.storeCurrency} {selector.addedDiamondData.ex_store_price_display}
                                                        </p> : ""
                                                    }
                                                </div> : 
                                                props.isStone === true ?
                                                    <div className="add-links">
                                                        {(props.productSKU && props.finalTotal) ? 
                                                            <span className='fw-600'>SKU: <span>{props.productSKU}</span></span> : ''
                                                        }
                                                        {props.finalTotal ?
                                                            <div className='fw-600'>
                                                                {(selector.storeCurrency && props.finalTotal) ?
                                                                    <p className="fw-600">
                                                                        {selector.storeCurrency} {props.calculatePrice(selector.storeSpecData, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData)}
                                                                    </p> : ""
                                                                }
                                                            </div> : ""
                                                        }
                                                    </div> : ""
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Second Step */}
                                <div className={`progress-group second ${
                                    (router.pathname.includes("start-with-a-diamond") && selector.activeDIYtabs === "Jewellery") ? "active" : 
                                    (router.pathname.includes("start-with-a-setting") && selector.activeDIYtabs === "Diamond") ? "active" : 
                                    router.pathname.includes("/products") && selector.activeDIYtabs === "Diamond" ? "active" : ""
                                }`}>
                                    <div 
                                        className={`item-info ${selector.diamondDIYimage != '' ? 'cursor-pointer' : ''}`} 
                                        onClick={handleSecondStepClick}
                                    >
                                        <div className="build-step icon-builder-setting">
                                            {router.pathname.includes("/start-with-a-diamond") ? 
                                                selector.addedRingData.variant_data?.[0]?.image_urls?.[0] ? 
                                                    <img src={selector.addedRingData.variant_data?.[0]?.image_urls?.[0] || "/placeholder.svg"} alt="Selected Ring" /> : 
                                                    <i className="ic_step_setting fs-40px" /> : 
                                                selector.diamondDIYimage === "" ?
                                                    <i className="ic_step_diamond fs-40px"></i> :
                                                    <img src={selector.diamondDIYimage || "/placeholder.svg"} alt="Product Image Step 2"/>
                                            }
                                        </div>
                                        <div className='text_dark'>
                                            <div className="section-label">
                                                <p>{router.pathname.includes("start-with-a-diamond") ? "2. Select a Ring" : "2. Select a Diamond"}</p>
                                            </div>
                                            {router.pathname.includes("/start-with-a-diamond") ?
                                                <div className="add-links">
                                                    {selector.addedRingData.variant_data?.length ? 
                                                        <span className='fw-600'>SKU: <span>{selector.addedRingData.variant_data?.[0].product_sku}</span></span> : ''
                                                    }
                                                    {selector.addedRingData.final_total_display ?
                                                        <div className='fw-600'>
                                                            {(selector.storeCurrency && selector.addedRingData.final_total_display) ?
                                                                <p className="fw-600">
                                                                    {selector.storeCurrency} {numberWithCommas(props.calculatePrice(selector.storeSpecData ?? selector.addedRingData, props.selectedOffer, props.isEngraving, selector.saveEmbossings, selector.storeEmbossingData))}
                                                                </p> : ""
                                                            }
                                                        </div> : ""
                                                    }
                                                </div> :
                                                selectedDiamond && (
                                                    <div className="add-links">
                                                        {totalDiamondPrice !== "0" && certificateNumbers?.length > 0 && (
                                                            <p className="fs-12px fw-600">
                                                                <span>certificate</span>: {certificateNumbers.toString()}
                                                            </p>
                                                        )}
                                                        {totalDiamondPrice !== "0" && certificateNumbers?.length > 0 && (
                                                            <p className="fs-12px fw-600">
                                                                {selector.storeCurrency} {numberWithCommas(selector.storeSelectedDiamondPrice)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Third Step */}
                                <div className={`progress-group third d-none d-md-block ${selector.activeDIYtabs === "Complete" ? "active" : ""}`}>
                                    <div 
                                        className={`item-info ${selector.diamondDIYimage != '' ? 'cursor-pointer' : ''}`} 
                                        onClick={handleThirdStepClick}
                                    >
                                        <div className="build-step icon-builder-setting">
                                            {router.pathname.includes("/start-with-a-diamond") ? 
                                                selector.addedRingData.variant_data?.[0]?.image_urls?.[0] ? 
                                                    <img src={selector.addedRingData.variant_data?.[0]?.image_urls?.[0] || "/placeholder.svg"} alt="Complete Ring" /> : 
                                                    <i className="ic_certi_diamond_jewelry fs-40px"></i> : 
                                                (props.complete === true && selector.jeweleryDIYimage !== "") ? 
                                                    <img src={selector.jeweleryDIYimage || "/placeholder.svg"} alt="Product Image Step 3" /> :
                                                    <i className="ic_certi_diamond_jewelry fs-40px"></i>
                                            }
                                        </div>
                                        <div className='text_dark'>
                                            <div className="section-label">
                                                <p>3. Complete</p>
                                            </div>
                                            <div className="add-links">
                                                {router.pathname.includes("/start-with-a-diamond") ? 
                                                    (selector.storeCurrency && (selector.addedDiamondData.final_total_display || selector.addedRingData.final_total_display)) ? 
                                                        <div className='fs-6 fw-600'>
                                                            {numberWithCommas((extractNumber(props.calculatePrice(selector.storeSpecData ?? props.specificationData, props.selectedOffer, props.saveEngraving, selector.saveEmbossings, selector.storeEmbossingData)) + extractNumber(selector.addedDiamondData.final_total_display)).toFixed(2))}
                                                        </div> : "" : 
                                                    (selector.storeCurrency && props.salesTotalPrice) ? 
                                                        <div className='fs-6 fw-600'>
                                                            {selector.storeCurrency} {numberWithCommas((extractNumber(props.calculatePrice(selector.storeSpecData, props.selectedOffer, props.isEngraving, props.isEmbossing, props.embossingData)) + extractNumber(selector.storeSelectedDiamondPrice)).toFixed(2))}
                                                        </div> : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DIYProcessStepBar
