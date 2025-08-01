import React, { useEffect, useMemo, useState } from "react";
import "./Profile.module.scss";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  loginData,
  loginModal,
  DefaultBillingAddress,
  orderAction,
  verificationStatusAction,
} from "../../Redux/action";
import "react-loading-skeleton/dist/skeleton.css";
import commanService, { imageUrl } from "../../CommanService/commanService";
import Loader from "../../CommanUIComp/Loader/Loader";
import Notification from "../../CommanUIComp/Notification/Notification";
import {
  isEmpty,
  onlyNumbers,
  RandomId,
  validateWithOnlyLetters,
} from "../../CommanFunctions/commanFunctions";
import Availablecoupon from "./OrderManagment/Availablecoupon";
import ReviewAdd from "./OrderManagment/ReviewAdd";
import OrderComponent from "./OrderManagment/OrderComponent";
import OrderDetail from "./OrderManagment/OrderDetail";
import Warrantycard from "./Warranty-card/Warrantycard";
import Select from "react-select";
import Journeycatalog from "./JourneyCatalogue/Journeycatalog";
import Verification from "./Verification/Verification";
import VerifiedCard from "./Verification/VerifiedCard";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Image from "next/image";

const Profile = () => {
  // Comman
  const dispatch = useDispatch();
  const navigate = useRouter();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);
  const isVerified = useSelector((state) => state.isVerified);
  const params = useParams();
  const [toastmsg, setTostmsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [tostShow, setTostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = Object.keys(loginData).length > 0;

  // One Time API call
  const [onceupdated, setOnceupdate] = useState(false);
  const [update, setUpdate] = useState(false);

  // order Data
  const [totalOrderRow, setOrderTotalRow] = useState(0);
  const [perPage, setPerPage] = useState("25");
  const [totalOrderRecord, setTotalOrderRecord] = useState("0");
  const [pageValue, setPageValue] = useState(1);
  const [totalPages, setTotalpages] = useState(1);
  const [count, setCount] = useState(1);

  const [selectedTab, setSelectedTab] = useState("");
  const [isJourney, setIsJourney] = useState(false);
  const [ordershow, setOrderShow] = useState(false);
  const [isOrderTabActive, setIsOrderTabActive] = useState(false);
  const [orderDataList, setOrderDataList] = useState([]);
  const [pendingDataList, setPendingDataList] = useState([]);
  const [orderStaus, setOrderStatus] = useState("");
  const [cancelOrderStatus, setCancelOrderStatus] = useState("");
  const [orderDetailsData, setOrderDetailsData] = useState("");
  const [orderDetailDataList, setOrderDetailDataList] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [billindAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPayment] = useState("");
  const [orderHistoryDataList, setOrderHistoryDataList] = useState([]);
  const [orderDetailId, setOrderDetailId] = useState("");
  //change password
  const [oldpasswd, setOldpasswd] = useState("");
  const [newpasswd, setNewpasswd] = useState("");
  const [reEnterpasswd, setReEnterpasswd] = useState("");
  const [hideShowCurntPasswd, setHideShowCurntPasswd] = useState(false);
  const [hideShowNewPasswd, setHideShowNewPasswd] = useState(false);
  const [hideShowReEntpasswd, setHideShowReEntpasswd] = useState(false);

  //coupan
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [hasMore, setHasMore] = useState(true);
  const [skeletonLoader, setSkeletenLoader] = useState(false);

  const [coupan, setCoupan] = useState([]);
  const [coupanDataList, setCouponDataList] = useState([]);

  //address billing
  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);

  const [countryDataDrp, setGetCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);
  const [Addressbilling, setAdressBilling] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryShortCode, setCountryShortCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  //Profile
  const [pFname, setPFname] = useState(loginData.first_name);
  const [pLname, setPLname] = useState(loginData.last_name);
  const [pEmail, setPEmail] = useState(loginData.email);
  const [pPhone, setPPhone] = useState(loginData.mobile_no);
  const [pGender, setPGender] = useState(loginData.gender);
  const [pPhonecode, setPPhonecode] = useState(loginData.country_code);
  const [pCountry, setPCountry] = useState(loginData.country);
  const [pCountryShortcode, setPCountryShortCode] = useState();
  const [pCountryId, setPCountryId] = useState();
  const [pState, setPState] = useState(loginData.state);
  const [pCity, setPCity] = useState(loginData.city);

  //review
  const [addReview, setAddReview] = useState(false);
  const [imgfile, setImgFile] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [videoFile, setVideoFile] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [rating, setRating] = useState(0);
  const [headline, setHeadLine] = useState("");
  const [reviewDetail, setReviewDetail] = useState("");
  const [orderId, setOrderID] = useState("");
  const [itemNumber, setItemNumber] = useState("");
  const [variantNumber, setVariantNumber] = useState("");

  //filter
  const [orderCount, setOrderCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  let [searchDetails, setSearchDetails] = useState({
    orderId: "",
    consumerName: "",
    mobileNo: "",
  });
  const [checkInvoice, setCheckInvoice] = useState([]);
  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (base) => ({
      ...base,
      height: 45,
      minHeight: 45,
    }),
  };

  // Verification
  const [verificationStep, setVerificationStep] = useState(1);
  const [QRCodeImage, setQRCodeImage] = useState("");

  // Profile Section
  const profileData = () => {
    for (let c = 0; c < countryDataDrp.length; c++) {
      if (countryDataDrp[c].name === loginData.country) {
        setPCountry(countryDataDrp[c]);
        setPCountryShortCode(countryDataDrp[c].sortname);
        setPCountryId(countryDataDrp[c].id);
      }
    }

    for (let c = 0; c < phoneCodeDataDrp.length; c++) {
      if (phoneCodeDataDrp[c].phonecode === loginData.country_code) {
        setPPhonecode(phoneCodeDataDrp[c]);
      }
    }
  };

  const changeProfileData = (e, value) => {
    setUpdate(true);
    if (value == "fname") {
      setPFname(e.target.value);
    } else if (value == "lname") {
      setPLname(e.target.value);
    } else if (value == "email") {
      setPEmail(e.target.value);
    } else if (value == "phone_number") {
      setPPhone(e.target.value);
    } else if (value == "country") {
      setPCountry(e);
      if (e.value != "" && e.value != "Select Your Country") {
        for (let c = 0; c < countryDataDrp.length; c++) {
          if (countryDataDrp[c].name === e.value) {
            setPCountryShortCode(countryDataDrp[c].sortname);
            setPCountryId(countryDataDrp[c].id);
          }
        }
      } else {
        setPCountryShortCode("");
        setPCountry("");
        setPCountryId("");
      }
    } else if (value == "phoneCode") {
      if (e.value != "" && e.value != "Phone Code") {
        setPPhonecode(e);
      } else {
        setPPhonecode("");
      }
    } else if (value == "state") {
      setPState(e.target.value);
    } else if (value == "city") {
      setPCity(e.target.value);
    } else if (value == "gender") {
      if (e.target.value !== "" && e.target.value !== "Select Gender") {
        setPGender(e.target.value);
      } else {
        setPGender("");
      }
    }
  };

  const UpdateProfile = (unique_id) => {
    const Profile_update = {
      a: "AddUpdateConsumer",
      unique_id: unique_id,
      store_id: storeEntityId.mini_program_id,
      email: pEmail,
      first_name: pFname,
      last_name: pLname,
      mobile_no: pPhone,
      country: pCountry.value,
      country_short_code: pCountryShortcode,
      country_id: pCountryId,
      country_code: pPhonecode.value,
      state: pState,
      city: pCity,
      gender: pGender,
    };
    setLoading(true);
    if (
      ((pFname && pLname && pPhone) !== "" || undefined) &&
      pPhone.length >= 8 &&
      pPhone.length <= 15 &&
      pCountryShortcode !== "" &&
      isEmpty(pPhonecode.value) != "" &&
      pPhonecode.value != "Phone Code"
    ) {
      commanService
        .postLaravelApi("/AuthController", Profile_update)
        .then((res) => {
          if (res.data.success == 1) {
            setTostOpen(true);
            setIsSuccess(true);
            setTostmsg(res.data.message);
            consumerData(unique_id);
            setLoading(false);
            setTimeout(() => {
              setTostOpen(false);
            }, 1000);
          } else {
            setTostOpen(true);
            setIsSuccess(false);
            setTostmsg(res.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setTostOpen(true);
      setIsSuccess(false);
      if (!pFname) {
        setTostmsg("First Name Is Required");
      } else if (!pLname) {
        setTostmsg("Last Name Is Required");
      } else if (isEmpty(pPhonecode.value) == "") {
        setTostmsg("Phone Code Is Required");
      } else if (!pPhone) {
        setTostmsg("Phone Number Is Required");
      } else if (!pCountryShortcode) {
        setTostmsg("Country Is Required");
      } else if (pPhone.length < 8) {
        setTostmsg("Minimum 8 digit is Required in Phone Number");
      } else if (pPhone.length > 15) {
        setTostmsg("Maximum 15 digit is Required in Phone Number");
      } else if (!pCountryShortcode) {
        setTostmsg("Country Is Required");
      }
    }
  };

  // Order Section
  const changeOrderTab = (value) => {
    // setOrderDataList(orderDataArray);
    setPerPage("25");
    if (value === "order") {
      setOrderStatus("order");
      setCancelOrderStatus("");
    } else if (value === "Cancelled") {
      setCancelOrderStatus("Cancelled");
      setOrderStatus("");
    }
  };

  const changePagination = (e, value) => {
    if (value === "Order") {
      setPerPage(e.target.value);
      setCount(1);
      orderData(e.target.value, 1, searchDetails);
    }
    if (value === "Pending") {
      setPerPage(e.target.value);
      setCount(1);
      failedOrderData(e.target.value, 1, searchDetails);
    }
  };

  const validateDigit = (e) => {
    var key = e.key;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    }
  };

  const textOnly = (e) => {
    var key = e.key;
    var regex = /^[A-Za-z\s]+$/;
    if (!regex.test(key)) {
      e.preventDefault();
    }
  };

  const orderData = (page, count, searchDetails) => {
    var status = "";
    if (isEmpty(searchDetails.status) == "Ordered") {
      status = "PEND,CONF,WRP,COM,CUS_SHIP_REC,CUS_TO_BU,COM_SHIP";
    } else if (isEmpty(searchDetails.status) == "Shipped") {
      status = "SHIP";
    } else if (isEmpty(searchDetails.status) == "Out For Delivery") {
      status = "STR_TO_END_CUS";
    } else if (isEmpty(searchDetails.status) == "Delivered") {
      status = "CLOSE";
    }
    const getOrderDetail = {
      a: "BTOCDisplaySalesOrder",
      counsumer_id: isLogin ? loginData.member_id : RandomId,
      store_id: storeEntityId.mini_program_id,
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      per_page: page,
      number: count,
      document_status: isEmpty(status),
      SITDeveloper: "1",
      main_so_order_id: isEmpty(searchDetails.orderId),
      consumer_name: isEmpty(searchDetails.consumerName),
      mobile_no: isEmpty(searchDetails.mobileNo),
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", getOrderDetail)
      .then((res) => {
        if (res.data.success == 1) {
          if (Object.keys(res["data"]["data"]).length > 0) {
            setOrderCount(res.data.data.order);
            setCancelCount(res.data.data.pending_order ?? failCount);
            var order =
              isEmpty(res["data"]["data"].resData) !== ""
                ? res["data"]["data"].resData
                : [];
            if (order === undefined || order === "") {
              order = [];
              setLoading(false);
            }

            for (let c = 0; c < order.length; c++) {
              var data = order[c]["data"];
              for (let d = 0; d < data.length; d++) {
                data.map((e2) => {
                  let newArr1 = [];
                  let newArr2 = [];
                  if (isEmpty(e2.length) >= 2) {
                    e2.map((e1) => {
                      if (
                        e1.vertical_code !== "DIAMO" &&
                        e1.vertical_code !== "LGDIA" &&
                        e1.vertical_code !== "LDIAM" &&
                        e1.vertical_code !== "GEMST"
                      ) {
                        newArr1.push(e1.stone_position);
                        newArr2.push({
                          product_name: e1.product_name,
                          currency: order[c].currency,
                          type: e1.stone_position,
                          product_sku:
                            e1.vertical_code == "JEWEL"
                              ? e1.product_sku
                              : e1.variant_number,
                          product_variant: e1.variant_number,
                          price: 0,
                          count: 0,
                          product_detail: e1.variant_number,
                          vertical_code: isEmpty(e1.vertical_code),
                          str_document_status: e1.str_document_status,
                          quantity: e1.quantity,
                          short_summary: e1,
                          item_price: e1.line_price,
                          item_image: e1.photo,
                          eng_font: e1.eng_font,
                          eng_font_size: e1.engraving_font_size,
                          eng_max_character: e1.engraving_max_character,
                          eng_min_character: e1.engraving_min_character,
                          eng_price: e1.eng_price,
                          eng_text: e1.engraving_text,
                          engraving_currency: e1.engraving_currency,
                          is_engraving: e1.is_engraving,
                          is_embossing: e1.is_embossing,
                          embossing_image: e1.embossing_image,
                          service_json: e1.service_json,
                          pv_unique_id: e1.pv_unique_id,
                          cert_no: e1.cert_no,
                          st_color_type: e1.st_color_type,
                          cert_lab: e1.cert_lab,
                        });
                      } else {
                        var data = {
                          product_name: e1.product_name,
                          currency: order[c].currency,
                          type: e1.stone_position,
                          product_sku:
                            e1.vertical_code == "JEWEL"
                              ? e1.product_sku
                              : e1.variant_number,
                          product_variant: e1.variant_number,
                          price: 0,
                          count: 0,
                          product_detail: e1.variant_number,
                          vertical_code: isEmpty(e1.vertical_code),
                          str_document_status: e1.str_document_status,
                          quantity: e1.quantity,
                          item_price: e1.line_price,
                          item_image: e1.photo,
                          eng_font: e1.eng_font,
                          eng_font_size: e1.engraving_font_size,
                          eng_max_character: e1.engraving_max_character,
                          eng_min_character: e1.engraving_min_character,
                          eng_price: e1.eng_price,
                          eng_text: e1.engraving_text,
                          engraving_currency: e1.engraving_currency,
                          is_engraving: e1.is_engraving,
                          is_embossing: e1.is_embossing,
                          embossing_image: e1.embossing_image,
                          service_json: e1.service_json,
                          pv_unique_id: e1.pv_unique_id,
                          cert_no: e1.cert_no,
                          st_color_type: e1.st_color_type,
                          cert_lab: e1.cert_lab,
                        };
                        newArr2.push(data);
                      }
                      return e1;
                    });
                    e2.types = newArr2;
                  }
                  return e2;
                });
                data.map((e2) => {
                  if (isEmpty(e2.length) >= 2) {
                    let countType = {};
                    e2.map((o) => {
                      e2.types.map((tp, i) => {
                        tp.price = tp.item_price;
                        if (tp.type == "") {
                          var b = e2.types[0];
                          e2.types[0] = tp;
                          e2.types[i] = b;
                        }
                        if (tp.type == "CENTER") {
                          var b = e2.types[1];
                          e2.types[1] = tp;
                          e2.types[i] = b;
                        }
                        return tp;
                      });
                      return o;
                    });
                  }
                  return e2;
                });
              }
            }

            setOrderDataList(order);
            // dispatch(orderAction(order))
            setOrderTotalRow(res.data.data.total_rows);
            setPageValue(res.data.data.pg_value);
            setLoading(false);
            setCancelOrderStatus("");
            setTotalpages(res.data.data.total_pages);
          } else {
            // setOrderDataList([])
            setLoading(false);
            setCancelOrderStatus("");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const searchResetData = (value) => {
    setSearchDetails(value);
    setPerPage(25);
    setCount(1);
    if (selectedTab == "Order_") {
      orderData(25, 1, value);
    } else {
      failedOrderData(25, 1, value);
    }
  };

  const failedOrderData = (page, count, searchDetails) => {
    const OrderControl = {
      a: "getFailedOrder",
      store_id: storeEntityId.mini_program_id,
      customer_id: isLogin ? loginData.member_id : RandomId,
      per_page: page,
      number: count,
      status: isEmpty(searchDetails?.status),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/OrderController", OrderControl)
      .then((res) => {
        if (res.data.success == 1) {
          setFailCount(res.data.data.number);
          const data1 = [...res.data.data.result];
          let sum = 0;
          data1.map((value) => {
            let newArr1 = [];
            let newArr2 = [];
            value.order_lines.map((pen1) => {
              if (pen1.length >= 2) {
                pen1.map((pen) => {
                  pen.photo =
                    isEmpty(pen.photo) !== "" || null
                      ? pen.photo
                      : "https://via.placeholder.com/500X500";
                  if (
                    pen.vertical_code != "DIAMO" &&
                    pen.vertical_code !== "LGDIA" &&
                    pen.vertical_code !== "LDIAM" &&
                    pen.vertical_code !== "GEMST"
                  ) {
                    newArr1.push(pen.stone_position);
                    newArr2.push({
                      product_name: pen.product_name,
                      currency: value.payment_currency,
                      type: pen.stone_position,
                      product_sku: pen.product_sku,
                      cert_no: pen.cert_no,
                      product_variant: pen.variant_number,
                      price_display: pen.price_display,
                      price: 0,
                      count: 0,
                      vertical_code: pen.vertical_code,
                      quantity: pen.quantity,
                      short_summary: pen.short_summary,
                      item_image: pen.photo,
                      pv_unique_id: pen.pv_unique_id,
                      cert_lab: pen.cert_lab,
                      st_color_type: pen.st_color_type,
                    });
                  } else {
                    newArr2.push({
                      product_name: pen.product_name,
                      currency: value.payment_currency,
                      type: pen.stone_position,
                      product_sku: pen.product_sku,
                      cert_no: pen.cert_no,
                      cert_lab: pen.cert_lab,
                      pv_unique_id: pen.pv_unique_id,
                      st_color_type: pen.st_color_type,
                      product_variant: pen.variant_number,
                      price_display: pen.price_display,
                      price: 0,
                      count: 0,
                      vertical_code: pen.vertical_code,
                      quantity: pen.quantity,
                      item_image: pen.photo,
                    });
                  }
                  return pen;
                });
              } else {
                pen1.map(
                  (pen) =>
                    (pen.photo =
                      isEmpty(pen.photo) !== ""
                        ? pen.photo
                        : "https://via.placeholder.com/500X500")
                );
              }
              return pen1;
            });
            value.types = newArr2;
            sum += value.net_amount;
            return value;
          });
          data1.map((value) => {
            value.order_lines.map((penmain) => {
              if (penmain.length >= 2) {
                let countType = {};
                value.types.map((tp) => {
                  let count = 0;
                  value.order_lines.map((pen1) => {
                    pen1.map((pen) => {
                      tp.price = Number(pen.price_display);
                      return pen;
                    });
                    return pen1;
                  });
                  return tp;
                });
              }
              return penmain;
            });
            return value;
          });
          setPendingDataList(data1);
          setPerPage(res.data.data.per_page);
          setTotalOrderRecord(res.data.data.total);
          setTotalpages(res.data.data.total_pages);
          setPageValue(res.data.data.pg_value);
          setOrderStatus("");
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const consumerData = (unique_id) => {
    const consumerData = {
      a: "getDataConsumer",
      unique_id: unique_id,
      store_id: storeEntityId.mini_program_id,
      per_page: "0",
      number: "0",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/AuthController", consumerData)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res.data.data;
          for (let c = 0; c < data.length; c++) {
            if (loginData.member_id === data[c].member_id) {
              dispatch(loginData(data[c]));
            }
          }
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  // Order Detail
  const displayOrderDetail = (order_id) => {
    const Order_detail = {
      a: "BTOCDisplaySalesOrder",
      counsumer_id: isLogin ? loginData.member_id : RandomId,
      store_id: storeEntityId.mini_program_id,
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      per_page: 0,
      number: 0,
      SITDeveloper: "1",
      main_so_order_id: order_id,
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", Order_detail)
      .then((res) => {
        if (res.data.success == 1) {
          var order =
            isEmpty(res["data"]["data"]) !== "" ? res["data"]["data"] : [];
          if (order === undefined || order === "") {
            order = [];
            setLoading(false);
          }
          for (let c = 0; c < order.length; c++) {
            var data = order[c]["data"];
            for (let d = 0; d < data.length; d++) {
              data.map((e2) => {
                let newArr1 = [];
                let newArr2 = [];
                if (isEmpty(e2.length) >= 2) {
                  e2.map((e1) => {
                    if (
                      e1.vertical_code !== "DIAMO" &&
                      e1.vertical_code !== "GEMST" &&
                      e1.vertical_code !== "LDIAM" &&
                      e1.vertical_code !== "LGDIA"
                    ) {
                      newArr1.push(e1.stone_position);
                      newArr2.push({
                        product_name: e1.product_name,
                        currency: order[c].currency,
                        type: e1.stone_position,
                        product_sku:
                          e1.vertical_code == "JEWEL"
                            ? e1.product_sku
                            : e1.variant_number,
                        product_variant: e1.variant_number,
                        price: 0,
                        count: 0,
                        product_detail: e1.variant_number,
                        vertical_code: isEmpty(e1.vertical_code),
                        str_document_status: e1.str_document_status,
                        quantity: e1.quantity,
                        short_summary: e1,
                        item_price: e1.line_price,
                        item_image: e1.photo,
                        eng_font: e1.eng_font,
                        eng_font_size: e1.engraving_font_size,
                        eng_max_character: e1.engraving_max_character,
                        eng_min_character: e1.engraving_min_character,
                        eng_price: e1.eng_price,
                        eng_text: e1.engraving_text,
                        engraving_currency: e1.engraving_currency,
                        is_engraving: e1.is_engraving,
                        is_embossing: e1.is_embossing,
                        embossing_image: e1.embossing_image,
                        service_json: e1.service_json,
                        pv_unique_id: e1.pv_unique_id,
                        cert_lab: e1.cert_lab,
                      });
                    } else {
                      newArr2.push({
                        product_name: e1.product_name,
                        currency: order[c].currency,
                        type: e1.stone_position,
                        product_sku:
                          e1.vertical_code == "JEWEL"
                            ? e1.product_sku
                            : e1.variant_number,
                        product_variant: e1.variant_number,
                        price: 0,
                        count: 0,
                        product_detail: e1.variant_number,
                        vertical_code: isEmpty(e1.vertical_code),
                        str_document_status: e1.str_document_status,
                        quantity: e1.quantity,
                        item_price: e1.line_price,
                        item_image: e1.photo,
                        eng_font: e1.eng_font,
                        eng_font_size: e1.engraving_font_size,
                        eng_max_character: e1.engraving_max_character,
                        eng_min_character: e1.engraving_min_character,
                        eng_price: e1.eng_price,
                        eng_text: e1.engraving_text,
                        engraving_currency: e1.engraving_currency,
                        is_engraving: e1.is_engraving,
                        is_embossing: e1.is_embossing,
                        embossing_image: e1.embossing_image,
                        service_json: e1.service_json,
                        pv_unique_id: e1.pv_unique_id,
                        cert_lab: e1.cert_lab,
                      });
                    }
                    return e1;
                  });
                  e2.types = newArr2;
                }
                return e2;
              });
              data.map((e2) => {
                if (isEmpty(e2.length) >= 2) {
                  let countType = {};
                  e2.map((o) => {
                    e2.types.map((tp, i) => {
                      tp.price = tp.item_price;
                      if (tp.type == "") {
                        var b = e2.types[0];
                        e2.types[0] = tp;
                        e2.types[i] = b;
                      }
                      if (tp.type == "CENTER") {
                        var b = e2.types[1];
                        e2.types[1] = tp;
                        e2.types[i] = b;
                      }
                      return tp;
                    });
                    return o;
                  });
                }
                return e2;
              });
            }
          }
          setOrderDetailDataList(order);
          orderHistoryData(order_id);
          orderDetails(order_id);
          setOrderDetailId(order_id);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const detailShow = (orderedd, value) => {
    if (value === "Order") {
      displayOrderDetail(orderedd.main_so_order_id);
    } else {
      displayOrderDetail(orderedd.order_id);
    }
    const getInvoiceDetail = {
      a: "GetInvoiceStoreCheck",
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      order_id: orderedd.main_so_order_id,
      SITDeveloper: "1",
    };
    commanService
      .postApi("/SalesOrderToStore", getInvoiceDetail)
      .then((res) => {
        setCheckInvoice(res["data"]["data"]);
        setOrderShow(true);
      });
  };

  const handleOrderDetailShow = (id, value) => {
    if (value === "Order") {
      displayOrderDetail(id);
    }
    const getInvoiceDetail = {
      a: "GetInvoiceStoreCheck",
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      order_id: id,
      SITDeveloper: "1",
    };
    commanService
      .postApi("/SalesOrderToStore", getInvoiceDetail)
      .then((res) => {
        setCheckInvoice(res["data"]["data"]);
        setOrderShow(true);
      });
  };

  const detailClose = () => {
    setOrderShow(false);
    if (params.orderId !== undefined) {
      params.orderId = undefined;
      navigate.push("/order-details");
    }
  };

  const orderHistoryData = (order_id) => {
    const orderLoacte = {
      a: "GetSalesOrderHistory",
      so_order_id: "",
      unique_id: "",
      order_id: order_id,
      store_id: storeEntityId.mini_program_id,
      customer_id: storeEntityId.customer_id,
      business_unit_id: null,
      counsumer_id: isLogin ? loginData.member_id : RandomId,
      reference_order_id: "",
      per_page: 0,
      number: 0,
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      SITDeveloper: "1",
      origin: storeEntityId.cmp_origin,
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", orderLoacte)
      .then((res) => {
        if (res.data.success == 1) {
          const sdata = res.data.data;
          setOrderHistoryDataList(sdata);
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const orderDetails = (order_id) => {
    const OrderShipping = {
      SITDeveloper: "1",
      a: "GetOrderidWiseDataDisplay",
      order_id: order_id,
      per_page: 0,
      number: 0,
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      sorting_column: "",
      sorting_order: "",
      origin: storeEntityId.cmp_origin,
      type: "portal",
    };
    setLoading(true);
    commanService
      .postApi("/SalesOrder", OrderShipping)
      .then((res) => {
        if (res.data.success == 1) {
          setShippingAddress(res.data.data.shipping_address);
          setBillingAddress(res.data.data.billing_address);
          setPayment(res.data.data.payment_transaction);
          setOrderDetailsData(res.data.data.order_details);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const printInvoice = (Order_Id) => {
    window.open(
      imageUrl +
        "/generateInvoice?store_id=" +
        storeEntityId.mini_program_id +
        "&user_id=" +
        loginData.member_id +
        "&order_id=" +
        Order_Id +
        "&origin=" +
        storeEntityId.cmp_origin,
      "_blank"
    );
  };

  const reviewModal = (data, id) => {
    let dataproduct = data.data;
    for (let index = 0; index < dataproduct.length; index++) {
      if (id === index) {
        if (dataproduct[index].length >= 2) {
          for (let index1 = 0; index1 < dataproduct[index].length; index1++) {
            if (
              isEmpty(dataproduct[index][index1].vertical_code !== "DIAMO") &&
              isEmpty(dataproduct[index][index1].vertical_code !== "LGDIA") &&
              isEmpty(dataproduct[index][index1].vertical_code !== "GEMST") &&
              isEmpty(dataproduct[index][index1].vertical_code !== "LDIAM")
            ) {
              setItemNumber(dataproduct[index][index1].item_number);
              setVariantNumber(dataproduct[index][index1].variant_number);
            }
          }
        } else {
          setItemNumber(dataproduct[index].item_number);
          setVariantNumber(dataproduct[index].variant_number);
        }
      }
    }
    setAddReview(true);
    setOrderID(data.main_so_order_id);
    setReviewDetail("");
    setImgFile([]);
    setRating(0);
    setHeadLine("");
    setVideoFile("");
    setVideoPreview("");
    setImgPreview([]);
  };

  //Adressdata
  const countryDrp = () => {
    const countryDataDrp = {
      a: "getCountry",
      SITDeveloper: "1",
    };
    setLoading(true);
    commanService
      .postApi("/TechnicalManagement", countryDataDrp)
      .then((res) => {
        if (res.data.success == 1) {
          typeof window !== "undefined" &&
            sessionStorage.setItem(
              "country_data",
              JSON.stringify(res.data.data)
            );
          countrySetDrp();
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const countrySetDrp = () => {
    var data = JSON.parse(
      typeof window !== "undefined" && sessionStorage.getItem("country_data")
    );
    for (let c = 0; c < data.length; c++) {
      data[c]["value"] = data[c]["name"];
      data[c]["label"] = data[c]["name"];
    }
    data.splice(0, 0, { value: "", label: "Select Your Country" });
    setGetCountryDataDrp(data);
    setTimeout(() => {
      phoneCodeSetDrp();
    });
  };

  const phoneCodeSetDrp = () => {
    var pdata = JSON.parse(
      typeof window !== "undefined" && sessionStorage.getItem("country_data")
    );
    for (let c = 0; c < pdata.length; c++) {
      pdata[c]["value"] = pdata[c]["phonecode"];
      pdata[c]["label"] = pdata[c]["phonecode"] + " - " + pdata[c]["name"];
    }
    pdata.splice(0, 0, { value: "", label: "Phone Code" });
    setPhoneCodeDataDrp(pdata);
  };

  const showAddress = () => {
    setUpdate(false);
    setShowAddModal(true);
    setCountryShortCode("");
    setCountryId("");
    setCountry("");
    setPincode("");
    setState("");
    setFname("");
    setLname("");
    setCity("");
    setStreet("");
    setBuilding("");
    setBuildingName("");
    setDescription("");
    setPhoneCode("");
    setPhone("");
  };

  const changeAddressBilling = (e, value) => {
    if (value == "fname") {
      setFname(e.target.value);
    } else if (value == "lname") {
      setLname(e.target.value);
    } else if (value == "Country") {
      setCountry(e);
      for (let c = 0; c < countryDataDrp.length; c++) {
        if (e.value != "Select Your Country") {
          if (countryDataDrp[c].name === e.value) {
            setCountryShortCode(countryDataDrp[c].sortname);
            setCountryId(countryDataDrp[c].id);
          }
        } else {
          setCountryShortCode("");
          setCountryId("");
        }
      }
    } else if (value == "phoneCode") {
      if (e.value != "Phone Code") {
        setPhoneCode(e);
      } else {
        setPhoneCode("");
      }
    } else if (value == "phone") {
      setPhone(e.target.value);
    } else if (value == "building") {
      setBuilding(e.target.value);
    } else if (value == "buildingName") {
      setBuildingName(e.target.value);
    } else if (value == "description") {
      setDescription(e.target.value);
    } else if (value == "street") {
      setStreet(e.target.value);
    } else if (value == "city") {
      setCity(e.target.value);
    } else if (value == "state") {
      setState(e.target.value);
    } else if (value == "Pincode") {
      setPincode(e.target.value);
    }
  };

  const addressData = (Member_id) => {
    const Address = {
      a: "GetBilling",
      user_id: !Member_id ? loginData.member_id : Member_id,
      store_id: storeEntityId.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", Address)
      .then((res) => {
        if (res.data.success == 1) {
          setUpdate(false);
          var billingData = res.data.data;
          setAdressBilling(billingData);
          if (billingData.length > 0) {
            for (let c = 0; c < billingData.length; c++) {
              if (billingData[c].status === 1) {
                dispatch(DefaultBillingAddress(billingData[c]));
              }
            }
          }
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const editAddress = (data) => {
    setUpdate(true);
    setShowAddModal(true);
    setUniqueId(data.unique_id);
    setCountryId(data.country_id);
    setCountryShortCode(data.country_short_code);
    // setCountry(data.country == "Select Your Country" ? "" : data.country)
    // setPhoneCode(data.country_code)
    setPincode(data.pincode);
    setState(data.state);
    setFname(data.first_name);
    setLname(data.last_name);
    setCity(data.city);
    setStreet(data.street);
    setBuilding(data.building);
    setBuildingName(data.address);
    setDescription(data.description);
    setPhone(data.mobile_no);
    for (let c = 0; c < countryDataDrp.length; c++) {
      if (countryDataDrp[c].name === data.country) {
        setCountry(countryDataDrp[c]);
      }
    }

    for (let c = 0; c < phoneCodeDataDrp.length; c++) {
      if (phoneCodeDataDrp[c].phonecode === data.country_code) {
        setPhoneCode(phoneCodeDataDrp[c]);
      }
    }
  };

  const addUpdateAddress = (Member_id, uniqueId) => {
    const update_address = {
      a: "AddUpdateBilling",
      store_id: storeEntityId.mini_program_id,
      unique_id: update ? uniqueId : "",
      company_name: "",
      building: building,
      street: street,
      address: isEmpty(buildingName),
      description: isEmpty(description),
      country: country.value,
      country_id: countryId,
      country_code: phoneCode.value,
      country_short_code: countryShortCode,
      state: state,
      city: city,
      pincode_no: pincode,
      mobile_no: phone,
      user_id: Member_id,
      first_name: fname,
      last_name: lname,
    };
    setLoading(true);
    if (
      ((fname &&
        lname &&
        city &&
        phone &&
        pincode &&
        street &&
        building &&
        country.value &&
        phoneCode.value) !== "" ||
        undefined) &&
      country.value !== "Select Your Country" &&
      phoneCode.value !== "Phone Code" &&
      phone.length >= 8 &&
      phone.length <= 15 &&
      pincode.length >= 5 &&
      pincode.length <= 6
    ) {
      commanService
        .postLaravelApi("/BillingDetails", update_address)
        .then((res) => {
          if (res.data.success) {
            setTostOpen(true);
            setIsSuccess(true);
            setTostmsg(res.data.message);
            addressData(Member_id);
            setUpdate(false);
            setShowAddModal(false);
            setLoading(false);
            setTimeout(() => {
              setTostOpen(false);
            }, 1000);
          } else {
            setTostOpen(true);
            setIsSuccess(false);
            setTostmsg(res.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setTostOpen(true);
      setIsSuccess(false);
      if (!fname) {
        setTostmsg("Enter Your First Name");
      } else if (!lname) {
        setTostmsg("Enter Your Last Name");
      } else if (!building) {
        setTostmsg("Enter Your Building");
      } else if (!street) {
        setTostmsg("Enter Your Street");
      } else if (!city) {
        setTostmsg("Enter Your City");
      } else if (!country.value || country.value == "Select Your Country") {
        setTostmsg("Select Your Country");
      } else if (!phoneCode.value || phoneCode.value == "Phone Code") {
        setTostmsg("Phone Code Required");
      } else if (!phone) {
        setTostmsg("Mobile Number Required");
      } else if (phone.length < 8) {
        setTostmsg("Minimum 8 digit is Required in Phone Number");
      } else if (phone.length > 15) {
        setTostmsg("Maximum 15 digit is Required in Phone Number");
      } else if (!pincode) {
        setTostmsg("Enter Your Pincode");
      } else if (pincode.length < 5) {
        setTostmsg("Minimum 5 digit is Required in Pincode");
      } else if (pincode.length > 6) {
        setTostmsg("Maximum 6 digit is Required in Pincode");
      }
      setLoading(false);
    }
  };

  const deleteAddresses = (id) => {
    const DeteteIt = {
      a: "deleteBilling",
      unique_id: id,
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", DeteteIt)
      .then((res) => {
        if (res.data.success == 1) {
          setTostOpen(true);
          setIsSuccess(true);
          setTostmsg(res.data.message);
          addressData();
          setLoading(false);
          setTimeout(() => {
            setTostOpen(false);
          }, 1000);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const defaultAdress = (unique_id) => {
    const Default_Address = {
      a: "DefaultBilling",
      store_id: storeEntityId.mini_program_id,
      unique_id: unique_id,
      user_id: isLogin ? loginData.member_id : RandomId,
    };
    setLoading(true);
    commanService
      .postLaravelApi("/BillingDetails", Default_Address)
      .then((res) => {
        if (res.data.success == 1) {
          setTostOpen(true);
          setIsSuccess(true);
          setTostmsg(res.data.message);
          setState("1");
          addressData(isLogin ? loginData.member_id : RandomId);
          setLoading(false);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  //coupan
  const couponData = (count) => {
    const Dataofcoupon = {
      a: "GetActiveCoupon",
      status: "1",
      store_id: storeEntityId.mini_program_id,
      per_page: 15,
      number: count ?? "1",
      type: "B2C",
    };
    setSkeletenLoader(true);
    commanService
      .postLaravelApi("/CouponController", Dataofcoupon)
      .then((res) => {
        if (res.data.success === 1) {
          setCoupan([]);
          const coupaData = res.data.data.result;
          if (coupaData.length < 15) {
            setHasMore(false);
          }
          let arr = [];
          if (coupaData.length > 0) {
            for (let a = 0; a < coupaData.length; a++) {
              coupaData[a]["check"] = false;
              arr.push(coupaData[a]);
            }
            setCoupan(arr);
          }
          setCouponDataList(res.data.data);
          setTimeout(() => {
            setSkeletenLoader(false);
          }, 100);
        } else {
          setTostOpen(true);
          setIsSuccess(false);
          setTostmsg(res.data.message);
          setSkeletenLoader(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        setSkeletenLoader(true);
      });
  };

  const changeCoupon = (e) => {
    setCount(e.toString());
    couponData(e.toString());
  };

  //infinite scroll
  const fetchMoreData = () => {
    const totalRows = coupanDataList?.total_pages
      ? coupanDataList?.total_pages
      : 1;
    if (itemsLength.length >= totalRows) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setItemLength(itemsLength.concat(Array.from({ length: 1 })));
      changeCoupon(itemsLength.concat(Array.from({ length: 1 })).length);
    }, 500);
  };

  //Change PassWord
  const changePassWord = (e, value) => {
    if (value == "old") {
      setOldpasswd(e.target.value);
    } else if (value == "new") {
      setNewpasswd(e.target.value);
    } else if (value == "re-enter") {
      setReEnterpasswd(e.target.value);
    }
  };

  const updatePasswd = (unique_id) => {
    const passwd_update = {
      a: "changePassword",
      unique_id: unique_id,
      old_password: oldpasswd,
      new_password: newpasswd,
    };
    setLoading(true);
    if (
      ((oldpasswd && newpasswd && reEnterpasswd) !== "" || undefined) &&
      (oldpasswd.length && newpasswd.length && reEnterpasswd.length) >= 8 &&
      (reEnterpasswd === newpasswd) == true
    ) {
      commanService
        .postLaravelApi("/AuthController", passwd_update)
        .then((res) => {
          if (res.data.success == 1) {
            setTostOpen(true);
            setIsSuccess(true);
            setTostmsg(res.data.message);
            setTimeout(() => {
              dispatch(loginData({}));
              navigate.push("/");
              setLoading(false);
            }, 1000);
            setTimeout(() => {
              dispatch(loginModal(true));
            }, 2000);
          } else {
            setTostOpen(true);
            setIsSuccess(false);
            setTostmsg(res.data.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setTostOpen(true);
      setIsSuccess(false);
      if (!oldpasswd) {
        setTostmsg("Enter Your Current Password");
      } else if (oldpasswd.length < 8) {
        setTostmsg("Manimum 8 Letters In Current PassWord");
      } else if (!newpasswd) {
        setTostmsg("Enter Your New Password");
      } else if (newpasswd.length < 8) {
        setTostmsg("Manimum 8 Letters In New PassWord");
      } else if (!reEnterpasswd) {
        setTostmsg("Confirm Password Required");
      } else if ((reEnterpasswd === newpasswd) == false) {
        setTostmsg("Confirm Password is Wrong");
      } else if (reEnterpasswd.length < 8) {
        setTostmsg("Manimum 8 Letters In Confirm PassWord");
      }
      setLoading(false);
    }
  };

  // Logout
  const LogOut = () => {
    setLoading(true);
    setTimeout(() => {
      navigate.push("/");
      dispatch(loginData({}));
      window.location.reload(true);
      setLoading(false);
    }, 300);
    return dispatch(loginData({}));
  };

  const pagination = (value, info) => {
    let counts = count;
    if (value == "right") {
      if (counts < totalPages) {
        counts++;
        setCount(counts);
        if (info == "Pending") {
          failedOrderData(perPage, counts);
        } else {
          orderData(perPage, counts, searchDetails);
        }
      }
    } else {
      if (counts > 1) {
        counts--;
        setCount(counts);
        if (info == "Pending") {
          failedOrderData(perPage, counts);
        } else {
          orderData(perPage, counts, searchDetails);
        }
      }
    }
  };

  const handleAuthentication = () => {
    setVerificationStep(2);
  };

  useEffect(() => {
    if (isLogin == false) {
      navigate.push("/");
    } else {
      if (onceupdated == false) {
        countryDrp();
        addressData(isLogin ? loginData.member_id : RandomId);
      }
      if (params.orderId !== undefined && onceupdated == false) {
        displayOrderDetail(params.orderId);
        setOrderShow(true);
        setOrderStatus("");
      }
      if (params.true && onceupdated == false) {
        setCancelOrderStatus();
      }
      if (params.type == "true") {
        setSelectedTab("JourneyCatalogue");
      }
      if (orderStaus !== "") {
        orderData(perPage, count, searchDetails);
      }
      if (cancelOrderStatus !== "") {
        failedOrderData(perPage, count);
      }
      if (params.id === "journey-catalogue") {
        setSelectedTab("JourneyCatalogue");
      }
      setOnceupdate(true);
    }
  }, [orderStaus, cancelOrderStatus]);

  useEffect(() => {
    if (
      params.id === "my-order" ||
      window.location.pathname.includes("order-details")
    ) {
      changeOrderTab("order");
      setSelectedTab("Order_");
      setOrderShow(false);
      setIsOrderTabActive(true);
    } else if (params.id === "journey-catalogue") {
      setSelectedTab("JourneyCatalogue");
    }
    if (params.orderId !== undefined) {
      if (
        window.location.pathname.includes("order-details") &&
        params.orderId
      ) {
        changeOrderTab("order");
        setSelectedTab("Order_");
        setIsOrderTabActive(true);
      }
    }
    if (params.id === "available-coupons") {
      couponData();
    }
  }, []);

  useMemo(() => {
    if (params.id === "warranty-card") {
      setSelectedTab("WarrantyCard");
    }
    if (params.id === "verification") {
      setSelectedTab("2-Step Verification");
    }
  }, [selectedTab, params.id]);

  const fetchQrCode = () => {
    setLoading(true);
    const QRCodeObj = {
      SITDeveloper: "1",
      a: "QrCodeGenerate",
      entity_id: storeEntityId.entity_id,
      miniprogram_id: storeEntityId.mini_program_id,
      secret_key: storeEntityId.secret_key,
      tenant_id: storeEntityId.tenant_id,
      member_id: isLogin ? loginData.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", QRCodeObj)
      .then((response) => {
        if (response.data.success === 1) {
          setQRCodeImage(response.data.data);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQrCode();
  }, []);

  return (
    <>
      <section id="Profile">
        {loading && <Loader />}
        <div className="container">
          {params.id && !ordershow ? (
            <div
              className="back-btn mb-2 justify-content-end"
              onClick={() => {
                if (window.location.pathname.includes("order-details")) {
                  setIsOrderTabActive(true);
                }
                navigate.push("/dashboard/");
              }}
            >
              <i className="ic_chavron_left me-1" />
              <div className="text-decoration-underline">BACK</div>
            </div>
          ) : window.location.pathname.includes("order-details") ? (
            ordershow ? (
              ""
            ) : (
              <div
                className="back-btn mb-2 justify-content-end"
                onClick={() => {
                  navigate.push("/dashboard/");
                }}
              >
                <i className="ic_chavron_left me-1" />
                <div className="text-decoration-underline">BACK</div>
              </div>
            )
          ) : (
            ""
          )}
          <div className="row">
            <div className="profile-tabs spaceB">
              {params.id ||
              window.location.pathname.includes("order-details") ? (
                ""
              ) : (
                <div className="mb-4">
                  <h3 className="mb-3 profile-title">Dashboard</h3>
                  <p className="">
                    Hello,{" "}
                    <span className="profile-highlight">
                      {loginData.first_name}
                    </span>{" "}
                    ( IF Not{" "}
                    <span className="profile-highlight">
                      {loginData.first_name}&nbsp;{loginData.last_name}
                    </span>{" "}
                    Logout ) From Your account dashboard.you can easily check &
                    view your recent orders, manage your shipping and billing
                    addresses and edit your password and account details.
                  </p>
                </div>
              )}
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={
                  params.id === "journey-catalogue"
                    ? "JourneyCatalogue"
                    : params.id === "my-order" ||
                      window.location.pathname.includes("order-details")
                    ? "Order_"
                    : params.id === "warranty-card"
                    ? "WarrantyCard"
                    : params.id === "profile"
                    ? "Profile"
                    : params.id === "address-billing"
                    ? "AddressBilling"
                    : params.id === "available-coupons"
                    ? "AvailableCoupons"
                    : params.id === "verification"
                    ? "2-Step Verification"
                    : params.id === "change-password"
                    ? "ChangePassword"
                    : "Cancelled_"
                }
                // defaultActiveKey={`${params.type == 'true' ? 'JourneyCatalogue' : params.orderId !== undefined || params.true ? "Order_" : "Cancelled_"}`}
              >
                {params.id ||
                window.location.pathname.includes("order-details") ? (
                  <div className="col-12 col-xl-12">
                    <Tab.Content>
                      <Tab.Pane eventKey="dashboard">
                        <div className="tab-pane ">
                          <div className="mb-3">
                            <h3 className="mb-3 profile-title">Details</h3>
                            <form>
                              <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                  {loginData.first_name !== "" ? (
                                    <>
                                      <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                        First Name
                                      </label>
                                      <input
                                        type="text"
                                        className="w-100"
                                        placeholder="Enter First Name"
                                        value={loginData.first_name || ""}
                                        disabled
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                  {loginData.last_name !== "" ? (
                                    <>
                                      <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                        Last Name
                                      </label>
                                      <input
                                        type="text"
                                        className="w-100"
                                        placeholder="Enter Last Name"
                                        value={loginData.last_name || ""}
                                        disabled
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                  {loginData.email !== "" ? (
                                    <>
                                      <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                        Email
                                      </label>
                                      <input
                                        type="mail"
                                        className="w-100"
                                        placeholder="Enter Email"
                                        value={loginData.email || ""}
                                        disabled
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                <div className="col-12 col-sm-6 mb-3">
                                  {loginData.mobile_no !== "" ? (
                                    <>
                                      <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                        Phone Code/Mobile Number*
                                      </label>
                                      <div className="input-group">
                                        <span
                                          className="input-group-text rounded-0"
                                          id="basic-addon1"
                                        >
                                          {loginData.country_code}
                                        </span>
                                        <input
                                          type="tel"
                                          className="w-100"
                                          placeholder="Enter Mobile  Number"
                                          value={loginData.mobile_no || ""}
                                          disabled
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </form>
                          </div>

                          <div>
                            {isEmpty(Addressbilling) !== "" ? (
                              <>
                                {Addressbilling.length > 0 &&
                                  Addressbilling.map((item, i) => {
                                    return item.status == "1" ? (
                                      <h3
                                        className="mb-3 fs-18px profile-sub-heading"
                                        key={i}
                                      >
                                        Address
                                      </h3>
                                    ) : (
                                      ""
                                    );
                                  })}
                                <div className="address-wrap row">
                                  {Addressbilling.length > 0 &&
                                    Addressbilling.map((Address_detail, i) => {
                                      return Address_detail.status == "1" ? (
                                        <div
                                          className="col-12 col-sm-6 col-md-4 col-lg-6 col-xxl-4 mb-3"
                                          key={i}
                                        >
                                          <div className="card h-100 rounded-0 border-0 sec-bg-color">
                                            <div className="card-body card-height">
                                              <div className="text-end p-1">
                                                <span className="fs-16px">
                                                  Default
                                                </span>
                                              </div>
                                              <div className="d-flex justify-content-between">
                                                <div>
                                                  <h4 className="add-title fs-20px mb-5px">
                                                    {Address_detail.first_name}{" "}
                                                    {Address_detail.last_name}
                                                  </h4>
                                                  <p className="fs-15px">
                                                    {Address_detail.building},
                                                    {Address_detail.address ? (
                                                      <>
                                                        {Address_detail.address}
                                                        ,
                                                      </>
                                                    ) : (
                                                      ""
                                                    )}{" "}
                                                    {Address_detail.street},
                                                    {Address_detail.description ? (
                                                      <>
                                                        {
                                                          Address_detail.description
                                                        }
                                                        ,
                                                      </>
                                                    ) : (
                                                      ""
                                                    )}
                                                    {Address_detail.city} {"-"}
                                                    {Address_detail.pincode},
                                                    {Address_detail.state},
                                                    {Address_detail.country}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      );
                                    })}
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Profile">
                        <div className="tab-pane ">
                          <div>
                            <h3 className="mb-3 profile-title">Profile</h3>
                            <form>
                              <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    First Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="w-100"
                                    placeholder="Enter First Name"
                                    value={pFname}
                                    onChange={(e) => {
                                      if (
                                        validateWithOnlyLetters(e.target.value)
                                      ) {
                                        changeProfileData(e, "fname");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    Last Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="w-100"
                                    placeholder="Enter Last Name"
                                    value={pLname}
                                    onChange={(e) => {
                                      if (
                                        validateWithOnlyLetters(e.target.value)
                                      ) {
                                        changeProfileData(e, "lname");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    Email*
                                  </label>
                                  <input
                                    type="mail"
                                    className="w-100"
                                    placeholder="Enter Email"
                                    value={pEmail}
                                    disabled
                                  />
                                </div>
                                <div className="col-12 col-sm-6 mb-4 custome-select">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    Phone Code/Mobile Number*
                                  </label>
                                  {/* {!pCountryShortcode || (pCountryShortcode == "Select Your Country") ?
                                                                 <input type='text' placeholder="Enter Phone Number" minLength="8" maxLength="15" value={pPhone} onChange={(e) => { if (onlyNumbers(e.target.value)) { changeProfileData(e, "phone_number") } }} />
                                                                 : */}
                                  <div className="input-group">
                                    <span
                                      className="rounded-0"
                                      style={{ width: "130px" }}
                                      id="basic-addon1"
                                    >
                                      <Select
                                        options={phoneCodeDataDrp}
                                        placeholder="Phone Code"
                                        value={pPhonecode}
                                        onChange={(e) => {
                                          changeProfileData(e, "phoneCode");
                                        }}
                                        isSearchable={true}
                                        isMulti={false}
                                        menuPortalTarget={document.body}
                                        styles={customStyles}
                                      />
                                      {/* <select className="form-control form-select rounded-0 border" aria-label=".form-control example" id="exampleInputPassword1" placeholder="Phone Code" value={pPhonecode} onChange={(e) => changeProfileData(e, "phoneCode")} >
                                                                         <option defaultValue="">Phone Code</option>
                                                                         {countryDataDrp.map((country_item, i) => {
                                                                             return <option key={i} value={country_item.phonecode}>{country_item.phonecode} - {country_item.name}</option>
                                                                         })}
                                                                     </select> */}
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Enter Phone Number"
                                      className="form-control"
                                      minLength="8"
                                      maxLength="15"
                                      value={pPhone}
                                      onChange={(e) => {
                                        if (onlyNumbers(e.target.value)) {
                                          changeProfileData(e, "phone_number");
                                        }
                                      }}
                                    />
                                  </div>
                                  {/* } */}
                                </div>
                                <div className="col-12 col-sm-6 mb-4 custome-select">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    Country*
                                  </label>
                                  <Select
                                    options={countryDataDrp}
                                    placeholder="Select Your Country"
                                    value={pCountry}
                                    onChange={(e) =>
                                      changeProfileData(e, "country")
                                    }
                                    isSearchable={true}
                                    isMulti={false}
                                    menuPortalTarget={document.body}
                                    styles={customStyles}
                                  />
                                  {/* <select className="form-control form-select rounded-0 border" aria-label=".form-control example" id="exampleInputPassword1" placeholder="Select Your Country" value={pCountry} onChange={(e) => changeProfileData(e, "country")} >
                                                                 <option >Select Your Country</option>
                                                                 {countryDataDrp.map((country_item, i) => {
                                                                     return <option key={i} value={country_item.name}>{country_item.name}</option>
                                                                 })}
                                                             </select> */}
                                </div>
                                <div className="col-12 col-sm-6 mb-4">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    State
                                  </label>
                                  <input
                                    type="text"
                                    className="w-100"
                                    placeholder="Enter State"
                                    value={pState}
                                    onChange={(e) => {
                                      if (
                                        validateWithOnlyLetters(e.target.value)
                                      ) {
                                        changeProfileData(e, "state");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-sm-6 mb-4">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    City
                                  </label>
                                  <input
                                    type="text"
                                    className="w-100"
                                    placeholder="Enter Your City"
                                    value={pCity}
                                    onChange={(e) => {
                                      if (
                                        validateWithOnlyLetters(e.target.value)
                                      ) {
                                        changeProfileData(e, "city");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="col-12 col-sm-6 mb-4">
                                  <label className="w-100 mb-1 fw-500 fs-14px profile-sub-heading">
                                    Gender
                                  </label>
                                  <select
                                    className="form-control form-select rounded-0 border"
                                    aria-label="form-control example"
                                    id="exampleInputPassword1"
                                    placeholder="Select Gender"
                                    value={pGender}
                                    onChange={(e) =>
                                      changeProfileData(e, "gender")
                                    }
                                  >
                                    <option defaultValue="">
                                      Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                  </select>
                                </div>

                                <div>
                                  <button
                                    type="button"
                                    className="btn profilte-btn"
                                    onClick={() =>
                                      UpdateProfile(loginData.unique_id)
                                    }
                                  >
                                    Update
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="AddressBilling">
                        <div className="tab-pane">
                          <div>
                            <h3 className="mb-20px fs-28px profile-title">
                              Address & Billing Details
                            </h3>
                            <div className="address-wrap row">
                              {Addressbilling.map((Address_detail, i) => {
                                return (
                                  <div
                                    className="col-12 col-sm-6 col-md-6 col-xxl-4 mb-3"
                                    key={i}
                                  >
                                    <div
                                      className={`card h-100 rounded-0 sec-bg-color ${
                                        Address_detail.status == "0"
                                          ? ""
                                          : "card-active"
                                      }`}
                                    >
                                      <div className="card-body card-height">
                                        <div className="d-flex justify-content-between">
                                          <div>
                                            <h4 className="add-title fs-20px mb-5px profile-sub-heading">
                                              {Address_detail.first_name}{" "}
                                              {Address_detail.last_name}
                                            </h4>
                                            <p className="fs-15px">
                                              {Address_detail.building},
                                              {Address_detail.address ? (
                                                <>{Address_detail.address},</>
                                              ) : (
                                                ""
                                              )}{" "}
                                              {Address_detail.street},
                                              {Address_detail.description ? (
                                                <>
                                                  {Address_detail.description},
                                                </>
                                              ) : (
                                                ""
                                              )}{" "}
                                              {Address_detail.city} {"-"}
                                              {Address_detail.pincode},
                                              {Address_detail.state},
                                              {Address_detail.country}
                                            </p>
                                          </div>
                                          {Address_detail.status == "0" ? (
                                            <div>
                                              <i
                                                className="ic_edit_profile fs-18px cursor-pointer"
                                                onClick={() =>
                                                  editAddress(Address_detail)
                                                }
                                              ></i>
                                              <i
                                                className="ic_dustbin fs-18px cursor-pointer ms-3"
                                                onClick={() =>
                                                  deleteAddresses(
                                                    Address_detail.unique_id
                                                  )
                                                }
                                              ></i>
                                            </div>
                                          ) : (
                                            <div>
                                              <i
                                                className="ic_edit_profile fs-18px cursor-pointer"
                                                onClick={() =>
                                                  editAddress(Address_detail)
                                                }
                                              ></i>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      {Address_detail.status == "0" ? (
                                        <div className="text-end p-2">
                                          <span
                                            className="fs-16px cursor-pointer"
                                            onClick={() =>
                                              defaultAdress(
                                                Address_detail.unique_id
                                              )
                                            }
                                          >
                                            Set Default
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="text-end p-2">
                                          <span className="fs-16px cursor-pointer">
                                            Default
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div>
                              <button
                                type="button"
                                className="btn btn-back fs-15px"
                                onClick={() => {
                                  showAddress();
                                  setUpdate(false);
                                }}
                              >
                                <i className="ic_plus me-2"></i>Add New Address
                              </button>
                              <Modal
                                show={showAddModal}
                                onHide={handleCloseAddModal}
                                centered
                                className="modal-dialog-centered modal-xl"
                              >
                                <div className="b2c_modal-content">
                                  <div className="modal-header border-0">
                                    <h5
                                      className="modal-title profile-title"
                                      id="staticBackdropLabel"
                                    >
                                      Address & Billing Details
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close profile-title"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                      onClick={() => handleCloseAddModal()}
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="row mb-3">
                                      <div className="col-12">
                                        <form>
                                          <div className="row">
                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputEmail1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                First Name*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                placeholder="Enter Your First Name"
                                                defaultValue={fname || ""}
                                                onKeyPress={(e) => {
                                                  textOnly(e);
                                                }}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "fname"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Last Name*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Your Last Name"
                                                defaultValue={lname || ""}
                                                onKeyPress={(e) => {
                                                  textOnly(e);
                                                }}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "lname"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Enter Building*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Building"
                                                defaultValue={building || ""}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "building"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Enter Building Name
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Building Name"
                                                defaultValue={
                                                  buildingName || ""
                                                }
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "buildingName"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Street*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Street"
                                                defaultValue={street || ""}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "street"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Enter Landmark
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Landmark"
                                                defaultValue={description || ""}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "description"
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="col-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                City*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter City"
                                                defaultValue={city || ""}
                                                onKeyPress={(e) => {
                                                  textOnly(e);
                                                }}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "city"
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="col-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                State
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter State"
                                                defaultValue={state || ""}
                                                onKeyPress={(e) => {
                                                  textOnly(e);
                                                }}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "state"
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="col-12 col-sm-6 mb-3 custome-select">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Country*
                                              </label>
                                              <Select
                                                options={countryDataDrp}
                                                placeholder="Select Your Country"
                                                value={country}
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "Country"
                                                  )
                                                }
                                                isSearchable={true}
                                                isMulti={false}
                                                menuPortalTarget={document.body}
                                                styles={customStyles}
                                              />
                                              {/* <select className="form-control form-select rounded-0 border" aria-label=".form-control example" id="exampleInputPassword1" placeholder="Select Your Country" defaultValue={country || ""} onChange={(e) => changeAddressBilling(e, "Country")} >
                                                                                         <option defaultValue="">Select Your Country</option>
                                                                                         {countryDataDrp.map((country_item, i) => {
                                                                                             return <option key={i} defaultValue={country_item.name || ""}>{country_item.name}</option>
                                                                                         })}
                                                                                     </select> */}
                                            </div>
                                            <div className="col-12 col-sm-6 mb-3 custome-select">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Phone Code/Mobile Number*
                                              </label>
                                              <div className="input-group">
                                                <span
                                                  className="rounded-0"
                                                  style={{ width: "150px" }}
                                                >
                                                  <Select
                                                    options={phoneCodeDataDrp}
                                                    placeholder="Phone Code"
                                                    value={phoneCode}
                                                    onChange={(e) => {
                                                      changeAddressBilling(
                                                        e,
                                                        "phoneCode"
                                                      );
                                                    }}
                                                    isSearchable={true}
                                                    isMulti={false}
                                                    menuPortalTarget={
                                                      document.body
                                                    }
                                                    styles={customStyles}
                                                  />
                                                  {/* <select className="form-control form-select rounded-0 border" aria-label=".form-control example" id="exampleInputPassword1" placeholder="Phone Code" defaultValue={phoneCode || ""} onChange={(e) => changeAddressBilling(e, "phoneCode")} >
                                                                                                 <option defaultValue="">Phone Code</option>
                                                                                                 {countryDataDrp.map((country_item, i) => {
                                                                                                     return <option key={i} value={country_item.phonecode}>{country_item.phonecode} - {country_item.name}</option>
                                                                                                 })}
                                                                                             </select> */}
                                                </span>
                                                <input
                                                  type="text"
                                                  className="form-control rounded-0"
                                                  id="exampleInputNumber1"
                                                  minLength="8"
                                                  maxLength="15"
                                                  placeholder="Enter Phone Number"
                                                  defaultValue={phone || ""}
                                                  onKeyPress={(e) =>
                                                    validateDigit(e)
                                                  }
                                                  onChange={(e) =>
                                                    changeAddressBilling(
                                                      e,
                                                      "phone"
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div className="col-12 col-sm-6 mb-3">
                                              <label
                                                htmlFor="exampleInputPassword1"
                                                className="form-label fs-14px mb-1 fw-500 profile-sub-heading"
                                              >
                                                Pincode*
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control rounded-0"
                                                id="exampleInputPassword1"
                                                placeholder="Enter Pincode"
                                                minLength="5"
                                                maxLength="6"
                                                defaultValue={pincode || ""}
                                                onKeyPress={(e) =>
                                                  validateDigit(e)
                                                }
                                                onChange={(e) =>
                                                  changeAddressBilling(
                                                    e,
                                                    "Pincode"
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <Modal.Footer>
                                    <div className="text-end add-update-btn">
                                      {!update ? (
                                        <button
                                          type="button"
                                          className="btn btn-dark-green px-5 rounded-0 w-100"
                                          onClick={() =>
                                            addUpdateAddress(
                                              isLogin
                                                ? loginData.member_id
                                                : RandomId,
                                              uniqueId
                                            )
                                          }
                                        >
                                          Add Billing Details
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-dark-green px-5 rounded-0 w-100"
                                          onClick={() =>
                                            addUpdateAddress(
                                              isLogin
                                                ? loginData.member_id
                                                : RandomId,
                                              uniqueId
                                            )
                                          }
                                        >
                                          Update Billing Details
                                        </button>
                                      )}
                                    </div>
                                  </Modal.Footer>
                                </div>
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="Order_">
                        {!ordershow ? (
                          <>
                            <OrderComponent
                              searchResetData={searchResetData}
                              changeOrderTab={changeOrderTab}
                              changePagination={changePagination}
                              selectedTab={selectedTab}
                              setSelectedTab={setSelectedTab}
                              PendingData={pendingDataList}
                              orderDataList={orderDataList}
                              orderCount={orderCount}
                              cancelCount={cancelCount}
                              pagination={pagination}
                              detailShow={detailShow}
                              totalOrderRow={totalOrderRow}
                              totalOrderRecord={totalOrderRecord}
                              totalPages={totalPages}
                              pageValue={pageValue}
                              perPage={perPage}
                              loading={loading}
                              skeletonLoader={skeletonLoader}
                              isOrderTabActive={isOrderTabActive}
                              ordershow={ordershow}
                              handleOrderDetailShow={handleOrderDetailShow}
                              count={count}
                            />
                          </>
                        ) : (
                          <OrderDetail
                            checkInvoice={checkInvoice}
                            orderDetailDataList={orderDetailDataList}
                            orderDetailsData={orderDetailsData}
                            orderHistoryDataList={orderHistoryDataList}
                            shippingAddress={shippingAddress}
                            reviewModal={reviewModal}
                            billindAddress={billindAddress}
                            detailClose={detailClose}
                            printInvoice={printInvoice}
                            orderDetailId={orderDetailId}
                            paymentMethod={paymentMethod}
                          />
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="AvailableCoupons">
                        <Availablecoupon
                          coupan={coupan}
                          fetchMoreData={fetchMoreData}
                          hasMore={hasMore}
                          setTostmsg={setTostmsg}
                          setIsSuccess={setIsSuccess}
                          setTostOpen={setTostOpen}
                          setSkeletenLoader={setSkeletenLoader}
                          loading={loading}
                          skeletonLoader={skeletonLoader}
                        />
                      </Tab.Pane>

                      <Tab.Pane
                        eventKey="WarrantyCard"
                        active={selectedTab === "WarrantyCard"}
                      >
                        <Warrantycard
                          setSelectedTab={setSelectedTab}
                          setIsJourney={setIsJourney}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="JourneyCatalogue">
                        <Journeycatalog />
                      </Tab.Pane>
                      <Tab.Pane eventKey="ChangePassword">
                        <div className="tab-pane">
                          <div>
                            <h3 className="mb-3 profile-title">
                              Change Password
                            </h3>
                            <form>
                              <div className="row">
                                <div className="col-12 col-md-8 col-lg-6">
                                  <div className="row">
                                    <div className="col-12 mb-4">
                                      <label className="w-100 mb-1 fs-14px fw-500 profile-sub-heading">
                                        Current Password*
                                      </label>
                                      <div className="position-relative">
                                        <input
                                          type={`${
                                            hideShowCurntPasswd !== false
                                              ? "text"
                                              : "password"
                                          }`}
                                          className="w-100"
                                          placeholder="Current Password"
                                          value={oldpasswd}
                                          onChange={(e) =>
                                            changePassWord(e, "old")
                                          }
                                        />
                                        <div className="pass-eye">
                                          {oldpasswd !== "" ? (
                                            hideShowCurntPasswd === false ? (
                                              <i
                                                className="ic_eye_close"
                                                onClick={() =>
                                                  setHideShowCurntPasswd(true)
                                                }
                                              ></i>
                                            ) : (
                                              <i
                                                className="ic_eye_open"
                                                onClick={() =>
                                                  setHideShowCurntPasswd(false)
                                                }
                                              ></i>
                                            )
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 mb-4">
                                    <label className="w-100 mb-1 fs-14px fw-500 profile-sub-heading">
                                      New Password*
                                    </label>
                                    <div className="position-relative">
                                      <input
                                        type={`${
                                          hideShowNewPasswd !== false
                                            ? "text"
                                            : "password"
                                        }`}
                                        className="w-100"
                                        placeholder="New Password"
                                        value={newpasswd}
                                        onChange={(e) =>
                                          changePassWord(e, "new")
                                        }
                                      />
                                      <div className="pass-eye">
                                        {newpasswd !== "" ? (
                                          hideShowNewPasswd === false ? (
                                            <i
                                              className="ic_eye_close"
                                              onClick={() =>
                                                setHideShowNewPasswd(true)
                                              }
                                            ></i>
                                          ) : (
                                            <i
                                              className="ic_eye_open"
                                              onClick={() =>
                                                setHideShowNewPasswd(false)
                                              }
                                            ></i>
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 mb-4">
                                    <label className="w-100 mb-1 fs-14px fw-500 profile-sub-heading">
                                      Confirm Password*
                                    </label>
                                    <div className="position-relative">
                                      <input
                                        type={`${
                                          hideShowReEntpasswd !== false
                                            ? "text"
                                            : "password"
                                        }`}
                                        className="w-100"
                                        placeholder="Confirm Password"
                                        value={reEnterpasswd}
                                        onChange={(e) =>
                                          changePassWord(e, "re-enter")
                                        }
                                      />
                                      <div className="pass-eye">
                                        {reEnterpasswd !== "" ? (
                                          hideShowReEntpasswd === false ? (
                                            <i
                                              className="ic_eye_close"
                                              onClick={() =>
                                                setHideShowReEntpasswd(true)
                                              }
                                            ></i>
                                          ) : (
                                            <i
                                              className="ic_eye_open"
                                              onClick={() =>
                                                setHideShowReEntpasswd(false)
                                              }
                                            ></i>
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="btn profilte-btn"
                                      onClick={() =>
                                        updatePasswd(loginData.unique_id)
                                      }
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane
                        eventKey="2-Step Verification"
                        active={params.id === "verification"}
                      >
                        {isVerified === 1 ? (
                          <VerifiedCard />
                        ) : verificationStep === 1 ? (
                          <div className="tab-pane row bg-white p-3">
                            <div className="col-8">
                              <h3 className="mb-3 profile-title">
                                2-Step Verification
                              </h3>
                              <form>
                                <div className="row">
                                  <div className="col-12">
                                    <label className="w-100 mb-1 fs-14px fw-500 profile-sub-heading">
                                      On Your Phone
                                    </label>
                                    <p>
                                      1. Install an <b>Authenticator App</b>{" "}
                                      from your phones store such as the{" "}
                                      <b>Google Authenticator App</b>.
                                    </p>
                                    <p>
                                      2. Open the <b>Authenticator App</b>.
                                    </p>
                                    <p>
                                      3. Tap the <b>Add</b> icon or the{" "}
                                      <b>Begin Setup </b> button.
                                    </p>
                                    <p>
                                      4. Choose <b>Scan a Barcode</b>, and scan
                                      using your phone:
                                    </p>
                                    <div className="d-flex my-2 gap-2">
                                      <button
                                        type="button"
                                        className="btn profilte-btn"
                                        onClick={handleAuthentication}
                                      >
                                        NEXT
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className="col-lg">
                              <Image src={QRCodeImage} alt="QRCode" />
                            </div>
                          </div>
                        ) : (
                          <Verification
                            setVerificationStep={setVerificationStep}
                          />
                        )}
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                ) : (
                  <Nav variant="pills" className="flex-column profile-list">
                    <div className="profile-list-flex nav-pills">
                      {/* <Nav.Item className="nav-item-box">
                                                <Nav.Link eventKey="dashboard" onClick={() => {
                                                    setOrderStatus(''); setSelectedTab('dashboard'); navigate.push('/dashboard/account');
                                                }}>
                                                    <div className="nav-text " type="button"><i className="me-2 ic_home"></i> Dashboard</div>
                                                </Nav.Link>
                                            </Nav.Item> */}
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="Profile"
                          onClick={() => {
                            setOrderStatus("");
                            profileData();
                            setSelectedTab("Profile");
                            navigate.push("/dashboard/profile");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="ic_user"></i> Profile
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="AddressBilling"
                          onClick={() => {
                            addressData(
                              isLogin ? loginData.member_id : RandomId
                            );
                            setOrderStatus("");
                            setSelectedTab("AddressBilling");
                            navigate.push("/dashboard/address-billing");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_address"></i> Address &
                            Billing Details
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="Order_"
                          onClick={() => {
                            changeOrderTab("order");
                            setSelectedTab("Order_");
                            setOrderShow(false);
                            setIsOrderTabActive(true);
                            navigate.push("/dashboard/my-order");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_orders"></i> Order
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="AvailableCoupons"
                          onClick={() => {
                            couponData(count);
                            setOrderStatus("");
                            setSelectedTab("AvailableCoupons");
                            navigate.push("/dashboard/available-coupons");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_coupon"></i> Available Coupons
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="WarrantyCard"
                          onClick={() => {
                            setOrderStatus("");
                            setSelectedTab("WarrantyCard");
                            navigate.push("/dashboard/warranty-card");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_warranty_card"></i>Warranty
                            Card
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="JourneyCatalogue"
                          onClick={() => {
                            setOrderStatus("");
                            setSelectedTab("JourneyCatalogue");
                            navigate.push("/dashboard/journey-catalogue");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_journey_catalogue"></i>{" "}
                            Journey Catalogue
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="ChangePassword"
                          onClick={() => {
                            setNewpasswd("");
                            setOldpasswd("");
                            setReEnterpasswd("");
                            setOrderStatus("");
                            setSelectedTab("ChangePassword");
                            navigate.push("/dashboard/change-password");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_padlock"></i> Change Password
                          </div>
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item className="nav-item-box">
                        <Nav.Link
                          eventKey="2-Step Verification"
                          onClick={() => {
                            setSelectedTab("2-Step Verification");
                            navigate.push("/dashboard/verification");
                          }}
                        >
                          <div className="nav-text " type="button">
                            <i className="me-2 ic_padlock" />
                            2-Step Verification
                          </div>
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item className="nav-item-box">
                        <Nav.Link eventKey="Logout" onClick={() => LogOut()}>
                          <div className="nav-text " type="button">
                            <i className="me-2  ic_logout"></i> Logout
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    </div>
                  </Nav>
                )}
              </Tab.Container>
            </div>
          </div>
        </div>
        <ReviewAdd
          setLoading={setLoading}
          setAddReview={setAddReview}
          addReview={addReview}
          orderId={orderId}
          itemNumber={itemNumber}
          variantNumber={variantNumber}
          setTostmsg={setTostmsg}
          setIsSuccess={setIsSuccess}
          setTostOpen={setTostOpen}
          setReviewDetail={setReviewDetail}
          setHeadLine={setHeadLine}
          setRating={setRating}
          setVideoPreview={setVideoPreview}
          setImgFile={setImgFile}
          setImgPreview={setImgPreview}
          setVideoFile={setVideoFile}
          reviewDetail={reviewDetail}
          imgfile={imgfile}
          imgPreview={imgPreview}
          videoPreview={videoPreview}
          videoFile={videoFile}
          rating={rating}
          headline={headline}
        />

        <Notification
          toastMsg={toastmsg}
          toastShow={tostShow}
          isSuccess={isSuccess}
          Close={() => setTostOpen()}
        />
      </section>
    </>
  );
};

export default Profile;
