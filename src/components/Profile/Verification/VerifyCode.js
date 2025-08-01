import React, { useState } from "react";
import commanService from "../../../CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import {
  countCart,
  DefaultBillingAddress,
  loginData,
  loginModal,
  storeFavCount,
  verificationStatusAction,
} from "../../../Redux/action";
import { RandomId } from "../../../CommanFunctions/commanFunctions";
import Notification from "../../../CommanUIComp/Notification/Notification";
import Loader from "../../../CommanUIComp/Loader/Loader";
import { useRouter } from "next/router";

const VerifyCode = (props) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);
  const isLogin = Object.keys(loginData).length > 0;

  // Toast Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleChange = (event) => {
    if (/^\d*$/.test(event.target.value) && event.target.value.length <= 6) {
      setCode(event.target.value);
      setCodeError("");
    }
  };

  const guestToFavoriteMember = (logindata) => {
    const fav = {
      a: "GuestToFavoriteMember",
      store_id: storeEntityId.mini_program_id,
      guest_id: RandomId,
      member_id: logindata.member_id,
    };
    commanService
      .postLaravelApi("/FavouriteController", fav)
      .then((res) => {
        guestToMember(logindata);
      })
      .catch(() => {});
  };

  const guestToMember = (logindata) => {
    const guest = {
      a: "GuestToMember",
      store_id: storeEntityId.mini_program_id,
      guest_id: RandomId,
      member_id: logindata.member_id,
      customer_name: "guest",
    };

    commanService
      .postLaravelApi("/CartMaster", guest)
      .then((res) => {
        if (res.data.success === 1) {
          favouriteCartCount(logindata);
          typeof window !== "undefined" &&
            sessionStorage.setItem("storeUrl", window.location.pathname);
          navigate.push("/-");
        } else {
          favouriteCartCount(logindata);
          typeof window !== "undefined" &&
            sessionStorage.setItem("storeUrl", window.location.pathname);
          navigate.push("/-");
        }
      })
      .catch(() => {});
  };

  const favouriteCartCount = (logindata) => {
    const obj = {
      a: "get_count",
      store_id: storeEntityId.mini_program_id,
      user_id: logindata.member_id,
    };
    commanService
      .postLaravelApi("/CartMaster", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (Object.keys(res.data.data).length > 0) {
            dispatch(storeFavCount(res.data.data?.favourite_count));
            dispatch(countCart(res.data.data?.cart_count));
          }
        } else {
          setIsSuccess(false);
          setToastOpen(true);
          dispatch(storeFavCount(0));
          dispatch(countCart(0));
          setToastMsg(res.data.message);
        }
      })
      .catch(() => {
        dispatch(storeFavCount(0));
        dispatch(countCart(0));
      });
  };

  const addressData = (user) => {
    const Address = {
      a: "GetBilling",
      user_id: user,
      store_id: storeEntityId.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
    };
    commanService
      .postLaravelApi("/BillingDetails", Address)
      .then((res) => {
        if (res.data.success === 1) {
          var billingData = res.data.data;
          if (billingData.length > 0) {
            for (let c = 0; c < billingData.length; c++) {
              if (billingData[c].status === 1) {
                dispatch(DefaultBillingAddress(billingData[c]));
              }
            }
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleVerifyCode = () => {
    setLoading(true);
    const codeVerify = {
      SITDeveloper: "1",
      a: "loginCodewiseAuthntication",
      entity_id: storeEntityId.entity_id,
      tenant_id: storeEntityId.tenant_id,
      member_id: props.memberId ? props.memberId : "",
      code: code,
    };
    commanService
      .postApi("/TwoFactorAuthntication", codeVerify)
      .then((response) => {
        if (response.data.success === 1) {
          const logindata = response.data.data;
          dispatch(loginData(logindata));
          setToastOpen(true);
          setIsSuccess(true);
          setToastMsg(response.data.message);
          guestToFavoriteMember(logindata);
          if (DefaultBillingAddress.length === 0) {
            addressData(logindata.member_id);
          }
          setTimeout(() => {
            dispatch(loginModal(false));
            setLoading(false);
          });
          if (response.data.data.two_step_verification === "1") {
            dispatch(verificationStatusAction(1));
          }
        } else {
          setToastOpen(true);
          setToastMsg(response.data.message);
          setIsSuccess(false);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <div className="bg-white">
        <header className="py-1">
          <h1 className="fw-500 fs-24px">2-Step Verification</h1>
        </header>
        <main className="py-3">
          <p>
            Please enter the 6 digit verification code your mobile application{" "}
            <b>{props.authenticatorName ? props.authenticatorName : " "}</b>{" "}
            generated
          </p>
          <div className="py-1">
            <label htmlFor="code" className="fw-semibold">
              6-digit code
            </label>
            <div>
              <input
                type="text"
                className="w-100 py-2 px-1"
                value={code}
                onChange={handleChange}
              />
            </div>
            {codeError && (
              <p className="text-danger my-0">
                <small>{codeError}</small>
              </p>
            )}
          </div>
        </main>
        <footer>
          <button
            type="button"
            className="btn profilte-btn w-100"
            onClick={handleVerifyCode}
          >
            Verify Code
          </button>
        </footer>
      </div>
      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen(false)}
      />
    </React.Fragment>
  );
};

export default VerifyCode;
