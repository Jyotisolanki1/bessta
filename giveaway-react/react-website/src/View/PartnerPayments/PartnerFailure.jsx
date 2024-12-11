import React from "react";
// import failure from '../../assets/failureImg.png'

const failurePageStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#ffcccc",
};

const messageStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "20px",
  color: "red",
};

function PartnerFailure() {
  return (
    <div style={failurePageStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <img src = {failure} height = '100px' width = '100px' alt = '' /> */}
        <h1 style={messageStyle}>Payment Failed</h1>

        <a href="/landing">Retry Payment</a>
      </div>
    </div>
  );
}

export default PartnerFailure;
