import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { HelpCenterApi } from '../../Slices/ProfileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const [submit, setSubmit] = useState(false);
  const { ProfileData } = useSelector((state) => state.loginAction);
  const [text, setText] = useState('');
  const maxLength = 250;


  const navigate = useNavigate();

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setText(inputValue);
  };

  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState({
    query: '',
  });

  const profileDetails = ProfileData?.user;

  useEffect(() => {
    if (profileDetails) {
      setProfileData({
        ...profileData,
        name: profileDetails?.firstname,
        lastname: profileDetails?.lastname,
        phone: profileDetails.phone,
      });
    }
  }, [profileDetails]); // Added profileDetails as a dependency

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfileData({
  //     ...profileData,
  //     [name]: value,
  //   });
  // };

  const handleSubmit = async (e) => {
 
    e.preventDefault();
    // Validation
    // Query
    if (text.trim() === '') {
      setError({ query: 'Query should not be empty' });
      return;
    } else {
      setError({ query: '' });
      setSubmit(true);
    }

    const data = {
      name: profileData.name || profileDetails?.firstname,
      email: profileData.email || profileDetails?.email,
      mobile: profileData.phone || profileDetails?.phone,
      message: text,
    };
    try {
      const res = await dispatch(HelpCenterApi(data));
      if (res) {
        toast.success('Inquiry submitted successfully');
      }
      navigate('/landing')
      setSubmit(false);
    } catch (err) {
      toast.error('Failed to submit inquiry');
    }
  };

  return (
    <div
    role="tabpanel"
    className="tab-pane"
    id="profile"
    style={{ width: '100%', margin: '0px auto', marginTop: '100px', height: '70%' }}
    >
      <div role="tabpanel" className="tab-pane" id="profile" style={{ width: '60%' ,margin: "auto"}}>
        <h1 style={{ textAlign: 'center', padding: '2%' }}>Get Help</h1>
        <div className="edit-profile">
          <form onSubmit={handleSubmit}>
            <div className="form-box">
              <label className="form-field__label">Name:</label>
              <input
                type="text"
                className="form-field__input"
                defaultValue={profileDetails?.firstname}
                name="firstname"
                readOnly
                disabled
              />
            </div>
            <div className="form-box">
              <label className="form-field__label">Email:</label>
              <input
                type="text"
                className="form-field__input"
                defaultValue={profileDetails?.email}
                readOnly
                disabled
              />
            </div>
            <div className="form-box">
              <label className="form-field__label">Phone Number:</label>
              <input
                type="number"
                className="form-field__input"
                defaultValue={profileDetails?.phone}
                name="phone"
                readOnly
                disabled
              />
            </div>
            <div className="form-box">
              <label className="form-field__label">Query:</label>
              <textarea
                value={text}
                onChange={handleChange}
                style={{ height: '200px' }}
                className="form-field__input"
                placeholder="Enter Query"
                maxLength={maxLength}
              />
              <p>{text.length}/{maxLength}</p>
              <p style={{ color: 'red' }}>{error.query}</p>
            </div>
            {!submit ? (
              <div className='popup__btn-box popup__row1 text-center'>
                <button   style={{
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
                  lineHeight: '1.1rem',
                  margin: "auto"
                }} type="submit" >
            submit
                </button>
              </div>
            ) : (
              <div>
                <button className="nisoz-btn" style={{ marginLeft: '40%' }} disabled>
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text">Processing</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
