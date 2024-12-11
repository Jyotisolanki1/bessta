/* eslint-disable lines-around-directive */
/* eslint-disable arrow-body-style */
'use client';

import React, { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { changePasswordCompany } from 'store/slices/auth';
import { gridSpacing } from 'store/constant';
import { FormattedMessage } from 'react-intl';

// ========================|| FIREBASE - RESET PASSWORD ||======================== //

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme();
  const router = useRouter();
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const changePassword = (value) => {
  //   const temp = strengthIndicator(value);
  //   setStrength(temp);
  //   setLevel(strengthColor(temp));
  // };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6} sm={6}>
        <Formik
          initialValues={{
            oldpassword: '',
            password: '',
            confirmPassword: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            oldpassword: Yup.string()
              .required(<FormattedMessage id="old-password-error" />)
              .test('password-spaces', <FormattedMessage id="old-password-2-error" />, (value) => {
                return value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value);
              })
              .min(8, <FormattedMessage id="old-password-min-error" />)
              .max(25, <FormattedMessage id="old-password-max-error" />),
            password: Yup.string()
              .required(<FormattedMessage id="new-password-error" />)
              .test('password-spaces', <FormattedMessage id="new-password-2-error" />, (value) => {
                return value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value);
              })
              .min(8, <FormattedMessage id="new-password-min-error" />)
              .max(25, <FormattedMessage id="new-password-max-error" />),
            confirmPassword: Yup.string()
              .required(<FormattedMessage id="confirm-password-error" />)
              .test(
                'confirmPassword',
                <FormattedMessage id="password-match-error" />,
                (confirmPassword, yup) => yup.parent.password === confirmPassword
              )
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            setLoading(true);
            try {
              const res = await dispatch(changePasswordCompany(values.oldpassword, values.password));
              if (res?.succeeded === true) {
                setLoading(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: res?.ResponseMessage,
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
                    message: res?.ResponseMessage,
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
                  message: <FormattedMessage id="some-went-wrong" />,
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
              <FormControl fullWidth error={Boolean(touched.oldpassword && errors.oldpassword)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-reset">
                  <FormattedMessage id="old-password" />
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-reset"
                  type={showOldPassword ? 'text' : 'password'}
                  value={values.oldpassword}
                  name="oldpassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showOldPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputProps={{ maxLength: 25 }}
                />
              </FormControl>

              {touched.oldpassword && errors.oldpassword && (
                <FormControl fullWidth>
                  <FormHelperText error id="standard-weight-helper-text-confirm-password">
                    {' '}
                    {errors.oldpassword}{' '}
                  </FormHelperText>
                </FormControl>
              )}
              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-reset">
                  <FormattedMessage id="new-password" />
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-reset"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  inputProps={{ maxLength: 25 }}
                />
              </FormControl>
              {touched.password && errors.password && (
                <FormControl fullWidth>
                  <FormHelperText error id="standard-weight-helper-text-reset">
                    {errors.password}
                  </FormHelperText>
                </FormControl>
              )}
              <FormControl
                fullWidth
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-password-reset">
                  <FormattedMessage id="confirm-password" />
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-reset"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputProps={{ maxLength: 25 }}
                />
              </FormControl>

              {touched.confirmPassword && errors.confirmPassword && (
                <FormControl fullWidth>
                  <FormHelperText error id="standard-weight-helper-text-confirm-password">
                    {' '}
                    {errors.confirmPassword}{' '}
                  </FormHelperText>
                </FormControl>
              )}

              <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                {/* <AnimateButton> */}
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CircularProgress color="primary" />
                      &nbsp;
                      <FormattedMessage id="loading" /> ...
                    </>
                  ) : (
                    <FormattedMessage id="change-password" />
                  )}
                </Button>
                {/* </AnimateButton> */}
              </Box>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AuthResetPassword;
