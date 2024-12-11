/* eslint-disable react/no-unknown-property */

import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { ChangePasswordApi } from "../../Slices/ChangePassword";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";


const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordDetails, setPasswordDetails] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // const [showPassword, setShowPassword] = useState(false);
  // const [newPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

  const [showOldPassword, setOldShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [openPopupModel, setOpenModel] = useState(open);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword:  Yup.string()
    .required("Password is Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .min(8, "Password must be at least 8 characters")
    .max(15,"Password must be less than 15 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  //   const [disableStatus, setDisableStatus] = useState(true);
  const onSubmit = (values, { setSubmitting }) => {
    const newObj = {
      old_password: values.oldPassword,
      new_password: values.newPassword,
      confirm_password: values.confirmPassword,
    };
    dispatch(ChangePasswordApi(newObj))
      .then((res) => {
        console.log("res",res);
        if (res.success) {
          toast.success(res.message);
          navigate("/landing");
          setSubmitting(false);
        } else {
          toast.error(res.message);
          setSubmitting(false);
        }
      })
      .catch(() => {
        setSubmitting(false);
      });
    ChangePasswordApi(newObj)
        .then((res) => {
            if (res.success === true) {
                setSubmitting(false);
                toast.success(res.message);
            } else {
                setSubmitting(false);
                toast.error("Something went wrong.");
            }
        })
        .catch(() => {
            setSubmitting(false);
        });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleSubmitPasword = async (e) => {
    e.preventDefault();
    const res = await dispatch(ChangePasswordApi(passwordDetails));

    if (res.success) {
      toast.success(res.message);
      navigate("/landing");
    } else {
      toast.error(res.message);
    }
  };

  const passwordOnChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordDetails({
      ...passwordDetails,
      [name]: value,
    });
  };
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleNewpassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleNewConfirmPassword = () => {
    setShowNewConfirmPassword((prev) => !prev);
  };
  const handleClickShowPassword = (type) => {
    if (type === 1) {
      setOldShowPassword(!showOldPassword);
    } else if (type === 2) {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div id="changepassHeight">
      <div
        role="tabpanel"
        // className="tab-pane"
        id="changePassword"
        style={{ width: '40%', margin: '0px auto', marginTop: '100px', height: '70%' }}
      >
        <div className="edit-profile">
          <form
            onSubmit={formik.handleSubmit}
            style={{ width: "100%", margin: "0px auto" }}
          >
            <div className="pro-name">
              <h3>Change Password</h3>
            </div>
            <div
              className="popup__row form-box"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="form-field form-field--required"
                style={{ width: "100%" }}
              >
                <div>
                  <label className="form-field__label">Old Password : </label>
                  <div
                    style={{
                      border: "2px solid #ffc10770",
                      borderRadius: "6px",
                      padding: "6px",
                      display:"flex",
                    }}
                  >
                    <input
                      placeholder="Enter Old Password"
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      onChange={formik.handleChange}
                      value={formik.values.oldPassword}
                      error={
                        formik.touched.oldPassword &&
                        Boolean(formik.errors.oldPassword)
                      }
                      onBlur={formik.handleBlur}
                      style={{ width: "90%", border: "none", outline: "none" }}
                    />
                    <i
                      className={`fa-solid eyeIcon fa-eye${
                        !showOldPassword ? "-slash" : ""
                      }`}
                      onClick={() => handleClickShowPassword(1)}
                    ></i>
                  </div>
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <label
                      style={{
                        color: "red",
                        fontFamily: "cursive",
                        fontSize: "13px",
                      }}
                    >
                      {formik.errors.oldPassword}
                    </label>
                  )}
                </div>
              </div>
              <div
                className="form-field form-field--required"
                style={{ width: "100%" }}
              >
                <div>
                  <label className="form-field__label">New Password : </label>
                  <div
                    style={{
                      border: "2px solid #ffc10770",
                      borderRadius: "6px",
                      padding: "6px",
                      display:"flex",
                    }}
                  >
                    <input
                      placeholder="Enter New Password"
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      onChange={formik.handleChange}
                      value={formik.values.newPassword}
                      error={
                        formik.touched.newPassword &&
                        Boolean(formik.errors.newPassword)
                      }
                      onBlur={formik.handleBlur}
                      style={{ width: "90%", border: "none", outline: "none" }}
                    />
                    <i
                      className={`fa-solid eyeIcon fa-eye${
                        !showNewPassword ? "-slash" : ""
                      }`}
                      onClick={() => handleClickShowPassword(2)}
                    ></i>
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <label
                      style={{
                        color: "red",
                        fontFamily: "cursive",
                        fontSize: "13px",
                      }}
                    >
                      {formik.errors.newPassword}
                    </label>
                  )}
                </div>
              </div>
              <div
                className="form-field form-field--required"
                style={{ width: "100%" }}
              >
                <div>
                  <label className="form-field__label">
                    Confirm Password :{" "}
                  </label>
                  <div
                    style={{
                      border: "2px solid #ffc10770",
                      borderRadius: "6px",
                      padding: "6px",
                      display:"flex",
                    }}
                  >
                    <input
                      placeholder="Enter Confirm Password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      onBlur={formik.handleBlur}
                      style={{ width: "90%", border: "none", outline: "none" }}
                    />
                    <i
                      className={`fa-solid eyeIcon fa-eye${
                        !showPassword ? "-slash" : ""
                      }`}
                      onClick={() => handleClickShowPassword(3)}
                    ></i>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <label
                        style={{
                          color: "red",
                          fontFamily: "cursive",
                          fontSize: "13px",
                        }}
                      >
                        {formik.errors.confirmPassword}
                      </label>
                    )}
                </div>
              </div>
            </div>
            <div className="popup__btn-box popup__row">
              <button
                className="button  button--cancel js-close cancelBtn"
                onClick={() => navigate("/landing")}
              >
                Cancel
              </button>
              {/* <button
                className="button  button--link"
                type="submit"
                onClick={handleSubmitPasword}
              >
                Submit
              </button> */}
              <button
                disabled={formik.isSubmitting}
                className="button  button--link submitBtn"
                type="submit"
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
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
