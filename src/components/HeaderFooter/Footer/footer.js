import React, { useEffect, useState, useCallback } from "react";
import styles from "./footer.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  loginModal,
  FooterLoginModal,
  headerLoginModal,
  countCart,
  storeFavCount,
  logoDetail,
  footerAllContentData,
} from "../../../Redux/action";
import { isEmpty, RandomId } from "../../../CommanFunctions/commanFunctions";
import Commanservice from "../../../CommanService/commanService";
import Paypal from "@/Assets/Images/Paypal.webp";
import mastercard from "@/Assets/Images/Mastercard.webp";
import visa from "@/Assets/Images/Visa.webp";
import amex from "@/Assets/Images/AmericanExpress.webp";
import Rupay from "@/Assets/Images/Rupay.webp";
import UPI from "@/Assets/Images/UPI.webp";
import Form from "react-bootstrap/Form";
import Notification from "../../../CommanUIComp/Notification/Notification";
import SignIn from "../../Login/signIn";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CrispChat from "./CrispChat";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const Footer = () => {
  const loginData = useSelector((state) => state.loginData);
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const isLogin = Object.keys(loginData).length > 0;

  // Tost Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Footer Active
  const [FooterActive, setFooterActive] = useState("");

  // Footer Data
  const [footerLogo, setFooterLogo] = useState([]);
  const [footerContent, setFooterContent] = useState([]);
  const [footerSocialLink, setfooterSocialLink] = useState([]);
  const [footerContact, setFooterContact] = useState([]);

  // Form email
  const [email, setEmail] = useState("");

  const stored = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("storeData")) : {};
  
  const footerData = useCallback(
    (data) => {
      const obj = {
        a: "getHomeFooterDetail",
        store_id: data.mini_program_id,
        user_id:
          Object.keys(loginData).length > 0 ? loginData.member_id : RandomId,
        type: "B2C",
      };
      Commanservice.postLaravelApi("/SectionDetail", obj)
        .then((res) => {
          if (res["data"]["success"] === 1) {
            setFooterContent([]);
            dispatch(footerAllContentData([]));
            const footerData = res["data"]["data"];
            if (Object.keys(footerData).length > 0) {
              const footerLogo = footerData["logo_data"];
              const footerContentData = footerData["content_data"];
              const footerSocialData = footerData["socialmedia_link"];
              const footerContact = footerData["contact_data"];
              if (footerLogo.length > 0) {
                setFooterLogo(footerLogo);
                dispatch(logoDetail(footerLogo));
              }
              //console.log(footerContentData);
              //let arr = [];
              // arr.push( { "code": "about-us", "name": "About Us" })
              // if (footerSocialData.length > 0) {
              //     footerContentData.map((e) => { arr.push(e); return e; });
              // }

              setFooterContent(footerContentData);
              dispatch(footerAllContentData(footerContentData));
              if (footerSocialData.length > 0) {
                setfooterSocialLink(footerSocialData);
              }
              if (footerContact.length > 0) {
                footerContact[0]["address"] = footerContact[0]["building"];
                if (isEmpty(footerContact[0]["building_name"]) != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["building_name"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["street"];
                if (isEmpty(footerContact[0]["description"]) != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["description"];
                }
                if (isEmpty(footerContact[0]["city_name"]) != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["city_name"];
                }
                if (isEmpty(footerContact[0]["pincode"]) != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    "-" +
                    footerContact[0]["pincode"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["state_name"] +
                  ", " +
                  footerContact[0]["country_name"] +
                  ".";
                setFooterContact(footerContact);
              }
              dispatch(storeFavCount(footerData?.favourite_count));
              dispatch(countCart(footerData?.cart_count));
            } else {
              let arr = [];
              arr.push(
                { code: "blog", name: "Blog" },
                { code: "about-us", name: "About Us" },
                { code: "contact-us", name: "Contact Us" }
              );
              setFooterContent(arr);
              dispatch(footerAllContentData(arr));
              dispatch(storeFavCount(storeFavCount));
              dispatch(countCart(countCart));
            }
          } else {
            let arr = [];
            arr.push(
              { code: "blog", name: "Blog" },
              { code: "about-us", name: "About Us" },
              { code: "contact-us", name: "Contact Us" }
            );
            setFooterContent(arr);
            dispatch(footerAllContentData(arr));
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
            dispatch(storeFavCount(storeFavCount));
            dispatch(countCart(countCart));
          }
        })
        .catch(() => {
          let arr = [];
          arr.push(
            { code: "blog", name: "Blog" },
            { code: "about-us", name: "About Us" },
            { code: "contact-us", name: "Contact Us" }
          );
          setFooterContent(arr);
          dispatch(footerAllContentData(arr));
          dispatch(storeFavCount(storeFavCount));
          dispatch(countCart(countCart));
        });
    },
    [loginData, dispatch]
  );

  const subscribeEmail = () => {
    const obj = {
      a: "AddUpdateSubscribers",
      unique_id: "",
      store_id: storeEntityId.mini_program_id,
      email: email,
    };

    if (isEmpty(email) != "") {
      Commanservice.postLaravelApi("/Subscribers", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setEmail("");
            setToastOpen(true);
            setIsSuccess(true);
            setToastMsg(res.data.message);
            if (!isLogin) {
              dispatch(loginModal(true));
              dispatch(FooterLoginModal(true));
              dispatch(headerLoginModal(false));
            }
          } else {
            setToastOpen(true);
            setIsSuccess(false);
            setToastMsg(res.data.message);
          }
        })
        .catch(() => {});
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Please Enter Valid Email.");
    }
  };

  useEffect(() => {
    const data = storeEntityId;
    if (stored && Object.keys(stored).length > 0) {
      footerData(stored);
      setFooterActive("");
      setFooterContent([]);
      dispatch(footerAllContentData([]));
    }
  }, [storeEntityId, loginData]);

  return (
    <React.Fragment>
      <section id={`${styles.Footer}`} className={`${styles.footer_section}`}>
        <div className={styles["footer-offer-box"]}>
          <div className={styles["offer-box"]}>
            <h2
              className={clsx(
                `${styles["offer-box-titla"]} text-center fs-14px`
              )}
            >
              You’re invited! Join our mailing list to get 12% off on your first
              order, new launches and more!
            </h2>
            <div className={styles["input-field-subscribe"]}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Enter Your email"
                    className="rounded-0 "
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </Form.Group>

                <div className="">
                  {email !== "" ? (
                    <button
                      type="button"
                      className={clsx(
                        `${styles["subscribe-bg-color"]} btn ${styles["sign-up-hide"]} h-45px`
                      )}
                      onClick={() => {
                        subscribeEmail();
                      }}
                      aria-label="Subscribe to our newsletter"
                    >
                      Subscribers
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={clsx(
                        `${styles["subscribe-bg-color"]} btn ${styles["sign-up-hide"]} h-45px`
                      )}
                      aria-label="Subscribe to our newsletter"
                    >
                      Subscribers
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles["subscribe-bg-color"]} h-45px ${styles["send-hide"]}`}
                    onClick={() => {
                      subscribeEmail();
                    }}
                    aria-label="Subscribe to our newsletter"
                  >
                    <i className={clsx(`ic_send ${styles["fs-20px"]}`)}></i>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="container">
          <div
            className={`${styles["footer_section_menu"]} ${styles["border_bottom"]}`}
          >
            <div className="row">
              {footerContent.length > 0 &&
                (footerContent || []).map((e, i) => {
                  if (e.category_name === "Customer Service") {
                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 my-3"
                        key={i}
                      >
                        <div
                          className={clsx(`fs-14px ${styles["page-detail"]}`)}
                        >
                          <h3
                            className={clsx(
                              `mb-3 fs-20px ${styles["footer-heading"]}`
                            )}
                          >
                            {e.category_name}
                          </h3>
                          <ul className="ps-0">
                            {(e.data || []).map((d, index) => {
                              return (
                                <li
                                  key={index}
                                  className={`${styles["foot-link"]}`}
                                >
                                  <Link
                                    onClick={() => {
                                      setFooterActive(d.ecm_code);
                                    }}
                                    className={`text-start ${
                                      pathname?.includes(
                                        d.ecm_code?.toLowerCase()
                                      )
                                        ? `${styles["Footer-Active"]}`
                                        : ""
                                    } `}
                                    href={`/${d.ecm_code.toLowerCase()}`}
                                  >
                                    {d.ecm_name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  if (e.category_name === "About Us") {
                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 my-3 "
                        key={i}
                      >
                        <div
                          className={clsx(`fs-14px ${styles["page-detail"]}`)}
                        >
                          <h3
                            className={clsx(
                              `mb-3 fs-20px ${styles["footer-heading"]}`
                            )}
                          >
                            {e.category_name}
                          </h3>
                          <ul className="ps-0">
                            {(e.data || []).map((d, index) => {
                              return (
                                <li
                                  key={index}
                                  className={`${styles["foot-link"]}`}
                                >
                                  <Link
                                    onClick={() => {
                                      setFooterActive(d.ecm_code);
                                    }}
                                    className={`text-start ${
                                      (d.ecm_code === "ABOUTUS" &&
                                        pathname?.includes("/about-us")) ||
                                      pathname?.includes(
                                        d.ecm_code?.toLowerCase()
                                      )
                                        ? `${styles["Footer-Active"]}`
                                        : ""
                                    } `}
                                    href={
                                      d.ecm_code === "ABOUTUS"
                                        ? "/about-us"
                                        : `/${d.ecm_code.toLowerCase()}`
                                    }
                                  >
                                    {d.ecm_name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  if (e.category_name === "Why") {
                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 my-3 "
                        key={i}
                      >
                        <div
                          className={clsx(`fs-14px ${styles["page-detail"]}`)}
                        >
                          <h3
                            className={clsx(
                              `mb-3 fs-20px ${styles["footer-heading"]}`
                            )}
                          >
                            {e.category_name}
                          </h3>
                          <ul className="ps-0">
                            {(e.data || []).map((d, index) => {
                              return (
                                <li
                                  key={index}
                                  className={`${styles["foot-link"]}`}
                                >
                                  <Link
                                    onClick={() => {
                                      setFooterActive(d.ecm_code);
                                    }}
                                    className={`text-start ${
                                      (d.ecm_code === "CUSTOMERSUPPORT" &&
                                        pathname?.includes("/contact-us")) ||
                                      pathname?.includes(
                                        d.ecm_code?.toLowerCase()
                                      )
                                        ? `${styles["Footer-Active"]}`
                                        : ""
                                    } `}
                                    href={
                                      d.ecm_code === "CUSTOMERSUPPORT"
                                        ? "/contact-us"
                                        : `/${d.ecm_code.toLowerCase()}`
                                    }
                                  >
                                    {d.ecm_name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                })}

              <div className="col-12 col-sm-6 col-md-4 col-lg-3 my-3 ">
                {footerContact.length > 0 && (
                  <div className={clsx(`fs-14px ${styles["page-detail"]}`)}>
                    <h3
                      className={clsx(
                        `mb-3 fs-20px ${styles["footer-heading"]}`
                      )}
                    >
                      Get In Touch
                    </h3>
                    {footerContact.length > 0 &&
                      footerContact.map((e, i) => (
                        <ul className="ps-0" key={i}>
                          <li
                            className={clsx(
                              `${styles["foot-link"]} d-flex align-items-start`
                            )}
                          >
                            <div className="icon">
                              {" "}
                              <i className="ic_home" />{" "}
                            </div>
                            <div className="ms-2 fs-13px">{e?.address}</div>
                          </li>
                          {isEmpty(e?.email) != "" ? (
                            <li
                              className={clsx(
                                `${styles["foot-link"]} d-flex align-items-start`
                              )}
                            >
                              <div className="icon">
                                <i className="ic_envelope" />
                              </div>
                              <Link
                                href={`mailto:${e?.email}`}
                                className="footer-text-color footer-text-size footer-text-hover ms-2 fs-13px"
                              >
                                {" "}
                                {e?.email}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                          {isEmpty(e?.mobile) != "" ? (
                            <li
                              className={clsx(
                                `${styles["foot-link"]} d-flex align-items-start`
                              )}
                            >
                              <div className="icon">
                                <i className="ic_telephone" />
                              </div>
                              <Link
                                href={`tel:${e?.mobile}`}
                                className="footer-text-color footer-text-size footer-text-hover ms-2 fs-13px"
                              >
                                {e?.country_code} {e?.mobile}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      ))}
                  </div>
                )}
                {footerSocialLink.length > 0 && (
                  <div
                    className={clsx(
                      `fs-14px ${styles["page-detail"]} ${styles["stay-connected"]}`
                    )}
                  >
                    <h3
                      className={clsx(
                        `mb-3 fs-20px ${styles["footer-heading"]}`
                      )}
                    >
                      Stay Connected
                    </h3>
                    <ul className="ps-0 mb-0">
                      <li className={`${styles["foot-link"]}`}>
                        Write a Product Review Text to Save
                      </li>
                      <li>
                        <ul className="ps-0">
                          {footerSocialLink.length > 0 &&
                            footerSocialLink.map((s, i) => {
                              return (
                                <li
                                  className={`me-3 ${styles["social-icon"]}`}
                                  key={i}
                                >
                                  <Link
                                    className="text-start"
                                    target={"_blank"}
                                    href={s.url}
                                  >
                                    <Image
                                      src={s.image}
                                      alt={s.name}
                                      className="img-fluid wh-auto"
                                      width={31}
                                      height={31}
                                    />
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles["section-payment-icons"]}`}>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={Paypal}
              alt="Paypal"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={visa}
              alt="Visa"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={mastercard}
              alt="Mastercard"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={amex}
              alt="Amex"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={Rupay}
              alt="Rupay"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
          <div className={`${styles["payment-icon"]}`}>
            <Image
              src={UPI}
              alt="UPI"
              className="img-fluid"
              width={170}
              height={40}
            />
          </div>
        </div>
        <div className={`${styles["copyright_info"]}`}>
          <div className="container">
            <p
              className={clsx(
                `${styles["copyright-color"]} text-center py-3 mb-0 fs-15px`
              )}
            >
              Copyright © {new Date().getFullYear()} {storeEntityId?.store_name}
            </p>
          </div>
        </div>
      </section>

      {FooterLoginModal && <SignIn logo={footerLogo} data={footerLogo} />}

      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
      <CrispChat />
    </React.Fragment>
  );
};

export default Footer;
