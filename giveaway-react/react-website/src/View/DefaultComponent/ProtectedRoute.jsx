
/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Loader from "../../Common/Loader";
import React, { Suspense } from "react";
import Home from "../Home/Home";

const ProtectedRoute = ({ element: Element }) => {
  // console.log(Element)
  const details = localStorage?.getItem("userToken");
  // console.log(details,"...>")
  // console.log(details? "check tokem": "hhhhhhhh")
  return details ? (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <Element />
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
