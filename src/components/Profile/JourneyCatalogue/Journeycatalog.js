import React, { useEffect, useState } from 'react';
import "./Journeycatalog.module.scss";
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import commanService from '../../../CommanService/commanService';
import { isEmpty } from '../../../CommanFunctions/commanFunctions';
import Loader from '../../../CommanUIComp/Loader/Loader';
import Notification from "../../../CommanUIComp/Notification/Notification";
import Link from "next/link";
import Image from "next/image";

const Journeycatalog = () => {
    const storeEntityId = useSelector(state => state.storeEntityId);
    const loginData = useSelector(state => state.loginData);
    const [loading, setLoading] = useState('');

    const [toastShow, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [catalogDataList, setCatalogDataList] = useState([]);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [description, setDescription] = useState('');
    const [imgFile, setImgFile] = useState([]);
    const [imgPreview, setImgPreview] = useState([]);
    const [orderElement, setOrderElement] = useState('');
    const [Status, setStatus] = useState('');
    const [certificateId, setCertificateId] = useState('')
    const [jrnyUniqueId, setJrnyUniqueId] = useState('')
    const [update, setUpdate] = useState(false)
    const [uploadPhoto, setUploadPhoto] = useState(false)
    const [showJourneyModal, setShowJourneyModal] = useState(false);

    const catalogData = () => {
        const catalog = {
            "a": "GetJourneyCatalog",
            "store_type": 'B2C',
            "counsumer_id": isEmpty(loginData.member_id),
            "store_id": isEmpty(storeEntityId.mini_program_id)
        }
        setLoading(true)
        commanService.postLaravelApi('/WarrantyCard', catalog).then((res) => {
            if (res.data.success == 1) {
                let data = res.data.data
                setCatalogDataList(data)
                setLoading(false)
            } else {
                setToastOpen(true)
                setIsSuccess(false)
                setToastMsg(res.data.message)
                setLoading(false)
            }
        }).catch((error) => {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(error.message)
            setLoading(false)
        })
    }

    const addCatalog = (data) => {
        setUploadPhoto(false)
        setUpdate(false)
        setOrderElement(data)
        setCertificateId(data.certificate_id)
        setJrnyUniqueId(data.unique_id)
        setShowJourneyModal(true);
        setStatus(data.status)
        setReview('')
        setTitle('')
        setDescription('')
        setImgFile([])
        setImgPreview([])
    };

    const editCatalog = (data) => {
        setTitle('');
        setReview('')
        setDescription('');
        setImgFile([]);
        setImgPreview([]);
        setStatus('');

        setUploadPhoto(false)
        setShowJourneyModal(true);
        setUpdate(true)
        setOrderElement(data)
        setStatus(data.status)
        setCertificateId(data.certificate_id)
        setJrnyUniqueId(data.unique_id)
        catalogReviewData(data)
    }

    useEffect(() => {
        catalogData()
    }, [])

    const uploadMultipleImage = (e) => {
        setUploadPhoto(true)
        const imges = [...imgFile]
        const preview = [...imgPreview]
        const files = e.target.files

        const filesObj = [...files]

        filesObj.map((file) => {
            const ext = file.name.split('.').pop().toLowerCase()
            if (ext == "jpeg" || ext == "jpg" || ext == "png" || ext == "webp") {
                imges.push(file);
                preview.push(URL.createObjectURL(file))
                setImgFile(imges)
                setImgPreview(preview)
            } else {
                setToastOpen(true);
                setIsSuccess(false);
                setToastMsg('Only png,webp,jpg and jpeg files are allowed.');
            }
            return file;
        })
        e.target.value = ''
    }

    const removeImage = (index) => {
        if (update == false || isEmpty(index.unique_id) == '') {
            const img = imgFile.filter((item, i) => i !== index);
            setImgFile(img);
            const imgPre = imgPreview.filter((item, i) => i !== index);
            setImgPreview(imgPre);
        } else {
            const obj = {
                "a": "CatalogImageDelete",
                "unique_id": isEmpty(index.unique_id)
            }
            setLoading(true)
            commanService.postLaravelApi('/WarrantyCard', obj).then((res) => {
                if (res.data.success == 1) {
                    const filter = imgFile.filter((item, i) => index.unique_id !== item.unique_id)
                    const arr = []
                    for (let c = 0; c < filter.length; c++) {
                        if (isEmpty(filter[c].unique_id) == "") {
                            arr.push(URL.createObjectURL(filter[c]))
                        } else {
                            arr.push(filter[c])
                        }
                    }
                    setImgFile(filter)
                    setImgPreview(arr)
                    setToastOpen(true)
                    setIsSuccess(true)
                    setToastMsg(res.data.message)
                    setLoading(false)
                } else {
                    setLoading(false)
                }

            }).catch((error) => {
                setToastOpen(true)
                setIsSuccess(false)
                setToastMsg(error.message)
                setLoading(false)
            })
        }
    }

    const addUpdateCatalog = (value) => {
        const obj = new FormData();
        obj.set('title', isEmpty(title));
        obj.set('review', isEmpty(review));
        obj.set('description', isEmpty(description));
        obj.set('store_id', isEmpty(storeEntityId.mini_program_id));
        obj.set('counsumer_id', loginData.member_id);
        obj.set('unique_id', value == "update" && imgFile.length > 0 ? imgFile[0].unique_id : "");
        obj.set('so_order_id', isEmpty(orderElement.so_order_id));
        obj.set('jc_unique_id', isEmpty(jrnyUniqueId));
        obj.set('certificate_id', certificateId);
        obj.set('status', '0');

        const obj2 = new FormData();
        if (imgFile.length == 0) {
            obj2.set('image[]', '');
        } else {
            if (uploadPhoto) {
                for (let i = 0; i < imgFile.length; i++) {
                    if (isEmpty(imgFile[i].unique_id) == '') {
                        obj2.append('image[]', imgFile[i]);
                    }
                }
            } else {
                obj2.append('image[]', '');
            }
        }
        obj2.set('json', commanService.obj_json(obj, 'AddUpdateReview'));
        if (isEmpty(title) == "") {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg('Title Required')
        } else if (isEmpty(review) == "") {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg('How We Meet Required')
        } else if (isEmpty(description) == "") {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg('The Proposal Required')
        } else if (imgFile.length == 0) {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg('Image Required')
        } else {
            setLoading(true)
            commanService.postLaravelApi('/WarrantyCard', obj2).then((res) => {
                if (res.data.success == 1) {
                    setToastOpen(true)
                    setIsSuccess(true)
                    setToastMsg(res.data.message)
                    setShowJourneyModal(false);
                    catalogData();
                } else {
                    setToastOpen(true)
                    setIsSuccess(false)
                    setToastMsg(res.data.message)
                }
                setLoading(false)
            })
        }
    }

    const catalogReviewData = (data) => {
        const obj = {
            "a": "GetCatalogReview",
            "store_type": 'B2C',
            "certificate_id": isEmpty(data.certificate_id),
            "so_order_id": isEmpty(data.so_order_id),
            "counsumer_id": isEmpty(loginData.member_id),
            "store_id": isEmpty(storeEntityId.mini_program_id)
        }
        setLoading(true)
        commanService.postLaravelApi('/WarrantyCard', obj).then((res) => {
            if (res.data.success == 1) {
                let data = res.data.data
                setReview(data[0].review)
                setTitle(data[0].title)
                setDescription(data[0].description)
                setImgFile(data[0].image)
                setImgPreview(data[0].image)
                setLoading(false)
            } else {
                setLoading(false)
            }
        }).catch((error) => {
            setToastOpen(true)
            setIsSuccess(false)
            setToastMsg(error.message)
            setLoading(false)
        })
    }

    return (
        <div id="Journey">
            <div className=''>
                {loading && <Loader />}
                <div className="d-flex flex-wrap justify-content-between mb-3">
                    <div>
                        <h3 className='profile-title'>Journey Catalogue</h3>
                    </div>
                </div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Create Date</th>
                            <th>Order No</th>
                            <th>Warranty Card No</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {catalogDataList.length > 0 ? catalogDataList.map((item, i) => {
                            const formattedDate = new Date(item.create_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'numeric', year: 'numeric'
                            })
                            return (
                                <tr key={i}>
                                    <td>{formattedDate}</td>
                                    <td>{item.order_id}</td>
                                    <td>{item.certificate_id}</td>
                                    <td>{item.status}</td>
                                    {item.id == 0 ?
                                        <td className='cursor-pointer' onClick={() => addCatalog(item)}>Add</td>
                                        :
                                        <td><span className='edit_btn' onClick={() => editCatalog(item)}> Edit </span>  {isEmpty(item.publish_url) !== "" ? <span className='edit_btn'>| <Link href={`/dashboard/viewjourney?unique_id=${item.unique_id}`}>View Catalogue</Link></span> : ""}</td>
                                    }
                                </tr>
                            )
                        })
                            :
                            !loading && <tr>
                                <td colSpan={5} className='text-center py-5'>
                                    <p className='text-center'>No Recored Found</p>
                                    <p> GO TO {'>>'} Warranty Card and Create Your Own Catalogue</p>
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </div>

            {/* ---Add catalogue Review ---- */}
            <Modal size="xl" show={showJourneyModal} centered className='JourneyCatalogueModal'>
                <Modal.Header closeButton onHide={() => setShowJourneyModal(false)}>
                    <Modal.Title className="">{orderElement.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='col-12'>
                        <label className="fw-400 medium-small-title d-block mb-0 mt-3 ms-1">Title</label>
                        <input autoComplete="off" className="input-text" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="col-12">
                        <div className='row'>
                            <div className='col-6'>
                                <div className="row mx-0">
                                    <div className="col-12 ps-0 pe-lg-3 pe-md-2 pe-0">
                                        <label className="fw-400 medium-small-title d-block mb-0 mt-3">Upload a photo (Multiple Image)</label>
                                        <div className="file-upload">
                                            <div className="d-flex align-items-center justify-content-center">
                                                Click to image upload<i className="ic_upload medium-title ms-1"></i>
                                            </div>
                                            <input type="file" accept="image/*" multiple className="w-100" onChange={(e) => uploadMultipleImage(e)} />
                                        </div>
                                        <div className="row mx-0 align-items-center">
                                            {imgPreview.length > 0 && imgPreview.map((url, i) => {
                                                return (
                                                    <div className={`col-3 position-relative pt-2 ps-0 pe-1`} key={i}>
                                                        <div className="images-upload border">
                                                            <Image alt="" src={update && isEmpty(url.image) !== '' ? url.image : url} className="h-100 w-100" />
                                                            <div className="close-icon cursor-pointer" onClick={() => { update && isEmpty(url.image) == '' || !update ? removeImage(i) : removeImage(url) }}>
                                                                <i className="ic_remove"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='d-flex flex-wrap'>
                                    <div className='col-12'>
                                        <label className="fw-400 medium-small-title d-block mb-0 mt-3">How We Meet</label>
                                        <textarea autoComplete="off" className="input-text how_we_meet_input" type="text" value={review} placeholder="How We Meet" onChange={(e) => setReview(e.target.value)}></textarea>
                                    </div>
                                    <div className='col-12'>
                                        <label className="fw-400 medium-small-title d-block mb-0 mt-3">The Proposal</label>
                                        <textarea autoComplete="off" className="input-text proposal_input" type="text" value={description} placeholder="The Proposal" onChange={(e) => setDescription(e.target.value)}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {!update ?
                        <button variant="primary" className="btn button-thamebalck" onClick={() => addUpdateCatalog("add")}>Submit</button> :
                        <>
                            {isEmpty(Status) != 'PUBLISH' ?
                                <button variant="primary" className="btn button-thamebalck" onClick={() => addUpdateCatalog("update")}>Update</button>
                                : ''}
                        </>
                    }
                    <button variant="secondary" className="btn button-thamebalck" onClick={() => setShowJourneyModal(false)}>Close</button>
                </Modal.Footer>
            </Modal>

            <Notification toastMsg={toastMsg} toastShow={toastShow} isSuccess={isSuccess} Close={() => setToastOpen()} />
        </div>
    );
}

export default Journeycatalog;