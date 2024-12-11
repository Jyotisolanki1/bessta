import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { postApi } from '../apiCalls';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';

const SendOtp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');

  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required')
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!user.email) {
  //     return alert("Email is Required");
  //   }

  //   try {
  //     const res = await postApi("forget-password", user, {});

  //     if (res.data.success) {
  //       localStorage.setItem("forget_token", JSON.stringify(res.data.data));
  //       navigate("/submitotp");
  //     }
  //   } catch (err) {
  //     // console.log(err, "eror");
  //   }
  // };

  const onSubmit = async (values) => {
    // Handle form submission logic here
    const newObj = {
      email: values.email
    };
    // setModal(true);
    const res = await postApi('forget-password', newObj, {});

    if (res.data.success) {
      localStorage.setItem('forgetOptCheck',true);
      localStorage.setItem('forget_token', JSON.stringify(res.data.data));
      localStorage.setItem('forgetOptCount',0);
      toast.success(res.data.message);
      navigate('/submitotp');
    } else {
      toast.error(res.data.message);
    }
  };

  // const handleOnChange = (e) => {
  //   setUser({ email: e.target.value });
  // };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  // // console.log('🚀 ~ SendOtp ~ formik:', formik.errors);

  return (
    <div className="login-forgetPassword-section" style={{ marginTop: '0px', height: '100vh' }}>
      <div className="container">
        <div className="row">
          {/* Left Blank Side */}
          <div className="col-lg-6" />
          {/* Right Side Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center right-side">
            <div className="form-2-wrapper">
              <div className="logo text-center mb-4">
                <h2>Welcome to BESTTA!</h2>
                <h3 className="text-center mb-4">Enter the email address associated with your BESTTA account.</h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                {/* <div
                  className="mb-4 form-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    //  flexDirection:"column",
                    border: "2px solid #fff",
                    borderRadius: "27px",
                  }}
                >
                  <input
                    type="email"
                    // className={`form-control`}
                    placeholder="Enter Email"
                    id="email"
                    name="email"
                    onChange={handleOnChange}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                      padding: "10px",
                      color: "#fff",
                      width: "95%",
                    }}
                  />
                </div> */}
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
                      // className={`form-control `}
                      // id="email"
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

                <div className="main-slider-two__btn transform-none justify-content-center">
                  {/* <Link to="" className="nisoz-btn"> */}
                  {/* <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" /> */}
                  <button disabled={formik.isSubmitting} type="submit" className="nisoz-btn" style={{pedding:"3%",marginLeft: '10px'}}>
                    {formik.isSubmitting ? (
                      <>
                        Send Otp
                        <Spinner color="secondary" size="sm" type="grow" />
                      </>
                    ) : (
                <span style={{marginLeft:"0px"}}>Send Otp</span>
                    )}
                  </button>
                  {/* </Link> */}
                  {/* /.btn */}
                </div>
              </form>
              {/* Register Link */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOtp;
