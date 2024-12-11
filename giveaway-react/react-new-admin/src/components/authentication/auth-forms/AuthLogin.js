/* eslint-disable arrow-body-style */
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { FormattedMessage } from 'react-intl';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
// import { DASHBOARD_PATH } from 'config';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { signin, verifyAcount } from 'store/slices/auth';
import { useDispatch } from 'store';

import { openSnackbar } from 'store/slices/snackbar';
import { imgPath } from 'config';
// import LocalizationSection from '../../../layout/MainLayout/Header/LocalizationSection';
// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const passwordInputRef = useRef(null);
  // const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);

    // Delay refocus and cursor position to ensure the state is updated first
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
        const length = passwordInputRef.current.value.length;
        passwordInputRef.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const cookieValue = `${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = `${name} = ${cookieValue}`;
  }

  return (
    <Formik
      initialValues={{
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password'),
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .required('Email is required')
          .test('no-multi-spaces', 'Entered email is invalid', (value) => {
            return value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
          })
          .max(100, 'Email must be at most 100 characters'),
        password: Yup.string().required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          // await login(values.email, values.password);
          const res = await dispatch(verifyAcount(values.email, values.password));
          // console.log(res);
          if (res?.success === true) {
            // if (checked) {
            //   localStorage.setItem('email', values.email);
            //   localStorage.setItem('password', values.password);
            // }
            // setLoading(false);
            // dispatch(signin(values.email, values.password));

            localStorage.setItem('Temptoken', res?.data?.accessToken);
            localStorage.setItem('otp', res?.data?.otp);
            // router.push('/admin');
            // eslint-disable-next-line no-restricted-globals
            router.push('/verify-otp-fa');
            // if (scriptedRef.current) {
            //   setStatus({ success: true });
            //   router.push('/admin');
            //   setSubmitting(false);
            // }
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
            <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{ maxLength: 100 }}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputRef={passwordInputRef} // Attach the ref here
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{ maxLength: 50 }}
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>
          {/* <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label={<FormattedMessage id="logged-in" />}
              />
            </Grid>
            <Grid item>
              <LocalizationSection />
            </Grid>
          </Grid> */}

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              {/* <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label={<FormattedMessage id="logged-in" />}
              /> */}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component={Link} href="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            {/* <AnimateButton> */}
            <Button color="secondary" disabled={loading} type="submit" fullWidth size="large" variant="contained">
              {loading ? (
                <>
                  <CircularProgress color="primary" />
                  &nbsp; Loading ...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            {/* </AnimateButton> */}
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTLogin.propTypes = {
  loginProp: PropTypes.number
};

export default JWTLogin;
