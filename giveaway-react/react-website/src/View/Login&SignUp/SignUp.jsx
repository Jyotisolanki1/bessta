/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
// import VerifyUser from "./OtpModel";
import { UserSignUpApi } from '../../Slices/SignUpSlice';
import { useDispatch, useSelector } from 'react-redux';
import VerifyUser from './OtpModel';
import SignOtpModel from './SignOtpModel';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleKeyBlock } from '../../Helper/CountryData';
import Cards from '../../Common/Cards';
import { SetOtpToken } from '../../Slices/LoginSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subsciptionPlan } = useSelector((state) => state.commonAction);
  const [newToken, setNewToken] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .required('First Name is required'),
    lastname: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().min(5, 'Enter the Valid Phone Number').max(15, 'Enter the Valid Phone Number').required('Phone Number is required'),
    dob: Yup.date().required('Date of Birth is required'),
    billing_address: Yup.string()
      .required('Billing Address is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      ),
    postcode: Yup.string().min(4, 'Enter the Valid Post code').max(6, 'Enter the Valid Post code').required('Post Code is required'),
    password: Yup.string()
      .required('Password is Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      )
      .min(8, 'Password must be at least 8 characters')
      .max(15, 'Password must be less than 15 characters'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      )
      .required('Confirm Password is required'),
    termsAndConditions: Yup.boolean()
      .oneOf([true], 'You must agree to the Terms and Conditions')
      .required('You must agree to the Terms and Conditions'),
    ageConfirmation: Yup.boolean()
      .oneOf([true], 'You must confirm that you are 18 years old or older')
      .required('You must confirm that you are 18 years old or older')
  });

  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    billing_address: '',
    postcode: '',
    password: '',
    confirm_password: '',
    termsAndConditions: false, // Initial value for terms and conditions checkbox
    ageConfirmation: false // Initial value for age confirmation checkbox
  };

  const onSubmit = async (values, { resetForm }) => {
    // Handle form submission logic here
    const newObj = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: String(values.phone),
      dob: values.dob,
      billing_address: values.billing_address,
      postcode: String(values.postcode),
      password: values.password
      // confirm_password: values.confirm_password,
    };
    if (subsciptionPlan?._id !== '' && subsciptionPlan?._id) {
      await dispatch(UserSignUpApi(newObj)).then((res) => {
        if (res.success === true) {
          localStorage.setItem('signupoptvarify', 0);
          setModal(true);
          setNewToken(res?.data?.accessToken);
          setOtp(res?.data.otp);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
    } else {
      alert('Please Select Plan');
    }
    // setModal(true);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  let originalString = subsciptionPlan?.category?.name;
  let replacedString = originalString?.replace('Membership', 'Member');
  return (
    <>
      <section className="login-page" style={{ padding: '0px' }}>
        <div
          className="container"
          style={{
            // paddingTop: "50px",
            paddingBottom: '50px',
            marginTop: '110px'
          }}
        >
          <div className="login-container signupcontainerform width-600">
            <div className="row">
              <div className="col-lg-12 wow fadeInUp animated" data-wow-delay="300ms">
                
                <div className="signup-form-container">
                  <div className="second-sec text-center pt-5">
                    <h2 className="newheadinga">Become an BESTTA {replacedString}</h2>
                    <h4 className='sub-heading newsubheadingstyling'>Gain Your Name In EVERY Draw Automatically </h4>
                  </div>
                  <ul className="tabs newtabsstyling">
                    <li className="tab-link newtab-linkstyling current" data-tab="tab-1">
                      <strong>DETAILS</strong>
                      <br />
                      Where To Contact You
                    </li>
                  </ul>
                  
                  {subsciptionPlan?.name ? (
                    <div className="section-title mynewsectiontitlestyle mb-5">
                      <h5 style={{ fontSize: '30px', textAlign: 'center' }}>
                        Selected Plan: &nbsp;
                        <span className="section-plan">{subsciptionPlan?.name}</span>
                      </h5>
                      <h6 className="section-plan__tagline">
                        Entries: {subsciptionPlan?.entries} <br />
                        Price:${subsciptionPlan?.price}
                      </h6>
                    </div>
                  ) : (
                    ''
                  )}
                  <form className="partner-form pt-2 tab-content current" onSubmit={formik.handleSubmit}>
                    <div className="input-container">
                      <label className="form-label">
                        First Name<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        className='signupform'
                        type="text"
                        name="firstname"
                        aria-label="First Name"
                        placeholder="First Name..."
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstname}
                        style={{
                          borderColor: formik.touched.firstname && formik.errors.firstname ? 'red' : ''
                        }}
                        maxLength={35}
                      />
                      {formik.touched.firstname && formik.errors.firstname && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.firstname}
                        </label>
                      )}
                    </div>
                    <div className="input-container">
                      <label className="form-label">
                        Last Name<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="text"
                        name="lastname"
                        aria-label="Last Name"
                        placeholder="Last Name..."
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastname}
                        style={{
                          borderColor: formik.touched.lastname && formik.errors.lastname ? 'red' : ''
                        }}
                        maxLength={35}
                      />
                      {formik.touched.lastname && formik.errors.lastname && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.lastname}
                        </label>
                      )}
                    </div>{' '}
                    <div className="input-container">
                      <label className="form-label">
                        Email<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="text"
                        name="email"
                        aria-label="Email Address"
                        placeholder="Email Address..."
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        style={{
                          borderColor: formik.touched.email && formik.errors.email ? 'red' : ''
                        }}
                      />
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
                    <div className="input-container">
                      <label className="form-label">
                        Phone Number<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="number"
                        name="phone"
                        aria-label="Phone Number"
                        placeholder="Phone Number..."
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        onKeyDown={handleKeyBlock}
                        style={{
                          borderColor: formik.touched.phone && formik.errors.phone ? 'red' : ''
                        }}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.phone}
                        </label>
                      )}
                    </div>
                    <div className="input-container">
                      <label className="form-label">
                        DOB<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="date"
                        name="dob"
                        aria-label="DOB"
                        placeholder="Date Of Birth"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // This sets the max date to 18 years ago
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.dob}
                        style={{
                          borderColor: formik.touched.dob && formik.errors.dob ? 'red' : ''
                        }}
                      />

                      {formik.touched.dob && formik.errors.dob && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.dob}
                        </label>
                      )}
                    </div>
                    <div className="input-container">
                      <label className="form-label">
                        Billing Address<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="test"
                        name="billing_address"
                        aria-label="Billing Address"
                        placeholder="Billing Address"
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.billing_address}
                        style={{
                          borderColor: formik.touched.billing_address && formik.errors.billing_address ? 'red' : ''
                        }}
                        maxLength={50}
                      />
                      {formik.touched.billing_address && formik.errors.billing_address && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.billing_address}
                        </label>
                      )}
                    </div>
                    <div className="input-container">
                      <label className="form-label">
                        Post Code<span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                      className='signupform'
                        type="number"
                        name="postcode"
                        aria-label="Post Code"
                        placeholder="Post Code"
                        required=""
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onKeyDown={handleKeyBlock}
                        value={formik.values.postcode}
                        style={{
                          borderColor: formik.touched.postcode && formik.errors.postcode ? 'red' : ''
                        }}
                      />
                      {formik.touched.postcode && formik.errors.postcode && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.postcode}
                        </label>
                      )}
                    </div>
                    <div className="input-container">
                      <label className="form-label">
                        Password<span style={{ color: 'red' }}>*</span>
                      </label>
                      <div
                      className='signupformpassword'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '2px solid #b7b7b79e',
                          borderRadius: '0.3rem'
                        }}
                      >
                        <input
                        className='signupformwp'
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Password..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          style={{
                            outline: 'none !important',
                            // border: "2px solid #fff",
                            // flex: 1,
                            borderColor: formik.touched.password && formik.errors.password ? 'red' : ''
                          }}
                        />
                        <i
                          className={`fa-solid fa-eye${showPassword ? '' : '-slash'}  eyeiconclass`}
                          onClick={handleTogglePassword}
                          style={{
                            cursor: 'pointer',
                            margin: '0 10px',
                            fontSize: '20px',
                            borderColor: formik.touched.password && formik.errors.password ? 'red' : ''
                          }}
                        ></i>
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
                    <div className="input-container">
                      <label className="form-label">
                        Confirm Password<span style={{ color: 'red' }}>*</span>
                      </label>
                      <div
                      className='signupformpassword'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '2px solid #b7b7b79e',
                          borderRadius: '0.3rem'
                        }}
                      >
                        <input
                        className='signupformwp'
                          type={showPassword ? 'text' : 'password'}
                          name="confirm_password"
                          aria-label="Confirm Password"
                          placeholder="Confirm Password..."
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirm_password}
                          style={{
                            outline: 'none !important',
                            // border: "2px solid #fff",
                            // flex: 1,
                            borderColor: formik.touched.confirm_password && formik.errors.confirm_password ? 'red' : ''
                          }}
                        />
                        <i
                          className={`fa-solid fa-eye${showPassword ? '' : '-slash'} eyeiconclass`}
                          onClick={handleTogglePassword}
                          style={{
                            cursor: 'pointer',
                            margin: '0 10px',
                            fontSize: '20px',
                            borderColor: formik.touched.confirm_password && formik.errors.confirm_password ? 'red' : ''
                          }}
                        ></i>
                      </div>
                      {formik.touched.confirm_password && formik.errors.confirm_password && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.confirm_password}
                        </label>
                      )}
                    </div>
                    <div className="my-1" style={{ display: 'flex' }}>
                      <input
                        type="checkbox"
                        id="termsAndConditions"
                        name="termsAndConditions"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.termsAndConditions}
                        style={{ width: '10%' }}
                      />
                      <label className='signupcheckbox'>I agree to the Terms and Conditions</label>
                      <br />
                    </div>
                    {formik.touched.termsAndConditions && formik.errors.termsAndConditions && (
                      <label
                        style={{
                          color: 'red',
                          fontFamily: 'cursive',
                          fontSize: '13px'
                        }}
                      >
                        {formik.errors.termsAndConditions}
                      </label>
                    )}
                    <div className="my-1" style={{ display: 'flex' }}>
                      <input
                        type="checkbox"
                        id="ageConfirmation"
                        name="ageConfirmation"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.ageConfirmation}
                        style={{ width: '10%' }}
                      />
                      <label htmlFor="ageConfirmation" className='signupcheckbox'>I confirm that I am 18 years old or older</label>
                      <br />
                    </div>
                    {formik.touched.ageConfirmation && formik.errors.ageConfirmation && (
                      <label
                        style={{
                          color: 'red',
                          fontFamily: 'cursive',
                          fontSize: '13px'
                        }}
                      >
                        {formik.errors.ageConfirmation}
                      </label>
                    )}
                    {/* <button
                      type="submit"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      Sign Me Up
                    </button> */}
                    <button
                    className='signupbuttonbysagar'
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
                          Sign Up
                          <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                    <p className="terms-of-service text-center">100% GUARANTEED SECURE &amp; SAFE CHECKOUT</p>
                  </form>
                  <p style={{ textAlign: 'center' }}>
                    Have an Account ?{' '}
                    <a style={{ color: '#f28500' }} href="/login">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SignOtpModel isOpen={modal} toggle={toggle} newToken={newToken} type={1} otp={otp} />
    </>
  );
};

export default SignUp;
