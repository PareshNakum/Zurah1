"use client"

import React, { useEffect, useState } from "react"
import "./breadcrumb.module.scss"
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import {
  activeDIYtabs,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  diamondNumber,
  diamondPageChnages,
  DiyStepersData,
  editDiamondAction,
  finalCanBeSetData,
  isRingSelected,
  IsSelectedDiamond,
  jewelSelectedCategory,
  selectDiamondAction,
  selectedDiamondObject,
  selectedJewelRing,
  selectedRingData,
  storeActiveFilteredData,
  storeDiamondNumber,
  storeFilteredData,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "../../Redux/action";
import { firstWordCapital } from "../../CommanFunctions/commanFunctions";
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const BreadcrumbModule = (props) => {
  const [pathName, setPathName] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
console.log(pathname)
  const diamondSelectShape = useSelector((state) => state.diamondSelectShape)
  const jewelSelectedCategoryState = useSelector((state) => state.jewelSelectedCategory)
  const DIYName = useSelector((state) => state.DIYName)

  const isJewelDiy = pathname?.includes("start-with-a-setting")
  const isDiamoDiy = pathname?.includes("start-with-a-diamond")
  const isItemDiy = pathname?.includes("start-with-a-item")
  const onlyJewellery = pathname?.includes("products")
  const onlyBlog = pathname?.includes("blog")

  const DiamoArray = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("Diamocode") || "null") : null
  let vertical = ""
  let chkCapitilize = false

  const isCapitalized = (str) => {
    return str === str.toUpperCase()
  }

  useEffect(() => {
    setTimeout(() => {
      const name = []
      const path = pathname
      var data = path.split("/")
      vertical = data[2]

      if (vertical !== undefined) {
        chkCapitilize = isCapitalized(vertical)
      }

      var value = ""
      var values = ""

      if (data.length > 0) {
        if (isJewelDiy != true && isDiamoDiy != true && isItemDiy != true) {
          if ((data[1] == "products" || data[1] == "campaign") && data.length !== 4) {
            data[3] = ""
            if (data[1] == "campaign" && data.length > 5) {
              data[4] = ""
            }
          }

          if (data.length > 3) {
            if (data[1] == "Viewjourney") {
              data[3] = ""
            }

            const lastElement = data[data.length - 1]
            if (lastElement.includes("pv")) {
              var splitValue = lastElement.split("-")
              var productName = splitValue.slice(0, splitValue.length - 1).join(" ")
              if (productName !== "") {
                data[data.length - 1] = productName
              }
            }

            for (let c = 0; c < data.length; c++) {
              if (data[c] !== "") {
                value = value + "/" + data[c]
                values = data[c]
                if (c !== 2) {
                  if (path.includes("/shape/") && c === 3 && Object.keys(diamondSelectShape).length > 0) {
                    name.push({
                      pathname: diamondSelectShape.shapeName,
                      value: value.replace(data[data.length - 1], diamondSelectShape.shapeName),
                    })
                  } else {
                    if (chkCapitilize == true) {
                      name.push({
                        pathname: data[c].split("-").join(" "),
                        value: value + "/" + vertical,
                      })
                    } else {
                      name.push({
                        pathname: data[c].split("-").join(" "),
                        value: value,
                      })
                    }
                  }
                }
              }
            }
          } else {
            if (onlyJewellery) {
              if (data.length > 2) {
                const lastElement = data[data.length - 1]
                var splitValue = lastElement.split("-")
                var productName = splitValue.slice(0, splitValue.length - 1).join(" ")
                if (productName !== "") {
                  data[data.length - 1] = productName
                }
              }
              for (let c = 0; c < data.length; c++) {
                if (data[c] !== "") {
                  value = value + "/" + data[c]
                  name.push({
                    pathname: data[c].split("-").join(" "),
                    value: value,
                  })
                }
              }
            } else if (onlyBlog) {
              if (data.length > 2) {
                const lastElement = data[data.length - 1]
                var splitValue = lastElement.split("-")
                var productName = splitValue.slice(0, splitValue.length - 2).join(" ")
                if (productName !== "") {
                  data[data.length - 1] = productName
                }
              }
              for (let c = 0; c < data.length; c++) {
                if (data[c] !== "") {
                  value = value + "/" + data[c]
                  name.push({
                    pathname:
                      data[c].split("-").join(" ").length >= 2
                        ? data[c].split("-").slice(0, 2).join(" ")
                        : data[c].split("-").join(" "),
                    value: value,
                  })
                }
              }
            } else {
              for (let c = 0; c < data.length; c++) {
                if (data[c] !== "") {
                  value = value + "/" + data[c]
                  name.push({
                    pathname: data[c].split("-").join(" ").replace("_", " "),
                    value: value,
                  })
                }
              }
            }
          }
        } else {
          if (data[1] == "products") {
            data[2] = ""
          }
          if (data.length > 2) {
            const lastElement = data[data.length - 1]
            var splitValue = lastElement.split("-")
            var productName = splitValue.slice(0, splitValue.length - 1).join(" ")
            if (productName !== "") {
              data[data.length - 1] = productName
            }
          }
          for (let c = 0; c < data.length; c++) {
            if (data[c] !== "") {
              name.push({
                pathname: data[c].split("-").join(" "),
                value: "/" + data[c],
              })
            }
          }
        }
      }

      if (JSON.stringify(name).includes("cancel-order")) {
        name.splice(0, 1)
      }
      if (JSON.stringify(name).includes("success-order")) {
        name.splice(0, 1)
      }

      setPathName([...name])

      if (pathname?.includes("products")) {
        let text = ""
        const linkArr = []
        const urlArr = pathname?.split("/")
        const filterArr = urlArr.filter((item) => item !== "")
        const lastElementName = filterArr[filterArr.length - 1]

        if (lastElementName.includes("pv")) {
          const splitVal = lastElementName.split("-")
          const productName = splitVal.slice(0, splitVal.length - 1).join(" ")
          if (productName !== "") {
            filterArr[filterArr.length - 1] = productName
          }
        }

        for (let i = 0; i < filterArr.length; i++) {
          if (filterArr[2] == "campaign") {
            filterArr[3] = ""
          }
          text += "/" + filterArr[i]
          if (filterArr.length >= 4 && filterArr[i] != "" && !path.includes("offer")) {
            if (i !== 2) {
              if (filterArr[i] === "products") {
                linkArr.push({
                  pathname: filterArr[i].split("-").join(" "),
                  value: text + "/" + vertical,
                })
              } else if (text.includes(filterArr[i]) && i === 3) {
                linkArr.push({
                  pathname: jewelSelectedCategoryState.jewellery_product_type_name
                    ? filterArr[i].replace(filterArr[i], jewelSelectedCategoryState.jewellery_product_type_name)
                    : filterArr[i].split("-").join(" "),
                  value: jewelSelectedCategoryState.jewellery_product_type_name
                    ? text.replace(filterArr[i], jewelSelectedCategoryState.jewellery_product_type_name)
                    : text,
                })
              } else if (i === 4 && text.includes(filterArr[i])) {
                linkArr.push({
                  pathname: filterArr[i].split("-").join(" "),
                  value: text.replace(filterArr[i - 1], jewelSelectedCategoryState.jewellery_product_type_name),
                })
              } else {
                linkArr.push({
                  pathname: filterArr[i].split("-").join(" "),
                  value: text.replace(filterArr[i - 1], jewelSelectedCategoryState.jewellery_product_type_name),
                })
              }
            }
          } else if (filterArr[i] != "") {
            if (path.includes("offer")) {
              if (i !== 2) {
                if (filterArr[i] === "products") {
                  linkArr.push({
                    pathname: filterArr[i].split("-").join(" "),
                    value: text + "/" + vertical,
                  })
                } else {
                  linkArr.push({
                    pathname: filterArr[i].split("-").join(" "),
                    value: text,
                  })
                }
              }
            } else {
              if (filterArr[i] === "products") {
                linkArr.push({
                  pathname: filterArr[i].split("-").join(" "),
                  value: text + "/" + vertical,
                })
              } else {
                linkArr.push({
                  pathname: filterArr[i].split("-").join(" "),
                  value: text,
                })
              }
            }
          }
        }
        const newLinks = linkArr.filter((item) => item.pathname !== vertical)
        setPathName(newLinks)
      }

      if (pathname?.split("/").includes("order-details") && pathname?.split("/").length === 3) {
        let text = ""
        const orderDetailsUrlArr = pathname?.split("/")
        const linkOrderDetails = []
        for (let i = 0; i < orderDetailsUrlArr.length; i++) {
          const element = orderDetailsUrlArr[i]
          if (element !== "") {
            text += "/" + orderDetailsUrlArr[i]
            if (element === "order-details") {
              linkOrderDetails.push({
                pathname: element.split("-").join(" "),
                value: text,
              })
            } else {
              linkOrderDetails.push({ pathname: "My Order", value: text })
            }
          }
        }
        setPathName(linkOrderDetails)
      }

      if (pathname?.includes("/viewjourney/") || pathname?.includes("/blog/")) {
        let types = ""
        const linkArr = []
        const urlArr = path.split("/")
        const filterArr = urlArr.filter((item) => item !== "")
        if (filterArr.includes("S")) {
          filterArr.pop([filterArr.length - 1])
        }
        for (let i = 0; i < filterArr.length; i++) {
          types += "/" + filterArr[i]
          if (i !== 1) {
            linkArr.push({
              pathname: filterArr[i].split("-").join(" "),
              value: types,
            })
            setPathName(linkArr)
          }
        }
      }
    }, 10)
  }, [isJewelDiy, isDiamoDiy, pathName, diamondSelectShape, isItemDiy, pathname])

  const handleBreadcrumbClick = (c) => {
    dispatch(diamondPageChnages(false))

    if (c.value.includes("/start-with-a-diamond")) {
      dispatch(editDiamondAction(""))
      dispatch(storeFilteredData({}))
      dispatch(storeActiveFilteredData({}))
      dispatch(diamondNumber(""))
      dispatch(storeDiamondNumber(""))
      dispatch(addedRingData({}))
      dispatch(activeDIYtabs("Diamond"))
      dispatch(IsSelectedDiamond(false))
      dispatch(addedDiamondData({}))
      dispatch(finalCanBeSetData([]))
      dispatch(storeSelectedDiamondPrice(""))
      dispatch(storeSelectedDiamondData({}))
      dispatch(storeProdData({}))
      dispatch(storeSpecData({}))
      dispatch(isRingSelected(false))
      router.push("/make-your-customization/start-with-a-diamond")
    } else if (c.value.includes("/start-with-a-setting")) {
      dispatch(storeSelectedDiamondData([]))
      dispatch(addedDiamondData({}))
      dispatch(storeSelectedDiamondPrice(""))
      dispatch(finalCanBeSetData([]))
      dispatch(storeSpecData({}))
      dispatch(activeDIYtabs("Jewellery"))
      router.push("/make-your-customization/start-with-a-setting")
    } else if (c.value.includes("/start-with-a-item")) {
      dispatch(storeSelectedDiamondData([]))
      dispatch(addedDiamondData({}))
      dispatch(storeSelectedDiamondPrice(""))
      dispatch(finalCanBeSetData([]))
      dispatch(storeSpecData({}))
      dispatch(activeDIYtabs("Jewellery"))
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("DIYVertical")
      }
      dispatch(DiyStepersData([]))
      dispatch(ActiveStepsDiy(0))
      router.push("/make-your-customization")
    } else if (pathname?.includes("/products/")) {
      if (pathName?.length >= 2) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("filterJson")
        }
      } else if (pathName?.length >= 3) {
        const filteredData = JSON.parse((typeof window !== "undefined" && sessionStorage.getItem("filterJson")) || "[]")
        const filteredArr = filteredData.map((item) => {
          if (item.key === "mi_jewellery_product_type") {
            var data = []
            data.push(`${jewelSelectedCategoryState.jewellery_product_type}`)
            item.value = data
            return item
          }
          return item
        })
        if (typeof window !== "undefined") {
          sessionStorage.setItem("filterJson", JSON.stringify(filteredArr))
        }
        dispatch(jewelSelectedCategory({}))
        router.push(!isDiamoDiy && `${c.value.split(" ").join("-")}`)
      }
      router.push(!isDiamoDiy && `${c.value.split(" ").join("-")}`)
    } else if (c.pathname?.includes("make-your-customization")) {
      dispatch(storeSelectedDiamondData([]))
      dispatch(addedDiamondData({}))
      dispatch(storeSelectedDiamondPrice(""))
      dispatch(finalCanBeSetData([]))
      dispatch(storeSpecData({}))
      dispatch(activeDIYtabs("Jewellery"))
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("DIYVertical")
        sessionStorage.removeItem("filterJson")
      }
      dispatch(DiyStepersData([]))
      dispatch(ActiveStepsDiy(0))
      router.push("/make-your-customization")
    } else if (c.value.includes("dashboard")) {
      router.push("/dashboard")
    }
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {pathname !== "/" && (
              <Breadcrumbs
                maxItems={10}
                aria-label="breadcrumb"
                className={`${
                  isJewelDiy != true && isDiamoDiy != true && isItemDiy != true
                    ? "Breadcrumb_inner py-2"
                    : "Breadcrumb_inner_diy py-2"
                }`}
              >
                <Link href="/" className="text-decoration-none">
                  Home
                </Link>
                {pathName?.length > 0 &&
                  pathName?.map((c, index) => {
                    return pathName?.length - 1 !== index ? (
                      <div
                        key={index}
                        className="cursor-pointer text-capitalize fs-13px text-decoration-none"
                        onClick={() => handleBreadcrumbClick(c)}
                      >
                        {c.pathname?.includes("diy")
                          ? "DIY Product"
                          : c.pathname?.includes("start with a")
                            ? firstWordCapital(DIYName)
                            : firstWordCapital(c.pathname?.toLowerCase())}
                      </div>
                    ) : (
                      <Typography color="text.primary" key={index}>
                        {c.pathname?.includes("diy")
                          ? "DIY Product"
                          : c.pathname?.includes("start with a")
                            ? firstWordCapital(DIYName)
                            : DiamoArray !== null && DiamoArray.length > 0
                              ? firstWordCapital(c.pathname?.toLowerCase())
                              : "All"}
                      </Typography>
                    )
                  })}
              </Breadcrumbs>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default BreadcrumbModule
