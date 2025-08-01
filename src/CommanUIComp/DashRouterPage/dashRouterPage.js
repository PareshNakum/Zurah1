import React, { useEffect } from "react"
import { useRouter } from "next/router";
const DashRouterPage = () => {
    const navigate = useRouter()
    useEffect(() => {
        const storeUrl = typeof window !== "undefined" && sessionStorage.getItem("storeUrl") !== null ? sessionStorage.getItem("storeUrl") : "/";
        navigate.push(storeUrl)
    }, [navigate]);
    return (<React.Fragment></React.Fragment>)
}
export default DashRouterPage;