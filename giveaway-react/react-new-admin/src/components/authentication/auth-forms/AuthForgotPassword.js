/* eslint-disable lines-around-directive */
/* eslint-disable arrow-body-style */
'use client';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, CircularProgress } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { resetPasswordLink } from 'store/slices/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { FormattedMessage } from 'react-intl';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .required('Email is required')
          .test('no-multi-spaces', 'Entered email is invalid', (value) => {
            return value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
          })
          .max(100, 'Email must be at most 100 characters')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          const res = await dispatch(resetPasswordLink(values.email));
          // console.log(res);
          if (res?.success === true) {
            localStorage.setItem('forgetOptCheckAdmin', true);
            dispatch(
              openSnackbar({
                open: true,
                // message: res?.ResponseMessage,
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
            localStorage.setItem('Temptoken', res?.data?.accessToken);
            router.push('/verify-otp');
            // setTimeout(() => {
            //   window.location.replace('/');
            // }, 1500);
          } else {
            setLoading(false);
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
          setLoading(false);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Something went wrong. Please try again letar.',
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
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-forgot">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-forgot"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email Address"
              inputProps={{}}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-forgot">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp; Loading ...
                  </>
                ) : (
                  'Send Mail'
                )}
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

AuthForgotPassword.propTypes = {
  loginProp: PropTypes.number
};

export default AuthForgotPassword;
