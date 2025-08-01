"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import styles from "./jewellery.module.scss"
import { useDispatch, useSelector } from "react-redux"
import Card from "react-bootstrap/Card"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import InfiniteScroll from "react-infinite-scroll-component"
import Accordion from "react-bootstrap/Accordion"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation"
import Head from "next/head"
import {
  storeFavCount,
  countCart,
  diamondDIYName,
  diamondDIYimage,
  jeweleryDIYimage,
  jeweleryDIYName,
  activeDIYtabs,
  editDiamondAction,
  selectedJewelRing,
  selectedRingData,
  selectedDiamondShapeName,
  jewelSelectedCategory,
} from "../../../Redux/action"
import Commanservice from "../../../CommanService/commanService"
import { RandomId, changeUrl, isEmpty, jewelVertical, numberWithCommas } from "../../../CommanFunctions/commanFunctions"
import Loader from "../../../CommanUIComp/Loader/Loader";
import Notification from "../../../CommanUIComp/Notification/Notification";
import NoRecordFound from "../../../CommanUIComp/NoRecordFound/noRecordFound";
import BreadcrumbModule from "../../../CommanUIComp/Breadcrumb/breadcrumb";
import { LazyLoadImage } from "react-lazy-load-image-component"
import DIYProcessStepBar from "../DIYProcessStepBar/DIYProcessStepBar"
import DIYPageProcessStep from "@/components/DiyProduct/DIYProcessStepBar/DIYPageProcessStep"
import clsx from "clsx"

// Dynamic imports for client-side only components
// const LazyLoadImage = dynamic(() => import("react-lazy-load-image-component").then((mod) => mod.LazyLoadImage), {
//   ssr: false,
//   loading: () => <div className="imagePlaceholder">Loading...</div>,
// })

// const DIYProcessStepBar = dynamic(() => import("../DIYProcessStepBar/DIYProcessStepBar"), { ssr: false })
// const DIYPageProcessStep = dynamic(() => import("../../DiyProduct/DIYProcessStepBar/DIYPageProcessStep"), {
//   ssr: false,
// })

const Jewellery = (props) => {
  const storeEntityIds = useSelector((state) => state.storeEntityId) || props.storeEntityIds || {}
  const storeCurrencys = useSelector((state) => state.storeCurrency)
  const loginDatas = useSelector((state) => state.loginData)
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData)
  const DiyStepersDatas = useSelector((state) => state.DiyStepersData)
  const dispatch = useDispatch()
  const lastAbortController = useRef()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Convert searchParams to query object for compatibility
  const query = useParams()
//   searchParams?.forEach((value, key) => {
//       query[key] = value
//     })
    
    const extractNumber = (str) => (typeof str === "string" ? Number.parseFloat(str.replace(/[^0-9.]/g, "")) : 0)
    

  // Loader
  const [loading, setLoading] = useState(false)
  const [favLoader, setFavLoader] = useState({})
  const isLogin = Object.keys(loginDatas || {}).length > 0

  // Toast
  const [toastShow, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [favStopClick, setFavStopClick] = useState(false)

  // One time update
  const [onceUpdated, setOnceUpdated] = useState(false)

  // Accordion && true false
  const [activeAccordion, setActiveAccordion] = useState(["0"])

  // Pagination
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }))
  const [rowsPerPage, setRowsPerPage] = useState(0)
  const [clickPageScroll, setClickPageScroll] = useState(false)

  // Get Data
  const [productDataList, setProductDataList] = useState({})
  const [filterSettingData, setFilterSettingData] = useState([])
  const [isButtonSelected, setButtonSelected] = useState({})
  const [storeFilterArr, setStoreFilterArr] = useState([])
  const [sortBy, setSortBy] = useState("")
  const [getStoreItemObj, setStoreItemObj] = useState({})
  const [orignalData, setOrignalData] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  // URL path
  const params = query
  const isJewelDiy = pathname?.includes("start-with-a-setting")
  const isDiamoDiy = pathname?.includes("start-with-a-diamond")
  const isItemDIY = pathname?.includes("start-with-a-item")
  const diySetupFor = isJewelDiy || isDiamoDiy || isItemDIY
  const paramsItem = isDiamoDiy || isJewelDiy || isItemDIY ? "DIY" : "PRODUCT"

  // Session storage with SSR safety
  const [homeFilters, setHomeFilters] = useState("")
  const [homeCollectionId, setHomeCollectionId] = useState("")
  const [DIYvertical, setDIYvertical] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHomeFilters(isEmpty(sessionStorage.getItem("collection")))
      setHomeCollectionId(isEmpty(sessionStorage.getItem("collection_id")))
      setDIYvertical(query?.verticalCode ?? sessionStorage.getItem("DIYVertical"))
    }
  }, [query])

  const nextStepPosition = query?.nextStepPosition
  const combination_id = query?.combination_id
  const diy_bom_id = query?.diy_bom_id

  // Home filter data
  const getAllFilteredHome = query?.getAllFilteredHome
  const dimension = query?.dimension
  const item_group = query?.dimension
  const segment = query?.segments

  // URL VALUE
  const [activeTitle, setActiveTitle] = useState([])
  const [titleObj, setTitleObj] = useState({})

  // Currency update
  const [currency, setCurrency] = useState(storeCurrencys)
  const [sessionMegaMenu, setSessionMegaMenu] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionMegaMenu(sessionStorage.getItem("megaMenu"))
    }
  }, [])

  let getProduct = ""
  let product_key = ""
  let vertical_code = ""
  let search = null
  let megaMenu = null

  if (sessionMegaMenu) {
    const navigation_data = JSON.parse(sessionMegaMenu)?.navigation_data ?? []
    if (params?.verticalCode) {
      megaMenu = navigation_data.find(
        (item) => item.menu_name?.replaceAll(" ", "-")?.toLowerCase() === params?.verticalCode?.toLowerCase(),
      )
    }
    if (!megaMenu) {
      megaMenu = navigation_data.find((item) => item.menu_name?.toLowerCase() === "make your customization")
    }

    if (params?.productKey === "offer") {
      getProduct = params?.value
      product_key = "offer"
    } else {
      getProduct = homeFilters !== "" ? homeFilters : params?.value || props.typeFilter
      product_key = homeFilters !== "" ? "type" : params?.productKey || props.typeFilter
    }

    if (homeCollectionId !== "") {
      product_key = "collection"
    }

    vertical_code = params?.verticalCode ? (megaMenu?.product_vertical_name ?? params?.verticalCode) : ""
    if (!vertical_code || vertical_code === "DIY") {
      vertical_code = ""
    }

    if (pathname?.includes("products")) {
      vertical_code = megaMenu?.product_vertical_name ?? params?.verticalCode
    }

    search = getProduct !== undefined ? getProduct.split(",") : null
  } else {
    console.warn("megaMenu not found in sessionStorage")
  }

  // Meta
  const metaConfig = {
    title: `${isEmpty(megaMenu?.seo_titles) !== "" ? megaMenu?.seo_titles : megaMenu?.menu_name}`,
    description: megaMenu?.seo_description,
    keywords: megaMenu?.seo_keyword,
    url: typeof window !== "undefined" ? window.location.href : "",
  }

  var jewellerydata = []

  const productData = useCallback((obj, key, signal) => {
    Commanservice.postApi("/EmbeddedPageMaster", obj, signal)
      .then((res) => {
        if (res.data.success === 1) {
          const jewelData = res.data.data.resData
          if (homeFilters !== null && params?.productKey !== "collection") {
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("collection")
            }
          }
          if (jewelData?.length < 15) {
            setHasMore(false)
          }
          if (key === "1") {
            if (jewelData?.length > 0) {
              var data = []
              jewellerydata = []
              for (let c = 0; c < jewelData?.length; c++) {
                data.push(jewelData[c])
                jewellerydata.push(jewelData[c])
              }
              setOrignalData(data)
            }
          } else if (key === "0") {
            if (jewelData?.length > 0) {
              var newData = [...jewellerydata]
              for (let c = 0; c < jewelData?.length; c++) {
                newData.push(jewelData[c])
              }
              jewellerydata = newData
              setOrignalData(newData)
            }
          }
          const arr1 = []
          for (let i = 0; i < Number(4); i++) {
            arr1.push(i)
          }
          setStoreSkeletonArr(arr1)
          setProductDataList(res.data.data)
          setRowsPerPage(res.data.data.total_rows)
          setLoading(false)
          setClickPageScroll(false)
        } else {
          setToastOpen(true)
          setIsSuccess(false)
          setToastMsg(res.data.message)
        }
      })
      .catch(() => {})
  }, [])

  const itemForJewel = useCallback(
    (obj2) => {
      setLoading(true)
      Commanservice.postApi("/EmbeddedPageMaster", obj2)
        .then((res) => {
          if (res.data.success === 1) {
            const storeArr = []
            setFilterSettingData(res.data.data)
            const arr = [...res.data.data]
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                arr[i]["selected_values"] = []
                // Page back to selected filters key
                if (typeof window !== "undefined" && sessionStorage.getItem("filterJson") !== null) {
                  var filterData = JSON.parse(sessionStorage.getItem("filterJson"))
                  for (let k = 0; k < filterData.length; k++) {
                    if (arr[i]["fielter_key"] === filterData[k]["key"] && filterData[k]["value"].length > 0) {
                      arr[i]["selected_values"] = filterData[k]["value"]
                    }
                  }
                }
                // Header click to selected parameters
                if (
                  isEmpty(product_key) !== "" &&
                  (typeof window === "undefined" || sessionStorage.getItem("filterJson") == null)
                ) {
                  for (let j = 0; j < arr[i]["value"].length; j++) {
                    if (isEmpty(params?.value) != "") {
                      if (
                        params?.value.toLowerCase() ===
                        arr[i]["value"][j]["data_value"]?.split(" ").join("-")?.toLowerCase()
                      ) {
                        arr[i]["selected_values"] = [...arr[i]["selected_values"], arr[i]["value"][j]["data_key"]]
                      }
                    }
                  }
                }
              }
              arr.map((e) => {
                storeArr.push({ key: e["fielter_key"], value: e["selected_values"] })
              })
              setStoreFilterArr(storeArr)
            }
            if (Object.keys(storeEntityIds || {}).length) {
              const obj = {
                a: "getStoreItems",
                user_id: isLogin ? loginDatas.member_id : RandomId,
                SITDeveloper: "1",
                miniprogram_id: storeEntityIds.mini_program_id,
                tenant_id: storeEntityIds.tenant_id,
                entity_id: storeEntityIds.entity_id,
                per_page: "16",
                number: "1",
                filters: JSON.stringify(storeArr),
                from_price: "",
                to_price: "",
                diamond_params: pathname?.includes("start-with-a-diamond")
                  ? JSON.stringify({
                      shape: addedDiamondDatas?.st_shape,
                      from_length: addedDiamondDatas?.st_length,
                      from_width: addedDiamondDatas?.st_width,
                      from_depth: addedDiamondDatas?.st_depth,
                    })
                  : "[]",
                extra_currency: storeCurrencys,
                secret_key: storeEntityIds.secret_key,
                product_diy: nextStepPosition ? "PRODUCT" : paramsItem,
                store_type: "B2C",
                vertical_code: diySetupFor
                  ? (DiyStepersDatas?.filter((item) => item.position === nextStepPosition)[0]?.vertical ??
                    isEmpty(DIYvertical))
                  : (vertical_code.toUpperCase() ?? isEmpty(DIYvertical)),
                offer_code: isEmpty(product_key) == "offer" ? isEmpty(getProduct) : "",
              }
              if (isItemDIY) {
                obj.diy_bom_id = diy_bom_id
                obj.combination_id = combination_id
                obj.diy_step = nextStepPosition !== 0 ? (isEmpty(nextStepPosition) ?? "1") : ""
                obj.diy_type = "1"
              }
              if (getAllFilteredHome) {
                obj.dimension = dimension
                obj.item_group = item_group
                obj.segments = segment
              }
              setStoreItemObj(obj)
              productData(obj, "1")
            }
          } else {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(res.data.message)
          }
        })
        .catch(() => {
          setLoading(false)
        })
    },
    [
      productData,
      dispatch,
      isButtonSelected,
      isLogin,
      loginDatas,
      vertical_code,
      product_key,
      currency,
      DIYvertical,
      nextStepPosition,
      storeEntityIds,
      addedDiamondDatas,
      storeCurrencys,
      DiyStepersDatas,
    ],
  )

  const initiallyRenderFunction = useCallback(() => {
    if (
      storeEntityIds &&
      Object.keys(storeEntityIds).length > 0 &&
      (!diySetupFor ? isEmpty(vertical_code) !== "" : true)
    ) {
      if (!onceUpdated) {
        setStoreItemObj({})
        setHasMore(true)
        const arr1 = []
        for (let i = 0; i < Number(8); i++) {
          arr1.push(i)
        }
        setStoreSkeletonArr(arr1)
        const obj2 = {
          SITDeveloper: "1",
          a: "GetItemSearchFiltersForJewellery",
          entity_id: storeEntityIds.entity_id,
          miniprogram_id: storeEntityIds.mini_program_id,
          secret_key: storeEntityIds.secret_key,
          tenant_id: storeEntityIds.tenant_id,
          vertical_code: diySetupFor
            ? (DiyStepersDatas?.filter((item) => item.position === nextStepPosition)[0]?.vertical ??
              isEmpty(DIYvertical))
            : vertical_code.toUpperCase(),
        }
        itemForJewel(obj2)
        // dispatch(diamondDIYName(""))
        // dispatch(diamondDIYimage(""))
        // dispatch(jeweleryDIYimage(""))
        // dispatch(jeweleryDIYName(""))
        // dispatch(activeDIYtabs("Jewellery"))
        setOnceUpdated(true)
      }
    }
  }, [onceUpdated, itemForJewel, dispatch, DIYvertical, nextStepPosition, storeEntityIds, DiyStepersDatas])

  const fetchPosts = useCallback(
    async (obj) => {
      if (lastAbortController.current) {
        lastAbortController.current.abort()
      }
      const currentAbortController = new AbortController()
      lastAbortController.current = currentAbortController
      await productData(obj, "1", currentAbortController.signal)
    },
    [productData],
  )

  useEffect(() => {
    setOnceUpdated(false)
    setItemLength(Array.from({ length: 1 }))
  }, [props.verticalCode])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
    initiallyRenderFunction()
  }, [initiallyRenderFunction, params?.verticalCode, props.verticalCode, props.typeFilter])

  const handleChangeRow = (e) => {
    if (lastAbortController.current) {
      lastAbortController.current.abort()
    }
    const currentAbortController = new AbortController()
    lastAbortController.current = currentAbortController
    const obj = { ...getStoreItemObj, number: e.toString() }
    setStoreItemObj(obj)
    if (clickPageScroll === false) {
      productData(obj, "0", currentAbortController.signal)
    }
  }

  const fetchMoreData = () => {
    const totalRows = productDataList?.total_pages ? productDataList?.total_pages : 1
    if (itemsLength.length >= totalRows) {
      setHasMore(false)
      return
    } else {
      setHasMore(true)
    }
    if (clickPageScroll === false) {
      setTimeout(() => {
        setItemLength(itemsLength.concat(Array.from({ length: 1 })))
        handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length)
      }, 500)
    }
  }

  const appliedFilter = (header, val, index, checked, i) => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
    const arr = []
    const updatedFilterSettingData = filterSettingData.map((h) => {
      if (h.fielter_key === header.fielter_key) {
        return {
          ...h,
          selected_values: checked
            ? [...h.selected_values, h.value[i]["data_key"]]
            : h.selected_values.filter((key) => key !== h.value[i]["data_key"]),
        }
      }
      return h
    })
    setFilterSettingData(updatedFilterSettingData)
    const arr1 = []
    for (let i = 0; i < Number(8); i++) {
      arr1.push(i)
    }
    updatedFilterSettingData.map((h) => {
      arr.push({ key: h.fielter_key, value: h.selected_values })
    })
    setStoreFilterArr(arr)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("filterJson", JSON.stringify(arr))
    }
    setStoreSkeletonArr(arr1)
    setOrignalData([])
    setClickPageScroll(true)
    setItemLength(Array.from({ length: 1 }))
    const obj = { ...getStoreItemObj, filters: JSON.stringify(arr), number: "1" }
    setStoreItemObj(obj)
    fetchPosts(obj)
    setHasMore(true)
  }

  const openDetailsPage = (e) => {
    dispatch(jewelSelectedCategory(e))
    if (typeof window !== "undefined") {
      sessionStorage.setItem("filterJson", JSON.stringify(storeFilterArr))
    }
  }

  const onCheckSortBy = (val, e) => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
    const arr1 = []
    for (let i = 0; i < Number(8); i++) {
      arr1.push(i)
    }
    setStoreSkeletonArr(arr1)
    setOrignalData([])
    setClickPageScroll(true)
    if (e.target.checked) {
      setSortBy(val)
    } else {
      setSortBy("")
    }
    setItemLength(Array.from({ length: 1 }))
    const obj = { ...getStoreItemObj, sort_by: e.target.checked === true ? val : "", number: "1" }
    setStoreItemObj(obj)
    fetchPosts(obj)
    setHasMore(true)
  }

  // Favourite
  const addDeleteFavouriteItem = (e, event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!favStopClick) {
      setFavStopClick(true)
      setFavLoader({ ...favLoader, [e.item_id]: true })
      const paramsJewel = {
        JEWEL: [
          {
            vertical_code: e.vertical_code,
            group_code: e.item_group,
            qty: 1,
            price_type: e.price_type,
            item_id: e.item_id,
            variant_id: e.variant_unique_id,
            product_diy: "PRODUCT",
            product_title: e.jewellery_product_type_name,
            product_name: e.product_name,
            mi_unique_id: e.unique_id,
            offer_code: e.coupon_code,
          },
        ],
      }
      const obj = {
        a: "AddDeleteFavourite",
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        currency: storeCurrencys,
        current_user: isLogin ? loginDatas.member_id : RandomId,
        user_id: isLogin ? loginDatas.member_id : RandomId,
        store_id: storeEntityIds.mini_program_id,
        json_data: JSON.stringify(paramsJewel),
      }
      Commanservice.postLaravelApi("/FavouriteController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (e.add_to_favourite == "1") {
              e.add_to_favourite = "0"
            } else {
              e.add_to_favourite = "1"
            }
            getFavouriteCount(e)
            setToastOpen(true)
            setIsSuccess(true)
            setToastMsg(res.data.message)
          } else {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(res.data.message)
            setFavLoader({ ...favLoader, [e.item_id]: false })
          }
        })
        .catch(() => {
          setFavLoader({ ...favLoader, [e.item_id]: false })
        })
    } else {
      setToastOpen(true)
      setIsSuccess(false)
      setToastMsg("Please wait already wishlist one item add in process")
    }
  }

  const getFavouriteCount = (data) => {
    const obj = {
      a: "get_count",
      store_id: storeEntityIds.mini_program_id,
      user_id: isLogin ? loginDatas.member_id : RandomId,
    }
    Commanservice.postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (Object.keys(res.data.data).length > 0) {
            dispatch(storeFavCount(res.data.data?.favourite_count))
            dispatch(countCart(res.data.data?.cart_count))
            setFavLoader({ ...favLoader, [data.item_id]: false })
            setToastOpen(false)
            setFavStopClick(false)
          }
        } else {
          dispatch(storeFavCount(storeFavCounts))
          dispatch(countCart(countCarts))
          setFavStopClick(false)
          setIsSuccess(false)
          setToastOpen(true)
          setToastMsg(res.data.message)
          setFavLoader({ ...favLoader, [data.item_id]: false })
        }
      })
      .catch(() => {
        dispatch(storeFavCount(storeFavCounts))
        dispatch(countCart(countCarts))
        setFavLoader({ ...favLoader, [data.item_id]: false })
        setFavStopClick(false)
      })
  }

  useEffect(() => {
    if (storeCurrencys) {
      setCurrency(storeCurrencys)
      setOnceUpdated(false)
    }
  }, [storeCurrencys])

  // useEffect(() => {
  //   // dispatch(editDiamondAction(""))
  //   dispatch(selectedJewelRing({}))
  //   dispatch(selectedRingData({}))
  //   dispatch(selectedDiamondShapeName([]))
  // }, [])

  useEffect(() => {
    if (Object.keys(storeEntityIds)?.length > 0) {
      setLoading(true)
      setFilterSettingData([])
      setOrignalData([])
    }
  }, [pathname])

  // offer and engraving price plus
  const calculatePrice = (
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData,
  ) => {
    const storeBasePrice = Number.parseFloat(specificationData?.final_total) || 0
    let offerPrice = 0
    let customDuty = 0
    let tax = 0
    let price = 0

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      const discountValue = extractNumber(selectedOffer[0]?.discount) || 0
      if (selectedOffer[0]?.offer_type === "FLAT") {
        offerPrice = discountValue
      } else {
        offerPrice = Number.parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) || 0
      }
    }

    const engravingPrice =
      saveEngraving && engravingObjs?.service_rate
        ? extractNumber(engravingObjs?.service_rate.toString()) || 0
        : 0
    const embossingPrice = SaveEmbossing === true ? extractNumber(embossingData?.[0]?.service_rate.toString()) : 0
    const otherService = serviceData?.some((item) => item.is_selected === true || item.is_selected === "1")
      ? serviceData
          ?.filter((item) => item.is_selected === true || item.is_selected === "1")
          .reduce((total, item) => {
            const price = Number.parseFloat(extractNumber(item.service_rate))
            return isNaN(price) ? total : total + price
          }, 0)
      : 0

    const customPer = extractNumber(specificationData?.custom_per) || 0
    const taxPer = extractNumber(specificationData?.tax1) || 0

    customDuty =
      Number.parseFloat(
        (((storeBasePrice - offerPrice + engravingPrice + embossingPrice + otherService) * customPer) / 100).toFixed(2),
      ) || 0
    tax =
      Number.parseFloat(
        (
          ((storeBasePrice - offerPrice + customDuty + engravingPrice + embossingPrice + otherService) * taxPer) /
          100
        ).toFixed(2),
      ) || 0
    price = storeBasePrice - offerPrice + engravingPrice + embossingPrice + otherService + customDuty + tax

    return numberWithCommas(price.toFixed(2))
  }

  const handleResetFilters = () => {
    const resetPath =
      paramsItem !== "DIY"
        ? `/products/${params?.verticalCode?.toLowerCase()}`
        : pathname?.includes("start-with-a-diamond")
          ? "/make-your-customization/start-with-a-diamond"
          : pathname?.includes("start-with-a-item")
            ? "/make-your-customization/start-with-a-item"
            : "/make-your-customization/start-with-a-setting"

    if (typeof window !== "undefined") {
      sessionStorage.setItem("storeUrl", resetPath)
      sessionStorage.removeItem("filterJson")
    }
    push(resetPath)
  }

  return (
    <React.Fragment>
      {loading && <Loader />}

      <section id={styles['product-details']}>
        {paramsItem === "DIY" && !isItemDIY ? (
          <>
            <DIYProcessStepBar product_type="Product" calculatePrice={calculatePrice} />
            <BreadcrumbModule />
          </>
        ) : pathname?.includes("/start-with-a-item") ? (
          <>
            <DIYPageProcessStep />
            <BreadcrumbModule />
          </>
        ) : (
          ""
        )}

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row mb-3">
                {!loading
                  ? jewelVertical(vertical_code) === true &&
                    filterSettingData?.length > 0 && (
                      <>
                        <div
                          className={clsx(styles['product-category'], showFilter ? styles.filterShowMobile : styles.filterShowDeskstop,'col-12 col-lg-3 col-xxl-3')}
                        >
                          <div className={clsx('position-sticky top-20', styles['side-filter'])}>
                            <div className={styles['filterShowClose']}>
                              <i className="ic_remove" onClick={() => setShowFilter(!showFilter)}></i>
                            </div>
                            <div className={clsx(styles['sec-bg-color'], 'd-flex justify-content-between  px-2 py-0 py-lg-3 pb-3')}>
                              <p className="fs-15px fw-500">Filter</p>
                              <a
                                className="fs-15px fw-500 p-0"
                                onClick={handleResetFilters}
                              >
                                Reset All
                              </a>
                            </div>
                            {filterSettingData?.length > 0 && (
                              <div className={styles['filterShowMobileBody']}>
                                <Accordion alwaysOpen className='panel-body'>
                                  <Accordion.Item>
                                    <Accordion.Header>
                                      <span>Sort By</span>
                                      <i className="ic_chavron_down"></i>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <div className="form-check mb-2">
                                        <input
                                          className="form-check-input cursor-pointer"
                                          checked={sortBy == "low_to_high"}
                                          onChange={(e) => {
                                            onCheckSortBy("low_to_high", e)
                                          }}
                                          type="checkbox"
                                          value=""
                                          id="low_to_high"
                                        />
                                        <label
                                          className="form-check-label fs-13px cursor-pointer"
                                          htmlFor="low_to_high"
                                        >
                                          Price Low To High
                                        </label>
                                      </div>
                                      <div className="form-check mb-2">
                                        <input
                                          className="form-check-input cursor-pointer"
                                          checked={sortBy == "high_to_low"}
                                          onChange={(e) => {
                                            onCheckSortBy("high_to_low", e)
                                          }}
                                          type="checkbox"
                                          value=""
                                          id="high_to_high"
                                        />
                                        <label
                                          className="form-check-label fs-13px cursor-pointer"
                                          htmlFor="high_to_low"
                                        >
                                          Price High To Low
                                        </label>
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </Accordion>
                                {filterSettingData.map((e, index) => {
                                  return (
                                    e.value.length > 0 && (
                                      <Accordion
                                        key={index}
                                        onSelect={(e1) => {
                                          setActiveAccordion(e1)
                                        }}
                                        activeKey={activeAccordion}
                                        alwaysOpen
                                        className="panel-body"
                                      >
                                        <Accordion.Item eventKey={index.toString()}>
                                          <Accordion.Header>
                                            <span>{e.fielter_title}</span>
                                            <i className="ic_chavron_down"></i>
                                          </Accordion.Header>
                                          <Accordion.Body>
                                            {e.value.map((val, i) => {
                                              return (
                                                <div className="form-check mb-2" key={i}>
                                                  <input
                                                    className="form-check-input cursor-pointer"
                                                    onChange={(event) => {
                                                      appliedFilter(e, val, index, event.target.checked, i)
                                                    }}
                                                    type="checkbox"
                                                    value=""
                                                    id={`${val.data_value}`}
                                                    checked={e.selected_values.includes(val.data_key)}
                                                  />
                                                  <label
                                                    className="form-check-label fs-13px cursor-pointer"
                                                    htmlFor={`${val.data_value}`}
                                                  >
                                                    {val.data_value.split(" ")?.join(" ")?.toLowerCase()}
                                                  </label>
                                                </div>
                                              )
                                            })}
                                          </Accordion.Body>
                                        </Accordion.Item>
                                      </Accordion>
                                    )
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={clsx(styles['filterShowOverlay'])} onClick={() => setShowFilter(!showFilter)}></div>
                      </>
                    )
                  : orignalData?.length === 0 && (
                      <div className={clsx(styles['product-category'], 'col-12 col-lg-3 col-xxl-3')}>
                        <div className="d-flex justify-content-between sec-bg-color py-0 py-lg-3 pb-3">
                          <p>
                            <Skeleton height={"21px"} width={"100px"} />
                          </p>
                          <p>
                            <Skeleton height={"21px"} width={"100px"} />
                          </p>
                        </div>
                        <div className="filterShowMobileBody">
                          <Accordion alwaysOpen className="panel-body">
                            <Accordion.Item>
                              <Accordion.Header>
                                <span>
                                  <Skeleton height={"21px"} width={"100px"} />
                                </span>
                                <i className="ic_chevron_down"></i>
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-2 d-flex">
                                  <p className="me-2">
                                    <Skeleton height={"20px"} width={"20px"} />
                                  </p>
                                  <label className="form-check-label">
                                    <Skeleton height={"20px"} width={"130px"} />
                                  </label>
                                </div>
                                <div className="mb-2 d-flex">
                                  <p className="me-2">
                                    <Skeleton height={"20px"} width={"20px"} />
                                  </p>
                                  <label className="form-check-label">
                                    <Skeleton height={"20px"} width={"130px"} />
                                  </label>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                          {storeSkeletonArr.map((e, index) => {
                            return (
                              <Accordion key={index} alwaysOpen className="panel-body">
                                <Accordion.Item>
                                  <Accordion.Header>
                                    <span>
                                      <Skeleton height={"21px"} width={"100px"} />
                                    </span>
                                    <i className="ic_chevron_down"></i>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <div className="mb-2 d-flex">
                                      <p className="me-2">
                                        <Skeleton height={"20px"} width={"20px"} />
                                      </p>
                                      <label className="form-check-label">
                                        <Skeleton height={"20px"} width={"130px"} />
                                      </label>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            )
                          })}
                        </div>
                      </div>
                    )}

                <div className="col">
                  <div className="row">
                    <div className="col-12 pb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="fs-18px showing-data">Showing {rowsPerPage} Results</p>
                        <i className={clsx(styles['filter-btn'], 'ic_filter')} onClick={() => setShowFilter(!showFilter)} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <InfiniteScroll
                      className="row"
                      dataLength={orignalData !== undefined && orignalData?.length > 0 && orignalData?.length}
                      hasMore={hasMore}
                      next={() => fetchMoreData()}
                      loader={storeSkeletonArr?.map((a, i) => {
                        return (
                          <div className={`col-12 col-sm-6 col-md-4 col-lg-4 product-boxes box-resp`} key={i}>
                            <div>
                              <Card className="product-box">
                                <div className="position-relative">
                                  <figure className="figure product-img-separate my-auto d-flex align-items-center justify-content-center Skeleton">
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
                                    <div className="product-price w-100">
                                      <h2 className="fs-15px">
                                        <Skeleton />
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        )
                      })}
                      endMessage={!loading && orignalData?.length === 0 && <NoRecordFound />}
                    >
                      <React.Fragment>
                        {orignalData?.length > 0 &&
                          orignalData.map((e, index) => {
                            const productKey =
                              Object.keys(titleObj).length &&
                              titleObj.fielter_title.split(" ")[titleObj.fielter_title.split(" ").length - 1]
                            const productName =
                              typeof e === "object" && typeof e.jewellery_product_type_name === "string"
                                ? e.jewellery_product_type_name.toLowerCase()
                                : e.jewellery_product_type_name
                            const productTypeName =
                              typeof e.product_name === "string" ? e.product_name.toLowerCase() : e.product_name
                            const joinProductName =
                              typeof productName === "string" ? productName.split(" ").join("-") : productName
                            const isJewelleryProductTypeName = productName !== ""
                            const productUrl = Object.keys(titleObj).length
                              ? typeof e === "object" && typeof productKey === "string" && isJewelleryProductTypeName
                                ? `/products/${params?.verticalCode}/${productKey.toLocaleLowerCase()}/${joinProductName}/${changeUrl(`${e.product_name + "-" + e.variant_unique_id}`)}`
                                : `/products/${params?.verticalCode}/${changeUrl(`${e.product_name + "-" + e.variant_unique_id}`)}`
                              : pathname?.includes("start-with-a-diamond")
                                ? `/make-your-customization/start-with-a-diamond/jewellery/${changeUrl(e.product_name + "-" + e.variant_unique_id)}`
                                : changeUrl(e.product_name + "-" + e.variant_unique_id)

                            return (
                              <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-4 product-boxes box-resp">
                                <Link
                                  href={
                                    paramsItem === "PRODUCT"
                                      ? `/products/${params?.verticalCode?.toLowerCase()}/${changeUrl(`${e.product_name + "-" + e.variant_unique_id}`)}`
                                      : productUrl
                                  }
                                  onClick={() => openDetailsPage(e)}
                                >
                                  <Card className="product-box">
                                    <div className="position-relative">
                                      <figure className="figure product-img-separate my-auto d-flex align-items-center justify-content-center">
                                        {e?.image_urls[0] && (
                                          <LazyLoadImage
                                            effect="blur"
                                            src={e?.image_urls[0]}
                                            alt={e.product_name}
                                            loading="lazy"
                                            width="100%"
                                            height="290px"
                                          />
                                        )}
                                        {e?.image_urls[1] && (
                                          <LazyLoadImage
                                            effect="blur"
                                            src={e?.image_urls[1]}
                                            alt={e.product_name}
                                            loading="lazy"
                                            width="100%"
                                            height="290px"
                                          />
                                        )}
                                      </figure>
                                    </div>
                                    <div className="product-detail d-flex justify-content-between">
                                      <div className="">
                                        <div className="detail-height">
                                          <div className="mb-1 product-desc">
                                            <p>{e.product_name}</p>
                                          </div>
                                        </div>
                                        <div className="product-price">
                                          <h2 className="fs-15px">
                                            {storeCurrencys}{" "}
                                            {isEmpty(e.coupon_code) != "" ? (
                                              <>
                                                <span>{e.final_total_display} </span>{" "}
                                                <span className="offer-price">
                                                  {storeCurrencys} {e.origional_price}
                                                </span>
                                              </>
                                            ) : (
                                              <span>{e.final_total_display}</span>
                                            )}
                                          </h2>
                                        </div>
                                      </div>
                                      <div>
                                        {e.add_to_favourite !== "1" ? (
                                          <React.Fragment>
                                            {favLoader[e.item_id] !== undefined && favLoader[e.item_id] === true ? (
                                              <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                              </div>
                                            ) : (
                                              <div
                                                className="heart-icon"
                                                onClick={(event) => addDeleteFavouriteItem(e, event)}
                                              >
                                                <i className=" ic_heart fs-20px"></i>
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            {favLoader[e.item_id] !== undefined && favLoader[e.item_id] === true ? (
                                              <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                              </div>
                                            ) : (
                                              <div
                                                className="heart-icon"
                                                onClick={(event) => addDeleteFavouriteItem(e, event)}
                                              >
                                                <i className="ic_heart_fill fs-20px"></i>
                                              </div>
                                            )}
                                          </React.Fragment>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                </Link>
                              </div>
                            )
                          })}
                      </React.Fragment>
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Notification toastMsg={toastMsg} toastShow={toastShow} isSuccess={isSuccess} Close={() => setToastOpen()} />
    </React.Fragment>
  )
}

export default Jewellery
