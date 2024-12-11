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

import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';
import { UpdatePartner } from 'store/slices/partners';
// import { FormattedMessage } from 'react-intl';
import Avatar from 'components/ui-component/extended/Avatar';
import '../../../../styles/extra.css';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import { imgPath } from 'config';
import { getBusinessCat } from 'store/slices/businessCategory';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const EventUpdate = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search] = useState('');
  const Avatar1 = `${imgPath}${item?.image}`;
  const [otherCat, setOtherCat] = useState(false);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const { businessCatData } = useSelector((state) => state.businessCat);

  const stripTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const handleChangeCategory = (e) => {
    const { value } = e.target;
    formik.setFieldValue('category', value);
    setOtherCat(value === 'other');
  };
  const IMAGES_FILE_SUPPORTED_FORMATS = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/JPG',
    'image/JPEG',
    'image/PNG',
    'image/svg',
    'image/svg+xml',
    'imag/SVG+XML',
    'image/SVG'
  ];

  React.useEffect(() => {
    dispatch(getBusinessCat(search));
  }, [dispatch]);
  const validationSchema = yup.object({
    image: yup
      .mixed()
      .nullable()
      .test('fileType', 'Invalid file type.', (value) => {
        if (!value) return true; // Skip validation if logo is null
        return IMAGES_FILE_SUPPORTED_FORMATS.includes(value.type);
      })
      .test('fileSize', 'File size is too large. Maximum size is 2048kb', (value) => {
        if (!value) return true; // Skip validation if logo is null
        return value.size <= 2048 * 1024;
      }),
    firstname: yup
      .string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .required('First Name is required')
      .max(35, 'First name should less than 35 character or equal'),

    lastname: yup
      .string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .required('Last Name is required')
      .max(35, 'Last name should less than 35 character or equal'),
    phone: yup.string().min(5, 'Enter a valid phone number').max(15, 'Enter a valid phone number').required('Phone number is required'),
    business_name: yup
      .string()
      .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Only alphanumeric characters are allowed with a single space between words')
      .required('Business name is required')
      .max(35, 'Business name should less than 50 character or equal'),
    address: yup.string().trim().required('Street address is required').max(50, 'Address should be less than or equal to 50 characters'),
    city: yup
      .string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'City name should be equal or less than 35 character')
      .required('City is required'),
    state: yup
      .string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'State name should be equal or less than 35 character')
      .required('State/Province is required'),
    category: yup.string().required('Category is required'),
    other_category: yup.string().when('category', {
      is: 'other',
      then: (schema) =>
        schema
          .required('Other category is required')
          .max(35, 'Other category should be less than or equal to 35 characters')
          .matches(
            /^[^\s]+(\s[^\s]+)*$/,
            'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.'
          ),
      otherwise: (schema) => schema.notRequired()
    }),
    abn: yup
      .string()
      .required('ABN is required')
      .matches(/^\d+$/, 'ABN must contain only numbers.')
      .min(11, 'ABN number should be exactly 11 digits.')
      .max(11, 'ABN number should be exactly 11 digits.'),
    business_url: yup.string().url('Invalid website format').required('Business website is required')
  });

  const initialValues = {
    firstname: item?.firstname || '',
    lastname: item?.lastname || '',
    phone: item?.phone || '',
    id: item?._id,
    business_name: item?.bussiness_name || '',
    image: null,
    category: item?.categoryData[0]?._id || null,
    other_category: '',
    address: item?.address || '',
    city: item?.city || '',
    state: item?.state || '',
    abn: item?.abn || '',
    business_url: item?.bussiness_url
  };

  const handleKeyBlock = (e) => {
    if (e.key === '+' || e.key === '.' || e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', item._id);
      formData.append('firstname', values.firstname);
      formData.append('lastname', values.lastname);
      formData.append('bussiness_name', values.business_name);
      formData.append('phone', values.phone);
      formData.append('city', values.city);
      formData.append('state', values.state);
      formData.append('address', values.address);
      formData.append('bussiness_url', values.business_url);
      formData.append('abn', values.abn);
      if (values.image !== null) {
        formData.append('image', values.image);
      }

      if (!values.other_category) {
        formData.append('category', values.category);
      } else {
        formData.append('other_category', values.other_category);
      }
      const res = await dispatch(UpdatePartner(formData));
      if (res?.success === true) {
        setLoading(false);
        resetForm();
        dispatch(
          openSnackbar({
            open: true,
            message: 'Partner details updated successfully',
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
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true
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
              Update Partner Details
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
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                            ref={imageInputRef}
                            accept={IMAGES_FILE_SUPPORTED_FORMATS.join(',')}
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
                  id="business_name"
                  name="business_name"
                  label="Business Name"
                  value={formik.values.business_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.business_name && Boolean(formik.errors.business_name)}
                  helperText={formik.touched.business_name && formik.errors.business_name}
                  fullWidth
                  autoComplete="business_name"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onKeyDown={handleKeyBlock}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                  autoComplete="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Category"
                    name="category"
                    value={formik.values.category}
                    onChange={handleChangeCategory}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {businessCatData?.map((item) => (
                      // eslint-disable-next-line no-underscore-dangle
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Others</MenuItem>
                  </Select>
                  {formik.touched.category && formik.errors.category && <FormHelperText error>{formik.errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              {otherCat ? (
                <Grid item xs={12}>
                  <TextField
                    label="Other Category"
                    name="other_category"
                    value={formik.values.other_category}
                    onChange={formik.handleChange}
                    error={formik.touched.other_category && Boolean(formik.errors.other_category)}
                    helperText={formik.touched.other_category && formik.errors.other_category}
                    fullWidth
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <TextField
                  label="Business Website"
                  name="business_url"
                  value={formik.values.business_url}
                  onChange={formik.handleChange}
                  error={formik.touched.business_url && Boolean(formik.errors.business_url)}
                  helperText={formik.touched.business_url && formik.errors.business_url}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ABN"
                  name="abn"
                  value={formik.values.abn}
                  onChange={formik.handleChange}
                  onKeyDown={handleKeyBlock}
                  error={formik.touched.abn && Boolean(formik.errors.abn)}
                  helperText={formik.touched.abn && formik.errors.abn}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="State / Province"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  fullWidth
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
                  'Update Parnter'
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

export default EventUpdate;
