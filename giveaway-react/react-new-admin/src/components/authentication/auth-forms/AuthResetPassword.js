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
import { resetPassword } from 'store/slices/auth';
import { FormattedMessage } from 'react-intl';

// ========================|| FIREBASE - RESET PASSWORD ||======================== //

const AuthResetPassword = ({ ...others }) => {
  const theme = useTheme();
  const router = useRouter();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const { isLoggedIn } = useAuth();

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

  // useEffect(() => {
  //   const url = window.location.href;
  //   const parts = url.split('?token=');
  //   setToken(parts[1].trim());
  // }, []);

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
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
          const res = await dispatch(resetPassword(values));
          if (res?.success === true) {
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
            router.push('/');
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
              onChange={(e) => {
                handleChange(e);
              }}
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
          {/* {strength !== 0 && (
            <FormControl fullWidth>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box
                      style={{ backgroundColor: level?.color }}
                      sx={{
                        width: 85,
                        height: 8,
                        borderRadius: '7px'
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </FormControl>
          )} */}
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
              onChange={(e) => {
                handleChange(e);
              }}
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
          {/* <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            sx={{ ...theme.typography.customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              label="Confirm Password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
          </FormControl> */}

          {touched.confirmPassword && errors.confirmPassword && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-confirm-password">
                {' '}
                {errors.confirmPassword}{' '}
              </FormHelperText>
            </FormControl>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="secondary" type="submit" disabled={loading} fullWidth size="large" variant="contained">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;
                    <FormattedMessage id="loading" /> ...
                  </>
                ) : (
                  <FormattedMessage id="reset-password" />
                )}
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
