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
  TransitionProps,
  MenuItem,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addCategoryRequest } from 'store/slices/products';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';

import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Avatar from 'components/ui-component/extended/Avatar';

import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Employee = ({ open, close }) => {
  const dispatch = useDispatch();

  const imageInputRef = useRef(null);
  const Avatar1 = ``;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const validationSchema = yup.object({
    icon: yup
      .mixed()
      .required('Category icon is required')
      .test('fileType', 'Invalid file type. Only images are allowed', (value) => {
        if (!value) return true; // Skip validation if icon is null
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', 'File size is too large. Maximum size is 2048kb', (value) => {
        if (!value) return true; // Skip validation if icon is null
        return value.size <= 2048 * 1024;
      }),
    name: yup
      .string()
      .required('Category name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name must be at most 50 characters'),
    slug: yup
      .string()
      .required('Slug is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Slug be at least 2 characters')
      .max(50, 'Slug must be at most 50 characters'),
    tags: yup
      .string()
      .required('Tags is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Tags must be at least 2 characters')
      .max(50, 'Tags must be at most 50 characters')
  });

  const initialValues = {
    name: '',
    slug: '',
    tags: '',
    icon: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('slug', values.slug);
      formData.append('tags', values.tags);
      formData.append('icon', values.icon);

      const res = await dispatch(addCategoryRequest(formData));
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldError('icon', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('icon', file);
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
              Add Category
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
                              Upload Icon
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
                          {formik.touched.icon && formik.errors.icon && formik.errors.icon}
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
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="slug"
                  name="slug"
                  label="Slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="tags"
                  name="tags"
                  label="Tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tags && Boolean(formik.errors.tags)}
                  helperText={formik.touched.tags && formik.errors.tags}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
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
                  'Add Category'
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

export default Employee;
