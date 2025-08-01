"use client"; // if using app directory in Next 13+

import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthRoute = ({ children }) => {
  const selector = useSelector((state) => state);
  const router = useRouter();

  const isLoggedIn = selector?.loginData && Object.keys(selector.loginData).length > 0;

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/"); 
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null; 

  return children;
};

export default AuthRoute;
