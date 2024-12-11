/* eslint-disable dot-notation */
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
import { addEventRequest } from 'store/slices/events';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { startOfDay, parseISO } from 'date-fns';

// import { FormattedMessage } from 'react-intl';
import Avatar from 'components/ui-component/extended/Avatar';
import '../../../../styles/extra.css';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const EventAdd = ({ open, close }) => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state.courses);
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const Avatar1 = '/assets/images/users/defaultlogo.png';
  const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  const validationSchema = yup.object({
    image: yup
      .mixed()
      .nullable()
      .test('fileType', 'Invalid file type. Only images are allowed', (value) => {
        if (!value) return true; // Skip validation if logo is null
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', 'File size is too large. Maximum size is 2048kb', (value) => {
        if (!value) return true; // Skip validation if logo is null
        return value.size <= 2048 * 1024;
      })
      .required('Image is required'),
    name: yup
      .string()
      .required('Name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    discription: yup
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
      scheduleDate: yup
        .date()
        .typeError('Invalid Schedule date') // Custom error message for invalid date
        .required('Schedule date is required')
        .min(stripTime(new Date()), 'Schedule date cannot be in the past'),
    price: yup
      .string()
      .required('Prize 1 is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Prize 1 must be at least 2 characters')
      .max(100, 'Prize 1 must be at most 100 characters'),
    price2: yup
      .string()
      .required('Prize 2 is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end')
      .min(2, 'Prize 2 must be at least 2 characters')
      .max(100, 'Prize 2 must be at most 100 characters'),
    price3: yup
      .string()
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end')
      .required('Prize 3 is required')
      .min(2, 'Prize 3 must be at least 2 characters')
      .max(100, 'Prize 3 must be at most 100 characters')
  });

  const initialValues = {
    name: '',
    discription: '',
    scheduleDate: null,
    price: '',
    price2: '',
    price3: '',
    image: null
  };
  const onSubmit = async (values, { resetForm }) => {
    console.log(values.scheduleDate);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('scheduleDate', values.scheduleDate);
      formData.append('discription', values.discription);
      formData.append('image', values.image);
      formData.append('prizes[0][quantity]', 1);
      formData.append('prizes[0][reserves]', 1);
      formData.append('prizes[0][description]', values.price);

      formData.append('prizes[1][quantity]', 1);
      formData.append('prizes[1][reserves]', 1);
      formData.append('prizes[1][description]', values.price2);

      formData.append('prizes[2][quantity]', 1);
      formData.append('prizes[2][reserves]', 1);
      formData.append('prizes[2][description]', values.price3);
      // console.log()
      const res = await dispatch(addEventRequest(formData));
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldError('image', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('image', file);
    }
  };
  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);
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
              Add Draw
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
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {selectedImage ? (
                      <Avatar alt="Upload Image" src={selectedImage} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
                    ) : (
                      <Avatar alt="Upload Image" src={Avatar1} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
                    )}
                  </Grid>
                  <Grid item sm zeroMinWidth>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Label for the file input */}
                          <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span">
                              Upload Image
                            </Button>
                          </label>
                          {/* Actual file input with style display: 'none' */}
                          <input
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                            ref={imageInputRef}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">
                          <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                          Image size Limit should be 2048kb Max
                        </Typography>
                        <br />
                        <Typography variant="caption" style={{ color: 'red' }}>
                          {formik.touched.image && formik.errors.image && formik.errors.image}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="discription"
                  name="discription"
                  label="Description"
                  value={formik.values.discription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.discription && Boolean(formik.errors.discription)}
                  helperText={formik.touched.discription && formik.errors.discription}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 250 }}
                  rows={5}
                  multiline
                />
                <span style={{ float: 'right' }}>{formik?.values?.discription?.length} / 250</span>
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    className="fullwidthdate"
                    label="Schedule Date"
                    id="scheduleDate"
                    name="scheduleDate"
                    defaultValue={formik.values.scheduleDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('scheduleDate', newValue);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.scheduleDate && Boolean(formik.errors.scheduleDate)}
                    helperText={formik.touched.scheduleDate && formik.errors.scheduleDate}
                    fullWidth
                    autoComplete="family-name"
                    minDate={startOfDay(new Date())}
                    // disablePast="true"
                  />
                </LocalizationProvider>
                {formik.touched.scheduleDate && formik.errors.scheduleDate && (
                  <>
                    {' '}
                    <br />
                    <Typography variant="caption" color="red">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {formik.errors.scheduleDate}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="price"
                  name="price"
                  label="Prize 1"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="price2"
                  name="price2"
                  label="Prize 2"
                  value={formik.values.price2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price2 && Boolean(formik.errors.price2)}
                  helperText={formik.touched.price2 && formik.errors.price2}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="price3"
                  name="price3"
                  label="Prize 3"
                  value={formik.values.price3}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price3 && Boolean(formik.errors.price3)}
                  helperText={formik.touched.price3 && formik.errors.price3}
                  fullWidth
                  autoComplete="given-name"
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
                    &nbsp;Loading ...
                  </>
                ) : (
                  'Add Draw'
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

export default EventAdd;
