import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../apiCalls';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spinner } from 'reactstrap';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      )
      .min(8, 'Password must be at least 8 characters')
      .max(15, 'Password must be max 15 characters'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const details = JSON.parse(localStorage.getItem('forget_token'));
        const res = await postApi('reset-password', values, {
          headers: {
            'Content-Type': 'Application/JSON',
            Authorization: `Bearer ${details.accessToken}`
          }
        });
        if (res.data.success) {
          localStorage.removeItem('forget_token');
          navigate('/login');
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        // console.log(err, 'err');
      }
    }
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div className="login-new-section" style={{ height: '100vh' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6" />
          <div className="col-lg-6 d-flex align-items-center justify-content-center right-side">
            <div className="form-2-wrapper">
              <div className="logo text-center mb-4">
                <h2>Welcome to BESTTA!</h2>
                <h3 className="text-center mb-4">Australia's No. 1 Investors Reward Club</h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid #fff',
                    borderRadius: '27px',
                    margin: '12px 0'
                  }}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter New Password"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#fff',
                      padding: '10px',
                      border: 'none',
                      outline: 'none',
                      width: '95%'
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      border: 0,
                      background: 'transparent',
                      marginRight: '15px',
                      cursor: 'pointer',
                      margin: '0 10px',
                      color: 'white',
                      fontSize: '20px',
                      borderColor: formik.touched.password && formik.errors.password ? 'red' : ''
                    }}
                    onKeyPress={handleKeyPress}
                  >
                    <i className={`fa-solid fa-eye${showPassword ? '' : '-slash'}`} onClick={handleTogglePassword}></i>
                  </button>
                </div>
                {formik.errors.password && formik.touched.password && (
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid #fff',
                    borderRadius: '27px',
                    margin: '12px 0'
                  }}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Confirm Password"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#fff',
                      padding: '10px',
                      border: 'none',
                      outline: 'none',
                      width: '95%'
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      border: 0,
                      background: 'transparent',
                      marginRight: '15px',
                      cursor: 'pointer',
                      margin: '0 10px',
                      color: 'white',
                      fontSize: '20px',
                      borderColor: formik.touched.confirm_password && formik.errors.confirm_password ? 'red' : ''
                    }}
                    onKeyPress={handleKeyPress}
                  >
                    <i className={`fa-solid fa-eye${showPassword ? '' : '-slash'}`} onClick={handleTogglePassword}></i>
                  </button>
                </div>
                {formik.errors.confirm_password && formik.touched.confirm_password && (
                  <label
                    style={{
                      color: 'red',
                      fontFamily: 'cursive',
                      fontSize: '13px',
                      marginBottom: '5px'
                    }}
                  >
                    {formik.errors.confirm_password}
                  </label>
                )}
                <div className="main-slider-two__btn transform-none justify-content-center">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="nisoz-btn__text"
                    style={{
                      backgroundColor: '#f28500',
                      color: 'white',
                      border: 'transparent',
                      marginBottom: 'clamp(0.8rem, 3vw, 1.1rem)',
                      padding: '1em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      boxShadow: '0 0.3rem #f285008a',
                      borderRadius: '30px',
                      lineHeight: '1.1rem'
                    }}
                  >
                    {formik.isSubmitting ? (
                      <>
                        Reset Password
                        <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
