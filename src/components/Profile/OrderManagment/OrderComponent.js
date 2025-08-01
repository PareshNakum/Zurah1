import React, { useEffect, useMemo, useState } from "react";
import '../Profile.module.scss';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { isEmpty, numberWithCommas, jewelVertical, safeParse, extractNumber, changeUrl } from '../../../CommanFunctions/commanFunctions';
import NoRecordFound from '../../../CommanUIComp/NoRecordFound/noRecordFound';
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import { activeDIYtabs, addedDiamondData, addedRingData, diaColorType, diamondNumber, diamondPageChnages, editDiamondAction, finalCanBeSetData, isRingSelected, IsSelectedDiamond, storeActiveFilteredData, storeDiamondNumber, storeFilteredData, storeProdData, storeSelectedDiamondData, storeSelectedDiamondPrice, storeSpecData } from "../../../Redux/action";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import EmbossingPreview from "./Embossingreview";
import Image from "next/image";

function OrderComponent(props) {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useRouter();
    const selectedTab = props.selectedTab
    // const [orderDataList, setOrderDataList] = useState(props.orderDataList || selector.orderDataArray);
    const orderDataList = props.orderDataList;

    const PendingData = props.PendingData
    const pagination = props.pagination
    const changeOrderTab = props.changeOrderTab
    const changePagination = props.changePagination
    const searchResetData = props.searchResetData;
    const orderCount = props.orderCount;
    const cancelCount = props.cancelCount;

    const [filterToggle, setFilterToggle] = useState(false);
    const [activeTab, setActiveTab] = useState("Order_")
    let [searchDetails, setSearchDetails] = useState({
        orderId: '',
        consumerName: '',
        mobileNo: '',
        status: ''
    });
    const [applyFilter, setApplyFilter] = useState(false);

    //EMbossing
    const [ebossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] = useState(false)
    const [activeImg, setActiveImg] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)

    //filter order 
    const filterToggles = () => {
        var toggle = filterToggle
        toggle = !toggle;
        setFilterToggle(toggle)
    }

    const searchOrderData = () => {
        if (isEmpty(searchDetails.orderId) !== "" || isEmpty(searchDetails.consumerName) !== "" || isEmpty(searchDetails.mobileNo) !== "" || isEmpty(searchDetails.status) !== "") {
            setApplyFilter(true);
            searchResetData(searchDetails);
        } else if (applyFilter == true) {
            setApplyFilter(false);
            searchResetData(searchDetails);
        }
    }

    const resetOrderData = () => {
        if (applyFilter == true) {
            var data = {
                orderId: '',
                consumerName: '',
                mobileNo: '',
                status: ''
            }
            setSearchDetails(data);
            setApplyFilter(false);
            searchResetData(data);
        }
    }


    if (isEmpty(orderDataList) != '') {
        for (let c = 0; c < orderDataList.length; c++) {
            var status = orderDataList[c]['data'][0]['str_document_status'];
            if (isEmpty(status) == '') {
                status = (orderDataList[c]['data'][0][0]['str_document_status'])
            }
            orderDataList[c]['status'] = status;
        }
    }

    function handleOrderTab(tabName) {
        changeOrderTab(tabName);
        if (tabName === "order") {
            props.setSelectedTab("Order_");
            if (params.id === "my-order") {
                setActiveTab("Order_");
            }
        } else if (tabName === "Cancelled") {
            props.setSelectedTab("Cancelled_");
            if (params.id === "my-order") {
                setActiveTab("Cancelled_");
            }
        }
    };

    // useEffect(() => {
    //     setOrderDataList(selector.orderDataArray);
    // }, [selectedTab, orderCount]);

    useMemo(() => {
        if (params.orderId !== undefined) {
            if (window.location.pathname.includes("order-details") && params.orderId) {
                props.handleOrderDetailShow(params.orderId, "Order");
            }
        }
        props.setSelectedTab("Order_");
    }, [])

    const navigateFromOrder = (value, e) => {
        // const data = e.data.filter((item)=>item.product_diy === "DIY");

        var url = '';
        if (e?.data?.[0]?.product_diy === "DIY" && value?.vertical_code == "JEWEL") {
            dispatch(storeSelectedDiamondData([]))
            dispatch(addedDiamondData({}))
            dispatch(storeSelectedDiamondPrice(""))
            dispatch(finalCanBeSetData([]));
            dispatch(editDiamondAction(""));
            dispatch(storeFilteredData({}));
            dispatch(storeActiveFilteredData({}));
            dispatch(diamondNumber(""));
            dispatch(storeDiamondNumber(""));
            dispatch(addedRingData({}));
            dispatch(IsSelectedDiamond(false));
            dispatch(storeProdData({}));
            dispatch(storeSpecData({}));
            dispatch(isRingSelected(false));
            dispatch(activeDIYtabs("Jewellery"));
            const link = `/make-your-customization/start-with-a-setting/${changeUrl(value.product_name + '-' + value.pv_unique_id)}`
            // window.open(url,'_blank','');
            navigate.push(link)
        } else if (
            value?.product_diy === "DIY" &&
            value.vertical_code !== "JEWEL"
        ) {

            const verticalCode = value?.vertical_code;
            const title = changeUrl(
                value?.product_name + "-" + value.pv_unique_id
            );

            navigate.push(`/products/${verticalCode}/${title}`);
        } else {
            var megaMenu = JSON.parse(typeof window !== "undefined" && sessionStorage.getItem("megaMenu"))?.navigation_data
            // for (let c = 0; c < megaMenu.length; c++) {
            //     if (megaMenu[c].product_vertical_name == value.vertical_code) {
            // if (value.vertical_code === "FRAME") {
            //     const linkFrame = `/products/FRAME/${changeUrl(value.product_name+ "-" + value.pv_unique_id)}`;
            //     navigate.push(linkFrame)
            //   }
            //   if (value.vertical_code === "WATCH") {
            //     const linkWatch = `/products/WATCH/${changeUrl(value.product_name+ '-' +value.pv_unique_id)}`;
            //     navigate.push(linkWatch)
            //   }
            //   if (value.vertical_code === "FOOTW") {
            //    const linkFoot = `/products/FOOTW/${changeUrl(value.product_name+'-'+value.pv_unique_id)}`;
            //    navigate.push(linkFoot)
            //   }
            if (value.vertical_code != 'DIAMO' && value.vertical_code != 'LGDIA' && value.vertical_code != 'GEDIA') {
                // var product_name = (value.product_name.replaceAll(' ', '-') + '-' + value.pv_unique_id).toLowerCase();
                // var sub_menu = megaMenu[c].sub_menu;
                // for (let d = 0; d < sub_menu.length; d++) {
                //     if (sub_menu[d].sub_category == 'mi_jewellery_product_type') {
                //         var details = sub_menu[d]['detaills'];
                //         for (let e = 0; e < details.length; e++) {
                //             if (value.jewellery_type == details[e]['code']) {
                //                 url = '';
                //                 url = megaMenu[c].router_link + '/type/' + (details[e]['title']).toLowerCase() + '/' + product_name
                //             }
                //         }
                //     }
                // }
                const menuName = megaMenu?.filter((item)=>item.product_vertical_name === value.vertical_code)[0]
                url = `/products/${menuName?.menu_name?.toLowerCase()}/${changeUrl(value.product_name + '-' + value.pv_unique_id)}`;

            }
            // else {
            //     dispatch(diamondPageChnages(true));
            //     dispatch(diamondNumber(value?.cert_no));
            //     dispatch(diaColorType(isEmpty(value?.st_color_type)));
            //     if (value.vertical_code == 'DIAMO') {
            //         url = '/certificate-diamond/shape/cart';
            //     }
            //     if (value.vertical_code == 'LGDIA') {
            //         url = '/lab-grown-diamond/shape/cart';
            //     }
            //     if (value.vertical_code == 'GEDIA') {
            //         url = '/lab-grown-gemstone/shape/cart';
            //     }
            // }
            // }
            // }
            setTimeout(() => {
                if (value.vertical_code != 'DIAMO' && value.vertical_code != 'LGDIA' && value.vertical_code != 'GEDIA') {
                    window.open(url, '_blank', '');
                }
            });
        }
    }

    return (
        <div>
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
                <h2 className="py-2 fs-28px profile-title">My Order</h2>
                <button className="btn btn-filter" onClick={() => { filterToggles(); }}><i className="ic_filter" /></button>
            </div>
            <div>
                <Tab.Container id="center-tabs-example" defaultActiveKey={params.id === "my-order" || window.location.pathname.includes("order-details") ? activeTab : selectedTab}>
                    <Row>
                        <Col lg={12} className="nav-pills">
                            <Nav variant="pills" className="flex-row nav-menu-order mb-3 ordersTab" >
                                <Nav.Item onClick={() => handleOrderTab("order")}>
                                    <Nav.Link eventKey="Order_">
                                        <div className="nav-text" >Order ({orderCount})</div>
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link eventKey="Cancelled_" onClick={() => { handleOrderTab("Cancelled") }}>
                                        <div className="nav-text">Cancelled ({cancelCount})</div>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={12}>
                            {filterToggle === true ?
                                <>
                                    <div className="addAddressFrom2 mb-2">
                                        <div className="addAddressFrom-details">
                                            <label>Order ID</label>
                                            <input placeholder="Enter Order ID" autoComplete="off" name="order_id" className={`form-control`} value={searchDetails.orderId} onChange={(e) => { setSearchDetails({ ...searchDetails, "orderId": e.target.value, }); }} />
                                        </div>
                                        <div className="addAddressFrom-details">
                                            <label>Consumer Name</label>
                                            <input placeholder="Enter Consumer Name" autoComplete="off" name="consumer_name" className={`form-control`} value={searchDetails.consumerName} onChange={(e) => { setSearchDetails({ ...searchDetails, "consumerName": e.target.value, }); }} />
                                        </div>
                                        <div className="addAddressFrom-details">
                                            <label>Mobile No.</label>
                                            <input placeholder="Enter Mobile No." autoComplete="off" name="mobile_no" className={`form-control`} value={searchDetails.mobileNo} onChange={(e) => { setSearchDetails({ ...searchDetails, "mobileNo": e.target.value, }); }} />
                                        </div>
                                        <div className="addAddressFrom-details">
                                            <label>Status</label>
                                            {selectedTab == 'Order_' ?
                                                <select placeholder="Select Status" autoComplete="off" name="status" className={`form-control`} value={searchDetails.status} onChange={(e) => { setSearchDetails({ ...searchDetails, "status": e.target.value, }); }}>
                                                    <option>Select Status</option>
                                                    <option value='Ordered'>Ordered</option>
                                                    <option value='Shipped'>Shipped</option>
                                                    <option value='Out For Delivery'>Out For Delivery</option>
                                                    <option value='Pickup From Store'>Pickup From Store</option>
                                                    <option value='Delivered'>Delivered</option>
                                                </select>
                                                :
                                                <select placeholder="Select Status" autoComplete="off" name="status" className={`form-control`} value={searchDetails.status} onChange={(e) => { setSearchDetails({ ...searchDetails, "status": e.target.value, }); }}>
                                                    <option>Select Status</option>
                                                    <option value='0'>Pending</option>
                                                    <option value='2'>Cancelled</option>
                                                    <option value='3'>Failed</option>
                                                </select>
                                            }
                                        </div>
                                        <div className="addAddressFrom-details">
                                            <label></label>
                                            <div className="button-details">
                                                <button onClick={() => searchOrderData()} className="btn button-thamebalck">Search</button>
                                                <button className="btn button-thamebalck ms-3" onClick={() => { resetOrderData(); }}>Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : ''}
                            <Tab.Content>
                                {(selectedTab === "Order_") || (selectedTab === 'Shipped_') || (selectedTab === 'Delivery_') || (selectedTab === 'Delivered_') || selectedTab === "JourneyCatalogue" ?
                                    <Tab.Pane eventKey={selectedTab}>
                                        {orderDataList.length == 0 ?
                                            !props.loading && !props.skeletonLoader && <NoRecordFound />
                                            :
                                            <React.Fragment>
                                                <div className="">
                                                    <div>
                                                        {/* <h4 className="profile-title">{selectedTab === "Order_" ? "Order" : selectedTab === "Shipped_" ? "Order Shipped" : selectedTab === "Delivery_" ? "Order On Delivery" : selectedTab === "Delivered_" ? "Order Delivered" : ''}</h4> */}
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                        <div className="my-2">
                                                            <p className='profile-sub-heading'>Showing all {props.totalOrderRow} results&nbsp;</p>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <React.Fragment>
                                                                <div>
                                                                    <select className="border me-2 h-33px" aria-label="Default select example" value={props.perPage} onChange={(e) => changePagination(e, "Order")}>
                                                                        <option value={"25"}>25</option>
                                                                        <option value={"50"}>50</option>
                                                                        <option value={"100"}>100</option>
                                                                    </select>
                                                                </div>
                                                                <div className="">
                                                                    <nav aria-label="Page navigation example">
                                                                        <ul className="pagination mb-0">
                                                                            {props.count > 1 ?
                                                                                <li className="page-item previous-next" onClick={() => pagination("left", "Order")}>
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Previous">
                                                                                        <span aria-hidden="true">«</span>
                                                                                    </a>
                                                                                </li> :
                                                                                <li className="page-item disabled">
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Previous">
                                                                                        <span aria-hidden="true">«</span>
                                                                                    </a>
                                                                                </li>}
                                                                            <li className="page-item"><a className="page-link">{props.pageValue}</a></li>
                                                                            {props.count < props.totalPages ?
                                                                                <li className="page-item previous-next" onClick={() => pagination("right", "Order")}>
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Next">
                                                                                        <span aria-hidden="true">»</span>
                                                                                    </a>
                                                                                </li> :
                                                                                <li className="page-item disabled">
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Next">
                                                                                        <span aria-hidden="true">»</span>
                                                                                    </a>
                                                                                </li>}
                                                                        </ul>
                                                                    </nav>
                                                                </div>
                                                            </React.Fragment>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    {orderDataList.length > 0 && orderDataList.map((ordered, io) => {
                                                        let date = ""
                                                        let store_type = '';
                                                        let store_name = '';
                                                        let consumer_name = '';
                                                        if (isEmpty(ordered['data'][0]['so_sales_date']) !== "") {
                                                            date = ordered['data'][0]['so_sales_date'];
                                                            store_type = ordered['data'][0]['store_type'];
                                                            store_name = ordered['data'][0]['store_id'] + ' - ' + ordered['data'][0]['store_name'];
                                                            consumer_name = ordered['data'][0]['consumer_name'];
                                                        } else {
                                                            date = ordered['data'][0][0]['so_sales_date']
                                                            store_type = ordered['data'][0][0]['store_type'];
                                                            store_name = ordered['data'][0][0]['store_id'] + ' - ' + ordered['data'][0][0]['store_name'];
                                                            consumer_name = ordered['data'][0][0]['consumer_name'];
                                                        }
                                                        let newDate = new Date(date).toLocaleDateString('en-GB', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })
                                                        return (
                                                            <div className="MyOrder_info" key={io}>
                                                                <div className='order-list-row'>
                                                                    <div className='order-list-left'>
                                                                        <div className='ordered_info_id '>
                                                                            <div className='ordered_info_div'><b>Order # </b>{ordered.main_so_order_id} </div> <span className='px-2'>|</span>
                                                                            <div className='ordered_info_div'><b>Ordered on</b> : {newDate}</div> <span className='px-2'>|</span>
                                                                            <div className='ordered_info_div'><b>Order Status </b> : {ordered.status}</div>
                                                                        </div>
                                                                        {store_type === "B2C" ?
                                                                            <div className='ordered_info_id'>
                                                                                <div className='ordered_info_div'><b>Store Name </b> : {store_name}</div>
                                                                            </div>
                                                                            :
                                                                            <div className='ordered_info_id '>
                                                                                <div className='ordered_info_div'><b>Store Type </b> : {store_type}</div><span className='px-2'>|</span>
                                                                                <div className='ordered_info_div'><b>Store Name </b> : {store_name}</div>
                                                                                {
                                                                                    isEmpty(consumer_name) != '' ?
                                                                                        <>
                                                                                            <span className='px-2'>|</span>
                                                                                            <div className='ordered_info_div'><b>Consumer Name </b> : {consumer_name}</div>
                                                                                        </>
                                                                                        : ''
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className='order-list-right text-end'>
                                                                        <span className="OrderDetail" onClick={() => { props.detailShow(ordered, "Order"); navigate.push(`/order-details/${ordered.main_so_order_id}`) }}>Order Detail</span>
                                                                    </div>
                                                                    <div className="order-list-body">
                                                                        <div className="order-single-product">
                                                                            {(ordered.data || []).length > 0 && (ordered.data || []).map((singleOrder, i22) => {
                                                                                if (singleOrder.length == undefined) {
                                                                                    return (
                                                                                        <React.Fragment key={i22}>
                                                                                            <div className="order-list-product">
                                                                                                <div className="d-sm-flex ">
                                                                                                    <div className='print-diy-img'>
                                                                                                        <Image alt="" src={(singleOrder.photo == null || "") ? "https://via.placeholder.com/500X500" : singleOrder.photo} className='img-fluid w-100' />
                                                                                                        {
                                                                                                            singleOrder.length > 1 && (singleOrder.photo !== null || '') ?
                                                                                                                <div className='print-image position-absolute bottom-0 end-0'>
                                                                                                                    <Image alt="" src={singleOrder.photo} className="img-fluid" />
                                                                                                                </div> : ""
                                                                                                        }
                                                                                                    </div>

                                                                                                    <div className='single-product-desc'>
                                                                                                        <div className='order-title' onClick={() => navigateFromOrder(singleOrder, ordered)}>{singleOrder.product_name}</div>
                                                                                                        <div className='product-desc'>
                                                                                                            <div className='mb-1 product_sku'>
                                                                                                                {singleOrder.vertical_code === "LDIAM" || singleOrder.vertical_code === "GEMST" ? "" : jewelVertical(singleOrder.vertical_code) === true ?
                                                                                                                    <>
                                                                                                                        <div className="prodect_info-inner mb-1">
                                                                                                                            <p className='fs-14px'><span className="sku-title">SKU </span> : {singleOrder.product_sku}</p>
                                                                                                                        </div>
                                                                                                                        <div className='prodect_info-inner'>
                                                                                                                            {isEmpty(singleOrder.metal_type) === "" ? "" : <div className='detailsName '><b>Metal Type</b> <span>{singleOrder.metal_type}</span> </div>}
                                                                                                                            {singleOrder.gold_wt != '' && singleOrder.gold_wt > 0 ?
                                                                                                                                <div className='detailsName'><b>Gold Weight</b> <span> {singleOrder.gold_wt} {singleOrder.gold_wt_unit}</span> </div>
                                                                                                                                : ''}
                                                                                                                            {singleOrder.dia_wt != '' && singleOrder.dia_wt > 0 ?
                                                                                                                                <div className='detailsName'><b>Diamond Weight</b> <span>{singleOrder.dia_wt} {singleOrder.dia_first_unit}</span> </div>
                                                                                                                                : ''}
                                                                                                                            {singleOrder.col_wt != '' && singleOrder.col_wt > 0 ?
                                                                                                                                <div className='detailsName'><b>Gemstone Weight</b> <span>{singleOrder.col_wt} {singleOrder.col_first_unit}</span> </div>
                                                                                                                                : ''}
                                                                                                                            {isEmpty(singleOrder.offer_code) != '' ?
                                                                                                                                <div className='detailsName'><b>Offer</b> <span>{singleOrder.offer_code}</span> </div>
                                                                                                                                : ''}
                                                                                                                        </div>
                                                                                                                    </>
                                                                                                                    : <p className='fs-14px mb-2'><span className="sku-title">Certificate</span> :  {singleOrder.cert_lab} {singleOrder.variant_number}</p>}
                                                                                                            </div>
                                                                                                            {
                                                                                                                safeParse(singleOrder?.service_json) !== null && safeParse(singleOrder?.service_json)?.length > 0 ?
                                                                                                                    <div className="d-flex gap-2 align-items-center order-service">
                                                                                                                        {safeParse(singleOrder?.service_json)?.map((service, i) => {
                                                                                                                            return (
                                                                                                                                <React.Fragment key={i}>
                                                                                                                                    {service.service_code === 'ENGRAVING' && service.service_type === "Special" && isEmpty(service?.text) !== "" &&
                                                                                                                                        isEmpty(service?.text) !== null ? (
                                                                                                                                        <div className="order-engraving">
                                                                                                                                            <a style={{ cursor: 'text' }}>Engraving : <span className="fw-normal">{service?.text}</span></a>
                                                                                                                                        </div>
                                                                                                                                    ) : ""}
                                                                                                                                    {service.service_code === 'EMBOSSING' && service.service_type === "Special" && service.image !== "" ?
                                                                                                                                        <div className="order-engraving">
                                                                                                                                            <a style={{ cursor: 'text' }}>Embossing : {service.image?.map((item, k) => {
                                                                                                                                                if (k > 0) {
                                                                                                                                                    return
                                                                                                                                                }
                                                                                                                                                return (
                                                                                                                                                    <span className="ms-1 text-underline image_previews" key={k} onClick={() => { setEmbossingPreviewModalBaseView(true); setActiveImg(service.image.filter((elm) => elm.embImage !== "")) }}>
                                                                                                                                                        <Image alt="" className="" src={item?.embImage} />
                                                                                                                                                    </span>
                                                                                                                                                )
                                                                                                                                            })}</a>
                                                                                                                                        </div> : ""}
                                                                                                                                    {service.service_type === "Normal" && service.is_selected === '1' && (
                                                                                                                                        <div className="form-check mb-0" key={service.service_code}>
                                                                                                                                            <input
                                                                                                                                                className="form-check-input form-check-input_fill"
                                                                                                                                                type="checkbox"
                                                                                                                                                checked={service.is_selected === '1'}
                                                                                                                                            />
                                                                                                                                            <label
                                                                                                                                                className="form-check-label"
                                                                                                                                                htmlFor={`service_${service.service_code}`}>
                                                                                                                                                {service.service_name}
                                                                                                                                            </label>
                                                                                                                                            {service.price ? (
                                                                                                                                                <span className="fw-semibold">
                                                                                                                                                    {"(" +
                                                                                                                                                        extractNumber(service.price).toFixed(2) +
                                                                                                                                                        " " +
                                                                                                                                                        service.currency +
                                                                                                                                                        ")"}
                                                                                                                                                </span>
                                                                                                                                            ) : (
                                                                                                                                                ""
                                                                                                                                            )}
                                                                                                                                        </div>
                                                                                                                                    )}
                                                                                                                                </React.Fragment>)
                                                                                                                        })}
                                                                                                                    </div>
                                                                                                                    : null}
                                                                                                        </div>
                                                                                                        {/* <div className="Quantity_pz">
                                                                                                            <div className="Quantity_text">
                                                                                                                <p className='mb-0 fs-14px'><span>Quantity</span> : {singleOrder.quantity}</p>
                                                                                                            </div>
                                                                                                            <p className='mt-2 profile-title'>
                                                                                                                {
                                                                                                                    ordered?.base_currency !== ordered.currency ?
                                                                                                                        <p className="fs-15px text-end">{ordered?.base_currency} {numberWithCommas((ordered?.entity_net_amount).toFixed(2))}</p> : ""
                                                                                                                }
                                                                                                                <span className="fs-18px fw-600">
                                                                                                                    {ordered.currency}&nbsp;{(singleOrder.display_net_amount)} {singleOrder?.offer_code !== "" && <span className="offer-price" style={{ fontSize: "15px" }} >{ordered.currency} {(numberWithCommas((Number(singleOrder?.line_price) * (singleOrder?.quantity)).toFixed(2)))}</span>}
                                                                                                                </span>
                                                                                                            </p>
                                                                                                        </div> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    )
                                                                                } else {
                                                                                    if (singleOrder.length >= 2) {
                                                                                        let jewelImage = ""
                                                                                        let Diamond = ""
                                                                                        let name = ""
                                                                                        let status = ""
                                                                                        singleOrder.map((t2, i2) => {
                                                                                            if (jewelVertical(t2.vertical_code) === true) {
                                                                                                if (isEmpty(t2.photo) !== "") {
                                                                                                    jewelImage = isEmpty(t2.photo)
                                                                                                } else {
                                                                                                    jewelImage = isEmpty(t2.photo)
                                                                                                }
                                                                                                name = t2.product_name
                                                                                                status = t2.str_document_status
                                                                                            } else if (t2.vertical_code === "DIAMO" || t2.vertical_code === "LGDIA" || t2.vertical_code === "GEDIA") {
                                                                                                Diamond = t2.photo
                                                                                            }
                                                                                            return t2
                                                                                        })
                                                                                        let total_price = 0;

                                                                                        if (singleOrder.types) {
                                                                                            (singleOrder.types || []).map((a) => {
                                                                                                if (typeof (a) === "object") {
                                                                                                    total_price += isEmpty(Number(a.price))
                                                                                                    return a
                                                                                                }
                                                                                            })
                                                                                        }

                                                                                        if (jewelImage === "") {
                                                                                            jewelImage = "https://via.placeholder.com/500X500"
                                                                                        }
                                                                                        if (Diamond === "") {
                                                                                            Diamond = "https://via.placeholder.com/500X500"
                                                                                        }
                                                                                        return (
                                                                                            <div className='order-list-product' key={i22}>
                                                                                                {singleOrder.types && (singleOrder.types || []).length > 0 && (singleOrder.types || []).map((order1, i4) => {
                                                                                                    return (
                                                                                                        <div className='d-sm-flex' key={i4}>
                                                                                                            <div className='print-diy-img'>
                                                                                                                <div className="" >
                                                                                                                    <Image src={order1.item_image} alt=""  className='img-fluid' />
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div className='single-product-desc'>
                                                                                                                {order1.type !== "" ? <div className="product-desc-title mb-2 fw-600">{order1.type}</div> : ""}
                                                                                                                <div className='order-title' onClick={() => navigateFromOrder(order1, ordered)}>{order1.product_name}</div>
                                                                                                                <div className='product_sku mb-1'>
                                                                                                                    {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? "" : jewelVertical(order1.vertical_code) === true ?
                                                                                                                        <React.Fragment>
                                                                                                                            <div className="prodect_info-inner">
                                                                                                                                <p className='fs-14px mb-1'><span className="sku-title">SKU </span> : {order1.product_sku}</p>
                                                                                                                            </div>
                                                                                                                            <div className='prodect_info-inner'>
                                                                                                                                {isEmpty(order1.short_summary.metal_type) != '' ?
                                                                                                                                    <div className='detailsName mb-1 '><b>Metal Type</b> <span>{order1.short_summary.metal_type}</span> </div>
                                                                                                                                    : ''}
                                                                                                                                {isEmpty(order1.short_summary.gold_wt) != '' && order1.short_summary.gold_wt > 0 ?
                                                                                                                                    <div className='detailsName mb-1 '><b>Gold Weight</b> <span> {order1.short_summary.gold_wt} {order1.short_summary.gold_wt_unit}</span> </div>
                                                                                                                                    : ''}
                                                                                                                                {isEmpty(order1.short_summary.dia_wt) != '' && order1.short_summary.dia_wt > 0 ?
                                                                                                                                    <div className='detailsName mb-1 '><b>Diamond Weight</b> <span>{order1.short_summary.dia_wt} {order1.short_summary.dia_first_unit}</span> </div>
                                                                                                                                    : ''}
                                                                                                                                {isEmpty(order1.short_summary.col_wt) != '' && order1.short_summary.col_wt > 0 ?
                                                                                                                                    <div className='detailsName mb-1 '><b>Gemstone Weight</b> <span>{order1.short_summary.col_wt} {order1.short_summary.col_first_unit}</span> </div>
                                                                                                                                    : ''}
                                                                                                                                {isEmpty(order1.short_summary.offer_code) != '' ?
                                                                                                                                    <div className='detailsName mb-1 '><b>Offer</b> <span>{order1.short_summary.offer_code}</span> </div>
                                                                                                                                    : ''}
                                                                                                                            </div>
                                                                                                                            {safeParse(order1?.service_json) !== null && safeParse(order1?.service_json)?.length > 0 ?
                                                                                                                                <div className='d-flex gap-2 align-items-center order-service'>
                                                                                                                                    {safeParse(order1?.service_json)?.map((service, i) => {
                                                                                                                                        return (
                                                                                                                                            <React.Fragment key={i}>
                                                                                                                                                {service.service_code === 'ENGRAVING' && service.service_type === "Special" && isEmpty(service?.text) !== "" &&
                                                                                                                                                    isEmpty(service?.text) !== null ? (
                                                                                                                                                    <div className="order-engraving">
                                                                                                                                                        <a style={{ cursor: 'text' }}>Engraving : <span className="fw-normal">{service?.text}</span></a>
                                                                                                                                                    </div>
                                                                                                                                                ) : ""}
                                                                                                                                                {service.service_code === 'EMBOSSING' && service.service_type === "Special" && service.image !== "" ?
                                                                                                                                                    <div className="order-engraving">
                                                                                                                                                        <a style={{ cursor: 'text' }}>Embossing : {service.image?.map((item, k) => {
                                                                                                                                                            if (k > 0) {
                                                                                                                                                                return
                                                                                                                                                            }
                                                                                                                                                            return (
                                                                                                                                                                <span className="ms-1 text-underline image_previews" key={k} onClick={() => { setEmbossingPreviewModalBaseView(true); setActiveImg(service.image.filter((elm) => elm.embImage !== "")) }}>
                                                                                                                                                                    <Image alt="" className="" src={item?.embImage} />
                                                                                                                                                                </span>
                                                                                                                                                            )
                                                                                                                                                        })}</a>
                                                                                                                                                    </div> : ""}
                                                                                                                                                {service.service_type === "Normal" && service.is_selected === '1' && (
                                                                                                                                                    <div className="form-check mb-0" key={service.service_code}>
                                                                                                                                                        <input
                                                                                                                                                            className="form-check-input form-check-input_fill"
                                                                                                                                                            type="checkbox"
                                                                                                                                                            checked={service.is_selected === '1'}
                                                                                                                                                        />
                                                                                                                                                        <label
                                                                                                                                                            className="form-check-label"
                                                                                                                                                            htmlFor={`service_${service.service_code}`}
                                                                                                                                                        >
                                                                                                                                                            {service.service_name}
                                                                                                                                                        </label>
                                                                                                                                                        {service.price ? (
                                                                                                                                                            <span className="fw-semibold">
                                                                                                                                                                {"(" +
                                                                                                                                                                    extractNumber(service.price).toFixed(2) +
                                                                                                                                                                    " " +
                                                                                                                                                                    service.currency +
                                                                                                                                                                    ")"}
                                                                                                                                                            </span>
                                                                                                                                                        ) : (
                                                                                                                                                            ""
                                                                                                                                                        )}
                                                                                                                                                    </div>
                                                                                                                                                )}
                                                                                                                                            </React.Fragment>)
                                                                                                                                    })}
                                                                                                                                </div>
                                                                                                                                : null}
                                                                                                                        </React.Fragment>
                                                                                                                        : <p className='fs-14px'><span className="sku-title">Certificate</span> : {order1.cert_lab} {order1.product_sku}</p>}
                                                                                                                </div>
                                                                                                                <p className='fs-16px mb-1 fw-600 profile-title'>{order1.currency}&nbsp;{numberWithCommas(order1.price)}</p>
                                                                                                                {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? <p className='pe-4 fs-14px'> No of Stone  : {order1.count}</p> : ""}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                                }

                                                                                                {/* <div className='Quantity_pz'>
                                                                                                    <div className="Quantity_text text-end">
                                                                                                        <p className='mb-0 fs-14px'><span>Quantity</span> : {singleOrder[0].quantity}</p>
                                                                                                    </div>
                                                                                                    <div className='OrderStatus_right'>
                                                                                                        <h2 className='fs-18px fw-600 profile-title'>{ordered.currency} &nbsp;{numberWithCommas((total_price).toFixed(2))}</h2>
                                                                                                    </div>
                                                                                                </div> */}
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            })}
                                                                        </div>
                                                                        <div className='Quantity_pz'>
                                                                            <div className='OrderStatus_right'>
                                                                                {
                                                                                    ordered?.base_currency !== ordered.currency ?
                                                                                        <p className="fs-15px text-end">{ordered?.base_currency} {numberWithCommas((ordered?.entity_net_amount).toFixed(2))}</p> : ""
                                                                                }
                                                                                <h2 className='fs-18px fw-600 profile-title'>{ordered.currency} &nbsp;{numberWithCommas(extractNumber(ordered.total_amount.toString()).toFixed(2))}</h2>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </React.Fragment>
                                        }
                                    </Tab.Pane> :
                                    <Tab.Pane eventKey={selectedTab}>
                                        {PendingData.length == 0 ?
                                            !props.loading && !props.skeletonLoader && <NoRecordFound />
                                            :
                                            <>
                                                <div className="">
                                                    <div>
                                                        <h4 className='profile-title'>{selectedTab === "Pending_" ? "Order Pending" : selectedTab === "Cancelled_" ? "Order Cancelled" : selectedTab === "Failed_" ? "Order Failed" : ''}</h4>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                        <div className="mb-2">
                                                            <p className='profile-sub-heading'>Showing all {props.totalOrderRecord} results&nbsp;</p>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <React.Fragment>
                                                                <div>
                                                                    <select className="border me-2 h-33px" aria-label="Default select example" value={props.perPage} onChange={(e) => changePagination(e, "Pending")}>
                                                                        <option value={"25"}>25</option>
                                                                        <option value={"50"}>50</option>
                                                                        <option value={"100"}>100</option>
                                                                    </select>
                                                                </div>
                                                                <div className="">
                                                                    <nav aria-label="Page navigation example">
                                                                        <ul className="pagination mb-0">
                                                                            {props.count > 1 ?
                                                                                <li className="page-item previous-next" onClick={() => pagination("left", "Pending")}>
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Previous">
                                                                                        <span aria-hidden="true">«</span>
                                                                                    </a>
                                                                                </li> :
                                                                                <li className="page-item disabled">
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Previous">
                                                                                        <span aria-hidden="true">«</span>
                                                                                    </a>
                                                                                </li>
                                                                            }
                                                                            <li className="page-item"><a className="page-link">{props.pageValue}</a></li>
                                                                            {props.count < props.totalPages ?
                                                                                <li className="page-item previous-next" onClick={() => pagination("right", "Pending")}>
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Next">
                                                                                        <span aria-hidden="true">»</span>
                                                                                    </a>
                                                                                </li> :
                                                                                <li className="page-item disabled">
                                                                                    <a className="page-link rounded-0 cursor-pointer" aria-label="Next">
                                                                                        <span aria-hidden="true">»</span>
                                                                                    </a>
                                                                                </li>
                                                                            }
                                                                        </ul>
                                                                    </nav>
                                                                </div>
                                                            </React.Fragment>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-pane ">
                                                    <div>
                                                        {PendingData.length > 0 && PendingData.map((ordered, i) => {
                                                            let newDate = new Date(ordered.order_date).toLocaleDateString('en-GB', {
                                                                day: 'numeric', month: 'long', year: 'numeric'
                                                            })
                                                            return (
                                                                <React.Fragment key={i}>
                                                                    <div className="MyOrder_info" key={i}>
                                                                        <div className='order-list-row'>
                                                                            <div className='order-list-left'>
                                                                                <div className='ordered_info_id'>
                                                                                    <div className='ordered_info_div '><b>Order # </b>{ordered.order_id} </div> <span className='px-2'>|</span>
                                                                                    <div className='ordered_info_div'><b>Ordered on</b> : {newDate}</div> <span className='px-2'>|</span>
                                                                                    <div className='ordered_info_div'><b>Order Status </b> : {ordered.status}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='order-list-right text-end'>
                                                                                {ordered.status == 'Pending' && isEmpty(ordered.payment_url) != '' &&
                                                                                    <span className="text-decoration-underline cursor-pointer" onClick={() => (window.open(ordered.payment_url, '_blank', ''))}>Continue To Payment</span>
                                                                                }
                                                                            </div>
                                                                            <div className="order-list-body">
                                                                                <div className="cancelled-order">
                                                                                    {ordered.order_lines.length > 0 && ordered.order_lines.map((singleOrder, i1) => {
                                                                                        if (singleOrder.length == 1) {
                                                                                            return (
                                                                                                singleOrder.length > 0 && singleOrder.map((penOrder, ix) => {
                                                                                                    return (
                                                                                                        <div className="order-list-product" key={ix}>
                                                                                                            <div className="d-sm-flex">
                                                                                                                <div className='print-diy-img'>
                                                                                                                    <Image alt="" src={(penOrder.photo == null || "") ? "https://via.placeholder.com/500X500" : penOrder.photo} className='img-fluid w-100' />
                                                                                                                    {penOrder.length > 1 && (penOrder.photo !== null || '') ?
                                                                                                                        <div className='print-image position-absolute bottom-0 end-0'>
                                                                                                                            <Image alt="" src={penOrder.photo} className="img-fluid" />
                                                                                                                        </div> : ""
                                                                                                                    }
                                                                                                                </div>

                                                                                                                <div className='single-product-desc'>
                                                                                                                    <div className='order-title' onClick={() => navigateFromOrder(penOrder, singleOrder)}>{penOrder.product_name}</div>
                                                                                                                    <div className='mb-1 product_sku'>
                                                                                                                        {jewelVertical(penOrder.vertical_code) === true ?
                                                                                                                            <>
                                                                                                                                <p className='fs-14px mb-1'><span className="sku-title">SKU</span> : {penOrder.product_sku}</p>
                                                                                                                                <div className='prodect_info-inner'>
                                                                                                                                    {isEmpty(penOrder.metal_type) != '' ?
                                                                                                                                        <div className='detailsName '><b>Metal Type</b> <span>{penOrder.metal_type}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(penOrder.short_summary.gold_wt) != '' && penOrder.short_summary.gold_wt > 0 ?
                                                                                                                                        <div className='detailsName  '><b>Gold Weight</b> <span> {penOrder.short_summary.gold_wt} {penOrder.short_summary.gold_wt_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(penOrder.short_summary.dia_wt) != '' && penOrder.short_summary.dia_wt > 0 ?
                                                                                                                                        <div className='detailsName  '><b>Diamond Weight</b> <span>{penOrder.short_summary.dia_wt} {penOrder.short_summary.dia_first_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(penOrder.short_summary.col_wt) != '' && penOrder.short_summary.col_wt > 0 ?
                                                                                                                                        <div className='detailsName'><b>Gemstone Weight</b> <span>{penOrder.short_summary.col_wt} {penOrder.short_summary.col_first_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(penOrder.short_summary.offer_code) != '' ?
                                                                                                                                        <div className='detailsName'><b>Offer</b> <span>{penOrder.short_summary.offer_code}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                </div>
                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <p className='fs-14px'><span className="sku-title">Certificate No</span> : {penOrder.cert_lab} {penOrder.cert_no}</p>
                                                                                                                        }
                                                                                                                    </div>



                                                                                                                    {/* <div className="Quantity_pz d-flex flex-column justify-content-between align-items-between">
                                                                                                                    <div className="Quantity_text  text-end">
                                                                                                                        <p className='mb-0 fs-14px'><span>Quantity </span>:  {penOrder.quantity}</p>
                                                                                                                    </div>
                                                                                                                    <p className='fs-16px mb-2 fw-600 profile-title'>{ordered.payment_currency}&nbsp;{numberWithCommas(ordered.net_amount)}</p>
                                                                                                                </div> */}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        } else {
                                                                                            if (singleOrder.length >= 2) {
                                                                                                let jewelImage = ""
                                                                                                let Diamond = ""
                                                                                                let name = ""
                                                                                                let short_summary = ""
                                                                                                let status = ordered.status
                                                                                                ordered.order_lines.map((t1, i2) => {
                                                                                                    t1.map((t2, i3) => {
                                                                                                        if (jewelVertical(t2.vertical_code) === true) {
                                                                                                            if (isEmpty(t2.photo) !== "") {
                                                                                                                jewelImage = isEmpty(t2.photo)
                                                                                                            } else {
                                                                                                                jewelImage = isEmpty(t2.photo)
                                                                                                            }
                                                                                                            short_summary = t2.short_summary;
                                                                                                            name = t2.product_name
                                                                                                        } else if (t2.vertical_code === "DIAMO" || t2.vertical_code == 'LGDIA' || t2.vertical_code == 'GEDIA') {
                                                                                                            Diamond = isEmpty(t2.photo)
                                                                                                        }
                                                                                                        return t2
                                                                                                    })
                                                                                                    return t1
                                                                                                })
                                                                                                let total_price = 0
                                                                                                ordered.types.map((a) => {
                                                                                                    total_price += isEmpty(Number(a.price))
                                                                                                    return a
                                                                                                })
                                                                                                if (jewelImage === "") {
                                                                                                    jewelImage = "https://via.placeholder.com/500X500"
                                                                                                }
                                                                                                if (Diamond === "") {
                                                                                                    Diamond = "https://via.placeholder.com/500X500"
                                                                                                }
                                                                                                return (
                                                                                                    <div className='order-list-product' key={i1}>
                                                                                                        {ordered.types.length > 0 && ordered.types.map((order1, i4) => {
                                                                                                            return (<div className='d-sm-flex' key={i4}>

                                                                                                                <div className='print-diy-img'>
                                                                                                                    <div className="">
                                                                                                                        <Image alt="" src={order1.item_image} className='img-fluid' />
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="single-product-desc">
                                                                                                                    {order1.type !== "" ? <div className="product-desc-title mb-2 fw-600">{order1.type}</div> : ""}

                                                                                                                    <div className='order-title' onClick={() => navigateFromOrder(order1, ordered)}>{order1.product_name}</div>

                                                                                                                    {order1.vertical_code === "LDIAM" || order1.vertical_code === "GEMST" ? "" : jewelVertical(order1.vertical_code) === true ?
                                                                                                                        <div className='mb-1 product_sku'>
                                                                                                                            <React.Fragment>
                                                                                                                                <div className='prodect_info-inner'>
                                                                                                                                    <p className='fs-14px'><b>SKU</b> : {order1.product_sku}</p>
                                                                                                                                </div>
                                                                                                                                <div className='prodect_info-inner'>
                                                                                                                                    {isEmpty(short_summary.metal_type) != '' ?
                                                                                                                                        <div className='detailsName '><b>Metal Type</b> <span> {short_summary.metal_type}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(short_summary.gold_wt) != '' && short_summary.gold_wt > 0 ?
                                                                                                                                        <div className='detailsName '><b>Gold Weight</b> <span> {short_summary.gold_wt} {short_summary.gold_wt_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(short_summary.dia_wt) != '' && short_summary.dia_wt > 0 ?
                                                                                                                                        <div className='detailsName '><b>Diamond Weight</b> <span>{short_summary.dia_wt} {short_summary.dia_first_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(short_summary.col_wt) != '' && short_summary.col_wt > 0 ?
                                                                                                                                        <div className='detailsName '><b>Gemstone Weight</b> <span>{short_summary.col_wt} {short_summary.col_first_unit}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                    {isEmpty(short_summary.offer_code) != '' ?
                                                                                                                                        <div className='detailsName '><b>Offer</b> <span>{short_summary.offer_code}</span> </div>
                                                                                                                                        : ''}
                                                                                                                                </div>
                                                                                                                            </React.Fragment>
                                                                                                                        </div> :
                                                                                                                        <div className='d-flex mb-1 product_sku'>
                                                                                                                            <p className='fs-14px'><span className="sku-title">Certificate No</span> : {order1.cert_lab} {order1.cert_no}</p>
                                                                                                                        </div>}
                                                                                                                    {order1.vertical_code === "LDIAM" ? <div className="mb-2"> No of Stone  : {order1.count}</div> : ""}

                                                                                                                    <div className="">
                                                                                                                        <p className='fs-16px fw-600 mb-2'>{order1.currency}&nbsp;{order1.price_display}</p>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>)
                                                                                                        })
                                                                                                        }

                                                                                                        {/* <div className="OrderPending_right d-flex flex-column justify-content-between">
                                                                                                            <p className='py-2 fs-14px text-end'><b>Quantity </b>: {singleOrder[0].quantity}</p>
                                                                                                            <h2 className='fs-18px fw-600 profile-title'>{ordered.payment_currency} &nbsp;{numberWithCommas(extractNumber(ordered.net_amount).toFixed(2))}</h2>

                                                                                                        </div> */}
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                    }
                                                                                </div>
                                                                                <div className="d-flex flex-column justify-content-end">
                                                                                    {/* <p className='py-2 fs-14px text-end'><b>Quantity </b>: {singleOrder[0].quantity}</p> */}
                                                                                    <p></p>
                                                                                    <h2 className='fs-18px fw-600 profile-title text-end'>{ordered.payment_currency} &nbsp;{numberWithCommas(extractNumber(ordered.net_amount).toFixed(2))}</h2>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </Tab.Pane>
                                }
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
            <EmbossingPreview
                ebossingPreviewModalBaseView={ebossingPreviewModalBaseView}
                setEmbossingPreviewModalBaseView={setEmbossingPreviewModalBaseView}
                setSelectedIndex={setSelectedIndex}
                selectedIndex={selectedIndex}
                setActiveImg={setActiveImg}
                activeImg={activeImg}
            />
        </div >
    );
}

export default OrderComponent;
