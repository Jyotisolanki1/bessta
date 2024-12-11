import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getApi,postApi } from "../apiCalls";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react18-input-otp";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const SubmitOtp = () => {
  const navigate = useNavigate();

  const initialValues = {
    secret_key: "",
  };

  const validationSchema = Yup.object({
    secret_key: Yup.string()
      .required("Security code is required")
      .length(4, "Security code must be 4 characters"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const details = JSON.parse(localStorage.getItem("forget_token"));
      const res = await postApi(
        "verify-otp",
        { otp: values.secret_key },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${details.accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/resetpassword");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error submitting OTP:", err);
      toast.error("An error occurred while verifying OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      const details = JSON.parse(localStorage.getItem("forget_token"));
      
      const res = await getApi(
        "resend-otp",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${details.accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("OTP has been resent successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast.error("An error occurred while resending OTP. Please try again.");
    }
  };

  const otps = JSON.parse(localStorage.getItem("forget_token")).otp;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div
      className="login-new-section"
      style={{ marginTop: "0px", height: "100vh" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6" />
          <div className="col-lg-5 right-side">
            <div className="form-2-wrapper">
              <div className="logo text-center mb-4">
                <h2>Welcome to BESTTA! Otp Verification</h2>
                <h3 className="text-center mb-4">Enter Otp - {otps}</h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4 form-box">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <OtpInput
                      value={formik.values.secret_key}
                      onChange={(otpNumber) =>
                        formik.setFieldValue("secret_key", otpNumber)
                      }
                      numInputs={4}
                      isInputNum
                      shouldAutoFocus
                      containerStyle={{ justifyContent: "space-between" }}
                      inputStyle={{
                        width: "100%",
                        margin: "8px",
                        padding: "10px",
                        border: `1px solid ${
                          formik.errors.secret_key ? "red" : ""
                        }`,
                        borderRadius: 4,
                      }}
                      placeholder="0000"
                      focusStyle={{
                        outline: "none",
                      }}
                    />
                    <br />
                  </div>
                  {formik.touched.secret_key && formik.errors.secret_key && (
                    <label
                      style={{
                        color: "red",
                        fontFamily: "cursive",
                        fontSize: "13px",
                      }}
                    >
                      {formik.errors.secret_key}
                    </label>
                  )}
                </div>

                <div className="main-slider-two__btn transform-none justify-content-center">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    style={{
                      backgroundColor: "#f28500",
                      color: "white",
                      border: "transparent",
                      marginBottom: "clamp(0.8rem, 3vw, 1.1rem)",
                      padding: "1em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      borderRadius: "30px",
                      boxShadow: "0 0.3rem #f285008a",
                      lineHeight: "1.1rem",
                    }}
                  >
                    {formik.isSubmitting ? (
                      <>
                        Submit
                        <Spinner
                          color="secondary"
                          size="sm"
                          type="grow"
                          style={{ marginLeft: "10px" }}
                        />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={resendOtp}
                  style={{
                    backgroundColor: "transparent",
                    color: "#f28500",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitOtp;
