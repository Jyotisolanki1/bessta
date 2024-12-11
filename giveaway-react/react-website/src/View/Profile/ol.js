import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { GetProfileApi } from '../../Slices/LoginSlice';
import { UpdateProfileApi } from '../../Slices/ProfileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';

const GetProfile = () => {
  // const { loading, ProfileData } = useSelector((state) => state.profileAction);

  const { userToken, loading, ProfileData } = useSelector((state) => state.loginAction);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState('');
  const [error, setError] = useState({
    firstname: null,
    lastname: null
  });

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
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setProfileData({
      ...profileData,
      image: file
    });
    setImageFile(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    //validation
    //firstname
    if (profileData.firstname.length > 35) {
      setError({ firstname: 'First name should be less or equal to 35 charactor' });
      return false;
    } else if (!/^[a-zA-Z\s]*$/.test(profileData.firstname)) {
      setError((prevError) => ({
        ...prevError,
        firstname: 'First name should not contain special characters or numbers'
      }));
      return false;
    } else if (profileData.firstname == '') {
      setError({ firstname: 'First name should be not empty' });
      return false;
    } else {
      setError({ firstname: '' });
    }

    //lastname
    if (profileData.lastname.length > 35) {
      setError({ lastname: 'Last name should be less or equal to 35 charactor' });
      return false;
    } else if (!/^[a-zA-Z\s]*$/.test(profileData.lastname)) {
      setError((prevError) => ({
        ...prevError,
        lastname: 'Last name should not contain special characters or numbers'
      }));
      return false;
    } else if (profileData.lastname == '') {
      setError({ lastname: 'Last name should be not empty' });
      return false;
    } else {
      setError({ lastname: '' });
    }

    //phone
    if (!/^\d{5,15}$/.test(profileData.phone)) {
      setError({ phone: 'Phone number should be between 5 to 15 digits' });
      return false;
    } else if (/^0+$/.test(profileData.phone)) {
      setError((prevError) => ({
        ...prevError,
        phone: 'Phone number should not consist of all 0s'
      }));
      return false;
    } else {
      setError({ phone: '' });
    }

    //formData
    const formData = new FormData();
    formData.append('firstname', profileData?.firstname ? profileData?.firstname : profileDetails?.firstname);
    formData.append('lastname', profileData?.lastname ? profileData?.lastname : profileDetails?.lastname);
    formData.append('phone', profileData?.phone ? profileData?.phone : profileDetails?.phone);
    formData.append('image', imageFile ? imageFile : profileData?.image);

    const res = await dispatch(UpdateProfileApi(formData, userToken));

    if (res?.success) {
      dispatch(GetProfileApi(userToken));
      // navigate("/landing");
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div
      style={{
        height: '130vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div role="tabpanel" className="tab-pane" id="profile" style={{ width: '60%', margin: '0px auto', marginTop: '100px' }}>
        <div className="edit-profile">
          <form>
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
              <label className="form-field__label ">First Name : </label>
              <input
                type="text"
                className="form-field__input"
                // defaultValue="Peter Huang"

                onChange={handleOnChange}
                defaultValue={profileDetails?.firstname}
                name="firstname"
                // value = {profileDetails.firstname}
              />
              <p style={{ color: 'red' }}>{error.firstname ? error.firstname : ''}</p>
            </div>
            <div className="form-box">
              <label className="form-field__label ">Last Name : </label>
              <input
                type="text"
                className="form-field__input"
                // defaultValue="Peter Huang"
                onChange={handleOnChange}
                defaultValue={profileDetails?.lastname}
                name="lastname"
                // value = {profileDetails.lastname}
              />
              <p style={{ color: 'red' }}>{error.lastname ? error.lastname : ''}</p>
            </div>
            <div className="form-box">
              <label className="form-field__label ">Email : </label>
              <input
                type="text"
                className="form-field__input"
                // defaultValue="Peter Huang"
                disabled
                // onChange={handleOnChange}
                defaultValue={profileDetails?.email}
                // name="firstname"
                // value = {profileDetails.firstname}
              />
            </div>
            <div className="form-box">
              <label className="form-field__label">Phone Number : </label>
              <input
                type="number"
                className="form-field__input"
                onChange={handleOnChange}
                // defaultValue="12345678"
                defaultValue={profileDetails?.phone}
                name="phone"
                // value = {profileDetails.phone}
              />
              <p style={{ color: 'red' }}>{error.phone ? error.phone : ''}</p>
            </div>

            <div className="form-box">
              <label htmlFor="formFile" className="form-field__label">
                Profile Picture
              </label>
              <input onChange={handleFile} className="form-field__input" type="file" id="formFile" />
            </div>

            <div className="popup__btn-box popup__row1 text-center">
              {/* <button className="button  button--cancel js-close">Cancel</button> */}
              <button className="button  button--link w-25" type="submit" onClick={handleUpdateProfile}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetProfile;
