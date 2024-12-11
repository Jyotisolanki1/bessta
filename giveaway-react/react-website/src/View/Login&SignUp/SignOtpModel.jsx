/* eslint-disable react/prop-types */
// SignOtpModel.js
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import OtpInput from 'react18-input-otp';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyOtpApi } from '../../Slices/VerifyUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SetOtpToken } from '../../Slices/LoginSlice';
import { useEffect, useState } from 'react';
import { getApi } from '../apiCalls';
import { Spinner } from 'reactstrap';

export const SignOtpModel = ({ isOpen, toggle, newToken, type, otp }) => {
  const [tokenInfo, setTokenInfo] = useState();
  const [otpInfo, setOtpInfo] = useState();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subsciptionPlan } = useSelector((state) => state.commonAction);
  const initialValues = {
    secret_key: '' || tokenInfo?.otp
  };

  useEffect(() => {
    if (newToken) {
      setTokenInfo(newToken);
      setOtpInfo(otp);
    }
  }, [isOpen]);

  const validationSchema = Yup.object({
    secret_key: Yup.string().required('Security code is required').length(4, 'Security code must be 4 characters')
  });

  const resendOtp = async () => {
    try {
      const signupoptvarify = localStorage.getItem('signupoptvarify');
      if (signupoptvarify >= 3) {
        toast.error('OTP cannot be send due to many unverified OTP requests.');
      } else {
        const res = await getApi('resend-otp', {
          headers: {
            'Content-Type': 'Application/JSON',
            Authorization: `Bearer ${newToken}`
          }
        });

        if (res.data.success) {
          setCount((prevCount) => prevCount + 1);
          formik.setFieldValue('secret_key', '');
          setTokenInfo(res?.data?.data?.accessToken);
          setOtpInfo(res?.data?.data?.otp);
          toast.success('OTP has been resent successfully.');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      toast.error('An error occurred while resending OTP. Please try again.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    localStorage.setItem('signupoptvarify', count);
  }, [count]);

  const onSubmit = async (values, { resetForm }) => {
    const newObj = {
      otp: values.secret_key
    };

    // // console.log(newObj, "chekc");
    await dispatch(VerifyOtpApi(newObj, tokenInfo)).then((res) => {
      console.log('res', res);
      if (res.success === true) {
        console.log('res', res);
        toast.success(res.message);
        toggle();
        resetForm();
        if (type === 1) {
          setTimeout(() => {
            if (subsciptionPlan?._id) {
              localStorage.setItem('PaymentUserToken', res?.data?.accessToken);
              navigate(`/purchase?planid=${subsciptionPlan._id}`, {
                state: subsciptionPlan
              });
            } else {
              navigate('/login');
            }
            // dispatch(SetOtpToken(res?.data?.accessToken));
          }, 1500);
        } else {
          navigate('/plans');
           localStorage.setItem('userToken', res?.data?.accessToken);
           localStorage.setItem('userPaymentCheck', true);
          // setTimeout(() => {
          //   navigate('/landing');
          // }, 1500);
        }
      } else {
        toast.error(res.message);
      }
    });

    // when submitted the data to call toggle()
    // Implement the logic to validate the verification code on the server-side.
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" keyboard={false}>
      <ModalHeader toggle={toggle}>OTP Verification</ModalHeader>
      <ModalBody>
        <h5 className="section-title__tagline">Please enter the otp code ({otpInfo})</h5>
        <form onSubmit={formik.handleSubmit}>
          <OtpInput
            value={formik.values.secret_key}
            onChange={(otpNumber) => formik.setFieldValue('secret_key', otpNumber)}
            numInputs={4}
            isInputNum
            shouldAutoFocus
            containerStyle={{ justifyContent: 'space-between' }}
            inputStyle={{
              width: '100%',
              margin: '8px',
              padding: '10px',
              border: `1px solid ${formik.errors.secret_key ? 'red' : ''}`, // Apply red border color when there's an error
              borderRadius: 4
            }}
            placeholder="0000"
            focusStyle={{
              outline: 'none'
              // border: `2px solid ${theme.palette.primary.main}`
            }}
          />
          {formik.touched.secret_key && formik.errors.secret_key && (
            <label
              style={{
                color: 'red',
                fontFamily: 'cursive',
                fontSize: '13px'
              }}
            >
              {formik.errors.secret_key}
            </label>
          )}
          <br />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={formik.isSubmitting}
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
                lineHeight: '1.1rem',
                borderRadius: '30px'
              }}
            >
              {formik.isSubmitting ? (
                <>
                  Submit
                  <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={resendOtp}
              style={{
                backgroundColor: 'transparent',
                color: '#f28500',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Resend OTP
            </button>
          </div>
          {/* <button
            disabled={formik.isSubmitting}
            style={{ padding: "5px 50px" }}
            type="submit"
          >
            {formik.isSubmitting ? (
              <>
                <CircularProgress color="inherit" size={20} />
              </>
            ) : (
              "Submit"
            )}
          </button> */}
        </form>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="primary" onClick={() => // console.log("Do Something")}>
          Do Something
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

export default SignOtpModel;
