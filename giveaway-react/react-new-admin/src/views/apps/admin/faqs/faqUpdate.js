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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateFaqs } from 'store/slices/faqs';
import * as yup from 'yup';
import { updatePlanRequest, getCategories } from 'store/slices/plans';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';


// import { FormattedMessage } from 'react-intl';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const FaqUpdate = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const validationSchema = yup.object({
    question: yup
      .string()
      .required('Question is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Question must be at least 2 characters')
      .max(100, 'Question must be at most 100 characters'),
    answer: yup
      .string()
      .required('Answer is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      
      )
      .min(2, 'Answer be at least 2 characters')
      .test(
        'word-limit',
        'Answer must not exceed 250 words',
        (value) => value.split(/\s+/).filter(Boolean).length <= 250
      )
    // .max(250, 'Description must be at most 250 characters'),
    // intervalType: yup.string().required('Interval Type is required'),
    // category: yup.string().required('Category is required'),
    // intervalCount: yup
    //   .number()
    //   .required('Interval Count is required')
    //   .nullable()
    //   .positive('Interval Count must be a non-negative number')
    //   .integer('Interval Count must be an integer'),

  });

  const initialValues = {
    question: item?.question,
    answer: item?.answer
  };

  const onSubmit = async (values, { resetForm }) => {
    console.log(values)
    setLoading(true);
    try {
      const res = await dispatch(
        updateFaqs({
          id: item?._id,
          question: values?.question,
          answer: values?.answer,
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

//   const handleKeyDown = (event) => {
//     const keyCode = event.keyCode || event.which;
//     if ([38, 40, 189, 110, 190, 109].includes(keyCode)) {
//       event.preventDefault();
//     }
//   };
//   const handleKeyDownDecimal = (event) => {
//     const keyCode = event.keyCode || event.which;
//     if ([38, 40, 189, 109].includes(keyCode)) {
//       event.preventDefault();
//     }
//   };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
      fullWidth="true"
      maxWidth="lg"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Update FAQ
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
                  id="question"
                  name="question"
                  label="Question"
                  value={formik.values.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.question && Boolean(formik.errors.question)}
                  helperText={formik.touched.question && formik.errors.question}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
              <ReactQuill
              ref={quillRef}
              value={formik.values.answer}
              onChange={(value) => formik.setFieldValue('answer', value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
              formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image']}
            />
                {/* <span style={{ float: 'right' }}>{formik?.values?.description?.length} / 250</span> */}
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
                  'Update FAQ'
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

export default FaqUpdate;
