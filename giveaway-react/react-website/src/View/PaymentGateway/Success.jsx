import React, { useEffect } from "react";
// import successlogo from '../../assets/teenyicons_tick-circle-solid.svg'
// import { useLocation } from 'react-router-dom';
// import { Link } from '@mui/material';
import { useNavigate } from "react-router-dom";


const successPageStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#e6f7ff",
};

const messageStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "20px",
};



function PaymentSuccess() {
  const navigate = useNavigate()
  useEffect(() => {
      setTimeout(() => {
          navigate("/landing");
      },1500)
  },[])

  return (
    <div style={successPageStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <img src = {successlogo} alt = "Success" /> */}
        <h1 style={messageStyle}>Payment Successful</h1>
        <a href="/landing">Go Home</a>
      </div>
    </div>
  );
}

export default PaymentSuccess;
