import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { GetProfileApi } from '../../Slices/LoginSlice';
import { UpdateProfileApi } from '../../Slices/ProfileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';


const GetProfile = () => {
  const { userToken, loading, ProfileData } = useSelector((state) => state.loginAction);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState();

  const profileDetails = ProfileData?.user;

  useEffect(() => {
    if (profileDetails) {
      setProfileData({
        ...profileData,
        firstname: profileDetails?.firstname,
        lastname: profileDetails?.lastname,
        phone: profileDetails.phone
      });
    }
  }, [profileDetails]);

  const handleUpdateProfile = async (values) => {
    const formData = new FormData();
    formData.append('firstname', values.firstname);
    formData.append('lastname', values.lastname);
    formData.append('phone', values.phone);
    formData.append('image', values.imageFile);

    const res = await dispatch(UpdateProfileApi(formData, userToken));

    if (res?.success) {
      dispatch(GetProfileApi(userToken));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
  const validationSchema = yup.object().shape({
    firstname: yup.string()
      .required('First name is required')
      .max(35, 'First name should be less than or equal to 35 characters')
      .matches(/^[a-zA-Z\s]*$/, 'First name should only contain letters and spaces')
      .strict()
      .trim(),
    lastname: yup.string()
      .required('Last name is required')
      .max(35, 'Last name should be less than or equal to 35 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Last name should only contain letters and spaces')
      .strict()
      .trim(),
    phone: yup.string()
      .required('Phone number is required')
      .matches(/^\d{5,15}$/, 'Phone number should be between 5 to 15 digits')
      .notOneOf(['00000'], 'Phone number should not consist of all 0s')
  });

  return (
    <div style={{ height: '130vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div role="tabpanel" className="tab-pane" id="profile" style={{ width: '60%', margin: '0px auto', marginTop: '100px' }}>
        <div className="edit-profile">
          <Formik
            initialValues={{
              firstname: profileDetails?.firstname || '',
              lastname: profileDetails?.lastname || '',
              phone: profileDetails?.phone || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleUpdateProfile(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="pro-name mb50">
                  <div className="user-avatar user-avatar--big profile__avatar">
                    <img
                      className="user-avatar__img"
                      src={profileDetails?.image ? `${REACT_API_URL}${profileDetails?.image}` : 'assets/images/avtar.png'}
                      alt="User Avatar"
                    />
                    <span className="user-avatar__name">{/* {profileDetails?.firstname[0] + profileDetails?.lastname[0]} */}</span>
                  </div>
                </div>

                <div className="form-box">
                  <label className="form-field__label">First Name:</label>
                  <Field
                    type="text"
                    className="form-field__input"
                    name="firstname"
                  />
                  {errors.firstname && touched.firstname && <p style={{ color: 'red' }}>{errors.firstname}</p>}
                </div>
                <div className="form-box">
                  <label className="form-field__label">Last Name:</label>
                  <Field
                    type="text"
                    className="form-field__input"
                    name="lastname"
                  />
                  {errors.lastname && touched.lastname && <p style={{ color: 'red' }}>{errors.lastname}</p>}
                </div>
                <div className="form-box">
                  <label className="form-field__label">Email:</label>
                  <Field
                    type="text"
                    className="form-field__input"
                    name="email"
                    disabled
                    value={profileDetails?.email}
                  />
                </div>
                <div className="form-box">
                  <label className="form-field__label">Phone Number:</label>
                  <Field
                    type="text"
                    className="form-field__input"
                    name="phone"
                  />
                  {errors.phone && touched.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
                </div>

                <div className="form-box">
                  <label htmlFor="formFile" className="form-field__label">
                    Profile Picture
                  </label>
                  <Field
                    className="form-field__input"
                    type="file"
                    id="formFile"
                    name="image"
                  />
                </div>

                <div className="popup__btn-box popup__row1 text-center">
                  <button className="button button--link w-25" type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default GetProfile;
