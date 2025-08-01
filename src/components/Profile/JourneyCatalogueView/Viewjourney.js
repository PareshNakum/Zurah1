import React, { useEffect, useState } from "react";
import "./Viewjourney.module.scss";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import commanService from "../../../CommanService/commanService";
import { isEmpty } from "../../../CommanFunctions/commanFunctions";
import Loader from "../../../CommanUIComp/Loader/Loader";
import Notification from "../../../CommanUIComp/Notification/Notification";

const Viewjourney = () => {
  const [loading, setLoading] = useState(true);

  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [onceUpdated, setOnceUpdated] = useState(false);
  const [catalogDataList, setCatalogDataList] = useState([]);
  const [dd, setDate] = useState("");
  const [Active, setActive] = useState(false);

  // const params = useParams();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);
  const navigate = useNavigate();

  let url = new URL(window.location.href);
  let params = new URLSearchParams(url.search);
  const uniqueId = params.getAll("unique_id")[0];
  const type = params.getAll("type")[0];

  useEffect(() => {
    if (isEmpty(uniqueId) !== "" && type != "S") {
      if (!onceUpdated) {
        setOnceUpdated(true);
        journeyReviewData();
      }
    } else {
      journeyData();
    }
  }, [uniqueId, onceUpdated]);

  const journeyReviewData = () => {
    const catalog = {
      a: "GetJourneyReview",
      store_type: "B2C",
      counsumer_id: isEmpty(loginData.member_id),
      store_id: isEmpty(storeEntityId.mini_program_id),
      unique_id: isEmpty(uniqueId),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/WarrantyCard", catalog)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res["data"]["data"];
          const formattedDate = new Date(data[0].create_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );
          setDate(formattedDate);
          data[0]["data_url"] =
            window.location.origin +
            "/Assets/Js/landing.php?og_title=" +
            encodeURIComponent(data[0]["title"]) +
            "&og_image=" +
            encodeURIComponent(data[0]["image"]) +
            "&og_description=" +
            encodeURIComponent(data[0]["review"]) +
            "&ext_url=" +
            encodeURIComponent("dashboard/viewjourney/" + isEmpty(uniqueId));
          setCatalogDataList(data);
          setLoading(false);
        } else {
          setToastOpen(true);
          setIsSuccess(false);
          setToastMsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setToastOpen(true);
        setIsSuccess(false);
        setToastMsg(error.message);
        setLoading(false);
      });
  };

  const journeyData = () => {
    var obj = {
      a: "GetJourney",
      store_id: storeEntityId.mini_program_id,
      tenant_id: storeEntityId.tenant_id,
      entity_id: storeEntityId.entity_id,
      store_type: "B2C",
      unique_id: isEmpty(uniqueId),
    };
    commanService.postLaravelApi("/WarrantyCard", obj).then((res) => {
      if (res["data"]["success"] === 1) {
        var data = res.data.data;
        data[0]["data_url"] =
          window.location.origin +
          "/Assets/Js/landing.php?og_title=" +
          encodeURIComponent(data[0]["title"]) +
          "&og_image=" +
          encodeURIComponent(data[0]["image"]) +
          "&og_description=" +
          encodeURIComponent(data[0]["review"]) +
          "&ext_url=" +
          encodeURIComponent("dashboard/viewjourney/" + isEmpty(uniqueId));
        setCatalogDataList(data);
        setLoading(false);
      }
    });
  };

  return (
    <div id="viewJourney">
      {loading && <Loader />}
      {catalogDataList.length > 0 ? (
        <div className={`container my-2'}`}>
          <div className="cunsumer_detail">
            <div className="apply_detail">
              <p className="d-flex flex-wrap">
                {type != "S" && (
                  <>
                    <span>
                      {catalogDataList[0]?.order_id}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                    <span>
                      Created At {isEmpty(dd)}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                  </>
                )}
                <span className="share" onClick={() => setActive(!Active)}>
                  <a className="share_icon">
                    <i className="ic_share fw-bold" />
                  </a>
                </span>
                <div className={`${Active ? "active" : "icons"}`}>
                  <a
                    href={`https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}&source=${encodeURIComponent(
                      "tweetbutton"
                    )}&text=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.title) +
                        " #proposal #engagement"
                    )}&url=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ic_twitter fw-bold" />
                  </a>
                  <a
                    href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(
                      catalogDataList[0]?.data_url
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ic_facebook fw-bold" />
                  </a>
                  {/* <a href={`https://www.instagram.com/sharer.php?u=${(encodeURIComponent(isEmpty(catalogDataList[0]?.publish_url)))}`} target="_blank"><i className="ic_instagram fw-bold" /></a> */}
                </div>
              </p>
            </div>
            {type != "S" && (
              <div className="share_back">
                {/* <button type="button" className='back_btn' onClick={() => navigate(`/profile/journey-catalog/${true}`)}><i className='ic_left' />Back To Journey</button> */}
                <button
                  type="button"
                  className="back_btn"
                  onClick={() => navigate(`/dashboard/journey-catalogue/`)}
                >
                  <i className="ic_left" />
                  Back To Journey
                </button>
              </div>
            )}
          </div>
          <iframe
            src={catalogDataList[0]?.publish_url}
            width={"100%"}
            height={"100vh"}
            title="External Content"
          />
        </div>
      ) : (
        ""
      )}
      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
    </div>
  );
};

export default Viewjourney;
