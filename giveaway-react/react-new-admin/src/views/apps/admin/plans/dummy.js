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
  FormControl
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addPlanRequest, getCategories } from 'store/slices/plans';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import CloseIcon from '@mui/icons-material/Close';

// import { FormattedMessage } from 'react-intl';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const PlanAdd = ({ open, close }) => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state.plans);
  const [loading, setLoading] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Plan name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Plan name must be at least 2 characters')
      .max(100, 'Plan name must be at most 100 characters'),
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
      .min(2, 'Description be at least 2 characters'),
    // .max(250, 'Description must be at most 250 characters'),
    intervalType: yup.string().required('Interval Type is required'),
    category: yup.string().required('Category is required'),
    intervalCount: yup.string().required('Interval Count is required').notOneOf(['0'], 'Interval Count cannot be zero'),
    entries: yup.string().required('Entries is required').notOneOf(['0'], 'Entries cannot be zero'),
    price: yup.string().required('Price is required').notOneOf(['0'], 'Price cannot be zero')
  });

  const initialValues = {
    name: '',
    description: '',
    intervalType: '',
    intervalCount: '',
    entries: '',
    price: '',
    category: '',
    mostpopular: ''
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    formik.handleChange(event);
    setSelectedCategoryId(value);
  };
  const onSubmit = async (values, { resetForm }) => {
    // console.log(values)
    setLoading(true);
    try {
      const res = await dispatch(
        addPlanRequest({
          name: values.name,
          discription: values.description,
          intervalType: values.intervalType,
          intervalCount: values.intervalCount,
          entries: values.entries,
          price: values.price,
          category: values.category,
          mostPopuler: values.mostpopular
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

  React.useEffect(() => {
    dispatch(getCategories(''));
  }, []);

  const handleKeyDown = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([38, 40, 189, 110, 190, 109].includes(keyCode)) {
      event.preventDefault();
    }
  };
  const handleKeyDownDecimal = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([38, 40, 189, 109].includes(keyCode)) {
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
              Add Plan
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
          <DialogContentText id="alert-dialog-slide-description" sx={{ pt: 1 }}>
            <Grid container spacing={3}>
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

              <Grid item xs={12} sm={4}>
                <TextField
                  id="intervalCount"
                  name="intervalCount"
                  label="Interval Count"
                  value={formik.values.intervalCount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.intervalCount && Boolean(formik.errors.intervalCount)}
                  helperText={formik.touched.intervalCount && formik.errors.intervalCount}
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
              <Grid item xs={12} sm={4}>
                <TextField
                  id="entries"
                  name="entries"
                  label="Entries"
                  value={formik.values.entries}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.entries && Boolean(formik.errors.entries)}
                  helperText={formik.touched.entries && formik.errors.entries}
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
              <Grid item xs={12} sm={4}>
                <TextField
                  id="price"
                  name="price"
                  label="Price"
                  value={formik.values.price}
                  onChange={(e) => {
                    const { value } = e.target;
                    // Check if the value contains more than 2 decimal places
                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                      // If the value is valid, update the state
                      formik.handleChange(e);
                    }
                  }}
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{
                    type: 'number',
                    inputMode: 'numeric',
                    onKeyDown: handleKeyDownDecimal,
                    pattern: '[0-9]*',
                    style: { appearance: 'textfield', width: '100%' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <ReactQuill
                  id="description"
                  name="description"
                  label="Description"
                  value={formik.values.description || ''}
                  onChange={(value) => {
                    formik.setFieldValue('description', value);
                    formik.handleChange('description')(value); // Manually trigger formik's handleChange
                  }}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                  autoComplete="family-name"
                  placeholder="Description"
                  rows={12}
                  multiline
                />
                {formik.touched.description && formik.errors.description && (
                  <FormHelperText style={{ color: 'red' }}>{formik.errors.description}</FormHelperText>
                )}
                {/* <span style={{ float: 'right' }}>{formik?.values?.description?.length} / 250</span> */}
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  id="demo-simple-select"
                  label="Category"
                  name="category"
                  value={formik.values.category || 'select'}
                  onChange={handleCategoryChange}
                  onBlur={formik.handleBlur}
                  sx={{ width: '100%' }}
                >
                  <MenuItem value="select" disabled>
                    Please Select
                  </MenuItem>
                  {categoryData.map((option, index) => (
                    <MenuItem key={index} value={option?._id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && <FormHelperText>{formik.errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.intervalType && Boolean(formik.errors.intervalType)}>
                  <InputLabel id="status-label">Interval Type</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="Interval Type"
                    name="intervalType"
                    value={formik.values.intervalType || 'select'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="select" disabled>
                      Please Select
                    </MenuItem>
                    {selectedCategoryId === '661e5fc137498a801abaa56b' ? (
                      <>
                        <MenuItem value="fixed">Fixed</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="week">Week</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                      </>
                    )}
                  </Select>
                  {formik.touched.intervalType && formik.errors.intervalType && (
                    <FormHelperText>{formik.errors.intervalType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
           
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.intervalType && Boolean(formik.errors.intervalType)}>
                  <InputLabel id="status-label">Most Popular</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="Interval Type"
                    name="mostpopular"
                    value={formik.values.mostpopular || 'select'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="select" disabled>
                      Please Select
                    </MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
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
                  'Add Plan'
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

export default PlanAdd;
