import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetProfileApi } from '../../Slices/LoginSlice';
import { UpdateProfileApi } from '../../Slices/ProfileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Spinner } from 'reactstrap';
import Loader from '../../Common/Loader'; // Import the Loader component

const GetProfile = () => {
  const { userToken, loading, ProfileData } = useSelector((state) => state.loginAction);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetProfileApi(userToken));
  }, [dispatch, userToken]);

  const profileDetails = ProfileData?.user;
  const IMAGES_FILE_SUPPORTED_FORMATS = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/JPG',
    'image/JPEG',
    'image/PNG',
    'image/svg',
    'image/svg+xml',
    'imag/SVG+XML',
    'image/SVG'
  ];
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('firstname', values.firstname);
    formData.append('lastname', values.lastname);
    formData.append('phone', values.phone);
    if (values.image) {
      formData.append('image', values.image);
    }

    const res = await dispatch(UpdateProfileApi(formData, userToken));

    if (res?.success) {
      dispatch(GetProfileApi(userToken));
      toast.success(res.message);
      navigate('/landing');
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const validationSchema = yup.object().shape({
    firstname: yup
      .string()
      .required('First name is required')
      .max(35, 'First name should be less than or equal to 35 characters')
      .matches(/^[a-zA-Z\s]*$/, 'First name should only contain letters and spaces')
      .strict()
      .trim('Please enter valid first name'),
    lastname: yup
      .string()
      .required('Last name is required')
      .max(35, 'Last name should be less than or equal to 35 characters')
      .matches(/^[a-zA-Z\s]*$/, 'Last name should only contain letters and spaces')
      .strict()
      .trim('Please enter valid last name'),
    image: yup
      .mixed()
      .nullable()
      .test('FILE_FORMAT', 'Invalid image', (value) => {
        return !value || (value && IMAGES_FILE_SUPPORTED_FORMATS.includes(value.type));
      })
      .test('FILE_SIZE', 'File size should be less than or equal to 10MB', (value) => {
        return !value || (value && value.size <= 1024 * 1024 * 10);
      }),

    phone: yup
      .string()
      .required('Phone number is required')
      .matches(/^\d{5,15}$/, 'Phone number should be between 5 to 15 digits')
      .notOneOf(
        [
          '00000',
          '000000',
          '0000000',
          '00000000',
          '000000000',
          '0000000000',
          '00000000000',
          '000000000000',
          '0000000000000',
          '00000000000000',
          '000000000000000'
        ],
        'Phone number should not consist of all 0s'
      )
      .matches(/^[1-9]\d*$/, 'Phone number should not start with 0')
  });

  if (loading) {
    return <Loader />; // Display loader while loading
  }

  return (
    <div id="profileHeight">
      <div
        role="tabpanel"
        // className="tab-pane"
        id="profile"
        style={{ width: '60%', margin: '0px auto', marginTop: '100px', height: '70%' }}
      >
        <div className="edit-profile">
          <Formik
            initialValues={{
              firstname: profileDetails?.firstname || '',
              lastname: profileDetails?.lastname || '',
              phone: profileDetails?.phone || '',
              image: null
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
              <Form>
                <div className="pro-name">
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
                  <Field type="text" className="form-field__input" name="firstname" />
                  {errors.firstname && touched.firstname && <p style={{ color: 'red' }}>{errors.firstname}</p>}
                </div>
                <div className="form-box">
                  <label className="form-field__label">Last Name:</label>
                  <Field type="text" className="form-field__input" name="lastname" />
                  {errors.lastname && touched.lastname && <p style={{ color: 'red' }}>{errors.lastname}</p>}
                </div>
                <div className="form-box">
                  <label className="form-field__label">Email:</label>
                  <Field type="text" className="form-field__input" name="email" disabled value={profileDetails?.email} />
                </div>
                <div className="form-box">
                  <label className="form-field__label">Phone Number:</label>
                  <Field type="text" className="form-field__input" name="phone" />
                  {errors.phone && touched.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
                </div>

                <div className="form-box">
                  <label htmlFor="formFile" className="form-field__label">
                    Profile Picture
                  </label>
                  <input
                    name="image"
                    type="file"
                    className="form-field__input"
                    onChange={(event) => {
                      setFieldValue('image', event.currentTarget.files[0]);
                    }}
                  />
                  {errors.image && touched.image && <p style={{ color: 'red' }}>{errors.image}</p>}
                </div>

                <div className="popup__btn-box popup__row1 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#f28500',
                      color: 'white',
                      border: 'transparent',
                      marginBottom: 'clamp(0.8rem, 3vw, 1.1rem)',
                      padding: '1em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      borderRadius: '30px',
                      boxShadow: '0 0.3rem #f285008a',
                      lineHeight: '1.1rem'
                    }}
                    className="profileButton"
                  >
                    {isSubmitting ? (
                      <>
                        Submit
                        <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                      </>
                    ) : (
                      'Submit'
                    )}
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
