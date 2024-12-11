// import React, { useState } from "react";
import "./styles.css";
import SignInForm from "./SignIn";


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../../slices/LoginSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [type, setType] = useState("signIn");



  


  // const handleOnClick = async (text) => {
  //   if (text !== type) {
  //     setType(text);
  //     return;
  //   }

  //   //     const response = await dispatch(fetchLogin(userdetails))
   
  //   // if(response.payload.success){
  //   //     localStorage.setItem("adminToken", response?.payload?.data?.token?.accessToken);
  //   //      navigate("/bestta-admin/");
  //   // }

  // };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <h2>Bestta Admin</h2>
      <div className={containerClass} id="container">
        {/* <SignUpForm /> */}
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
          
            <div className="overlay-panel overlay-right">
              <h1>Hi, Aro!</h1>
              <p>Welcome Back! to Admin</p>
              {/* <button
                className="ghost "
                id="signUp"
                // onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
