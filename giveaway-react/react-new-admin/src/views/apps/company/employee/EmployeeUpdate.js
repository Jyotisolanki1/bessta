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
  MenuItem,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateEmployeeRequest } from 'store/slices/employee';
import { getBranchAll } from 'store/slices/branch';
import { getAllDepartment } from 'store/slices/department';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';

import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath } from 'config';
import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const EmployeeUpdate = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.branch);
  const allDepartment = useSelector((state) => state.department);

  const imageInputRef = useRef(null);
  const Avatar1 = `${imgPath}${item?.profile_pic}`;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const validationSchema = yup.object({
    profile_pic: yup
      .mixed()
      .test('fileType', <FormattedMessage id="file-type-error" />, (value) => {
        if (!value) return true; // Skip validation if profile_pic is null
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', <FormattedMessage id="file-size-errorror" />, (value) => {
        if (!value) return true; // Skip validation if profile_pic is null
        return value.size <= 2048 * 1024;
      }),
    name: yup
      .string()
      .required(<FormattedMessage id="employee-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="alpha-error" />, (value) => {
        return value && /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="employee-min-error" />)
      .max(70, <FormattedMessage id="employee-max-error" />),
    // email: yup
    //   .string()
    //   .required('Email is required')
    //   .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Entered email is invalid')
    //   .max(100, 'Email must be at most 100 characters'),
    // departmentId: yup.string().required('Department Name is required'),
    branchId: yup.string().required(<FormattedMessage id="branch-name-error" />)
    // salary_no: yup
    //   .string()
    //   .required('Sallary reciept number is required')
    //   .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed')
    //   .min(4, 'Sallary reciept number must be at least 4 characters')
    //   .max(15, 'Sallary reciept number must be at most 15 characters')
    // username: yup
    //   .string()
    //   .required('Username is required')
    //   .matches(
    //     /^[a-zA-Z0-9]+(?:[ _-][a-zA-Z0-9]+)*$/,
    //     'Only alphanumeric characters with optional spaces, underscores, or hyphens are allowed'
    //   )
    //   .min(3, 'Company Name must be at least 3 characters')
    //   .max(15, 'Company Name must be at most 15 characters')
    // pin: yup.string().required('Pin is required').min(4, 'Pin must be a minimum of 4 digits').max(4, 'Pin must be a maximum of 4 digits')
  });

  const initialValues = {
    name: item?.name,
    email: item?.email,
    departmentId: item?.departmentId,
    branchId: item?.branch_info?.branchId,
    salary_no: item?.salary_no,
    username: item?.username,
    // pin: item?.pin,
    profile_pic: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      // formData.append('email', values.email);
      // formData.append('departmentId', values.departmentId);
      formData.append('branchId', values.branchId);
      // formData.append('salary_no', values.salary_no);
      // formData.append('username', values.username);
      // formData.append('pin', values.pin);
      formData.append('role', 'user');
      if (values.profile_pic !== null) {
        formData.append('profile_pic', values.profile_pic);
      }
      formData.append('id', item?.id);
      const res = await dispatch(updateEmployeeRequest(formData));
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
    formik.setFieldError('profile_pic', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('profile_pic', file);
    }
  };

  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);
  React.useEffect(() => {
    dispatch(getBranchAll());
    dispatch(getAllDepartment());
  }, []);
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
              <FormattedMessage id="edit" />
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
                      <Avatar src={selectedImage} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
                    ) : (
                      <Avatar src={Avatar1} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
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
                          {formik.touched.profile_pic && formik.errors.profile_pic && formik.errors.profile_pic}
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
                  label={<FormattedMessage id="name" />}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 70 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  disabled="true"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="username"
                  name="username"
                  label={<FormattedMessage id="username" />}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                  disabled="true"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    <FormattedMessage id="deparment" />
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.departmentId}
                    label="Department"
                    disabled="true"
                  >
                    {allDepartment?.data.map((option, index) => (
                      <MenuItem key={index} value={option?.id}>
                        {option?.departmentName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* <Select
                  name="departmentId"
                  labelId="demo-simple-select-label"
                  value={formik.values.departmentId || 'select'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
                  sx={{ width: '100%' }}
                  disabled="true"
                >
                  <MenuItem selected value="select">
                    Select Department
                  </MenuItem>
                  {allDepartment?.data.map((option, index) => (
                    <MenuItem key={index} value={option?.id}>
                      {option?.departmentName}
                    </MenuItem>
                  ))}
                </Select> */}
                {/* {formik.touched.departmentId && formik.errors.departmentId && (
                  <>
                    {' '}
                    <br />
                    <Typography variant="caption" color="red">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {formik.errors.departmentId}
                    </Typography>
                  </>
                )} */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    <FormattedMessage id="branch" />
                  </InputLabel>
                  <Select
                    name="branchId"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Branch"
                    value={formik.values.branchId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.branchId && Boolean(formik.errors.branchId)}
                    helperText={formik.touched.branchId && formik.errors.branchId}
                    sx={{ width: '100%' }}
                  >
                    {/* <MenuItem selected value="select">
                      Select Branch
                    </MenuItem> */}
                    {data.map((option, index) => (
                      <MenuItem key={index} value={option?.id}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.branchId && formik.errors.branchId && (
                  <>
                    {' '}
                    <br />
                    <Typography variant="caption" color="red">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {formik.errors.branchId}
                    </Typography>
                  </>
                )}
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  id="pin"
                  name="pin"
                  label="Pin *"
                  value={formik.values.pin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pin && Boolean(formik.errors.pin)}
                  helperText={formik.touched.pin && formik.errors.pin}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid> */}
              <Grid item xs={12} sm={12}>
                <TextField
                  id="salary_no"
                  name="salary_no"
                  label={<FormattedMessage id="salary" />}
                  value={formik.values.salary_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.salary_no && Boolean(formik.errors.salary_no)}
                  helperText={formik.touched.salary_no && formik.errors.salary_no}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{
                    maxLength: 15
                  }}
                  disabled="true"
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
                  <FormattedMessage id="edit" />
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

export default EmployeeUpdate;
