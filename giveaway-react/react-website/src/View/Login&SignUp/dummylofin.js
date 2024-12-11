/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserLoginApi } from "../../Slices/LoginSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import SignOtpModel from "./SignOtpModel";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [newToken, setNewToken] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toggle = () => setModal(!modal);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const rememberedEmail = localStorage.getItem("userEmail");
    
    if (rememberedEmail) {
      formik.setFieldValue("email", rememberedEmail);
      setRememberMe(true);
    }
    if (token) {
      navigate("/landing");
    } 
    
  }, [navigate]);
  

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values) => {
    const newObj = {
      email: values.email,
      password: values.password,
    };

    await dispatch(UserLoginApi(newObj)).then((res) => {
      if (res.success === true && res?.data?.isStatus === "pending") {
        toast.success(res.message);
        setModal(true);
        setNewToken(res?.data);
        localStorage.setItem("userToken", res?.data?.accessToken);
      } else if (res.success === true && res?.data?.isStatus === "active") {
        localStorage.setItem("userToken", res?.data?.accessToken);
        if (rememberMe) {
          
          localStorage.setItem("userEmail", values.email);
        } else {
          sessionStorage.setItem("userToken", res?.data?.accessToken);
          sessionStorage.setItem("userEmail", values.email);
        }
        setTimeout(() => {
          navigate("/landing");
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
    onSubmit,
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate("/landing");
    }
  }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowPassword((prev) => !prev);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div
      className="login-new-section"
      style={{ marginTop: "0px", height: "100vh" }}
    >
      <div className="container">
        <div className="row">
          {/* Left Blank Side */}
          <div className="col-lg-6" />
          {/* Right Side Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center right-side">
            <div className="form-2-wrapper">
              <div className="logo text-center mb-4">
                <h2>Welcome to BESTTA!</h2>
                <h3 className="text-center mb-4">
                  Australia's No. 1 Investor's Reward Club
                </h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4 form-box">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      border: "2px solid #fff",
                      backgroundColor: "transparent",
                      borderRadius: "30px",
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
                        borderColor:
                          formik.touched.email && formik.errors.email
                            ? "red"
                            : "",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: '20px'
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <label
                      style={{
                        color: "red",
                        fontFamily: "cursive",
                        fontSize: "13px",
                      }}
                    >
                      {formik.errors.email}
                    </label>
                  )}
                </div>
                <div className="mb-3">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid #fff",
                      borderRadius: "27px",
                    }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter Your Password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "10px",
                        color: "#fff",
                        flex: 1,
                        borderColor:
                          formik.touched.password && formik.errors.password
                            ? "red"
                            : "",
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        border: 0,
                        background: "transparent",
                        marginRight: "15px",
                      }}
                      onKeyPress={handleKeyPress}
                    >
                      <i
                        className={`fa-solid fa-eye${
                          !showPassword ? "-slash" : ""
                        }`}
                        style={{ color: "#fff", marginRight: "0px" }}
                        onClick={handleTogglePassword}
                      ></i>
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <label
                      style={{
                        color: "red",
                        fontFamily: "cursive",
                        fontSize: "13px",
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
                      backgroundColor: "#F28500",
                      padding: "10px 25px",
                      borderRadius: "30px",
                    }}
                    type="submit"
                  >
                    {formik.isSubmitting ? (
                      <>
                        Log In
                        <Spinner
                          color="secondary"
                          size="sm"
                          type="grow"
                          style={{ marginLeft: "10px" }}
                        />
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </div>
                <h5 className="text-center forgot-text mt-3">
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
                <Link className="login__email" to="">
                  support@bestta.com.au&nbsp;
                </Link>
                or call at&nbsp;
                <Link className="login__phone" to="">
                  (+61 7) 3373 9888&nbsp;
                </Link>
              </div>
              <footer className="login__footer mt-3">
                <div className="login__footer-name">
                  <p className=" ">
                    © 2024 <span className="dynamic-year" />
                    by BESTTA Investors Club, <br />
                    All Rights Reserved
                  </p>
                </div>
                <div className="login__footer-privacy">
                  <Link
                    to="/privacypolicy"
                    className="login__footer-privacy-link"
                  >
                    Privacy Policy
                  </Link>
                  <span className="login__footer-privacy-separator" />
                  <Link
                    to="/termsandcondition"
                    className="login__footer-privacy-link"
                  >
                    Terms &amp; Conditions
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <SignOtpModel
        isOpen={modal}
        toggle={toggle}
        newToken={newToken}
        type={2}
      />
    </div>
  );
};

export default Login;
