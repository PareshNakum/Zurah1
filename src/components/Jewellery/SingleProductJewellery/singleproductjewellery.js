import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./singleproductjewellery.module.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../CommanUIComp/Loader/Loader";
import Commanservice from "../../../CommanService/commanService";
import Notification from "../../../CommanUIComp/Notification/Notification";
import {
  RandomId,
  isEmpty,
  firstWordCapital,
  numberWithCommas,
  jewelVertical,
  onlyNumbers,
  changeUrl,
  safeParse,
} from "../../../CommanFunctions/commanFunctions";
import {
  jeweleryDIYimage,
  storeFavCount,
  storeForgotVar,
  diamondPageChnages,
  jeweleryDIYName,
  activeDIYtabs,
  diamondDIYName,
  diamondDIYimage,
  countCart,
  addEngravingAction,
  addedRingData,
  isRingSelected,
  storeFilteredData,
  storeActiveFilteredData,
  diamondNumber,
  IsSelectedDiamond,
  editDiamondAction,
  addedDiamondData,
  storeSelectedDiamondData,
  storeSpecData,
  storeProdData,
  storeDiamondNumber,
  finalCanBeSetData,
  storeSelectedDiamondPrice,
  storeEmbossingData,
  saveEmbossings,
  previewImageDatas,
  activeImageData,
  ActiveStepsDiy,
  DiyStepersData,
  serviceAllData,
  otherServiceData,
} from "../../../Redux/action";
import DIYProcessStepBar from "../DIYProcessStepBar/DIYProcessStepBar";
import BreadcrumbModule from "../../../CommanUIComp/Breadcrumb/breadcrumb";
import NoRecordFound from "../../../CommanUIComp/NoRecordFound/noRecordFound";
import GIA from "../../../Assets/Images/GIA.jpg";
import HRD from "../../../Assets/Images/HRD.jpg";
import IGI from "../../../Assets/Images/IGI.jpg";
import video from "../../../Assets/Images/video.png";
//import InnerImageZoom from "react-inner-image-zoom";
import { Rating } from "react-simple-star-rating";
import OutsideClickHandler from "react-outside-click-handler";
import commanService from "../../../CommanService/commanService";
import { Accordion, OverlayTrigger, Tooltip } from "react-bootstrap";
import DIYPageProcessStep from "../../DiyProduct/DIYProcessStepBar/DIYPageProcessStep";
import RelatedProduct from "../RelatedProducts/relatedproduct";
import Seo from "../../SEO/seo";
// Ensure jQuery is available in the browser environment
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import clsx from "clsx";

const SingleProductJewellery = (props) => {
  const loginDatas = useSelector((state) => state.loginData);
  const DiyStepersDatas = useSelector((state) => state.DiyStepersData);
  const ActiveStepsDiys = useSelector((state) => state.ActiveStepsDiy);
  const storeProdDatas = useSelector((state) => state.storeProdData);
  const storeSpecDatas = useSelector((state) => state.storeSpecData);
  const finalCanBeSetDatas = useSelector((state) => state.finalCanBeSetData);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const storeCurrencys = useSelector((state) => state.storeCurrency);
  const serviceAllDatas = useSelector((state) => state.serviceAllData);
  const otherServiceDatas = useSelector((state) => state.otherServiceData);
  const storeEmbossingDatas = useSelector((state) => state.storeEmbossingData);
  const previewImageDatass = useSelector((state) => state.previewImageDatas);
  const saveEmbossingss = useSelector((state) => state.saveEmbossings);
  const activeImageDatas = useSelector((state) => state.activeImageData);
  const storeEntityIds = useSelector((state) => state.storeEntityId) || props.entityData;
  const addedRingDatas = useSelector((state) => state.addedRingData);
  const isRingSelecteds = useSelector((state) => state.isRingSelected);
  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  const storeSelectedDiamondDatas = useSelector(
    (state) => state.storeSelectedDiamondData
  );
  const storeFavCounts = useSelector((state) => state.storeFavCount);
  const countCarts = useSelector((state) => state.countCart);
  const storeSelectedDiamondPrices = useSelector(
    (state) => state.storeSelectedDiamondPrice
  );
  const diamondImages = useSelector((state) => state.diamondImage);
  const diamondShapes = useSelector((state) => state.diamondShape);
  const isSelectedDiamonds = useSelector((state) => state.IsSelectedDiamond);

  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef(null);
  const apiTriggeredRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [favLoader, setFavLoader] = useState(false);
  const isLogin = Object.keys(loginDatas).length > 0;

  // URL Data
  const isJewelDiy = router.pathname.includes("start-with-a-setting");
  const isDiamoDiy = router.pathname.includes("start-with-a-diamond");
  const isItemDIY = router.pathname.includes("start-with-a-item");
  var paramsItems = isDiamoDiy || isJewelDiy || isItemDIY ? "DIY" : "PRODUCT";
  const params = router.query;
  let megaMenu = null;
  if (typeof window !== "undefined") {
    const menu = JSON.parse(sessionStorage.getItem("megaMenu"));
    megaMenu = menu?.navigation_data?.find(
      (item) =>
        item.menu_name?.replaceAll(" ", "-")?.toLowerCase() === verticalCode
    );
  }

  // Determine vertical_code
  let vertical_code = verticalCode
    ? megaMenu?.product_vertical_name ?? verticalCode
    : "";

  if (isEmpty(vertical_code) === "" || vertical_code === "DIY") {
    vertical_code = "";
  }
  if (isEmpty(verticalCode) !== "") {
    vertical_code = megaMenu?.product_vertical_name ?? verticalCode;
  }

  var callingJewel = "false";
  var [paramsItem, setparamsItem] = useState(paramsItems);
  const DIYName = isJewelDiy
    ? "start-with-a-setting"
    : isItemDIY
    ? "start-with-a-item"
    : isDiamoDiy && "start-with-a-diamond";
  const varaintId =
    isEmpty(params?.variantId) !== ""
      ? params?.variantId.split("-").pop().toUpperCase()
      : params?.variantId;
  let allDataSpec = DiyStepersDatas?.find(
    (item) => item.variant_id === varaintId
  );

  // Toast
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [favStopClick, setFavStopClick] = useState(false);
  const [engravingText, setEngravingText] = useState(
    allDataSpec?.engravingText ?? ""
  );
  const [isItalicFont, setIsItalicFont] = useState(
    allDataSpec?.isItalicFont ?? false
  );
  const [isFontStyle, setIsFontStyle] = useState(false);
  const [engravingTexts, setEngravingTexts] = useState(
    allDataSpec?.engravingTexts ?? ""
  );
  const [saveEngraving, setSaveEngraving] = useState(
    allDataSpec?.saveEngraving ?? false
  );
  const [isEngraving, setIsEngraving] = useState(
    allDataSpec?.isEngraving ?? false
  );
  const [engravingFontSize, setEngravingFontSize] = useState("");
  const [isOffers, setIsOffers] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  //DIY Items
  const [activeStep, setActiveStep] = useState(ActiveStepsDiys ?? 0);
  const [typeViewDiy, setTypeViewDiy] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // One Time API Call
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [onceUpdatedVariantTab, setOnceUpdatedVaraintTab] = useState(false);

  // Filter & Product
  const [filterProduct, setFilterProduct] = useState([]);
  const prodData = isJewelDiy || isItemDIY ? storeProdDatas : {};
  const specData = isDiamoDiy || isItemDIY ? storeSpecDatas : {};
  const [productData, setProductData] = useState(prodData);
  const [specificationData, setSpecificationData] = useState(specData);
  const [productType, setProductType] = useState("");
  const [selectedShape, setselectedShape] = useState("");
  const [selectedColor, setselectedColor] = useState("");
  const [itemId, setItemId] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [relatedProductObj, setRelatedProductObj] = useState({});
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [hasMoreRelated, setHasMoreRelated] = useState(false);
  const [count, setCount] = useState(1);
  const [totalPagesRelated, setTotalPagesRelated] = useState("");
  const [storeVariantId, setStoreVariantId] = useState("");
  const [metalType, setMetalType] = useState("");
  const [secondDiamondSummary, setSecondDiamondSummary] = useState([]);
  const [secondDiamondSummaryname, setSecondDiamondSummaryname] = useState([]);

  //infinite scroll
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [hasMore, setHasMore] = useState(true);

  // Get Variant Data && Specification Data
  const [storeVariantDataList, setStoreVariantDataList] = useState([]);
  const [columnsForSpecification, setColumnsForSpecification] = useState([]);
  const [canBeSetWithDataList, setCanBeSetWithDataList] = useState([]);
  const [columName, setColumName] = useState("");
  const [canBeSetWithVariant, setCanBesetWithVariant] = useState("");
  const [diamondSummary, setdiamondSummary] = useState([]);
  const [diamondSummaryname, setdiamondSummaryname] = useState([]);
  const [tabDataone, setTabDataDone] = useState(false);
  const [keyTabView, setKeyTabView] = useState("Specification");
  const [selectedTab, setSelectedTab] = useState([]);
  const [bomDataList, setBomDataList] = useState([]);
  const [labourDataList, setLabourDataList] = useState([]);
  const [favData, setFavData] = useState({ add_to_favourite: 0 });
  const [productSKU, setProductSKU] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  // Carousel
  var [active, setActive] = useState(0);
  var [lastActive, setLastActive] = useState(0);

  // List & Toggle slider
  const [listandToggle, setListandToggle] = useState(true);

  // Set Stone model
  const [showStoneModal, setShowStoneModal] = useState(false);
  const [diaModalshow, setDiaModalShow] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  // Set Stones
  const [stoneActive, setStoneActive] = useState({});
  const [DIYShapesDataList, setDIYShapesDataList] = useState([]);
  const [DIYSizeDataList, setDIYSizeDataList] = useState([]);
  const [DIYClarityDataList, setDIYClarityDataList] = useState([]);
  const [shapeStoneActive, setShapeStoneActive] = useState({});
  const [sizeStoneActive, setSizeStoneActive] = useState({});
  const [stonesNo, setStonesNo] = useState("");
  const [finalCanBeSet, setFinalCanBeSet] = useState(finalCanBeSetDatas ?? []);
  const [stoneCanBeSetArr, setStoneCanBeSetArr] = useState([]);
  const [clarityWithColor, setClarityWithColor] = useState("");
  const [clarityColorObj, setClarityColorObj] = useState([]);
  const [finalStoneArr, setFinalStoneArr] = useState([]);
  const [selectedDiamond, setSelectedDiamond] = useState(
    addedDiamondDatas ?? {}
  );
  const [isDiamondSelected, setIsDiamondSelected] = useState(false);
  const [canBeSets, setCanBeSets] = useState("");

  // DIY Canbeset Data
  const [canBeSetData, setCanBeSetData] = useState([]);
  const [filterParameter, setFilterParameter] = useState([]);
  const [storeVariantCount, setStoreVariantCount] = useState(0);
  const [stoneTypeArr, setStoneTypeArr] = useState([]);
  var [verticalCode, setVerticalCode] = useState("");
  const [stoneElement, setStoneElement] = useState({});
  let [callFirstTime, setCallFirstTime] = useState(true);
  const [salesTotalPrice, setSalesTotalPrice] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [stonePrice, setStonePrice] = useState(0);

  // Diamond Image Slider
  let [diamondImage, setDiamondImage] = useState("");
  let [diamondArrayImage, setDiamondArrayImage] = useState([]);

  // Review customer
  const [reviewCustomerData, setReviewCustomerData] = useState([]);
  const [reviewCutomer, setReviewCustomer] = useState([]);
  const [globalRating, setGlobalRating] = useState(0);
  const [globalRatingStar, setGlobalRatingStar] = useState(0);
  const [reviewSummary, setReviewSummary] = useState([]);

  //story
  const [storyDataList, setStoryDataList] = useState([]);

  // Grid and Table View
  const [viewType, setViewType] = useState("jewelery");

  // delivery date
  const [deliveryDate, setDeliveryDate] = useState("");
  const [stoneObj, setStoneObj] = useState({});
  const [complete, setComplete] = useState(false);
  const [isStone, setIsStone] = useState(false);
  const [isStoneSelected, setIsStoneSelected] = useState(false);
  const [currency, setCurrency] = useState(storeCurrencys);
  const [selectedOffer, setSelectedOffer] = useState([]);

  //services
  const [serviceData, setServiceData] = useState(serviceAllDatas ?? []);
  const [otherService, setOtherService] = useState(otherServiceDatas ?? []);
  const [engravingData, setEngravingData] = useState(
    allDataSpec?.engravingData ?? {}
  );

  //Embossing
  const [embossingData, setEmbossingData] = useState(storeEmbossingDatas ?? []);
  const [embossingArea, setEmbossingArea] = useState([]);
  const [embossingModalView, setEmbossingModalView] = useState(false);
  const [embossingPreviewModalView, setEmbossingPreviewModalView] =
    useState(false);
  const [embossingPreviewModalBaseView, setEmbossingPreviewModalBaseView] =
    useState(false);
  const [imageForPreview, setImageForPreview] = useState(false);
  const [previewImageData, setPreviewImageData] = useState(
    previewImageDatass ?? []
  );
  const [embossingPreview, setEmbossingPreview] = useState(false);
  const [SaveEmbossing, setSaveEmbossing] = useState(saveEmbossingss ?? false);
  const [logoSrc, setLogoSrc] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [dialogRef, setDialogRef] = useState(null);
  const [callingFrom, setCallingFrom] = useState("");
  const [embPostionEle, setEmbPostionEle] = useState("");
  const [imageDataList, setImageDataList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeImg, setActiveImg] = useState(activeImageDatas ?? []);
  const [activeImgSave, setActiveImgSave] = useState(activeImageDatas ?? []);
  const [embImgPostion, setEmbImgPostion] = useState({});
  const [previewImage, setPreviewImage] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [upListener, setUpListener] = useState(null);
  const [moveListener, setMoveListener] = useState(null);
  const [boxes, setBoxes] = useState({});
  const [startX, setStartX] = useState({ left: 0, top: 0 });
  const [startY, setStartY] = useState({ width: 0, height: 0 });
  const [startXy, setStartXy] = useState({ left: 0, top: 0 });
  const imgContainer = useRef(null);
  const imgContainers = useRef(null);

  //Product breakup
  const [productBreakupData, setProductBreakupData] = useState({
    basePrice: "0",
    servicePrice: [],
    discountPrice: "0",
    unitPrice: "0",
    subTotal: "0",
    qty: 1,
    taxPrice: "0",
    customDutyTax: "0",
    totalPrice: "0",
  });

  useEffect(() => {
    if (imgContainer.current) {
      addBox(true);
    }
  }, [callingFrom, imageDataList, selectedIndex]);

  useEffect(() => {
    if (activeImg?.length === 0) {
      const Data = specificationData?.variant_data?.[0]?.image_urls;
      const datas = specificationData;
      let updatedImageDataList = [...imageDataList];

      datas?.variant_data?.[0]?.image_types.forEach((type, index) => {
        if (embImgPostion[index] && previewImage["file_url"] === "") {
          setPreviewImage((prev) => ({
            ...prev,
            file_url: Data[index],
            image_area: embImgPostion[index],
          }));
        }

        if (type !== "Video" && type !== "360 View") {
          let parsedEmbossingArea = embossingArea[index];
          if (typeof parsedEmbossingArea === "string") {
            try {
              parsedEmbossingArea = JSON.parse(parsedEmbossingArea);
            } catch (e) {
              // console.error("Error parsing embossingArea:", e);
            }
          }
          updatedImageDataList.push({
            type: type,
            url: Data[index] || "",
            area: parsedEmbossingArea,
            price: embossingData?.[0]?.service_rate,
            currency: embossingData?.[0]?.msrv_currency,
            embImage: "",
            embImageArea: {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
            },
            widthInInches: null,
            heightInInches: null,
            binaryFile: null,
          });
        }
      });
      setActiveImg(updatedImageDataList.filter((item) => item.area !== ""));
      setActiveImgSave(updatedImageDataList.filter((item) => item.area !== ""));
      setImageDataList(updatedImageDataList);
    }

    return () => {
      document.removeEventListener("mousemove", imgOnMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", imgOnMouseMove);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [specificationData, serviceData]);

  const addBox = (isTrue) => {
    const container = imgContainer.current;
    if (isTrue) {
      if (embPostionEle["image_area"]) {
        const percentageValues = JSON.parse(embPostionEle["image_area"]);
        setBoxes({
          left: (percentageValues.left / 100) * container.width,
          top: (percentageValues.top / 100) * container.height,
          width: (percentageValues.width / 100) * container.width,
          height: (percentageValues.height / 100) * container.height,
        });
        setEmbImgPostion(percentageValues);
      }
    } else {
      setBoxes({
        left: container.width * 0.1,
        top: container.height * 0.1,
        width: container.width * 0.2,
        height: container.height * 0.2,
      });
      setEmbImgPostion({
        left: (0.1 * 100).toFixed(2),
        top: (0.1 * 100).toFixed(2),
        width: (0.2 * 100).toFixed(2),
        height: (0.2 * 100).toFixed(2),
      });
    }
  };

  const changeImage = (data, i) => {
    setSelectedIndex(i);
  };

  const updateInchDimensions = () => {
    if (!imgContainers.current || !activeImg?.embImageArea) {
      console.error("Image container or active image area is not defined.");
      return;
    }
    const parentRect = imgContainers.current.getBoundingClientRect();
    const imgArea = activeImg.embImageArea;
    const currentPixelWidth = (parentRect.width * imgArea.width) / 100;
    const currentPixelHeight = (parentRect.height * imgArea.height) / 100;

    const pixelsToInchesRatio = 10;
    const widthInInches = (currentPixelWidth / pixelsToInchesRatio).toFixed(2);
    const heightInInches = (currentPixelHeight / pixelsToInchesRatio).toFixed(
      2
    );

    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          return {
            ...item,
            widthInInches: widthInInches,
            heightInInches: heightInInches,
          };
        }
        return item;
      })
    );
  };

  const changeEmboFile = (event) => {
    const extension = event.target.files[0]?.name
      .split(".")
      .pop()
      .toLowerCase();
    if (
      extension === "jpg" ||
      extension === "png" ||
      extension === "jpeg" ||
      extension === "webp"
    ) {
      activeImg.binaryFile = event.target.files[0];
      event.target.value = "";
      addEmbImage();
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Only JPG,JPEG,PNG AND WEBP Files Are Allowed.");
    }
  };

  const addEmbImage = async () => {
    const obj = {
      a: "UploadEmbossingImages",
      SITDeveloper: 1,
      item_id: itemId,
      create_by: storeEntityIds.customer_id,
      entity_id: storeEntityIds.entity_id,
      tenant_id: storeEntityIds.tenant_id,
    };
    const imageFormData = new FormData();
    if (activeImg.binaryFile) {
      imageFormData.append(
        "image",
        activeImg.binaryFile,
        activeImg.binaryFile.name
      );
    }
    imageFormData.append("json", JSON.stringify(obj));
    if (activeImg.binaryFile) {
      setLoading(true);
      commanService
        .postApi("/MasterTableSecond", imageFormData)
        .then((response) => {
          if (response.data.success === 1) {
            setActiveImg((prevState) =>
              prevState.map((item, i) => {
                if (i === selectedIndex) {
                  return {
                    ...item,
                    embImage: response.data.data,
                    binaryFile: null,
                    embImageArea: {
                      left: 20,
                      top: 20,
                      width: 50,
                      height: 50,
                    },
                  };
                }
                return item;
              })
            );
            setImageForPreview(true);
          } else {
            // setActiveImg((prevState) => ({ ...prevState, embImage: '' }));
          }
          setLoading(false);
        });
    }
  };

  const imgStartDrag = (event, data, index) => {
    event.preventDefault();
    const isTouch = event.type === "touchstart";
    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;

    if (!data?.embImageArea) return;

    const embossingArea = document
      .querySelector(`#embossing-img-${index}`)
      .getBoundingClientRect();
    const resizableImg = event.target
      .closest(`#resizable-img-${index}`)
      .getBoundingClientRect();
    let offsetX = clientX - resizableImg.left;
    let offsetY = clientY - resizableImg.top;

    const onMove = (moveEvent) => {
      const moveX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
      let newLeft = moveX - offsetX - embossingArea.left;
      let newTop = moveY - offsetY - embossingArea.top;

      newLeft = Math.max(
        0,
        Math.min(embossingArea.width - resizableImg.width, newLeft)
      );
      newTop = Math.max(
        0,
        Math.min(embossingArea.height - resizableImg.height, newTop)
      );

      setActiveImg((prevState) =>
        prevState.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              embImageArea: {
                ...item.embImageArea,
                left: (newLeft / embossingArea.width) * 100,
                top: (newTop / embossingArea.height) * 100,
              },
            };
          }
          return item;
        })
      );
    };

    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  };

  const imgResizeStart = (event, data, index) => {
    event.preventDefault();
    event.stopPropagation();
    const isTouch = event.type === "touchstart";
    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;
    const embossingArea = document
      .querySelector(`#embossing-img-${index}`)
      .getBoundingClientRect();

    setIsResizing(true);
    setStartX({ left: clientX, top: clientY });
    setStartY({
      width: data.embImageArea.width,
      height: data.embImageArea.height,
    });

    const onMove = (moveEvent) => {
      const moveX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaX = moveX - startX.left;
      const deltaY = moveY - startX.top;

      let newWidth = startY.width + (deltaX / embossingArea.width) * 100;
      let newHeight = startY.height + (deltaY / embossingArea.height) * 100;

      newWidth = Math.max(5, Math.min(100 - data.embImageArea.left, newWidth));
      newHeight = Math.max(5, Math.min(100 - data.embImageArea.top, newHeight));

      setActiveImg((prevState) =>
        prevState.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              embImageArea: {
                ...item.embImageArea,
                width: newWidth,
                height: newHeight,
              },
            };
          }
          return item;
        })
      );
    };

    const onEnd = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  };

  const imgOnMouseMove = (event) => {
    if (!isDragging && !isResizing) return;
    const parentRect = document
      .querySelector(`#embossing-img`)
      .getBoundingClientRect();
    let updatedImageArea = { ...activeImg?.[selectedIndex]?.embImageArea };

    if (isResizing) {
      const deltaX = event.clientX - startX.left;
      const deltaY = event.clientY - startX.top;
      let newWidth = startY.width + (deltaX / parentRect.width) * 100;
      let newHeight = startY.height + (deltaY / parentRect.height) * 100;

      newWidth = Math.max(5, Math.min(100 - updatedImageArea.left, newWidth));
      newHeight = Math.max(5, Math.min(100 - updatedImageArea.top, newHeight));

      updatedImageArea.width = newWidth;
      updatedImageArea.height = newHeight;
    }

    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          return {
            ...item,
            embImageArea: updatedImageArea,
          };
        }
        return item;
      })
    );
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    document.removeEventListener("mousemove", imgOnMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const centerImage = (type) => {
    setActiveImg((prevState) =>
      prevState.map((item, i) => {
        if (i === selectedIndex) {
          const imgElement = item.embImageArea;
          const parentElement = document.querySelector(`#embossing-img-${i}`);
          if (!imgElement || !parentElement) return item;

          let updatedArea = { ...imgElement };

          if (type === "horizontal") {
            const parentWidth = parentElement.clientWidth;
            const imgWidth = (parentWidth * imgElement.width) / 100;
            updatedArea.left =
              ((parentWidth - imgWidth) / 2 / parentWidth) * 100;
          }

          if (type === "vertical") {
            const parentHeight = parentElement.clientHeight;
            const imgHeight = (parentHeight * imgElement.height) / 100;
            updatedArea.top =
              ((parentHeight - imgHeight) / 2 / parentHeight) * 100;
          }

          return {
            ...item,
            embImageArea: updatedArea,
          };
        }
        return item;
      })
    );
  };

  const centerBoth = () => {
    centerImage("horizontal");
    centerImage("vertical");
  };

  const setSaveEmbossDetail = () => {
    if (
      imageForPreview &&
      activeImg?.some((item) => item.embImage !== "") == true
    ) {
      const savedData = activeImg?.filter((item) => item.embImage !== "");
      const parsedData = savedData.map((item) => {
        let areas = item.area;
        if (typeof areas === "string") {
          try {
            areas = JSON.parse(areas);
          } catch (e) {
            // console.error("Error parsing area:", e);
          }
        }
        return { ...item, areas };
      });
      dispatch(activeImageData(activeImg));
      setActiveImgSave(activeImg);
      setPreviewImageData(parsedData);
      dispatch(previewImageDatas(parsedData));
      setEmbossingPreview(true);
      setSaveEmbossing(true);
      dispatch(saveEmbossings(true));
      setEmbossingModalView(false);
      setSelectedIndex(0);
    } else {
      setImageForPreview(false);
      setSaveEmbossing(false);
      dispatch(saveEmbossings(false));
      setIsSuccess(false);
      setToastOpen(true);
      setToastMsg("Please Set Embossing Image");
      setEmbossingModalView(true);
    }
  };

  const setSaveEmbossDetailReset = () => {
    const activeImgObj = activeImg.map((item) => ({
      ...item,
      embImage: "",
      binaryFile: null,
      embImageArea: {
        left: 20,
        top: 20,
        width: 50,
        height: 50,
      },
    }));
    setActiveImg(activeImgObj);
    setActiveImgSave(activeImgObj);
    dispatch(activeImageData(activeImgObj));
    setSelectedIndex(0);
    setPreviewImageData([]);
    dispatch(previewImageDatas([]));
    setEmbossingPreview(false);
    setSaveEmbossing(false);
    dispatch(saveEmbossings(false));
    setEmbossingModalView(false);
    setEmbossingPreviewModalBaseView(false);
    setEmbossingPreviewModalView(false);
  };

  const handleSetStateChange = (value) => {
    setEmbossingPreviewModalBaseView(value);
    setEmbossingPreviewModalView(value);
    setSelectedIndex(0);
  };

  useEffect(() => {
    if (
      storeCurrencys &&
      (router.pathname.includes("/start-with-a-setting") ||
        router.pathname.includes("/start-with-a-diamond"))
    ) {
      setCurrency(storeCurrencys);
      setOnceUpdated(false);
    }
  }, [storeCurrencys]);

  // Table Head
  const bomColumns = [
    {
      id: "item_id",
      title: "Item Id",
    },
    {
      id: "bom_sku",
      title: "BOM SKU",
    },
    {
      id: "search_name",
      title: "Cust Quality",
    },
    {
      id: "cost_type",
      title: "Cost Type",
    },
    {
      id: "pricing_unit",
      title: "Pricing Unit",
    },
    {
      id: "ptr_wt",
      title: "Ptr WT",
    },
    {
      id: "ptr_wt_unit",
      title: "Ptr WT Unit",
    },
    {
      id: "quantity",
      title: "Qty",
    },
    {
      id: "unit",
      title: "Unit",
    },
    {
      id: "second_quantity",
      title: "2nd Qty",
    },
    {
      id: "second_unit",
      title: "2nd Unit",
    },
    {
      id: "loss_percentage",
      title: "Wastage Loss %",
    },
    {
      id: "premium_per",
      title: "Premium %",
    },
    {
      id: "brokerage_missing_per",
      title: "Brokerage %",
    },
    {
      id: "site_code",
      title: "Set Code",
    },
    {
      id: "D1",
      title: "D1",
    },
    {
      id: "D2",
      title: "D2",
    },
    {
      id: "D3",
      title: "D3",
    },
    {
      id: "D4",
      title: "D4",
    },
    {
      id: "D5",
      title: "D5",
    },
    {
      id: "D6",
      title: "D6",
    },
    {
      id: "D7",
      title: "D7",
    },
    {
      id: "D8",
      title: "D8",
    },
    {
      id: "D9",
      title: "D9",
    },
    {
      id: "D10",
      title: "D10",
    },
    {
      id: "D11",
      title: "D11",
    },
  ];

  const labourColumns = [
    {
      id: "labour_id",
      title: "Labour Id",
    },
    {
      id: "main_category",
      title: "Operation Group",
    },
    {
      id: "operation_code",
      title: "Operation",
    },
    {
      id: "sub_category",
      title: "Sub Operation",
    },
    {
      id: "quantity_weight",
      title: "Lab Unit",
    },
    {
      id: "total_unit",
      title: "Total Unit",
    },
  ];

  // API Obj
  const [objectForGetFavourite, setObjectForGetFavourite] = useState({
    a: "GetFavourite",
    origin: "",
    store_id: "",
    user_id: "",
    customer_name: "",
    tenant_id: "",
    entity_id: "",
    per_page: "0",
    secret_key: "",
    number: "0",
    store_type: "B2C",
    currency: storeEntityIds.store_currency,
  });

  const [storeTabVariantInfo, setStoreTabVariant] = useState({
    a: "getStoreVariantDetails",
    miniprogram_id: "",
    tenant_id: "",
    product_variant: "",
    item_id: "",
    system_id: "",
    entity_id: "",
    secret_key: "",
    store_type: "B2C",
    product_diy: "",
    origin: "",
    SITDeveloper: "1",
    per_page: 0,
    number: 0,
  });

  const mostSearch = useCallback(
    (value) => {
      const search_obj = {
        a: "AddMostSearchProduct",
        search_type: "SEARCH",
        consumer_id: isLogin ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        item_id: isEmpty(value?.item_id),
        variant_id: isEmpty(value.variant_data[0].product_variant),
        vertical_code: isEmpty(value.variant_data[0].mi_product_vertical),
        product_type: isEmpty(value.variant_data[0].mi_jewellery_product_type),
        pv_unique_id: isEmpty(value.variant_data[0].pv_unique_id),
        product_name: isEmpty(value.variant_data[0].product_name),
        product_title: isEmpty(value.variant_data[0].product_name),
        mi_unique_id:
          isEmpty(value.mi_unique_id) !== "" ? value.mi_unique_id : "",
      };
      Commanservice.postLaravelApi("/MostSearchProduct", search_obj)
        .then((res) => {
          if (res.data.success === 1) {
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    },
    [loginDatas]
  );

  const variantData = useCallback((obj) => {
    Commanservice.postApi("/EmbeddedPageMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          setTabDataDone(true);
          setStoreVariantDataList(res.data.data);
          setStoreVariantCount(res.data.data.length);
        } else {
          setTabDataDone(false);
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
        }
      })
      .catch(() => {});
  }, []);

  // API call for related Products
  const getRelatedProducts = (itemIds, relatedIds, counts, objs) => {
    const obj = {
      a: "GetItemDetailsbyRelatedProductIDForStore",
      SITDeveloper: "1",
      tenant_id: objs.tenant_id ?? storeEntityIds.tenant_id,
      entity_id: objs.entity_id ?? storeEntityIds.entity_id,
      store_id: objs.miniprogram_id ?? storeEntityIds.mini_program_id,
      item_id: itemIds,
      related_product_id: relatedIds,
      per_page: "10",
      number: counts,
      secret_key: objs.secret_key ?? storeEntityIds?.secret_key,
      store_type: "B2C",
      extra_currency: storeCurrencys,
      product_diy: paramsItem,
      user_id: isLogin ? loginDatas.member_id : RandomId,
    };

    setRelatedProductObj(obj);
    commanService
      .postApi("/SetFamilyCategory", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res?.data?.data;
          setTotalPagesRelated(data?.total_rows);
          const newProducts = res?.data?.data?.resData || [];
          if (newProducts.length === 0) {
            setHasMoreRelated(false);
          } else {
            if (counts > 1) {
              setRelatedProductData((prev) => [...prev, ...newProducts]);
            } else {
              setRelatedProductData(newProducts);
            }
            setCount(counts);
            if (
              newProducts.length < 10 ||
              relatedProductData.length + newProducts.length < 10
            ) {
              setHasMoreRelated(false);
            } else {
              setHasMoreRelated(true);
            }
          }
        } else {
          setHasMoreRelated(false);
        }
      })
      .catch((err) => {
        setHasMoreRelated(false);
      })
      .finally(() => {
        setLoading(false);
        apiTriggeredRef.current = false;
      });
  };

  const paginationLeftRight = useCallback(
    (direction) => {
      if (direction === "left" && count > 1) {
        setIsEndReached(false);
        apiTriggeredRef.current = false;
      }
      if (direction === "right") {
        if (!hasMoreRelated || apiTriggeredRef.current) return;
        if (isEndReached) {
          apiTriggeredRef.current = true;
          const newCount = count + 1;
          getRelatedProducts(
            relatedProductObj.item_id,
            relatedProductObj.related_product_id,
            newCount
          );
          setIsEndReached(false);
        } else {
          // swiperInstance?.next();
        }
      }
    },
    [isEndReached, hasMoreRelated, count, relatedProductObj]
  );

  const consolidateImageTypesProduct = (data) => {
    const allImageUrls = new Set();
    data?.forEach((item) => {
      if (item.image_types && Array.isArray(item.image_types)) {
        item.image_types.forEach((url) => allImageUrls.add(url));
      }
    });
    return Array.from(allImageUrls);
  };

  const consolidateImageUrlsProduct = (data) => {
    const allImageUrls = new Set();
    data?.forEach((item) => {
      if (item.image_urls && Array.isArray(item.image_urls)) {
        item.image_urls.forEach((url) => allImageUrls.add(url));
      }
    });
    return Array.from(allImageUrls);
  };

  const storeItemImageAndSpecificationDetails = useCallback(
    (obj, dataSearch) => {
      setLoading(true);
      Commanservice.postApi("/EmbeddedPageMaster", obj)
        .then((res) => {
          if (res.data.success === 1) {
            let storeObj = res.data.data[0];
            const images = [
              {
                image_urls: [
                  ...(storeObj?.variant_data?.[0]?.image_urls || []),
                  ...storeObj.image_urls,
                ],
              },
            ];
            storeObj.images = new Set();
            storeObj.images = consolidateImageUrlsProduct(images);
            const types = [
              {
                image_types: [
                  ...(storeObj?.variant_data?.[0]?.image_types || []),
                  ...storeObj.image_types,
                ],
              },
            ];
            storeObj.image_types = new Set();
            storeObj.image_types = consolidateImageTypesProduct(types);

            if (
              router.pathname.includes("/start-with-a-diamond") ||
              isItemDIY
            ) {
              dispatch(storeSpecData(storeObj));
            }
            if (storeSpecDatas.length > 0) {
              dispatch(storeSpecData(storeObj));
            }
            if (storeObj.variant_data.length > 0) {
              if (
                isEmpty(storeObj?.variant_data[0]["image_types"][lastActive]) !=
                ""
              ) {
                setActive(lastActive);
                setLastActive(0);
              }
              if (!router.pathname.includes("/start-with-a-setting")) {
                dispatch(
                  jeweleryDIYName(storeObj?.variant_data?.[0]?.product_name)
                );
                dispatch(jeweleryDIYimage(storeObj?.images[0]));
              }
            } else {
              if (
                isEmpty(storeObj?.variant_data[0]["image_types"][lastActive]) !=
                ""
              ) {
                setActive(lastActive);
              }
            }
            setSpecificationData(storeObj);
            dispatch(storeProdData(storeObj));
            if (addedRingDatas.variant_data?.length > 0) {
              dispatch(addedRingData(storeObj));
            }
            storyData(storeObj?.item_id, obj);
            reviewData(storeObj, "0", "0", "1", obj);

            var params = [];
            if (dataSearch.filter.length > 0) {
              params?.push({ key: "master_jewelry_type", value: [] });
              dataSearch.filter.map((e1) => {
                if (e1.key === "master_jewelry_type") {
                  params = [];
                  params?.push({
                    key: "master_jewelry_type",
                    value: [e1.selectedvalue],
                  });
                }
                return e1;
              });
            }

            const tabVariant = {
              ...storeTabVariantInfo,
              miniprogram_id: storeEntityIds.mini_program_id,
              tenant_id: storeEntityIds.tenant_id,
              item_id: dataSearch?.item_id,
              product_diy: paramsItem,
              system_id: dataSearch?.system_id,
              entity_id: storeEntityIds.entity_id,
              secret_key: storeEntityIds.secret_key,
              origin: storeEntityIds.cmp_origin,
              product_variant: "",
              params: JSON.stringify(params),
            };
            setStoreTabVariant(tabVariant);
            if (keyTabView === "Variant") {
              variantData(tabVariant);
            }

            const bomData = [...storeObj?.bom_details];
            if (bomData.length > 0) {
              setBomDataList(bomData);
            }
            const labourData = [...storeObj?.labour_lines_details?.details];
            if (labourData.length > 0) {
              setLabourDataList(labourData);
            }

            const itemIds = storeObj?.item_id;
            const relatedId = storeObj?.store_related_product_id;
            if (isEmpty(itemIds) !== "" && isEmpty(relatedId) !== "") {
              setRelatedProductData([]);
              getRelatedProducts(itemIds, relatedId, 1, obj);
              setCount(1);
            }

            if (!allDataSpec) {
              const initServiceData =
                storeObj?.variant_data?.[0]?.service_data.map((item) => ({
                  ...item,
                  is_selected: "0",
                }));
              setServiceData(initServiceData);
              dispatch(serviceAllData(initServiceData));
            }

            const otherData = storeObj?.variant_data?.[0]?.service_data?.filter(
              (item) => item.service_type === "Normal"
            );
            if (otherData?.length > 0) {
              setOtherService(otherData);
              dispatch(otherServiceData(otherData));
            }

            setEmbossingData(
              storeObj?.variant_data?.[0]?.service_data?.filter(
                (item) =>
                  item.service_code === "EMBOSSING" &&
                  item.service_type === "Special"
              )
            );
            setEmbossingArea(storeObj?.variant_data?.[0]?.image_area);
            dispatch(
              storeEmbossingData(
                storeObj?.variant_data?.[0]?.service_data?.filter(
                  (item) =>
                    item.service_code === "EMBOSSING" &&
                    item.service_type === "Special"
                )
              )
            );

            const engData = storeObj?.variant_data?.[0]?.service_data?.filter(
              (item) =>
                item.service_code === "ENGRAVING" &&
                item.service_type === "Special"
            );
            if (engData?.length > 0) {
              setEngravingData(engData[0]);
              dispatch(addEngravingAction(engData[0]));
            }

            if (res.data.data[0]) {
              if (res.data.data[0].expected_delivery_date) {
                const date = new Date(res.data.data[0].expected_delivery_date);
                const options = {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                const formattedDate = date.toLocaleDateString("en-US", options);
                setDeliveryDate(formattedDate);
              }
              setStoreVariantCount(res.data.data[0].total_variant);
              var ring_info = isEmpty(res.data.data[0].ring_info);
              var final_data = [];
              for (let c = 0; c < ring_info.length; c++) {
                if (
                  isEmpty(ring_info[c].value) != "" &&
                  isEmpty(ring_info[c].title) != "Item Group Prefix"
                ) {
                  final_data.push(ring_info[c]);
                }
              }
              setColumnsForSpecification(final_data);
              if (isEmpty(res.data.data[0].diy_bom_id) != "") {
                var data = [
                  { title: "Specification" },
                  { title: "Can Be Set With" },
                ];
                setSelectedTab(data);
              } else {
                var data = [{ title: "Specification" }];
                setSelectedTab(data);
              }
              if (keyTabView === "Can Be Set With") {
                canBeSetWithData();
              }
              setProductType(
                res.data.data[0].variant_data[0][
                  "mi_jewellery_product_type_name"
                ]
              );

              var diamond_data = [];
              var dia_final_data = [];
              var extra_summary =
                res.data.data[0].short_summary["extra_summary"];
              const result = {};
              for (const { item_group_name, counter } of extra_summary) {
                result[item_group_name] =
                  (result[item_group_name] ?? 0) + counter;
              }
              var result_key = Object.keys(result);
              var result_value = Object.values(result);
              for (let k = 0; k < result_key.length; k++) {
                if (extra_summary[0]["item_group_name"] == result_key[k]) {
                  extra_summary[0]["show_counter"] = result_value[k];
                }
              }
              setdiamondSummaryname(
                extra_summary[0]["item_group_name"] +
                  (extra_summary[0]["show_counter"] > 1
                    ? "-" + extra_summary[0]["counter"]
                    : "") +
                  " Information"
              );
              diamond_data = [];
              if (isEmpty(extra_summary[0]["stone_shape_name"]) != "") {
                diamond_data.push({
                  title: "Shape",
                  value: extra_summary[0]["stone_shape_name"],
                });
              }
              if (isEmpty(extra_summary[0]["stone_type_name"]) != "") {
                diamond_data.push({
                  title: "Stone Type",
                  value: extra_summary[0]["stone_type_name"],
                });
              }
              if (isEmpty(extra_summary[0]["quantity"]) != "") {
                diamond_data.push({
                  title: "Quantity",
                  value: extra_summary[0]["quantity"],
                });
              }
              if (isEmpty(extra_summary[0]["international_color"]) != "") {
                diamond_data.push({
                  title: "Average Color",
                  value: extra_summary[0]["international_color"],
                });
              }
              if (isEmpty(extra_summary[0]["international_quality"]) != "") {
                diamond_data.push({
                  title: "Average Quality",
                  value: extra_summary[0]["international_quality"],
                });
              }
              dia_final_data.push(diamond_data);
              setdiamondSummary(dia_final_data);

              var sec_dia_final_data = [];
              var sec_diamond_data = [];
              var sec_dia_data_name = [];
              var sec_final_dia_data_name = [];
              for (let d = 0; d < extra_summary.length; d++) {
                for (let k = 0; k < result_key.length; k++) {
                  if (extra_summary[d]["item_group_name"] == result_key[k]) {
                    extra_summary[d]["show_counter"] = result_value[k];
                  }
                }
                sec_diamond_data = [];
                if (d != 0) {
                  sec_dia_data_name.push(
                    extra_summary[d]["item_group_name"] +
                      (extra_summary[d]["show_counter"] > 1
                        ? "-" + extra_summary[d]["counter"]
                        : "") +
                      " Information"
                  );
                  if (isEmpty(extra_summary[d]["stone_shape_name"]) != "") {
                    sec_diamond_data.push({
                      title: "Shape",
                      value: extra_summary[d]["stone_shape_name"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["stone_type_name"]) != "") {
                    sec_diamond_data.push({
                      title: "Stone Type",
                      value: extra_summary[d]["stone_type_name"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["quantity"]) != "") {
                    sec_diamond_data.push({
                      title: "Quantity",
                      value: extra_summary[d]["quantity"],
                    });
                  }
                  if (isEmpty(extra_summary[d]["international_color"]) != "") {
                    sec_diamond_data.push({
                      title: "Average Color",
                      value: extra_summary[d]["international_color"],
                    });
                  }
                  if (
                    isEmpty(extra_summary[d]["international_quality"]) != ""
                  ) {
                    sec_diamond_data.push({
                      title: "Average Clarity",
                      value: extra_summary[d]["international_quality"],
                    });
                  }
                  sec_dia_final_data.push(sec_diamond_data);
                  sec_final_dia_data_name.push(sec_dia_data_name);
                }
              }
              setSecondDiamondSummaryname(sec_dia_data_name);
              setSecondDiamondSummary(sec_dia_final_data);
            }
            setLoading(false);
          } else {
            setTabDataDone(false);
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [currency, allDataSpec, varaintId]
  );

  useEffect(() => {
    if (
      params?.productKey === "offer" &&
      params?.value !== null &&
      specificationData?.offers?.length
    ) {
      const offer = specificationData.offers.filter(
        (off, i) =>
          off.coupon_code.toUpperCase() === params?.value.toUpperCase()
      );
      setIsOffers(true);
      handleCouponApply([offer[0]]);
      setSelectedOffer([offer[0]]);
    } else {
      setIsOffers(true);
      handleCouponApply([specificationData?.offers?.[0]]);
      setSelectedOffer([specificationData?.offers?.[0]]);
    }
  }, [specificationData]);

  const storeItemDetails = useCallback(
    (objStoreItem, dataSearch) => {
      setTabDataDone(true);
      const itemImageObj = {
        a: "getStoreItemImageAndSpecificationDetails",
        miniprogram_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        variant_unique_id: dataSearch?.variant_id,
        item_id: dataSearch?.item_id,
        system_id: dataSearch?.system_id,
        secret_key: storeEntityIds.secret_key,
        store_type: "B2C",
        product_diy: paramsItem,
        origin: storeEntityIds.cmp_origin,
        SITDeveloper: "1",
        lang_id: 1,
        extra_currency: storeCurrencys,
        extra_summary: "Yes",
      };

      if (isItemDIY) {
        itemImageObj.diy_type = "1";
        itemImageObj.diy_step =
          ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
        itemImageObj.diy_bom_id =
          ActiveStepsDiys > 0
            ? DiyStepersDatas?.filter(
                (item) => item.position === ActiveStepsDiys - 1
              )[0]?.diy_bom_id
            : "";
        itemImageObj.combination_id =
          ActiveStepsDiys > 0
            ? DiyStepersDatas?.filter(
                (item) => item.position === ActiveStepsDiys - 1
              )[0]?.combination_id
            : "";
      }

      storeItemImageAndSpecificationDetails(itemImageObj, dataSearch);
    },
    [
      variantData,
      storeItemImageAndSpecificationDetails,
      keyTabView,
      paramsItem,
      storeEntityIds,
      storeTabVariantInfo,
      currency,
      varaintId,
      allDataSpec,
    ]
  );

  const dynamicSearchParameter = useCallback(
    (objFilter) => {
      Commanservice.postApi("/EmbeddedPageMaster", objFilter)
        .then((res2) => {
          if (res2.data.success === 1) {
            const dataSearch = res2.data.data;
            if (Object.keys(dataSearch).length > 0) {
              setFilterProduct(dataSearch.filter);
              setCanBeSets(dataSearch.can_be_set);
              setItemId(dataSearch.item_id);
              setStoreVariantId(dataSearch.variant_id);
              if (dataSearch.filter.length > 0) {
                dataSearch.filter.map((e1) => {
                  if (e1.key === "master_primary_metal_type") {
                    setMetalType(e1.selectedvalue);
                  }
                  if (isEmpty(e1.key) === "master_gh_shape") {
                    setselectedShape(isEmpty(e1.selectedvalue));
                  }
                  if (isEmpty(e1.key) === "master_gh_color") {
                    setselectedColor(isEmpty(e1.selectedvalue));
                  }
                  return e1;
                });
              }

              const objStoreItem = {
                a: "getStoreItemDetails",
                SITDeveloper: "1",
                miniprogram_id: storeEntityIds.mini_program_id,
                tenant_id: storeEntityIds.tenant_id,
                entity_id: storeEntityIds.entity_id,
                variant_unique_id: dataSearch.variant_id,
                item_id: dataSearch.item_id,
                secret_key: storeEntityIds.secret_key,
                store_type: "B2C",
                extra_currency: storeCurrencys,
                product_diy: paramsItem,
                vertical_code: "",
                user_id: isLogin ? loginDatas.member_id : RandomId,
              };

              if (isItemDIY) {
                objStoreItem.diy_type = "1";
                objStoreItem.diy_step =
                  ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
                objStoreItem.diy_bom_id =
                  ActiveStepsDiys > 0
                    ? DiyStepersDatas?.filter(
                        (item) => item.position === ActiveStepsDiys - 1
                      )[0]?.diy_bom_id
                    : "";
                objStoreItem.combination_id =
                  ActiveStepsDiys > 0
                    ? DiyStepersDatas?.filter(
                        (item) => item.position === ActiveStepsDiys - 1
                      )[0]?.combination_id
                    : "";
              }

              storeItemDetails(objStoreItem, dataSearch);
              const arr = [];
              dataSearch.filter.map((e) => {
                let obj = { key: e.key, value: e.selectedvalue };
                arr.push(obj);
                return e;
              });
              setFilterParameter(arr);
              canBeSetWithData();
            } else {
              setLoading(false);
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res2.data.message);
          }
        })
        .catch(() => {});
    },
    [
      filterParameter,
      paramsItem,
      storeItemDetails,
      isLogin,
      loginDatas,
      varaintId,
      allDataSpec,
    ]
  );

  const canBeSetWithData = () => {
    if (
      isEmpty(canBeSetWithVariant) !=
      specificationData.variant_data[0]["product_variant"]
    ) {
      setCanBesetWithVariant(
        specificationData.variant_data[0]["product_variant"]
      );
      var obj = {
        a: "getDIYBomDetails",
        diy_bom_id: specificationData.diy_bom_id,
        item_id: specificationData.item_id,
        variant_number: specificationData.variant_data[0]["product_variant"],
        tenant_id: storeEntityIds.tenant_id,
        SITDeveloper: "1",
      };
      Commanservice.postApi("/UniversalSearch2", obj).then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          if (isEmpty(data[0]?.mm) != "") {
            setColumName("MM");
          } else {
            setColumName("LxWxD");
          }
          setCanBeSetWithDataList(data);
          if (
            router.pathname.includes("/start-with-a-diamond") &&
            finalCanBeSetDatas.length === 0
          ) {
            newCanbeSetData(data[0]);
          }
          setLoading(false);
        }
      });
    }
  };

  const appliedFilter = (e, value, type) => {
    setActive(0);
    setSaveEmbossDetailReset();
    setSelectedOffer([]);
    setIsOffers(false);
    const arr = [...filterParameter];
    setFilterParameter([]);
    if (type === undefined) {
      const valueArr = arr.filter((val) => val.key === e.key);
      valueArr[0].value = value.key;
      e.selectedvalue = value.key;
      setFilterParameter(arr);
    }
    const filterArrayData = [...filterParameter].map((item) =>
      item.key === e.key ? { key: e.key, value: e.selectedvalue } : item
    );
    filterArrayData.findIndex((item) => item.key === e.key);
    const newArr = [];
    for (
      let i = 0;
      i <= filterArrayData.findIndex((item) => item.key === e.key);
      i++
    ) {
      newArr.push(filterArrayData[i]);
    }
    const obj = {
      a: "getDynamicSearchParameter",
      SITDeveloper: "1",
      tenant_id: storeEntityIds.tenant_id,
      param: JSON.stringify(newArr),
      diamond_params: router.pathname.includes("start-with-a-diamond")
        ? JSON.stringify({
            shape: addedDiamondDatas?.st_shape,
            from_length: addedDiamondDatas?.st_length,
            from_width: addedDiamondDatas?.st_width,
            from_depth: addedDiamondDatas?.st_depth,
          })
        : "[]",
      variant_id: type === "variant" ? e.unique_id : "",
      item_id: type === "variant" ? e.item_id : itemId,
      src: type === "variant" ? "metal" : e.key,
      secret_key: storeEntityIds.secret_key,
      calling: "1",
      default_variant_id: varaintId !== null ? varaintId : params?.variantId,
      is_customize: "1",
      is_dc: "1",
      is_smc: "0",
      stone_shape: "",
      product_diy: paramsItem === "DIY" && !isItemDIY ? "DIY" : "PRODUCT",
    };

    if (isItemDIY) {
      obj.diy_step = ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
      obj.diy_type = "1";
      obj.diy_bom_id =
        ActiveStepsDiys > 0
          ? DiyStepersDatas?.filter(
              (item) => item.position === ActiveStepsDiys - 1
            )[0]?.diy_bom_id
          : "";
      obj.combination_id =
        ActiveStepsDiys > 0
          ? DiyStepersDatas?.filter(
              (item) => item.position === ActiveStepsDiys - 1
            )[0]?.combination_id
          : "";
    }
    dynamicSearchParameter(obj, false);
  };

  useEffect(() => {
    setItemLength(Array.from({ length: 1 }));
    if (varaintId && storeEntityIds && Object.keys(storeEntityIds).length > 0) {
      if (!onceUpdated) {
        window.scrollTo(0, 0);
        setOnceUpdated(true);
        setLoading(true);
        const objFilter = {
          a: "getDynamicSearchParameter",
          product_diy: paramsItem === "DIY" && !isItemDIY ? "DIY" : "PRODUCT",
          SITDeveloper: "1",
          tenant_id: storeEntityIds.tenant_id,
          param: "[]",
          diamond_params: router.pathname.includes("start-with-a-diamond")
            ? JSON.stringify({
                shape: addedDiamondDatas?.st_shape,
                from_length: addedDiamondDatas?.st_length,
                from_width: addedDiamondDatas?.st_width,
                from_depth: addedDiamondDatas?.st_depth,
              })
            : "[]",
          variant_id: varaintId,
          item_id: "",
          src: "metal",
          secret_key: storeEntityIds.secret_key,
          calling: "1",
          default_variant_id: varaintId,
          is_customize: "1",
          is_dc: "1",
          is_smc: "0",
          stone_shape: "",
        };

        if (isItemDIY) {
          objFilter.diy_step =
            ActiveStepsDiys === 0 ? "" : ActiveStepsDiys.toString();
          objFilter.diy_type = "1";
          objFilter.diy_bom_id =
            ActiveStepsDiys > 0
              ? DiyStepersDatas?.filter(
                  (item) => item.position === ActiveStepsDiys - 1
                )[0]?.diy_bom_id
              : "";
          objFilter.combination_id =
            ActiveStepsDiys > 0
              ? DiyStepersDatas?.filter(
                  (item) => item.position === ActiveStepsDiys - 1
                )[0]?.combination_id
              : "";
        }

        dynamicSearchParameter(objFilter, true);
        setObjectForGetFavourite({
          ...objectForGetFavourite,
          origin: storeEntityIds.cmp_origin,
          store_id: storeEntityIds.mini_program_id,
          user_id: isLogin ? loginDatas.member_id : RandomId,
          customer_name: isLogin ? loginDatas.first_name : "guest",
          tenant_id: storeEntityIds.tenant_id,
          entity_id: storeEntityIds.entity_id,
          secret_key: storeEntityIds.secret_key,
        });
      }
    }
  }, [paramsItem, storeEntityIds, onceUpdated, isLogin, loginDatas, varaintId]);

  useEffect(() => {
    if (onceUpdatedVariantTab === false) {
      setOnceUpdatedVaraintTab(true);
      if (keyTabView === "Variant") {
        variantData(storeTabVariantInfo);
      }
    }
    if (
      router.pathname.includes("/start-with-a-diamond") &&
      isRingSelecteds === true
    ) {
      dispatch(activeDIYtabs("Complete"));
    } else if (router.pathname.includes("/start-with-a-setting")) {
      dispatch(activeDIYtabs(activeDIYtabss));
    } else {
    //   dispatch(activeDIYtabs("Jewellery"));
    }
  }, [keyTabView, storeTabVariantInfo, onceUpdatedVariantTab]);

  useEffect(() => {
    setStoneTypeArr([]);
    setDIYShapesDataList([]);
    setDIYSizeDataList([]);
    setStoneActive({});
    setDIYClarityDataList([]);
    setClarityWithColor("");
    setSizeStoneActive({});
    setOnceUpdated(false);
    setShapeStoneActive({});
    setVerticalCode("");
    if (
      isEmpty(sessionStorage.getItem("DIYVertical")) === "" &&
      isItemDIY === true
    ) {
      dispatch(DiyStepersData([]));
      dispatch(ActiveStepsDiy(0));
      router.push("/make-your-customization");
    }
  }, []);

  //State update for DIY page
  useEffect(() => {
    if (isItemDIY) {
      setOnceUpdated(false);
      setEngravingData({});
      setSelectedOffer([]);
      setEngravingData({});
      setEmbossingData([]);
      dispatch(serviceAllData([]));
      dispatch(otherServiceData([]));
      setOtherService([]);
      setSaveEngraving(false);
      setSaveEmbossing(false);
      if (allDataSpec) {
        setEngravingText(allDataSpec?.engravingText);
        setIsItalicFont(allDataSpec?.isItalicFont);
        setIsEngraving(allDataSpec?.isEngraving);
        setEngravingTexts(allDataSpec?.engravingTexts);
        setSaveEngraving(allDataSpec?.saveEngraving);
        setEngravingData(allDataSpec?.engravingData);
        setEmbossingArea(allDataSpec.embossingArea);
        dispatch(storeEmbossingData(allDataSpec?.engravingData));
        dispatch(previewImageDatas(allDataSpec.previewImageData));
        setPreviewImageData(allDataSpec.previewImageData);
        setSaveEmbossing(allDataSpec.SaveEmbossing);
        setActiveImg(allDataSpec.activeImg);
        setActiveImgSave(allDataSpec.activeImgSave);
        dispatch(activeImageData(allDataSpec.activeImg));
        dispatch(saveEmbossings(allDataSpec.SaveEmbossing));
        setServiceData(allDataSpec.service_json);
        setOtherService(
          allDataSpec.service_json.filter((item) => item.is_selected === "1")
        );
        dispatch(serviceAllData(allDataSpec.service_json));
        dispatch(
          otherServiceData(
            allDataSpec.service_json.filter((item) => item.is_selected === "1")
          )
        );
      }
    }
  }, [varaintId]);

  const consolidateImageUrls = (data) => {
    const allImageUrls = new Set();
    data?.forEach((item) => {
      if (item.image_urls && Array.isArray(item.image_urls)) {
        item.image_urls.forEach((url) => allImageUrls.add(url));
      }
    });
    return Array.from(allImageUrls);
  };

  const consolidateImageTypes = (data) => {
    const allImageTypes = [];
    data?.forEach((item) => {
      if (item.image_types && Array.isArray(item.image_types)) {
        allImageTypes.push(...item.image_types);
      }
    });
    return allImageTypes;
  };

  const handleUpdateImageforDiy = (data) => {
    const storeObjs = specificationData;
    storeObjs.images = consolidateImageUrls(data);
    storeObjs.image_types = consolidateImageTypes(data);
    storeObjs.variant_data[0].image_urls = consolidateImageUrls(data);
    storeObjs.variant_data[0].image_types = consolidateImageTypes(data);
    setSpecificationData(storeObjs);
    dispatch(storeSpecData(storeObjs));
  };

  // DIY Set Items
  const handleSetItemsDIY = (e) => {
    e.preventDefault();
    if (
      isItemDIY &&
      ActiveStepsDiys === DiyStepersDatas[DiyStepersDatas?.length - 2]?.position
    ) {
      const updatedStepperData = DiyStepersDatas.map((step, index) => {
        const services = [];
        serviceData.forEach((element) => {
          const serviceItem = {
            text: "",
            type: "",
            image: "",
            is_selected: element.is_selected,
            currency: element?.msrv_currency,
            msrv_currency: element?.msrv_currency,
            price: element?.service_rate,
            font_size: element?.font_size,
            min_character: element?.min_character,
            max_character: element?.max_character,
            unique_id: element?.service_unique_id,
            service_code: element?.service_code,
            service_name: element?.service_name,
            service_type: element?.service_type,
            service_rate: element?.service_rate,
          };
          if (
            element?.service_code == "ENGRAVING" &&
            element.service_type === "Special"
          ) {
            serviceItem.type = isItalicFont ? "italic" : "bold";
            serviceItem.text = saveEngraving === true ? engravingTexts : "";
            serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
          }
          if (
            element?.service_code == "EMBOSSING" &&
            element.service_type === "Special"
          ) {
            serviceItem.image = activeImgSave;
            serviceItem.is_selected =
              activeImgSave.some((img) => img?.embImage !== "") == true
                ? "1"
                : "0";
          }
          otherService.forEach((ele) => {
            if (ele.service_unique_id == element?.service_unique_id) {
              serviceItem.is_selected = element.is_selected == true ? "1" : "0";
            }
          });
          services.push(serviceItem);
        });
        if (step.position === activeStep) {
          const data = storeSpecDatas;
          return {
            ...step,
            qty: 1,
            allData: data,
            image_urls: data?.images,
            image_types: data?.image_types,
            product_name: data?.variant_data?.[0]?.product_name,
            product_title:
              isEmpty(params?.title) !== ""
                ? firstWordCapital(params?.title.split("-").join(" "))
                : "",
            short_summary: data?.short_summary,
            item_base_price: data?.final_total_display,
            currency_base_symbol: data?.currency_symbol,
            metal_type: metalType,
            variant_sku: data?.variant_data?.[0]?.product_sku,
            product_variant: data?.variant_data?.[0]?.product_variant,
            vertical: data?.variant_data?.[0]?.vertical_short_code,
            price: calculatePrice(
              data,
              selectedOffer,
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            new_price: calculatePrice(
              data,
              selectedOffer,
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            old_price: calculatePrice(
              data,
              [],
              saveEngraving,
              SaveEmbossing,
              embossingData,
              serviceData
            ),
            currency: data?.currency_symbol,
            store_tax_included_in_price: data?.store_tax_included_in_price,
            nextStepPosition: activeStep,
            service_json: services ?? [],
            is_engraving: data?.is_engraving,
            variant_unique_id: data?.variant_data?.[0]?.variant_unique_id,
            item_id: data?.item_id,
            mi_unique_id: data?.mi_unique_id,
            group_code: data?.variant_data?.[0]?.item_group,
            variant_id: data?.variant_data?.[0]?.variant_unique_id,
            price_type: data?.variant_data?.[0]?.bom_type,
            eng_font: isItalicFont ? "italic" : "bold",
            eng_text: saveEngraving === true ? engravingTexts : "",
            eng_price: engravingData?.service_rate,
            eng_currency: engravingData?.msrv_currency,
            eng_font_size: engravingData?.font_size,
            eng_max_character: engravingData?.max_character,
            eng_min_character: engravingData?.min_character,
            engraving_unique_id: engravingData?.service_unique_id,
            embossing_unique_id: embossingData?.[0]?.service_unique_id,
            embossing_json: JSON.stringify(activeImgSave),
            engravingData: engravingData,
            saveEngraving: saveEngraving,
            engravingTexts: engravingTexts,
            isEngraving: isEngraving,
            isItalicFont: isItalicFont,
            engravingText: engravingText,
            embossingArea: embossingArea,
            previewImageData: previewImageData,
            SaveEmbossing: SaveEmbossing,
            activeImg: activeImg,
            activeImgSave: activeImgSave,
            offer_code:
              selectedOffer.length > 0
                ? isEmpty(selectedOffer[0]?.coupon_code)
                : "",
          };
        }
        return step;
      });
      const nextStepPosition = activeStep + 1;
      setActiveStep(nextStepPosition);
      dispatch(ActiveStepsDiy(nextStepPosition));
      dispatch(DiyStepersData(updatedStepperData));
      setTypeViewDiy(true);
      if (
        Object.keys(specificationData)?.length > 0 &&
        updatedStepperData?.length > 0
      ) {
        handleUpdateImageforDiy(updatedStepperData);
      }
    } else {
      setLoading(true);
      const obj = {
        a: "getDIYCombinationList",
        diy_bom_id:
          activeStep > 0
            ? DiyStepersDatas?.filter(
                (item) => item.position === activeStep - 1
              )[0]?.diy_bom_id
            : "",
        combination_id:
          activeStep > 0
            ? DiyStepersDatas?.filter(
                (item) => item.position === activeStep - 1
              )[0]?.combination_id
            : "",
        diy_step: activeStep + 1,
        diy_type: "1",
        entity_id: storeEntityIds.entity_id,
        item_id: itemId,
        metal_type: metalType,
        shape: selectedShape,
        tenant_id: storeEntityIds.tenant_id,
        variant_id: storeVariantId,
        SITDeveloper: 1,
      };
      Commanservice.postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const bomDetails = res?.data?.data?.[0];
            if (activeStep < DiyStepersDatas?.length && bomDetails) {
              const services = [];
              serviceData.forEach((element) => {
                const serviceItem = {
                  text: "",
                  type: "",
                  image: "",
                  is_selected: element.is_selected,
                  currency: element?.msrv_currency,
                  msrv_currency: element?.msrv_currency,
                  price: element?.service_rate,
                  font_size: element?.font_size,
                  min_character: element?.min_character,
                  max_character: element?.max_character,
                  unique_id: element?.service_unique_id,
                  service_code: element?.service_code,
                  service_name: element?.service_name,
                  service_type: element?.service_type,
                  service_rate: element?.service_rate,
                };
                if (
                  element?.service_code == "ENGRAVING" &&
                  element.service_type === "Special"
                ) {
                  serviceItem.type = isItalicFont ? "italic" : "bold";
                  serviceItem.text =
                    saveEngraving === true ? engravingTexts : "";
                  serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
                }
                if (
                  element?.service_code == "EMBOSSING" &&
                  element.service_type === "Special"
                ) {
                  serviceItem.image = activeImgSave;
                  serviceItem.is_selected =
                    activeImgSave.some((img) => img?.embImage !== "") == true
                      ? "1"
                      : "0";
                }
                otherService.forEach((ele) => {
                  if (ele.service_unique_id == element?.service_unique_id) {
                    serviceItem.is_selected =
                      element.is_selected == true ? "1" : "0";
                  }
                });
                services.push(serviceItem);
              });
              const updatedStepperData = DiyStepersDatas?.map((step, index) => {
                if (step.position === activeStep) {
                  const data = storeSpecDatas;
                  return {
                    ...step,
                    qty: 1,
                    image_urls: data?.images,
                    image_types: data?.image_types,
                    product_name: data?.variant_data?.[0]?.product_name,
                    short_summary: data?.short_summary,
                    item_base_price: data?.final_total_display,
                    currency_base_symbol: data?.currency_symbol,
                    metal_type: metalType,
                    variant_sku: data?.variant_data?.[0]?.product_sku,
                    product_variant: data?.variant_data?.[0]?.product_variant,
                    vertical: data?.variant_data?.[0]?.vertical_short_code,
                    price: calculatePrice(
                      data,
                      selectedOffer,
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    new_price: calculatePrice(
                      data,
                      selectedOffer,
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    old_price: calculatePrice(
                      data,
                      [],
                      saveEngraving,
                      SaveEmbossing,
                      embossingData,
                      serviceData
                    ),
                    currency: data?.currency_symbol,
                    nextStepPosition: activeStep,
                    combination_id: bomDetails?.combination_id,
                    diy_bom_id: bomDetails?.diy_bom_id,
                    variant_unique_id:
                      data?.variant_data?.[0]?.variant_unique_id,
                    item_id: data?.item_id,
                    mi_unique_id: data?.mi_unique_id,
                    group_code: data?.variant_data?.[0]?.item_group,
                    variant_id: data?.variant_data?.[0]?.variant_unique_id,
                    price_type: data?.variant_data?.[0]?.bom_type,
                    store_tax_included_in_price:
                      data?.store_tax_included_in_price,
                    is_engraving: data?.is_engraving,
                    eng_font: isItalicFont ? "italic" : "bold",
                    eng_text: saveEngraving === true ? engravingTexts : "",
                    eng_price: engravingData?.service_rate,
                    eng_currency: engravingData?.msrv_currency,
                    eng_font_size: engravingData?.font_size,
                    eng_max_character: engravingData?.max_character,
                    eng_min_character: engravingData?.min_character,
                    engraving_unique_id: engravingData?.service_unique_id,
                    embossing_unique_id: embossingData?.[0]?.service_unique_id,
                    embossing_json: JSON.stringify(activeImgSave),
                    engravingData: engravingData,
                    saveEngraving: saveEngraving,
                    engravingTexts: engravingTexts,
                    isEngraving: isEngraving,
                    isItalicFont: isItalicFont,
                    engravingText: engravingText,
                    embossingArea: embossingArea,
                    previewImageData: previewImageData,
                    SaveEmbossing: SaveEmbossing,
                    activeImg: activeImg,
                    activeImgSave: activeImgSave,
                    service_json: serviceData.length > 0 ? services : [],
                    offer_code:
                      selectedOffer.length > 0
                        ? isEmpty(selectedOffer[0]?.coupon_code)
                        : "",
                  };
                }
                return step;
              });
              const nextStepPosition = activeStep + 1;
              dispatch(DiyStepersData(updatedStepperData));
              setActiveStep(nextStepPosition);
              dispatch(ActiveStepsDiy(nextStepPosition));
              router.push("/make-your-customization/start-with-a-item", {
                state: {
                  nextStepPosition: nextStepPosition,
                  combination_id: bomDetails?.combination_id,
                  diy_bom_id: bomDetails?.diy_bom_id,
                },
              });
              dispatch(storeSpecData({}));
              setSpecificationData({});
              setProductData({});
              dispatch(storeProdData({}));
              dispatch(storeEmbossingData([]));
              setEmbossingArea([]);
              dispatch(saveEmbossings(false));
              dispatch(previewImageDatas([]));
              dispatch(activeImageData([]));
            } else {
              setToastOpen(true);
              setIsSuccess(false);
              setToastMsg("Please Check Your Configuration!");
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    }
  };

  //Chnage DIY item specification
  const handleOnChangeDiyItem = (data) => {
    setActive(0);
    setActiveStep(data.position);
    dispatch(ActiveStepsDiy(data.position));
    if (data.position === DiyStepersDatas?.length - 1) {
      setTypeViewDiy(true);
    } else {
      setTypeViewDiy(false);
    }
    setOnceUpdated(false);
    router.push(
      `/make-your-customization/start-with-a-item/${changeUrl(
        `${data.product_name + "-" + data.variant_unique_id}`
      )}`,
      undefined,
      { replace: true }
    );
  };

  //make-your-customization price function
  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => {
      const price = parseFloat(extractNumber(item.price));
      const qty = parseFloat(item.qty);
      if (isNaN(price) || isNaN(qty)) {
        return total;
      }
      return total + price * qty;
    }, 0);
  };

  //make-your-customization
  const setStoneModal = (value) => {
    if (complete) {
      handleComplete();
      return;
    }
    if (value != "") {
      callingJewel = "true";
    }
    paramsItem = "DIY";
    setparamsItem("DIY");
    setClarityWithColor("");
    setShapeStoneActive({});
    setDIYClarityDataList([]);
    setStoneActive({});
    setDIYClarityDataList([]);
    setDIYShapesDataList([]);
    setDIYSizeDataList([]);
    setSizeStoneActive({});
    const obj = {
      a: "getDIYCombinationList",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      variant_id: storeVariantId,
      item_id: itemId,
      metal_type: metalType,
      SITDeveloper: 1,
      shape: selectedShape,
    };
    Commanservice.postApi("/UniversalSearch2", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const StoneName = res.data.data;
          if (StoneName.length > 0) {
            setStonesNo(res.data.data[0]["no_of_stone"]);
            if (selectedShape != "") {
              if (res.data.data.length == 1) {
                if (router.pathname.includes("/start-with-a-setting")) {
                  setStoneTypeArr(StoneName);
                  setShowStoneModal(true);
                } else {
                  var s = {
                    combination_id: res.data.data[0]["combination_id"],
                    shape_code: selectedShape,
                    diy_bom_id: res.data.data[0]["diy_bom_id"],
                  };
                  verticalCode = res.data.data[0]["vertical_code"];
                  setVerticalCode(res.data.data[0]["vertical_code"]);
                  DIYSizeData(s);
                }
              } else {
                setStoneTypeArr(StoneName);
                setShowStoneModal(true);
              }
            } else {
              setStoneTypeArr(StoneName);
              setShowStoneModal(true);
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg("Please Check Configuration");
          }
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
        }
      })
      .catch(() => {});
  };

  const selectDiamond = (e) => {
    setIsStone(true);
    verticalCode = e.vertical_code;
    setVerticalCode(e.vertical_code);
    if (e.no_of_stone === "1") {
      const getDIYShapeObj = {
        a: "getDIYCombinationShape",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        SITDeveloper: 1,
        combination_id: e.combination_id,
        vertical_code: e.vertical_code,
      };
      Commanservice.postApi("/UniversalSearch2", getDIYShapeObj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.length > 0) {
              if (res.data.data.length == 1) {
                DIYSizeData(res.data.data[0]);
                setShapeStoneActive(res.data.data[0]);
              } else {
                setDIYShapesDataList(res.data.data);
              }
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    } else {
      clarityColorData(e, "");
    }
  };

  const DIYSizeData = (e) => {
    const obj = {
      a: "getDIYCombinationSize",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      combination_id: e.combination_id,
      shape: e.shape_code,
      SITDeveloper: 1,
    };
    Commanservice.postApi("/UniversalSearch2", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (res.data.data.length > 0) {
            if (res.data.data.length == 1) {
              clarityColorData(e, res.data.data[0]);
            } else {
              setDIYSizeDataList(res.data.data);
            }
          }
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
        }
      })
      .catch(() => {});
  };

  const clarityColorData = (e, sizeData) => {
    const clarityColorObj = {
      a: "getDIYCombinationClarityColor",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      diy_bom_id: e.diy_bom_id,
      SITDeveloper: 1,
      variant_id: storeVariantId,
      item_id: itemId,
      combination_id: e.combination_id,
      shape: e.shape_code ? e.shape_code : "",
      size: sizeData !== undefined ? sizeData.size : "",
      color: isEmpty(selectedColor),
      vertical_code: isEmpty(verticalCode),
    };
    setClarityColorObj(clarityColorObj);
    var diy_bom_id = e.diy_bom_id;
    Commanservice.postApi("/UniversalSearch2", clarityColorObj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          const arr = [...canBeSetData];
          if (data.length == 0) {
            if (arr.length > 0) {
              arr.map((e) => {
                e.clarity = [];
                e.color = [];
                return e;
              });
              setCanBeSetData(arr);
            }
            e.pv_unique_id = storeVariantId;
            e.diy_bom_id = diy_bom_id;
            newCanbeSetData(e);
          }
          if (data.length > 0) {
            if (data.length === 1 && data[0]["details"].length === 1) {
              if (arr.length > 0) {
                arr.map((e) => {
                  e.clarity = data[0].clarity;
                  e.color = data[0].color;
                  return e;
                });
                setCanBeSetData(arr);
              }
              e.pv_unique_id = data[0]["details"][0].pv_unique_id;
              e.diy_bom_id = diy_bom_id;
              newCanbeSetData(e);
            } else {
              for (let c = 0; c < data.length; c++) {
                var details = data[c]["details"];
                for (let d = 0; d < details.length; d++) {
                  details[d]["diy_bom_id"] = diy_bom_id;
                }
              }
              setDIYClarityDataList(data);
            }
          }
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
        }
      })
      .catch(() => {});
  };

  const applyClarityFilter = (e, clarityData) => {
    const arr = [...canBeSetData];
    if (arr.length > 0) {
      arr.map((a) => {
        a.clarity = clarityData.clarity;
        a.color = e.color;
        return a;
      });
      setCanBeSetData(arr);
    }
    newCanbeSetData(e, clarityData);
  };

  const newCanbeSetData = (e, clarityData) => {
    if (
      !router.pathname.includes("/start-with-a-diamond") &&
      e.pv_unique_id !== storeVariantId &&
      verticalCode != "GEDIA"
    ) {
      const objFilter = {
        a: "getDynamicSearchParameter",
        product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
        SITDeveloper: "1",
        tenant_id: storeEntityIds.tenant_id,
        param: "[]",
        diamond_params: router.pathname.includes("start-with-a-diamond")
          ? JSON.stringify({
              shape: addedDiamondDatas?.st_shape,
              from_length: addedDiamondDatas?.st_length,
              from_width: addedDiamondDatas?.st_width,
              from_depth: addedDiamondDatas?.st_depth,
            })
          : "[]",
        variant_id: e.pv_unique_id,
        item_id: itemId,
        src: "metal",
        secret_key: storeEntityIds.secret_key,
        calling: "1",
        default_variant_id: e.pv_unique_id,
        is_customize: "1",
        is_dc: "1",
        is_smc: "0",
        stone_shape: "",
      };
      dynamicSearchParameter(objFilter, false);
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: e.combination_id,
        diy_bom_id:
          clarityData !== undefined ? clarityData.diy_bom_id : e.diy_bom_id,
        SITDeveloper: 1,
        variant_id:
          e.pv_unique_id === undefined ? storeVariantId : e.pv_unique_id,
        item_id: itemId,
      };
      Commanservice.postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data = res.data.data;
            if (data.length > 0) {
              for (let c = 0; c < data.length; c++) {
                data[c]["no_of_stone_array"] = [];
                var color = data[c]["details"]["shape"][0]["color"];
                var clarity = data[c]["details"]["shape"][0]["clarity"];
                var final_color = [];
                var final_clarity = [];
                if (color == undefined || color == null) {
                  color = [];
                }
                if (clarity == undefined || clarity == null) {
                  clarity = [];
                }
                if (color.length != 0 && color.includes("-")) {
                  final_color = color.split("-");
                } else {
                  final_color.push(color);
                }
                if (clarity.length != 0 && clarity.includes("-")) {
                  final_clarity = clarity.split("-");
                } else {
                  final_clarity.push(clarity);
                }
                data[c]["color"] = final_color;
                data[c]["clarity"] = final_clarity;
                data[c]["diy_bom_id"] = e.diy_bom_id;
                data[c]["combination_id"] = e.combination_id;
                data[c]["shape"] = data[c]["details"]["shape"];
                data[c]["set_stone"] = "0";
                data[c]["stone_size"] =
                  data[c]["details"][data[c]["shape"][0]["key"]];
                data[c]["vertical_code"] = data[c]["stone_type_arr"][0]["code"];
                data[c]["pv_unique_id"] = e.pv_unique_id;
                var array = [];
                for (let k = 1; k <= Number(data[c]["no_of_stone"]); k++) {
                  array.push({ sequence: k, set_stone: 0 });
                }
                data[c]["no_of_stone_array"] = array;
                data[c]["group_by"] = true;
                data[c]["showing_group"] = true;
                if (
                  data[c].vertical_code == "DIAMO" ||
                  data[c].vertical_code == "GEDIA" ||
                  data[c].vertical_code == "LGDIA"
                ) {
                  data[c]["group_by"] = false;
                  data[c]["showing_group"] = false;
                }
              }
              setFinalCanBeSet(data);
              dispatch(finalCanBeSetData(data));
              setStoneCanBeSetArr(data);
              if (isEmpty(stonesNo) == 1) {
                addStone(data[0], { sequence: 1, set_stone: 0 });
              }
              setShowStoneModal(false);
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    } else {
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: e.combination_id,
        diy_bom_id: router.pathname.includes("/start-with-a-diamond")
          ? specificationData.diy_bom_id
          : clarityData !== undefined
          ? clarityData.diy_bom_id
          : e.diy_bom_id,
        SITDeveloper: 1,
        variant_id:
          e.pv_unique_id === undefined ? storeVariantId : e.pv_unique_id,
        item_id: itemId,
      };
      Commanservice.postApi("/UniversalSearch2", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const data = res.data.data;
            if (data.length > 0) {
              for (let c = 0; c < data.length; c++) {
                data[c]["no_of_stone_array"] = [];
                var color = data[c]["details"]["shape"][0]["color"];
                var clarity = data[c]["details"]["shape"][0]["clarity"];
                var final_color = [];
                var final_clarity = [];
                if (color == undefined || color == null) {
                  color = [];
                }
                if (clarity == undefined || clarity == null) {
                  clarity = [];
                }
                if (color.length != 0 && color.includes("-")) {
                  final_color = color.split("-");
                } else {
                  final_color.push(color);
                }
                if (clarity.length != 0 && clarity.includes("-")) {
                  final_clarity = clarity.split("-");
                } else {
                  final_clarity.push(clarity);
                }
                data[c]["color"] = final_color;
                data[c]["clarity"] = final_clarity;
                data[c]["diy_bom_id"] = e.diy_bom_id;
                data[c]["combination_id"] = e.combination_id;
                data[c]["shape"] = data[c]["details"]["shape"];
                data[c]["set_stone"] = "0";
                data[c]["stone_size"] =
                  data[c]["details"][data[c]["shape"][0]["key"]];
                data[c]["vertical_code"] = data[c]["stone_type_arr"][0]["code"];
                data[c]["pv_unique_id"] = e.pv_unique_id;
                var array = [];
                for (let k = 1; k <= Number(data[c]["no_of_stone"]); k++) {
                  array.push({ sequence: k, set_stone: 0 });
                }
                data[c]["no_of_stone_array"] = array;
                data[c]["group_by"] = true;
                data[c]["showing_group"] = true;
                if (
                  data[c].vertical_code == "DIAMO" ||
                  data[c].vertical_code == "GEDIA" ||
                  data[c].vertical_code == "LGDIA"
                ) {
                  data[c]["group_by"] = false;
                  data[c]["showing_group"] = false;
                }
              }
              setFinalCanBeSet(data);
              dispatch(finalCanBeSetData(data));
              setStoneCanBeSetArr(data);
              if (isEmpty(stonesNo) == 1) {
                addStone(data[0], { sequence: 1, set_stone: 0 });
              }
              setShowStoneModal(false);
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    }
  };

  const parentBack = () => {
    if (router.pathname.includes("/start-with-diamond") && props.backToList) {
      props.backToList();
    } else {
      var count = 0;
      for (let c = 0; c < finalCanBeSet.length; c++) {
        if (
          isEmpty(finalCanBeSet[c]["no_of_stone_array"][0].set_stone) == "1"
        ) {
          count++;
        }
      }
      if (count == 0) {
        setFinalCanBeSet([]);
      }
    }
    setVerticalCode("");
    setViewType("jewelery");
    dispatch(activeDIYtabs("Jewellery"));
  };

  const setStone = (childData) => {
    setListandToggle(true);
    setVerticalCode("");
    setViewType("jewelery");
    if (callFirstTime === true) {
      const obj = {
        a: "getDIYCanBeSetData",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        combination_id: childData.combination_id,
        diy_bom_id: childData.diy_bom_id,
        SITDeveloper: 1,
        variant_id: childData.pv_unique_id,
        item_id: itemId,
      };
      Commanservice.postApi("/UniversalSearch2", obj).then((res) => {
        if (res.data.success === 1) {
          setCallFirstTime(false);
          const data = res.data.data;
          var canbeset = [...finalCanBeSet];
          for (let c = 0; c < data.length; c++) {
            for (let i = 0; i < canbeset.length; i++) {
              if (canbeset[i].stone_position === data[c].stone_position) {
                canbeset[i]["details"] = data[c]["details"];
                canbeset[i]["stone_size"] =
                  data[c]["details"][canbeset[i]["shape"][0]["key"]];
                canbeset[i]["combination_id"] = childData.combination_id;
                setCanBeSet(childData);
              }
            }
          }
          setFinalCanBeSet([...canbeset]);
          dispatch(finalCanBeSetData([...canbeset]));
          setStoneCanBeSetArr([...canbeset]);
          setIsStoneSelected(false);
        }
      });
      if (childData.vertical_code == "GEDIA") {
        var sub_data = childData.no_of_stone_array;
        for (let c = 0; c < sub_data.length; c++) {
          if (sub_data[c].set_stone == 1) {
            let claobj = {
              ...clarityColorObj,
              color: sub_data[c].stone_arr["st_col"],
            };
            setselectedColor(sub_data[c].stone_arr["st_col"]);
            Commanservice.postApi("/UniversalSearch2", claobj).then((res) => {
              if (res.data.success === 1) {
                const objFilter = {
                  a: "getDynamicSearchParameter",
                  product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
                  SITDeveloper: "1",
                  tenant_id: storeEntityIds.tenant_id,
                  param: "[]",
                  diamond_params: router.pathname.includes(
                    "start-with-a-diamond"
                  )
                    ? JSON.stringify({
                        shape: addedDiamondDatas?.st_shape,
                        from_length: addedDiamondDatas?.st_length,
                        from_width: addedDiamondDatas?.st_width,
                        from_depth: addedDiamondDatas?.st_depth,
                      })
                    : "[]",
                  variant_id: res.data.data[0].details[0].pv_unique_id,
                  item_id: itemId,
                  src: "metal",
                  secret_key: storeEntityIds.secret_key,
                  calling: "1",
                  default_variant_id: res.data.data[0].details[0].pv_unique_id,
                  is_customize: "1",
                  is_dc: "1",
                  is_smc: "0",
                  stone_shape: "",
                };
                dynamicSearchParameter(objFilter, false);
              }
            });
          }
        }
      }
    } else {
      setCanBeSet(childData);
      setIsStoneSelected(false);
    }
  };

  const setCanBeSet = (event) => {
    var total_stone_counter = 0;
    var match_stone_counter = 0;
    var multiple_stone_counter = 0;
    var canbeset = [...finalCanBeSet];
    let certNo = "";
    for (let i = 0; i < canbeset.length; i++) {
      if (event.stone_position == "CENTER") {
        if (
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] ==
            "DIAMO" ||
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] ==
            "GEDIA" ||
          event["no_of_stone_array"][0]["stone_arr"]["st_short_code"] == "LGDIA"
        ) {
          var data = [];
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["st_is_video"]
            ) != ""
          ) {
            if (
              isEmpty(
                event["no_of_stone_array"][0]["stone_arr"]["st_is_video"]
              ).includes("mp4") == true
            ) {
              data.push({
                type: "video",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_video"],
                view: video,
              });
            } else {
              data.push({
                type: "video",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_video"],
                view: video,
                iframe: true,
              });
            }
          }
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"]
            ) != ""
          ) {
            data.push({
              type: "image",
              src: event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"],
              view: event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"],
            });
          }
          if (
            isEmpty(
              event["no_of_stone_array"][0]["stone_arr"]["display_image"]
            ) != ""
          ) {
            data.push({
              type: "v_image",
              src: event["no_of_stone_array"][0]["stone_arr"]["display_image"],
              view: event["no_of_stone_array"][0]["stone_arr"]["display_image"],
              length: event["no_of_stone_array"][0]["stone_arr"]["st_length"],
              width: event["no_of_stone_array"][0]["stone_arr"]["st_width"],
            });
          }
          if (
            isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"]) !=
            ""
          ) {
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "GIA"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: GIA,
              });
            }
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "HRD"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: HRD,
              });
            }
            if (
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_lab"]) ==
              "IGI"
            ) {
              data.push({
                type: "cert",
                src: event["no_of_stone_array"][0]["stone_arr"]["st_is_cert"],
                view: IGI,
              });
            }
          }
          dispatch(
            diamondDIYName(
              isEmpty(
                event["no_of_stone_array"][0]["stone_arr"]["product_name"]
              )
            )
          );
          dispatch(
            diamondDIYimage(
              isEmpty(event["no_of_stone_array"][0]["stone_arr"]["st_is_photo"])
            )
          );
          setDiamondArrayImage(data);
        }
        if (i === 0) {
          setFinalStoneArr([...canbeset]);
        }
      }
      total_stone_counter += Number(canbeset[i]["no_of_stone"]);
      if (canbeset[i]["no_of_stone_array"].length != 0) {
        var position_wise_price = 0;
        for (let k = 0; k < canbeset[i]["no_of_stone_array"].length; k++) {
          if (canbeset[i]["no_of_stone_array"][k]["set_stone"] == 1) {
            position_wise_price += Number(
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["ex_store_price"]
            );
            match_stone_counter++;
            multiple_stone_counter += Number(
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["ex_store_price"]
            );
            if (event.group_by == true) {
              canbeset[i]["set_stone"] = 1;
            }
            certNo =
              canbeset[i]["no_of_stone_array"][k]["stone_arr"]["st_stock_id"];
          }
        }
        canbeset[i]["position_wise_price"] = position_wise_price.toFixed(2);
      }
    }
    setFinalCanBeSet([...canbeset]);
    dispatch(finalCanBeSetData([...canbeset]));
    setStoneCanBeSetArr([...canbeset]);
    setCertificateNumber(certNo);
    if (total_stone_counter == match_stone_counter) {
      setViewType("review");
      dispatch(activeDIYtabs("Complete"));
      window.scrollTo(0, 0);
      setIsStoneSelected(true);
      setTimeout(() => {
        setStonePrice(multiple_stone_counter);
        setSalesTotalPrice(
          Number(
            Number(multiple_stone_counter) +
              Number(specificationData.final_total)
          ).toFixed(2)
        );
      }, 100);
    } else {
      setStonePrice(multiple_stone_counter);
      setSalesTotalPrice(
        Number(
          Number(multiple_stone_counter) + Number(specificationData.final_total)
        ).toFixed(2)
      );
    }
  };

  const handleSetCanBeSet = () => {
    const data = finalCanBeSetDatas;
    const stoneArr = data[0]?.no_of_stone_array;
    if (stoneArr && stoneArr.length > 0) {
      if (!stoneArr[0].stone_arr) {
        stoneArr[0].stone_arr = {};
      }
      stoneArr[0].stone_arr = addedDiamondDatas;
      setFinalCanBeSet(data);
      dispatch(finalCanBeSetData(data));
    }
  };

  useEffect(() => {
    if (
      router.pathname.includes("/start-with-a-diamond") &&
      finalCanBeSetDatas
    ) {
      handleSetCanBeSet();
    } else {
    }
  }, [finalCanBeSet]);

  const addStone = (c, item) => {
    if (router.pathname.includes("/start-with-a-diamond")) {
      diamondStepFirst();
    } else {
      if (item != "") {
        c["no_of_stone_sequence"] = item.sequence;
        setStoneElement(c);
      } else {
        c["no_of_stone_sequence"] = "1";
        setStoneElement(c);
      }
      setViewType("diamond");
      setVerticalCode(c.vertical_code);
    }
  };

  const editStoneMultiple = (c, item, index) => {
    if (router.pathname.includes("/start-with-a-diamond")) {
      diamondStepFirst();
    } else {
      if (typeof c === "object" && index !== undefined) {
        if (c["no_of_stone_array"]) {
          if (c["no_of_stone_array"][index]) {
            if (
              typeof c["no_of_stone_array"][index]["stone_arr"] === "object"
            ) {
              handleSetStone(c["no_of_stone_array"][index]["stone_arr"]);
            }
          }
        }
      }
      if (item != "") {
        c["no_of_stone_sequence"] = item.sequence;
        setStoneElement(c);
      } else {
        c["no_of_stone_sequence"] = "1";
        setStoneElement(c);
      }
      setViewType("diamond");
      setVerticalCode(c.vertical_code);
    }
  };

  const removeStoneMultiple = (element, index, main_index) => {
    var canbeset = [...finalCanBeSet];
    if (element.group_by == false) {
      if (index.toString() != "") {
        element["no_of_stone_array"][index]["st_stock_id"] = "";
        element["no_of_stone_array"][index]["st_shape"] = "";
        element["no_of_stone_array"][index]["stone_arr"] = [];
        element["no_of_stone_array"][index]["set_stone"] = 0;
        element["no_of_stone_array"][index]["vertical_code"] = "";
        canbeset[main_index] = element;
      } else {
        for (let c = 0; c < element["no_of_stone_array"].length; c++) {
          element["no_of_stone_array"][c]["st_stock_id"] = "";
          element["no_of_stone_array"][c]["st_shape"] = "";
          element["no_of_stone_array"][c]["stone_arr"] = [];
          element["no_of_stone_array"][c]["set_stone"] = 0;
          element["no_of_stone_array"][c]["vertical_code"] = "";
          canbeset[main_index] = element;
        }
      }
      if (
        router.pathname.includes("/start-with-a-setting") &&
        element["stone_position"] == "CENTER"
      ) {
        if (storeSelectedDiamondDatas.every((item) => item?.set_stone === 0)) {
          dispatch(diamondDIYName(""));
          dispatch(diamondDIYimage(""));
        }
      } else {
        dispatch(diamondDIYName(""));
        dispatch(diamondDIYimage(""));
      }
    } else {
      element["st_stock_id"] = "";
      element["st_shape"] = "";
      element["stone_arr"] = [];
      element["set_stone"] = 0;
      canbeset[main_index] = element;
      if (index.toString() == "") {
        for (let c = 0; c < element["no_of_stone_array"].length; c++) {
          element["no_of_stone_array"][c]["st_stock_id"] = "";
          element["no_of_stone_array"][c]["st_shape"] = "";
          element["no_of_stone_array"][c]["stone_arr"] = [];
          element["no_of_stone_array"][c]["set_stone"] = 0;
          element["no_of_stone_array"][c]["vertical_code"] = "";
          canbeset[main_index] = element;
        }
      }
      if (element["stone_position"] == "CENTER") {
        dispatch(diamondDIYName(""));
        dispatch(diamondDIYimage(""));
      }
    }
    setFinalCanBeSet([...canbeset]);
    dispatch(finalCanBeSetData([...canbeset]));
    setStoneCanBeSetArr(canbeset);
    setCanBeSet(canbeset);
    handleSetStone(canbeset);
    setIsStoneSelected(true);
    dispatch(diamondNumber(""));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondNumber(""));
    if (router.pathname.includes("/start-with-a-diamond")) {
      setSelectedDiamond({});
      setIsDiamondSelected(false);
      dispatch(IsSelectedDiamond(false));
    }
  };

  const handleCouponApply = (offer, index) => {
    const isAlreadyApplied = selectedOffer.some(
      (item) => item?.coupon_code === offer?.coupon_code
    );
    if (!isAlreadyApplied) {
      setSelectedOffer([offer]);
    }
  };

  const handleAppliedCode = (offer, index) => {
    setSelectedOffer((prev) =>
      prev.filter((item) => item.coupon_code !== offer.coupon_code)
    );
  };

  const addToCart = () => {
    if (engravingTexts.length) {
      if (engravingTexts.length < parseInt(specificationData.min_character)) {
        setToastOpen(true);
        setIsSuccess(false);
        setToastMsg(
          `Please Enter minimum ${specificationData.min_character} character`
        );
        return;
      }
    }
    dispatch(storeForgotVar(false));
    const services = [];
    serviceData.forEach((element) => {
      const serviceItem = {
        text: "",
        type: "",
        image: "",
        is_selected: element.is_selected,
        currency: element?.msrv_currency,
        price: element?.service_rate,
        font_size: element?.font_size,
        min_character: element?.min_character,
        max_character: element?.max_character,
        unique_id: element?.service_unique_id,
        service_code: element?.service_code,
        service_name: element?.service_name,
        service_type: element?.service_type,
      };
      if (
        element?.service_code == "ENGRAVING" &&
        element.service_type === "Special"
      ) {
        serviceItem.type = isItalicFont ? "italic" : "bold";
        serviceItem.text = saveEngraving === true ? engravingTexts : "";
        serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
      }
      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = activeImgSave;
        serviceItem.is_selected =
          activeImgSave.some((img) => img?.embImage !== "") == true ? "1" : "0";
      }
      otherService.forEach((ele) => {
        if (ele.service_unique_id == element?.service_unique_id) {
          serviceItem.is_selected = element.is_selected == true ? "1" : "0";
        }
      });
      services.push(serviceItem);
    });

    const saveData = {
      JEWEL: [
        {
          campaign_id:
            params?.productKey == "campaign" ? isEmpty(params?.value) : "",
          mi_unique_id: specificationData.variant_data[0].mi_unique_id,
          price_type: specificationData.variant_data[0].bom_type,
          item_id: itemId,
          variant_id: storeVariantId,
          vertical_code: specificationData.variant_data[0].vertical_short_code,
          group_code: specificationData.variant_data?.[0]?.item_group,
          qty: 1,
          product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
          product_title:
            isEmpty(params?.value) !== ""
              ? firstWordCapital(params?.value.split("-").join(" "))
              : "",
          product_name:
            isEmpty(specificationData.variant_data) !== "" &&
            isEmpty(specificationData.variant_data[0].product_name) !== ""
              ? specificationData.variant_data[0].product_name
              : "",
          variant_sku:
            isEmpty(specificationData.variant_data) !== "" &&
            isEmpty(specificationData.variant_data[0].product_sku) !== ""
              ? specificationData.variant_data[0].product_sku
              : "",
          product_variant:
            isEmpty(specificationData.variant_data) !== "" &&
            isEmpty(specificationData.variant_data[0].product_variant) !== ""
              ? specificationData.variant_data[0].product_variant
              : "",
          product_type:
            isEmpty(specificationData.variant_data) !== "" &&
            isEmpty(
              specificationData.variant_data[0].mi_jewellery_product_type
            ) !== ""
              ? specificationData.variant_data[0].mi_jewellery_product_type
              : "",
          short_summary: specificationData["short_summary"],
          item_base_price: specificationData.base_final_total,
          currency_base_symbol: specificationData.base_currency_symbol,
          metal_type: metalType,
          service_json: serviceData.length > 0 ? services : [],
          offer_code:
            selectedOffer?.length > 0 && selectedOffer?.[0]?.coupon_code
              ? selectedOffer?.[0]?.coupon_code
              : "",
        },
      ],
      DIAMO: router.pathname.includes("start-with-a-diamond")
        ? [
            {
              id: addedDiamondDatas?.st_cert_no,
              vertical_code: addedDiamondDatas?.st_short_code,
              group_code: addedDiamondDatas?.mi_item_group,
              qty: 1,
              stone_position: canBeSets?.[0]?.stone_position,
              sequence: canBeSets?.[0]?.stone_sequence,
              currency_base_symbol: addedDiamondDatas?.currency_code,
            },
          ]
        : [],
    };

    const obj = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(saveData),
      unique_id: "",
    };

    Commanservice.postLaravelApi("/CartMaster", obj).then((res) => {
      if (res.data.success === 1) {
        setToastOpen(true);
        setIsSuccess(true);
        setToastMsg(res.data.message);
        dispatch(storeEmbossingData([]));
        dispatch(saveEmbossings(false));
        dispatch(previewImageDatas([]));
        dispatch(activeImageData([]));
        router.push("/cart");
        favouriteCount(specificationData);
        dispatch(
          addEngravingAction({
            eng_font: isItalicFont ? "italic" : "bold",
            eng_text: engravingTexts,
            eng_price: engravingData?.service_rate,
            eng_currency: engravingData?.msrv_currency,
            eng_font_size: engravingData?.font_size,
            eng_max_character: engravingData?.max_character,
            eng_min_character: engravingData?.min_character,
          })
        );
      } else {
        setToastOpen(true);
        setIsSuccess(false);
        setToastMsg(res.data.message);
      }
    });
  };

  const addToCartDIY = () => {
    dispatch(storeForgotVar(false));
    var Jsons = DiyStepersDatas;
    if (Jsons) {
      var detail_json = Jsons;
      var JEWEL_Data = [];
      for (let i = 0; i < detail_json.length - 1; i++) {
        JEWEL_Data.push({
          product_diy: paramsItem,
          price_type: detail_json[i]["price_type"],
          item_id: detail_json[i]["item_id"],
          variant_id: detail_json[i]["variant_id"],
          mi_unique_id: detail_json[i]["mi_unique_id"],
          vertical_code: detail_json[i]["vertical"],
          group_code: detail_json[i]["group_code"],
          qty: detail_json[i]["qty"],
          ref_id: new Date().getTime(),
          cart_id: detail_json?.[i]?.["cart_id"],
          product_title: detail_json?.[i]?.["product_title"],
          product_name: detail_json?.[i]?.["product_name"],
          variant_sku: detail_json?.[i]?.["variant_sku"],
          product_variant: detail_json?.[i]?.["product_variant"],
          product_type: detail_json?.[i]?.["product_type"],
          short_summary: detail_json?.[i]?.["short_summary"],
          item_base_price: detail_json?.[i]?.["item_base_price"],
          currency_base_symbol: detail_json?.[i]?.["currency_base_symbol"],
          metal_type: detail_json?.[i]?.["metal_type"],
          service_json: detail_json[i]["service_json"],
          display_name: detail_json[i]["display_name"],
          combination_id: detail_json[i]["combination_id"],
          diy_bom_id: detail_json[i]["diy_bom_id"],
          position: detail_json[i]["position"],
          images: detail_json[i]["images"],
          offer_code: detail_json[i]["offer_code"],
        });
      }
    }

    const services = [];
    serviceData.forEach((element) => {
      const serviceItem = {
        text: "",
        type: "",
        image: "",
        is_selected: element.is_selected,
        currency: element?.msrv_currency,
        price: element?.service_rate,
        font_size: element?.font_size,
        min_character: element?.min_character,
        max_character: element?.max_character,
        unique_id: element?.service_unique_id,
        service_code: element?.service_code,
        service_name: element?.service_name,
        service_type: element?.service_type,
      };
      if (
        element?.service_code == "ENGRAVING" &&
        element.service_type === "Special"
      ) {
        serviceItem.type = isItalicFont ? "italic" : "bold";
        serviceItem.text = saveEngraving === true ? engravingTexts : "";
        serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
      }
      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = activeImgSave;
        serviceItem.is_selected =
          activeImgSave.some((img) => img?.embImage !== "") == true ? "1" : "0";
      }
      otherService.forEach((ele) => {
        if (ele.service_unique_id == element?.service_unique_id) {
          serviceItem.is_selected = element.is_selected == true ? "1" : "0";
        }
      });
      services.push(serviceItem);
    });

    var JEWEL = isItemDIY
      ? JEWEL_Data
      : [
          {
            mi_unique_id: specificationData.variant_data[0].mi_unique_id,
            price_type: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.bom_type
              : specificationData.bom_type,
            item_id: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.item_id
              : itemId,
            variant_id: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.variant_data[0].variant_unique_id
              : storeVariantId,
            vertical_code: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.variant_data[0].vertical_short_code
              : specificationData.variant_data[0].vertical_short_code,
            group_code: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.variant_data[0].item_group
              : specificationData.variant_data[0].item_group,
            qty: 1,
            product_diy: paramsItem,
            product_title:
              isEmpty(params?.value) !== ""
                ? firstWordCapital(params?.value.split("-").join(" "))
                : "",
            product_name: router.pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data[0].product_name)
              : isEmpty(specificationData.variant_data[0].product_name),
            variant_sku: router.pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(storeSpecDatas.variant_data[0].product_sku) !== ""
                ? storeSpecDatas.variant_data[0].product_sku
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(specificationData.variant_data[0].product_sku) !== ""
              ? specificationData.variant_data[0].product_sku
              : "",
            product_variant: router.pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(storeSpecDatas.variant_data[0].product_variant) !== ""
                ? storeSpecDatas.variant_data[0].product_variant
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(specificationData.variant_data[0].product_variant) !==
                  ""
              ? specificationData.variant_data[0].product_variant
              : "",
            product_type: router.pathname.includes("/start-with-a-setting")
              ? isEmpty(storeSpecDatas.variant_data) !== "" &&
                isEmpty(
                  storeSpecDatas.variant_data[0].mi_jewellery_product_type
                ) !== ""
                ? storeSpecDatas.variant_data[0].mi_jewellery_product_type
                : ""
              : isEmpty(specificationData.variant_data) !== "" &&
                isEmpty(
                  specificationData.variant_data[0].mi_jewellery_product_type
                ) !== ""
              ? specificationData.variant_data[0].mi_jewellery_product_type
              : "",
            short_summary: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas["short_summary"]
              : specificationData["short_summary"],
            item_base_price: router.pathname.includes("/start-with-a-setting")
              ? storeSpecDatas.base_final_total
              : specificationData.base_final_total,
            currency_base_symbol: router.pathname.includes(
              "/start-with-a-setting"
            )
              ? storeSpecDatas.base_currency_symbol
              : specificationData.base_currency_symbol,
            metal_type: metalType,
            service_json: serviceData.length > 0 ? services : [],
            offer_code:
              selectedOffer?.length > 0 && selectedOffer?.[0]?.coupon_code
                ? selectedOffer?.[0]?.coupon_code
                : "",
          },
        ];

    var DIAMO = [];
    var LDIAM = [];
    for (let c = 0; c < finalCanBeSet.length; c++) {
      var data = finalCanBeSet[c]["no_of_stone_array"];
      for (let d = 0; d < data.length; d++) {
        if (
          data[d].vertical_code === "DIAMO" ||
          data[d].vertical_code === "GEDIA" ||
          data[d].vertical_code === "LGDIA"
        ) {
          var diamo_data = "";
          diamo_data = {
            id: data[d]["stone_arr"].st_cert_no,
            vertical_code: data[d].vertical_code,
            item_id: data[d]["stone_arr"].item_id,
            group_code: data[d]["stone_arr"].mi_item_group,
            qty: 1,
            stone_position: finalCanBeSet[c]["stone_position"],
            sequence: data[d]["sequence"],
            item_base_price: data[d]["stone_arr"].base_currency_price,
            currency_base_symbol: data[d]["stone_arr"].currency_code,
          };
          DIAMO.push(diamo_data);
        } else {
          if (
            data[d].vertical_code === "LDIAM" ||
            data[d].vertical_code === "GEMST"
          ) {
            var ldiam_data = "";
            ldiam_data = {
              item_id: data[d]["stone_arr"].item_id,
              variant_id: data[d]["stone_arr"].unique_id,
              vertical_code: data[d].vertical_code,
              group_code: data[d]["stone_arr"].item_group,
              qty: 1,
              stone_position: finalCanBeSet[c]["stone_position"],
              sequence: data[d]["sequence"],
            };
            LDIAM.push(ldiam_data);
          }
        }
      }
    }

    var json_data = {
      JEWEL: JEWEL,
      DIAMO: DIAMO,
      LDIAM: LDIAM,
    };

    const obj = {
      a: "saveCart",
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      currency: storeCurrencys,
      current_user: isLogin ? loginDatas.member_id : RandomId,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      store_id: storeEntityIds.mini_program_id,
      json_data: JSON.stringify(json_data),
      unique_id: "",
    };

    Commanservice.postLaravelApi("/CartMaster", obj).then((res) => {
      if (res.data.success === 1) {
        setToastOpen(true);
        setIsSuccess(true);
        setToastMsg(res.data.message);
        dispatch(storeEmbossingData([]));
        dispatch(saveEmbossings(false));
        dispatch(previewImageDatas([]));
        dispatch(activeImageData([]));
        dispatch(DiyStepersData([]));
        dispatch(ActiveStepsDiy(0));
        sessionStorage.removeItem("DIYVertical");
        router.push("/cart");
        favouriteCount(specificationData);
      } else {
        setToastOpen(true);
        setIsSuccess(false);
        setToastMsg(res.data.message);
      }
    });
  };

  const groupByStone = (element) => {
    const canbesetArr = [...finalCanBeSet];
    for (let i = 0; i < canbesetArr.length; i++) {
      if (canbesetArr[i]["stone_position"] == element["stone_position"]) {
        removeStoneMultiple(canbesetArr[i], "", i);
        canbesetArr[i]["group_by"] = !canbesetArr[i]["group_by"];
      }
    }
    setFinalCanBeSet(canbesetArr);
    dispatch(finalCanBeSetData(canbesetArr));
    setStoneCanBeSetArr(canbesetArr);
  };

  const go_to_review = () => {
    setViewType("review");
  };

  const go_to_diamond = () => {
    for (let i = 0; i < finalCanBeSet.length; i++) {
      if (finalCanBeSet[i].stone_position == "CENTER") {
        if (
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "DIAMO" ||
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "LGDIA" ||
          finalCanBeSet[i]["no_of_stone_array"][0]["stone_arr"][
            "st_short_code"
          ] == "GEDIA"
        ) {
          editStoneMultiple(
            finalCanBeSet[i],
            finalCanBeSet[i]["no_of_stone_array"][0]
          );
        }
      }
    }
  };

  const initiallyRenderFunction = useCallback(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      if (!onceUpdated) {
        let arr = [];
        for (let i = 0; i < Number(3); i++) {
          arr.push(i);
        }
        setOnceUpdated(true);
      }
    }
  }, [storeEntityIds, onceUpdated]);

  useEffect(() => {
    initiallyRenderFunction();
  }, [initiallyRenderFunction]);

  //Favourite
  const addDeleteFavourite = (e, event, liked) => {
    event.preventDefault();
    event.stopPropagation();
    if (!favStopClick) {
      setFavStopClick(true);
      setFavLoader({ ...favLoader, [e.item_id]: true });
      const paramsJewel = {
        JEWEL: [
          {
            vertical_code: e.variant_data[0]?.mi_product_vertical,
            group_code: e.variant_data[0]?.mi_item_group,
            qty: 1,
            price_type: e.variant_data[0]?.bom_type,
            item_id: e.item_id,
            variant_id: storeVariantId,
            product_diy: paramsItem === "DIY" ? "DIY" : "PRODUCT",
            product_title:
              isEmpty(params?.value) !== ""
                ? firstWordCapital(params?.value.split("-").join(" "))
                : "",
            product_name: isEmpty(e?.variant_data[0]?.product_name),
            mi_unique_id: e.mi_unique_id,
            offer_code:
              selectedOffer?.length > 0 && selectedOffer?.[0]?.coupon_code
                ? selectedOffer?.[0]?.coupon_code
                : "",
          },
        ],
      };
      const obj = {
        a: "AddDeleteFavourite",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        currency: storeCurrencys,
        current_user: isLogin ? loginDatas.member_id : RandomId,
        user_id: isLogin ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(paramsJewel),
      };
      Commanservice.postLaravelApi("/FavouriteController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (liked === "1") {
              favData.add_to_favourite = 0;
            } else {
              favData.add_to_favourite = 1;
            }
            favouriteCount(e, favData);
            setToastOpen(true);
            setIsSuccess(true);
            setToastMsg(res.data.message);
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
            setFavLoader({ ...favLoader, [e.item_id]: false });
          }
        })
        .catch(() => {
          setFavLoader({ ...favLoader, [e.item_id]: false });
        });
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Please wait already wishlist one item add in process");
    }
  };

  const favouriteCount = (data, favlike) => {
    const obj = {
      a: "get_count",
      store_id: storeEntityIds.mini_program_id,
      user_id: isLogin ? loginDatas.member_id : RandomId,
      item_id: data ? data.item_id : "",
    };
    Commanservice.postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (Object.keys(res.data.data).length > 0) {
            dispatch(storeFavCount(res.data.data?.favourite_count));
            dispatch(countCart(res.data.data?.cart_count));
            setFavLoader({ ...favLoader, [data.item_id]: false });
            setFavData(favlike);
            setTimeout(() => {
              setToastOpen(false);
            }, 2000);
            setFavStopClick(false);
          }
        } else {
          dispatch(storeFavCount(storeFavCounts));
          dispatch(countCart(countCarts));
          setFavStopClick(false);
          setIsSuccess(false);
          setToastOpen(true);
          setToastMsg(res.data.message);
          setFavLoader({ ...favLoader, [data.item_id]: false });
        }
      })
      .catch(() => {
        dispatch(storeFavCount(storeFavCounts));
        dispatch(countCart(countCarts));
        setFavLoader({ ...favLoader, [data.item_id]: false });
        setFavStopClick(false);
      });
  };

  //Customer Review
  const reviewData = (value, rate, page, key, obj) => {
    const reviewObj = {
      a: "getItemReview",
      type: "B2C",
      store_id: obj?.miniprogram_id ?? storeEntityIds.mini_program_id,
      item_id: value ? value.item_id : "",
      user_id: isLogin ? loginDatas.member_id : RandomId,
      per_page: "3",
      number: page ? page : "0",
      rating: rate ? rate : "0",
      variant_number: value.variant_data[0].product_variant,
      variant_id: value.variant_data[0].variant_unique_id,
    };
    Commanservice.postLaravelApi("/ReviewController", reviewObj)
      .then((res) => {
        if (res.data.success === 1) {
          let Data = res.data.data;
          setFavData(Data.favourite);
          let ReviewData = Data.review.result;
          let ReviewCount = Data.review_count;
          if (ReviewData.length < 3) {
            setHasMore(false);
          }
          if (ReviewData.length > 0) {
            if (key === "1") {
              for (let index = 0; index < ReviewData.length; index++) {
                reviewCustomerData.push(ReviewData[index]);
              }
              setReviewCustomerData(reviewCustomerData);
            } else {
              let arr = [...ReviewData];
              setReviewCustomerData(arr);
            }
          } else {
            setReviewCustomerData(ReviewData);
          }
          setReviewCustomer(res.data.data);
          let sum = 0;
          let totalUserRev = res.data.data.global_rating;
          let totalAllRating = 0;
          setGlobalRating(totalUserRev);
          for (let index = 0; index < ReviewCount.length; index++) {
            let totalAvg = Number(
              ReviewCount[index].rating * ReviewCount[index].total_user_rating
            );
            sum += Number(totalAvg);
            if (totalUserRev === 0) {
              ReviewCount[index].percenatge = 0;
            } else {
              ReviewCount[index].percenatge = (
                (ReviewCount[index].total_user_rating * 100) /
                totalUserRev
              ).toFixed();
            }
            totalAllRating =
              totalUserRev === 0 ? 0 : Number((sum / totalUserRev).toFixed(2));
          }
          setReviewSummary(ReviewCount);
          setGlobalRatingStar(totalAllRating);
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
        }
      })
      .catch((error) => {});
  };

  const handleChangeRow = (e) => {
    reviewData(specificationData, "0", e.toString(), "1");
  };

  const fetchMoreData = () => {
    const totalRows = reviewCutomer.review.total_pages
      ? reviewCutomer.review.total_pages
      : 1;
    if (itemsLength.length >= totalRows) {
      setHasMore(false);
      return;
    } else {
      setHasMore(true);
    }
    setTimeout(() => {
      setItemLength(itemsLength.concat(Array.from({ length: 1 })));
      handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
    }, 500);
  };

  const backToList = () => {
    if (params?.value !== undefined && params?.productKey !== "campaign") {
      if (paramsItem === "DIY") {
        router.push(
          `/make-your-customization/start-with-a-setting/type/${params?.value}`
        );
      } else if (isItemDIY === true) {
        if (activeStep >= 0) {
          setTypeViewDiy(false);
          dispatch(storeFilteredData({}));
          dispatch(storeActiveFilteredData({}));
          DiyStepersDatas.map((step, index) => {
            if (step.position === activeStep) {
              if (activeStep >= 0) {
                const previousStep = DiyStepersDatas[activeStep - 1];
                const currentStep = step;
                dispatch(ActiveStepsDiy(activeStep));
                dispatch(storeSpecData({}));
                setSpecificationData({});
                setProductData({});
                dispatch(storeProdData({}));
                dispatch(storeEmbossingData([]));
                setEmbossingArea([]);
                dispatch(saveEmbossings(false));
                dispatch(previewImageDatas([]));
                dispatch(activeImageData([]));
                const diyBomId = previousStep?.diy_bom_id ?? "";
                const verticalCode = currentStep.vertical;
                return router.push(
                  "/make-your-customization/start-with-a-item",
                  {
                    state: {
                      nextStepPosition: activeStep,
                      combination_id: previousStep?.combination_id ?? "",
                      diy_bom_id: diyBomId,
                      verticalCode: verticalCode,
                    },
                  }
                );
              } else {
              }
            }
          });
        }
      } else {
        if (params?.productKey == "offer") {
          router.push(
            `/products/${params?.verticalCode}/offer/${params?.value}`
          );
        } else {
          router.push(
            `/products/${params?.verticalCode}/type/${params?.value}`
          );
        }
      }
    } else {
      if (paramsItem === "DIY") {
        if (router.pathname.includes("/start-with-a-diamond")) {
          if (
            router.pathname.includes("/start-with-a-diamond/jewellery") &&
            activeDIYtabss === "Complete"
          ) {
            diamondStepTwo();
            dispatch(isRingSelected(false));
            dispatch(activeDIYtabs("Jewellery"));
          } else if (
            router.pathname.includes("/start-with-a-diamond/jewellery") &&
            activeDIYtabss === "Jewellery" &&
            isRingSelecteds === true
          ) {
            router.push("/make-your-customization/start-with-a-diamond");
            dispatch(activeDIYtabs("Diamond"));
            diamondStepFirst();
          } else {
            diamondStepFirst();
          }
        } else if (isItemDIY === true) {
          if (activeStep >= 0) {
            setTypeViewDiy(false);
            dispatch(storeFilteredData({}));
            dispatch(storeActiveFilteredData({}));
            DiyStepersDatas.map((step, index) => {
              if (step.position === activeStep) {
                if (activeStep >= 0) {
                  const previousStep = DiyStepersDatas[activeStep - 1];
                  const currentStep = step;
                  dispatch(ActiveStepsDiy(activeStep));
                  dispatch(storeSpecData({}));
                  setSpecificationData({});
                  setProductData({});
                  dispatch(storeProdData({}));
                  dispatch(storeEmbossingData([]));
                  setEmbossingArea([]);
                  dispatch(saveEmbossings(false));
                  dispatch(previewImageDatas([]));
                  dispatch(activeImageData([]));
                  const diyBomId = previousStep?.diy_bom_id ?? "";
                  const verticalCode = currentStep.vertical;
                  return router.push(
                    "/make-your-customization/start-with-a-item",
                    {
                      state: {
                        nextStepPosition: activeStep,
                        combination_id: previousStep?.combination_id ?? "",
                        diy_bom_id: diyBomId,
                        verticalCode: verticalCode,
                      },
                    }
                  );
                } else {
                }
              }
            });
          }
        } else if (router.pathname.includes("/start-with-a-setting")) {
          if (
            router.pathname.includes("/start-with-a-setting") &&
            activeDIYtabss === "Complete"
          ) {
            handleBackToDiamond();
            dispatch(activeDIYtabs("Diamond"));
          } else if (
            router.pathname.includes("/start-with-a-setting") &&
            activeDIYtabss === "Diamond"
          ) {
            handleFirstStep();
            dispatch(activeDIYtabs("Jewellery"));
          } else {
            router.push("/make-your-customization/start-with-a-setting");
            dispatch(storeSelectedDiamondData({}));
            dispatch(IsSelectedDiamond(false));
            dispatch(diamondNumber(""));
            dispatch(storeDiamondNumber(""));
            dispatch(addedDiamondData({}));
            dispatch(storeSelectedDiamondPrice(""));
            dispatch(finalCanBeSetData([]));
          }
        }
      } else {
        router.push(`/products/${params?.verticalCode}`);
      }
    }
  };

  const sliderArrow = (value) => {
    if (value == "Left") {
      var index = Number(active);
      if (index > 0) {
        if (isEmpty(diamondImage) == "") {
          index--;
          setActive(index);
          setLastActive(index);
        } else {
          index--;
          if (diamondArrayImage[index]["type"] != "cert") {
            setDiamondImage(diamondArrayImage[index]);
          }
        }
      }
    } else {
      var index = Number(active);
      if (isEmpty(diamondImage) == "") {
        if (specificationData?.image_types.length > 0) {
          if (specificationData?.image_types.length - 1 > Number(index)) {
            index++;
            setActive(index);
            setLastActive(index);
          }
        } else {
          if (specificationData?.images?.length - 1 > Number(index)) {
            index++;
            setActive(index);
            setLastActive(index);
          }
        }
      } else {
        if (diamondArrayImage.length > 0) {
          if (diamondArrayImage.length > Number(index)) {
            index++;
            if (diamondArrayImage[index]["type"] != "cert") {
              setDiamondImage(diamondArrayImage[index]);
            }
          }
        }
      }
    }
  };

  //story Data
  const storyData = (value, objs) => {
    const obj = {
      a: "GetJournyDetail",
      type: "6",
      type_id: value,
      per_page: "0",
      number: "0",
      tenant_id: objs?.tenant_id ?? storeEntityIds.tenant_id,
      entity_id: objs?.entity_id ?? storeEntityIds.entity_id,
      SITDeveloper: "1",
    };
    Commanservice.postApi("/MasterTable", obj).then((res) => {
      if (res.data.success == 1) {
        setStoryDataList(res["data"]["data"]);
      }
    });
  };

  const handleChangeText = (event) => {
    setEngravingText(event.target.value);
  };

  const handleCloseEngraving = () => {
    if (
      engravingText !== "" ||
      engravingText.length >= parseInt(specificationData.min_character)
    ) {
      setIsEngraving(false);
      setEngravingText(engravingText);
      setIsFontStyle(isFontStyle);
    } else if (engravingText === "") {
      setIsEngraving(false);
      setEngravingText("");
    } else {
      setIsEngraving(false);
      setSaveEngraving(false);
    }
    if (engravingTexts === "") {
      setEngravingText("");
    } else {
      setEngravingText(engravingTexts);
    }
  };

  const handleSaveEngraving = (item) => {
    if (
      (engravingText !== "" &&
        engravingText.length >= parseInt(item.min_character)) ||
      engravingText.length === 0
    ) {
      if (engravingText.length === 0) {
        setIsEngraving(false);
        setEngravingText("");
        setEngravingTexts("");
        setSaveEngraving(false);
      } else {
        setSaveEngraving(true);
        setIsEngraving(false);
        setEngravingTexts(engravingText);
        setIsFontStyle(isItalicFont ? true : false);
      }
    } else if (engravingText.length <= parseInt(item.min_character)) {
      setToastOpen(true);
      setToastMsg(
        `Please enter atleast ${
          item.min_character ? item.min_character : " "
        } character`
      );
      setIsEngraving(true);
    } else {
      setSaveEngraving(false);
      setIsEngraving(false);
    }
  };

  //Onchnage for Other services
  const onChangeService = (item, index) => {
    setServiceData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_selected: updated[index].is_selected === "1" ? "0" : "1",
      };
      dispatch(serviceAllData(updated));
      return updated;
    });
  };

  const handleBackToDiamond = () => {
    if (finalStoneArr.length) {
      if (typeof finalStoneArr[0] === "object") {
        const codeVal = finalStoneArr[0].vertical_code;
        if (codeVal) {
          editStoneMultiple(finalStoneArr[0], "");
          dispatch(diamondPageChnages(false));
          setVerticalCode(codeVal);
        }
      }
    }
  };

  const getFontSize = () => {
    if (inputRef.current) {
      const computedStyle = window.getComputedStyle(inputRef.current);
      const fontSize = computedStyle.fontSize;
      setEngravingFontSize(fontSize.toString());
    }
  };

  useEffect(() => {
    if (saveEngraving) {
      getFontSize();
    }
  }, [saveEngraving]);

  const extractNumber = (str) =>
    typeof str === "string" ? parseFloat(str.replace(/[^0-9.]/g, "")) : 0;

  function handleFirstStep() {
    setCallFirstTime(true);
    setViewType("jewelery");
    setVerticalCode("");
    setFinalCanBeSet([]);
    dispatch(activeDIYtabs("Jewellery"));
  }

  function handleSetStone(item) {
    if (typeof item === "object") {
      setStoneObj(item);
    }
  }

  function handleComplete() {
    setFinalCanBeSet(stoneCanBeSetArr);
    dispatch(finalCanBeSetData(stoneCanBeSetArr));
    dispatch(activeDIYtabs("Complete"));
    setViewType("review");
  }

  function diamondStepTwo() {
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(isRingSelected(false));
    setIsDiamondSelected(false);
    setVerticalCode("");
  }

  function diamondStepFirst() {
    dispatch(activeDIYtabs("Diamond"));
    setIsDiamondSelected(true);
    dispatch(diamondPageChnages(false));
    router.push("/make-your-customization/start-with-a-diamond");
  }

  function handleRemoveDiamond() {
    dispatch(addedDiamondData({}));
    setSelectedDiamond({});
    setIsDiamondSelected(false);
    dispatch(diamondNumber(""));
    dispatch(storeDiamondNumber(""));
    dispatch(IsSelectedDiamond(false));
  }

  function handleSetDiamond() {
    dispatch(activeDIYtabs("Diamond"));
    setIsDiamondSelected(false);
    dispatch(diamondPageChnages(false));
    router.push("/make-your-customization/start-with-a-diamond");
  }

  function handleSetCompleteRing() {
    canBeSetWithData();
    dispatch(addedRingData(specificationData));
    dispatch(isRingSelected(true));
    setIsDiamondSelected(true);
    setIsStoneSelected(false);
    dispatch(activeDIYtabs("Complete"));
    setViewType("review");
  }

  // offer and engraving price plus
  const calculatePrice = (
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData
  ) => {
    let storeBasePrice = parseFloat(specificationData?.final_total) || 0;
    let offerPrice = 0;
    let customDuty = 0;
    let tax = 0;
    let price = 0;

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      let discountValue = extractNumber(selectedOffer[0]?.discount) || 0;
      if (selectedOffer[0]?.offer_type === "FLAT") {
        offerPrice = discountValue;
      } else {
        offerPrice =
          parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) || 0;
      }
    }

    let engravingPrice =
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData.service_rate.toString()) || 0
        : 0;
    let embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate.toString())
        : 0;
    let otherService = serviceData?.some(
      (item) => item.is_selected === true || item.is_selected === "1"
    )
      ? serviceData
          ?.filter(
            (item) => item.is_selected === true || item.is_selected === "1"
          )
          .reduce((total, item) => {
            const price = parseFloat(extractNumber(item.service_rate));
            return isNaN(price) ? total : total + price;
          }, 0)
      : 0;

    let customPer = extractNumber(specificationData?.custom_per) || 0;
    let taxPer = extractNumber(specificationData?.tax1) || 0;

    customDuty =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            engravingPrice +
            embossingPrice +
            otherService) *
            customPer) /
          100
        ).toFixed(2)
      ) || 0;
    tax =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            customDuty +
            engravingPrice +
            embossingPrice +
            otherService) *
            taxPer) /
          100
        ).toFixed(2)
      ) || 0;
    price =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService +
      customDuty +
      tax;

    return numberWithCommas(price.toFixed(2));
  };

  useEffect(() => {
    if (!specificationData) return;
    let storeBasePrice = parseFloat(specificationData?.final_total) || 0;
    let offerPrice = 0;
    let customDuty = 0;
    let tax = 0;
    let total = 0;

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      const discountValue = extractNumber(selectedOffer[0]?.discount) || 0;
      offerPrice =
        selectedOffer[0]?.offer_type === "FLAT"
          ? discountValue
          : parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) ||
            0;
    }

    const engravingPrice =
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData.service_rate.toString()) || 0
        : 0;
    const embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate?.toString()) || 0
        : 0;
    const otherService = Array.isArray(serviceData)
      ? serviceData.reduce((total, item) => {
          if (item.is_selected === true || item.is_selected === "1") {
            const price = parseFloat(extractNumber(item.service_rate));
            return isNaN(price) ? total : total + price;
          }
          return total;
        }, 0)
      : 0;

    const customPer = extractNumber(specificationData?.custom_per) || 0;
    const taxPer = extractNumber(specificationData?.tax1) || 0;
    const subtotal =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService;

    customDuty = parseFloat(((subtotal * customPer) / 100).toFixed(2)) || 0;
    tax =
      parseFloat((((subtotal + customDuty) * taxPer) / 100).toFixed(2)) || 0;
    total =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService +
      customDuty +
      tax;

    const services = [];
    if (Array.isArray(serviceData)) {
      serviceData.forEach((element) => {
        const serviceItem = {
          text: "",
          type: "",
          image: "",
          is_selected: element.is_selected,
          currency: element?.msrv_currency,
          price: element?.service_rate,
          font_size: element?.font_size,
          min_character: element?.min_character,
          max_character: element?.max_character,
          unique_id: element?.service_unique_id,
          service_code: element?.service_code,
          service_name: element?.service_name,
          service_type: element?.service_type,
        };
        if (
          element?.service_code === "ENGRAVING" &&
          element.service_type === "Special"
        ) {
          serviceItem.type = isItalicFont ? "italic" : "bold";
          serviceItem.text = saveEngraving === true ? engravingTexts : "";
          serviceItem.is_selected = engravingTexts !== "" ? "1" : "0";
        }
        if (
          element?.service_code === "EMBOSSING" &&
          element.service_type === "Special"
        ) {
          serviceItem.image = activeImgSave;
          serviceItem.is_selected = activeImgSave?.some(
            (img) => img?.embImage !== ""
          )
            ? "1"
            : "0";
        }
        services.push(serviceItem);
      });
    }

    setProductBreakupData({
      basePrice: storeBasePrice,
      unitPrice: storeBasePrice - offerPrice,
      servicePrice: services,
      discountPrice: offerPrice,
      discountPer: parseFloat(((offerPrice / storeBasePrice) * 100).toFixed(2)),
      subTotal:
        storeBasePrice -
        offerPrice +
        engravingPrice +
        embossingPrice +
        otherService,
      qty: 1,
      taxPrice: tax,
      customDutyTax: customDuty,
      totalPrice: total,
    });
  }, [
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData,
    engravingData,
    isItalicFont,
    engravingTexts,
    activeImgSave,
  ]);

  useEffect(() => {
    if (viewType === "review") {
      setComplete(true);
    }
  }, [viewType]);

  useEffect(() => {
    if (paramsItems === "PRODUCT") {
      setdiamondSummary([]);
      setdiamondSummaryname([]);
      setSecondDiamondSummary([]);
      setSecondDiamondSummaryname([]);
      setOnceUpdated(false);
    }
  }, [params]);

  //Meta
  const metaConfig = {
    title: `${
      isEmpty(specificationData?.seo_titles) !== ""
        ? isEmpty(specificationData?.seo_titles)
        : isEmpty(
            firstWordCapital(
              params?.variantId?.split("pv")[0]?.replaceAll("-", " ")
            )
          )
    }`,
    description: isEmpty(specificationData?.seo_description),
    keywords: isEmpty(specificationData?.seo_keyword),
    image: isEmpty(specificationData?.images?.[0]),
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  return (
    <React.Fragment>
     
      {loading && <Loader />}
      {viewType == "jewelery" || viewType == "review" ? (
        <section id={styles['singleProductDetails']}>
          {paramsItem === "DIY" ? (
            <>
              {!isItemDIY ? (
                <DIYProcessStepBar
                  product_type={productType}
                  serviceData={serviceData}
                  back={parentBack}
                  go_to_diamond={go_to_diamond}
                  go_to_review={go_to_review}
                  handleBackToDiamond={handleBackToDiamond}
                  productSKU={productSKU}
                  finalTotal={finalTotal}
                  finalCanBeSet={finalCanBeSet}
                  salesTotalPrice={numberWithCommas(salesTotalPrice)}
                  certificateNumber={stoneObj.st_cert_no}
                  stonePrice={stoneObj.final_total_display}
                  stoneImageUrl={stoneObj.st_is_photo}
                  complete={complete}
                  parentCallback={handleBackToDiamond}
                  handleFirstStep={handleFirstStep}
                  handleComplete={handleComplete}
                  isStone={isStone}
                  diamondStepTwo={diamondStepTwo}
                  diamondStepFirst={diamondStepFirst}
                  isOffers={isOffers}
                  specificationData={specificationData}
                  selectedOffer={selectedOffer}
                  isEngraving={saveEngraving}
                  embossingData={embossingData}
                  isEmbossing={SaveEmbossing}
                  calculatePrice={calculatePrice}
                  backToList={backToList}
                />
              ) : (
                <DIYPageProcessStep
                  product_type="Product"
                  setOnceUpdated={setOnceUpdated}
                  handleUpdateImageforDiy={handleUpdateImageforDiy}
                  setSpecificationData={setSpecificationData}
                  setLoading={setLoading}
                  setSelectedOffer={setSelectedOffer}
                  setEngravingData={setEngravingData}
                  calculatePrice={calculatePrice}
                  activeStep={activeStep}
                  setEmbossingArea={setEmbossingArea}
                  setEmbossingData={setEmbossingData}
                  position={activeStep}
                  setActiveStep={setActiveStep}
                  setTypeViewDiy={setTypeViewDiy}
                />
              )}
              {
                <BreadcrumbModule
                  callingJewel={callingJewel}
                  diamondStepFirst={diamondStepFirst}
                />
              }
            </>
          ) : (
            <> </>
          )}
          <div className="container">
            <div className="row">
              {!typeViewDiy && (
                <div className="col-12">
                  <div className="back-btn mb-2">
                    <i className="ic_chavron_left me-1"></i>
                    <div
                      className="text-decoration-underline"
                      onClick={() => backToList()}
                    >
                      BACK
                    </div>
                  </div>
                </div>
              )}
              {Object.keys(specificationData).length > 0 ? (
                <>
                  <div className="col-12">
                    <div className="row ">
                      <div className={clsx('col-sm-12 col-md-7 col-lg-8', styles['product-detail-slider'])}>
                        {specificationData?.images.length > 0 ||
                        (specificationData?.variant_data &&
                          specificationData?.images.length > 0) ? (
                          <div className={styles['product_toggle']}>
                            <div className={clsx(styles['toggle_icon'], { active: listandToggle })}  onClick={() => setListandToggle(true)} >
                              <i className={listandToggle ? 'ic_gallery_grid_fill' : 'ic_gallery_grid'}></i>
                            </div>

                            <div className={styles['toggle_line']}></div>

                            <div
                              className={clsx(styles['toggle_icon'], { active: !listandToggle })}
                              onClick={() => setListandToggle(false)}
                            >
                              <i className={listandToggle ? 'ic_gallery_list' : 'ic_gallery_list_fill'}></i>
                            </div>
                          </div>

                        ) : (
                          ""
                        )}
                        {listandToggle === true ? (
                          <div className={styles['product_gallery_view']}>
                            {specificationData?.variant_data &&
                            specificationData?.images.length > 0
                              ? specificationData?.image_types.map(
                                  (s, index) => {
                                    if (s === "Video") {
                                      return (
                                        <div
                                          key={`s-${index}`}
                                          className={styles['gallery_view_img']}
                                        >
                                          <video
                                            src={
                                              specificationData?.images[index]
                                            }
                                            className="img-fluid w-100"
                                            loop
                                            autoPlay={true}
                                          />
                                          <div
                                            className={styles['video-icon']}
                                            style={{ visibility: "hidden" }}
                                          >
                                            <i className="ic_play"></i>
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div
                                          key={`s-${index}`}
                                          className={clsx(styles['gallery_view_img'], specificationData?.images.length === 1 && styles.imageHide)}
                                        >
                                          <img
                                            className="wh-auto img-fluid"
                                            src={
                                              specificationData?.images[index]
                                            }
                                            width={410}
                                            height={410}
                                            alt={`${specificationData?.product_name ?? "Product"} - ${index + 1}`}
                                          />
                                        </div>
                                      );
                                    }
                                  }
                                )
                              : specificationData?.images.length > 0 &&
                                specificationData.image_types.map(
                                  (s, index) => {
                                    if (s === "Video") {
                                      return (
                                        <div
                                          className={styles['gallery_view_img']}
                                          key={`g-${index}`}
                                        >
                                          <video
                                            src={
                                              specificationData?.images[index]
                                            }
                                            className="img-fluid w-100"
                                            loop
                                            autoPlay={true}
                                          />
                                          <div
                                            className={styles['video-icon']}
                                            style={{ visibility: "hidden" }}
                                          >
                                            <i className="ic_play"></i>
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div
                                          className={styles['gallery_view_img']}
                                          key={`g-${index}`}
                                        >
                                          <div
                                            className="wh-auto"
                                            src={
                                              specificationData?.images[index]
                                            }
                                            alt={`${specificationData?.product_name ?? "Product"} - ${index + 1}`}
                                            width={410}
                                            height={410}
                                          />
                                        </div>
                                      );
                                    }
                                  }
                                )}
                          </div>
                        ) : (
                          ""
                        )}
                        {listandToggle === false ||
                        specificationData?.images.length == 1 ? (
                          <div  className={clsx('position-sticky top-20',(viewType === 'review' && diamondArrayImage.length > 0) || isItemDIY? styles.DiamondReview: null)} >
                           
                            <div className="DiamondReviewBox" style={{ flex: 1 }}  >
                              <div id="sampleSlide">
                                <div className={styles['vertical-slider-container']}>
                                  <div className={styles['vertical-thumbnails']}>
                                    {specificationData?.variant_data &&
                                    specificationData?.image_types.length > 0
                                      ? specificationData?.image_types.map(
                                          (s, index) => {
                                            if (s === "Video") {
                                              return (
                                                <div
                                                  key={`v-${index}`}
                                                  onClick={() => {
                                                    setActive(index);
                                                    setLastActive(index);
                                                    setDiamondImage("");
                                                  }}
                                                  className={clsx('d-flex align-items-center position-relative',styles['img-indiacator'] ,{ [styles.active]: index === active })}
                                                  data-target="#sampleSlide"
                                                  data-slide-to={1}
                                                >
                                                  <video
                                                    src={
                                                      specificationData?.images[
                                                        index
                                                      ]
                                                    }
                                                    className="img-fluid w-100"
                                                    loop
                                                    autoPlay={true}
                                                  />
                                                  <div
                                                    className={styles['video-icon']}
                                                    style={{
                                                      visibility: "hidden",
                                                    }}
                                                  >
                                                    <i className="ic_play"></i>
                                                  </div>
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div
                                                  key={`i-${index}`}
                                                  onClick={() => {
                                                    setActive(index);
                                                    setLastActive(index);
                                                    setDiamondImage("");
                                                  }}
                                                  className={clsx(styles['img-indiacator'], { [styles.active]: index === active })}
                                                  
                                                  data-target="#sampleSlide"
                                                  data-slide-to={0}
                                                >
                                                  <img
                                                    src={
                                                      specificationData?.images[
                                                        index
                                                      ]
                                                    }
                                                    alt={`${
                                                      specificationData?.product_name ??
                                                      "Product"
                                                    } - ${index + 1}`}
                                                    className="img-fluid wh-auto"
                                                    width={410}
                                                    height={410}
                                                  />
                                                </div>
                                              );
                                            }
                                          }
                                        )
                                      : specificationData?.images.length > 0 &&
                                        specificationData.image_types.map(
                                          (s, index) => {
                                            if (s === "Video") {
                                              return (
                                                <div
                                                  key={`a-${index}`}
                                                  onClick={() => {
                                                    setActive(index);
                                                    setLastActive(index);
                                                    setDiamondImage("");
                                                  }}
                                                  className={clsx('d-flex align-items-center position-relative',styles['img-indiacator'] , { [styles.active]: index === active })}
                                                  data-target="#sampleSlide"
                                                  data-slide-to={1}
                                                >
                                                  <video
                                                    src={
                                                      specificationData?.images[
                                                        index
                                                      ]
                                                    }
                                                    className="img-fluid w-100"
                                                    loop
                                                    autoPlay={true}
                                                  />
                                                  <div
                                                    className={styles['video-icon']}
                                                    style={{
                                                      visibility: "hidden",
                                                    }}
                                                  >
                                                    <i className="ic_play"></i>
                                                  </div>
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div
                                                  key={`a-${index}`}
                                                  onClick={() => {
                                                    setActive(index);
                                                    setLastActive(index);
                                                    setDiamondImage("");
                                                  }}
                                                  className={clsx(styles['img-indiacator'], { active: index === active })}
                                                  data-target="#sampleSlide"
                                                  data-slide-to={0}
                                                >
                                                  <img
                                                    src={
                                                      specificationData?.images[
                                                        index
                                                      ]
                                                    }
                                                    className="img-fluid wh-auto"
                                                    width={410}
                                                    height={410}
                                                    alt={`${
                                                      specificationData?.product_name ??
                                                      "Product"
                                                    } - ${index + 1}`}
                                                  />
                                                </div>
                                              );
                                            }
                                          }
                                        )}
                                  </div>
                                  {isEmpty(diamondImage) == "" ? (
                                    <div className={styles['proderct_slider']}>
                                      {specificationData?.variant_data &&
                                      specificationData?.image_types.length > 0
                                        ? specificationData?.image_types.map(
                                            (s, index) => {
                                              if (s === "Video") {
                                                return (
                                                  <div style={{
                                                      display:
                                                        index === active
                                                          ? "block"
                                                          : "none",
                                                    }}
                                                    key={`s-${index}`}
                                                  >
                                                    <div className={styles['slide_img']}>
                                                      <video
                                                        src={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        className="img-fluid"
                                                        loop
                                                        autoPlay={true}
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              } else {
                                                return (
                                                  <div
                                                    style={{
                                                      display:
                                                        index === active
                                                          ? "block"
                                                          : "none",
                                                    }}
                                                    key={`i-${index}`}
                                                  >
                                                    <div className={styles['slide_img']}>
                                                      <img
                                                        alt={`${
                                                          specificationData?.product_name ??
                                                          "Product"
                                                        } - ${index + 1}`}
                                                        src={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        srcSet={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        className="img-fluid wh-auto"
                                                        width={410}
                                                        height={410}
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            }
                                          )
                                        : specificationData?.image_types.map(
                                            (s, index) => {
                                              if (s === "Video") {
                                                return (
                                                  <div
                                                    style={{
                                                      display:
                                                        index === active
                                                          ? "block"
                                                          : "none",
                                                    }}
                                                    key={`k-${index}`}
                                                  >
                                                    <div className={styles['slide_img']}>
                                                      <video
                                                        src={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        className="img-fluid"
                                                        loop
                                                        autoPlay={true}
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              } else {
                                                return (
                                                  <div
                                                    style={{
                                                      display:
                                                        index === active
                                                          ? "block"
                                                          : "none",
                                                    }}
                                                    key={`i-${index}`}
                                                  >
                                                    <div className={styles['slide_img']}>
                                                      <img
                                                        alt={`${
                                                          specificationData?.product_name ??
                                                          "Product"
                                                        } - ${index + 1}`}
                                                        src={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        srcSet={
                                                          specificationData
                                                            ?.images[index]
                                                        }
                                                        className="img-fluid wh-auto"
                                                        width={410}
                                                        height={410}
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            }
                                          )}
                                      {specificationData?.variant_data &&
                                      specificationData?.images.length > 1 ? (
                                        <div className={styles['sliderthumbnail']}>
                                          <>
                                            <div
                                              className={clsx(styles['thumb_prev'], styles['thumb_arrow'])}
                                              onClick={() =>
                                                sliderArrow("Left")
                                              }
                                            >
                                              <i className="ic_left"></i>
                                            </div>
                                            <div
                                              className={clsx(styles['thumb_next'], styles['thumb_arrow'])}
                                              onClick={() =>
                                                sliderArrow("Right")
                                              }
                                            >
                                              <i className="ic_right"></i>
                                            </div>
                                          </>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      style={{ display: "block" }}
                                      className={styles['diamond_slider']}
                                    >
                                      <div className="slide_img">
                                        {isEmpty(diamondImage.type) ==
                                          "image" ||
                                        isEmpty(diamondImage.type) ==
                                          "v_image" ? (
                                          <>
                                            <div className={clsx('position-relative dia-lw', styles['slide_img'])}>
                                              <img
                                                alt="image"
                                                src={diamondImage.src}
                                                srcSet={diamondImage.src}
                                                className="img-fluid wh-auto"
                                                width={716}
                                                height={716}
                                              />
                                              {isEmpty(diamondImage.type) ==
                                              "v_image" ? (
                                                <>
                                                  <div className={clsx('dia-l diamond-width medium-title')}>
                                                    {diamondImage.length}
                                                  </div>
                                                  <div className={clsx('dia-l diamond-width medium-title')}>
                                                    {diamondImage.width}
                                                  </div>
                                                </>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            {diamondImage.iframe == true ? (
                                              <iframe
                                                src={diamondImage.src}
                                                loading="lazy"
                                                className="img-fluid w-100 h-100"
                                              ></iframe>
                                            ) : (
                                              <video
                                                src={diamondImage.src}
                                                className="img-fluid"
                                                loop
                                                autoPlay={true}
                                              />
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {viewType == "review" &&
                                  diamondArrayImage.length > 0 ? (
                                    <div className={styles['product-part-vertical']}>
                                      {diamondArrayImage.map((d, i) => (
                                        <div className={clsx(styles["vertical_slider_img"], { [styles.active]: diamondImage.src === d.src,})}
                                          key={`d-${i}`} >
                                          <img
                                            className="wh-auto"
                                            onClick={() => {
                                              if (d.type == "cert") {
                                                setActive(active);
                                                setLastActive(active);
                                                setDiaModalShow(true);
                                                setIframeUrl(d.src);
                                              }
                                              if (d.type != "cert") {
                                                setDiamondImage(d);
                                                setIframeUrl("");
                                              }
                                            }}
                                            src={d.view}
                                            alt="image"
                                            width={108}
                                            height={108}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  
                                </div>
                                
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className={clsx('col-sm-12 col-md-5 col-lg-4', styles['product-detail-info'])}>
                        {finalCanBeSet.length > 0 &&
                        !location.pathname.includes("/start-with-a-diamond") ? (
                          <div className={styles['product-detail_right']}>
                            <div className="w-100">
                              <div className="d-flex border-bottom-light-green mb-20px">
                                {location.pathname.includes(
                                  "/start-with-a-setting"
                                ) ? (
                                  <div className="mb-2">
                                    <h1 className="sub-heading-title mb-3">
                                      {Object.keys(specificationData).length > 0
                                        ? storeSpecDatas?.variant_data?.[0]
                                            ?.product_name
                                        : ""}
                                    </h1>
                                    <div className=" mb-10px">
                                      <div className="d-flex gap-5">
                                        <p className="product-sku fs-15px me-30px">
                                          <span className="fw-500 sku-title">
                                            SKU
                                          </span>{" "}
                                          :{" "}
                                          {
                                            storeSpecDatas["variant_data"]?.[0][
                                              "product_sku"
                                            ]
                                          }
                                        </p>
                                        <u
                                          className="cursor-pointer Change"
                                          onClick={handleFirstStep}
                                        >
                                          Change
                                        </u>
                                      </div>
                                      {isEmpty(storeSpecDatas) !== "" && (
                                        <div className="weight_info mt-2">
                                          {isEmpty(
                                            storeSpecDatas["short_summary"]
                                          ) != "" ? (
                                            <>
                                              {isEmpty(
                                                storeSpecDatas[
                                                  "variant_data"
                                                ]?.[0]["jewelry_type_name"]
                                              ) != "" ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-13px fw-500 mb-1">
                                                    Jewelry Type
                                                  </div>
                                                  <p className="fs-13px">
                                                    <span>
                                                      {
                                                        storeSpecDatas[
                                                          "variant_data"
                                                        ][0][
                                                          "jewelry_type_name"
                                                        ]
                                                      }{" "}
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(metalType) != "" ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-13px fw-500 mb-1">
                                                    Metal Type
                                                  </div>
                                                  <p className="fs-13px">
                                                    <span>{metalType}</span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                storeSpecDatas["short_summary"][
                                                  "gold_wt"
                                                ]
                                              ) != "" &&
                                              storeSpecDatas["short_summary"][
                                                "gold_wt"
                                              ] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Gold Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["gold_wt"]
                                                      }{" "}
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["gold_wt_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                storeSpecDatas["short_summary"][
                                                  "dia_wt"
                                                ]
                                              ) != "" &&
                                              storeSpecDatas["short_summary"][
                                                "dia_wt"
                                              ] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Diamond Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["dia_wt"]
                                                      }{" "}
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["dia_first_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                storeSpecDatas["short_summary"][
                                                  "col_wt"
                                                ]
                                              ) != "" &&
                                              storeSpecDatas["short_summary"][
                                                "col_wt"
                                              ] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Gemstone Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["col_wt"]
                                                      }{" "}
                                                      {
                                                        storeSpecDatas[
                                                          "short_summary"
                                                        ]["col_first_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="mb-10px">
                                      <h2 className="fs-20px profile-title">
                                        {Object.keys(storeSpecDatas).length > 0
                                          ? storeCurrencys +
                                            " " +
                                            calculatePrice(
                                              storeSpecDatas,
                                              selectedOffer,
                                              saveEngraving,
                                              SaveEmbossing,
                                              embossingData,
                                              serviceData
                                            )
                                          : ""}
                                      </h2>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-2">
                                    <h2 className="sub-heading-title mb-3">
                                      {Object.keys(specificationData).length > 0
                                        ? specificationData?.variant_data[0]
                                            ?.product_name
                                        : ""}
                                    </h2>
                                    <div className=" mb-10px">
                                      <div className="d-flex gap-5">
                                        <p className="product-sku fs-15px me-30px">
                                          <span className="fw-500 sku-title">
                                            SKU
                                          </span>{" "}
                                          :{" "}
                                          {
                                            specificationData[
                                              "variant_data"
                                            ][0]["product_sku"]
                                          }
                                        </p>
                                        {location.pathname.includes(
                                          "/start-with-a-diamond/jewellery"
                                        ) ? (
                                          activeDIYtabss === "Jewellery" ? (
                                            <u
                                              className="cursor-pointer"
                                              onClick={handleFirstStep}
                                            >
                                              Change
                                            </u>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          <u
                                            className="cursor-pointer"
                                            onClick={handleFirstStep}
                                          >
                                            Change
                                          </u>
                                        )}
                                      </div>
                                      {isEmpty(
                                        specificationData["short_summary"]
                                      ) !== "" && (
                                        <div className="weight_info mt-2">
                                          {isEmpty(
                                            specificationData["short_summary"]
                                          ) != "" ? (
                                            <>
                                              {isEmpty(
                                                specificationData[
                                                  "variant_data"
                                                ]?.[0]["jewelry_type_name"]
                                              ) != "" ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-13px fw-500 mb-1">
                                                    Jewelry Type
                                                  </div>
                                                  <p className="fs-13px">
                                                    <span>
                                                      {
                                                        specificationData[
                                                          "variant_data"
                                                        ][0][
                                                          "jewelry_type_name"
                                                        ]
                                                      }{" "}
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(metalType) != "" ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-13px fw-500 mb-1">
                                                    Metal Type
                                                  </div>
                                                  <p className="fs-13px">
                                                    <span>{metalType}</span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                specificationData[
                                                  "short_summary"
                                                ]["gold_wt"]
                                              ) != "" &&
                                              specificationData[
                                                "short_summary"
                                              ]["gold_wt"] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Gold Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["gold_wt"]
                                                      }{" "}
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["gold_wt_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                specificationData[
                                                  "short_summary"
                                                ]["dia_wt"]
                                              ) != "" &&
                                              specificationData[
                                                "short_summary"
                                              ]["dia_wt"] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Diamond Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["dia_wt"]
                                                      }{" "}
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["dia_first_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {isEmpty(
                                                specificationData[
                                                  "short_summary"
                                                ]["col_wt"]
                                              ) != "" &&
                                              specificationData[
                                                "short_summary"
                                              ]["col_wt"] > 0 ? (
                                                <div className="Gold_Weight">
                                                  <div className="fs-14px fw-500 mb-1">
                                                    Gemstone Weight
                                                  </div>
                                                  <p className="fs-14px">
                                                    <span>
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["col_wt"]
                                                      }{" "}
                                                      {
                                                        specificationData[
                                                          "short_summary"
                                                        ]["col_first_unit"]
                                                      }
                                                    </span>
                                                  </p>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="mb-10px">
                                      <h2 className="fs-20px profile-title">
                                        {Object.keys(specificationData).length >
                                        0
                                          ? storeCurrencys +
                                            " " +
                                            specificationData?.final_total_display
                                          : ""}
                                      </h2>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {viewType != "review" ||
                              activeDIYtabss === "Complete" ? (
                                <>
                                  {finalCanBeSet.length > 0 &&
                                    finalCanBeSet.map((c, index) => (
                                      <div
                                        className="mb-20px"
                                        key={`f-${index}`}
                                      >
                                        <div className="mb-10px d-flex align-items-center justify-content-between">
                                          <h2 className="fs-20px detail-sub-heading">
                                            {c.stone_position_name} (
                                            {c.no_of_stone})
                                          </h2>
                                          {c.showing_group === true ? (
                                            <button
                                              className="btn fs-10px my-1"
                                              onClick={() => groupByStone(c)}
                                            >
                                              {c.no_of_stone_array.length}{" "}
                                              Stones
                                            </button>
                                          ) : (
                                            ""
                                          )}
                                        </div>

                                        {c.group_by == false ? (
                                          <React.Fragment>
                                            {c.no_of_stone_array.length > 0 &&
                                              c.no_of_stone_array.map(
                                                (d, i) => (
                                                  <div
                                                    className="mb-3 StoneSetBox sec-bg-color"
                                                    key={`d-${i}`}
                                                  >
                                                    <div className="StoneSetBox_inner">
                                                      <div className="StoneSetBox_left">
                                                        <div className="stone_title">
                                                          <p className="fs-20px">
                                                            1
                                                          </p>
                                                        </div>

                                                        {c.shape.length > 0 &&
                                                          c.shape.map(
                                                            (a, id) => (
                                                              <div
                                                                className="StoneShapeSub"
                                                                key={`a-${id}`}
                                                              >
                                                                <i
                                                                  className={` shape-color ${a.image}`}
                                                                ></i>
                                                                <p className="fs-12px fw-500">
                                                                  {a.value}
                                                                </p>
                                                              </div>
                                                            )
                                                          )}
                                                        <div className="StoneShapeSub">
                                                          <h5>Stone Type </h5>
                                                          {d.set_stone ==
                                                          "0" ? (
                                                            <p className="fs-12px">
                                                              {c.stone_type}
                                                            </p>
                                                          ) : (
                                                            <p className="fs-12px">
                                                              <span>
                                                                {c.stone_type}{" "}
                                                              </span>
                                                              <br></br>
                                                              <span>
                                                                (
                                                                {
                                                                  d
                                                                    ?.stone_arr?.[
                                                                    "st_lab"
                                                                  ]
                                                                }{" "}
                                                                {
                                                                  d.stone_arr?.[
                                                                    "st_cert_no"
                                                                  ]
                                                                }
                                                                )
                                                              </span>
                                                            </p>
                                                          )}
                                                        </div>
                                                        <div className="StoneShapeSub">
                                                          {d.set_stone ==
                                                          "0" ? (
                                                            <>
                                                              <h5>Size</h5>
                                                              {c.stone_size
                                                                .length > 0 &&
                                                                c.stone_size.map(
                                                                  (a, id) => (
                                                                    <span
                                                                      className="fs-12px"
                                                                      key={`a1-${id}`}
                                                                    >
                                                                      {a.key}
                                                                      {id <
                                                                      c
                                                                        .stone_size
                                                                        .length -
                                                                        1
                                                                        ? ","
                                                                        : ""}
                                                                    </span>
                                                                  )
                                                                )}
                                                            </>
                                                          ) : (
                                                            <>
                                                              <h5>Size</h5>
                                                              <span className="fs-12px">
                                                                {
                                                                  d.stone_arr?.[
                                                                    "st_size"
                                                                  ]
                                                                }
                                                              </span>
                                                            </>
                                                          )}
                                                        </div>
                                                        {d.set_stone == "0" ? (
                                                          ""
                                                        ) : (
                                                          <>
                                                            <div className="StoneShapeSub">
                                                              <h5>Clarity</h5>
                                                              <span className="fs-12px ml-2">
                                                                {
                                                                  d.stone_arr?.[
                                                                    "st_cla"
                                                                  ]
                                                                }
                                                              </span>
                                                            </div>
                                                            <div className="StoneShapeSub">
                                                              <h5>Color</h5>
                                                              <span className="fs-12px ml-2">
                                                                {
                                                                  d.stone_arr?.[
                                                                    "st_col"
                                                                  ]
                                                                }
                                                              </span>
                                                            </div>
                                                            <div className="StoneShapeSub">
                                                              <h5>Price</h5>
                                                              <span className="fs-14px ml-2">
                                                                <b>
                                                                  {
                                                                    storeCurrencys
                                                                  }{" "}
                                                                  {
                                                                    d
                                                                      .stone_arr?.[
                                                                      "ex_store_price"
                                                                    ]
                                                                  }
                                                                </b>
                                                              </span>
                                                            </div>
                                                          </>
                                                        )}
                                                      </div>

                                                      <div className="btn-edit-remove">
                                                        {d.set_stone == "0" ? (
                                                          <div>
                                                            <button
                                                              className="btn btn-dark-green fs-10px mb-1"
                                                              onClick={() => {
                                                                addStone(c, d);
                                                                dispatch(
                                                                  diamondPageChnages(
                                                                    false
                                                                  )
                                                                );
                                                              }}
                                                            >
                                                              Set Stone
                                                            </button>
                                                          </div>
                                                        ) : (
                                                          <>
                                                            <div>
                                                              <button
                                                                className="btn btn-dark-green  fs-10px mb-1"
                                                                onClick={() => {
                                                                  editStoneMultiple(
                                                                    c,
                                                                    d,
                                                                    index
                                                                  );
                                                                  dispatch(
                                                                    diamondPageChnages(
                                                                      false
                                                                    )
                                                                  );
                                                                }}
                                                              >
                                                                {" "}
                                                                Edit Stone
                                                              </button>
                                                            </div>
                                                            <div>
                                                              <button
                                                                className="btn btn-remove fs-10px mb-1"
                                                                onClick={() => {
                                                                  removeStoneMultiple(
                                                                    c,
                                                                    i,
                                                                    index
                                                                  );
                                                                  dispatch(
                                                                    diamondPageChnages(
                                                                      false
                                                                    )
                                                                  );
                                                                }}
                                                              >
                                                                Remove
                                                              </button>
                                                            </div>
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <div className="mb-3 StoneSetBox sec-bg-color">
                                              <div className="StoneSetBox_inner">
                                                <div className="stone_title">
                                                  <p className="fs-20px">
                                                    {c.no_of_stone}
                                                  </p>
                                                </div>
                                                <React.Fragment>
                                                  {c.shape.length > 0 &&
                                                    c.shape.map((a, id) => (
                                                      <div
                                                        className="StoneShapeSub"
                                                        key={`a-${id}`}
                                                      >
                                                        <i
                                                          className={`shape-color ${a.image}`}
                                                        ></i>
                                                        <p className="fs-12px fw-500">
                                                          {a.value}
                                                        </p>
                                                      </div>
                                                    ))}

                                                  <div className="StoneShapeSub">
                                                    <h5>Stone Type </h5>
                                                    <p className="fs-12px">
                                                      {c.stone_type}
                                                    </p>
                                                  </div>
                                                </React.Fragment>

                                                <React.Fragment>
                                                  <div className="bg-white  StoneSetBox_size">
                                                    <div className="StoneSetBox_size_title">
                                                      <h5>Size</h5>
                                                    </div>
                                                    <div className="StoneSetBox_size_dec">
                                                      {c.stone_size.length >
                                                        0 &&
                                                        c.stone_size.map(
                                                          (a, id) => (
                                                            <span
                                                              className="fs-12px"
                                                              key={a.key}
                                                            >
                                                              {a.key}
                                                              {id <
                                                              c.stone_size
                                                                .length -
                                                                1
                                                                ? ","
                                                                : ""}
                                                            </span>
                                                          )
                                                        )}
                                                    </div>
                                                  </div>
                                                </React.Fragment>

                                                <div className="btn-edit-remove">
                                                  {c.set_stone == "0" ? (
                                                    <div>
                                                      <button
                                                        className="btn btn-dark-green fs-10px mb-1"
                                                        onClick={() => {
                                                          addStone(c, "");
                                                        }}
                                                      >
                                                        Set Stone
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <div>
                                                        <button
                                                          className="btn btn-dark-green fs-10px mb-1"
                                                          onClick={() => {
                                                            editStoneMultiple(
                                                              c,
                                                              "",
                                                              index
                                                            );
                                                          }}
                                                        >
                                                          Edit Stone
                                                        </button>
                                                      </div>
                                                      <div>
                                                        <button
                                                          className="btn btn-remove fs-10px mb-1"
                                                          onClick={() => {
                                                            removeStoneMultiple(
                                                              c,
                                                              "",
                                                              index
                                                            );
                                                          }}
                                                        >
                                                          Remove
                                                        </button>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </React.Fragment>
                                        )}
                                      </div>
                                    ))}
                                  <div className="">
                                    {location.pathname.includes(
                                      "/start-with-a-setting"
                                    ) ? (
                                      <h2 className="fs-24px mb-6px sub-heading-title-01">
                                        Total {storeCurrencys}{" "}
                                        {numberWithCommas(
                                          (
                                            extractNumber(
                                              calculatePrice(
                                                storeSpecDatas,
                                                selectedOffer,
                                                saveEngraving,
                                                SaveEmbossing,
                                                embossingData,
                                                serviceData
                                              )
                                            ) +
                                            extractNumber(
                                              storeSelectedDiamondPrices !== ""
                                                ? storeSelectedDiamondPrices
                                                : 0
                                            )
                                          ).toFixed(2)
                                        )}
                                      </h2>
                                    ) : (
                                      <h2 className="fs-24px mb-6px sub-heading-title-01">
                                        Total {storeCurrencys}{" "}
                                        {numberWithCommas(salesTotalPrice)}
                                      </h2>
                                    )}
                                  </div>
                                  {isStoneSelected === false &&
                                  viewType == "review" &&
                                  !isItemDIY ? (
                                    <>
                                      <div className="product-form-buttons">
                                        <div className="nav-link">
                                          <button
                                            className="btn btn-add-cart my-1"
                                            onClick={() => addToCartDIY()}
                                          >
                                            ADD TO CART
                                          </button>
                                        </div>
                                      </div>
                                      {deliveryDate && !isItemDIY ? (
                                        <div className="ExpectedDelivery mt-3">
                                          <i className="ic_calendar"></i>{" "}
                                          <p>
                                            Expected Delivery Date:{" "}
                                            <span>{deliveryDate}</span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                <>
                                  {/* {selectedDiamond && (isDiamondSelected===true || isRingSelecteds===true) && (
                                                                        <div className="mb-30px">
                                                                            <div className="mb-10px d-flex align-items-center justify-content-between">
                                                                                <h2 className="fs-20px detail-sub-heading">Center Stones</h2>
                                                                            </div>

                                                                            {
                                                                                <React.Fragment>
                                                                                    {selectedDiamond && (
                                                                                        <div className="mb-3 StoneSetBox sec-bg-color">
                                                                                            <div className="StoneSetBox_inner">
                                                                                                <div className="stone_title">
                                                                                                    <p className="fs-20px">1</p>
                                                                                                </div>
                                                                                                <React.Fragment>
                                                                                                    <>
                                                                                                        {selectedDiamond.shape_name && (
                                                                                                            <div className="StoneShapeSub">
                                                                                                                <i className={`shape-color ${selectDiamond.display_image}`}></i>
                                                                                                                <p className="fs-12px fw-500">{selectedDiamond.shape_name}</p>
                                                                                                            </div>
                                                                                                            )}
                                                                                                        <div className="StoneShapeSub">
                                                                                                            <h5>Stone Type </h5>
                                                                                                            <p className="fs-12px" ><span></span><br></br><span>({selectedDiamond.st_lab} {selectedDiamond.st_cert_no})</span></p>
                                                                                                        </div>

                                                                                                        <div className="StoneShapeSub">
                                                                                                            <h5>Size</h5>
                                                                                                            <span className="fs-12px">
                                                                                                                {selectedDiamond.st_size}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="StoneShapeSub">
                                                                                                            <h5>Clarity</h5>
                                                                                                            <span className="fs-12px ml-2">
                                                                                                            {selectedDiamond.st_cla}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="StoneShapeSub">
                                                                                                            <h5>Color</h5>
                                                                                                            <span className="fs-12px ml-2">
                                                                                                            {selectedDiamond.st_col}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="StoneShapeSub">
                                                                                                            <h5>Price</h5>
                                                                                                            <span className="fs-12px ml-2 fw-500">
                                                                                                                {storeCurrencys} {selectedDiamond.ex_store_price}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                           
                                                                                                    </>
                                                                                                </React.Fragment>

                                                                                               
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </React.Fragment>
                                                                            }
                                                                        </div>
                                                                    )} */}
                                  {finalCanBeSet.length > 0 &&
                                    finalCanBeSet.map((c, index) => (
                                      <div
                                        className="mb-30px"
                                        key={`f1-${index}`}
                                      >
                                        <div className="mb-10px d-flex align-items-center justify-content-between">
                                          <h2 className="fs-20px detail-sub-heading">
                                            {c.stone_position_name} (
                                            {c.no_of_stone})
                                          </h2>
                                          {c.showing_group === true ? (
                                            <button
                                              className="btn fs-10px my-1"
                                              onClick={() => groupByStone(c)}
                                            >
                                              {c.no_of_stone_array.length}{" "}
                                              Stones
                                            </button>
                                          ) : (
                                            ""
                                          )}
                                        </div>

                                        {c.group_by == false ? (
                                          <React.Fragment>
                                            {c.no_of_stone_array.length > 0 &&
                                              c.no_of_stone_array.map(
                                                (d, i) => (
                                                  <div
                                                    className="mb-3 StoneSetBox sec-bg-color"
                                                    key={`d1-${i}`}
                                                  >
                                                    <div className="StoneSetBox_inner">
                                                      <div className="stone_title">
                                                        <p className="fs-20px">
                                                          1
                                                        </p>
                                                      </div>

                                                      <React.Fragment>
                                                        <>
                                                          {c.shape.length > 0 &&
                                                            c.shape.map(
                                                              (a, id) => (
                                                                <div
                                                                  className="StoneShapeSub"
                                                                  key={`a1-${id}`}
                                                                >
                                                                  <i
                                                                    className={` shape-color ${a.image}`}
                                                                  ></i>
                                                                  <p className="fs-12px fw-500">
                                                                    {a.value}
                                                                  </p>
                                                                </div>
                                                              )
                                                            )}

                                                          <div className="StoneShapeSub">
                                                            <h5>Stone Type </h5>
                                                            {d.set_stone ==
                                                            "0" ? (
                                                              <p className="fs-12px">
                                                                {c.stone_type}
                                                              </p>
                                                            ) : (
                                                              <p className="fs-12px">
                                                                <span>
                                                                  {c.stone_type}{" "}
                                                                </span>
                                                                <br></br>
                                                                <span>
                                                                  (
                                                                  {
                                                                    d.stone_arr[
                                                                      "st_lab"
                                                                    ]
                                                                  }{" "}
                                                                  {
                                                                    d.stone_arr[
                                                                      "st_cert_no"
                                                                    ]
                                                                  }
                                                                  )
                                                                </span>
                                                              </p>
                                                            )}
                                                          </div>

                                                          <div className="StoneShapeSub">
                                                            {d.set_stone ==
                                                            "0" ? (
                                                              <>
                                                                <h5>Size</h5>
                                                                {c.stone_size
                                                                  .length > 0 &&
                                                                  c.stone_size.map(
                                                                    (a, id) => (
                                                                      <span
                                                                        className="fs-12px"
                                                                        key={
                                                                          a.key
                                                                        }
                                                                      >
                                                                        {a.key}
                                                                        {id <
                                                                        c
                                                                          .stone_size
                                                                          .length -
                                                                          1
                                                                          ? ","
                                                                          : ""}
                                                                      </span>
                                                                    )
                                                                  )}
                                                              </>
                                                            ) : (
                                                              <>
                                                                <h5>Size</h5>
                                                                <span className="fs-12px">
                                                                  {
                                                                    d.stone_arr[
                                                                      "st_size"
                                                                    ]
                                                                  }
                                                                </span>
                                                              </>
                                                            )}
                                                          </div>

                                                          {d.set_stone ==
                                                          "0" ? (
                                                            ""
                                                          ) : (
                                                            <>
                                                              <div className="StoneShapeSub">
                                                                <h5>Clarity</h5>
                                                                <span className="fs-12px ml-2">
                                                                  {
                                                                    d.stone_arr[
                                                                      "st_cla"
                                                                    ]
                                                                  }
                                                                </span>
                                                              </div>
                                                              <div className="StoneShapeSub">
                                                                <h5>Color</h5>
                                                                <span className="fs-12px ml-2">
                                                                  {
                                                                    d.stone_arr[
                                                                      "st_col"
                                                                    ]
                                                                  }
                                                                </span>
                                                              </div>
                                                              <div className="StoneShapeSub">
                                                                <h5>Price</h5>
                                                                <span className="fs-12px ml-2 fw-500">
                                                                  {
                                                                    storeCurrencys
                                                                  }{" "}
                                                                  {
                                                                    d.stone_arr[
                                                                      "ex_store_price"
                                                                    ]
                                                                  }
                                                                </span>
                                                              </div>
                                                            </>
                                                          )}
                                                        </>
                                                      </React.Fragment>

                                                      <div className="btn-edit-remove">
                                                        {d.set_stone == "0" ? (
                                                          <div>
                                                            <button
                                                              className="btn btn-dark-green fs-10px mb-1"
                                                              onClick={() => {
                                                                addStone(c, d);
                                                                dispatch(
                                                                  diamondPageChnages(
                                                                    false
                                                                  )
                                                                );
                                                              }}
                                                            >
                                                              Set Stone
                                                            </button>
                                                          </div>
                                                        ) : (
                                                          <>
                                                            <div>
                                                              <button
                                                                className="btn btn-dark-green  fs-10px mb-1"
                                                                onClick={() => {
                                                                  editStoneMultiple(
                                                                    c,
                                                                    d,
                                                                    index
                                                                  );
                                                                  dispatch(
                                                                    diamondPageChnages(
                                                                      false
                                                                    )
                                                                  );
                                                                }}
                                                              >
                                                                {" "}
                                                                Edit Stone
                                                              </button>
                                                            </div>
                                                            <div>
                                                              <button
                                                                className="btn btn-remove fs-10px mb-1"
                                                                onClick={() => {
                                                                  removeStoneMultiple(
                                                                    c,
                                                                    i,
                                                                    index
                                                                  );
                                                                  dispatch(
                                                                    diamondPageChnages(
                                                                      false
                                                                    )
                                                                  );
                                                                }}
                                                              >
                                                                Remove
                                                              </button>
                                                            </div>
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <div className="mb-3 StoneSetBox sec-bg-color">
                                              <div className="StoneSetBox_inner">
                                                <div className="stone_title">
                                                  <p className="fs-20px">
                                                    {c.no_of_stone}
                                                  </p>
                                                </div>
                                                <React.Fragment>
                                                  {c.shape.length > 0 &&
                                                    c.shape.map((a, id) => (
                                                      <div
                                                        className="StoneShapeSub"
                                                        key={a.value}
                                                      >
                                                        <i
                                                          className={`shape-color ${a.image}`}
                                                        ></i>
                                                        <p className="fs-12px fw-500">
                                                          {a.value}
                                                        </p>
                                                      </div>
                                                    ))}
                                                  <div className="StoneShapeSub">
                                                    <h5>Stone Type </h5>
                                                    <p className="fs-12px">
                                                      {c.stone_type}
                                                    </p>
                                                  </div>
                                                </React.Fragment>

                                                <React.Fragment>
                                                  <div className="bg-white  StoneSetBox_size">
                                                    <div className="StoneSetBox_size_title">
                                                      <h5>Size</h5>
                                                    </div>
                                                    <div className="StoneSetBox_size_dec">
                                                      {c.stone_size.length >
                                                        0 &&
                                                        c.stone_size.map(
                                                          (a, id) => (
                                                            <span
                                                              className="fs-12px"
                                                              key={a.key}
                                                            >
                                                              {a.key}
                                                              {id <
                                                              c.stone_size
                                                                .length -
                                                                1
                                                                ? ","
                                                                : ""}
                                                            </span>
                                                          )
                                                        )}
                                                    </div>
                                                  </div>
                                                </React.Fragment>

                                                <div className="btn-edit-remove">
                                                  {c.set_stone == "0" ? (
                                                    <div>
                                                      <button
                                                        className="btn btn-dark-green fs-10px mb-1"
                                                        onClick={() => {
                                                          addStone(c, "");
                                                        }}
                                                      >
                                                        Set Stone
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <div>
                                                        <button
                                                          className="btn btn-dark-green fs-10px mb-1"
                                                          onClick={() => {
                                                            editStoneMultiple(
                                                              c,
                                                              "",
                                                              index
                                                            );
                                                          }}
                                                        >
                                                          Edit Stone
                                                        </button>
                                                      </div>
                                                      <div>
                                                        <button
                                                          className="btn btn-remove fs-10px mb-1"
                                                          onClick={() => {
                                                            removeStoneMultiple(
                                                              c,
                                                              "",
                                                              index
                                                            );
                                                          }}
                                                        >
                                                          Remove
                                                        </button>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </React.Fragment>
                                        )}
                                      </div>
                                    ))}
                                  <div className="">
                                    {location.pathname.includes(
                                      "/start-with-a-setting"
                                    ) ? (
                                      <h2 className="fs-24px mb-6px sub-heading-title-01">
                                        Total {storeCurrencys}{" "}
                                        {numberWithCommas(
                                          (
                                            extractNumber(finalTotal) +
                                            extractNumber(
                                              storeSelectedDiamondPrices
                                            )
                                          ).toFixed(2)
                                        )}
                                      </h2>
                                    ) : (
                                      <h2 className="fs-24px mb-6px sub-heading-title-01">
                                        Total {storeCurrencys}{" "}
                                        {numberWithCommas(salesTotalPrice)}
                                      </h2>
                                    )}
                                  </div>
                                  {isStoneSelected === false && !isItemDIY ? (
                                    <>
                                      <div className="product-form-buttons">
                                        <div className="nav-link">
                                          <button
                                            className="btn btn-add-cart my-1"
                                            onClick={() => addToCartDIY()}
                                          >
                                            ADD TO CART
                                          </button>
                                        </div>
                                      </div>
                                      {deliveryDate ? (
                                        <div className="ExpectedDelivery">
                                          <i className="ic_calendar"></i>{" "}
                                          <p>
                                            Expected Delivery Date:{" "}
                                            <span>{deliveryDate}</span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ) : isItemDIY && typeViewDiy === true ? (
                          <div className="diy-review">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                  <h3 className="diy-review-title">Review</h3>
                                </div>
                                {DiyStepersDatas && DiyStepersDatas?.length > 0
                                  ? DiyStepersDatas?.map((item, i) => {
                                      if (item.display_name === "Complete") {
                                        return;
                                      }
                                      return (
                                        <div
                                          className="diy-steper-info"
                                          key={`diy-${i}`}
                                        >
                                          <div className="diy-steper-product">
                                            {item?.image_urls?.[0] !== "" && (
                                              <img
                                                src={item?.image_urls?.[0]}
                                                width={100}
                                                height={100}
                                                alt="image"
                                                className="wh-auto"
                                              />
                                            )}
                                            <div className="diy-steper-body">
                                              <div className="diy-steper-title">
                                                {item.product_name}
                                              </div>
                                              {item.variant_sku !== "" && (
                                                <div className="diy-steper-sky">
                                                  SKU: {item.variant_sku}
                                                </div>
                                              )}
                                              {item.price !== "" && (
                                                <div className="diy-steper-price">
                                                  {DiyStepersDatas[0]?.currency}{" "}
                                                  {item.price}{" "}
                                                  {isEmpty(item.offer_code) !==
                                                  "" ? (
                                                    <span className="old-price">
                                                      {
                                                        DiyStepersDatas[0]
                                                          ?.currency
                                                      }{" "}
                                                      {item.old_price}
                                                    </span>
                                                  ) : (
                                                    ""
                                                  )}
                                                </div>
                                              )}
                                              <div className="d-flex flex-column flex-wrap gap-2">
                                                {DiySteperDatas?.length - 1 !==
                                                  i &&
                                                  item.service_json.map(
                                                    (elm, l) => {
                                                      return (
                                                        <>
                                                          {elm?.service_code ===
                                                            "ENGRAVING" &&
                                                          elm.service_type ===
                                                            "Special" &&
                                                          elm.text !== "" ? (
                                                            <div className="off_engraving">
                                                              <div className="is_Engraving">
                                                                <div className="engraving cursor-pointer">
                                                                  Engraving Text
                                                                  :{" "}
                                                                  <span
                                                                    className="text-decoration-underline"
                                                                    style={
                                                                      elm?.type ===
                                                                      "italic"
                                                                        ? {
                                                                            fontStyle:
                                                                              "italic",
                                                                          }
                                                                        : {
                                                                            fontStyle:
                                                                              "normal",
                                                                          }
                                                                    }
                                                                    onClick={() => {
                                                                      setIsItalicFont(
                                                                        elm?.type ===
                                                                          "italic"
                                                                          ? true
                                                                          : false
                                                                      );
                                                                      // setEngravingText(
                                                                      //   elm?.text
                                                                      // );
                                                                    }}
                                                                  >
                                                                    {elm?.text}
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          ) : null}
                                                          {elm?.service_code ===
                                                            "EMBOSSING" &&
                                                          elm.service_type ===
                                                            "Special" &&
                                                          elm.image?.length >
                                                            0 &&
                                                          (elm.image.some(
                                                            (img) =>
                                                              img?.embImage !==
                                                              ""
                                                          ) == true ||
                                                            elm.image?.[0]
                                                              ?.embImage !==
                                                              "") ? (
                                                            <div className="image_preview engraving">
                                                              <span className="fs-15px fw-500 ">
                                                                Embossing
                                                              </span>
                                                              <span
                                                                className="ms-1 cursor-pointer text-underline"
                                                                onClick={() => {
                                                                  setEmbossingPreviewModalView(
                                                                    true
                                                                  );
                                                                  setEmbossingPreviewModalBaseView(
                                                                    true
                                                                  );
                                                                  setActiveImg(
                                                                    elm.image
                                                                  );
                                                                }}
                                                                data-toggle="modal"
                                                                data-target="#embossingPreview"
                                                                role="button"
                                                              >
                                                                <img
                                                                  src={
                                                                    elm
                                                                      .image?.[0]
                                                                      ?.embImage
                                                                  }
                                                                  className="img-fluid wh-auto"
                                                                  alt="image"
                                                                  width={45}
                                                                  height={45}
                                                                />
                                                              </span>
                                                            </div>
                                                          ) : null}

                                                          {elm.is_selected ==
                                                          "1" ? (
                                                            <div className="service-name">
                                                              {elm.service_name}{" "}
                                                              {elm.service_rate ? (
                                                                <span className="">
                                                                  {"(" +
                                                                    extractNumber(
                                                                      elm.service_rate
                                                                    ).toFixed(
                                                                      2
                                                                    ) +
                                                                    " " +
                                                                    elm.currency +
                                                                    ")"}
                                                                </span>
                                                              ) : (
                                                                ""
                                                              )}
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </>
                                                      );
                                                    }
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="diy-steper-change">
                                            <div
                                              className={`change-links cursor-pointer`}
                                              onClick={() => {
                                                handleOnChangeDiyItem(item, i);
                                              }}
                                            >
                                              <span>Change</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  : ""}

                                <div className="total-price">
                                  {" "}
                                  Total {DiyStepersDatas[0]?.currency}{" "}
                                  {numberWithCommas(
                                    calculateTotalPrice(
                                      DiyStepersDatas
                                    ).toFixed(2)
                                  )}
                                </div>
                                <div className="product-single__addtocart">
                                  <div className="mb-3">
                                    <button
                                      className="btn"
                                      onClick={() => addToCartDIY()}
                                    >
                                      {"Add to Cart"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={styles['product-detail_right']}>
                            <div className="w-100">
                              <h2 className="sub-heading-title mb-3">
                                {Object.keys(specificationData).length > 0
                                  ? specificationData?.variant_data[0]
                                      ?.product_name
                                  : ""}
                              </h2>
                              <div className="d-flex gap-5">
                                <p className="dark-color fs-14px">
                                  {" "}
                                  <span className={styles['sku-title']}>SKU </span> :{" "}
                                  {
                                    specificationData?.variant_data[0]
                                      ?.product_sku
                                  }
                                </p>
                                {location.pathname.includes(
                                  "/start-with-a-diamond"
                                ) &&
                                (isDiamondSelected === true ||
                                  isRingSelecteds === true) ? (
                                  <span
                                    className="text-dark underline fs-15px fw-500 cursor-pointer cursor-pointer"
                                    onClick={diamondStepTwo}
                                  >
                                    Change{" "}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>

                              {isEmpty(specificationData) !== "" && (
                                <div className="weight_info mt-2">
                                  {isEmpty(
                                    specificationData["short_summary"]
                                  ) != "" ? (
                                    <>
                                      {isEmpty(
                                        specificationData["short_summary"][
                                          "gold_wt"
                                        ]
                                      ) != "" &&
                                      specificationData["short_summary"][
                                        "gold_wt"
                                      ] > 0 ? (
                                        <div className="Gold_Weight">
                                          <div className="fs-13px fw-500 mb-1">
                                            Gold Weight
                                          </div>
                                          <p className="fs-13px">
                                            <span>
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["gold_wt"]
                                              }{" "}
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["gold_wt_unit"]
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {isEmpty(
                                        specificationData["short_summary"][
                                          "dia_wt"
                                        ]
                                      ) != "" &&
                                      specificationData["short_summary"][
                                        "dia_wt"
                                      ] > 0 ? (
                                        <div className="Gold_Weight">
                                          <div className="fs-13px fw-500 mb-1">
                                            Diamond Weight
                                          </div>
                                          <p className="fs-13px">
                                            <span>
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["dia_wt"]
                                              }{" "}
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["dia_first_unit"]
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {isEmpty(
                                        specificationData["short_summary"][
                                          "col_wt"
                                        ]
                                      ) != "" &&
                                      specificationData["short_summary"][
                                        "col_wt"
                                      ] > 0 ? (
                                        <div className="Gold_Weight">
                                          <div className="fs-13px fw-500 mb-1">
                                            Gemstone Weight
                                          </div>
                                          <p className="fs-13px">
                                            <span>
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["col_wt"]
                                              }{" "}
                                              {
                                                specificationData[
                                                  "short_summary"
                                                ]["col_first_unit"]
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              )}
                            </div>
                            {selectedDiamond &&
                            (isDiamondSelected === true ||
                              isRingSelecteds === true) ? (
                              <div className="mb-30px">
                                {
                                  // location.pathname.includes("/start-with-a-diamond") ? <h5 className="fs-18px fw-600 mb-3 sub-heading-title-01 text-muted">{storeCurrencys + " " + addedRingDatas.final_total_display}</h5> : ""
                                  location.pathname.includes(
                                    "/start-with-a-diamond"
                                  ) ? (
                                    <h5 className={clsx('fs-18px fw-600 mb-3', styles['sub-heading-title-01'])}>
                                      {Object.keys(specificationData).length > 0
                                        ? // saveEngraving ?
                                          //     specificationData.engraving_price ?
                                          //         storeCurrencys + " " + (extractNumber(specificationData.final_total_display) + extractNumber(specificationData.engraving_price)).toFixed(2)
                                          //         :
                                          //         storeCurrencys + " " + isEmpty(specificationData?.final_total_display)
                                          //     :
                                          //     storeCurrencys + " " + isEmpty(specificationData?.final_total_display)
                                          specificationData.currency_symbol +
                                          " " +
                                          calculatePrice(
                                            storeSpecDatas,
                                            selectedOffer,
                                            saveEngraving,
                                            SaveEmbossing,
                                            embossingData,
                                            serviceData
                                          )
                                        : ""}
                                    </h5>
                                  ) : (
                                    ""
                                  )
                                }

                                {finalCanBeSet.length > 0 &&
                                  finalCanBeSet.map((c, index) => (
                                    <div
                                      className="mb-20px"
                                      key={c.stone_position_name}
                                    >
                                      <div className="mb-10px d-flex align-items-center justify-content-between">
                                        <h2 className="fs-20px detail-sub-heading">
                                          {c.stone_position_name} (
                                          {c.no_of_stone})
                                        </h2>
                                        {c.showing_group === true ? (
                                          <button
                                            className="btn fs-10px my-1"
                                            onClick={() => groupByStone(c)}
                                          >
                                            {c.no_of_stone_array.length} Stones
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </div>

                                      {c.group_by == false ? (
                                        <React.Fragment>
                                          {c.no_of_stone_array.length > 0 &&
                                            c.no_of_stone_array.map((d, i) => (
                                              <div
                                                className="mb-3 StoneSetBox sec-bg-color"
                                                key={`d2-${i}`}
                                              >
                                                <div className="StoneSetBox_inner">
                                                  <div className="stone_title">
                                                    <p className="fs-20px">1</p>
                                                  </div>

                                                  <React.Fragment>
                                                    <>
                                                      {c.shape.length > 0 &&
                                                        c.shape.map((a, id) => (
                                                          <div
                                                            className="StoneShapeSub"
                                                            key={a.value}
                                                          >
                                                            <i
                                                              className={` shape-color ${a.image}`}
                                                            ></i>
                                                            <p className="fs-12px fw-500">
                                                              {a.value}
                                                            </p>
                                                          </div>
                                                        ))}
                                                      <div className="StoneShapeSub">
                                                        <h5>Stone Type </h5>
                                                        {d.set_stone == "0" &&
                                                        !addedDiamondDatas.st_cert_no ? (
                                                          <p className="fs-12px">
                                                            {c.stone_type}
                                                          </p>
                                                        ) : (
                                                          <p className="fs-12px">
                                                            <span>
                                                              {c.stone_type}{" "}
                                                            </span>
                                                            <br></br>
                                                            <span>
                                                              (
                                                              {
                                                                d?.stone_arr?.[
                                                                  "st_lab"
                                                                ]
                                                              }{" "}
                                                              {
                                                                d.stone_arr?.[
                                                                  "st_cert_no"
                                                                ]
                                                              }
                                                              )
                                                            </span>
                                                          </p>
                                                        )}
                                                      </div>
                                                      <div className="StoneShapeSub">
                                                        {d.set_stone == "0" &&
                                                        !addedDiamondDatas.st_cert_no ? (
                                                          <>
                                                            <h5>Size</h5>
                                                            {c.stone_size
                                                              .length > 0 &&
                                                              c.stone_size.map(
                                                                (a, id) => (
                                                                  <span
                                                                    className="fs-12px"
                                                                    key={a.key}
                                                                  >
                                                                    {a.key}
                                                                    {id <
                                                                    c.stone_size
                                                                      .length -
                                                                      1
                                                                      ? ","
                                                                      : ""}
                                                                  </span>
                                                                )
                                                              )}
                                                          </>
                                                        ) : (
                                                          <>
                                                            <h5>Size</h5>
                                                            <span className="fs-12px">
                                                              {
                                                                d.stone_arr?.[
                                                                  "st_size"
                                                                ]
                                                              }
                                                            </span>
                                                          </>
                                                        )}
                                                      </div>
                                                      {d.set_stone == "0" &&
                                                      !addedDiamondDatas.st_cert_no ? (
                                                        ""
                                                      ) : (
                                                        <>
                                                          <div className="StoneShapeSub">
                                                            <h5>Clarity</h5>
                                                            <span className="fs-12px ml-2">
                                                              {
                                                                d.stone_arr?.[
                                                                  "st_cla"
                                                                ]
                                                              }
                                                            </span>
                                                          </div>
                                                          <div className="StoneShapeSub">
                                                            <h5>Color</h5>
                                                            <span className="fs-12px ml-2">
                                                              {
                                                                d.stone_arr?.[
                                                                  "st_col"
                                                                ]
                                                              }
                                                            </span>
                                                          </div>
                                                          <div className="StoneShapeSub">
                                                            <h5>Price</h5>
                                                            <span className="fs-14px ml-2">
                                                              <b>
                                                                {storeCurrencys}{" "}
                                                                {
                                                                  d.stone_arr?.[
                                                                    "ex_store_price"
                                                                  ]
                                                                }
                                                              </b>
                                                            </span>
                                                          </div>
                                                        </>
                                                      )}
                                                    </>
                                                  </React.Fragment>

                                                  <div className="btn-edit-remove">
                                                    {(
                                                      location.pathname.includes(
                                                        "/start-with-a-diamond"
                                                      )
                                                        ? !addedDiamondDatas.st_cert_no
                                                        : d.set_stone !== "0"
                                                    ) ? (
                                                      <div>
                                                        <button
                                                          className="btn btn-dark-green fs-10px mb-1"
                                                          onClick={() => {
                                                            addStone(c, d);
                                                            dispatch(
                                                              diamondPageChnages(
                                                                false
                                                              )
                                                            );
                                                          }}
                                                        >
                                                          Set Stone
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <div>
                                                          <button
                                                            className="btn btn-dark-green  fs-10px mb-1"
                                                            onClick={() => {
                                                              editStoneMultiple(
                                                                c,
                                                                d,
                                                                index
                                                              );
                                                              dispatch(
                                                                diamondPageChnages(
                                                                  false
                                                                )
                                                              );
                                                            }}
                                                          >
                                                            {" "}
                                                            Edit Stone
                                                          </button>
                                                        </div>
                                                        <div>
                                                          <button
                                                            className="btn btn-remove fs-10px mb-1"
                                                            onClick={() => {
                                                              removeStoneMultiple(
                                                                c,
                                                                i,
                                                                index
                                                              );
                                                              dispatch(
                                                                diamondPageChnages(
                                                                  false
                                                                )
                                                              );
                                                            }}
                                                          >
                                                            Remove
                                                          </button>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                        </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          <div className="mb-3 StoneSetBox sec-bg-color">
                                            <div className="StoneSetBox_inner">
                                              <div className="stone_title">
                                                <p className="fs-20px">
                                                  {c.no_of_stone}
                                                </p>
                                              </div>
                                              <React.Fragment>
                                                {c.shape.length > 0 &&
                                                  c.shape.map((a, id) => (
                                                    <div
                                                      className="StoneShapeSub"
                                                      key={a.value}
                                                    >
                                                      <i
                                                        className={`shape-color ${a.image}`}
                                                      ></i>
                                                      <p className="fs-12px fw-500">
                                                        {a.value}
                                                      </p>
                                                    </div>
                                                  ))}

                                                <div className="StoneShapeSub">
                                                  <h5>Stone Type </h5>
                                                  <p className="fs-12px">
                                                    {c.stone_type}
                                                  </p>
                                                </div>
                                              </React.Fragment>

                                              <React.Fragment>
                                                <div className="bg-white  StoneSetBox_size">
                                                  <div className="StoneSetBox_size_title">
                                                    <h5>Size</h5>
                                                  </div>
                                                  <div className="StoneSetBox_size_dec">
                                                    {c.stone_size.length > 0 &&
                                                      c.stone_size.map(
                                                        (a, id) => (
                                                          <span
                                                            className="fs-12px"
                                                            key={a.key}
                                                          >
                                                            {a.key}
                                                            {id <
                                                            c.stone_size
                                                              .length -
                                                              1
                                                              ? ","
                                                              : ""}
                                                          </span>
                                                        )
                                                      )}
                                                  </div>
                                                </div>
                                              </React.Fragment>

                                              <div className="btn-edit-remove">
                                                {c.set_stone == "0" ? (
                                                  <div>
                                                    <button
                                                      className="btn btn-dark-green fs-10px mb-1"
                                                      onClick={() => {
                                                        addStone(c, "");
                                                      }}
                                                    >
                                                      Set Stone
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div>
                                                      <button
                                                        className="btn btn-dark-green fs-10px mb-1"
                                                        onClick={() => {
                                                          editStoneMultiple(
                                                            c,
                                                            "",
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        Edit Stone
                                                      </button>
                                                    </div>
                                                    <div>
                                                      <button
                                                        className="btn btn-remove fs-10px mb-1"
                                                        onClick={() => {
                                                          removeStoneMultiple(
                                                            c,
                                                            "",
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        Remove
                                                      </button>
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )}
                                    </div>
                                  ))}
                                {/* <div className="mb-10px d-flex align-items-center justify-content-between">
                                                                    <h2 className="fs-20px detail-sub-heading">Center Stones</h2>
                                                                </div> */}

                                {/* {
                                                                    <React.Fragment>
                                                                        {Object.keys(selectedDiamond).length > 0 ? (
                                                                            <div className="mb-3 StoneSetBox sec-bg-color">
                                                                                <div className="StoneSetBox_inner">
                                                                                    <div className="stone_title">
                                                                                        <p className="fs-20px">1</p>
                                                                                    </div>
                                                                                    <React.Fragment>
                                                                                        <>
                                                                                            {selectedDiamond.shape_name && (
                                                                                                <div className="StoneShapeSub">
                                                                                                    <i className={`shape-color`}><img src={selectedDiamond.display_image}/></i>
                                                                                                    <p className="fs-12px fw-500">{selectedDiamond.shape_name}</p>
                                                                                                </div>
                                                                                                )}
                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Stone Type </h5>
                                                                                                <p className="fs-12px"><span>Lab Grown Diamond</span><br></br><span>({selectedDiamond.st_lab} {selectedDiamond.st_cert_no})</span></p>
                                                                                            </div>

                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Size</h5>
                                                                                                <span className="fs-12px">
                                                                                                    {selectedDiamond.st_size}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Clarity</h5>
                                                                                                <span className="fs-12px ml-2">
                                                                                                {selectedDiamond.st_cla}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Color</h5>
                                                                                                <span className="fs-12px ml-2">
                                                                                                {selectedDiamond.st_col}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Price</h5>
                                                                                                <span className="fs-14px ml-2 fw-500">
                                                                                                   <b>{storeCurrencys} {selectedDiamond.ex_store_price}</b> 
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="StoneShapeSub">
                                                                                                <div className="btn-edit-remove">
                                                                                                     <button className="btn btn-dark-green  fs-10px mb-1" onClick={diamondStepFirst}>Edit</button>
                                                                                                </div>
                                                                                                <div  className="btn-edit-remove">
                                                                                                    <button className="btn btn-remove fs-10px mb-1" onClick={handleRemoveDiamond}>Remove</button>
                                                                                                </div>
                                                                                            </div>
                                                                                                
                                                                                        </>
                                                                                    </React.Fragment>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mb-3 StoneSetBox sec-bg-color">
                                                                                <div className="StoneSetBox_inner">
                                                                                    <div className="stone_title">
                                                                                        <p className="fs-20px">1</p>
                                                                                    </div>
                                                                                    <React.Fragment>
                                                                                        <>
                                                                                            {diamondImages !== "" && (
                                                                                                <div className="StoneShapeSub">
                                                                                                    <i className={`shape-color`}><img src={diamondImages}/></i>
                                                                                                    <p className="fs-12px fw-500">{diamondShapes}</p>
                                                                                                </div>
                                                                                                )}
                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Stone Type </h5>
                                                                                                <p className="fs-12px"><span>Lab Grown Diamond</span></p>
                                                                                            </div>

                                                                                            <div className="StoneShapeSub">
                                                                                                <h5>Size</h5>
                                                                                                <span className="fs-12px">
                                                                                                    1.00 - 1.49
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="StoneShapeSub">
                                                                                                <div  className="btn-edit-remove">
                                                                                                    <button className="btn btn-remove fs-10px mb-1" onClick={()=>handleSetDiamond()}>Set Stone</button>
                                                                                                </div>
                                                                                            </div>
                                                                                                
                                                                                        </>
                                                                                    </React.Fragment>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                        )}
                                                                    </React.Fragment>
                                                                } */}
                              </div>
                            ) : (
                              filterProduct.length > 0 &&
                              filterProduct.map((e, i) => {
                                let arr = [];
                                e.dropdown &&
                                  e.dropdown.map((val) => {
                                    const obj = {
                                      key: val.key,
                                      value: val.value,
                                      color: val.color_code,
                                      title: e.title,
                                      icon: val.icon,
                                      is_available: val.is_available,
                                    };
                                    arr.push(obj);
                                    return val;
                                  });
                                return (
                                  e.dropdown.length > 0 &&
                                  e.is_visible != 0 && (
                                    <div className="w-100" key={e.title}>
                                      <h4 className="product-detail-title">
                                        {e.title}
                                      </h4>
                                      <div className={styles['pjewelry-type']}>
                                        {e.key !==
                                          "master_primary_metal_type" &&
                                          e.key !== "master_gh_shape" && (
                                            <div className="d-flex flex-wrap gap-2">
                                              {e.dropdown.map((val, index) => {
                                                return val.color_code === "" ? (
                                                  <div key={val.key} className={styles['side-stone-shape']} >
                                                    <div onClick={() => { if (e.selectedvalue !== val.key ) {  appliedFilter(e, val); } }}
                                                      className={clsx(val.icon !== '' ? styles['images-li'] : styles['maxWidth'],val.is_available === 0 && styles['filter-disable'],val.icon && styles['master_stone_shape'])}
                                                    >
                                                      <div className={clsx(styles['shank-btn'],e.selectedvalue === val.key && styles['active'])}>
                                                        {val.key == "master_gh_shape" && val.key == "master_stone_shape" ? (
                                                          <div className={styles['gh_shape']}>
                                                            <img
                                                              alt="image"
                                                              className="w-100 card-img-top wh-auto"
                                                              src={val.icon}
                                                              width={40}
                                                              height={40}
                                                            />
                                                          </div>
                                                        ) : isEmpty(
                                                            val.icon
                                                          ) !== "" ? (
                                                          <div className={styles['gh_shape']}>
                                                            <i
                                                              className={`${val.icon}`}
                                                            ></i>
                                                          </div>
                                                        ) : (
                                                          ""
                                                        )}
                                                        <span>{val.value}</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div key={val.key}>
                                                    <div onClick={() => { if (e.selectedvalue !== val.key ) {appliedFilter(e, val);}}}
                                                      className={clsx(val.icon !== '' ? styles['images-li'] : styles['maxWidth'])}
                                                    >
                                                      {val.icon !== "" ? (
                                                        <div className={clsx(styles['shank-btn'], e.selectedvalue === val.key && styles['active'])} >
                                                          <img
                                                            alt="image"
                                                            className="img-fluid wh-auto"
                                                            src={val.icon}
                                                            width={40}
                                                            height={40}
                                                          />
                                                        </div>
                                                      ) : (
                                                        ""
                                                      )}
                                                      <div className={clsx(styles['shank-btn'], e.selectedvalue === val.key && styles['active'])}>
                                                        {val.value}
                                                        {isEmpty(
                                                          val.color_code
                                                        ) !== "" && (
                                                          <div
                                                            className={clsx(styles['rectangle-color1'], 'me-2')}
                                                            style={{
                                                              backgroundColor:
                                                                val.color_code,
                                                              borderColor:
                                                                val.color_code,
                                                            }}
                                                          ></div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              })}{" "}
                                            </div>
                                          )}
                                        {e.key !==
                                          "master_primary_metal_type" &&
                                          e.key === "master_gh_shape" && (
                                            <div
                                              className={`swiper-theme ${
                                                e.dropdown.length > 5
                                                  ? "sliderActive"
                                                  : ""
                                              }`}
                                            >
                                              <Swiper
                                                modules={[Navigation]}
                                                spaceBetween={10}
                                                navigation={{
                                                  nextEl: `.next-${e.key}`,
                                                  prevEl: `.prev-${e.key}`,
                                                }}
                                                breakpoints={{
                                                  0: { slidesPerView: 4 },
                                                  1400: { slidesPerView: 5 },
                                                }}
                                                loop={false}
                                              >
                                                {arr.map((e1) => (
                                                  <SwiperSlide key={e1.key}>
                                                    <div
                                                      className={`shank-btn d-flex align-items-center justify-content-center flex-column ${ e.selectedvalue === e1.key ? "active" : "" } ${ e1.icon ? "master_stone_shape" : "" } ${isEmpty( e1.is_available) === 0
                                                          ? "filter-disable" : ""
                                                      }`}
                                                      onClick={() =>
                                                        e.selectedvalue !==
                                                        e1.key
                                                          ? appliedFilter(e, e1)
                                                          : ""
                                                      }
                                                    >
                                                      {isEmpty(e1.icon) !==
                                                        "" && (
                                                        <div className="gh_shape">
                                                          {e.key !==
                                                            "master_gh_shape" &&
                                                          e.key !==
                                                            "master_stone_shape" ? (
                                                            <img
                                                              alt={e1.value}
                                                              className="img-fluid head-prong wh-auto"
                                                              src={e1.icon}
                                                              width={40}
                                                              height={40}
                                                            />
                                                          ) : (
                                                            <i
                                                              className={`${e1.icon}`}
                                                            ></i>
                                                          )}
                                                        </div>
                                                      )}
                                                      <div className="py10-py-12">
                                                        {e1.color && (
                                                          <div
                                                            className="rectangle-color1 me-2"
                                                            style={{
                                                              backgroundColor:
                                                                e1.color,
                                                            }}
                                                          ></div>
                                                        )}
                                                        {e1.value && (
                                                          <div className="fs-12px">
                                                            {e1.value}
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </SwiperSlide>
                                                ))}
                                              </Swiper>
                                              <div
                                                className={`swiper-nav prev-${e.key}`}
                                              >
                                                <i className="ic_chavron_left"></i>
                                              </div>
                                              <div
                                                className={`swiper-nav next-${e.key}`}
                                              >
                                                <i className="ic_chavron_right"></i>
                                              </div>
                                            </div>
                                          )}

                                        {e.key ===
                                          "master_primary_metal_type" &&
                                          e.key !== "master_gh_shape" && (
                                            <div
                                              className={`swiper-theme ${
                                                e.dropdown.length > 5
                                                  ? "sliderActive"
                                                  : ""
                                              }`}
                                            >
                                              <Swiper
                                                modules={[Navigation]}
                                                spaceBetween={10}
                                                navigation={{
                                                  nextEl: `.next-${e.key}`,
                                                  prevEl: `.prev-${e.key}`,
                                                }}
                                                breakpoints={{
                                                  0: { slidesPerView: 3 },
                                                  1400: { slidesPerView: 5 },
                                                }}
                                                loop={false}
                                              >
                                                {arr.map((e1) => (
                                                  <SwiperSlide key={e1.key}>
                                                    <div
                                                      className={`shank-btn d-flex align-items-center justify-content-center flex-column ${
                                                        e.selectedvalue ===
                                                        e1.key
                                                          ? "active"
                                                          : ""
                                                      } ${
                                                        e1.icon
                                                          ? "master_stone_shape"
                                                          : ""
                                                      } ${
                                                        isEmpty(
                                                          e1.is_available
                                                        ) === 0
                                                          ? "filter-disable"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        e.selectedvalue !==
                                                        e1.key
                                                          ? appliedFilter(e, e1)
                                                          : ""
                                                      }
                                                    >
                                                      {isEmpty(e1.icon) !==
                                                        "" && (
                                                        <div className="gh_shape">
                                                          {e.key !==
                                                            "master_gh_shape" &&
                                                          e.key !==
                                                            "master_stone_shape" ? (
                                                            <img
                                                              alt={e1.value}
                                                              className="img-fluid head-prong wh-auto"
                                                              src={e1.icon}
                                                              width={40}
                                                              height={40}
                                                            />
                                                          ) : (
                                                            <i
                                                              className={`${e1.icon}`}
                                                            ></i>
                                                          )}
                                                        </div>
                                                      )}
                                                      <div className="py10-py-12">
                                                        {e1.color && (
                                                          <div
                                                            className="rectangle-color1 me-2"
                                                            style={{
                                                              backgroundColor:
                                                                e1.color,
                                                            }}
                                                          ></div>
                                                        )}
                                                        {e1.value && (
                                                          <>
                                                            {isEmpty(
                                                              e1.value.split(
                                                                " "
                                                              )[1]
                                                            ) !== "" && (
                                                              <span className="fs-12px">
                                                                {
                                                                  e1.value.split(
                                                                    " "
                                                                  )[1]
                                                                }
                                                              </span>
                                                            )}
                                                            {isEmpty(
                                                              e1.value.split(
                                                                " "
                                                              )[2]
                                                            ) !== "" && (
                                                              <span className="fs-12px">
                                                                {
                                                                  e1.value.split(
                                                                    " "
                                                                  )[2]
                                                                }
                                                              </span>
                                                            )}
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </SwiperSlide>
                                                ))}
                                              </Swiper>
                                              <div
                                                className={`swiper-nav prev-${e.key}`}
                                              >
                                                <i className="ic_chavron_left"></i>
                                              </div>
                                              <div
                                                className={`swiper-nav next-${e.key}`}
                                              >
                                                <i className="ic_chavron_right"></i>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )
                                );
                              })
                            )}

                            {serviceData && serviceData?.length > 0 && (
                              <div className="product-services w-100">
                                <h6 className="product-services-title mb-2">
                                  Services
                                </h6>
                                <div className="d-flex flex-column gap-2">
                                  {serviceData?.length > 0 &&
                                    serviceData?.map((item, i) => {
                                      return (
                                        <React.Fragment key={item.service_code}>
                                          {item &&
                                          item.service_code === "ENGRAVING" &&
                                          item.service_type === "Special" ? (
                                            <OutsideClickHandler
                                              onOutsideClick={() =>
                                                handleCloseEngraving()
                                              }
                                            >
                                              <div className="EngravingTextRing">
                                                {engravingTexts.length > 0 ? (
                                                  <div className="Engravingtitle">
                                                    <div
                                                      className="btnLink"
                                                      onClick={() => {
                                                        setIsEngraving(
                                                          !isEngraving
                                                        );
                                                      }}
                                                    >
                                                      {/* <i className="ic_plus me-2"></i> */}
                                                      <span>
                                                        Engraving Text :{" "}
                                                        {engravingTexts}
                                                      </span>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="Engravingtitle">
                                                    <div
                                                      className="btnLink"
                                                      onClick={() => {
                                                        setIsEngraving(
                                                          !isEngraving
                                                        );
                                                      }}
                                                    >
                                                      <i className="ic_plus me-2"></i>
                                                      <span>Add Engraving</span>
                                                    </div>
                                                  </div>
                                                )}

                                                {isEngraving ? (
                                                  <div className="EngravingPopup">
                                                    <div
                                                      className="ClosePopup"
                                                      onClick={() => {
                                                        handleCloseEngraving();
                                                      }}
                                                    >
                                                      <i className="ic_remove btn-close-xs position-absolute top-0 end-0 "></i>
                                                    </div>
                                                    <div>
                                                      <div className="EngravingPopupTitle">
                                                        Enter Engraving{" "}
                                                        {item.service_rate ? (
                                                          <span className="fw-semibold">
                                                            {"(" +
                                                              numberWithCommas(
                                                                extractNumber(
                                                                  item.service_rate
                                                                ).toFixed(2)
                                                              ) +
                                                              " " +
                                                              item.msrv_currency +
                                                              ")"}
                                                          </span>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </div>
                                                      <div className="EngravingPopupInput">
                                                        <input
                                                          ref={inputRef}
                                                          placeholder="Enter Engraving"
                                                          className="w-100 line-normal form-control text-description"
                                                          type="text"
                                                          name="engravingText"
                                                          maxLength={
                                                            item.max_character
                                                              ? parseInt(
                                                                  item.max_character
                                                                )
                                                              : 8
                                                          }
                                                          autoComplete="off"
                                                          onChange={(e) =>
                                                            setEngravingText(
                                                              e.target.value
                                                            )
                                                          }
                                                          value={engravingText}
                                                        />
                                                        <main className="d-flex justify-content-between">
                                                          <div className="fs-11px">
                                                            <span className="pe-2">
                                                              Min :{" "}
                                                              {
                                                                item.min_character
                                                              }
                                                            </span>
                                                            <span>
                                                              Max :{" "}
                                                              {
                                                                item.max_character
                                                              }
                                                            </span>
                                                          </div>
                                                          <div className="fs-11px">
                                                            Characters Left:{" "}
                                                            {item.max_character
                                                              ? parseInt(
                                                                  item.max_character
                                                                ) -
                                                                engravingText.length
                                                              : ""}
                                                          </div>
                                                        </main>
                                                      </div>
                                                      <div className="ChooseFontFamily">
                                                        <h6 className="EngravingPopupTitle my-2">
                                                          Choose Font Family
                                                        </h6>
                                                        <div className="py-1">
                                                          <i
                                                            style={{
                                                              fontStyle:
                                                                "normal",
                                                            }}
                                                            className={`me-1  cursor-pointer p-1 border border-black fw-normal fs-7 ${
                                                              isItalicFont
                                                                ? "border-1"
                                                                : "border-1 borderdark "
                                                            }`}
                                                            onClick={() =>
                                                              setIsItalicFont(
                                                                false
                                                              )
                                                            }
                                                          >
                                                            Aa
                                                          </i>
                                                          <i
                                                            style={{
                                                              fontStyle:
                                                                "italic",
                                                            }}
                                                            className={`ms-1  cursor-pointer p-1 border border-black fs-7 ${
                                                              isItalicFont
                                                                ? "border-1 borderdark p-1"
                                                                : "border-1"
                                                            }`}
                                                            onClick={() =>
                                                              setIsItalicFont(
                                                                true
                                                              )
                                                            }
                                                          >
                                                            Aa
                                                          </i>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="EngravingPopupPreview">
                                                      <p className="EngravingPopupTitle my-2">
                                                        Preview
                                                      </p>
                                                      {specificationData
                                                        .variant_data?.[0]
                                                        ?.vertical_short_code ===
                                                      "JEWEL" ? (
                                                        <div className="engraving-ring ">
                                                          <div className="fs-6">
                                                            <svg viewBox="0 0 248 120">
                                                              <path
                                                                id="SVGID_x5F_2_x5F_"
                                                                d="M0,80 Q124,32 248,80"
                                                                fill="transparent"
                                                              ></path>
                                                              <text textAnchor="middle">
                                                                <textPath
                                                                  href="#SVGID_x5F_2_x5F_"
                                                                  startOffset="50%"
                                                                >
                                                                  <tspan
                                                                    style={{
                                                                      fontStyle:
                                                                        isItalicFont
                                                                          ? "italic"
                                                                          : "normal",
                                                                      fontSize: `${item?.font_size}px`,
                                                                      letterSpacing:
                                                                        "1px",
                                                                      textShadow:
                                                                        "#979696 1px 1px",
                                                                    }}
                                                                    xlinkHref="#SVGID_x5F_2_x5F_"
                                                                  >
                                                                    {
                                                                      engravingText
                                                                    }
                                                                  </tspan>
                                                                </textPath>
                                                              </text>
                                                            </svg>
                                                          </div>
                                                        </div>
                                                      ) : (
                                                        <div
                                                          className={`engravingBox ${
                                                            specificationData
                                                              .variant_data?.[0]
                                                              ?.vertical_short_code ===
                                                            "FRAME"
                                                              ? "engraving-frame"
                                                              : "engraving-all"
                                                          }`}
                                                        >
                                                          <p
                                                            className="m-0"
                                                            style={{
                                                              fontStyle:
                                                                isItalicFont
                                                                  ? "italic"
                                                                  : "normal",
                                                              fontSize: `${item?.font_size}px`,
                                                            }}
                                                          >
                                                            {engravingText}
                                                          </p>
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="EngravingBtn mt-2 text-end">
                                                      <button
                                                        className="btn p-0 px-3 py-2"
                                                        onClick={() =>
                                                          handleSaveEngraving(
                                                            item
                                                          )
                                                        }
                                                      >
                                                        Save
                                                      </button>
                                                    </div>
                                                    {/* <i className="EngravingIcon"></i> */}
                                                  </div>
                                                ) : null}
                                              </div>
                                            </OutsideClickHandler>
                                          ) : (
                                            <></>
                                          )}

                                          {item.service_code === "EMBOSSING" &&
                                          item.service_type === "Special" &&
                                          item.image !== "" &&
                                          specificationData?.variant_data?.[0]
                                            ?.image_area?.length > 0 &&
                                          embossingArea?.filter(
                                            (item) => item !== ""
                                          )?.length > 0 ? (
                                            <div className="EngravingClick">
                                              <div>
                                                <div
                                                  className="EngravingTextRing"
                                                  onClick={() => {
                                                    setEmbossingModalView(true);
                                                  }}
                                                  data-toggle="modal"
                                                  data-target="#setEmbossing"
                                                  role="button"
                                                >
                                                  <div className="Engravingtitle">
                                                    {SaveEmbossing === false ? (
                                                      <div className="btnLink">
                                                        <i className="ic_plus me-2"></i>
                                                        <span>
                                                          Add Embossing
                                                        </span>
                                                      </div>
                                                    ) : (
                                                      <div className="btnLink">
                                                        {/* <i className="ic_plus me-2"></i> */}
                                                        <span>Embossing</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div>
                                                <div className="preview-img ms-2">
                                                  <div
                                                    onClick={() => {
                                                      setEmbossingPreviewModalView(
                                                        true
                                                      );
                                                      setEmbossingPreviewModalBaseView(
                                                        true
                                                      );
                                                      // setActiveImg(item.image);
                                                    }}
                                                    data-toggle="modal"
                                                    data-target="#embossingPreview"
                                                    role="button"
                                                  >
                                                    <img
                                                      alt="Embossing image"
                                                      src={
                                                        previewImageData?.[0]
                                                          ?.embImage ??
                                                        specificationData
                                                          ?.variant_data?.[0]
                                                          ?.image_urls[0]
                                                      }
                                                      className="engravingimage img-fluid wh-auto"
                                                      width={43}
                                                      height={43}
                                                    />
                                                    <span>Preview</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}

                                          {item.service_type === "Normal" && (
                                            <div
                                              className="form-check mb-0"
                                              key={item.service_code}
                                            >
                                              <input
                                                className="form-check-input form-check-input_fill"
                                                type="checkbox"
                                                checked={
                                                  item.is_selected === "1"
                                                }
                                                onChange={() =>
                                                  onChangeService(item, i)
                                                }
                                              />
                                              <label
                                                className="form-check-label"
                                                // htmlFor={`service_${item.service_code}`}
                                              >
                                                {item.service_name}
                                              </label>
                                              {item.service_rate ? (
                                                <span className="fw-500">
                                                  {"(" +
                                                    numberWithCommas(
                                                      extractNumber(
                                                        item.service_rate
                                                      ).toFixed(2)
                                                    ) +
                                                    " " +
                                                    item.msrv_currency +
                                                    ")"}
                                                </span>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {specificationData.offers &&
                            specificationData.offers.length > 0 ? (
                              <div className="AvailableOffers w-100">
                                <div
                                  className={`${
                                    isOffers ? "hidden" : ""
                                  } mb-5px`}
                                >
                                  <div
                                    className="btnLink"
                                    onClick={() => setIsOffers(!isOffers)}
                                  >
                                    Available Offers
                                  </div>
                                </div>
                                {isOffers &&
                                  specificationData.offers.map((offer, h) => {
                                    const isOfferApplied = selectedOffer.some(
                                      (item) =>
                                        item?.coupon_code === offer?.coupon_code
                                    );

                                    return (
                                      <div
                                        className="AppliedSuccessfully border p-2 fs-13px"
                                        key={h}
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="offer-section">
                                            <i className="ic_gift offer-icon"></i>
                                            {isOfferApplied ? (
                                              <span className="d-flex align-items-center flex-wrap">
                                                Coupon code&nbsp;
                                                <b>{offer.coupon_code}</b>{" "}
                                                &nbsp;Applied Successfully.
                                              </span>
                                            ) : (
                                              <>
                                                <span>
                                                  {`GET ${
                                                    offer.discount
                                                  } ${offer.offer_type.replace(
                                                    "PERCENTAGE",
                                                    "%"
                                                  )} DISCOUNT`}{" "}
                                                </span>
                                                <label className="fw-600">
                                                  Save {storeCurrencys}{" "}
                                                  {offer.discount_price}
                                                </label>
                                              </>
                                            )}
                                          </div>
                                          <div className="offer-links">
                                            {isOfferApplied ? (
                                              <div
                                                className="links-btn cursor-pointer"
                                                onClick={() =>
                                                  handleAppliedCode(offer, h)
                                                }
                                              >
                                                Remove
                                              </div>
                                            ) : (
                                              <div
                                                className="links-btn cursor-pointer"
                                                onClick={() =>
                                                  handleCouponApply(offer, h)
                                                }
                                              >
                                                Apply
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="product-total w-100">
                              {selectedDiamond &&
                              (isDiamondSelected === true ||
                                isRingSelecteds === true) ? (
                                <h2 className={clsx(styles['sub-heading-title-01'], 'fs-24px mb-2')}>
                                  Total {specificationData.currency_symbol}{" "}
                                  {numberWithCommas(
                                    (
                                      extractNumber(
                                        calculatePrice(
                                          storeSpecDatas ?? specificationData,
                                          selectedOffer,
                                          saveEngraving,
                                          SaveEmbossing,
                                          embossingData,
                                          serviceData
                                        )
                                      ) +
                                      extractNumber(
                                        addedDiamondDatas.final_total_display
                                      )
                                    ).toFixed(2)
                                  )}
                                  {/* {Object.keys(productData).length > 0 ?
                                                                        saveEngraving ?
                                                                            specificationData.engraving_price ?
                                                                                storeCurrencys + " " + numberWithCommas(isEmpty((extractNumber(storeSpecDatas.final_total_display ?? specificationData.final_total_display) + extractNumber(specificationData.engraving_price.toString()) + extractNumber(addedDiamondDatas.final_total_display))).toFixed(2))
                                                                                :
                                                                                storeCurrencys + " " + numberWithCommas(isEmpty(extractNumber(storeSpecDatas.final_total_display ?? specificationData?.final_total_display) + extractNumber(addedDiamondDatas.final_total_display)).toFixed(2))
                                                                            :
                                                                            storeCurrencys + " " + numberWithCommas(isEmpty(extractNumber(storeSpecDatas.final_total_display ?? specificationData?.final_total_display) + extractNumber(addedDiamondDatas.final_total_display)).toFixed(2))
                                                                        :
                                                                        ""} */}
                                </h2>
                              ) : isEmpty(
                                  calculatePrice(
                                    specificationData,
                                    selectedOffer,
                                    saveEngraving,
                                    SaveEmbossing,
                                    embossingData,
                                    serviceData
                                  )
                                ) !== "" ? (
                                <h2 className={clsx(styles['sub-heading-title-01'], 'fs-24px mb-2')}>
                                  {specificationData.currency_symbol}{" "}
                                  {calculatePrice(
                                    specificationData,
                                    selectedOffer,
                                    saveEngraving,
                                    SaveEmbossing,
                                    embossingData,
                                    serviceData
                                  )}{" "}
                                  {selectedOffer[0] !== undefined ? (
                                    <span className={clsx(styles['singleoffer-price'], 'ms-1')}>
                                      {storeCurrencys}{" "}
                                      {calculatePrice(
                                        specificationData,
                                        [],
                                        saveEngraving,
                                        SaveEmbossing,
                                        embossingData,
                                        serviceData
                                      )}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {specificationData?.store_tax_included_in_price ===
                                  "1" ? (
                                    <>
                                      <span className="inclusive ms-1" >
                                        (Inclusive of all taxes)
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </h2>
                              ) : (
                                ""
                              )}
                            </div>

                            {isItemDIY === true && (
                              <div
                                className="btn"
                                onClick={(e) => handleSetItemsDIY(e)}
                              >
                                {"Set Items"}
                              </div>
                            )}
                            {!isItemDIY && (
                              <div className={clsx(styles['product-form-buttons'], 'w-100')}>
                                {location.pathname.includes(
                                  "/start-with-a-diamond"
                                ) ? (
                                  isRingSelecteds === false ? (
                                    <div className={clsx(styles["nav-link"],styles["half-button"])}>
                                      <button
                                        className={clsx("btn fw-500 me-2 my-1", styles["btn-add-cart"])}
                                        onClick={() => {
                                          handleSetCompleteRing();
                                        }}
                                      >
                                        {verticalCode == "LGDIA"
                                          ? "SELECT THIS RING"
                                          : "SELECT THIS RING"}
                                      </button>
                                    </div>
                                  ) : (
                                    (isDiamondSelected === true ||
                                      isRingSelecteds === true) &&
                                    IsSelectedDiamonds === true && (
                                      <div className={clsx(styles["nav-link"],styles["half-button"])}>
                                        <button
                                          className={clsx("btn my-1", styles["btn-add-cart"])}
                                          onClick={() => addToCart()}
                                        >
                                          ADD TO CART
                                        </button>
                                      </div>
                                    )
                                  )
                                ) : paramsItem === "DIY" ? (
                                  <div className={clsx(styles["nav-link"],styles["half-button"])}>
                                    <button
                                      className={clsx("btn", styles["btn-add-cart"])}
                                      onClick={() => {
                                        setStoneModal("");
                                        dispatch(diamondPageChnages(false));
                                        dispatch(
                                          storeSpecData(specificationData)
                                        );
                                        dispatch(
                                          storeProdData(specificationData)
                                        );
                                        setProductSKU(
                                          specificationData?.variant_data?.[0]
                                            ?.product_sku
                                        );
                                        setFinalTotal(
                                          specificationData?.final_total_display
                                        );
                                        dispatch(
                                          jeweleryDIYName(
                                            specificationData?.variant_data[0]
                                              ?.product_name
                                          )
                                        );
                                        dispatch(
                                          jeweleryDIYimage(
                                            specificationData?.images[0]
                                          )
                                        );
                                        dispatch(diamondNumber(""));
                                      }}
                                    >
                                      {complete
                                        ? "SELECT THIS RING"
                                        : "SET STONES"}
                                    </button>
                                  </div>
                                ) : (
                                  <div className={clsx(styles["nav-link"],styles["half-button"])}>
                                    <button
                                      className={clsx("btn", styles["btn-add-cart"])}
                                      onClick={() => addToCart()}
                                    >
                                      ADD TO CART
                                    </button>
                                    {/* {isEmpty(specificationData.diy_bom_id) != '' ?
                                                                                    <button className="btn btn-add-cart my-1" onClick={() => { setStoneModal('true'); dispatch(diamondPageChnages(false)) }}>{complete ? "SELECT THIS RING" : "SET STONES"}</button>
                                                                                    : ''} */}
                                  </div>
                                )}
                                {location.pathname.includes(
                                  "/start-with-a-diamond"
                                ) ? (
                                  IsSelectedDiamonds === true ? (
                                    <div className={styles["like-btn"]}>
                                      {favData.add_to_favourite === 0 ? (
                                        <React.Fragment>
                                          {favLoader[
                                            specificationData.item_id
                                          ] !== undefined &&
                                          favLoader[
                                            specificationData.item_id
                                          ] === true ? (
                                            <div
                                              className={styles["spinner-border"]}
                                              role="status"
                                            >
                                              <span className="visually-hidden">
                                                Loading...
                                              </span>
                                            </div>
                                          ) : (
                                            <div
                                              className={styles["heart-icon"]}
                                              onClick={(event) =>
                                                addDeleteFavourite(
                                                  specificationData,
                                                  event,
                                                  "0"
                                                )
                                              }
                                            >
                                              <i className="ic_heart fs-20px"></i>
                                              Add to Wishlist
                                            </div>
                                          )}
                                        </React.Fragment>
                                      ) : (
                                        <React.Fragment>
                                          {favLoader[
                                            specificationData.item_id
                                          ] !== undefined &&
                                          favLoader[
                                            specificationData.item_id
                                          ] === true ? (
                                            <div
                                              className="spinner-border"
                                              role="status"
                                            >
                                              <span className="visually-hidden">
                                                Loading...
                                              </span>
                                            </div>
                                          ) : (
                                            <div className={styles["heart-icon"]}
                                              onClick={(event) =>
                                                addDeleteFavourite(
                                                  specificationData,
                                                  event,
                                                  "1"
                                                )
                                              }
                                            >
                                              <i className="ic_heart_fill fs-20px"></i>
                                              Add to Wishlist
                                            </div>
                                          )}
                                        </React.Fragment>
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  <div className={styles["like-btn"]}>
                                    {favData.add_to_favourite === 0 ? (
                                      <React.Fragment>
                                        {favLoader[
                                          specificationData.item_id
                                        ] !== undefined &&
                                        favLoader[specificationData.item_id] ===
                                          true ? (
                                          <div
                                            className={styles["spinner-border"]}
                                            role="status"
                                          >
                                            <span className="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <div
                                            className={styles["heart-icon"]}
                                            onClick={(event) =>
                                              addDeleteFavourite(
                                                specificationData,
                                                event,
                                                "0"
                                              )
                                            }
                                          >
                                            <i className="ic_heart fs-20px"></i>
                                            Add to Wishlist
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        {favLoader[
                                          specificationData.item_id
                                        ] !== undefined &&
                                        favLoader[specificationData.item_id] ===
                                          true ? (
                                          <div
                                            className="spinner-border"
                                            role="status"
                                          >
                                            <span className="visually-hidden">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <div
                                            className={styles["heart-icon"]}
                                            onClick={(event) =>
                                              addDeleteFavourite(
                                                specificationData,
                                                event,
                                                "1"
                                              )
                                            }
                                          >
                                            <i className="ic_heart_fill fs-20px"></i>
                                            Add to Wishlist
                                          </div>
                                        )}
                                      </React.Fragment>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {location.pathname.includes(
                              "/start-with-a-diamond"
                            ) ? (
                              deliveryDate &&
                              activeDIYtabss === "Complete" &&
                              IsSelectedDiamonds === true ? (
                                <div className={styles["ExpectedDelivery"]}>
                                  <i className="ic_calendar"></i>{" "}
                                  <p>
                                    Expected Delivery Date:{" "}
                                    <span>{deliveryDate}</span>
                                  </p>
                                </div>
                              ) : (
                                ""
                              )
                            ) : deliveryDate ? (
                              <div className={styles["ExpectedDelivery"]}>
                                <i className="ic_calendar"></i>{" "}
                                <p>
                                  Expected Delivery Date:{" "}
                                  <span>{deliveryDate}</span>
                                </p>
                              </div>
                            ) : (
                              ""
                            )}

                            {productBreakupData &&
                              isEmpty(productBreakupData?.totalPrice) !== 0 &&
                              paramsItem === "PRODUCT" && (
                                <Accordion className="mb-3 w-100">
                                  <Accordion.Item eventKey="0">
                                    <Accordion.Header className="fs-14px">
                                      <h6 className="product-detail-title mb-0">
                                        Price Breakup
                                      </h6>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <div className="product-services">
                                        <div className="d-flex flex-column gap-2 fs-13px">
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.basePrice
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>Product Price</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.basePrice?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.discountPrice
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>
                                                  Discount{" "}
                                                  {`(${numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.discountPer?.toString()
                                                    )?.toFixed(2)
                                                  )}%)`}
                                                </label>
                                                <span>
                                                  -{storeCurrencys}{" "}
                                                  {`${numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.discountPrice?.toString()
                                                    )?.toFixed(2)
                                                  )}`}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.unitPrice
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>Unit Price</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {`${numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.unitPrice?.toString()
                                                    )?.toFixed(2)
                                                  )}`}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            productBreakupData?.servicePrice
                                              ?.filter(
                                                (item) =>
                                                  item?.is_selected === "1"
                                              )
                                              ?.map((elm, g) => {
                                                return (
                                                  <div
                                                    className="d-flex justify-content-between"
                                                    key={g}
                                                  >
                                                    <label>
                                                      {elm?.service_name}
                                                    </label>
                                                    <span>
                                                      {storeCurrencys}{" "}
                                                      {numberWithCommas(
                                                        extractNumber(
                                                          elm?.price?.toString()
                                                        )?.toFixed(2)
                                                      )}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.subTotal
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>Sub Total</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.subTotal?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(productBreakupData?.qty) !==
                                              0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>Quantity</label>
                                                <span>
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.qty?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.taxPrice
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>{`${
                                                  specificationData?.tax1_name
                                                } (${extractNumber(
                                                  specificationData?.tax1
                                                ).toFixed(2)})`}</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.taxPrice?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.customDutyTax
                                            ) !== 0 && (
                                              <div className="d-flex justify-content-between">
                                                <label>{`${
                                                  specificationData?.custom_duty_name
                                                } (${extractNumber(
                                                  specificationData?.custom_per
                                                ).toFixed(2)})`}</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.customDutyTax?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {productBreakupData &&
                                            isEmpty(
                                              productBreakupData?.totalPrice
                                            ) !== 0 && (
                                              <div className="fw-500 d-flex justify-content-between">
                                                <label>Grand Total</label>
                                                <span>
                                                  {storeCurrencys}{" "}
                                                  {numberWithCommas(
                                                    extractNumber(
                                                      productBreakupData?.totalPrice?.toString()
                                                    )?.toFixed(2)
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </Accordion>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles["product_Diamond_details"]}>
                    <div className="mb-4">
                      <h2 className={styles["heading-title"]}>Product Details</h2>
                    </div>
                    <div>
                      <div className={styles["product-tabs"]}>
                        <Tabs
                          defaultActiveKey="specification"
                          id="uncontrolled-tab-example"
                          className={clsx(styles["best-product"],"mb-3 nav-tabs")}
                          activeKey={keyTabView}
                          onSelect={(k) => {
                            if (k === "Variant") {
                              setOnceUpdatedVaraintTab(false);
                            }
                            if (k == "Can Be Set With") {
                              canBeSetWithData();
                            }
                            setKeyTabView(k);
                          }}
                        >
                          {selectedTab.map((tab, index) => {
                            return (
                              <Tab
                                key={index}
                                eventKey={tab.title}
                                title={
                                  tab.title === "Variant"
                                    ? tab.title + " (" + storeVariantCount + ")"
                                    : tab.title
                                }
                              >
                                {keyTabView === "Variant" ? (
                                  <>
                                    {tabDataone === true &&
                                    storeVariantDataList.length > 0 ? (
                                      <div className="container-fluid">
                                        <div className="row mt-3">
                                          <div className="col-12">
                                            <>
                                              {storeVariantDataList.map(
                                                (p, index) => (
                                                  <div
                                                    className={`d-sm-flex mb-3 variant-data cursor-pointer`}
                                                    style={{
                                                      cursor:
                                                        p.unique_id !==
                                                        isEmpty(storeVariantId)
                                                          ? "pointer"
                                                          : "",
                                                      border:
                                                        p.unique_id ===
                                                        isEmpty(storeVariantId)
                                                          ? "1px solid var(--theme-text-color)"
                                                          : "",
                                                    }}
                                                    onClick={(event) => {
                                                      setKeyTabView("Variant");
                                                      setOnceUpdatedVaraintTab(
                                                        true
                                                      );
                                                      appliedFilter(
                                                        p,
                                                        event,
                                                        "variant"
                                                      );
                                                      window.scrollTo(0, 0);
                                                    }}
                                                    hover
                                                    key={p.unique_id}
                                                  >
                                                    <div className="img-box-des productImage">
                                                      <img
                                                        src={p.image_urls[0]}
                                                        alt="image"
                                                        className="img-fluid"
                                                      />
                                                    </div>
                                                    <div className="description fs-14px">
                                                      <div>
                                                        <div className="productVariant fw-600">
                                                          {p.product_name}
                                                        </div>
                                                        <div className="product_sku">
                                                          <div className="d-inline-block">
                                                            <b>SKU </b> :{" "}
                                                            {p.product_sku}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="d-flex flex-wrap">
                                                        <>
                                                          {p.jewelry_type_name !=
                                                          "" ? (
                                                            <div className="me-3 Variant_box">
                                                              <div className="fw-600">
                                                                Jewelry Type
                                                              </div>
                                                              <span className="">
                                                                {
                                                                  p.jewelry_type_name
                                                                }
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {p.metal_type !=
                                                          "" ? (
                                                            <div className="me-3 Variant_box">
                                                              <div className="fw-600">
                                                                Metal Type
                                                              </div>
                                                              <span className="">
                                                                {p.metal_type}
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {p.gold_wt != "" &&
                                                          p.gold_wt > 0 ? (
                                                            <div className="text-start me-3 Variant_box">
                                                              <div className="fw-600">
                                                                Gold Weight
                                                              </div>
                                                              <span className="">
                                                                {p.gold_wt}{" "}
                                                                {p.gold_wt_unit}
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {p.dia_wt != "" &&
                                                          p.dia_wt > 0 ? (
                                                            <div className="text-end me-3 Variant_box">
                                                              <div className="fw-600">
                                                                Diamond Weight
                                                              </div>
                                                              <span className="">
                                                                {p.dia_wt}{" "}
                                                                {
                                                                  p.dia_first_unit
                                                                }
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {p.col_wt != "" &&
                                                          p.col_wt > 0 ? (
                                                            <div className="text-end me-3 Variant_box">
                                                              <div className="fw-600">
                                                                Gemstone Weight
                                                              </div>
                                                              <span className="">
                                                                {p.col_wt}{" "}
                                                                {
                                                                  p.col_first_unit
                                                                }
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {/* {p.dia_qty != '' && p.dia_qty > 0 ?
                                                                                                                <div className="text-end me-3 Variant_box">
                                                                                                                    <div className="fw-600">Dia 2nd Unit</div>
                                                                                                                    <span className="">{p.dia_qty} {p.dia_second_unit}</span>
                                                                                                                </div>
                                                                                                                : ''} */}

                                                          {/* {p.col_qty != '' && p.col_qty > 0 ?
                                                                                                                <div className="text-end me-3 Variant_box">
                                                                                                                    <div className="fw-600">Col 2nd Unit</div>
                                                                                                                    <span className="">{p.col_qty} {p.col_second_unit}</span>
                                                                                                                </div>
                                                                                                                : ''} */}
                                                        </>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      !loading &&
                                      storeVariantDataList.length < 0 && (
                                        <div className="row">
                                          <div className="col-6 px-0 mx-auto">
                                            <NoRecordFound />
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : keyTabView === "Specification" ? (
                                  <div className="container-fluid">
                                    <div className="row mt-3">
                                      <div className="col-sm-6 mb-4">
                                        <div className={styles["diamond_info_title"]}>
                                          Information
                                        </div>
                                        {
                                          tabDataone === true &&
                                          columnsForSpecification.length > 0
                                            ? columnsForSpecification.map(
                                                (col, i) => {
                                                  return (
                                                    <div className={styles["Specification_diamond_info"]} key={`${col.title}-${i}`}>
                                                      <React.Fragment
                                                        key={`${col.title}-${i}`}
                                                      >
                                                        <div className={clsx("d-flex", { [styles["bg-striped"]]: i % 2 === 0 })}>
                                                          <div className={clsx(styles["Specification-box"], "fw-500")}>
                                                            <div>
                                                              <p className={clsx(styles["speci-item"], "fs-13px mb-0")}>
                                                                {col.title}
                                                              </p>
                                                            </div>
                                                          </div>
                                                          <div className={styles["Specification-box"]}>
                                                            <div>
                                                              <p className={clsx(styles["speci-item"], "fs-13px mb-0")}>
                                                                {col.value}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </React.Fragment>
                                                    </div>
                                                  );
                                                }
                                              )
                                            : ""
                                          // !loading && <div className="row">
                                          //     <div className="col-md-6 px-0 mx-auto">
                                          //         {/* <img alt="image" src={""} className="w-100 h-100" />{" "} */}
                                          //         <NoRecordFound />
                                          //     </div>
                                          // </div>
                                        }
                                      </div>
                                      <div className="col-sm-6 mb-4">
                                        {isEmpty(diamondSummaryname) !== "" ? (
                                          <div className={clsx(styles["diamond_info_title"], "mt-3 mt-sm-0")}>
                                            {diamondSummaryname}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {tabDataone === true &&
                                        diamondSummary.length > 0
                                          ? diamondSummary.map((col, i) => {
                                              return (
                                                <div
                                                  className="col-md-12"
                                                  key={i}
                                                >
                                                  {col.map((col1, index) => (
                                                    <div className={clsx(styles["Specification_diamond_info"],i > 0 && index === 0 && "mt-5")}
                                                      key={col1.title} >
                                                      <React.Fragment>
                                                        <div  className={clsx("d-flex", {[styles["bg-striped"]]: index % 2 === 0,})} >
                                                          <div className={clsx(styles["Specification-box"], "fw-500")}>
                                                            <div>
                                                              <p className={clsx(styles["speci-item"], "fs-13px mb-0")}>
                                                                {col1.title}
                                                              </p>
                                                            </div>
                                                          </div>
                                                          <div className={styles["Specification-box"]}>
                                                            <div>
                                                              <p className={clsx(styles["body-text"], styles["speci-item"],"fs-13px mb-0")}>
                                                                {col1.value}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </React.Fragment>
                                                    </div>
                                                  ))}
                                                </div>
                                              );
                                            })
                                          : ""}
                                      </div>
                                      {/* {showMore == true ? */}
                                      <div className="col-sm-12">
                                        <div className="row">
                                          {tabDataone === true &&
                                          secondDiamondSummary.length > 0
                                            ? secondDiamondSummary.map(
                                                (col, i) => {
                                                  return (
                                                    <div
                                                      className="col-md-6 mb-4"
                                                      key={i}
                                                    >
                                                      <div className={clsx(styles["diamond_info_title"], "mt-3 mt-sm-0")}>
                                                        {
                                                          secondDiamondSummaryname[
                                                            i
                                                          ]
                                                        }
                                                      </div>
                                                      {col.map(
                                                        (col1, index) => (
                                                          <div className={`Specification_diamond_info ${i > 0 && index === 0 ? "mt-5" : ""}`}
                                                            key={col1.title} >
                                                            <React.Fragment>
                                                              <div className={clsx("d-flex", index % 2 === 0 && "bg-striped")} >
                                                                <div className={clsx(styles["Specification-box"], "fw-500")}>
                                                                  <div>
                                                                    <p className={clsx(styles["speci-item"], "fs-13px mb-0")}>
                                                                      {
                                                                        col1.title
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                                <div className={styles["Specification-box"]}>
                                                                  <div>
                                                                    <p className={clsx(styles["speci-item"], "fs-13px mb-0")}>
                                                                      {
                                                                        col1.value
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </React.Fragment>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  );
                                                }
                                              )
                                            : ""}
                                        </div>
                                      </div>
                                      {/* : ''} */}

                                      {/* {secondDiamondSummary.length > 0 ?
                                                                                <div className="col-12">
                                                                                    <div className="showMoreDiamondSummary">
                                                                                        <div className="ShowMoreDiamondInner " onClick={() => showMoreDiamondSummary()}>
                                                                                            {showMore == false ?
                                                                                                <>
                                                                                                    <span>More Information</span><i className="ic_plus"></i>
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <span>Less Information</span><i className="ic_minus"></i>
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                : ''} */}
                                    </div>
                                  </div>
                                ) : keyTabView === "BOM & Route Details" ? (
                                  <div className="container-fluid">
                                    <div className="row">
                                      {tabDataone === true &&
                                      bomDataList.length > 0 ? (
                                        <div className="col-12 mb-3">
                                          <div className="my-3">
                                            <h5 className="bom-details text-decoration-underline">
                                              BOM Details
                                            </h5>
                                          </div>
                                          <div className="mb-1">
                                            <p className="bom-sub-details">
                                              BOM ID :{" "}
                                              <span>
                                                {bomDataList[0].bom_id}
                                              </span>
                                            </p>
                                            <p className="bom-sub-details">
                                              BOM Description :{" "}
                                              <span>
                                                {bomDataList[0].search_name}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="table-responsive">
                                            <Table className="table-detail">
                                              <thead>
                                                <tr>
                                                  {bomColumns.map(
                                                    (column, i) => (
                                                      <th className="" key={i}>
                                                        <div>
                                                          {column.title}
                                                        </div>
                                                      </th>
                                                    )
                                                  )}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {bomDataList.map((row, i) => {
                                                  return (
                                                    <tr key={i}>
                                                      {bomColumns.map(
                                                        (column) => {
                                                          const value =
                                                            row[column.id];
                                                          return (
                                                            <td key={column}>
                                                              {value === null
                                                                ? ""
                                                                : value ===
                                                                  undefined
                                                                ? ""
                                                                : value === ""
                                                                ? ""
                                                                : value}{" "}
                                                            </td>
                                                          );
                                                        }
                                                      )}
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </Table>
                                          </div>
                                        </div>
                                      ) : (
                                        !loading && (
                                          <div className="row">
                                            <div className="col-6 px-0 mx-auto">
                                              <NoRecordFound />
                                            </div>
                                          </div>
                                        )
                                      )}
                                      {tabDataone === true &&
                                      labourDataList.length > 0 ? (
                                        <div className="col-12 mb-3">
                                          <div className="my-3">
                                            <h5 className="text-decoration-underline profile-sub-heading">
                                              {" "}
                                              Labour Details{" "}
                                            </h5>
                                          </div>
                                          <div className="table-responsive">
                                            <Table className="table-detail">
                                              <thead>
                                                <tr>
                                                  {labourColumns.map(
                                                    (column, i) => (
                                                      <th className="" key={i}>
                                                        <div>
                                                          {column.title}
                                                        </div>
                                                      </th>
                                                    )
                                                  )}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {labourDataList.map(
                                                  (row, i) => {
                                                    return (
                                                      <tr key={i}>
                                                        {labourColumns.map(
                                                          (column) => {
                                                            const value =
                                                              row[column.id];
                                                            return (
                                                              <td key={column}>
                                                                {value === null
                                                                  ? ""
                                                                  : value ===
                                                                    undefined
                                                                  ? ""
                                                                  : value === ""
                                                                  ? ""
                                                                  : value}
                                                              </td>
                                                            );
                                                          }
                                                        )}
                                                      </tr>
                                                    );
                                                  }
                                                )}
                                              </tbody>
                                            </Table>
                                          </div>
                                        </div>
                                      ) : (
                                        !loading && (
                                          <div className="row">
                                            <div className="col-6 px-0 mx-auto">
                                              <NoRecordFound />
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ) : keyTabView === "Can Be Set With" ? (
                                  <>
                                    {canBeSetWithDataList.length > 0 ? (
                                      <>
                                        <div className="table-responsive">
                                          <Table className="CanBeSetWith">
                                            <thead>
                                              <tr>
                                                <td>Stone Type</td>
                                                <td className="text-center">
                                                  No Of Stone
                                                </td>
                                                <td className="text-center">
                                                  Shape
                                                </td>
                                                <td className="text-center">
                                                  Size
                                                </td>
                                                {/* <td className="text-center">{columName}</td> */}
                                                <td className="text-center">
                                                  Position
                                                </td>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {canBeSetWithDataList.map(
                                                (c, i) => (
                                                  <tr
                                                    key={`${c.vertical_name}-${i}`}
                                                  >
                                                    <td>{c.vertical_name}</td>
                                                    <td className="text-center">
                                                      {c.no_of_stone}
                                                    </td>
                                                    <td className="text-center">
                                                      {c.shape_name}
                                                    </td>
                                                    <td className="text-center">
                                                      {c.size}
                                                    </td>
                                                    {/* <td className="text-center">{columName == 'MM' ? <span>{c.mm}</span> : <span>{c.length} x {c.width} {c.depth != '' ? <span>x {c.depth}</span> : ''}</span>}</td> */}
                                                    <td className="text-center">
                                                      {c.diy_position}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        </div>
                                      </>
                                    ) : (
                                      !loading && (
                                        <div className="mx-auto">
                                          <NoRecordFound />
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </Tab>
                            );
                          })}
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                !loading && (
                  <div className="col-6 mx-auto">
                    <NoRecordFound />
                  </div>
                )
              )}
            </div>

            {(storyDataList || []).length != 0 && (
              <>
                <div className="RelatedProduct mb-3">
                  <div className="story-css">
                    {(storyDataList || []).map((s) => (
                      <div className="pb-3 heading-main-title" key={s.title}>
                        <h3 className="text-center heading-title">{s.title}</h3>
                        {isEmpty(s.sub_title) != "" && (
                          <h5 className="text-center mb-3">{s.sub_title}</h5>
                        )}
                        {Array.isArray(s.images) &&
                          s.images.length > 0 &&
                          s.images.map((m) => (
                            <div className="mb-3 text-center" key={m}>
                              {isEmpty(s.video_extension) == "" && (
                                <img
                                  src={m.image}
                                  alt="image"
                                  className="img-fluid mb-2 wh-auto"
                                  width={970}
                                  height={600}
                                />
                              )}
                            </div>
                          ))}
                        {isEmpty(s.video_extension) != "" && (
                          <video
                            autoPlay
                            loop
                            preload="true"
                            src={s.video_url}
                            className="img-fluid mb-3 text-center"
                          >
                            <source id="mp4" />
                          </video>
                        )}
                        {isEmpty(s.description) != "" && (
                          <div
                            dangerouslySetInnerHTML={{ __html: s.description }}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {loading === false && paramsItems !== "DIY" && (
            <RelatedProduct
              apiTriggeredRef={apiTriggeredRef}
              isEndReached={isEndReached}
              totalPagesRelated={totalPagesRelated}
              setHasMoreRelated={setHasMoreRelated}
              hasMoreRelated={hasMoreRelated}
              setSwiperInstance={setSwiperInstance}
              setIsEndReached={setIsEndReached}
              count={count}
              paginationLeftRight={paginationLeftRight}
              relatedProductData={relatedProductData}
              setToastMsg={setToastMsg}
              setToastOpen={setToastOpen}
              setIsSuccess={setIsSuccess}
            />
          )}
          {reviewCustomerData.length > 0 ? (
            <div className="customer-review">
              <div className="container ">
                <h2 className="heading-title mb-4">Customer Review</h2>
              </div>
              <div className="container">
                <InfiniteScroll
                  dataLength={reviewCustomerData.length}
                  hasMore={hasMore}
                  next={() => fetchMoreData()}
                  loader={<div className="loading">Loading.....</div>}
                  endMessage={
                    !loading &&
                    reviewCustomerData?.length === 0 && <NoRecordFound />
                  }
                >
                  <React.Fragment>
                    <div className="customer-review-info">
                      <div className="review-head-part">
                        <div className="review-head-row">
                          <div className="review-total">
                            <div className="review-head-title">
                              Total Reviews
                            </div>
                            <div className="review-mark">
                              <div className="total-mark">{globalRating}</div>
                            </div>
                          </div>
                          <div className="review-average-rating">
                            <div className="review-head-title">
                              Average Rating
                            </div>
                            <div className="review-detail">
                              <div className="review-mark">
                                {globalRatingStar}
                              </div>
                              <div className="review-star">
                                <Rating
                                  initialValue={globalRatingStar}
                                  readonly
                                  size={26}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="review-globle-rating">
                            <div className="global-ratings-dec">
                              {reviewSummary.length > 0 &&
                                reviewSummary.map((data, k) => {
                                  return (
                                    <React.Fragment key={k}>
                                      <div className="global-ratings-inner">
                                        <div className="global-ratings-left ">
                                          <div className="star">
                                            {data.rating} star
                                          </div>
                                        </div>
                                        <div className="global-ratings-middle">
                                          <div
                                            onClick={() => {}}
                                            className={`progress ${
                                              data.percenatge === 0
                                                ? ""
                                                : "cursor-pointer"
                                            }}`}
                                          >
                                            <div
                                              className={`progress-bar progress-bar-striped ${
                                                data.percenatge === 0
                                                  ? ""
                                                  : "bg-warning"
                                              }`}
                                              style={{
                                                width: data.percenatge + "%",
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                        <div className="global-ratings-right">
                                          <div className="fw-400 small-title">
                                            {data.percenatge}%
                                          </div>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                      {reviewCustomerData?.length > 0 &&
                        reviewCustomerData.map((customReview, id) => {
                          let dates = new Date(customReview.created_date);
                          var Dated = dates.getDate();
                          var Month = dates.getMonth() + 1;
                          var Year = dates.getFullYear();
                          return (
                            <div className="review-data" key={id}>
                              <div className="review-datails">
                                <div className="review-profile">
                                  <div className="profile-img">
                                    <img
                                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                      className="img-fluid wh-auto"
                                      width={65}
                                      height={65}
                                      alt="Review User Image"
                                    />
                                  </div>
                                  <div className="profile-detail">
                                    <div className="profile-heading">
                                      {customReview.user_name}
                                    </div>
                                    <div className="rating">
                                      <div className="rating-star">
                                        {[...Array(customReview.rating)].map(
                                          (star, i) => {
                                            return (
                                              <i
                                                className="ic_star_fill me-2"
                                                key={i}
                                              ></i>
                                            );
                                          }
                                        )}
                                        {[
                                          ...Array(5 - customReview.rating),
                                        ].map((star, i) => {
                                          return (
                                            <i
                                              className="ic_star me-2"
                                              key={i}
                                            ></i>
                                          );
                                        })}
                                      </div>
                                      <div className="profile-text">
                                        {customReview.rating == "5" && (
                                          <span>Perfect</span>
                                        )}
                                        {customReview.rating == "4" && (
                                          <span>Great</span>
                                        )}
                                        {customReview.rating == "3" && (
                                          <span>Average</span>
                                        )}
                                        {customReview.rating == "2" && (
                                          <span>Bad</span>
                                        )}
                                        {customReview.rating == "1" && (
                                          <span>Terrible</span>
                                        )}
                                      </div>
                                    </div>
                                    <p className="rating-date">
                                      Posted on {Dated}/{Month}/{Year}
                                    </p>
                                  </div>
                                </div>
                                <div className="review-ratings">
                                  <div className="review-dec">
                                    <div className="review-heading">
                                      {customReview.headline}
                                    </div>
                                    <div
                                      className={`review-text ${
                                        isExpanded ? "active" : ""
                                      }`}
                                      dangerouslySetInnerHTML={{
                                        __html: customReview.review_details,
                                      }}
                                    ></div>
                                    {customReview.review_details.length >
                                      450 && (
                                      <span
                                        className="show_more"
                                        onClick={toggleExpand}
                                      >
                                        {isExpanded ? "Show less" : "Show more"}
                                      </span>
                                    )}
                                  </div>

                                  <div className="product-slider">
                                    <div className="customer_review_info">
                                      <div className="image-show">
                                        {customReview.image_set.length > 0 &&
                                          customReview.image_set
                                            .slice(0, 3)
                                            .map((imgUrl, id2) => {
                                              return (
                                                <div
                                                  className="images-upload cursor-pointer"
                                                  key={id2}
                                                >
                                                  <img
                                                    src={imgUrl}
                                                    className="img-fluid wh-auto"
                                                    alt="image"
                                                    width={98}
                                                    height={100}
                                                  />
                                                </div>
                                              );
                                            })}
                                        {customReview.video !== "" ? (
                                          <div className="images-upload">
                                            <video
                                              width={100}
                                              height={100}
                                              controls
                                            >
                                              <source
                                                src={customReview.video}
                                                type="video/mp4"
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </React.Fragment>
                </InfiniteScroll>
              </div>
            </div>
          ) : (
            ""
          )}
        </section>
      ) : (
        <>
          {/* {verticalCode === "DIAMO" ||
          verticalCode === "GEDIA" ||
          verticalCode === "LGDIA" ? (
            <CertificateDiamond
              selectedColor={selectedColor}
              product_type={productType}
              go_to_review={go_to_review}
              element={stoneElement}
              back={parentBack}
              setStone={setStone}
              can_be_set={finalCanBeSet}
              paramsItem={paramsItem}
              productSKU={productSKU}
              finalTotal={finalTotal}
              handleFirstStep={handleFirstStep}
              handleSetStone={handleSetStone}
              handleComplete={handleComplete}
              salesTotalPrice={numberWithCommas(salesTotalPrice)}
              certificateNumber={stoneObj.st_cert_no}
              stonePrice={stoneObj.final_total_display}
              stoneImageUrl={stoneObj.st_is_photo}
              complete={complete}
              isStone={isStone}
              handleBackToDiamond={handleBackToDiamond}
              diamondStepTwo={diamondStepTwo}
              diamondStepFirst={diamondStepFirst}
              finalCanBeSet={finalCanBeSet}
              backToList={backToList}
              isEngraving={saveEngraving}
              isEmbossing={SaveEmbossing}
              engravingData={engravingData}
              embossingData={embossingData}
              specificationData={specificationData}
              isOffers={isOffers}
              selectedOffer={selectedOffer}
              serviceData={serviceData}
              calculatePrice={calculatePrice}
            />
          ) : (
            ""
          )} */}
        </>
      )}
      <Modal
        show={embossingModalView}
        onHide={() => {
          setEmbossingModalView(false);
          setSelectedIndex(0);
        }}
        className="EmbossingModal"
        size={"lg"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Set Embossing Position{" "}
            {`(${activeImg[0]?.currency} ${numberWithCommas(
              Number(activeImg[0]?.price).toFixed(2)
            )})`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="dragarea mt-1">
                  <div className="text-center">
                    <div
                      onClick={() => imgContainer.current.click()}
                      className="cursor-pointer"
                    >
                      {"Click To Browse"}
                      <br />
                      <span className="text-grey font-15px">
                        ({"Single Image"})
                      </span>
                      <input
                        type="file"
                        ref={imgContainer}
                        style={{ display: "none" }}
                        onChange={(event) => changeEmboFile(event)}
                        accept=".png, .jpg, .jpeg, .webp, .PNG, .JPG, .JPEG, .WEBP"
                      />
                    </div>
                  </div>
                </div>
                {activeImg?.[selectedIndex]?.embImage &&
                  activeImg?.[selectedIndex]?.area && (
                    <div>
                      <div className="text-main mt-3">
                        <span>Alignment</span>
                      </div>
                      <div className="btn-margin d-flex flex-wrap">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              <div>Horizontal Center</div>
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-first"
                            onClick={() => centerImage("horizontal")}
                          >
                            <i className="ic_horizontal_center"></i>

                            {/* <span>Horizontal center</span> */}
                          </button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              <div>Vertical Center</div>
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-first"
                            onClick={() => centerImage("vertical")}
                          >
                            <i className="ic_vertical_center"></i>
                            {/* <span>Vertical center</span> */}
                          </button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              <div>Both Center</div>
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-first"
                            onClick={centerBoth}
                          >
                            <i className="ic_both_center"></i>
                            {/* Both Center */}
                          </button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  )}
                {/* {
                                    activeImg?.map((sub, index) => {
                                        return (
                                            <div className="mt-2" key={index}>
                                                <div className="spec-info-row">
                                                    <div className="spec-info-col spec-title">Width(Inches)</div>
                                                    <div className="spec-info-col line_clamp">{sub.embImageArea.width}</div>
                                                </div>
                                                <div className="spec-info-row">
                                                    <div className="spec-info-col spec-title">Height(Inches)</div>
                                                    <div className="spec-info-col line_clamp">{sub.embImageArea.height}</div>
                                                </div>
                                                <div>{sub.currency} {sub.price}</div>
                                            </div>
                                        )
                                    })
                                } */}
                {/* {activeImg?.[selectedIndex]?.widthInInches && activeImg?.[selectedIndex]?.heightInInches && (
                                    <div className="mt-2">
                                        <div className="spec-info-row">
                                            <div className="spec-info-col spec-title">Width(Inches)</div>
                                            <div className="spec-info-col line_clamp">{activeImg?.[selectedIndex]?.widthInInches}</div>
                                        </div>
                                        <div className="spec-info-row">
                                            <div className="spec-info-col spec-title">Height(Inches)</div>
                                            <div className="spec-info-col line_clamp">{activeImg?.[selectedIndex]?.heightInInches}</div>
                                        </div>
                                    </div>
                                )} */}
              </div>
              <div className="col-md-6 col-12">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {activeImg?.map((data, i) => (
                    <li className="nav-item" role="presentation" key={i}>
                      <div
                        className={`nav-link cursor-pointer ${
                          i === selectedIndex ? "active" : ""
                        }`}
                        id={`tab-${i}`}
                        data-bs-toggle="tab"
                        href={`#tab-content-${i}`}
                        role="tab"
                        aria-controls={`tab-content-${i}`}
                        aria-selected={i === selectedIndex}
                        onClick={() => changeImage(data, i)} // Change active tab
                      >
                        {data.type}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Tab Content */}
                <div className="tab-content" id="myTabContent">
                  {activeImg.map((data, i) => {
                    // Check if data.area is a stringified JSON and parse it if necessary
                    let areas = data?.area;
                    if (typeof areas === "string") {
                      try {
                        areas = JSON.parse(areas); // Try to parse it if it's a string
                      } catch (e) {
                        // console.error("Error parsing area:", e);
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`tab-pane fade ${
                          i === selectedIndex ? "show active" : ""
                        }`}
                        id={`tab-content-${i}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${i}`}
                      >
                        <div className="main-img">
                          <div className="singleProduct-view">
                            {/* Image for the selected tab */}
                            <img
                              src={data?.url}
                              className="img-fluid img-width d-block m-auto wh-auto"
                              alt={`Image ${i}`}
                              width={470}
                              height={470}
                            />

                            {/* Display embossing image if activeImg has area */}
                            {areas?.width && areas?.height && (
                              <div
                                className="embossing-img"
                                id={`embossing-img-${i}`}
                                style={{
                                  left: `${areas.left}%`,
                                  top: `${areas.top}%`,
                                  width: `${areas.width}%`,
                                  height: `${areas.height}%`,
                                }}
                              >
                                {data?.embImage && (
                                  <div
                                    className="resizable-img"
                                    id={`resizable-img-${i}`}
                                    style={{
                                      left: `${data.embImageArea.left}%`,
                                      top: `${data.embImageArea.top}%`,
                                      width: `${data.embImageArea.width}%`,
                                      height: `${data.embImageArea.height}%`,
                                    }}
                                    onMouseDown={(event) =>
                                      imgStartDrag(event, data, i)
                                    } // Implement your drag logic here
                                    onTouchStart={(event) =>
                                      imgStartDrag(event, data, i)
                                    } // Implement your drag logic here
                                  >
                                    <img
                                      src={data.embImage}
                                      className="img-fluid img-width d-block m-auto"
                                      alt={`Embossed Image ${i}`}
                                      ref={imgContainers}
                                    />
                                    <div
                                      className="resize-btn"
                                      onMouseDown={(event) =>
                                        imgResizeStart(event, data, i)
                                      }
                                      onTouchStart={(event) =>
                                        imgResizeStart(event, data, i)
                                      }
                                    >
                                      ↘
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="first" onClick={() => setSaveEmbossDetail()}>
            Save
          </Button>
          <Button
            className="btn-white"
            onClick={() => setSaveEmbossDetailReset()}
          >
            Reset
          </Button>

          <Button
            className="btn-white"
            onClick={() => {
              setEmbossingModalView(false);
              setSelectedIndex(0);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={embossingPreviewModalBaseView}
        onHide={() => {
          handleSetStateChange(false);
          setSelectedIndex(0);
        }}
        className="EmbossingModal"
        size={"lg"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid px-0">
            <div className="row justify-content-center">
              <div className="col-12">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {activeImg?.map((data, i) => (
                    <li className="nav-item" role="presentation" key={i}>
                      <div
                        className={`nav-link cursor-pointer ${
                          i === selectedIndex ? "active" : ""
                        }`}
                        id={`tab-${i}`}
                        data-bs-toggle="tab"
                        href={`#tab-content-${i}`}
                        role="tab"
                        aria-controls={`tab-content-${i}`}
                        aria-selected={i === selectedIndex}
                        onClick={() => setSelectedIndex(i)}
                      >
                        {data.type}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Tab Content */}
                <div
                  className="tab-content d-flex justify-content-center"
                  id="myTabContent"
                >
                  {activeImg.map((data, i) => {
                    let areas = data?.area;
                    if (typeof areas === "string") {
                      try {
                        areas = JSON.parse(areas);
                      } catch (e) {
                        // console.error("Error parsing area:", e);
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`tab-pane fade ${
                          i === selectedIndex ? "show active" : ""
                        }`}
                        id={`tab-content-${i}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${i}`}
                      >
                        <div className="main-img">
                          <div className="singleProduct-view">
                            {/* Image for the selected tab */}
                            <img
                              src={data?.url}
                              className="img-fluid img-width d-block m-auto"
                              alt={`Image ${i}`}
                            />

                            {/* Display embossing image if activeImg has area */}
                            {areas?.width && areas?.height && (
                              <div
                                className="embossing-img"
                                id={`embossing-img-${i}`}
                                style={{
                                  left: `${areas.left}%`,
                                  top: `${areas.top}%`,
                                  width: `${areas.width}%`,
                                  height: `${areas.height}%`,
                                }}
                              >
                                {data?.embImage && (
                                  <div
                                    className="resizable-img"
                                    id={`resizable-img-${i}`}
                                    style={{
                                      left: `${data.embImageArea.left}%`,
                                      top: `${data.embImageArea.top}%`,
                                      width: `${data.embImageArea.width}%`,
                                      height: `${data.embImageArea.height}%`,
                                    }}
                                  >
                                    <img
                                      src={data.embImage}
                                      className="img-fluid img-width d-block m-auto"
                                      alt={`Embossed Image ${i}`}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn-white"
            onClick={() => handleSetStateChange(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={diaModalshow}
        onHide={() => setDiaModalShow(false)}
        size={"lg"}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Certificate #{certificateNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            aria-labelledby="test"
            src={iframeUrl}
            width="100%"
            height="500px"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-white" onClick={() => setDiaModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showStoneModal}
        onHide={() => {
          setShowStoneModal(false);
        }}
        backdrop="static"
        keyboard={false}
        centered
        className="set-stone-modal"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="start-with-a-setting-modal">
            <div className="SetStoneModalTitle">
              <h4 className="mb-2">Continue To The Next Step</h4>
              <p>Please choose one of the options below</p>
            </div>
            <div className="SetStoneModal">
              {stoneTypeArr.length > 0 &&
                stoneTypeArr.map((e, i) => {
                  return (
                    <button
                      key={i}
                      className={`btn btn-set-stone btn-set-stone-width fw-500  ${
                        e.display_name === stoneActive.display_name
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        selectDiamond(e);
                        setStoneActive(e);
                        setDIYSizeDataList([]);
                        setShapeStoneActive({});
                        setSizeStoneActive({});
                        setDIYShapesDataList([]);
                        setClarityWithColor("");
                        setDIYClarityDataList([]);
                      }}
                    >
                      {e.display_name}
                    </button>
                  );
                })}
            </div>

            {DIYShapesDataList.length > 0 && (
              <div className="mb-20px mt-3">
                <div className="row">
                  <div className="col-12">
                    <h2 className="pb-2 fs-20px shape-field-title">Shape</h2>
                    <div className="d-flex flex-wrap diy_popup">
                      {DIYShapesDataList.map((e, i) => {
                        return (
                          <div
                            className={`stone-area me-3 color-black ${
                              shapeStoneActive.shape_name === e.shape_name
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setShapeStoneActive(e);
                              setDIYSizeDataList([]);
                              DIYSizeData(e);
                            }}
                            key={i}
                          >
                            <div className="trans-effect">
                              <div className="d-flex justify-content-center shape-icon py-2">
                                <i className={`${e.image} fs-30px`}></i>
                              </div>
                              <p className="stone-name text-center fs-12px">
                                {e.shape_name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {DIYSizeDataList.length > 0 && (
              <div className="mb-20px mt-3">
                <div className="row">
                  <div className="col-12">
                    <div>
                      <h4 className="fs-20px shape-heading shape-field-title mb3">
                        Size
                      </h4>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="StoneSize">
                      {DIYSizeDataList.map((e, i) => {
                        return (
                          <button
                            className={`btn btn-set-stone ${
                              sizeStoneActive.size === e.size
                                ? "buttbutton-transparent  active"
                                : ""
                            }`}
                            onClick={() => {
                              setSizeStoneActive(e);
                              setDIYClarityDataList([]);
                              clarityColorData(shapeStoneActive, e);
                            }}
                            key={i}
                          >
                            {e.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {DIYClarityDataList.length > 0 && (
              <div className="mb-20px mt-3">
                <div>
                  <h4 className="fs-20px shape-heading shape-field-title mb-3">
                    Clarity
                  </h4>
                </div>

                <div className="stone-size">
                  {DIYClarityDataList.map((e, i) => {
                    return (
                      <div key={i}>
                        <h6 className="text-start">{e.clarity}</h6>
                        {e.details.length > 0 &&
                          e.details.map((a, index) => {
                            return (
                              <button
                                key={index}
                                className={`btn btn-white ${
                                  clarityWithColor === a.color + e.clarity
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setClarityWithColor(a.color + e.clarity);
                                  applyClarityFilter(a, e);
                                }}
                              >
                                {a.color}
                              </button>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        {/* <Modal.Footer className="border-0">
                    <button variant="secondary" onClick={() => { setShowStoneModal(false) }} className="btn btn-dark-green px-5 fw-500">
                        Close
                    </button>
                </Modal.Footer> */}
      </Modal>
      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
    </React.Fragment>
  );
};

export default SingleProductJewellery;
