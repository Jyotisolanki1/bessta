import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import creditImage from '../../assets/images/backgrounds/credit-only.png';
import { useEffect, useState } from 'react';
import { STRIPE_KEY } from '../../../config';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { SubscriptionStatusApi, SubScriptionCheckoutApi } from '../../Slices/Subscription';
import { toast } from 'react-toastify';

export default function HandlePayment() {
  const stripePromise = loadStripe(STRIPE_KEY);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const planid = queryParams.get('planid');
  const drawid = queryParams.get('drawid');
  const { userToken } = useSelector((state) => state.loginAction);
  const PaymentComponent = () => {
    // // console.log("🚀 ~ userToken:", drawid);

    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCardEmpty, setIsCardEmpty] = useState(true); // State to track if card element is empty
    const [isCardValid, setIsCardValid] = useState(true); // State to track if card number is valid

    const handlePayment = () => {
      async function createPaymentForUpgrade(id) {
        setIsSubmitting(true);
        const data = {
          plan_id: planid
        };
        const data2 = {
          plan_id: planid,
          draw_id: drawid !== null ? drawid : ''
        };
        // if (!drawid) {
        //   delete data.draw_id;
        // }
        try {
          let res;
          let paymentToken = localStorage.getItem('PaymentUserToken') ? localStorage.getItem('PaymentUserToken') : userToken;
          if (drawid) {
            res = await dispatch(SubScriptionCheckoutApi(data2, paymentToken));
            console.log('res', res);
            if (res.success === false) {
              toast.error(res.message);
            }
          } else {
            res = await dispatch(SubScriptionCheckoutApi(data, paymentToken));

            if (res.success === false) {
              toast.error(res.message);
            }
          }
          const { paymentIntent, error } = await stripe.confirmCardPayment(res?.data?.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)
            }
          });
          if (error) {
            setIsSubmitting(false);
          } else {
            const datas = {
              client_secret: paymentIntent?.client_secret
            };
            const paymentStatus = await dispatch(SubscriptionStatusApi(datas, paymentToken));
            if (paymentStatus.success) {
              toast.success('Payment successful');
              if (localStorage.getItem('PaymentUserToken')) {
                localStorage.setItem('userToken', localStorage.getItem('PaymentUserToken'));
                localStorage.removeItem('PaymentUserToken');
              }
              localStorage.removeItem('userPaymentCheck');
              setIsSubmitting(false);
              navigate('/plan-success');
            } else {
              toast.error('Something went wrong');
            }
          }
        } catch (err) {
          // console.log(err);
          toast.error(err);
          setIsSubmitting(false);
        }
      }

      if (planid) {
        createPaymentForUpgrade(planid);
      }
    };

    // Function to handle card element change event
    const handleCardElementChange = (event) => {
      setIsCardEmpty(event.empty);
      setIsCardValid(event.complete && event.error === undefined);
    };

    return (
      <>
        <div className="partnerPayment1">
          <div className="partnerPayment2">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Billing Amount</h1>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                $ {location?.state?.CartObj?.totalPriceAfterDiscount || location?.state?.price}
              </h1>
            </div>

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
              onChange={handleCardElementChange} // Listen to changes in the CardElement
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <button onClick={handlePayment} disabled={isSubmitting || !isCardValid || isCardEmpty} className="paymentButton">
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
          <div className="paymentWarning justchangemargin">
            Note:- Please do not hit refresh or browser back button or close this window while payment is processing.
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ height: '107vh', display: 'flex', alignItems: 'center' }}>
      <Elements stripe={stripePromise}>
        <PaymentComponent />
      </Elements>
    </div>
  );
}
