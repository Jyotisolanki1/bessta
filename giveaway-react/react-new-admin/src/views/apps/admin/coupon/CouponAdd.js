/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  InputLabel,
  MenuItem,
  Grid,
  Stack,
  FormHelperText,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  FormControl,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addCouponRequest } from 'store/slices/coupons';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import { FormattedMessage } from 'react-intl';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

function getYoutubeVideoId(url) {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[1].length === 11) {
    return match[1];
  } else {
    return 1;
  }
}

function getVimeoVideoId(url) {
  const regExp =
    /https:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  if (match) {
    return match[3];
  } else {
    return 1;
  }
}




const CourseAdd = ({ open, close }) => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state.courses);
  const [loading, setLoading] = useState(false);
  const validationSchema = yup.object({
    code: yup
      .string()
      .required('Coupon code is required')
      .test('no-spaces', 'Spaces are not allowed in the coupon code.', (value) => {
        return value && /^\S+$/.test(value);
      })
      .min(2, 'Coupon code must be at least 2 characters')
      .max(50, 'Coupon code must be at most 50 characters'),
    description: yup
      .string()
      .required('Description is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Description be at least 2 characters')
      .max(250, 'Description must be at most 250 characters'),
    discountType: yup.string().required('Discount type is required'),
    value: yup
    .string()
    .required('Discount value is required')
    .test('is-positive-integer', 'Discount value must be a positive number greater than zero', (value) => {
      // Ensure value is a positive number greater than zero
      return /^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) > 0;
    }),
    expirDate: yup.string().required('Expiry date is required')
  });

  const initialValues = {
    code: '',
    description: '',
    discountType: '',
    value: '',
    expirDate: null
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const res = await dispatch(
        addCouponRequest({
          code: values.code,
          description: values.description,
          discountType: values.discountType,
          value: values.value,
          expirDate: values.expirDate
        })
      );
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


  const handleInput = (event) => {
    const { target } = event;
    let { value } = target;
    // Remove any non-numeric characters except dot (.)
    value = value.replace(/[^0-9.]/g, '');
  
    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = value.split('.');
 
    // Limit the decimal part to two digits
    if (decimalPart && decimalPart.length > 2) {
      value = `${integerPart}.${decimalPart.slice(0, 2)}`;
      target.value = value; // Update the input field value
      target.blur(); // Blur the input field to prevent further input
      return; // Exit the function to prevent further processing
    }
    // Update the value in the formik state
    formik.setFieldValue('value', value);
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
              Add Coupon
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
            <Grid container spacing={3} sc={{ pt: 1 }}>
              <Grid item xs={12} sm={12} sx={{mt:2}}>
                <TextField
                  id="code"
                  name="code"
                  label="Coupon Code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 250 }}
                  rows={5}
                  multiline
                />
                <span style={{ float: 'right' }}>{formik?.values?.description?.length} / 250</span>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth error={formik.touched.discountType && Boolean(formik.errors.discountType)}>
                  <InputLabel id="status-label">Discount Type</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="Discount Type"
                    name="discountType"
                    value={formik.values.discountType || 'select'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="select" disabled>
                      Please Select
                    </MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                  {formik.touched.discountType && formik.errors.discountType && (
                    <FormHelperText>{formik.errors.discountType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="value"
                  name="value"
                  label="Discount Value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onInput={handleInput}
                  error={formik.touched.value && Boolean(formik.errors.value)}
                  helperText={formik.touched.value && formik.errors.value}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{
                    type: 'number',
                    inputMode: 'numeric',
                    onKeyDown: handleKeyDown,
                    pattern: '[0-9]*',
                    style: { appearance: 'textfield', width: '100%' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expiry Date"
                    id="expirDate"
                    name="expirDate"
                    defaultValue={formik.values.expirDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('expirDate', newValue);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.expirDate && Boolean(formik.errors.expirDate)}
                    helperText={formik.touched.expirDate && formik.errors.expirDate}
                    fullWidth
                    autoComplete="family-name"
                    // minDate={startOfDay(new Date())}
                    disablePast="true"
                  />
                </LocalizationProvider>
                {formik.touched.expirDate && formik.errors.expirDate && (
                  <>
                    {' '}
                    <br />
                    <Typography variant="caption" color="red">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {formik.errors.expirDate}
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
              {/* <AnimateButton> */}
              <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;Loading ...
                  </>
                ) : (
                  'Add Coupon'
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

export default CourseAdd;
