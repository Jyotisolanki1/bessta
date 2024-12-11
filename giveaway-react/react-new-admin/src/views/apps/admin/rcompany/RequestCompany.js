/* eslint-disable arrow-body-style */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addCompanyRequest } from 'store/slices/company';
import { useDispatch } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';

import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Avatar from 'components/ui-component/extended/Avatar';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormattedMessage } from 'react-intl';
import { countries } from 'config';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const RequestCompany = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const imageInputRef = useRef(null);
  const Avatar1 = '/assets/images/users/defaultlogo.png';
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '', label: '', phone: '' });
  const validationSchema = yup.object({
    logo: yup
      .mixed()
      .required('Logo image is required')
      .test('fileType', <FormattedMessage id="file-type-error" />, (value) => {
        if (!value) return true;
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', <FormattedMessage id="file-size-errorror" />, (value) => {
        if (!value) return true;
        return value && value.size <= 2048 * 1024; // 125kb
      }),
    company_name: yup
      .string()
      .required(<FormattedMessage id="company-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="comp-name-min-errorr" />)
      .max(50, <FormattedMessage id="comp-name-max-error" />),
    company_owner: yup
      .string()
      .required(<FormattedMessage id="company-owner-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="alpha-error" />, (value) => {
        return value && /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="comp-owner-name-min-error" />)
      .max(50, <FormattedMessage id="comp-owner-name-max-error" />),
    email: yup
      .string()
      .test('no-multi-spaces', <FormattedMessage id="email-error-invalid" />, (value) => {
        return value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      })
      .required(<FormattedMessage id="email-error" />)
      .max(100, <FormattedMessage id="email-max-error" />),
    password: yup
      .string()
      .required(<FormattedMessage id="password-error" />)
      .test('password-spaces', <FormattedMessage id="password-error-type" />, (value) => {
        return value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value);
      })
      .min(8, <FormattedMessage id="password-min-error" />)
      .max(25, <FormattedMessage id="password-min-error" />),
    country_code: yup.string().required(<FormattedMessage id="country-code-error" />),
    phone_number: yup
      .string()
      .required(<FormattedMessage id="phone-number-error" />)
      .test('not-all-zeros', <FormattedMessage id="phone-zero-error" />, (value) => {
        return !/^[0]*$/.test(value);
      })
      .min(5, <FormattedMessage id="phone-min-error" />)
      .max(15, <FormattedMessage id="phone-man-error" />),
    address: yup
      .string()
      .required(<FormattedMessage id="address-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="address-min-error" />)
      .max(100, <FormattedMessage id="address-max-error" />),
    city: yup
      .string()
      .required(<FormattedMessage id="city-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="city-min-error" />)
      .max(100, <FormattedMessage id="city-max-error" />),
    state: yup
      .string()
      .required(<FormattedMessage id="state-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="state-min-error" />)
      .max(100, <FormattedMessage id="state-max-error" />),
    ip: yup
      .string()
      .required(<FormattedMessage id="ip-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="ip-min-error" />)
      .max(50, <FormattedMessage id="ip-max-error" />),
    port: yup
      .string()
      .required(<FormattedMessage id="port-error" />)
      .min(4, <FormattedMessage id="port-min-error" />)
      .max(6, <FormattedMessage id="port-max-error" />)
  });

  const initialValues = {
    company_name: item?.company_name,
    company_owner: item?.company_owner,
    email: item?.email,
    password: item?.password,
    country_code: item?.country_code,
    phone_number: item?.phone_number,
    address: item?.address,
    city: item?.city,
    state: item?.state,
    ip: item?.ip,
    port: item?.port,
    logo: null
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.company_name);
      formData.append('owner', values.company_owner);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('country_code', values.country_code);
      formData.append('phone_number', values.phone_number);
      formData.append('address', values.address);
      formData.append('city', values.city);
      formData.append('state', values.state);
      formData.append('ip', values.ip);
      formData.append('port', values.port);
      formData.append('logo', values.logo);
      formData.append('reqId', item?.id);
      const res = await dispatch(addCompanyRequest(formData));
      if (res?.succeeded === true) {
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
        close(true);
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
    } catch (error) {
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
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldError('logo', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('logo', file);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);
  useEffect(() => {
    const data = countries.find((ph) => ph.phone === item?.country_code);
    setSelectedCountry(data);
  }, [item?.country_code]);

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
              <FormattedMessage id="approve-company" />
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
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {selectedImage ? (
                      <Avatar
                        alt={<FormattedMessage id="upload-image" />}
                        src={selectedImage}
                        sx={{ height: 120, width: 120, borderRadius: '8px' }}
                      />
                    ) : (
                      <Avatar
                        alt={<FormattedMessage id="upload-image" />}
                        src={Avatar1}
                        sx={{ height: 120, width: 120, borderRadius: '8px' }}
                      />
                    )}
                  </Grid>
                  <Grid item sm zeroMinWidth>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Label for the file input */}
                          <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span">
                              <FormattedMessage id="upload-image" />
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
                          <FormattedMessage id="img-size-dis" />
                        </Typography>
                        <br />
                        <Typography variant="caption" style={{ color: 'red' }}>
                          {formik.touched.logo && formik.errors.logo && formik.errors.logo}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="company_name"
                  name="company_name"
                  label={<FormattedMessage id="company-name" />}
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
                  label={<FormattedMessage id="owner-name" />}
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
                  label={<FormattedMessage id="email" />}
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
              <Grid item xs={12} sm={12}>
                <TextField
                  id="password"
                  name="password"
                  label={<FormattedMessage id="password" />}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                  autoComplete="family-name"
                  InputProps={{
                    maxLength: 100,
                    endAdornment: (
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
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                {/* <TextField
                  id="country_code"
                  name="country_code"
                  label={<FormattedMessage id="country-code" />}
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
                  // value={item?.country_code}
                  value={selectedCountry}
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => `${option.label} (${option.phone})`}
                  onChange={(event, value) => {
                    setSelectedCountry(value);
                    formik.setFieldValue('country_code', value?.phone ? value.phone : '');
                    formik.setFieldTouched('country_code', true, false); // Mark the field as touched
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country Code *"
                      // value={formik.values.country_code}
                      defaultValue={formik.values.country_code}
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
                  label={<FormattedMessage id="phone-number" />}
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
                  label=<FormattedMessage id="address" />
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
                  label={<FormattedMessage id="state" />}
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
                  label={<FormattedMessage id="city" />}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  id="port"
                  name="port"
                  label={<FormattedMessage id="port" />}
                  value={formik.values.port}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.port && Boolean(formik.errors.port)}
                  helperText={formik.touched.port && formik.errors.port}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{
                    maxLength: 15,
                    type: 'number',
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    inputProps: {
                      style: { appearance: 'textfield', width: '100%' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="ip"
                  name="ip"
                  label={<FormattedMessage id="ip" />}
                  value={formik.values.ip}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ip && Boolean(formik.errors.ip)}
                  helperText={formik.touched.ip && formik.errors.ip}
                  fullWidth
                  autoComplete="family-name"
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
                    &nbsp;
                    <FormattedMessage id="loading" />
                    ...
                  </>
                ) : (
                  <FormattedMessage id="approve" />
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
