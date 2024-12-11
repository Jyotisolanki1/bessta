import React, { useState, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Grid,
  Stack,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import { resetUserPassword } from 'store/slices/users';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as yup from 'yup';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const SendNotification = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const quillRef = useRef(null); // Consider removing if not used

  const validationSchema = yup.object({
    password: yup
      .string()
      .required('Password is Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      )
      .min(8, 'Password must be at least 8 characters')
      .max(15, 'Password must be less than 15 characters'),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const initialValues = {
    password: '',
    confirm_password: '',
    id: item?._id // eslint-disable-line no-underscore-dangle
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await dispatch(resetUserPassword(values));
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
        close(true);
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
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validationSchema
  });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Reset Password
            </Grid>
            <Grid item xs={6}>
              <IconButton color="inherit" onClick={() => close(false)} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.password && Boolean(formik.errors.password)}>
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'} // Toggle between text and password
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 100 }}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={{
                      endAdornment: (
                        <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      )
                    }}
                  />
                  <FormHelperText>{formik.touched.password && formik.errors.password}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}>
                  <TextField
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 100 }}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      )
                    }}
                  />
                  <FormHelperText>{formik.touched.confirm_password && formik.errors.confirm_password}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;Loading ...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </Stack>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SendNotification;
