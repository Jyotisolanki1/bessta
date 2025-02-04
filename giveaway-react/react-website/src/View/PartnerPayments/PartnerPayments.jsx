import React, { useState, useEffect } from 'react';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BecomePartner from '../BecomePartner/BecomePartner';
import creditImage from '../../assets/images/backgrounds/credit-only.png';
import { REACT_API_URL, STRIPE_KEY } from '../../../config';

const PartnerPayment = () => {
  const stripePromise = loadStripe(STRIPE_KEY);
  const navigate = useNavigate();
  const location = useLocation();

  const PaymentComponent = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCardValid, setIsCardValid] = useState(false);
    const [isCardEmpty, setIsCardEmpty] = useState(true);
    //  console.log(location?.state?.data?.webPartner)
     useEffect(()=>{
      if(location?.state?.data?.webPartner === "true"){
        console.log("Partner is already registered")
        localStorage.setItem("paymentCheck",location?.state?.data?.webPartner)
      }
     },[location?.state?.data?.webPartner])
    const handlePayment = async () => {
      setIsSubmitting(true);
      try {
        console.log(location.state.clientSecret)
        const { paymentIntent, error } = await stripe.confirmCardPayment(location.state.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        });
        // console.log('location.state', location.state);
        if (error) {
          // console.log(error);
        } else {
          const data = {
            client_secret: location.state.clientSecret
          };
        
          if (location.state.isPayment === 'false' || location.state.isPartner === "true" && location.state.isPartnerPayment === "false") {
            const paymentstatus = await axios.post(`${REACT_API_URL}admin-partner-status`, data);
            if (paymentstatus.data.success) {
              localStorage.removeItem('paymentCheck');
              setIsSubmitting(false);
              navigate('/partner-success');
            }
          } else {
            const paymentstatus = await axios.post(`${REACT_API_URL}partner-status`, data);
            if (paymentstatus.data.success) {
              localStorage.removeItem('paymentCheck');
              setIsSubmitting(false);
              navigate('/partner-success');
            }
          }
        }
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    };

    // useEffect(() => {
    //   if (isSubmitting) {
    //     const handleBeforeUnload = (event) => {
    //       event.preventDefault();
    //       event.returnValue = ''; // This is required for Chrome
    //       alert("You're about to leave the page.");
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => {
    //       window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    //   }
    // }, [isSubmitting]);
    const handleCardElementChange = (event) => {
      console.log();
      setIsCardValid(event.complete && !event.error);
      setIsCardEmpty(event.empty);
    };

    return (
      <div className="partnerPayment1">
        <div className="partnerPayment2">
          <h1 style={{ fontWeight: 'bold', fontSize: '30px' }}> BESTTA Once Off Setup Fee $99 </h1>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              paddingTop: '15px',
              paddingBottom: '10px'
            }}
          >
            Enter Your Card Details Here
          </h2>

          <CardElement
            options={{
              iconStyle: 'solid',
              style: {
                base: {
                  backgroundColor: '#fff',
                  lineHeight: '50px',
                  borderRadius: '10px !important',
                  iconColor: '#c4f0ff',
                  color: '#000',
                  fontWeight: 500,
                  fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                  fontSize: '16px',
                  fontSmoothing: 'antialiased',
                  ':-webkit-autofill': {
                    color: 'red'
                  },
                  '::placeholder': {
                    color: '#000'
                  }
                },
                invalid: {
                  iconColor: '#ffc7ee',
                  color: '#ffc7ee'
                }
              }
            }}
            onChange={handleCardElementChange}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <button
              onClick={handlePayment}
              disabled={isSubmitting || !isCardValid || isCardEmpty}
              className='paymentButton'
              
            >
              {isSubmitting ? 'Paying...' : 'Make Payment'}
            </button>

            {/* <button
              style={{
                width: "48%",
                backgroundColor: "#000",
                border: "none",
                color: "#fff",
                padding: "13px",
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "20px",
                marginBottom: "10px",
                marginLeft: "20px",
                borderRadius: "13px",
              }}
              onClick={() => navigate("/")}
            >
              Back To Home
            </button> */}
          </div>
          <img src={creditImage} alt="credit-cards" style={{ marginTop: '23px' }} />
        </div>
        <div className='paymentWarning'>
          Note:- Please do not hit refresh or browser back button or close this window while payment is processing.
        </div>
      </div>
    );
  };

  // if (!location?.state?.clientSecret) {
  //   return <BecomePartner />;
  // }

  return (
    <div style={{ height: '107vh', display: 'flex', alignItems: 'center' }}>
      <Elements stripe={stripePromise} sx={{ padding: '10px' }}>
        {console.log()}
        <PaymentComponent />
      </Elements>
    </div>
  );
};

export default PartnerPayment;

// import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { CardElement } from "@stripe/react-stripe-js";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// import BecomePartner from "../BecomePartner/BecomePartner";

// import creditImage from "../../assets/images/backgrounds/credit-only.png";
// import { useEffect, useState } from "react";

// export default function PartnerPayment() {

//   const stripePromise = loadStripe(
//     "pk_test_51OJTHABOmjdVCHS9YrQdtToQ36DBQsRyq3qZt3rcKrfnADK0W56jFaH1RyevJ9Gmdgx0aZQGMy9Y9xUNC0T4IC7s00GnXZbMrH"
//   );

//   const navigate = useNavigate();

//   // const cartId = localStorage.getItem("cartid");

//   const location = useLocation();

//   const PaymentComponent = () => {
//     const stripe = useStripe();
//     const elements = useElements();

//     const handlePayment = () => {
//       //  plans for plans

//       // store
//       async function createPayment() {
//         try {
//           const { paymentIntent, error } = await stripe.confirmCardPayment(
//             location.state.clientSecret,
//             {
//               payment_method: {
//                 card: elements.getElement(CardElement),
//               },
//             }
//           );

//           if (error) {
//             // console.log(error);
//           } else {
//             const data = {
//               client_secret: location.state.clientSecret,
//             };
//             const paymentstatus = await axios.post(
//               "${REACT_API_URL}partner-status",
//               data
//             );

//             if (paymentstatus.data.success) {
//               navigate("/partner-success");
//             }
//           }
//         } catch (err) {}
//       }

//       createPayment()
//     };

//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           //   borderRadius: "15px",
//           //   marginLeft: "5rem",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             padding: "13px",
//             width: "40%",
//             margin: "0px auto",
//             backgroundColor: "orange",
//             height: "400px",
//             borderRadius: "10px",
//           }}
//         >

//             <h1 style = {{
//                 fontWeight:"bold",fontSize:"30px"
//             }}> BESTTA Once Off Setup Fee $ 99 </h1>
//           <h2
//             style={{
//               fontSize: "20px",
//               fontWeight: "bold",
//               paddingTop: "15px",
//               paddingBottom: "10px",
//             }}
//           >
//             Enter Your Card Details Here
//           </h2>

//           <CardElement
//             options={{
//               iconStyle: "solid",
//               style: {
//                 base: {
//                   backgroundColor: "#fff",
//                   lineHeight: "50px",
//                   borderRadius: "10px !important",
//                   iconColor: "#c4f0ff",
//                   color: "#000",
//                   fontWeight: 500,
//                   fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
//                   fontSize: "16px",
//                   fontSmoothing: "antialiased",
//                   ":-webkit-autofill": {
//                     color: "red",
//                   },
//                   "::placeholder": {
//                     color: "#000",
//                   },
//                 },
//                 invalid: {
//                   iconColor: "#ffc7ee",
//                   color: "#ffc7ee",
//                 },
//               },
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <button
//               onClick={() => handlePayment()}

//               style={{
//                 width: "48%",
//                 backgroundColor: "#000",
//                 border: "none",
//                 color: "#fff",
//                 padding: "13px",
//                 fontSize: "17px",
//                 fontWeight: 600,
//                 marginTop: "20px",
//                 marginBottom: "10px",
//                 // marginLeft:"20px"
//                 borderRadius: "13px",
//               }}
//             >
//               Make Payment
//             </button>
//             <button
//               style={{
//                 width: "48%",
//                 backgroundColor: "#000",
//                 border: "none",
//                 color: "#fff",
//                 padding: "13px",
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 marginTop: "20px",
//                 marginBottom: "10px",
//                 marginLeft: "20px",
//                 borderRadius: "13px",
//               }}
//               // onClick={handleHome}
//             >
//               Back To Home
//             </button>
//           </div>
//           <img
//             src={creditImage}
//             alt="credit-cards"
//             style={{ marginTop: "23px" }}
//           />
//           {/* <AddressElement options={{ mode: "shipping" }} /> */}
//         </div>
//       </div>
//     );
//   };

//   if(!location?.state?.clientSecret){
//     return <BecomePartner />
//   }

//   return (
//     <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
//       <Elements stripe={stripePromise} sx={{ padding: "10px" }}>
//         <PaymentComponent />
//       </Elements>
//     </div>
//   );
// }
