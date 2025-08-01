import React, { useState } from "react";
import "./signIn.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import commanservice from "../../CommanService/commanService";
import {
  loginModals,
  storeFavCount,
  countCart,
  loginData,
  DefaultBillingAddress,
  headerLoginModals,
  loginModal,
} from "../../Redux/action";
import Notification from "../../CommanUIComp/Notification/Notification";
import Loader from "../../CommanUIComp/Loader/Loader";
import {
  isEmpty,
  onlyNumbers,
  RandomId,
  validateWithOnlyLetters,
} from "../../CommanFunctions/commanFunctions";
import Select from "react-select";
import VerifyCode from "../Profile/Verification/VerifyCode";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
 
  const storeEntityIds = useSelector((state)=>state.storeEntityId)
  const loginModals = useSelector((state)=>state.loginModal)
  const HeaderLogoDatas = useSelector((state)=>state.HeaderLogoData)

  const dispatch = useDispatch();

  // Toast Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal Changes
  const [loginShow, setLoginShow] = useState(false);
  const [forgetShow, setForgetShow] = useState(false);

  // From Value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [country, setCountry] = useState("");
  const [countryShortCode, setCountryShortcode] = useState("");
  const [countryId, setCountryId] = useState("");
  const [phoneCode, setPhonecode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");

  //Show Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryDataDrp, setCountryDataDrp] = useState([]);
  const [phoneCodeDataDrp, setPhoneCodeDataDrp] = useState([]);

  // Verification
  const [isVerifyCodeModal, setIsVerifyCodeModal] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [authenticatorName, setAuthenticatorName] = useState("");

  // URL
  const location = useRouter();
  const ResetPasswordURL = location.pathname.includes("reset-password");
  var KEY = location.pathname;
  var number = KEY.replace(/[^0-9]/g, "");
  let reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const mail_key = number;

  const login = () => {
    var obj = {
      a: "login",
      email: email,
      password: password,
      store_id: storeEntityIds.mini_program_id,
    };
    if (
      isEmpty(email) !== "" &&
      isEmpty(password) !== "" &&
      reg.test(email) !== false &&
      password.length >= 8
    ) {
      setLoading(true);
      commanservice
        .postLaravelApi("/AuthController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            if (res.data.data.two_step_verification === 1) {
              setIsVerifyCodeModal(true);
              setLoading(false);
              setMemberId(res.data.data.member_id);
              setAuthenticatorName(res.data.data.authnticator_name);
            } else {
              const logindata = res.data.data;
              dispatch(loginData(logindata));
              setToastOpen(true);
              setIsSuccess(true);
              setToastMsg(res.data.message);
              guestToFavoriteMember(logindata);
              if (DefaultBillingAddress.length === 0) {
                addressData(logindata.member_id);
              }
              setTimeout(() => {
                dispatch(loginModal(false));
                setLoading(false);
              });
            }
          } else {
            setToastOpen(true);
            setToastMsg(res.data.message);
            setIsSuccess(false);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      if (email === "") {
        setToastMsg("The Email field is required.");
      } else if (reg.test(email) === false) {
        setToastMsg("Please enter valid Email");
      } else if (password === "") {
        setToastMsg("The Password field is required.");
      } else if (password.length < 8) {
        setToastMsg("The Password must be at least 8 characters.");
      }
    }
  };

  const register = () => {
    var obj = {
      a: "signup",
      store_id: mini_program_id,
      email: email,
      password: password,
      first_name: fname,
      last_name: lname,
      mobile_no: mobile,
      store_id: storeEntityIds.mini_program_id,
      country: country.value,
      country_id: countryId,
      country_code: phoneCode.value,
      country_short_code: countryShortCode,
      state: state,
      city: city,
      gender: gender,
    };
    if (
      isEmpty(email) !== "" &&
      isEmpty(password) !== "" &&
      isEmpty(fname) !== "" &&
      isEmpty(countryShortCode) !== "" &&
      isEmpty(lname) !== "" &&
      reg.test(email) !== false &&
      password.length >= 8 &&
      isEmpty(phoneCode.value) !== "" &&
      mobile.length >= 8 &&
      mobile.length <= 15
    ) {
      setLoading(true);
      commanservice
        .postLaravelApi("/AuthController", obj)
        .then((res) => {
          if (res.data.success === 1) {
            const Registerdata = res.data.data;
            dispatch(loginData(Registerdata));
            setToastOpen(true);
            setToastMsg(res.data.message);
            setIsSuccess(true);
            setLoading(false);
            guestToFavoriteMember(Registerdata);
            if (DefaultBillingAddress.length === 0) {
              addressData(Registerdata.member_id);
            }
            setTimeout(() => {
              dispatch(loginModal(false));
              setLoading(false);
            });
          } else {
            setToastOpen(true);
            setToastMsg(res.data.message);
            setIsSuccess(false);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      if (isEmpty(fname) === "") {
        setToastMsg("The First Name field is required.");
      } else if (isEmpty(lname) === "") {
        setToastMsg("The Last Name field is required.");
      } else if (isEmpty(email) === "") {
        setToastMsg("The Email field is required.");
      } else if (reg.test(email) === false) {
        setToastMsg("Please Enter valid Email.");
      } else if (isEmpty(password) === "") {
        setToastMsg("The Password field is required.");
      } else if (password.length < 8) {
        setToastMsg("The Password must be at least 8 characters.");
      } else if (isEmpty(countryShortCode) === "") {
        setToastMsg("The Country field is required.");
      } else if (isEmpty(phoneCode.value) === "") {
        setToastMsg("The Phone Code field is required.");
      } else if (mobile.length < 8) {
        setToastMsg("Minimum 8 digit is required in Mobile Number.");
      } else if (mobile.length > 15) {
        setToastMsg("Maximum 15 digit is required in Mobile Number.");
      }
    }
  };

  const forgetPassword = () => {
    const obj = {
      a: "ForgetPassword",
      store_id: storeEntityIds.mini_program_id,
      email: email,
      mail_url: window.location.origin,
      store_type: "B2C",
    };
    if (email !== "" && reg.test(email) !== false) {
      commanservice.postLaravelApi("/AuthController", obj).then((res) => {
        if (res.data.success === 1) {
          setToastOpen(true);
          setIsSuccess(true);
          setToastMsg(res.data.message);
          setTimeout(() => {
            dispatch(loginModal(false));
          }, 1000);
        } else {
          setToastOpen(true);
          setToastMsg(res.data.message);
          setIsSuccess(false);
        }
      });
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      if (email === "") {
        setToastMsg("The Email field is required.");
      } else if (reg.test(email) === false) {
        setToastMsg("Please enter valid Email");
      }
    }
  };

  const resetPassword = () => {
    if (newPassword === confirmPassword) {
      const obj = {
        a: "resetPassword",
        new_password: newPassword,
        confirm_password: confirmPassword,
        mail_key: mail_key,
      };
      commanservice.postLaravelApi("/AuthController", obj).then((res) => {
        if (res.data.success === 1) {
          location.push("/");
          setLoginShow(false);
          setForgetShow(false);
          setToastOpen(true);
          setIsSuccess(true);
          setToastMsg(res.data.message);
          setTimeout(() => {
            dispatch(loginModal(false));
          }, 1000);
        } else {
          setToastOpen(true);
          setToastMsg(res.data.message);
          setIsSuccess(false);
        }
      });
    } else {
      setToastMsg("confirm password are wrong.");
      setToastOpen(true);
      setIsSuccess(false);
    }
  };

  const guestToFavoriteMember = (logindata) => {
    const fav = {
      a: "GuestToFavoriteMember",
      store_id: storeEntityIds.mini_program_id,
      guest_id: RandomId,
      member_id: logindata.member_id,
    };
    commanservice
      .postLaravelApi("/FavouriteController", fav)
      .then((res) => {
        guestToMember(logindata);
      })
      .catch(() => {});
  };

  const guestToMember = (logindata) => {
    const guest = {
      a: "GuestToMember",
      store_id: storeEntityIds.mini_program_id,
      guest_id: RandomId,
      member_id: logindata.member_id,
      customer_name: "guest",
    };

    commanservice
      .postLaravelApi("/CartMaster", guest)
      .then((res) => {
        if (res.data.success === 1) {
          favouriteCartCount(logindata);
          typeof window !== "undefined" &&
            sessionStorage.setItem("storeUrl", window.location.pathname);
          location.push("/-");
        } else {
          favouriteCartCount(logindata);
          typeof window !== "undefined" &&
            sessionStorage.setItem("storeUrl", window.location.pathname);
          location.push("/-");
        }
      })
      .catch(() => {});
  };

  const favouriteCartCount = (logindata) => {
    const obj = {
      a: "get_count",
      store_id: storeEntityIds.mini_program_id,
      user_id: logindata.member_id,
    };
    commanservice
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

  const changeGender = (value) => {
    if (value != "Select Gender") {
      setGender(value);
    } else {
      setGender("");
    }
  };

  const countryDrp = () => {
    const GetCountry = {
      a: "getCountry",
      SITDeveloper: "1",
    };
    commanservice.postApi("/TechnicalManagement", GetCountry).then((res) => {
      if (res.data.success == 1) {
        typeof window !== "undefined" &&
          sessionStorage.setItem("country_data", JSON.stringify(res.data.data));
        countrySetDrp();
      }
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
    setCountryDataDrp(data);
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

  const changeCountry = (value) => {
    if (value !== "Select Your Country" && value !== "") {
      for (let c = 0; c < countryDataDrp.length; c++) {
        if (countryDataDrp[c].name === value) {
          setCountryShortcode(countryDataDrp[c].sortname);
          setCountryId(countryDataDrp[c].id);
          setCountry(countryDataDrp[c]);
        }
      }
    } else {
      setCountryShortcode("");
      setCountryId("");
      setCountry("");
    }
  };

  const addressData = (user) => {
    const Address = {
      a: "GetBilling",
      user_id: user,
      store_id: storeEntityIds.mini_program_id,
      status: "1",
      per_page: "0",
      number: "0",
    };
    commanservice
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
      .catch(() => {});
  };

  return (
    <React.Fragment>
      {loading && <Loader />}
      <section id="SignIn">
        <Modal
          show={loginModals}
          onHide={() => {
            dispatch(loginModal(false));
          }}
          keyboard={false}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="sign-in"
          tabIndex="-1"
          aria-hidden="true"
          backdrop="static"
        >
          <Modal.Header>
            <div
              className="close-btn cursor-pointer"
              onClick={() => {
                dispatch(loginModal(false));
                setForgetShow(false);
                setLoginShow(false);
                ResetPasswordURL && location.push("/");
                setIsVerifyCodeModal(false);
              }}
            >
              <i className="ic_remove fw-600"></i>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="text-center mb-30px logo">
                    {HeaderLogoDatas?.length > 0
                      ? HeaderLogoDatas.map((h, index) => (
                          <Link href={"/"} key={index}>
                            {isEmpty(h.image) !== "" ? (
                              <Image
                                src={isEmpty(h.image)}
                                width={200}
                                height={100}
                                alt=""
                                className="img-fluid logowhite"
                              />
                            ) : (
                              <Image
                                src="https://dummyimage.com/150x100/ebebeb/000000.jpg"
                                alt=""
                                className="img-fluid"
                              />
                            )}
                          </Link>
                        ))
                      : ""
                        // <Link href={"/"} >
                        //     <Image src="https://dummyimage.com/150x100/ebebeb/000000.jpg" alt="" className="img-fluid " />
                        // </Link>
                    }
                  </div>
                  {!ResetPasswordURL ? (
                    <div>
                      {!loginShow ? (
                        <div>
                          {!forgetShow ? (
                            isVerifyCodeModal ? (
                              <div className="Login_Group">
                                <VerifyCode
                                  memberId={memberId}
                                  authenticatorName={authenticatorName}
                                />
                              </div>
                            ) : (
                              <div className="Login_Group">
                                <div className="text-center">
                                  <h2 className="fs-25px mb-30px profile-title">
                                    LOGIN
                                  </h2>
                                </div>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicEmail"
                                >
                                  <Form.Label className="fw-500 fs-15px login-heading">
                                    E-Mail
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    placeholder="Please Enter E-Mail"
                                    className="rounded-0 signUp-input"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicEmail"
                                >
                                  <Form.Label className="fw-500 fs-15px login-heading">
                                    Password
                                  </Form.Label>
                                  <div className="position-relative">
                                    <Form.Control
                                      type={`${
                                        showPassword !== false
                                          ? "text"
                                          : "password"
                                      }`}
                                      placeholder="********"
                                      className="rounded-0 signUp-input signUp-input-padd"
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                    />
                                    <div className="pass-eye">
                                      {password !== "" ? (
                                        showPassword === false ? (
                                          <i
                                            className="ic_eye_close"
                                            onClick={() =>
                                              setShowPassword(true)
                                            }
                                          ></i>
                                        ) : (
                                          <i
                                            className="ic_eye_open"
                                            onClick={() =>
                                              setShowPassword(false)
                                            }
                                          ></i>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </Form.Group>

                                <div className="rememberme-forgetpassword">
                                  <Form.Group
                                    className="remember-me"
                                    controlId="formBasicCheckbox1"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="Remember Me"
                                      className="fs-15px form-check-label login-heading"
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className="forget-password"
                                    controlId="forgetPassword"
                                  >
                                    <div
                                      onClick={() => {
                                        setForgetShow(true);
                                        setLoginShow(false);
                                      }}
                                    >
                                      <Form.Label className="forget_link login-heading">
                                        Forget Password?
                                      </Form.Label>
                                    </div>
                                  </Form.Group>
                                </div>
                                <div className="signIn-btn mb-15px">
                                  <button
                                    className="btn btn-back w-100"
                                    onClick={() => login()}
                                    type="submit"
                                  >
                                    Login
                                  </button>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="Login_Group">
                              <div className="text-center">
                                <h2 className="fs-25px mb-30px">
                                  FORGOT PASSWORD?
                                </h2>
                              </div>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  E-Mail
                                </Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="E-Mail"
                                  className="rounded-0 signUp-input"
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </Form.Group>
                              <div className="d-flex justify-content-end">
                                <Form.Group
                                  className=""
                                  controlId="forgetPassword"
                                >
                                  <div
                                    onClick={() => {
                                      setForgetShow(false);
                                    }}
                                  >
                                    <Form.Label className="fw-500 fs-15px login-heading BackLogin">
                                      Back To Login?
                                    </Form.Label>
                                  </div>
                                </Form.Group>
                              </div>
                              <div className="signIn-btn mb-15px">
                                <button
                                  className="btn btn-back w-100"
                                  onClick={() => forgetPassword()}
                                >
                                  Continue
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="creat-account mb-15px">
                            <p className="fs-15px">
                              <span>Don’t have an account?</span>
                              <span
                                className="sign-btn"
                                onClick={() => {
                                  setLoginShow(true);
                                  setForgetShow(false);
                                  countryDrp();
                                }}
                              >
                                Sign up
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-center">
                            <h2 className="fs-25px mb-30px profile-title">
                              SIGN UP
                            </h2>
                          </div>
                          <div className="SignUp_Group">
                            <div className="mb-10px SignUpForm">
                              <Form.Group
                                className="mb-3 SignUpCall"
                                controlId="FirstName"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  First Name*
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="First Name"
                                  className="rounded-0 signUp-input"
                                  value={fname}
                                  onChange={(e) => setFname(e.target.value)}
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall"
                                controlId="LastName"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  Last Name*
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Last Name"
                                  className="rounded-0 signUp-input"
                                  value={lname}
                                  onChange={(e) => setLname(e.target.value)}
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall w_100"
                                controlId="formBasicEmail"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  E-Mail*
                                </Form.Label>
                                <Form.Control
                                  type="email"
                                  placeholder="E-Mail"
                                  className="rounded-0 signUp-input"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall w_100"
                                controlId="formBasicEmail"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  Password*
                                </Form.Label>
                                <div className="position-relative">
                                  <Form.Control
                                    type={`${
                                      showPassword !== false
                                        ? "text"
                                        : "password"
                                    }`}
                                    placeholder="********"
                                    className="rounded-0 signUp-input"
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                  />
                                  <div className="pass-eye">
                                    {password !== "" ? (
                                      showPassword === false ? (
                                        <i
                                          className="ic_eye_close"
                                          onClick={() => setShowPassword(true)}
                                        ></i>
                                      ) : (
                                        <i
                                          className="ic_eye_open"
                                          onClick={() => setShowPassword(false)}
                                        ></i>
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall custome-select"
                                controlId="city"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  Country*
                                </Form.Label>
                                <Select
                                  options={countryDataDrp}
                                  placeholder="Select Your Country"
                                  value={country}
                                  onChange={(e) => {
                                    changeCountry(e.value);
                                  }}
                                  isSearchable={true}
                                  isMulti={false}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="custom-react-select-container"
                                  classNamePrefix="custom-react-select"
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall"
                                controlId="LastName"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  State
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="State"
                                  className="rounded-0 signUp-input"
                                  value={state}
                                  onChange={(e) => {
                                    if (
                                      validateWithOnlyLetters(e.target.value)
                                    ) {
                                      setState(e.target.value);
                                    }
                                  }}
                                />
                              </Form.Group>

                              <Form.Group
                                className="mb-3 w-100 custome-select"
                                controlId="LastName"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  Phone Code/Mobile Number*
                                </Form.Label>
                                {/* {countryShortCode == '' ? */}
                                <div className="input-group">
                                  <div className="w-150">
                                    <Select
                                      options={phoneCodeDataDrp}
                                      placeholder="Phone Code"
                                      value={phoneCode}
                                      onChange={(e) => {
                                        setPhonecode(e);
                                      }}
                                      isSearchable={true}
                                      isMulti={false}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      className="custom-react-select-container"
                                      classNamePrefix="custom-react-select"
                                    />
                                    {/* <Form.Select ria-label="Default select example" placeholder="Phone Code" className=" form-control rounded-0 " value={phoneCode} onChange={(e) => changePhoneCode(e.target.value)}>
                                                                            <option value="">Phone Code</option>
                                                                            {countryDataDrp.map((country_item, i) => {
                                                                                return <option key={i} value={country_item.phonecode}>{country_item.phonecode} - {country_item.name}</option>
                                                                            })}
                                                                        </Form.Select> */}
                                  </div>
                                  <Form.Control
                                    type="text"
                                    placeholder="Mobile Number"
                                    className="form-control rounded-0 signUp-input"
                                    value={mobile}
                                    onChange={(e) => {
                                      if (onlyNumbers(e.target.value)) {
                                        setMobile(e.target.value);
                                      }
                                    }}
                                  />
                                </div>
                                {/* //     :
                                                                //         <span className="input-group-text rounded-0" id="basic-addon1">{phoneCode}</span>
                                                                //         <Form.Control type="text" placeholder="Mobile Number" className="rounded-0 signUp-input" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                                                                //     </div>
                                                                // } */}
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall"
                                controlId="LastName"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  City
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="City"
                                  className="rounded-0 signUp-input"
                                  value={city}
                                  onChange={(e) => {
                                    if (
                                      validateWithOnlyLetters(e.target.value)
                                    ) {
                                      setCity(e.target.value);
                                    }
                                  }}
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3 SignUpCall "
                                controlId="city"
                              >
                                <Form.Label className="fw-500 fs-15px login-heading">
                                  Gender
                                </Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  placeholder="Gender"
                                  className=" form-control rounded-0 "
                                  value={gender}
                                  onChange={(e) => changeGender(e.target.value)}
                                >
                                  <option defaultValue="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </Form.Select>
                              </Form.Group>
                            </div>
                            <div className="signIn-btn mb-15px">
                              <button
                                className="btn btn-back w-100"
                                onClick={() => register()}
                              >
                                Create Account
                              </button>
                            </div>
                            <div className="creat-account mb-15px">
                              <p className="fs-15px">
                                <span>Already have an account?</span>
                                <span
                                  className="sign-btn"
                                  onClick={() => {
                                    setLoginShow(false);
                                    setForgetShow(false);
                                  }}
                                >
                                  Login
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-center">
                        <h2 className="fs-25px mb-30px">RESET PASSWORD</h2>
                      </div>
                      <div>
                        <Form.Group className="mb-3" controlId="newpassword">
                          <Form.Label className="fw-500 fs-15px">
                            New Password
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={`${
                                showPassword !== false ? "text" : "password"
                              }`}
                              placeholder="Enter Your Password"
                              className="rounded-0 signUp-input"
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="pass-eye">
                              {newPassword !== "" ? (
                                showPassword === false ? (
                                  <i
                                    className="ic_eye_close"
                                    onClick={() => setShowPassword(true)}
                                  ></i>
                                ) : (
                                  <i
                                    className="ic_eye_open"
                                    onClick={() => setShowPassword(false)}
                                  ></i>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="confirmPassword"
                        >
                          <Form.Label className="fw-500 fs-15px">
                            Confirm Password
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={`${
                                showConfirmPassword !== false
                                  ? "text"
                                  : "password"
                              }`}
                              placeholder="Enter Your Password"
                              className="rounded-0 signUp-input"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                            <div className="pass-eye">
                              {confirmPassword !== "" ? (
                                showConfirmPassword === false ? (
                                  <i
                                    className="ic_eye_close"
                                    onClick={() => setShowConfirmPassword(true)}
                                  ></i>
                                ) : (
                                  <i
                                    className="ic_eye_open"
                                    onClick={() =>
                                      setShowConfirmPassword(false)
                                    }
                                  ></i>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                      <div className="signIn-btn mb-15px">
                        <button
                          className="btn btn-back w-100"
                          onClick={() => resetPassword()}
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>

      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
    </React.Fragment>
  );
};
export default SignIn;
