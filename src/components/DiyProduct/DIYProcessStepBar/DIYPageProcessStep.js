"use client"

import React, { useEffect, useState } from "react"
import "./DIYProcessStep.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { ActiveStepsDiy, storeProdData, storeSpecData } from "../../../Redux/action"
import { changeUrl, extractNumber, isEmpty, numberWithCommas, onlyNumbers } from "../../../CommanFunctions/commanFunctions"

const DIYPageProcessStep = ({ 
  position, 
  setTypeViewDiy, 
  activeStep,
  setOnceUpdated, 
  handleUpdateImageforDiy, 
  setEmbossingArea, 
  setActiveStep, 
  setLoading, 
  setSpecificationData, 
  setEngravingData, 
  setSelectedOffer, 
  setEmbossingData 
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const selector = useSelector((state) => state)

  // Calculate Price
  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => {
      const price = Number.parseFloat(extractNumber(item.price))
      const qty = Number.parseFloat(item.qty)
      if (Number.isNaN(price) || Number.isNaN(qty)) {
        return total
      }
      return total + (price * qty)
    }, 0)
  }

  // Onclick function for change selected steps
  const handleStepClick = (e, position, data, isLastItem) => {
    if (activeStep >= 0 && activeStep !== position) {
      e.preventDefault()
      if (!data.product_name && !data.variant_unique_id && data.display_name !== "Complete") {
        return
      } else {
        if (data.display_name === "Complete") {
          if (selector.DiyStepersData.some((item) => item.position === selector.DiyStepersData.length - 2 && isEmpty(item.product_name) !== "")) {
            setActiveStep(position)
            dispatch(ActiveStepsDiy(position))
            setTypeViewDiy(true)
            handleUpdateImageforDiy(selector.DiyStepersData)
          } else {
            return
          }
        } else {
          router.push(`/make-your-customization/start-with-a-item/${changeUrl(`${data.product_name + "-" + data.variant_unique_id}`)}`)
          // setSpecificationData({})
          dispatch(storeSpecData({}))
          dispatch(storeProdData({}))
          setOnceUpdated(false)
          setEmbossingArea([])
          setEngravingData([])
          setEmbossingData([])
          setActiveStep(position)
          dispatch(ActiveStepsDiy(position))
          setTypeViewDiy(false)
          setSelectedOffer([])
        }
      }
    }
  }

  return (
    <div className="multi-step-bar">
      <div className="container">
        <div className="row">
          <div className="col-12 px-0">
            <div className="builder-block">
              <div className="builder-progress">
                {selector.DiyStepersData?.length > 0 && selector.DiyStepersData?.map((elm, i) => {
                  const isLastItem = i === selector.DiyStepersData?.length - 1
                  return (
                    <div 
                      key={i}
                      onClick={(e) => { handleStepClick(e, elm.position, elm, isLastItem) }} 
                      className={`progress-group ${selector.ActiveStepsDiy === elm.position ? "active" : ""}`}
                    >
                      <div className={`item-info ${selector.ActiveStepsDiy === elm.position ? "active" : ""}`}>
                        <div className="build-title">
                          <h3 className="mb-0">{elm.position + 1}</h3>
                          <div className="action link button-clear">
                            <p>{elm.display_name}</p>
                            {elm?.image_urls && elm?.image_urls?.length > 0 ? (
                              <div className="d-flex flex-row align-items-center gap-2">
                                <img 
                                  className="steps-img" 
                                  src={elm?.image_urls[0] || "/placeholder.svg"} 
                                  width={35}
                                  height={35} 
                                  alt={elm.display_name}
                                />
                                <div className="fs-14px fw-500">
                                  {elm?.currency} {elm?.price}
                                </div>
                              </div>
                            ) : ""}
                            {isEmpty(selector.DiyStepersData[0]?.currency) !== "" && 
                             isEmpty(elm.position) !== "" && 
                             isEmpty(elm.position + 1) === selector.DiyStepersData?.length && (
                              <div className="fs-14px fw-500 mb-0">
                                Total {selector.DiyStepersData[0]?.currency} {numberWithCommas(Number(calculateTotalPrice(selector.DiyStepersData)).toFixed(2))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DIYPageProcessStep
