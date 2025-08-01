"use client"; 

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const selector = useSelector((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const isLoggedIn = selector?.loginData && Object.keys(selector.loginData).length > 0;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || loading) return null;

  return children;
};

export default ProtectedRoute;
