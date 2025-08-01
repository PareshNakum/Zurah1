import React, { useState } from "react";
import "./Warrantycard.module.scss";
import commanService from "../../../CommanService/commanService";
import Notification from "../../../CommanUIComp/Notification/Notification";
import { isEmpty } from "../../../CommanFunctions/commanFunctions";
import Loader from "../../../CommanUIComp/Loader/Loader";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
const Warrantycard = (props) => {
  const navigate = useRouter();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);

  const [loading, setLoading] = useState(false);
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [userMessage, setUserMessage] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [selectedElement, setSelectedElement] = useState("");

  const verifyCard = (serialNum) => {
    const obj = {
      a: "OrderWiseSKU",
      store_type: "B2C",
      consumer_id: isEmpty(loginData.member_id),
      certificate_id: serialNum,
      store_id: storeEntityId.mini_program_id,
    };
    if (isEmpty(serialNum) !== "") {
      setLoading(true);
      commanService
        .postLaravelApi("/WarrantyCard", obj)
        .then((res) => {
          if (res.data.success == 1) {
            setShowVerifyModal(true);
            setOrderData(res.data.data);
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
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Enter Warranty Card Number");
      setLoading(false);
    }
  };

  const verifySKUs = (element) => {
    setShowVerifyModal(false);
    const obj = {
      a: "warrantycard",
      store_type: "B2C",
      certificate_id: element.product_sku,
      status: "0",
      b2c_order_id: element.so_b2c_order_id,
      order_id: element.order_id,
      store_id: storeEntityId.mini_program_id,
    };
    if (isEmpty(element) !== "") {
      setLoading(true);
      commanService
        .postLaravelApi("/WarrantyCard", obj)
        .then((res) => {
          if (res.data.success == 1) {
            setSelectedElement(element);
            setUserMessage(res.data.message);
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
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Please Select Order Lines");
      setLoading(false);
    }
  };

  const createJourney = () => {
    viewCatalogApi(selectedElement);
    setSerialNumber("");
  };

  const viewCatalogApi = (element) => {
    const catalog = {
      a: "JourneyCatalog",
      store_type: "B2C",
      certificate_id: element.product_sku,
      b2c_order_id: element.so_b2c_order_id,
      order_id: element.order_id,
      counsumer_id: isEmpty(loginData.member_id),
      store_id: storeEntityId.mini_program_id,
    };

    if (isEmpty(element) !== "") {
      setLoading(true);
      commanService
        .postLaravelApi("/WarrantyCard", catalog)
        .then((res) => {
          if (res.data.success == 1) {
            setUserMessage(res.data.message);
            if (props.setSelectedTab) {
              props.setSelectedTab("JourneyCatalogue");
              navigate.push(`/dashboard/journey-catalogue`);
            }
            setLoading(false);
            window.location.reload();
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
    } else {
      setToastOpen(true);
      setIsSuccess(false);
      setToastMsg("Enter Warranty Card Number");
      setLoading(false);
    }
  };

  return (
    <div id="warranty-card">
      {loading && <Loader />}
      <div className="d-flex flex-wrap justify-content-between mb-3">
        <div>
          <h3 className="profile-title">Warranty Card</h3>
        </div>
      </div>
      <div className="message">
        <p>
          This is to certify that this device is covered under warranty. please
          check the seller invoice copy for the validity of warranty.
        </p>
      </div>

      <div className="message_body mt-2">
        <div className="wcard-input">
          <label className="medium-small-title main-sub-title mb-2 fw-500">
            Enter Warranty Card Number
          </label>
          <div className="d-flex flex-wrap">
            <div className="d-flex align-items-center col-md-9">
              <input
                type="text"
                className="input-text fw-400"
                placeholder="Enter Warranty Card Number"
                value={serialNumber}
                onChange={(e) => {
                  setSerialNumber(e.target.value);
                }}
              />
            </div>
            <div className="text-end col-md-3">
              <button
                type="button"
                className="btn button-thamebalck"
                onClick={() => verifyCard(serialNumber)}
              >
                Verify
              </button>
            </div>
          </div>
          <div className="TearmCondition">
            <p className="terms_tilte">Terms and Condition :</p>
            <div className="termscondition">
              <ul>
                <li>1.One year warranty effects from the purchase date.</li>
                <li>
                  2.Warranty covers any manufacturing technical defect excluding
                  breakage.
                </li>
                <li>
                  3.Warranty is void if repairing without our conset or warranty
                  seal is broken.
                </li>
                <li>
                  4.The warranty does not cover faults resulting from operation
                  careless handling or not following instruction. Also to
                  electric shock cases.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {isEmpty(userMessage) !== "" ? (
          <>
            <div className="col-12 my-4">
              <p
                className="text-center text-success"
                dangerouslySetInnerHTML={{ __html: userMessage }}
              ></p>
            </div>
            <div className="col-12">
              <div className="text-center mt-2">
                <button
                  type="button"
                  id="journeyBtn"
                  className="btn button-thamebalck"
                  onClick={() => createJourney()}
                >
                  Create Your Free Journey Catalogue
                </button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {/* ---Verify SKU with Order Id ---- */}
      <Modal
        size="xl"
        show={showVerifyModal}
        centered
        className="JourneyCatalogueModal"
      >
        {loading && <Loader className="journey-loader" />}
        <Modal.Header closeButton onHide={() => setShowVerifyModal(false)}>
          <Modal.Title className="">{serialNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered hover className="message_body">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderData.length > 0
                ? orderData.map((item, i) => {
                    const formattedDate =
                      new Date(item.create_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }) +
                      " " +
                      new Date(item.create_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });

                    return (
                      <tr key={i}>
                        <td>{item.order_id}</td>
                        <td>{formattedDate}</td>
                        <td
                          className="cursor-pointer edit_btn"
                          onClick={() => verifySKUs(item)}
                        >
                          Add
                        </td>
                      </tr>
                    );
                  })
                : !loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        <p className="text-center">No Recored Found</p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <button
            variant="secondary"
            className="btn primary-button"
            onClick={() => setShowVerifyModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Notification
        toastMsg={toastMsg}
        toastShow={toastShow}
        isSuccess={isSuccess}
        Close={() => setToastOpen()}
      />
    </div>
  );
};

export default Warrantycard;
