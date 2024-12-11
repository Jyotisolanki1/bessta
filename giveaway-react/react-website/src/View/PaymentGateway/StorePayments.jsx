import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import creditImage from "../../assets/images/backgrounds/credit-only.png";
import { useEffect, useState } from "react";
import { REACT_API_URL, STRIPE_KEY } from "../../../config";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useSelector, useDispatch } from "react-redux";

// import {
//   SubscriptionStatusApi,
//   SubScriptionCheckoutApi,
// } from "../../Slices/Subscription";

export default function StorePayments() {
  const stripePromise = loadStripe(STRIPE_KEY);
  const navigate = useNavigate();
  const location = useLocation();
  const details = localStorage.getItem("userToken");
  const PaymentComponent = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    });
    const [disableStatus, setDisableStatus] = useState(true);
    const [isCardValid, setIsCardValid] = useState(false);
   

    useEffect(() => {
      const isAddressEmpty =
        Object.values(shippingDetails).some((val) => val.trim() === "") ||
        Object.values(shippingDetails).length < 4;
      setDisableStatus(isAddressEmpty || !isCardValid);
    }, [shippingDetails, isCardValid]);

    const handlePayment = async () => {
      setIsSubmitting(true);
      try {
        const details = localStorage.getItem("userToken");
        const config = {
          headers: {
            "Content-Type": "Application/Json",
            Authorization: `Bearer ${details}`,
          },
        };

        const cartId = localStorage.getItem("cartid");

        const datas = {
          cart_id: cartId,
          shippingAddress: shippingDetails,
        };

        const res = await axios.post(
          `${REACT_API_URL}place-order`,
          datas,
          config
        );

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          res?.data?.data?.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          }
        );

        if (error) {
          navigate("/failure");
        } else {
          // console.log("Payment Success");
          const details = localStorage.getItem("userToken");
          // console.log(details);
          const config = {
            headers: {
              "Content-Type": "Application/JSON",
              Authorization: `Bearer ${details}`,
            },
          };
          const data = {
            client_secret: paymentIntent.client_secret,
          };
          const paymentstatus = await axios.post(
            `${REACT_API_URL}payment-status`,
            data,
            config
          );

          if (paymentstatus.data.success) {
            setIsSubmitting(false);
            navigate("/success");
          } else {
            setIsSubmitting(false);
            navigate("/failure");
          }
        }
      } catch (err) {
        // console.log(err);
        setIsSubmitting(false);
      }
    };

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setShippingDetails({
        ...shippingDetails,
        [name]: value,
      });
    };

    const handleCardElementChange = (event) => {
      setIsCardValid(event.complete && !event.error);
    };


    useEffect(() => {
      if(isSubmitting){
        const handleBeforeUnload = (event) => {
          event.preventDefault();
          event.returnValue = ''; // This is required for Chrome
          alert("You're about to leave the page.");
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }      
    }, [isSubmitting]);
  
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "13px",
            width: "40%",
            margin: "0px auto",
            backgroundColor: "orange",
            minHeight: "400px",
            borderRadius: "10px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Billing Amount
            </h1>
            <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
              $ {location?.state?.totalPriceAfterDiscount}
            </h1>
          </div>

          {location?.state?.CartObj && (
            <div>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Enter Address Details
                </h1>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "5px",
                    outline: "none",
                    border: "none",
                    color: "grey",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                  onChange={handleOnChange}
                  value={shippingDetails.streetAddress}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  style={{
                    width: "33.3%",
                    padding: "13px",
                    borderRadius: "5px",
                    outline: "none",
                    border: "none",
                    color: "grey",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginRight: "10px",
                  }}
                  value={shippingDetails.city}
                  onChange={handleOnChange}
                />
                <input
                  type="text"
                  placeholder="State"
                  name="state"
                  style={{
                    width: "33.3%",
                    padding: "13px",
                    borderRadius: "5px",
                    outline: "none",
                    border: "none",
                    color: "grey",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginRight: "10px",
                  }}
                  value={shippingDetails.state}
                  onChange={handleOnChange}
                />
                <input
                  name="zipCode"
                  type="number"
                  placeholder="Zip Code"
                  style={{
                    width: "33.3%",
                    padding: "13px",
                    borderRadius: "5px",
                    outline: "none",
                    border: "none",
                    color: "grey",
                    fontSize: "13px",
                    fontWeight: 500,
                    marginRight: "10px",
                  }}
                  value={shippingDetails.zipCode}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          )}

          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              paddingTop: "15px",
              paddingBottom: "10px",
            }}
          >
            Enter Your Card Details Here
          </h2>

          <CardElement
            options={{
              iconStyle: "solid",
              style: {
                base: {
                  backgroundColor: "#fff",
                  lineHeight: "50px",
                  borderRadius: "10px !important",
                  iconColor: "#c4f0ff",
                  color: "#000",
                  fontWeight: 500,
                  fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                  fontSize: "16px",
                  fontSmoothing: "antialiased",
                  ":-webkit-autofill": {
                    color: "red",
                  },
                  "::placeholder": {
                    color: "#000",
                  },
                },
                invalid: {
                  iconColor: "#ffc7ee",
                  color: "#ffc7ee",
                },
              },
            }}
            onChange={handleCardElementChange}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <button
              onClick={handlePayment}
              disabled={disableStatus}
              style={{
                width: "48%",
                backgroundColor: disableStatus ? "grey" : "#000",
                border: "none",
                color: "#fff",
                padding: "13px",
                fontSize: "17px",
                fontWeight: 600,
                marginTop: "90px",
                marginBottom: "10px",
                borderRadius: "13px",
                margin:"auto"              }}
            >
              {isSubmitting ? "Paying..." : "Make Payment"}
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
              onClick={details ? "/landing" : "/"}
            >
              Back To Home
            </button> */}
          </div>
          <img
            src={creditImage}
            alt="credit-cards"
            style={{ marginTop: "23px" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Elements stripe={stripePromise} sx={{ padding: "10px" }}>
        <PaymentComponent />
      </Elements>
    </div>
  );
}

//
// import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { CardElement } from "@stripe/react-stripe-js";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// import creditImage from "../../assets/images/backgrounds/credit-only.png";
// import { useEffect, useState } from "react";
// import { STRIPE_KEY } from "../../../config";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useSelector, useDispatch } from "react-redux";

// import {
//   SubscriptionStatusApi,
//   SubScriptionCheckoutApi,
// } from "../../Slices/Subscription";

// export default function StorePayments() {
//   const stripePromise = loadStripe(STRIPE_KEY);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const cartId = localStorage.getItem("cartid");

//   const location = useLocation();

//   const PaymentComponent = () => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [shippingDetails, setShippingDetails] = useState({
//       streetAddress: "",
//       city: "",
//       state: "",
//       zipCode: "",
//     });

//     const [disableStatus, setDisableStatus] = useState(true);

//     useEffect(() => {
//       if (
//         shippingDetails.streetAddress.trim() === "" ||
//         shippingDetails.city.trim() === "" ||
//         shippingDetails.state.trim() === "" ||
//         shippingDetails.zipCode.trim() === ""
//       ) {
//         setDisableStatus(true);
//       } else {
//         setDisableStatus(false);
//       }
//     }, [
//       shippingDetails.streetAddress,
//       shippingDetails.city,
//       shippingDetails.state,
//       shippingDetails.zipCode,
//     ]);

//     const handlePayment = () => {
//       const details = localStorage.getItem("userToken");

//       // store
//       async function createPayment() {
//         setIsSubmitting(true);
//         try {
//           const config = {
//             headers: {
//               "Content-Type": "Application/Json",
//               Authorization: `Bearer ${details}`,
//             },
//           };

//           const cartId = localStorage.getItem("cartid");

//           const datas = {
//             cart_id: cartId,
//             shippingAddress: shippingDetails,
//           };

//           const res = await axios.post(
//             "${REACT_API_URL}place-order",
//             datas,
//             config
//           );
//           // console.log(res);

//           const { paymentIntent, error } = await stripe.confirmCardPayment(
//             res?.data?.data?.client_secret,
//             {
//               payment_method: {
//                 card: elements.getElement(CardElement),
//               },
//             }
//           );

//           if (error) {
//             // console.log(error)
//             navigate("/failure");
//           } else {
//             // console.log("Payment Success");
//             const details = localStorage.getItem("userToken");
//             // console.log(details);
//             const config = {
//               headers: {
//                 "Content-Type": "Application/JSON",
//                 Authorization: `Bearer ${details}`,
//               },
//             };
//             const data = {
//               client_secret: paymentIntent.client_secret,
//             };
//             const paymentstatus = await axios.post(
//               "${REACT_API_URL}payment-status",
//               data,
//               config
//             );

//             // console.log(paymentstatus);

//             if (paymentstatus.data.success) {
//               setIsSubmitting(false);
//               navigate("/success");
//             } else {
//               setIsSubmitting(false);
//               navigate("/failure");
//             }
//           }
//         } catch (err) {
//           setIsSubmitting(false);
//         }
//       }

//       createPayment();
//     };

//     // console.log(disableStatus, "jsjjssj");

//     const handleOnChnage = (e) => {
//       const { name, value } = e.target;

//       setShippingDetails({
//         ...shippingDetails,
//         [name]: value,
//       });
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
//             minHeight: "400px",
//             borderRadius: "10px",
//             boxShadow:
//               "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <h1
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "bold",
//               }}
//             >
//               Billing Amount
//             </h1>
//             <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
//               {location?.state?.CartObj?.totalPriceAfterDiscount ||
//                 location?.state?.price}
//               $
//             </h1>
//           </div>

//           {location?.state?.CartObj && (
//             <div>
//               <div>
//                 <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
//                   Enter Address Details
//                 </h1>
//                 <input
//                   type="text"
//                   placeholder="Street Address"
//                   name="streetAddress"
//                   style={{
//                     width: "100%",
//                     padding: "13px",
//                     borderRadius: "5px",
//                     outline: "none",
//                     border: "none",
//                     color: "grey",
//                     fontSize: "13px",
//                     fontWeight: 500,
//                   }}
//                   onChange={handleOnChnage}
//                   value={shippingDetails.streetAddress}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-evenly",
//                   width: "100%",
//                   marginTop: "10px",
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="City"
//                   name="city"
//                   style={{
//                     width: "33.3%",
//                     padding: "13px",
//                     borderRadius: "5px",
//                     outline: "none",
//                     border: "none",
//                     color: "grey",
//                     fontSize: "13px",
//                     fontWeight: 500,
//                     marginRight: "10px",
//                   }}
//                   value={shippingDetails.city}
//                   onChange={handleOnChnage}
//                 />
//                 <input
//                   type="text"
//                   placeholder="State"
//                   name="state"
//                   style={{
//                     width: "33.3%",
//                     padding: "13px",
//                     borderRadius: "5px",
//                     outline: "none",
//                     border: "none",
//                     color: "grey",
//                     fontSize: "13px",
//                     fontWeight: 500,
//                     marginRight: "10px",
//                   }}
//                   value={shippingDetails.state}
//                   onChange={handleOnChnage}
//                 />
//                 <input
//                   name="zipCode"
//                   type="number"
//                   placeholder="Zip Code"
//                   style={{
//                     width: "33.3%",
//                     padding: "13px",
//                     borderRadius: "5px",
//                     outline: "none",
//                     border: "none",
//                     color: "grey",
//                     fontSize: "13px",
//                     fontWeight: 500,
//                     marginRight: "10px",
//                   }}
//                   value={shippingDetails.zipCode}
//                   onChange={handleOnChnage}
//                 />
//               </div>
//             </div>
//           )}

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
//               disabled={disableStatus}
//               style={{
//                 width: "48%",
//                 backgroundColor:disableStatus? "grey": "#000",
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
//               {isSubmitting ? "Paying..." : "Make Payment"}
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

//   return (
//     <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
//       <Elements stripe={stripePromise} sx={{ padding: "10px" }}>
//         <PaymentComponent />
//       </Elements>
//     </div>
//   );
// }
