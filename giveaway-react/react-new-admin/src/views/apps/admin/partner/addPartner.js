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

import React, { useState, useRef } from 'react';
import {
  Button,
  Dialog,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
  DialogActions,
  Stack
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import CloseIcon from '@mui/icons-material/Close';
import '../../../../styles/extra.css';
import { getBusinessCat } from 'store/slices/businessCategory';
import { AddPartners } from 'store/slices/partners';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const AddPartner = ({ open, close }) => {
  const [otherCat, setOtherCat] = useState(false);
  const fileRef = useRef(null);
  // const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search] = useState('');
  const [loading, setLoading] = useState(false);

  const { businessCatData } = useSelector((state) => state.businessCat);
  // const handleTogglePassword = () => {
  //   setShowPassword((prev) => !prev);
  // };

  // const handleEyePress = () => {
  //   handleTogglePassword();
  // };

  const handleKeyBlock = (e) => {
    if (e.key === '+' || e.key === '.' || e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };
  React.useEffect(() => {
    dispatch(getBusinessCat(search));
  }, [dispatch]);
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
  const initialValues = {
    business_name: '',
    business_url: '',
    abn: '',
    email: '',
    address: '',
    city: '',
    state: '',
    profile_pic: '',
    other_category: '',
    category: ''
  };

  const handleChangeCategory = (e) => {
    const { value } = e.target;
    formik.setFieldValue('category', value);
    setOtherCat(value === 'other');
  };

  const validationSchema = Yup.object({
    // firstname: Yup.string()
    //   .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
    //   .required('First Name is required')
    //   .max(35, 'First name should less than 35 character or equal'),
    // lastname: Yup.string()
    //   .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
    //   .required('Last Name is required')
    //   .max(35, 'Last name should less than 35 character or equal'),
      abn: Yup.string()
      .required('ABN is required')
      .matches(/^\d+$/, 'ABN must contain only numbers.')
      .min(11, 'ABN number should be exactly 11 digits.')
      .max(11, 'ABN number should be exactly 11 digits.'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    // phone: Yup.string().min(5, 'Enter a valid phone number').max(15, 'Enter a valid phone number').required('Phone number is required'),
    address: Yup.string().trim().required('Street address is required').max(50, 'Address should be less than or equal to 50 characters'),
    city: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'City name should be equal or less than 35 character')
      .required('City is required'),
    state: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'State name should be equal or less than 35 character')
      .required('State/Province is required'),
    business_name: Yup.string()
      .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Only alphanumeric characters are allowed with a single space between words')
      .required('Business name is required')
      .max(35, 'Business name should less than 50 character or equal'),
    business_url: Yup.string().url('Invalid website format').required('Business website is required'),
    // password: Yup.string()
    //   .required('Password is required')
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    //     'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    //   )
    //   .min(8, 'Password must be at least 8 characters'),
    // category: Yup.string().required('Category is required'),
    profile_pic: Yup.mixed()
      .required('Company logo field is required')
      .test('FILE_FORMAT', 'Invalid file type', (value) => value && IMAGES_FILE_SUPPORTED_FORMATS.includes(value.type.toString()))
      .test('FILE_SIZE', 'Please select an image smaller than 10 MB', (value) => !value || (value && value.size <= 1024 * 1024 * 10)),
    category: Yup.string().required('Category is required'),
    other_category: Yup.string().when('category', {
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
    })
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // formData.append('firstname', values.firstname);
      // formData.append('lastname', values.lastname);
      formData.append('bussiness_name', values.business_name);
      // formData.append('phone', values.phone);
      formData.append('city', values.city);
      formData.append('state', values.state);
      formData.append('address', values.address);
      formData.append('bussiness_url', values.business_url);
      formData.append('abn', values.abn);
      formData.append('email', values.email);
      // formData.append('password', values.password);

      if (values.profile_pic !== null) {
        formData.append('image', values.profile_pic);
      }

      if (!values.other_category) {
        formData.append('category', values.category);
      } else {
        formData.append('other_category', values.other_category);
      }
      const res = await dispatch(AddPartners(formData));
      if (res?.success === true) {
        setLoading(false);
        resetForm();
        dispatch(
          openSnackbar({
            open: true,
            message: res.message,
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
    validateOnBlur: true,
  });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="md"
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Add Partner
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
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12} md={12}>
              <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Contact Details
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                  <Grid container spacing={2}>
                   
                    <Grid item xs={12}>
                      <TextField
                        label="Business Name"
                        name="business_name"
                        value={formik.values.business_name}
                        onChange={formik.handleChange}
                        error={formik.touched.business_name && Boolean(formik.errors.business_name)}
                        helperText={formik.touched.business_name && formik.errors.business_name}
                        fullWidth
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
                        {formik.touched.category && formik.errors.category && (
                          <FormHelperText error>{formik.errors.category}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      {otherCat && (
                        <TextField
                          label="Other Category"
                          name="other_category"
                          value={formik.values.other_category}
                          onChange={formik.handleChange}
                          error={formik.touched.other_category && Boolean(formik.errors.other_category)}
                          helperText={formik.touched.other_category && formik.errors.other_category}
                          fullWidth
                        />
                      )}
                    </Grid>

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
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <label className="form-label">
                        Company Logo<span style={{ color: 'red' }}>*</span>
                      </label>
                      <TextField
                        ref={fileRef}
                        type="file"
                        name="profile_pic"
                        onChange={(event) => {
                          formik.setFieldValue('profile_pic', event.target.files[0]);
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          marginBottom: '5px ',
                          marginTop: '5px ',
                          borderColor: formik.touched.profile_pic && formik.errors.profile_pic ? 'red' : ''
                        }}
                        accept={IMAGES_FILE_SUPPORTED_FORMATS.join(',')}
                        onBlur={formik.handleBlur}
                      />
                      <label>(Note: Only JPEG, JPG, PNG, GIF image type allowed)</label>
                      {formik.touched.profile_pic && formik.errors.profile_pic && (
                        <label
                          style={{
                            color: 'red',
                            fontFamily: 'cursive',
                            fontSize: '13px'
                          }}
                        >
                          {formik.errors.profile_pic}
                        </label>
                      )}
                      {/* <Typography variant="h6">(Note: Only JPEG, JPG, PNG, GIF image type allowed)</Typography> */}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h5" sx={{ marginBottom: 2 }}>
                        Business Address
                      </Typography>
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
                </form>
              </Box>
            </Grid>
          </Grid>
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
                  'Add Partner'
                )}
              </Button>
              {/* </AnimateButton> */}
            </Stack>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddPartner;
