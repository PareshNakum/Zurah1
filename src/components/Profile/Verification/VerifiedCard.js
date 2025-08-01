import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import commanService from "../../../CommanService/commanService";
import { RandomId } from "../../../CommanFunctions/commanFunctions";
import { verificationStatusAction } from "../../../Redux/action";

const VerifiedCard = () => {
  const dispatch = useDispatch();
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);
  const isLogin = Object.keys(loginData).length > 0;

  const [verificationData, setVerificationData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const fetchTwoStepVerificationData = () => {
    const twoStepVerificationObj = {
      SITDeveloper: "1",
      a: "GetTwoStepVerificationData",
      entity_id: storeEntityId.entity_id,
      miniprogram_id: storeEntityId.mini_program_id,
      secret_key: storeEntityId.secret_key,
      tenant_id: storeEntityId.tenant_id,
      member_id: isLogin ? loginData.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", twoStepVerificationObj)
      .then((response) => {
        if (response.data.success === 1) {
          setVerificationData(response.data.data);
        } else {
          dispatch(verificationStatusAction(response.data.success));
        }
      })
      .catch(() => {});
  };

  // useEffect(() => {
  //   fetchTwoStepVerificationData();
  // }, []);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleDelete = () => {
    const updateTwoStepVerificationObj = {
      SITDeveloper: "1",
      a: "UpdateTwoStepVerification",
      entity_id: storeEntityId.entity_id,
      tenant_id: storeEntityId.tenant_id,
      unique_id: verificationData.unique_id,
      create_by: isLogin ? loginData.member_id : RandomId,
    };
    commanService
      .postApi("/TwoFactorAuthntication", updateTwoStepVerificationObj)
      .then((response) => {
        if (response.data.success === 1) {
          dispatch(verificationStatusAction(0));
        }
        window.location.reload();
      })
      .catch(() => {});
  };

  function formatDate(dateString) {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Create an Intl.DateTimeFormat object to format the date
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the date and return the result
    return formatter.format(date);
  }

  return (
    <div className="bg-white p-20px">
      <header className="py-1">
        <h1 className="fw-500 fs-24px">2-Step Verification</h1>
      </header>
      <main className="p-3 bg-secondary bg-opacity-10">
        {isEdit ? (
          <React.Fragment>
            <p>How do you want to recieve Verification codes ?</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-semibold">
                {" "}
                {verificationData ? verificationData.authnticator_name : ""}
              </div>
              <div
                className="text-primary cursor-pointer text-decoration-underline"
                onClick={handleDelete}
              >
                Delete
              </div>
            </div>
            <p className="my-2">
              <button
                className="border-0 bg-secondary text-white px-3 py-2"
                onClick={() => setIsEdit(false)}
              >
                Previous
              </button>
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Verification</div>
              <div
                className="text-primary cursor-pointer text-decoration-underline"
                onClick={handleEdit}
              >
                Edit
              </div>
            </div>
            <p className="fw-400 fs-16px my-2">
              Backup :{" "}
              <small>
                {verificationData ? verificationData.authnticator_name : ""}
              </small>
            </p>
            <div className="py-2">
              <p>
                <span className="bg-primary bg-opacity-25">When</span>
              </p>
              <p>Every login</p>
            </div>
            <div>
              <p>Added</p>
              <p>
                {" "}
                <small>
                  {verificationData.create_at
                    ? formatDate(verificationData.create_at)
                    : ""}{" "}
                </small>
              </p>
            </div>
          </React.Fragment>
        )}
      </main>
    </div>
  );
};

export default VerifiedCard;
