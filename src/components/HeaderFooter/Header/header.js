import React, { useState, useEffect, useRef, useCallback } from "react"
import styles from "./header.module.scss"
import Form from "react-bootstrap/Form"
import { useDispatch, useSelector } from "react-redux"
import {
  loginModal,
  headerLoginModal,
  FooterLoginModal,
  HeaderLogoData,
  diamondPageChnages,
  storeCurrency,
  storeCurrencyData,
  selectedJewelRing,
  editDiamondAction,
  selectedRingData,
  selectedDiamondObject,
  addFilterAction,
  SelectFilterAction,
  selectDiamondAction,
  diamondNumber,
  addedRingData,
  IsSelectedDiamond,
  isRingSelected,
  addedDiamondData,
  storeFilteredData,
  storeActiveFilteredData,
  storeSelectedDiamondData,
  jeweleryDIYimage,
  storeSelectedDiamondPrice,
  storeSpecData,
  storeDiamondNumber,
  diamondShape,
  diamondImage,
  finalCanBeSetData,
  diamondSelectShape,
  jewelSelectedCategory,
  storeEmbossingData,
  saveEmbossings,
  previewImageDatas,
  activeImageData,
  DiyStepersData,
  ActiveStepsDiy,
  DIYName,
  diaColorType,
  thresholdValue,
  showMoreValue,
  activeIdMenu,
  storeEntityId,
} from "../../../Redux/action"
import Commanservice, { domain } from "../../../CommanService/commanService"
import {
  changeUrl,
  isEmpty,
  jewelVertical,
  RandomId,
  safeParse,
} from "../../../CommanFunctions/commanFunctions"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import commanService from "../../../CommanService/commanService"
import SignIn from "@/components/Login/signIn"
import Notification from "@/CommanUIComp/Notification/Notification"

const Header = ({ storeData }) => {
  const storeEntityIds = useSelector((state) => state.storeEntityId)
  const loginDatas = useSelector((state) => state.loginData)
  const showMoreValues = useSelector((state) => state.showMoreValue)
  const storeFavCounts = useSelector((state) => state.storeFavCount)
  const countCarts = useSelector((state) => state.countCart)
  const storeCurrencyDatas = useSelector((state) => state.storeCurrencyData)
  const headerLoginModals = useSelector((state) => state.headerLoginModal)
  const activeIdMenus = useSelector((state) => state.activeIdMenu)
  const HeaderLogoDatas = useSelector((state) => state.HeaderLogoData)
  const productNameLists = useSelector((state) => state.productNameList)
  
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const menuContainerRef = useRef(null)
  const itemRefs = useRef([])

  // Toast Msg
  const [toastShow, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [showMore, setShowMore] = useState(showMoreValues ?? false)

  const activeVerticalCode =
    typeof window !== "undefined" && sessionStorage.getItem("DIYVertical")
  const ResetPasswordURL = pathname?.includes("reset-password")
  const isLogin = Object.keys(loginDatas || {}).length > 0

  let megaMenu = null
  if (typeof window !== "undefined") {
    megaMenu = sessionStorage.getItem("megaMenu")
  }

  const data = storeEntityIds
  const obj = {
    SITDeveloper: "1",
    a: "SetupDiyVertical",
    store_id: data?.mini_program_id,
    tenant_id: data?.tenant_id,
    entity_id: data?.entity_id,
    origin: domain,
    unique_id: "",
  }

  // responsive Header
  const [className, setClassName] = useState("")
  const [navbarToggle, setNavbarToggle] = useState(false)
  const [isSearch, setIsSearch] = useState(false)

  // One time update API
  const [onceUpdatedLogo, setOnceUpdatedLogo] = useState(false)

  // Header Data
  const [storeHeaderLogo, setStoreHeaderLogo] = useState(HeaderLogoDatas ?? [])
  const [contactData, setContactData] = useState([])
  const [currencyCode, setCurrencyCode] = useState([])

  // Navbar Data
  const [navMenuFirst, setNavMenuFirst] = useState([])
 // Navbar Data with persistence
  const [navMenuSecond, setNavMenuSecond] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("navMenuData")
      return cached ? JSON.parse(cached) : []
    }
    return []
  })

  //threshold for showmore menu
  const [threshold, setThreshold] = useState(null)
  const [scroll, setScroll] = useState(false)

  const setHeaderLogo = (data) => {
    const filterLogo =
      isEmpty(data) !== ""
        ? data.filter((h) => h.logo_type === "HEADER")
        : JSON.parse(megaMenu)?.logo_data.filter((h) => h.logo_type === "HEADER")

    setStoreHeaderLogo(filterLogo)
    dispatch(HeaderLogoData(filterLogo))

    const favLogo =
      isEmpty(data) !== ""
        ? data.filter((h) => h.logo_type === "FAVICON")
        : JSON.parse(megaMenu)?.logo_data.filter((h) => h.logo_type === "FAVICON")

    if (isEmpty(favLogo) !== "" && favLogo?.length > 0) {
      var link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement("link")
        link.rel = "icon"
        document.head.appendChild(link)
        if (favLogo?.length > 0) {
          link.href = favLogo?.[0]?.image
        }
      }
      if (favLogo?.length > 0) {
        link.href = favLogo?.[0]?.image
      }
    }
  }

  const handleNavigationMenu = (navigation_data) => {
    for (let c = 0; c < navigation_data.length; c++) {
      if (
        navigation_data[c].product_vertical_name === "LGDIA" ||
        navigation_data[c].product_vertical_name === "DIAMO" ||
        navigation_data[c].product_vertical_name === "GEDIA" ||
        navigation_data[c].product_vertical_name === "LDIAM" ||
        navigation_data[c].product_vertical_name === "GEMST"
      ) {
        let diy_detaills = []
        let sub_menu = navigation_data[c]["sub_menu"]
        for (let d = 0; d < sub_menu.length; d++) {
          let detaills = sub_menu[d]["detaills"]
          if (detaills?.length !== 0) {
            if (detaills?.length > 10) {
              const arrayDetails = 2
              const resultDetails = [[], []]
              const dataDetails = Math.ceil(detaills.length / 2)
              for (let i = 0; i < arrayDetails; i++) {
                for (let j = 0; j < dataDetails; j++) {
                  const valueDetails = detaills[j + i * dataDetails]
                  if (!valueDetails) continue
                  resultDetails[i].push(valueDetails)
                }
              }
              for (let e = 0; e < resultDetails.length; e++) {
                for (let f = 0; f < resultDetails[e].length; f++) {
                  let item = resultDetails[e][f]
                  if (item.logic_code === "size_group") item.logic_code = "carat"
                  item.titles = item.title.replaceAll(" ", "-")
                  item.unique_id = isEmpty(navigation_data[c].unique_id)
                  if (item.logic_code.includes("_")) {
                    let output = item.logic_code.split("_").pop()
                    item.router_link = `${getAlias(
                      navigation_data[c],
                      navigation_data[c].router_link
                    )}/${output}/${item.titles.toLowerCase()}`
                  } else {
                    item.router_link = `${getAlias(
                      navigation_data[c],
                      navigation_data[c].router_link
                    )}/${item.logic_code}/${item.titles.toLowerCase()}`
                  }
                }
              }
              sub_menu[d].detaills = [...resultDetails]
            } else {
              for (let e = 0; e < detaills.length; e++) {
                let item = detaills[e]
                if (item.logic_code === "size_group") item.logic_code = "carat"
                item.titles = item.title.replaceAll(" ", "-")
                item.unique_id = isEmpty(navigation_data[c].unique_id)
                if (item.logic_code.includes("_")) {
                  let output = item.logic_code.split("_").pop()
                  item.router_link = `${getAlias(
                    navigation_data[c],
                    navigation_data[c].router_link
                  )}/${output}/${item.titles.toLowerCase()}`
                } else {
                  item.router_link = `${getAlias(
                    navigation_data[c],
                    navigation_data[c].router_link
                  )}/${item.logic_code}/${item.titles.toLowerCase()}`
                }
              }
            }
          } else {
            if (isEmpty(sub_menu[d]?.diy_json) !== "") {
              let diy_jsons = safeParse(sub_menu[d]?.diy_json)
              for (let m = 0; m < diy_jsons?.length; m++) {
                let datas = {
                  unique_id: isEmpty(navigation_data[c].unique_id),
                  type:
                    isEmpty(diy_jsons[m]?.diy_type) !== ""
                      ? isEmpty(diy_jsons[m]?.diy_type)
                      : "0",
                  title: diy_jsons[m]?.value,
                  router_link: `/make-your-customization${diy_jsons[m]?.router_link}`,
                  icon: isEmpty(diy_jsons[m]?.icon),
                  vertical_code: diy_jsons[m]?.vertical,
                  logic_code: diy_jsons[m]?.vertical,
                }
                detaills.push(datas)
              }
              sub_menu[d].detaills = detaills
            }
          }
        }
        navigation_data[c].sub_menus = JSON.parse(JSON.stringify(navigation_data[c].sub_menu))
      } else {
        const originalSubMenus = navigation_data[c]["segmantion_data"]
        let combinedSubMenu = null
        const groupedByTitleArray = []
        const titleIndexMap = new Map()
        for (let d = 0; d < originalSubMenus?.length; d++) {
          const sub_menu = originalSubMenus[d]
          const { filter_json, unique_id, product_vertical, sub_category, display_name, sequence, ...rest } = sub_menu
          if (!combinedSubMenu) {
            combinedSubMenu = {
              unique_id,
              product_vertical,
              sub_category,
              display_name,
              sequence,
              ...rest,
            }
          }
          const detailsArray =
            safeParse(filter_json) !== null ? safeParse(isEmpty(filter_json)).sort((a, b) => a.sequence - b.sequence) : []
          detailsArray.forEach((detail) => {
            if (isEmpty(detail.status) === "1" || isEmpty(detail.status) === "") {
              const display_name = detail.display_title
              const selectedValues = Array.isArray(detail.selected_value) ? detail.selected_value : []
              if (!titleIndexMap.has(display_name)) {
                titleIndexMap.set(display_name, groupedByTitleArray.length)
                groupedByTitleArray.push({
                  display_name,
                  product_vertical: sub_menu.vertical_code,
                  item_group: sub_menu.item_group,
                  detaills: [],
                })
              }
              const groupIndex = titleIndexMap.get(display_name)
              selectedValues.forEach((sel) => {
                groupedByTitleArray[groupIndex].detaills.push({
                  unique_id: isEmpty(navigation_data[c].unique_id),
                  logic_code: detail.msf_key || detail.logic_code || "",
                  code: sel.key || "",
                  type: isEmpty(sel?.diy_type) !== "" ? isEmpty(sel?.diy_type) : "0",
                  vertical_code:
                    detail.msf_key === "DIY" ? sel.vertical : navigation_data[c].product_vertical_name || "",
                  title: sel.value || "",
                  icon: sel.icon || "",
                  master_code: sel.master_code || "",
                  router_link:
                    detail.msf_key === "DIY"
                      ? getAlias(navigation_data[c], `/${detail.msf_key.toLowerCase()}${sel.router_link}`, "diy")
                      : detail.msf_key.split("_").pop()
                      ? getAlias(
                          navigation_data[c],
                          `${navigation_data[c].router_link}/${detail.msf_key
                            .split("_")
                            .pop()}/${sel.value.replaceAll(" ", "-").toLowerCase()}`
                        )
                      : getAlias(
                          navigation_data[c],
                          `${navigation_data[c].router_link}/${detail.msf_key}/${sel.value
                            .replaceAll(" ", "-")
                            .toLowerCase()}`
                        ),
                })
              })
              const details = groupedByTitleArray[groupIndex].detaills
              if (details.length > 10) {
                const arrayDetails = 2
                const resultDetails = Array.from({ length: arrayDetails }, () => [])
                const chunkSize = Math.ceil(details.length / arrayDetails)
                for (let i = 0; i < arrayDetails; i++) {
                  for (let j = 0; j < chunkSize; j++) {
                    const item = details[j + i * chunkSize]
                    if (item) resultDetails[i].push(item)
                  }
                }
                groupedByTitleArray[groupIndex].detaills = resultDetails
              }
            }
          })
        }
        if (combinedSubMenu) {
          combinedSubMenu.detaills = groupedByTitleArray
          navigation_data[c]["sub_menus"] = groupedByTitleArray
        } else {
          navigation_data[c]["sub_menus"] = []
        }
      }
    }
    const result = []
    for (let i = 0; i < navigation_data?.length; i++) {
      result.push(navigation_data[i])
    }
    setNavMenuSecond([...result])
    sessionStorage.setItem("navMenuData",JSON.stringify([...result]))
  }

  const headerSectionData = useCallback(
    (datas) => {
      let cachedMenu = null
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("megaMenu")
        try {
          cachedMenu = stored ? JSON.parse(stored) : null
        } catch (e) {
          console.error("Failed to parse megaMenu:", e)
          cachedMenu = null
        }
      }

      const miniProgramId = datas?.mini_program_id || storeEntityIds?.mini_program_id
      if (!miniProgramId) {
        console.warn("❌ mini_program_id not found")
        return
      }

      if (!cachedMenu) {
        const obj = {
          a: "GetHomeNavigation",
          store_id: miniProgramId,
          type: "B2C",
        }
        commanService.postLaravelApi("/NavigationMegamenu", obj, {
          headers: {
            origin: "https://uat.zurahjewellery.com",
            referer: "https://uat.zurahjewellery.com",
          },
        })
          .then((res) => {
            if (res.data.success === 1) {
              const responseData = res.data.data
              if (typeof window !== "undefined") {
                sessionStorage.setItem("megaMenu", JSON.stringify(responseData))
              }
              const navigation_data = isEmpty(responseData["navigation_data"])
              const logo_data = isEmpty(responseData["logo_data"])
              const currency_data = isEmpty(responseData["currency_data"])
              const contact_data = isEmpty(responseData["contact_data"])
              setCurrencyCode(currency_data)
              setHeaderLogo(logo_data)
              setContactData(contact_data)
              dispatch(thresholdValue(null))
              dispatch(showMoreValue(false))
              if (navigation_data.length > 0) {
                handleNavigationMenu(navigation_data)
              }
              if (Array.isArray(currency_data) && currency_data.length > 0) {
                dispatch(storeCurrencyData(currency_data))
                const defaultCurrency = currency_data.find((e) => e?.is_default === 1)
                const currencyToUse = defaultCurrency || currency_data[0]
                updateCartCurrency(isEmpty(currencyToUse?.mp_store_price), miniProgramId)
              }
            } else {
              setToastOpen(true)
              setIsSuccess(false)
              setToastMsg(res.data.message)
            }
          })
          .catch((err) => {
            console.error("MegaMenu API error:", err)
          })
      } else {
        const navigation_data = isEmpty(cachedMenu["navigation_data"])
        const logo_data = isEmpty(cachedMenu["logo_data"])
        const contact_data = isEmpty(cachedMenu["contact_data"])
        setHeaderLogo(logo_data)
        setContactData(contact_data)
        if (navigation_data.length > 0) {
          handleNavigationMenu(navigation_data)
        }
      }
    },
    [storeEntityIds, dispatch]
  )

  const updateCartCurrency = (e, miniProgramId) => {
    const obj = {
      a: "updateCartCurrency",
      store_id: miniProgramId ?? storeEntityIds?.mini_program_id,
      member_id: Object.keys(loginDatas).length > 0 ? loginDatas.member_id : RandomId,
      new_currency: e,
    }
    Commanservice.postLaravelApi("/CartMaster ", obj)
      .then((res) => {
        if (res.data.success !== 1) {
          setToastOpen(true)
          setIsSuccess(false)
          setToastMsg(res.data.message)
        }
      })
      .catch(() => {})
  }

  const showLoginPage = () => {
    dispatch(loginModal(true))
    dispatch(headerLoginModal(true))
    dispatch(FooterLoginModal(false))
  }

  const routerChange = (event, link, urlName) => {
    // if (!urlName) {
    //   // dispatch(editDiamondAction(""))
    //   dispatch(selectedJewelRing({}))
    //   dispatch(selectedRingData({}))
    //   dispatch(selectedDiamondObject({}))
    //   dispatch(selectDiamondAction({}))
    //   dispatch(diamondNumber(""))
    //   dispatch(storeDiamondNumber(""))
    //   dispatch(addedDiamondData({}))
    //   dispatch(addedRingData({}))
    //   dispatch(IsSelectedDiamond(false))
    //   dispatch(isRingSelected(false))
    //   dispatch(storeFilteredData({}))
    //   dispatch(storeActiveFilteredData({}))
    //   dispatch(storeSelectedDiamondData({}))
    //   dispatch(jeweleryDIYimage(""))
    //   dispatch(storeSelectedDiamondPrice(""))
    //   dispatch(storeSpecData({}))
    //   // dispatch(storeProdData({}))
    //   dispatch(diamondShape(""))
    //   dispatch(diamondImage(""))
    //   dispatch(finalCanBeSetData([]))
    //   dispatch(diamondSelectShape({}))
    //   dispatch(jewelSelectedCategory({}))
    //   dispatch(storeEmbossingData([]))
    //   dispatch(saveEmbossings(false))
    //   dispatch(previewImageDatas([]))
    //   dispatch(activeImageData([]))
    //   dispatch(DiyStepersData([]))
    //   dispatch(ActiveStepsDiy(0))
    //   dispatch(diaColorType("White"))
    // }
    if (!pathname?.includes("products")) {
      dispatch(addFilterAction([]))
      dispatch(SelectFilterAction(true))
      dispatch(storeSelectedDiamondData({}))
      dispatch(diamondSelectShape({}))
      dispatch(jewelSelectedCategory({}))
      dispatch(storeEmbossingData([]))
      dispatch(saveEmbossings(false))
      dispatch(previewImageDatas([]))
      dispatch(activeImageData([]))
      dispatch(DiyStepersData([]))
      dispatch(ActiveStepsDiy(0))
      dispatch(diaColorType("White"))
    }
    if (link !== "") {
      event.stopPropagation()
      event.preventDefault()
      router.push(link) // Use Next.js router
      typeof window !== "undefined" && sessionStorage.setItem("storeUrl", link)
    }
    // dispatch(diamondPageChnages(false))
    setNavbarToggle(false)
    typeof window !== "undefined" && sessionStorage.removeItem("filterJson")
  }

  const handleFilter = (titleVal) => {
    
    if (!productNameLists.includes(titleVal)) {
      dispatch(addFilterAction([...productNameLists, titleVal]))
    }
  }

  const changeCurrency = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (typeof window !== "undefined") {
      sessionStorage.setItem("storeUrl", pathname)
    }
    const selected = storeCurrencyDatas.find((s) => s.mp_store_price === e.target.value)
    if (!selected) return

    if (selected?.mp_b2c_url && selected?.is_store !== 1) {
      window.open(selected.mp_b2c_url, "_blank")
    } else {
      updateCartCurrency(selected.mp_store_price)
      dispatch(storeCurrency(selected.mp_store_price))
      if (typeof window !== "undefined" && !pathname?.includes("/start-with-a-setting")) {
        router.push("/") // Use Next.js router
      }
    }
  }

  // Initialize header UI
  useEffect(() => {
    if (!onceUpdatedLogo) {
      setOnceUpdatedLogo(true)
      if (data && Object.keys(data)?.length > 0 && navMenuSecond?.length === 0) {
        headerSectionData(data)
      }
      if (ResetPasswordURL) {
        dispatch(headerLoginModal(true))
        dispatch(loginModal(true))
      }
      
    }
    const handleScroll = () => {
      setScroll(window.scrollY > (window.innerWidth > 992 ? 80 : 0))
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    } 
  }, [onceUpdatedLogo, storeEntityIds, ResetPasswordURL, headerSectionData])
  // useEffect(() => {
  //   if (!pathname?.includes("start-with-a-diamond")) {
  //     dispatch(editDiamondAction(""))
  //     dispatch(selectedJewelRing({}))
  //     dispatch(selectedRingData({}))
  //     dispatch(selectedDiamondObject({}))
  //     dispatch(selectDiamondAction({}))
  //     dispatch(diamondNumber(""))
  //     dispatch(storeDiamondNumber(""))
  //     dispatch(addedDiamondData({}))
  //     dispatch(addedRingData({}))
  //     dispatch(IsSelectedDiamond(false))
  //     dispatch(isRingSelected(false))
  //     dispatch(storeFilteredData({}))
  //     dispatch(storeActiveFilteredData({}))
  //     dispatch(storeSelectedDiamondData({}))
  //     dispatch(jeweleryDIYimage(""))
  //     dispatch(storeSelectedDiamondPrice(""))
  //     dispatch(storeSpecData({}))
  //     dispatch(storeProdData({}))
  //     dispatch(diamondShape(""))
  //     dispatch(diamondImage(""))
  //     dispatch(finalCanBeSetData([]))
  //     dispatch(diamondSelectShape({}))
  //     dispatch(jewelSelectedCategory({}))
  //     dispatch(storeEmbossingData([]))
  //     dispatch(saveEmbossings(false))
  //     dispatch(previewImageDatas([]))
  //     dispatch(activeImageData([]))
  //   }
  //   if (!pathname?.includes("products")) {
  //     dispatch(addFilterAction([]))
  //     dispatch(SelectFilterAction(true))
  //     dispatch(diamondSelectShape({}))
  //     dispatch(jewelSelectedCategory({}))
  //   }
  // }, [pathname, dispatch])

  useEffect(() => {
    const responseData = sessionStorage.getItem("megaMenu");

    if (responseData) {
      try {
        const parsedData = JSON.parse(responseData);
        const logo_data = parsedData?.logo_data;
        setContactData(parsedData?.contact_data);
        dispatch(storeCurrencyData(parsedData?.currency_data))

        if (!isEmpty(logo_data)) {
          setHeaderLogo(logo_data);
        } else {
          setHeaderLogo(null); 
        }
      } catch (err) {
        console.error("Failed to parse megaMenu:", err);
        setHeaderLogo(null);
      }
    } else {
      setHeaderLogo(null); // Clear if session value removed
    }
  }, []);

  //Active Submenu of Mainmenu
  const isMenuActive = (menu, item = {}, sub = {}, parent = {}) => {
    const lowerPath = pathname?.toLowerCase() || ""
    const linksToCheck = [item?.router_link, sub?.display_name, parent?.unique_id].filter(Boolean)
    for (const link of linksToCheck) {
      if (
        lowerPath.includes(item?.router_link?.toLowerCase()) &&
        activeIdMenus === item?.unique_id &&
        activeVerticalCode === item?.vertical_code
      ) {
        return true
      }
    }
    return false
  }

  //Active main menu
  const isActiveParentMenu = (menus, item = {}) => {
    const lowerPath = pathname?.toLowerCase() || ""
    if ((menus && menus === pathname) || (pathname?.includes(menus) && activeIdMenus === item.unique_id)) {
      return true
    }
    if (item?.product_vertical_name === "DIY" && lowerPath.includes("start-with-a") && activeIdMenus === item.unique_id) {
      return true
    }
    if (Array.isArray(item?.sub_menus) && activeIdMenus === item.unique_id) {
      for (const subMenu of item.sub_menus) {
        if (Array.isArray(subMenu?.detaills)) {
          for (const petaMenu of subMenu.detaills) {
            if (Array.isArray(petaMenu)) {
              for (const subPetaMenu of petaMenu) {
                if (Array.isArray(subPetaMenu)) {
                  for (const subofPetaMenu of subPetaMenu) {
                    if (
                      subofPetaMenu?.router_link &&
                      lowerPath.toLowerCase()?.includes(subofPetaMenu.router_link) &&
                      activeIdMenus === subofPetaMenu?.unique_id
                    ) {
                      return true
                    }
                  }
                }
              }
            }
            if (
              petaMenu?.router_link &&
              lowerPath.toLowerCase()?.includes(petaMenu.router_link) &&
              activeIdMenus === petaMenu?.unique_id
            ) {
              return true
            }
          }
        }
        if (
          subMenu?.router_link &&
          lowerPath.toLowerCase()?.includes(subMenu.router_link) &&
          activeIdMenus === subMenu?.unique_id
        ) {
          return true
        }
      }
    }
    return false
  }

  //find threshold value for navigation
  const measureItemsPerLine = useCallback(() => {
    if (!menuContainerRef.current || navMenuSecond?.length === 0) {
      return
    }
    const menuContainer = menuContainerRef.current
    const containerWidth = menuContainer.offsetWidth
    let currentLineWidth = 0
    let itemsOnCurrentLine = 0

    navMenuSecond.forEach((_, index) => {
      const itemRef = itemRefs.current[index]
      if (itemRef && itemRef.offsetWidth) {
        const itemWidth = itemRef.offsetWidth
        const itemMarginRight = parseFloat(window.getComputedStyle(itemRef).marginRight) || 0
        const totalItemWidth = itemWidth + itemMarginRight * 4
        currentLineWidth += totalItemWidth
        itemsOnCurrentLine++

        if (index >= 3) {
          if (currentLineWidth > 991) {
            setThreshold(index)
            dispatch(thresholdValue(index))
            return
          }
        } else {
          if (currentLineWidth > containerWidth) {
            setThreshold(itemsOnCurrentLine)
            dispatch(thresholdValue(itemsOnCurrentLine))
            return
          }
        }
      }
    })
  }, [menuContainerRef, navMenuSecond, threshold, setShowMore, dispatch])

  useEffect(() => {
    let timeoutId
    const measure = () => {
      const menuContainer = menuContainerRef.current
      if (navMenuSecond?.length > 0 && menuContainer) {
        measureItemsPerLine()
        if (threshold !== null && navMenuSecond?.slice(threshold)?.length > 0) {
          handleSetShowMore(true)
          // dispatch(showMoreValue(true))
          // dispatch(thresholdValue(threshold))
        }
      }
    }

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(measure, 100)
    }

    // Initial measure
    measure()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [measureItemsPerLine, navMenuSecond, threshold, dispatch, setShowMore, menuContainerRef])

  const handleSetShowMore = useCallback((value) => {
    setShowMore(value)
    // dispatch(showMoreValue(value))
  }, [])

  const allProductData = useCallback(
    (obj, data) => {
      commanService
        .postApi("/Diy", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const stepps = res.data.data.filter((item) => data.router_link.includes(item.router_link))[0]
            if (
              stepps?.details &&
              Array.isArray(stepps?.details) &&
              data?.router_link?.includes("/start-with-a-item")
            ) {
              const updatedSteps = [
                {
                  position: 0,
                  display_name: stepps?.from_display_name,
                  vertical: stepps?.vertical_code,
                },
                ...stepps.details.map((step, index) => ({
                  ...step,
                  position: index + 1,
                })),
                { position: stepps.details.length + 1, display_name: "Complete" },
              ]
              dispatch(DiyStepersData(updatedSteps))
            } else {
              dispatch(DiyStepersData([]))
            }
          } else {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(res.data.message)
          }
        })
        .catch((error) => {})
    },
    [dispatch]
  )

  const handleClick = (event, e) => {
    event.preventDefault()
    router.push(getAlias(e, e.router_link))
  }

  const getAlias = (e, link, type) => {
    const alias = changeUrl(e.menu_name)
    const verticalCode = e.product_vertical_name.toLowerCase()
    if (link.toLowerCase().includes(`/${verticalCode}`) && !type) {
      return link.toLowerCase().replace(`/${verticalCode}`, `/${alias}`)
    } else if (link.toLowerCase().includes("/diy")) {
      return link.toLowerCase().replace(`/diy`, `/make-your-customization`)
    } else {
      return `/${alias}`
    }
  }

  return (
    <React.Fragment>
      <section id={`${styles.Header}`}>
        <div className={`${styles["bg-nav"]} ${styles.topbar}`}>
          <div className="container">
            <div className={`${styles["top-bar-row"]}`}>
              <div className={`${styles["top-bar-col"]}`}>
                {contactData.length > 0 &&
                  contactData.map((e, index) => (
                    <ul className={`nav btn-margin`} key={index}>
                      {isEmpty(e?.mobile) !== "" && (
                        <li className={`${styles["nav-item"]}`}>
                          <Link href={`tel:${e?.mobile}`} className={`${styles["nav-link"]}`}>
                            <i className={`ic_telephone me-1`}></i>
                            {isEmpty(e?.country_code)} {isEmpty(e?.mobile)}
                          </Link>
                        </li>
                      )}
                      {isEmpty(e?.email) !== "" && (
                        <li className={`${styles["nav-item"]}`}>
                          <Link href={`mailto:${e?.email}`} className={`${styles["nav-link"]}`}>
                            <i className={`ic_email me-1`}></i>
                            {isEmpty(e?.email)}
                          </Link>
                        </li>
                      )}
                    </ul>
                  ))}
              </div>
              <div className={`${styles["top-bar-col"]} ${styles.center}`}>
                <p className={`${styles["mb-0"]} ${styles["top-desc"]}`}>Free Shipping | 100-Day Easy Returns</p>
              </div>
              <div className={`${styles["top-bar-col"]}`}>
                <div className={`d-flex justify-content-end gap-2`}>
                  {storeEntityIds && storeCurrencyDatas.length > 0 && (
                    <Form.Select
                      className={clsx(`${styles["lang-country"]} ${styles["form-select"]}`)}
                      value={storeCurrency}
                      id={`${styles.cars}`}
                      onChange={(e) => changeCurrency(e)}
                      aria-label="Default select example"
                    >
                      {storeCurrencyDatas.map((e, i) => (
                        <option key={i} value={isEmpty(e.mp_store_price)}>
                          {isEmpty(e.mp_store_price)}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.B2cMenu}`}>
          <div className={`container`}>
            <nav
              className={clsx(
                `${styles.navbar} ${styles["navbar-expand-lg"]} ${styles["desktop-header"]} ${styles["header-shadow"]}`
              )}
              id={`${scroll ? `${styles["fixed-header"]}` : ""}`}
            >
              <div className={`${styles["header-inner"]} ${styles["mobile-header"]}`}>
                {isEmpty(storeHeaderLogo) && storeHeaderLogo.length > 0
                  ? storeHeaderLogo.map((h, index) => (
                      <React.Fragment key={index}>
                        <Link
                          className={`${styles["navbar-brand"]} navbar-brand_01 ${styles["z_logo_align"]}`}
                          aria-label="Logo"
                          href={"/"}
                          onClick={() => {
                            setNavbarToggle(false)
                            setClassName("")
                            // dispatch(addFilterAction([]))
                            // dispatch(SelectFilterAction(true))
                            // dispatch(DiyStepersData([]))
                            // dispatch(ActiveStepsDiy(0))
                            // dispatch(storeEmbossingData([]))
                            // dispatch(saveEmbossings(false))
                            // dispatch(previewImageDatas([]))
                            // dispatch(activeImageData([]))
                            // dispatch(diaColorType("White"))
                            typeof window !== "undefined" && sessionStorage.removeItem("DIYVertical")
                          }}
                        >
                          {isEmpty(h.image) !== "" ? (
                            <Image src={isEmpty(h.image) || "/placeholder.svg"} alt="Zurah Logo" className={`img-fluid`} width={160} height={29} />
                          ) : (
                            <Image
                              src="https://dummyimage.com/150x100/ebebeb/000000.jpg"
                              width={160}
                              height={29}
                              alt="dummy image"
                              className={`img-fluid wh-auto`}
                            />
                          )}
                        </Link>
                      </React.Fragment>
                    ))
                  : ""}

                {!navbarToggle ? (
                  <button
                    className={clsx(styles["navbar-toggler"], "navbar-toggler")}
                    type="button"
                    onClick={() => setNavbarToggle(true)}
                    aria-label="Toggle navigation"
                  >
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                  </button>
                ) : (
                  <button
                    className={clsx(`${styles["navbar-toggler"]} ${styles.active}, "navbar-toggler"`)}
                    type="button"
                    onClick={() => setNavbarToggle(false)}
                    aria-label="Toggle navigation"
                  >
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                    <span className={`${styles["navbar-toggler-icon"]}`}></span>
                  </button>
                )}

                <div
                  ref={menuContainerRef}
                  className={`collapse ${styles["navbar-collapse"]} d-lg-flex justify-content-lg-between ${
                    navbarToggle && `${styles.show}`
                  }`}
                  id={`navbarNavAltMarkup`}
                >
                  <ul
                    className={clsx(
                      `${styles["navbar-nav"]} d-lg-flex justify-content-lg-between p-0 ${styles["main-menu"]}`
                    )}
                  >
                    {navMenuSecond.length > 0 &&
                      navMenuSecond.map((e, index) => {
                        if (threshold !== null && index >= threshold) {
                          return null
                        }
                        return (
                          <React.Fragment key={index}>
                            <li
                              className={clsx(
                                `${styles["nav-item"]} ${styles.dropdown} dropdown-hover position-static`
                              )}
                              ref={(el) => (itemRefs.current[index] = el)}
                            >
                              {e?.sub_menus?.length > 0 && e?.product_vertical_name != "DIY" ? (
                                <React.Fragment>
                                  <div className={`d-flex align-items-center justify-content-between`}>
                                    <Link
                                      onClick={(event) => {
                                        handleClick(event, e)
                                        routerChange(event, getAlias(e, e.router_link))
                                        // dispatch(activeIdMenu(e.unique_id))
                                        typeof window !== "undefined" && sessionStorage.removeItem("collection_id")
                                        typeof window !== "undefined" && sessionStorage.removeItem("finish_type")
                                        if (className === "") {
                                          setClassName(e.unique_id)
                                        } else {
                                          if (className === e.unique_id) {
                                            setClassName("")
                                          } else {
                                            setClassName(e.unique_id)
                                          }
                                        }
                                      }}
                                      className={clsx(`${styles["nav-link"]} ${
                                        className === e.unique_id && `${styles.show}`
                                      } ${
                                        isActiveParentMenu(getAlias(e, e.router_link), e) ? `${styles.active}` : ""
                                      }`)}
                                      href={getAlias(e, e.router_link)}
                                      data-bs-toggle="dropdown"
                                    >
                                      {e?.menu_name}{" "}
                                      <span
                                        className={`minus-plus ${className === e?.unique_id ? "ic_minus" : "ic_plus"}`}
                                      ></span>
                                    </Link>
                                  </div>
                                  {isEmpty(e?.submenu) === 1 && (
                                    <div
                                      className={clsx(
                                        `${styles["dropdown-menu"]} ${styles.megamenu}  ${
                                          className === e.unique_id && `${styles.show}`
                                        }`
                                      )}
                                      role="menu"
                                    >
                                      <div className={styles["megamenu-inner"]}>
                                        <div className={styles["megamenu-left"]}>
                                          <div className={styles["megamenu-row"]}>
                                            {isEmpty(e.sub_menus) &&
                                              e?.sub_menus?.length > 0 &&
                                              e?.sub_menus?.map((s, inx) => {
                                                return (
                                                  <React.Fragment key={inx}>
                                                    <div className={styles["menu-col"]}>
                                                      <div className={styles["col-megamenu"]}>
                                                        <h6 className={clsx(`${styles.title} mb-2 fs-16px`)}>
                                                          {isEmpty(s.display_name)}
                                                        </h6>
                                                        {s.detaills?.length > 0 ? (
                                                          <ul className={`${styles["megamenu-menu"]}`}>
                                                            {s.detaills?.map((d, index) => {
                                                              if (d.length > 0) {
                                                                return d.map((f, indx) => {
                                                                  if (f.title === "") {
                                                                    return null
                                                                  }
                                                                  return (
                                                                    <li
                                                                      key={indx}
                                                                      className={`${styles["megamenu-menu-item"]} ${styles["inner_li"]}`}
                                                                    >
                                                                      <Link
                                                                        onClick={(e) => {
                                                                          dispatch(activeIdMenu(f?.unique_id))
                                                                          if (d?.type === "1") {
                                                                            allProductData(obj, d)
                                                                          }
                                                                          typeof window !== "undefined" &&
                                                                            sessionStorage.setItem(
                                                                              "DIYVertical",
                                                                              f.vertical_code
                                                                            )
                                                                          typeof window !== "undefined" &&
                                                                            sessionStorage.setItem("storeUrl", f.router_link)
                                                                          dispatch(DIYName(d.title))
                                                                          routerChange(e, f.router_link)
                                                                          handleFilter(f.title)
                                                                          typeof window !== "undefined" &&
                                                                            sessionStorage.removeItem("collection_id")
                                                                          typeof window !== "undefined" &&
                                                                            sessionStorage.removeItem("finish_type")
                                                                        }}
                                                                        href={f.router_link}
                                                                        className={clsx(
                                                                          `${
                                                                            styles["text-start"]
                                                                          } fs-13px cursor-pointer ${
                                                                            isMenuActive(f.title, f, s, e)
                                                                              ? `${styles.active}`
                                                                              : ""
                                                                          }`
                                                                        )}
                                                                      >
                                                                        {f?.icon !== "" && (
                                                                          <span
                                                                            className={clsx(`${f?.icon} me-2`)}
                                                                          ></span>
                                                                        )}
                                                                        {f.title
                                                                          .split(" ")
                                                                          ?.join(" ")
                                                                          ?.toLowerCase()}
                                                                      </Link>
                                                                    </li>
                                                                  )
                                                                })
                                                              } else {
                                                                return (
                                                                  <li
                                                                    key={index}
                                                                    className={styles["megamenu-menu-item"]}
                                                                  >
                                                                    <Link
                                                                      onClick={(e) => {
                                                                        dispatch(activeIdMenu(d?.unique_id))
                                                                        if (d?.type === "1") {
                                                                          allProductData(obj, d)
                                                                        }
                                                                        typeof window !== "undefined" &&
                                                                          sessionStorage.setItem(
                                                                            "DIYVertical",
                                                                            d.vertical_code
                                                                          )
                                                                        typeof window !== "undefined" &&
                                                                          sessionStorage.setItem("storeUrl", d?.router_link)
                                                                        dispatch(DIYName(d.title))
                                                                        routerChange(e, d?.router_link)
                                                                        handleFilter(d.title)
                                                                        typeof window !== "undefined" &&
                                                                          sessionStorage.removeItem("collection_id")
                                                                        typeof window !== "undefined" &&
                                                                          sessionStorage.removeItem("finish_type")
                                                                      }}
                                                                      href={d?.router_link}
                                                                      className={clsx(
                                                                        `text-start fs-13px cursor-pointer ${
                                                                          isMenuActive(d?.title, d, s, e)
                                                                            ? styles.active
                                                                            : ""
                                                                        }`
                                                                      )}
                                                                    >
                                                                      {d?.icon !== "" && (
                                                                        <span className={`${d?.icon} me-2`}></span>
                                                                      )}
                                                                      {d?.title
                                                                        .split(" ")
                                                                        ?.join(" ")
                                                                        ?.toLowerCase()}
                                                                    </Link>
                                                                  </li>
                                                                )
                                                              }
                                                            })}
                                                          </ul>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </div>
                                                    </div>
                                                  </React.Fragment>
                                                )
                                              })}
                                          </div>
                                        </div>
                                        {isEmpty(e.image) !== "" ? (
                                          <div className={`${styles["megamenu-right"]} ${styles["sub-menu-img"]}`}>
                                            <div
                                              className={clsx(
                                                `${styles["position-relative"]} ${styles["ad-img"]} text-end`
                                              )}
                                            >
                                              <Image
                                                src={e.image || "/placeholder.svg"}
                                                className={`img-fluid ${styles["wh-auto"]}`}
                                                alt="Fine Jewelry & Diamond Collections"
                                                width={400}
                                                height={400}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              ) : (
                                <>
                                  {e.product_vertical_name == "DIY" ? (
                                    <>
                                      <React.Fragment>
                                        <div className={clsx(`d-flex align-items-center justify-content-between`)}>
                                          <Link
                                            href={getAlias(e, e.router_link)}
                                            onClick={(event) => {
                                              dispatch(activeIdMenu(e?.unique_id))
                                              routerChange(event, getAlias(e, e?.router_link))
                                              typeof window !== "undefined" && sessionStorage.removeItem("collection_id")
                                              typeof window !== "undefined" && sessionStorage.removeItem("finish_type")
                                              if (className === "") {
                                                setClassName(e.unique_id)
                                              } else {
                                                if (className === e.unique_id) {
                                                  setClassName("")
                                                } else {
                                                  setClassName(e.unique_id)
                                                }
                                              }
                                            }}
                                            className={clsx(
                                              `${styles["nav-link"]} ${
                                                className === e.unique_id && styles.show
                                              } ${
                                                isActiveParentMenu(getAlias(e, e?.router_link), e) ? styles.active : ""
                                              }`
                                            )}
                                            data-bs-toggle="dropdown"
                                          >
                                            {e?.menu_name}{" "}
                                            <span
                                              className={clsx(
                                                `${styles["minus-plus"]} ${
                                                  className === e?.unique_id ? "ic_minus" : "ic_plus"
                                                }`
                                              )}
                                            ></span>
                                          </Link>
                                        </div>
                                      </React.Fragment>
                                    </>
                                  ) : (
                                    <Link
                                      onClick={(event) => {
                                        dispatch(activeIdMenu(e?.unique_id))
                                        routerChange(event, getAlias(e, e.router_link))
                                      }}
                                      className={`${styles["nav-link"]} ${
                                        className === e.unique_id && styles.show
                                      } ${
                                        isActiveParentMenu(getAlias(e, e.router_link), e) ? styles.active : ""
                                      }`}
                                      href={getAlias(e, e.router_link)}
                                    >
                                      {e.menu_name}{" "}
                                    </Link>
                                  )}
                                </>
                              )}
                            </li>
                          </React.Fragment>
                        )
                      })}

                    {showMore && navMenuSecond.length > 0 ? (
                      <li className={clsx(`${styles["nav-item"]} ${styles["dropdown"]} dropdown-hover`)}>
                        <div>
                          <span className={clsx(`${styles["nav-link"]} ${styles["show"]} cursor-pointer`)}>
                            Show More
                          </span>
                          <div
                            className={clsx(
                              `${styles["dropdown-menu"]} ${styles.megamenu} ${styles.moremenu}`
                            )}
                          >
                            {navMenuSecond?.slice(threshold).map((elm, k) => {
                              return (
                                <React.Fragment key={k}>
                                  <Link
                                    onClick={(s) => {
                                      dispatch(activeIdMenu(elm?.unique_id))
                                      routerChange(s, getAlias(elm, elm?.router_link))
                                    }}
                                    className={`${styles["nav-link"]} ${styles["py-2"]} ${
                                      className === elm.unique_id && styles.show
                                    } ${
                                      isActiveParentMenu(getAlias(elm, elm?.router_link), elm) ? styles.active : ""
                                    }`}
                                    href={getAlias(elm, elm?.router_link)}
                                    role="menu"
                                  >
                                    {elm.menu_name}
                                  </Link>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>

                <div className={clsx(`${styles["nav-item"]} ${styles["site-header-personal"]}`)}>
                  <ul className={clsx(`${styles["navbar-nav"]} ${styles["menu-icon"]} d-flex flex-row`)}>
                    <li className={clsx(`${styles["nav-item"]}`)}>
                      {isLogin ? (
                        <Link
                          className={clsx(`${styles.navlink}`)}
                          aria-label="Go to Dashboard"
                          href={"/dashboard"}
                          onClick={() => {
                            setNavbarToggle(false)
                            setClassName("")
                          }}
                        >
                          <i
                            className={clsx(
                              `ic_my_account cursor-pointer fs-20px ${styles["position-relative"]}`
                            )}
                          >
                            <span className={clsx(`${styles["user_name"]} "ic_check"`)}></span>
                          </i>
                        </Link>
                      ) : (
                        <div className={clsx(`${styles["navlink"]} cursor-pointer`)}>
                          <i
                            className={clsx(`ic_my_account cursor-pointer fs-20px`)}
                            aria-label="Go to Dashboard"
                            onClick={() => {
                              setNavbarToggle(false)
                              setClassName("")
                              showLoginPage()
                            }}
                          ></i>
                        </div>
                      )}
                    </li>
                    <li className={styles["nav-item"]}>
                      <Link
                        className={styles["navlink"]}
                        href={`/wishList`}
                        aria-label="Go to Dashboard"
                        onClick={() => {
                          setNavbarToggle(false)
                          setClassName("")
                        }}
                      >
                        <i
                          className={clsx(
                            `ic_heart cursor-pointer fs-20px ${styles["position-relative"]} ${styles["Header-icon"]}`
                          )}
                        >
                          {storeFavCounts > 0 && (
                            <span className={`${styles["badge"]} ${styles["count-icon"]}`}>{storeFavCounts}</span>
                          )}
                        </i>
                      </Link>
                    </li>
                    <li className={styles["nav-item"]}>
                      <div
                        className={styles["navlink"]}
                        onClick={() => {
                          router.push("/cart")
                          setNavbarToggle(false)
                          setClassName("")
                        }}
                      >
                        <i
                          className={clsx(
                            `ic_shopping_bag cursor-pointer fs-20px ${styles["position-relative"]} ${styles["Header-icon"]}`
                          )}
                        >
                          {countCarts > 0 && (
                            <span className={`${styles["badge"]} ${styles["count-icon"]}`}>{countCarts}</span>
                          )}
                        </i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </section>
      {headerLoginModals && <SignIn />}
      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
    </React.Fragment>
  )
}

export default Header
