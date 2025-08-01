import React from "react";
import './noRecordFound.module.scss';
import Button from 'react-bootstrap/Button';
import NorecordImg from "../../Assets/Images/RecordNotfound.png"
import Link from "next/link";
import Image from "next/image";

const NoRecordFound = () => {
    return (
        <React.Fragment>
            <section id="noRecordFound">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center my-2">            
                                <div className="mb-3">
                                    <div className="mx-auto">
                                        <Image alt="" src={NorecordImg} className="img-fluid" />
                                    </div>
                                </div>
                                <div>
                                    <Link href={`/`}>
                                        <Button variant="" className="btn btn-back fs-18px">Back To Home Page</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

export default NoRecordFound