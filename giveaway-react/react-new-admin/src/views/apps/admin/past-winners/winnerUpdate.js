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
import { imgPath } from 'config';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, getYear, startOfToday, parseISO } from 'date-fns';
import '../../../../styles/extra.css';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import { updatePastWinnersRequest } from 'store/slices/pastWinner';
// import { startOfDay, parseISO } from 'date-fns';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const UpdateWinner = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state.courses);
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const Avatar1 = `${imgPath}${item?.image}`;
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
      }),
    year: yup
      .string()
      .required('Year is required')
      .test('futureYear', 'Future year not allowed', (value) => {
        if (!value) return false; // year is required
        const selectedYear = new Date(value).getFullYear();
        const currentYear = getYear(new Date());
        return selectedYear <= currentYear;
      }),
    winner: yup
      .string()
      .required('1st Winner required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end'),
    winner2: yup
      .string()
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end'),
    winner3: yup
      .string()
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end'),
    price: yup
      .string()
      .required('Prize 1 is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end')
      .max(100, 'Prize 1 must be at most 100 characters'),
    price2: yup
      .string()
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end')
      .max(100, 'Prize 2 must be at most 100 characters'),
    price3: yup
      .string()
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end')
      .max(100, 'Prize 3 must be at most 100 characters')
  });

  const initialValues = {
    year: item?.year ? parseISO(item.year) : null,
    // year: item?.year ? new Date(item.year) : null,
    winner: item?.winners[0]?.name || '',
    winner2: item?.winners[1]?.name || '',
    winner3: item?.winners[2]?.name || '',
    price: item?.winners[0]?.prize || '',
    price2: item?.winners[1]?.prize || '',
    price3: item?.winners[2]?.prize || '',
    image: null
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);

    const winners = [
      { name: values.winner, prize: values.price },
      { name: values.winner2, prize: values.price2 },
      { name: values.winner3, prize: values.price3 }
    ];

    try {
      const formData = new FormData();
      // Extract the year from the Date object
      formData.append('year', values.year);
      formData.append('image', values.image);
      formData.append('winners', JSON.stringify(winners));
      formData.append('id', item?._id);
      //   formData.append('prizes[1][quantity]', 1);
      //   formData.append('prizes[1][reserves]', 1);
      //   formData.append('prizes[1][description]', values.price2);

      //   formData.append('prizes[2][quantity]', 1);
      //   formData.append('prizes[2][reserves]', 1);
      //   formData.append('prizes[2][description]', values.price3);
      //   // console.log()
      const res = await dispatch(updatePastWinnersRequest(formData));
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
      console.log(error);
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
      fullWidth="true"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Update Winners
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
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    className="fullwidthdate"
                    label="Year"
                    id="year"
                    name="year"
                    value={formik.values.year}
                    onChange={(newValue) => {
                      formik.setFieldValue('year', newValue);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.year && Boolean(formik.errors.year)}
                    helperText={formik.touched.year && formik.errors.year}
                    maxDate={startOfToday()}
                    fullWidth
                  />
                </LocalizationProvider>
                {formik.touched.year && formik.errors.year && (
                  <>
                    {' '}
                    <br />
                    <Typography variant="caption" color="red">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {formik.errors.year}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="winner"
                  name="winner"
                  label="1st Winner"
                  value={formik.values.winner}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.winner)}
                  helperText={formik.touched.price && formik.errors.winner}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  id="winner2"
                  name="winner2"
                  label="2nd Winner"
                  value={formik.values.winner2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.winner2 && Boolean(formik.errors.winner2)}
                  helperText={formik.touched.winner2 && formik.errors.winner2}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  id="winner3"
                  name="winner3"
                  label="3rd Winner"
                  value={formik.values.winner3}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.winner3 && Boolean(formik.errors.winner3)}
                  helperText={formik.touched.winner3 && formik.errors.winner3}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  'Update Past Winners'
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

export default UpdateWinner;
