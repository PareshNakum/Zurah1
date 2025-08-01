"use client"

import React, { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "react-loading-skeleton/dist/skeleton.css"
import commanService from "../../../CommanService/commanService"
import { changeUrl, isEmpty, RandomId } from "../../../CommanFunctions/commanFunctions"
import { countCart, storeFavCount } from "../../../Redux/action"

const RelatedProduct = ({
  setToastMsg,
  setToastOpen,
  setIsSuccess,
  apiTriggeredRef,
  setHasMoreRelated,
  relatedProductData,
  paginationLeftRight,
  isEndReached,
  totalPagesRelated,
  count,
  setCount,
  setIsEndReached,
  setSwiperInstance,
  hasMoreRelated,
}) => {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const loginDatas = useSelector((state) => state.loginData)
  const storeEntityIds = useSelector((state) => state.storeEntityId)
  const storeCurrencys = useSelector((state) => state.storeCurrency)
  const storeFavCounts = useSelector((state) => state.storeFavCount)
  const countCarts = useSelector((state) => state.countCart)
  const isLogin = Object.keys(loginDatas).length > 0
  const [favLoader, setFavLoader] = useState({})
  const [favStopClick, setFavStopClick] = useState(false)

  const addDeleteFavouriteItem = (c, event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!favStopClick) {
      setFavStopClick(true)
      setFavLoader({ ...favLoader, [c.item_id]: true })
      const paramsJewel = {
        JEWEL: [{
          vertical_code: c.vertical_code,
          group_code: c.item_group,
          qty: 1,
          price_type: c.price_type,
          item_id: c.item_id,
          variant_id: c.variant_unique_id,
          product_diy: "PRODUCT",
          product_title: c.jewellery_product_type_name,
          product_name: c.product_name,
          mi_unique_id: c.unique_id,
          offer_code: c.coupon_code,
        }],
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
      commanService
        .postLaravelApi("/FavouriteController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            c.add_to_favourite = c.add_to_favourite == "1" ? "0" : "1"
            getFavouriteCount(c)
            setToastOpen(true)
            setIsSuccess(true)
            setToastMsg(res.data.message)
          } else {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(res.data.message)
            setFavLoader({ ...favLoader, [c.item_id]: false })
          }
        })
        .catch(() => setFavLoader({ ...favLoader, [c.item_id]: false }))
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
    commanService.postLaravelApi("/CartMaster", obj).then((res) => {
      if (res.data.success === 1 && Object.keys(res.data.data).length > 0) {
        dispatch(storeFavCount(res.data.data?.favourite_count))
        dispatch(countCart(res.data.data?.cart_count))
        setFavLoader({ ...favLoader, [data.item_id]: false })
        setToastOpen(false)
        setFavStopClick(false)
      } else {
        dispatch(storeFavCount(storeFavCounts))
        dispatch(countCart(countCarts))
        setIsSuccess(false)
        setToastOpen(true)
        setToastMsg(res.data.message)
        setFavLoader({ ...favLoader, [data.item_id]: false })
        setFavStopClick(false)
      }
    }).catch(() => {
      dispatch(storeFavCount(storeFavCounts))
      dispatch(countCart(countCarts))
      setFavLoader({ ...favLoader, [data.item_id]: false })
      setFavStopClick(false)
    })
  }

  const handleReachEnd = useCallback(() => {
    if (hasMoreRelated && !apiTriggeredRef.current) {
      setIsEndReached(true)
      paginationLeftRight("right")
    }
  }, [hasMoreRelated, paginationLeftRight])

  return (
    relatedProductData?.length > 0 && (
      <div id="related-product">
        <div className="container">
          <div className="heading-title mb-4" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-title">Related Products</h2>
          </div>
          <div className="related-product-slider" data-aos="fade-up" data-aos-duration="1000">
            <Swiper
              slidesPerView={1}
              spaceBetween={19}
              navigation
              modules={[Navigation]}
              breakpoints={{
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
                1200: { slidesPerView: 4 },
              }}
              onReachEnd={handleReachEnd}
              onSwiper={setSwiperInstance}
            >
              {relatedProductData?.map((c, i) => {
                const megaMenu = JSON.parse(sessionStorage.getItem("megaMenu"))?.navigation_data?.find(
                  (item) => item.product_vertical_name.toLowerCase() === c.vertical_code.toLowerCase()
                )
                return (
                  <SwiperSlide key={i}>
                    <Link
                      className="h-100 product-box color-black bg-transparent card"
                      href={`/products/${megaMenu?.menu_name?.toLowerCase()}/${changeUrl(isEmpty(c.product_name) + "-" + isEmpty(c.variant_unique_id))}`}
                    >
                      <div className="position-relative shadow-hover">
                        <div className="bg-white">
                          <figure className="figure product-img-separate my-auto d-flex align-items-center justify-content-center">
                            <LazyLoadImage effect="blur" src={c?.image_urls[0]} alt={c.product_name} width="100%" height="290px" />
                            {c?.image_urls[1] && (
                              <LazyLoadImage effect="blur" src={c.image_urls[1]} alt={c.product_name} width="100%" height="290px" />
                            )}
                          </figure>
                        </div>
                        <div className="product-detail d-flex justify-content-between">
                          <div>
                            <div className="detail-height mb-1 product-desc">
                              <p>{c.product_name}</p>
                            </div>
                            {isEmpty(c.final_total_display) !== "" && (
                              <div className="product-price">
                                <h2 className="fs-15px">
                                  {storeCurrencys} {" "}
                                  {isEmpty(c.coupon_code) !== "" ? (
                                    <>
                                      <span>{c.final_total_display} </span>{" "}
                                      <span className="offer-price">{storeCurrencys} {c.origional_price}</span>
                                    </>
                                  ) : (
                                    <span>{c.final_total_display}</span>
                                  )}
                                </h2>
                              </div>
                            )}
                          </div>
                          <div>
                            {favLoader[c.item_id] ? (
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <div className="heart-icon" onClick={(e) => addDeleteFavouriteItem(c, e)}>
                                <i className={c.add_to_favourite === "1" ? "ic_heart_fill fs-20px" : "ic_heart fs-20px"}></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </div>
      </div>
    )
  )
}

export default RelatedProduct