import React from "react";
import './empty404.module.scss';
import Button from 'react-bootstrap/Button';
import { useEffect } from "react"
import { useRouter } from "next/router";
import Link from "next/link";

const Empty404 = () => {
    const navigate = useRouter()
    useEffect(() => {
        if (window.location.href.includes('Assets')) {
            navigate.push(window.location.href.split('/Assets/Js/')[1])
        }
    }, [navigate])
    return (
        <React.Fragment>
            <section id="Empty404">
                <div className="empty404-page">
                    <div className="empty404-page-title">
                        <h1>404</h1>
                    </div>
                    <div className="mb-4">
                        <p className="fs-20px mb-3">oops! page not found</p>
                        <p className="fs-20px">Perhaps you can try to refresh the page, sometimes it works</p>
                    </div>
                    <div>
                        <Link href={`/`}>
                            <Button variant="" className="btn btn-back fs-18px">Back To Home Page</Button>
                        </Link>
                    </div>
                </div> 
            </section>
        </React.Fragment>
    )
}

export default Empty404