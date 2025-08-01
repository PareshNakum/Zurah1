import React from "react";
import { Button, Modal } from "react-bootstrap";
import Image from "next/image";

const EmbossingPreview = ({ebossingPreviewModalBaseView,setEmbossingPreviewModalBaseView,setSelectedIndex, selectedIndex,setActiveImg,activeImg}) => {
    return (
        <Modal show={ebossingPreviewModalBaseView} onHide={() => { setEmbossingPreviewModalBaseView(false); setSelectedIndex(0); setActiveImg([]) }} className="EmbossingModal" size={"lg"} centered>
            <Modal.Header closeButton>
                <Modal.Title>Embossing Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid px-0">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            {/* Tab Navigation */}
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                {activeImg?.map((data, i) => (
                                    <li className="nav-item" role="presentation" key={i}>
                                        <a
                                            className={`nav-link ${i === selectedIndex ? 'active' : ''}`}
                                            id={`tab-${i}`}
                                            data-bs-toggle="tab"
                                            href={`#tab-content-${i}`}
                                            role="tab"
                                            aria-controls={`tab-content-${i}`}
                                            aria-selected={i === selectedIndex}
                                            onClick={() => setSelectedIndex(i)}
                                        >
                                            {data.type}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content d-flex justify-content-center" id="myTabContent">
                                {activeImg.map((data, i) => {
                                    let areas = data?.area;
                                    if (typeof areas === 'string') {
                                        try {
                                            areas = JSON.parse(areas);
                                        } catch (e) {
                                            // console.error("Error parsing area:", e);
                                        }
                                    }

                                    return (
                                        <div
                                            key={i}
                                            className={`tab-pane fade ${i === selectedIndex ? 'show active' : ''}`}
                                            id={`tab-content-${i}`}
                                            role="tabpanel"
                                            aria-labelledby={`tab-${i}`}
                                        >
                                            <div className="main-img">
                                                <div className="singleProduct-view">
                                                    {/* Image for the selected tab */}
                                                    <Image
                                                        src={data?.url}
                                                        className="img-fluid img-width d-block m-auto"
                                                        alt={`Image ${i}`}
                                                    />

                                                    {/* Display embossing image if activeImg has area */}
                                                    {areas?.width && areas?.height && (
                                                        <div
                                                            className="embossing-img"
                                                            id={`embossing-img-${i}`}
                                                            style={{
                                                                left: `${areas.left}%`,
                                                                top: `${areas.top}%`,
                                                                width: `${areas.width}%`,
                                                                height: `${areas.height}%`,
                                                            }}
                                                        >
                                                            {data?.embImage && (
                                                                <div
                                                                    className="resizable-img"
                                                                    id={`resizable-img-${i}`}
                                                                    style={{
                                                                        left: `${data.embImageArea.left}%`,
                                                                        top: `${data.embImageArea.top}%`,
                                                                        width: `${data.embImageArea.width}%`,
                                                                        height: `${data.embImageArea.height}%`,
                                                                    }}

                                                                >
                                                                    <Image
                                                                        src={data.embImage}
                                                                        className="img-fluid img-width d-block m-auto"
                                                                        alt={`Embossed Image ${i}`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setEmbossingPreviewModalBaseView(false); setActiveImg([]) }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EmbossingPreview