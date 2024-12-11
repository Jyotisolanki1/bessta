/* eslint-disable lines-around-directive */
/* eslint-disable arrow-body-style */
'use client';

import React, { useMemo, useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TransitionProps,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
  Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addRequest } from 'store/slices/company';
import { useDispatch } from 'store';

import { openSnackbar } from 'store/slices/snackbar';
import { countries } from 'config';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';

import '../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const RequestCompany = ({ open, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const res = await dispatch(addRequest(values));
      // console.log(res);
      setLoading(false);
      resetForm();
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
      close();
    } catch (error) {
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
  };
  const validationSchema = yup.object({
    company_name: yup
      .string()
      .required('Company Name is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed')
      .min(2, 'Company Name must be at least 2 characters')
      .max(50, 'Company Name must be at most 50 characters'),
    company_owner: yup
      .string()
      .required('Company Owner Name is required')
      .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Only alphabets with single spaces allowed')
      .min(2, 'Company Owner Name must be at least 2 characters')
      .max(50, 'Company Owner Name must be at most 50 characters'),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Entered email is invalid')
      .required('Email is required')
      .max(100, 'Email must be at most 100 characters'),
    country_code: yup.string().required('Country Code is required'),
    phone_number: yup
      .string()
      .required('Phone Number is required')
      .test('not-all-zeros', 'Phone Number cannot consist entirely of zeros', (value) => {
        return !/^[0]*$/.test(value);
      })
      .min(5, 'Phone Number must be at least 5 characters')
      .max(15, 'Phone Number must be at most 15 characters'),
    address: yup
      .string()
      .required('Address is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed')
      .min(2, 'Address must be at least 2 characters')
      .max(100, 'Address must be at most 250 characters'),
    city: yup
      .string()
      .required('City is required')
      .test('alphabets-only', 'Only alphabets with single spaces are allowed', (value) => {
        return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value);
      })
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must be at most 100 characters'),
    state: yup
      .string()
      .required('State is required')
      .test('alphabets-only', 'Only alphabets with single spaces are allowed', (value) => {
        return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value);
      })
      .min(2, 'State must be at least 2 characters')
      .max(100, 'State must be at most 100 characters')
  });

  const initialValues = {
    company_name: '',
    company_owner: '',
    email: '',
    country_code: '',
    phone_number: '',
    address: '',
    city: '',
    state: ''
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema
  });

  const handleKeyDown = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([37, 38, 39, 40, 189].includes(keyCode)) {
      event.preventDefault();
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Register Company
            </Grid>
            <Grid item xs={6}>
              <IconButton color="inherit" onClick={close} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid container spacing={3}>
              {/* <Grid item xs={12}>
                &nbsp;
              </Grid> */}
              <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                <TextField
                  id="company_name"
                  name="company_name"
                  label="Company Name *"
                  value={formik.values.company_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                  helperText={formik.touched.company_name && formik.errors.company_name}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="company_owner"
                  name="company_owner"
                  label="Company Owner Name *"
                  value={formik.values.company_owner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.company_owner && Boolean(formik.errors.company_owner)}
                  helperText={formik.touched.company_owner && formik.errors.company_owner}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="email"
                  name="email"
                  label="Email *"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                {/* <TextField
                  id="country_code"
                  name="country_code"
                  label="Country Code *"
                  value={formik.values.country_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.country_code && Boolean(formik.errors.country_code)}
                  helperText={formik.touched.country_code && formik.errors.country_code}
                  fullWidth
                  autoComplete="family-name"
                /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={countries}
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => `${option.label} (${option.phone})`}
                  onChange={(event, value) => {
                    formik.setFieldValue('country_code', value?.phone ? value.phone : '');
                    formik.setFieldTouched('country_code', true, false); // Mark the field as touched
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country Code *"
                      error={formik.touched.country_code && Boolean(formik.errors.country_code)}
                      helperText={formik.touched.country_code && formik.errors.country_code}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="phone_number"
                  name="phone_number"
                  label="Phone Number *"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                  helperText={formik.touched.phone_number && formik.errors.phone_number}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{
                    maxLength: 15,
                    type: 'number',
                    inputMode: 'numeric',
                    onKeyDown: handleKeyDown,
                    pattern: '[0-9]*',
                    inputProps: {
                      style: { appearance: 'textfield', width: '100%' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="address"
                  name="address"
                  label="Address *"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 250 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="state"
                  name="state"
                  label="State *"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="city"
                  name="city"
                  label="City *"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              {/* <AnimateButton> */}
              <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;Loading...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
              {/* </AnimateButton> */}
            </Stack>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestCompany;
