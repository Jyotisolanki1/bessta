/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { UserLoginApi } from '../../Slices/LoginSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import SignOtpModel from './SignOtpModel';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { tabClasses } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [newToken, setNewToken] = useState({});
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // console.log("rememberMe",rememberMe);

  const toggle = () => setModal(!modal);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const rememberedEmail = localStorage.getItem('userEmail');
    const rememberedPassword = localStorage.getItem('password');
    if (rememberedEmail) {
      formik.setFieldValue('email', rememberedEmail);
      formik.setFieldValue('password', rememberedPassword);
      setRememberMe(true);
    }
    if (token) {
      navigate('/landing');
    }
  }, [navigate]);

  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true; // Set to true after first render

      const status = localStorage.getItem('userStatus');
      if (status === 'blocked') {
        toast.error('Your account is deactivated by admin, please contact admin.');
        localStorage.removeItem('userStatus');
      }
    }

    return () => {
      console.log('Login component unmounted');
    };
  }, []);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const onSubmit = async (values) => {
    const newObj = {
      email: values.email,
      password: values.password
    };

    await dispatch(UserLoginApi(newObj)).then((res) => {
      localStorage.removeItem('signupoptvarify');
      if (res.success === true && res?.data?.isStatus === 'pending') {
        toast.success(res.message);
        setModal(true);
        setNewToken(res?.data?.accessToken);
        setOtp(res?.data.otp);
        // localStorage.setItem('userToken', res?.data?.accessToken);
      } else if (res.success === true && res?.data?.isStatus === 'active') {
        if (res?.data?.isPayment === 'false') {
          navigate('/partner-payments', { state: res.data });
          console.log("uiyiuy")
          localStorage.setItem('paymentCheck', JSON.stringify(res?.data));
          localStorage.setItem('userToken', res?.data?.accessToken);
          localStorage.removeItem('userStatus');
          return false;
        }
        console.log(res?.data)
        if (res?.data?.isPartnerPayment === 'false' && res?.data?.isPartner === "true") {
          navigate('/partner-payments', { state: res.data });
          localStorage.setItem('paymentCheck', JSON.stringify(res?.data));
          localStorage.setItem('userToken', res?.data?.accessToken);
          localStorage.removeItem('userStatus');
          return false;
        }
        if (rememberMe) {
          localStorage.setItem('userEmail', values.email);
          localStorage.setItem('password', values.password);
        } else {
          localStorage.removeItem('userEmail'); // Clear stored email if not remembered
          localStorage.removeItem('password'); // Clear stored password if not remembered
          sessionStorage.setItem('userToken', res?.data?.accessToken);
          sessionStorage.setItem('userEmail', values.email);
        }
        localStorage.setItem('userToken', res?.data?.accessToken);
        localStorage.removeItem('userStatus');

        // console.log('res?.data ----- ', res?.data?.isSubcription);
        if (res?.data?.isSubcription == 'false') {
          localStorage.setItem('userPaymentCheck', true);
          navigate('/plans');
          return false;
        }
        setTimeout(() => {
          navigate('/landing');
        }, 1500);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/landing');
    }
  }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowPassword((prev) => !prev);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="login-new-section" >
      <div className="container">
        <div className="row">
          {/* Left Blank Side */}
          <div className="col-lg-6" />
          {/* Right Side Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center right-side" style={{flexWrap:"wrap !important"}}>
            <div className="form-2-wrapper" id="loginForm">
              <div className="logo text-center mb-4 login">
                <h2>Welcome to BESTTA!</h2>
                <h3 className="text-center mb-4 login">Australia's No. 1 Investor's Reward Club</h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4 form-box">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: '2px solid #fff',
                      backgroundColor: 'transparent',
                      borderRadius: '30px'
                    }}
                  >
                    <input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      style={{
                        borderColor: formik.touched.email && formik.errors.email ? 'red' : '',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '20px'
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <label
                      style={{
                        color: 'red',
                        fontFamily: 'cursive',
                        fontSize: '13px'
                      }}
                    >
                      {formik.errors.email}
                    </label>
                  )}
                </div>
                <div className="mb-3">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #fff',
                      borderRadius: '27px'
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter Your Password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        padding: '10px',
                        color: '#fff',
                        flex: 1,
                        borderColor: formik.touched.password && formik.errors.password ? 'red' : ''
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        border: 0,
                        background: 'transparent',
                        marginRight: '15px'
                      }}
                      onKeyPress={handleKeyPress}
                    >
                      <i
                        className={`fa-solid fa-eye${!showPassword ? '-slash' : ''}`}
                        style={{ color: '#fff', marginRight: '0px' }}
                        onClick={handleTogglePassword}
                      ></i>
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <label
                      style={{
                        color: 'red',
                        fontFamily: 'cursive',
                        fontSize: '13px'
                      }}
                    >
                      {formik.errors.password}
                    </label>
                  )}
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                </div>
                <div className="main-slider-two__btn transform-none justify-content-center">
                  <button
                    disabled={formik.isSubmitting}
                    style={{
                      backgroundColor: '#F28500',
                      padding: '10px 25px',
                      borderRadius: '30px'
                    }}
                    type="submit"
                  >
                    {formik.isSubmitting ? (
                      <>
                        Log In
                        <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                      </>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </div>
                <h5 className="text-center forgot-text mt-3 ">
                  <Link to="/sendotp">Forgot your password?</Link>
                </h5>
              </form>
              <p className="text-center register-test mt-3">
                Don't have an account? &nbsp;
                <Link to="/plans" className="text-decoration-none">
                  Sign Up
                </Link>
              </p>
              <div className="login__question text-center mt-3">
                If you have any questions, contact us at&nbsp;
                <Link className="login__email" to="mailto:support@bestta.com.au">
                  support@bestta.com.au&nbsp;
                </Link>
                or call at&nbsp;
                <Link className="login__phone" to="tel:(+61 7) 3373 9888">
                  (+61 7) 3373 9888&nbsp;
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <SignOtpModel isOpen={modal} toggle={toggle} newToken={newToken} type={2} otp={otp} />
    </div>
  );
};

export default Login;
