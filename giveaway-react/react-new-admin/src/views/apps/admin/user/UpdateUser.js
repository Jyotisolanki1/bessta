/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React, { useState } from 'react';
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
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'store';
import { updateUserApi } from 'store/slices/users';

import { openSnackbar } from 'store/slices/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import '../../../../styles/extra.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const UpdateUser = ({ item, open, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    firstname: yup
      .string()
      .required('First name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .matches(/^[^\d]*$/, 'First name should not contain numbers')
      .max(35, 'First name should less than 35 character or equal'),

    lastname: yup
      .string()
      .required('Last name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .matches(/^[^\d]*$/, 'Last name should not contain numbers')
      .max(35, 'First name should less than 35 character or equal'),

    phone: yup
      .string()
      .min(5, 'Enter a valid phone number')
      .max(15, 'Enter a valid phone number')
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number should only contain digits'),

    dob: yup.date().required('Date of Birth is required')
  });

  const initialValues = {
    firstname: item?.firstname || '',
    lastname: item?.lastname || '',
    dob: item?.dob ? parseISO(item.dob) : null,
    phone: item?.phone || '',
    id: item?._id,
    ageConfirmation: false
  };

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      dob: values.dob ? moment(values.dob).format('YYYY-MM-DD') : null
    };
    try {
      const res = await dispatch(updateUserApi(formattedValues));
      if (res?.success === true) {
        setLoading(false);
        resetForm();
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
    } catch (error) {
      setLoading(false);
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
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema
  });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Update User Details
            </Grid>
            <Grid item xs={6}>
              <IconButton
                color="inherit"
                onClick={() => {
                  close(false);
                }}
                aria-label="close"
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                  helperText={formik.touched.firstname && formik.errors.firstname}
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                  helperText={formik.touched.lastname && formik.errors.lastname}
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                  autoComplete="phone"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    className="fullwidthdate"
                    label="DOB"
                    id="dob"
                    name="dob"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                    value={formik.values.dob}
                    onChange={(newValue) => {
                      formik.setFieldValue('dob', newValue);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                    helperText={formik.touched.dob && formik.errors.dob}
                    fullWidth
                    autoComplete="off"
                    inputFormat="MM/dd/yyyy"
                    renderInput={(props) => <TextField {...props} InputProps={{ readOnly: true }} />}
                  />
                </LocalizationProvider>
                {formik.touched.dob && formik.errors.dob && (
                  <>
                    <br />
                    <Typography variant="caption" color="error">
                      {formik.errors.dob}
                    </Typography>
                  </>
                )}
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
                  'Update'
                )}
              </Button>
            </Stack>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateUser;
