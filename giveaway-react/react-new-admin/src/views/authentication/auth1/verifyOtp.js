'use client';

import Link from 'next/link';
import OtpInput from 'react18-input-otp';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// project imports
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import BackgroundPattern1 from 'components/ui-component/cards/BackgroundPattern1';
import { verifyOtpApi, resendOtpApi } from 'store/slices/auth';
import AuthSlider from 'components/ui-component/cards/AuthSlider';
import { useDispatch } from 'store';
import { imgPath } from 'config';
import { openSnackbar } from 'store/slices/snackbar';

// assets
const AuthBlueCard = '/assets/images/auth/auth-blue-card.svg';
const AuthPurpleCard = '/assets/images/auth/auth-purple-card.svg';

// styles
const PurpleWrapper = styled('span')({
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '32%',
    left: '40%',
    width: 313,
    backgroundSize: 380,
    height: 280,
    backgroundImage: `url(${AuthPurpleCard})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    animation: '15s wings ease-in-out infinite'
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '23%',
    left: '37%',
    width: 243,
    height: 210,
    backgroundSize: 380,
    backgroundImage: `url(${AuthBlueCard})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    animation: '15s wings ease-in-out infinite',
    animationDelay: '1s'
  }
});

// carousel items
const items = [
  {
    title: 'Hi, Aro!',
    description: 'Welcome Back! to Admin'
  }
];

// ================================|| AUTH1 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const dispatch = useDispatch();
  const initialValues = {
    secret_key: ''
  };

  useEffect(() => {
    if (!localStorage.getItem('forgetOptCheckAdmin')) {
      router.push('/forgot-password');
    }
  }, []);
  const validationSchema = Yup.object({
    secret_key: Yup.string().required('Security code is required').length(4, 'Security code must be 4 characters')
  });

  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
  };

  const onSubmit = async (values, { resetForm }) => {
    const newObj = {
      otp: values.secret_key
    };

    try {
      const res = await dispatch(verifyOtpApi(newObj, localStorage.getItem('Temptoken')));
      if (res?.success === true) {
        if (res.type === 'forgot') {
          localStorage.removeItem('forgetOptCheckAdmin');
          localStorage.setItem('Temptoken', res?.data?.token?.accessToken);
          router.push('/reset-admin-password');
        } else {
          localStorage.setItem('token', res?.data?.token?.accessToken);
          localStorage.setItem('role', res?.data?.user_type);
          localStorage.setItem('name', res?.data?.name);
          localStorage.setItem('profile', `${imgPath}${res?.data?.profile_pic}`);
          setCookie('adminToken', res?.data?.token?.accessToken, 1);
          // localStorage.setItem('forgetOptCheckAdmin', true);
          router.push('/admin');

          dispatch(
            openSnackbar({
              open: true,
              message: res?.message,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            })
          );
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message || 'OTP verification failed',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Something went wrong. Please try again later.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const resendOtp = async () => {
    try {
      const res = await dispatch(resendOtpApi());
      if (res?.success === true) {
        formik.setFieldValue('secret_key', '');
        localStorage.setItem('Temptoken', res.data.accessToken);
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
    }
  };

  return (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Stack justifyContent={matchDownSM ? 'center' : 'flex-start'} textAlign="center">
                  <Typography
                    color={theme.palette.secondary.main}
                    gutterBottom
                    variant={matchDownSM ? 'h3' : 'h2'}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                  >
                    Verify Otp
                  </Typography>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Please enter the OTP code
                  </Typography>
                </Stack>
              </Grid>

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
                    border: `1px solid ${formik.errors.secret_key ? 'red' : ''}`,
                    borderRadius: 4
                  }}
                  placeholder="0000"
                />
                {formik.touched.secret_key && formik.errors.secret_key && (
                  <Typography variant="body2" sx={{ color: 'red', fontFamily: 'cursive', fontSize: '13px' }}>
                    {formik.errors.secret_key}
                  </Typography>
                )}
                <br />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    style={{
                      backgroundColor: '#673ab7',
                      color: 'white',
                      border: 'transparent',
                      marginBottom: 'clamp(0.8rem, 3vw, 1.1rem)',
                      padding: '1em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      boxShadow: '0 0.3rem #673ab7',
                      lineHeight: '1.1rem',
                      borderRadius: '8px'
                    }}
                  >
                    {formik.isSubmitting ? <CircularProgress color="primary" /> : 'Submit'}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={resendOtp}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <span />
                <PurpleWrapper />
              </Grid>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                    <AuthSlider items={items} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
