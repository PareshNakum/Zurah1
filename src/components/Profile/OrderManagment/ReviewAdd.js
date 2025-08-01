import React from "react";
import "../Profile.module.scss";
import Modal from "react-bootstrap/Modal";
import { Rating } from "react-simple-star-rating";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import commanService from "../../../CommanService/commanService";
import { RandomId } from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";

function ReviewAdd(props) {
  // Comman
  const storeEntityId = useSelector((state) => state.storeEntityId);
  const loginData = useSelector((state) => state.loginData);
  const isLogin = Object.keys(loginData).length > 0;

  const uploadVideo = (event) => {
    if (event.target.files[0].size / 1024 / 1024 < 20) {
      props.setVideoFile(event.target.files[0]);
      props.setVideoPreview(URL.createObjectURL(event.target.files[0]));
    } else {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("File size maximum 20 mb limit.");
    }
  };
  const uploadeMultiplePhoto = (event) => {
    let imgArr = [...props.imgfile];
    let previewArr = [...props.imgPreview];
    let file = event.target.files;

    const AllImgfile = [...file];
    if (AllImgfile.length <= 10) {
      AllImgfile.map((ImgFile, i) => {
        let checkExt = ImgFile.name.split(".").pop().toLowerCase();
        let CheckSize = ImgFile.size / 1024 / 1024 < 0.5;
        if (
          checkExt === "jpeg" ||
          checkExt === "jpg" ||
          checkExt === "png" ||
          checkExt === "webp"
        ) {
          if (CheckSize !== false) {
            imgArr.push(ImgFile);
            previewArr.push(URL.createObjectURL(ImgFile));
            props.setImgFile(imgArr);
            props.setImgPreview(previewArr);
          } else {
            props.setTostOpen(true);
            props.setIsSuccess(false);
            props.setTostmsg("Upload Photo 500kb size are allowed.");
          }
        } else {
          props.setTostOpen(true);
          props.setIsSuccess(false);
          props.setTostmsg("Only png,webp,jpg and jpeg files are allowed.");
        }
      });
    } else {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("Upload maximum 10 Photos.");
    }
  };
  const removePhoto = (index) => {
    let imgArr = [...props.imgfile];
    let previewArr = [...props.imgPreview];
    imgArr.map((i) => {
      if (index === i) {
        imgArr.splice(index, 1);
        props.setImgFile(imgArr);
      }
    });
    previewArr.map((i) => {
      if (index === i) {
        previewArr.splice(index, 1);
        props.setImgPreview(previewArr);
      }
    });
  };
  const submitReview = () => {
    const obj = new FormData();
    obj.append("rating", props.rating);
    obj.append("headline", props.headline);
    obj.append("review_details", props.reviewDetail);
    obj.append("order_id", props.orderId);
    obj.append("variant_id", props.variantNumber);
    obj.append("item_id", props.itemNumber);
    obj.append("store_id", storeEntityId.mini_program_id);
    obj.append("user_id", isLogin ? loginData.member_id : RandomId);
    obj.append("unique_id", "");
    obj.append("type", "B2C");
    obj.append("entity_id", storeEntityId.entity_id);
    obj.append("tenant_id", storeEntityId.tenant_id);
    obj.append("SITDeveloper", "1");
    const obj2 = new FormData();
    if (props.imgfile.length === 0) {
      obj2.append("image[]", "");
    } else {
      for (let index = 0; index < props.imgfile.length; index++) {
        obj2.append("image[]", props.imgfile[index]);
      }
    }
    if (props.videoFile === "") {
      obj2.append("video", "");
    } else {
      obj2.append("video", props.videoFile);
    }
    obj2.append("json", commanService.obj_json(obj, "AddUpdateReview"));
    if (props.rating === 0) {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("Select Overall rating.");
    } else if (props.headline === "") {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("please Enter Title");
    } else if (props.reviewDetail === "") {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("Please Enter Comment");
    } else if (props.imgfile.length === 0) {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("Upload Minimum One Photo.");
    } else if (props.imgfile.length > 10) {
      props.setTostOpen(true);
      props.setIsSuccess(false);
      props.setTostmsg("Maximum 10 photo upload.");
    } else {
      props.setLoading(true);
      commanService.postLaravelApi("/ReviewController", obj2).then((res) => {
        if (res.data.success === 1) {
          props.setLoading(false);
          props.setTostOpen(true);
          props.setIsSuccess(true);
          props.setAddReview(false);
          props.setTostmsg(res.data.message);
        } else {
          props.setLoading(false);
          props.setTostOpen(true);
          props.setIsSuccess(false);
          props.setTostmsg(res.data.message);
        }
      });
    }
  };

  return (
    <div>
      <Modal
        show={props.addReview}
        onHide={() => {
          props.setAddReview(false);
        }}
        backdrop="static"
        className="modal-ld review_popup"
        centered
      >
        <Modal.Header closeButton className="">
          <Modal.Title>
            <h2 className="fs-24px profile-title">REVIEW US</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="review_popup_body">
            <div className="review-profile">
              <div className="profile_name">
                <div className="profile_img">
                  <i className="ic_my_account"></i>
                </div>
                <div className="profile_text">
                  <h4 className="UesrName">
                    {loginData.first_name} &nbsp;{loginData.last_name}
                  </h4>
                  <p className="fw-14">{loginData.email}</p>
                </div>
              </div>
              <div className="d-flex mb-15px">
                <div className="star-review star-size">
                  <label className="title">
                    Please rate us 1 (bad) to 5 (excellent): *
                  </label>
                  <Rating
                    value={props.rating}
                    onClick={(e) => props.setRating(e)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-15px">
              <label className="title">Enter Title *</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => props.setHeadLine(e.target.value)}
                placeholder="Enter Title"
              />
            </div>
            <div className="mb-15px">
              <label className="title">Enter Comment *</label>
              <Form.Control
                className="write-comment"
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "145px" }}
                onChange={(e) => props.setReviewDetail(e.target.value)}
              />
            </div>
            <div className="FileUpload_min">
              <div className="review-img position-relative">
                <div className="FileUpload_conn">
                  <label className="title">Upload Images *</label>
                  {props.imgPreview.length === 0 ? (
                    <div className="FileUpload_box">
                      <input
                        type="file"
                        id="FileUpload"
                        className="w-25 h-25 mt-3"
                        multiple
                        onChange={(e) => uploadeMultiplePhoto(e)}
                      />
                      <label htmlFor="FileUpload" className="Addfile">
                        <i className="ic_plus me-2"></i>
                        <span>Add Images</span>
                      </label>
                    </div>
                  ) : (
                    <div className="FileUpload_conn-inner">
                      {props.imgPreview.length > 0 &&
                        props.imgPreview.map((Imgurl, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div className="Upload_images">
                                <Image
                                  src={Imgurl}
                                  className="img-fluid "
                                  alt=""
                                />
                                <button
                                  className=""
                                  type="button"
                                  onClick={() => removePhoto(i)}
                                >
                                  <i className="ic_remove"></i>
                                </button>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      {props.imgfile.length < 10 ? (
                        <div className="Upload_images-box">
                          <input
                            type="file"
                            id="FileUpload"
                            multiple
                            onChange={(e) => uploadeMultiplePhoto(e)}
                          />
                          <i className="ic_plus"></i>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>

                <div className="VideoUpload_conn">
                  <label className="title">Upload video</label>
                  {props.videoPreview.length > 0 ? (
                    <div className="playvideo">
                      <button
                        className=""
                        type="button"
                        onClick={() => {
                          props.setVideoFile("");
                          props.setVideoPreview("");
                        }}
                      >
                        <i className="ic_remove"></i>
                      </button>
                      <video controls>
                        <source src={props.videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="VideoUpload_box">
                      <input
                        type="file"
                        id="VideoUpload"
                        accept="video/*"
                        onChange={(e) => uploadVideo(e, "video")}
                      />
                      <label htmlFor="VideoUpload" className="Addfile">
                        <i className="ic_plus me-2"></i>
                        <span>Add Video</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="review-footer">
          <button
            type="button"
            className="btn btn-back "
            data-bs-dismiss="modal"
            onClick={() => {
              props.setAddReview(false);
            }}
          >
            Not Now
          </button>
          <button
            type="button"
            className="btn btn-dark-green"
            onClick={() => submitReview()}
          >
            Submit Review
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewAdd;
