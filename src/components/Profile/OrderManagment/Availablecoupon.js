import React from "react";
import "../Profile.module.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import NoRecordFound from "../../../CommanUIComp/NoRecordFound/noRecordFound";
import { useCallback } from "react";

function Availablecoupon(props) {
  // Comman
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.storeCurrency);
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
  const [veiw, setview] = useState(false);
  const [veiwId, setveiwId] = useState("");
  const [coupancopied, setCoupancopy] = useState(false);

  // One Time API call
  const [onceupdated, setOnceupdate] = useState(false);
  const coupan = props.coupan;

  const handleCoupanVeiw = (data) => {
    setveiwId(data.unique_id);
    if (!veiw) {
      setview(true);
    } else {
      setview(false);
    }
  };
  const UseCoupancode = (data) => {
    coupan.map((item, i) => {
      if (item.unique_id == data.unique_id) {
        item["check"] = true;
        let Cuopancode = data.code;
        navigator.clipboard.writeText(Cuopancode);
        setCoupancopy(true);
        props.setTostOpen(true);
        props.setIsSuccess(true);
        props.setTostmsg("Coupan Code Copy To Clipboard");
        setTimeout(() => {
          props.setTostOpen(false);
        }, 1000);
      } else {
        item["check"] = false;
      }
    });
  };

  const initiallyRenderFunction = useCallback(() => {
    if (Object.keys(storeEntityId).length > 0) {
      if (!onceupdated) {
        let arr = [];
        for (let i = 0; i < Number(15); i++) {
          arr.push(i);
        }
        setStoreSkeletonArr(arr);
        setOnceupdate(true);
      }
    }
  }, [storeEntityId, onceupdated]);

  useEffect(() => {
    initiallyRenderFunction();
  }, [initiallyRenderFunction]);

  return (
    <div>
      <div className="tab-pane">
        <div className="available_coupons">
          <div className="d-flex flex-wrap justify-content-between px-3 mb-3">
            <div>
              <h3 className="profile-title">Available Coupons</h3>
            </div>
          </div>
          <InfiniteScroll
            dataLength={
              coupan === [] && coupan === undefined ? "15" : coupan.length
            }
            next={() => props.fetchMoreData()}
            hasMore={props.hasMore}
            loader={
              <div className="row mx-0">
                {storeSkeletonArr.map((a, i) => {
                  return (
                    <div className="col-12 col-md-6  mb-3" key={i}>
                      <div className="card coupon-border rounded-0">
                        <div>
                          <p>
                            <Skeleton height={"25px"} />
                          </p>
                        </div>
                        <div className="coupon_head">
                          <div className="coupon_head_inner">
                            <div className="coupon_left_text">
                              <h4>
                                <Skeleton width={"100px"} height={"100%"} />
                              </h4>
                              <p>
                                <Skeleton width={"100px"} height={"100%"} />
                              </p>
                            </div>
                            <div className="text-end coupon_right_text">
                              <h1 className="coupon-off">
                                <Skeleton width={"200px"} height={"100%"} />
                              </h1>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between view-date mb-2">
                            {" "}
                            <Skeleton width={"100px"} height={"100%"} />{" "}
                          </div>
                          <div className="coupon-line"></div>
                          <div className="cop_foot">
                            <div className="cop_foot_code">
                              {" "}
                              <Skeleton height={"100%"} />{" "}
                            </div>
                            <div className="cop_foot_copy">
                              <Skeleton width={"100px"} height={"45px"} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            endMessage={
              !props.loading &&
              !props.skeletonLoader &&
              coupan?.length === 0 && <NoRecordFound />
            }
          >
            <div className="row mx-0">
              {coupan.length > 0 &&
                coupan.map((coupanItem, i) => {
                  var date =
                    coupanItem.coupon_status == "Upcoming"
                      ? coupanItem.start_date
                      : coupanItem.expiry_date;
                  var objectDate = new Date(date);
                  var ddate = objectDate.getDate();
                  var month = objectDate.getMonth() + 1;
                  var year = objectDate.getFullYear();
                  return (
                    <div className="col-12 col-md-6  mb-3" key={i}>
                      <div className="card coupon-border rounded-0">
                        <div
                          className={`${
                            coupanItem.coupon_status === "Expired"
                              ? "bg-danger"
                              : coupanItem.coupon_status === "Upcoming"
                              ? "bg-info text-dark"
                              : "bg-success"
                          }`}
                        >
                          <p
                            className={`${
                              coupanItem.coupon_status === "Upcoming"
                                ? "text-dark fw-bold"
                                : "text-white"
                            } p-2 ps-4`}
                          >
                            {coupanItem.coupon_status}
                          </p>
                        </div>
                        <div className="coupon_head">
                          <div className="coupon_head_inner">
                            <div className="coupon_left_text">
                              <h4 className="fw-600">{coupanItem.name}</h4>
                              <p>{coupanItem.remark}</p>
                            </div>
                            <div className="text-end coupon_right_text">
                              <h1 className="coupon-off">
                                {coupanItem.discount}{" "}
                                {coupanItem.discount_type == "PERCENTAGE"
                                  ? "%"
                                  : storeCurrency}
                              </h1>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between view-date">
                            {coupanItem.terms_and_condition !== "" ? (
                              <span
                                className="text-blue cursor-pointer"
                                onClick={() => handleCoupanVeiw(coupanItem)}
                              >
                                View T&C
                              </span>
                            ) : (
                              ""
                            )}
                            {coupanItem.coupon_status === "Expired" ? (
                              ""
                            ) : (
                              <span className="text-red">
                                {coupanItem.coupon_status == "Upcoming"
                                  ? "Start on"
                                  : "Valid till"}{" "}
                                &nbsp;{ddate}-{month}-{year}
                              </span>
                            )}
                          </div>
                          {coupanItem.unique_id === veiwId ? (
                            !veiw ? (
                              ""
                            ) : (
                              <div className="terms_conditions" key={veiwId}>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: coupanItem.terms_and_condition,
                                  }}
                                ></p>
                              </div>
                            )
                          ) : (
                            ""
                          )}
                          <div className="coupon-line"></div>
                          <div className="cop_foot">
                            <div className="cop_foot_code">
                              {coupanItem.coupon_status !== "Active" ? (
                                <div className=" text-dark opacity-50">
                                  {coupanItem.code}
                                </div>
                              ) : (
                                <div
                                  className={`${
                                    coupancopied && coupanItem["check"] == true
                                      ? "text-success"
                                      : "text-dark"
                                  }`}
                                >
                                  {coupanItem.code}
                                </div>
                              )}
                            </div>
                            <div className="cop_foot_copy">
                              {coupanItem.coupon_status !== "Active" ? (
                                <button className="btn profilte-btn disabled">
                                  Copy
                                </button>
                              ) : (
                                <button
                                  className="btn profilte-btn"
                                  onClick={() => UseCoupancode(coupanItem)}
                                >
                                  {" "}
                                  {coupancopied && coupanItem["check"] == true
                                    ? "Copied"
                                    : "Copy"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

export default Availablecoupon;
