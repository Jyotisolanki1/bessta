import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import creditImage from '../../assets/images/backgrounds/credit-only.png';
import { STRIPE_KEY } from '../../../config';
import { SubscriptionStatusApi, SubScriptionCheckoutApi } from '../../Slices/Subscription';

const stripePromise = loadStripe(STRIPE_KEY);

export default function HandlePayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const planid = queryParams.get('planid');
  const drawid = queryParams.get('drawid');
  const { userToken } = useSelector((state) => state.loginAction);

  const PaymentComponent = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCardEmpty, setIsCardEmpty] = useState(true);
    const [isCardValid, setIsCardValid] = useState(true);
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState(null);

    // Handle custom postal code input change
    const handlePostalCodeChange = (e) => {
      const value = e.target.value;
      if (/^\d{0,4}$/.test(value)) {
        setPostalCode(value);
        setPostalCodeError(value.length !== 4 ? 'Postal code must be 4 digits' : null);
      } else {
        setPostalCodeError('Postal code must be 4 digits');
      }
    };

    const handlePayment = async () => {
      if (!planid || postalCodeError || postalCode.length !== 4) return;

      setIsSubmitting(true);
      const data = { plan_id: planid };
      const data2 = { plan_id: planid, draw_id: drawid || '' };

      try {
        const paymentToken = localStorage.getItem('PaymentUserToken') || userToken;
        const res = drawid
          ? await dispatch(SubScriptionCheckoutApi(data2, paymentToken))
          : await dispatch(SubScriptionCheckoutApi(data, paymentToken));

        if (res.success === false) {
          toast.error(res.message);
          setIsSubmitting(false);
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(res.data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: { address: { postal_code: postalCode } }
          }
        });

        if (error) {
          setIsSubmitting(false);
          toast.error(error.message);
        } else {
          const datas = { client_secret: paymentIntent?.client_secret };
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
        toast.error('Payment failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    const handleCardElementChange = (event) => {
      setIsCardEmpty(event.empty);
      setIsCardValid(event.complete && !event.error);
    };

    return (
      <div className="paymentContainer">
        <div className="paymentDetails">
          <div className="billingInfo">
            <h3>Billing Amount</h3>
            <h3>$ {location?.state?.CartObj?.totalPriceAfterDiscount || location?.state?.price}</h3>
          </div>
          <h2>Enter Your Card Details</h2>

          <CardNumberElement
            options={{ style: { base: { fontSize: '16px', color: '#000', lineHeight: '50px', padding: '10px', fontFamily: 'Roboto' } } }}
            onChange={handleCardElementChange}
            className="cardInput"
          />
          <CardExpiryElement
            options={{ style: { base: { fontSize: '16px', color: '#000', lineHeight: '50px', padding: '10px', fontFamily: 'Roboto' } } }}
            className="cardInput"
          />
          <CardCvcElement
            options={{ style: { base: { fontSize: '16px', color: '#000', lineHeight: '50px', padding: '10px', fontFamily: 'Roboto' } } }}
            className="cardInput"
          />

          {/* Custom Postal Code Field */}
          <input
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            placeholder="Postal Code"
            maxLength="4"
            className="postalCodeInput"
            style={{ paddingTop: '15px', paddingBottom: '15px' }}
          />
          {postalCodeError && <div className="errorText">{postalCodeError}</div>}

          <div className="buttonContainer">
            <button
              onClick={handlePayment}
              disabled={isSubmitting || !isCardValid || isCardEmpty || postalCodeError}
              className="paymentButton"
            >
              {isSubmitting ? 'Processing...' : 'Make Payment'}
            </button>
          </div>

          <img src={creditImage} alt="credit-cards" className="creditImage" />
        </div>
        <div className="paymentWarning">Note: Do not refresh or close this window while payment is processing.</div>
      </div>
    );
  };

  return (
    <div className="paymentWrapper">
      <Elements stripe={stripePromise}>
        <PaymentComponent />
      </Elements>
    </div>
  );
}
