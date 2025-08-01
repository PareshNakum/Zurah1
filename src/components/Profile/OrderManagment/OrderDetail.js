import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isEmpty,
  numberWithCommas,
  jewelVertical,
  safeParse,
  extractNumber,
  changeUrl,
} from "../../../CommanFunctions/commanFunctions";
import "../Profile.module.scss";
import Loader from "../../../CommanUIComp/Loader/Loader";
import commanService from "../../../CommanService/commanService";
import { Typography } from "@mui/material";
import EmbossingPreview from "./Embossingreview";
import {
  activeDIYtabs,
  addedDiamondData,
  addedRingData,
  diamondNumber,
  editDiamondAction,
  finalCanBeSetData,
  isRingSelected,
  IsSelectedDiamond,
  storeActiveFilteredData,
  storeDiamondNumber,
  storeFilteredData,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "../../../Redux/action";
import { useRouter } from "next/router";
import Image from "next/image";

function OrderDetail(props) {
  // const [OrderID, setOrderID] = useState('')
  const navigate = useRouter();
  const dispatch = useDispatch();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const [loading, setLoading] = useState(false);
  const orderDetailDataList = props.orderDetailDataList;
  const orderDetailsData = props.orderDetailsData;
  const shippingAddress = props.shippingAddress;
  const orderHistoryDataList = props.orderHistoryDataList;
  const billindAddress = props.billindAddress;
  const paymentMethod = props.paymentMethod;
  const reviewModal = props.reviewModal;
  const checkInvoice = props.checkInvoice;
  //EMbossing
  const [ebossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] =
    useState(false);
  const [activeImg, setActiveImg] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  var no_of_item = 0;
  var order_status = "";

  useEffect(() => {
    // orderData();
  }, []);

  const printOrderInvoice = () => {
    setLoading(true);
    const getInvoiceDetail = {
      a: "SalesInvoiceOrderCommonViewPDF",
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      security_id: checkInvoice.invo_invoice_security_id,
      unique_id: checkInvoice.invo_unique_id,
      so_unique_id: "",
      SITDeveloper: "1",
    };
    commanService.postApi("/InvoiceMaster", getInvoiceDetail).then((res) => {
      setLoading(false);
      window.open(res["data"]["data"]["path"], "_blank");
    });
  };

  if (isEmpty(orderDetailDataList) != "") {
    for (let c = 0; c < orderDetailDataList.length; c++) {
      var data = orderDetailDataList[c]["data"];
      for (let d = 0; d < data.length; d++) {
        if (isEmpty(data[d].types) == "") {
          no_of_item += parseInt(data[d]["quantity"]);
        } else {
          no_of_item++;
        }
      }
    }
    order_status = orderDetailDataList[0].data[0]["str_document_status"];
    if (isEmpty(order_status) == "") {
      order_status = orderDetailDataList[0].data[0][0]["str_document_status"];
    }
  }

  // setOrderID(orderDetailDataList[0].main_so_order_id)

  const navigateFromOrder = (value, e) => {
    // const data = e.data.filter((item)=>item.product_diy === "DIY");

    var url = "";
    if (
      e?.data?.[0]?.product_diy === "DIY" &&
      value?.vertical_code == "JEWEL"
    ) {
      dispatch(storeSelectedDiamondData([]));
      dispatch(addedDiamondData({}));
      dispatch(storeSelectedDiamondPrice(""));
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
      const link = `/make-your-customization/start-with-a-setting/${changeUrl(
        value.product_name + "-" + value.pv_unique_id
      )}`;
      // window.open(url,'_blank','');
      navigate.push(link);
    } else if (
      value?.product_diy === "DIY" &&
      value.vertical_code !== "JEWEL"
    ) {
      const verticalCode = value?.vertical_code;
      const title = changeUrl(value?.product_name + "-" + value.pv_unique_id);
      var megaMenu = JSON.parse(
        typeof window !== "undefined" && sessionStorage.getItem("megaMenu")
      ).navigation_data?.filter(
        (elm) => elm.product_vertical_name === verticalCode
      )[0];
      navigate.push(`/products/${changeUrl(megaMenu?.menu_name)}/${title}`);
    } else {
      if (
        value.vertical_code != "DIAMO" &&
        value.vertical_code != "LGDIA" &&
        value.vertical_code != "GEDIA"
      ) {
        var megaMenu = JSON.parse(
          typeof window !== "undefined" && sessionStorage.getItem("megaMenu")
        ).navigation_data?.filter(
          (elm) => elm.product_vertical_name === value.vertical_code
        )[0];
        url = `/products/${changeUrl(megaMenu?.menu_name)}/${changeUrl(
          value.product_name + "-" + value.pv_unique_id
        )}`;
      }

      setTimeout(() => {
        if (
          value.vertical_code != "DIAMO" &&
          value.vertical_code != "LGDIA" &&
          value.vertical_code != "GEDIA"
        ) {
          window.open(url, "_blank", "");
        }
      });
    }
  };

  // original price without offer
  const calculatePrice = (orderDetails) => {
    let storeBasePrice = parseFloat(orderDetails?.line_price) || 0;
    let customDuty = 0;
    let tax = 0;
    let price = 0;
    let totalService =
      isEmpty(orderDetails?.service_json) !== ""
        ? safeParse(orderDetails?.service_json).reduce(
            (accumulator, product) => {
              return (
                accumulator +
                (product.is_selected === "1"
                  ? extractNumber(product?.price)
                  : 0)
              );
            },
            0
          )
        : 0;

    let customPer = extractNumber(orderDetails?.custom_per) || 0;
    let taxPer = extractNumber(orderDetails?.tax1) || 0;

    customDuty =
      parseFloat(
        (((storeBasePrice + totalService) * customPer) / 100).toFixed(2)
      ) || 0;
    tax =
      parseFloat(
        (((storeBasePrice + totalService + customDuty) * taxPer) / 100).toFixed(
          2
        )
      ) || 0;

    price = storeBasePrice + totalService + customDuty + tax;

    return numberWithCommas(
      (price * extractNumber(orderDetails?.quantity)).toFixed(2)
    );
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="order-details-page">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h3 className="profile-title">Orders Details</h3>
          <div
            className="back-btn justify-content-end"
            onClick={() => props.detailClose()}
          >
            <i className="ic_chavron_left me-1"></i>
            <div className="text-decoration-underline">BACK</div>
          </div>
          {/* <button type="button" className="btn btn-back fs-15px" onClick={() => props.detailClose()}>BACK</button> */}
        </div>
        <div className="order-details-desc">
          <div className="row">
            <div className="col-12">
              <div className="order-details-page-part ">
                <div className="d-flex justify-content-between align-items-center order-detail-heading">
                  {orderDetailDataList.length > 0 &&
                    orderDetailDataList.map((shippi, isp) => {
                      let dates = new Date(
                        shippi?.data?.[0]?.so_sales_date ??
                          shippi?.data?.[0]?.[0]?.so_sales_date
                      );
                      let newDate = new Date(dates).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      );
                      return (
                        <p className="fs-15px" key={isp}>
                          {" "}
                          <span>Ordered on</span> {newDate} |{" "}
                          <span>Order #</span> {props.orderDetailId}
                        </p>
                      );
                    })}
                  <div>
                    {checkInvoice.length != 0 ? (
                      <button
                        className="btn btn-print btn-print-desc"
                        onClick={() => printOrderInvoice()}
                      >
                        <i className="ic_download "></i>
                        <span className="ms-2">Print Invoice</span>
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-print btn-print-desc ms-2"
                      onClick={() => props.printInvoice(props.orderDetailId)}
                    >
                      <i className="ic_download "></i>
                      <span className="ms-2">Print Order Details</span>
                    </button>
                  </div>
                </div>
                <div className="order-detail-desc">
                  <div className="order-details-data">
                    {/* <div className="StatusOrder">
                                            <h4 className='fs-18px fw-bold text-break profile-title'>Order Status <span className='fw-400'>: {order_status}</span></h4>
                                        </div> */}
                    {orderDetailDataList.length > 0 &&
                      orderDetailDataList.map((ordered, i) => {
                        return (
                          ordered.data.length > 0 &&
                          ordered.data.map((singleOrder, i222) => {
                            if (singleOrder.length == undefined) {
                              return (
                                <React.Fragment key={i222}>
                                  <div className="order_details_info">
                                    <div className="orderDetailId d-flex flex-wrap">
                                      {Object.keys(singleOrder.review).length >
                                      0 ? (
                                        ""
                                      ) : (
                                        <div className="col-12 mb-1">
                                          {isEmpty(order_status) ===
                                          "Completed" ? (
                                            <div className="GiveReview text-end">
                                              <span
                                                className="fs-16px blink_me"
                                                onClick={() =>
                                                  reviewModal(ordered, i222)
                                                }
                                              >
                                                Give Review
                                              </span>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-12">
                                      <div className="">
                                        <div className="d-sm-flex">
                                          <div className="position-relative print-diy-img">
                                            <Image
                                            alt="" 
                                              src={
                                                singleOrder.photo == null || ""
                                                  ? "https://via.placeholder.com/500X500"
                                                  : singleOrder.photo
                                              }
                                              className="img-fluid w-100"
                                            />
                                            {singleOrder.length > 1 &&
                                            (singleOrder.photo !== null ||
                                              "") ? (
                                              <div className="print-image position-absolute bottom-0 end-0">
                                                <Image
                                                  alt="" src={singleOrder.photo}
                                                  className="img-fluid"
                                                />
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                          <div className="product-jewellery-desc">
                                            <div className="product-desc">
                                              <div className="d-flex">
                                                <div>
                                                  <p
                                                    className="fs-16px mb-1 text-break fw-500 profile-title cursor-pointer"
                                                    onClick={() =>
                                                      navigateFromOrder(
                                                        singleOrder,
                                                        ordered
                                                      )
                                                    }
                                                  >
                                                    {singleOrder.product_name}
                                                  </p>
                                                  <div className=" mb-2 product_sku">
                                                    {singleOrder.vertical_code ===
                                                      "LDIAM" ||
                                                    singleOrder.vertical_code ===
                                                      "GEMST" ? (
                                                      ""
                                                    ) : jewelVertical(
                                                        singleOrder.vertical_code
                                                      ) === true ? (
                                                      <>
                                                        <div className="prodect_info-inner">
                                                          <p className="mb-1 fs-14px">
                                                            <span className="sku-title">
                                                              SKU
                                                            </span>{" "}
                                                            :{" "}
                                                            {
                                                              singleOrder.product_sku
                                                            }
                                                          </p>
                                                        </div>
                                                        <div className="prodect_info-inner">
                                                          {isEmpty(
                                                            singleOrder.metal_type
                                                          ) != "" ? (
                                                            <div className="detailsName ">
                                                              <b>Metal Type</b>{" "}
                                                              <span>
                                                                {" "}
                                                                {
                                                                  singleOrder.metal_type
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {isEmpty(
                                                            singleOrder.gold_wt
                                                          ) != "" &&
                                                          singleOrder.gold_wt >
                                                            0 ? (
                                                            <div className="detailsName ">
                                                              <b>Gold Weight</b>{" "}
                                                              <span>
                                                                {" "}
                                                                {
                                                                  singleOrder.gold_wt
                                                                }{" "}
                                                                {
                                                                  singleOrder.gold_wt_unit
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {isEmpty(
                                                            singleOrder.dia_wt
                                                          ) != "" &&
                                                          singleOrder.dia_wt >
                                                            0 ? (
                                                            <div className="detailsName ">
                                                              <b>
                                                                Diamond Weight
                                                              </b>{" "}
                                                              <span>
                                                                {
                                                                  singleOrder.dia_wt
                                                                }{" "}
                                                                {
                                                                  singleOrder.dia_first_unit
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {isEmpty(
                                                            singleOrder.col_wt
                                                          ) != "" &&
                                                          singleOrder.col_wt >
                                                            0 ? (
                                                            <div className="detailsName ">
                                                              <b>
                                                                Gemstone Weight
                                                              </b>{" "}
                                                              <span>
                                                                {
                                                                  singleOrder.col_wt
                                                                }{" "}
                                                                {
                                                                  singleOrder.col_first_unit
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          <div className="detailsName">
                                                            <b>Rate</b>{" "}
                                                            <span>
                                                              {" "}
                                                              {
                                                                singleOrder.display_line_price
                                                              }
                                                            </span>
                                                          </div>
                                                          {isEmpty(
                                                            singleOrder.offer_code
                                                          ) != "" ? (
                                                            <div className="detailsName">
                                                              <b>Offer</b>{" "}
                                                              <span>
                                                                {
                                                                  singleOrder.offer_code
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {singleOrder.custom_amt >
                                                          0 ? (
                                                            <div className="detailsName">
                                                              <b>
                                                                Custom Charge
                                                              </b>{" "}
                                                              <span>
                                                                {
                                                                  singleOrder.custom_amt
                                                                }{" "}
                                                                (
                                                                {
                                                                  singleOrder.custom_per
                                                                }{" "}
                                                                %)
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {singleOrder.tax1_amt >
                                                          0 ? (
                                                            <div className="detailsName">
                                                              <b>Tax Value</b>{" "}
                                                              <span>
                                                                {
                                                                  singleOrder.tax1_amt
                                                                }
                                                              </span>{" "}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <p className="pe-4 fs-14px">
                                                        <b>Certificate No</b>:{" "}
                                                        {singleOrder.cert_lab}{" "}
                                                        {
                                                          singleOrder.variant_number
                                                        }
                                                      </p>
                                                    )}
                                                  </div>
                                                  <div className="d-flex gap-2 align-items-center order-service">
                                                    {safeParse(
                                                      singleOrder?.service_json
                                                    ) !== null
                                                      ? safeParse(
                                                          singleOrder?.service_json
                                                        )?.length > 0 &&
                                                        safeParse(
                                                          singleOrder?.service_json
                                                        )?.map((service, i) => {
                                                          return (
                                                            <React.Fragment
                                                              key={i}
                                                            >
                                                              {service.service_code ===
                                                                "ENGRAVING" &&
                                                              service.service_type ===
                                                                "Special" &&
                                                              isEmpty(
                                                                service?.text
                                                              ) !== "" &&
                                                              isEmpty(
                                                                service?.text
                                                              ) !== null ? (
                                                                <div className="order-engraving">
                                                                  <a
                                                                    style={{
                                                                      cursor:
                                                                        "text",
                                                                    }}
                                                                  >
                                                                    Engraving :{" "}
                                                                    <span className="fw-normal">
                                                                      {
                                                                        service?.text
                                                                      }
                                                                    </span>
                                                                  </a>
                                                                </div>
                                                              ) : (
                                                                ""
                                                              )}
                                                              {service.service_code ===
                                                                "EMBOSSING" &&
                                                              service.service_type ===
                                                                "Special" &&
                                                              service.image !==
                                                                "" ? (
                                                                <div className="order-engraving">
                                                                  <a
                                                                    style={{
                                                                      cursor:
                                                                        "text",
                                                                    }}
                                                                  >
                                                                    Embossing :{" "}
                                                                    {service.image?.map(
                                                                      (
                                                                        item,
                                                                        k
                                                                      ) => {
                                                                        if (
                                                                          k > 0
                                                                        ) {
                                                                          return;
                                                                        }
                                                                        return (
                                                                          <span
                                                                            className="ms-1 text-underline image_previews"
                                                                            key={
                                                                              k
                                                                            }
                                                                            onClick={() => {
                                                                              setEmbossingPreviewModalBaseView(
                                                                                true
                                                                              );
                                                                              setActiveImg(
                                                                                service.image.filter(
                                                                                  (
                                                                                    elm
                                                                                  ) =>
                                                                                    elm.embImage !==
                                                                                    ""
                                                                                )
                                                                              );
                                                                            }}
                                                                          >
                                                                            <Image
                                                                              alt="" className=""
                                                                              src={
                                                                                item?.embImage
                                                                              }
                                                                            />
                                                                          </span>
                                                                        );
                                                                      }
                                                                    )}
                                                                  </a>
                                                                </div>
                                                              ) : (
                                                                ""
                                                              )}
                                                              {service.service_type ===
                                                                "Normal" &&
                                                                service.is_selected ===
                                                                  "1" && (
                                                                  <div
                                                                    className="form-check mb-0"
                                                                    key={
                                                                      service.service_code
                                                                    }
                                                                  >
                                                                    <input
                                                                      className="form-check-input form-check-input_fill"
                                                                      type="checkbox"
                                                                      checked={
                                                                        service.is_selected ===
                                                                        "1"
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="form-check-label"
                                                                      htmlFor={`service_${service.service_code}`}
                                                                    >
                                                                      {
                                                                        service.service_name
                                                                      }
                                                                    </label>
                                                                    {service.price ? (
                                                                      <span className="fw-semibold">
                                                                        {"(" +
                                                                          extractNumber(
                                                                            service.price
                                                                          ).toFixed(
                                                                            2
                                                                          ) +
                                                                          " " +
                                                                          service.currency +
                                                                          ")"}
                                                                      </span>
                                                                    ) : (
                                                                      ""
                                                                    )}
                                                                  </div>
                                                                )}
                                                            </React.Fragment>
                                                          );
                                                        })
                                                      : null}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="Quantity_pz d-flex flex-column justify-content-between">
                                              <div className="Quantity_text text-end">
                                                <p className="fs-14px">
                                                  <span>Quantity</span> :{" "}
                                                  {singleOrder.quantity}
                                                </p>
                                              </div>

                                              <p className="fs-18px mb-0 fw-600 profile-title">
                                                {ordered.currency}&nbsp;
                                                {singleOrder.display_net_amount}{" "}
                                                {singleOrder?.offer_code !==
                                                  "" && (
                                                  <span
                                                    className="offer-price"
                                                    style={{ fontSize: "15px" }}
                                                  >
                                                    {ordered.currency}{" "}
                                                    {calculatePrice(
                                                      singleOrder
                                                    )}
                                                  </span>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            } else {
                              if (singleOrder.length >= 2) {
                                let jewelImage = "";
                                let Diamond = "";
                                let name = "";
                                let status = "";
                                let Review = {};
                                singleOrder.map((t2, i2) => {
                                  if (
                                    jewelVertical(t2.vertical_code) === true
                                  ) {
                                    if (isEmpty(t2.photo) !== "") {
                                      jewelImage = isEmpty(t2.photo);
                                    } else {
                                      jewelImage = isEmpty(t2.photo);
                                    }
                                    name = t2.product_name;
                                    status = t2.str_document_status;
                                    Review = t2.review;
                                  } else if (t2.vertical_code === "DIAMO") {
                                    if (t2.stone_position === "CENTER") {
                                      Diamond = isEmpty(t2.photo);
                                    } else {
                                      Diamond = isEmpty(t2.photo);
                                    }
                                  } else if (t2.vertical_code === "LGDIA") {
                                    Diamond = t2.photo;
                                  }
                                  return t2;
                                });
                                let total_price = 0;
                                if (singleOrder) {
                                  if (singleOrder.types) {
                                    (singleOrder.types || []).map((a) => {
                                      if (typeof a === "object") {
                                        total_price += isEmpty(Number(a.price));
                                        return a;
                                      }
                                    });
                                  }
                                }
                                if (jewelImage === "") {
                                  jewelImage =
                                    "https://via.placeholder.com/500X500";
                                }
                                if (Diamond === "") {
                                  Diamond =
                                    "https://via.placeholder.com/500X500";
                                }
                                return (
                                  <div
                                    className="order_details_info"
                                    key={i222}
                                  >
                                    <div className="orderDetailId d-flex flex-wrap">
                                      {/* <div className='col-6 py-1'>
                                                                        <h4 className='fs-18px fw-bold text-break profile-title'>Order Status <span className='fw-400'>: {order_status}</span></h4>
                                                                    </div> */}
                                      {Object.keys(Review).length > 0 ? (
                                        ""
                                      ) : (
                                        <div className="col-12">
                                          {isEmpty(order_status) ===
                                          "Completed" ? (
                                            <div className="GiveReview text-end">
                                              <span
                                                className="fs-16px blink_me"
                                                onClick={() =>
                                                  reviewModal(ordered, i222)
                                                }
                                              >
                                                Give Review
                                              </span>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-12">
                                      <div className="d-sm-flex ">
                                        <div className="product-desc-diy">
                                          <div className="diy-dec">
                                            {(singleOrder.types || []).length >
                                              0 &&
                                              (singleOrder.types || []).map(
                                                (order1, i4) => {
                                                  return (
                                                    <div
                                                      className="d-sm-flex "
                                                      key={i4}
                                                    >
                                                      <div className="mb-3 mb-lg-0">
                                                        <div className="position-relative print-diy-img">
                                                          <div className="">
                                                            <Image
                                                              alt="" src={
                                                                order1.item_image
                                                              }
                                                              className="img-fluid"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="row product-desc">
                                                        <div className="col-12">
                                                          {order1.type !==
                                                          "" ? (
                                                            <div className="product-desc-title  mb-2 fw-600">
                                                              {order1.type}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          <div className="d-flex border-bottom">
                                                            <div>
                                                              <p
                                                                className="fs-16px mb-1 text-break fw-500 profile-title cursor-pointer"
                                                                onClick={() =>
                                                                  navigateFromOrder(
                                                                    order1,
                                                                    singleOrder
                                                                  )
                                                                }
                                                              >
                                                                {
                                                                  order1.product_name
                                                                }
                                                              </p>
                                                              <div className=" mb-2 product_sku">
                                                                {singleOrder.vertical_code ===
                                                                  "LDIAM" ||
                                                                singleOrder.vertical_code ===
                                                                  "GEMST" ? (
                                                                  ""
                                                                ) : jewelVertical(
                                                                    order1.vertical_code
                                                                  ) === true ? (
                                                                  <>
                                                                    <div className="prodect_info-inner">
                                                                      <p className="fs-14px mb-1">
                                                                        <span className="sku-title">
                                                                          SKU
                                                                        </span>{" "}
                                                                        :{" "}
                                                                        {
                                                                          order1.product_sku
                                                                        }
                                                                      </p>
                                                                    </div>
                                                                    <div className="prodect_info-inner">
                                                                      {isEmpty(
                                                                        order1
                                                                          .short_summary
                                                                          .metal_type
                                                                      ) !=
                                                                      "" ? (
                                                                        <div className="detailsName ">
                                                                          <b>
                                                                            Metal
                                                                            Type
                                                                          </b>{" "}
                                                                          <span>
                                                                            {" "}
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .metal_type
                                                                            }{" "}
                                                                          </span>{" "}
                                                                        </div>
                                                                      ) : (
                                                                        ""
                                                                      )}
                                                                      {isEmpty(
                                                                        order1
                                                                          .short_summary
                                                                          .gold_wt
                                                                      ) != "" &&
                                                                      order1
                                                                        .short_summary
                                                                        .gold_wt >
                                                                        0 ? (
                                                                        <div className="detailsName ">
                                                                          <b>
                                                                            Gold
                                                                            Weight
                                                                          </b>{" "}
                                                                          <span>
                                                                            {" "}
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .gold_wt
                                                                            }{" "}
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .gold_wt_unit
                                                                            }
                                                                          </span>{" "}
                                                                        </div>
                                                                      ) : (
                                                                        ""
                                                                      )}
                                                                      {isEmpty(
                                                                        order1
                                                                          .short_summary
                                                                          .dia_wt
                                                                      ) != "" &&
                                                                      order1
                                                                        .short_summary
                                                                        .dia_wt >
                                                                        0 ? (
                                                                        <div className="detailsName ">
                                                                          <b>
                                                                            Diamond
                                                                            Weight
                                                                          </b>{" "}
                                                                          <span>
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .dia_wt
                                                                            }{" "}
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .dia_first_unit
                                                                            }
                                                                          </span>{" "}
                                                                        </div>
                                                                      ) : (
                                                                        ""
                                                                      )}
                                                                      {isEmpty(
                                                                        order1
                                                                          .short_summary
                                                                          .col_wt
                                                                      ) != "" &&
                                                                      order1
                                                                        .short_summary
                                                                        .col_wt >
                                                                        0 ? (
                                                                        <div className="detailsName ">
                                                                          <b>
                                                                            Gemstone
                                                                            Weight
                                                                          </b>{" "}
                                                                          <span>
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .col_wt
                                                                            }{" "}
                                                                            {
                                                                              order1
                                                                                .short_summary
                                                                                .col_first_unit
                                                                            }
                                                                          </span>{" "}
                                                                        </div>
                                                                      ) : (
                                                                        ""
                                                                      )}
                                                                      {/* {isEmpty(order1.short_summary.dia_qty) != '' && order1.short_summary.dia_qty > 0 ?
                                                                                                                                <div className='detailsName '><b>Dia 2st Unit</b> <span>{order1.short_summary.dia_qty} {order1.short_summary.dia_second_unit}</span> </div>
                                                                                                                                : ''} */}

                                                                      {/* {isEmpty(order1.short_summary.lab_value) != '' && order1.short_summary.lab_value > 0 ?
                                                                                                                            <div className='detailsName '><b>Lab Value</b> <span>{order1.short_summary.lab_value}</span></div>
                                                                                                                            : ''} */}
                                                                    </div>

                                                                    <div className="d-flex gap-2 align-items-center order-service">
                                                                      {safeParse(
                                                                        order1?.service_json
                                                                      ) !== null
                                                                        ? safeParse(
                                                                            order1?.service_json
                                                                          )
                                                                            ?.length >
                                                                            0 &&
                                                                          safeParse(
                                                                            order1?.service_json
                                                                          )?.map(
                                                                            (
                                                                              service,
                                                                              i
                                                                            ) => {
                                                                              return (
                                                                                <React.Fragment
                                                                                  key={
                                                                                    i
                                                                                  }
                                                                                >
                                                                                  {service.service_code ===
                                                                                    "ENGRAVING" &&
                                                                                  service.service_type ===
                                                                                    "Special" &&
                                                                                  isEmpty(
                                                                                    service?.text
                                                                                  ) !==
                                                                                    "" &&
                                                                                  isEmpty(
                                                                                    service?.text
                                                                                  ) !==
                                                                                    null ? (
                                                                                    <div className="order-engraving">
                                                                                      <a
                                                                                        style={{
                                                                                          cursor:
                                                                                            "text",
                                                                                        }}
                                                                                      >
                                                                                        Engraving
                                                                                        :{" "}
                                                                                        <span className="fw-normal">
                                                                                          {
                                                                                            service?.text
                                                                                          }
                                                                                        </span>
                                                                                      </a>
                                                                                    </div>
                                                                                  ) : (
                                                                                    ""
                                                                                  )}
                                                                                  {service.service_code ===
                                                                                    "EMBOSSING" &&
                                                                                  service.service_type ===
                                                                                    "Special" &&
                                                                                  service.image !==
                                                                                    "" ? (
                                                                                    <div className="order-engraving">
                                                                                      <a
                                                                                        style={{
                                                                                          cursor:
                                                                                            "text",
                                                                                        }}
                                                                                      >
                                                                                        Embossing
                                                                                        :{" "}
                                                                                        {service.image?.map(
                                                                                          (
                                                                                            item,
                                                                                            k
                                                                                          ) => {
                                                                                            if (
                                                                                              k >
                                                                                              0
                                                                                            ) {
                                                                                              return;
                                                                                            }
                                                                                            return (
                                                                                              <span
                                                                                                className="ms-1 text-underline image_previews"
                                                                                                key={
                                                                                                  k
                                                                                                }
                                                                                                onClick={() => {
                                                                                                  setEmbossingPreviewModalBaseView(
                                                                                                    true
                                                                                                  );
                                                                                                  setActiveImg(
                                                                                                    service.image.filter(
                                                                                                      (
                                                                                                        elm
                                                                                                      ) =>
                                                                                                        elm.embImage !==
                                                                                                        ""
                                                                                                    )
                                                                                                  );
                                                                                                }}
                                                                                              >
                                                                                                <Image
                                                                                                  alt="" className=""
                                                                                                  src={
                                                                                                    item?.embImage
                                                                                                  }
                                                                                                />
                                                                                              </span>
                                                                                            );
                                                                                          }
                                                                                        )}
                                                                                      </a>
                                                                                    </div>
                                                                                  ) : (
                                                                                    ""
                                                                                  )}
                                                                                  {service.service_type ===
                                                                                    "Normal" &&
                                                                                    service.is_selected ===
                                                                                      "1" && (
                                                                                      <div
                                                                                        className="form-check mb-0"
                                                                                        key={
                                                                                          service.service_code
                                                                                        }
                                                                                      >
                                                                                        <input
                                                                                          className="form-check-input form-check-input_fill"
                                                                                          type="checkbox"
                                                                                          checked={
                                                                                            service.is_selected ===
                                                                                            "1"
                                                                                          }
                                                                                        />
                                                                                        <label
                                                                                          className="form-check-label"
                                                                                          htmlFor={`service_${service.service_code}`}
                                                                                        >
                                                                                          {
                                                                                            service.service_name
                                                                                          }
                                                                                        </label>
                                                                                        {service.price ? (
                                                                                          <span className="fw-semibold">
                                                                                            {"(" +
                                                                                              extractNumber(
                                                                                                service.price
                                                                                              ).toFixed(
                                                                                                2
                                                                                              ) +
                                                                                              " " +
                                                                                              service.currency +
                                                                                              ")"}
                                                                                          </span>
                                                                                        ) : (
                                                                                          ""
                                                                                        )}
                                                                                      </div>
                                                                                    )}
                                                                                </React.Fragment>
                                                                              );
                                                                            }
                                                                          )
                                                                        : null}
                                                                    </div>
                                                                  </>
                                                                ) : (
                                                                  <p className="pe-4 fs-14px">
                                                                    <b>
                                                                      Certificate
                                                                      No
                                                                    </b>{" "}
                                                                    :{" "}
                                                                    {
                                                                      order1.cert_lab
                                                                    }{" "}
                                                                    {
                                                                      order1.product_sku
                                                                    }
                                                                  </p>
                                                                )}
                                                              </div>
                                                              <p className="fs-16px mb-2 fw-600 profile-title">
                                                                {
                                                                  order1.currency
                                                                }
                                                                &nbsp;
                                                                {numberWithCommas(
                                                                  order1.price
                                                                )}
                                                              </p>
                                                              {singleOrder.vertical_code ===
                                                              "LDIAM" ? (
                                                                <p className="mb-1 fs-14px">
                                                                  {" "}
                                                                  No of Stone :{" "}
                                                                  {order1.count}
                                                                </p>
                                                              ) : (
                                                                ""
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                          </div>
                                          <div className="Quantity_pz">
                                            <div className="Quantity_text text-end">
                                              <p className="mb-0 fs-14px">
                                                <span>Quantity</span> :{" "}
                                                {singleOrder[0].quantity}
                                              </p>
                                            </div>
                                            <div className="OrderStatus_right">
                                              <h2 className="fs-18px fw-600 profile-title">
                                                {orderDetailsData.base_currency}
                                                &nbsp;
                                                {numberWithCommas(
                                                  Number(
                                                    orderDetailsData.net_amount
                                                  ).toFixed(2)
                                                )}
                                              </h2>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            }
                          })
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="order-details-page-part">
                <div className="d-flex justify-content-between align-items-center order-detail-heading">
                  <p className="fs-18px fw-500">
                    Payment & Shipping Infomations
                  </p>
                </div>
                <div className="order-detail-payment-shipping">
                  <div className="row">
                    <div className="col-12">
                      <div className=" pay-shipp">
                        <div className="ShippingInfomations">
                          <div className="Infomations_inner">
                            <h5 className="fs-16px mb-10px">Payment Method</h5>
                            {paymentMethod.payment_name !== "" || undefined ? (
                              <p className="fs-13px">
                                {paymentMethod.payment_name}
                              </p>
                            ) : (
                              <p className="fs-13px">No Payment Method Found</p>
                            )}
                          </div>
                        </div>
                        <div className="ShippingInfomations">
                          <div className="Infomations_inner">
                            {isEmpty(paymentMethod.payment_transaction_id) !==
                            "" ? (
                              <div>
                                <h5 className="fs-16px mb-10px">
                                  Transaction ID
                                </h5>{" "}
                                <div className="fs-13px">
                                  &nbsp;{paymentMethod.payment_transaction_id}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="ShippingInfomations">
                          <div className="Infomations_inner">
                            <h5 className="fs-16px mb-10px">Billing Address</h5>
                            {billindAddress.address !== "" || undefined ? (
                              <>
                                <p className="fs-13px">{billindAddress.name}</p>
                                <p className="fs-13px">
                                  {isEmpty(billindAddress.building) != "" ? (
                                    <>{billindAddress.building},</>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {isEmpty(billindAddress.building_name) !=
                                  "" ? (
                                    <>{billindAddress.building_name},</>
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fs-13px">
                                  {billindAddress.street},
                                </p>
                                <p className="fs-13px">
                                  {billindAddress.address}.
                                </p>
                                <p className="fs-13px">
                                  Contact No. {billindAddress.contact}.
                                </p>
                              </>
                            ) : (
                              <p className="fs-13px">No Address Found</p>
                            )}
                          </div>
                        </div>
                        <div className="ShippingInfomations">
                          <div className="Infomations_inner">
                            <h5 className="fs-16px mb-10px">
                              Shipping Address
                            </h5>
                            {shippingAddress.address !== "" || undefined ? (
                              <>
                                <p className="fs-13px">
                                  {shippingAddress.name}
                                </p>
                                <p className="fs-13px">
                                  {isEmpty(shippingAddress.building) != "" ? (
                                    <>{shippingAddress.building},</>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {isEmpty(shippingAddress.building_name) !=
                                  "" ? (
                                    <>{shippingAddress.building_name},</>
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p className="fs-13px">
                                  {shippingAddress.street},
                                </p>
                                <p className="fs-13px">
                                  {shippingAddress.address}.
                                </p>
                                <p className="fs-13px">
                                  Contact No. {shippingAddress.contact}.
                                </p>
                              </>
                            ) : (
                              <p className="fs-13px">No Address Found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="order-details-page-part">
                <div className="d-flex justify-content-between align-items-center order-detail-heading">
                  <p className="fs-18px fw-500">Order Summary</p>
                </div>
                <div className="order-detail-payment-shipping">
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="fs-15px mb-10px">No. Of Quantity</p>
                              <p className="fs-15px mb-10px">{`Subtotal ${
                                isEmpty(orderDetailsData.tax_amount) != 0
                                  ? "(Includes Tax)"
                                  : ""
                              }`}</p>
                              <p className="fs-15px mb-10px">{`Tax Amount ${
                                isEmpty(orderDetailsData.tax_amount) != 0
                                  ? "(Included in Subtotal)"
                                  : ""
                              }`}</p>
                              <p className="fs-15px mb-10px">{`Discount ${
                                isEmpty(orderDetailsData.coupon_code) != ""
                                  ? `(Coupon Code: ${orderDetailsData.coupon_code})`
                                  : ""
                              }`}</p>
                              <p className="fs-15px mb-10px">Charity Amount</p>
                              <h5 className="fs-15px mb-10px">Final Total</h5>
                              {orderDetailsData?.base_currency !==
                              orderDetailsData?.currency ? (
                                <>
                                  <p className="fs-15px mb-10px">
                                    Exchange Rate
                                  </p>
                                  <h5 className="fs-15px mb-10px">
                                    Exchange Rate Amount
                                  </h5>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            {
                              <div className="text-end">
                                <p className="fs-15px mb-10px">
                                  {Number(no_of_item).toFixed(4)}
                                </p>
                                <p className="fs-15px mb-10px">
                                  {orderDetailsData.base_currency}&nbsp;
                                  {numberWithCommas(
                                    Number(orderDetailsData.net_amount).toFixed(
                                      2
                                    )
                                  )}
                                </p>
                                <p className="fs-15px mb-10px">
                                  {orderDetailsData.base_currency}&nbsp;
                                  {numberWithCommas(
                                    Number(orderDetailsData.tax_amount).toFixed(
                                      2
                                    )
                                  )}
                                </p>
                                <p className="fs-15px mb-10px">
                                  {orderDetailsData.base_currency}&nbsp;-
                                  {numberWithCommas(
                                    Number(
                                      orderDetailsData.total_discount
                                    ).toFixed(2)
                                  )}
                                </p>
                                <p className="fs-15px mb-10px">
                                  {orderDetailsData.base_currency}&nbsp;
                                  {numberWithCommas(
                                    Number(
                                      orderDetailsData.csr_donation_amount
                                    ).toFixed(2)
                                  )}
                                </p>
                                <h5 className="fs-15px mb-10px">
                                  {orderDetailsData.base_currency}&nbsp;
                                  {numberWithCommas(
                                    Number(
                                      orderDetailsData.total_net_amount
                                    ).toFixed(2)
                                  )}
                                </h5>
                                {orderDetailsData?.base_currency !==
                                orderDetailsData?.currency ? (
                                  <>
                                    <p className="fs-15px mb-10px">
                                      1 {orderDetailsData.base_currency}
                                      &nbsp;=&nbsp;
                                      {orderDetailsData.exchange_rate}{" "}
                                      {orderDetailsData.currency}
                                    </p>
                                    <h5 className="fs-15px mb-10px">
                                      {orderDetailsData.currency}&nbsp;
                                      {numberWithCommas(
                                        Number(
                                          orderDetailsData?.convert_amt
                                        ).toFixed(2)
                                      )}
                                    </h5>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="order-details-page-part">
                <div className="d-flex justify-content-between align-items-center order-detail-heading">
                  <p className="fs-18px fw-500">Order Tracking</p>
                </div>
                <div className="order-detail-payment-shipping">
                  <div className="timeline">
                    <ol className="timeline__list">
                      {orderHistoryDataList.length > 0 &&
                        orderHistoryDataList.map((shippi, isp) => {
                          let dates = new Date(shippi.status_date);
                          let newDate = new Date(dates).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          );
                          return (
                            <React.Fragment key={isp}>
                              <li
                                className={`timeline_todo ${
                                  isEmpty(shippi.status_date) !== ""
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="icon_tick ic_check"></div>
                                <div className="timeline__timestamp">
                                  <div className="timeline_title">
                                    {shippi.status_desc}
                                  </div>
                                  {isEmpty(shippi.status_date) !== "" ? (
                                    <React.Fragment>
                                      <span className="timeline_date">
                                        {newDate}
                                      </span>
                                    </React.Fragment>
                                  ) : (
                                    <span className="timeline_date">
                                      &nbsp;
                                    </span>
                                  )}
                                </div>
                              </li>
                            </React.Fragment>
                          );
                        })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmbossingPreview
        ebossingPreviewModalBaseView={ebossingPreviewModalBaseView}
        setEmbossingPreviewModalBaseView={setEmbossingPreviewModalBaseView}
        setSelectedIndex={setSelectedIndex}
        selectedIndex={selectedIndex}
        setActiveImg={setActiveImg}
        activeImg={activeImg}
      />
    </div>
  );
}

export default OrderDetail;
