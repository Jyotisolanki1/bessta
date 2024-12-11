
/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Loader from "../../Common/Loader";
import React, { Suspense } from "react";
import Home from "../Home/Home";

const UnProtectedRoute = ({ element: Element }) => {
  const details = localStorage?.getItem("userToken");

  return !details ? (
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
    <Navigate to="/landing" />
  );
};

export default UnProtectedRoute;
