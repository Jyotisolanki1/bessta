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
import { addCourseRequest, getCategories } from 'store/slices/courses';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const quillRef = useRef(null);
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Course name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Course name must be at least 2 characters')
      .max(100, 'Course name must be at most 100 characters'),
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
      .test('word-limit', 'Description must not exceed 250 words', (value) => value.split(/\s+/).filter(Boolean).length <= 250)
      .min(2, 'Description must be at least 2 characters'),
      instructor: yup
      .string()
      .notOneOf([''], 'Instructor name cannot be an empty string')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return !value || /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .max(50, 'Instructor name must be at most 50 characters'),
    instructor_intro: yup
      .string()
      .notOneOf([''], 'Instructor introduction cannot be an empty string')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return !value || /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      ),
    video: yup
      .string()
      .required('Video is required')
      .test('valid-url', 'Invalid URL format', (value, { parent }) => {
        if (parent.videoType === 'youtube') {
          // Regular expression for YouTube URLs
          return /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*(?:[\?&]v=|\/embed\/|\/v\/|.be\/)([a-zA-Z0-9_-]{11})/.test(value);
        } else if (parent.videoType === 'vimeo') {
          // Regular expression for Vimeo URLs
          return /^(https?:\/\/)?(www\.)?vimeo\.com\/(\d+)$/.test(value);
        }
        return false; // If video type is neither 'youtube' nor 'vimeo'
      })
      .min(2, 'Video must be at least 2 characters')
      .max(250, 'Video must be at most 250 characters'),
    videoType: yup.string().required('Video type is required'),
    category: yup.string().required('Category is required')
  });

  const initialValues = {
    name: '',
    description: '',
    video: '',
    videoType: '',
    category: '',
    instructor: '',
    instructor_intro: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    let videoId;
    let videoType;

    // Determine video type and validate URL accordingly
    if (values.videoType === 'youtube') {
      videoId = getYoutubeVideoId(values.video);
      videoType = 'youtube';
    } else if (values.videoType === 'vimeo') {
      videoId = getVimeoVideoId(values.video);
      videoType = 'vimeo';
    }

    if (!videoId) {
      setLoading(false);
      formik.setFieldError('video', `Invalid ${videoType} video link`);
    } else {
      try {
        const res = await dispatch(
          addCourseRequest({
            name: values.name,
            description: values.description,
            video: videoId,
            videoType: values.videoType,
            category: values.category,
            instructor: values.instructor,
            instructor_intro: values.instructor_intro,
            tags: []
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
            message: 'Something went wrong. Please try again later.',
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              Add Course
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
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="instructor"
                  name="instructor"
                  label="Instructor"
                  value={formik.values.instructor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
                  error={formik.touched.instructor && Boolean(formik.errors.instructor)}
                  helperText={formik.touched.instructor && formik.errors.instructor}
                />
                {formik.touched.instructor && formik.errors.instructor && <FormHelperText>{formik.errors.instructor}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="instructor_intro"
                  name="instructor_intro"
                  label="Instructor Introduction"
                  value={formik.values.instructor_intro}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  autoComplete="family-name"
                  rows={6}
                  error={formik.touched.instructor_intro && Boolean(formik.errors.instructor_intro)}
                  helperText={formik.touched.instructor_intro && formik.errors.instructor_intro}
                  multiline
                />
                {formik.touched.instructor_intro && formik.errors.instructor_intro && <FormHelperText>{formik.errors.instructor_intro}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={12}>
                <ReactQuill
                  maxWidth={20}
                  ref={quillRef}
                  value={formik.values.description}
                  onChange={(value) => formik.setFieldValue('description', value.trim())}
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
                {formik.touched.description && formik.errors.description && (
                  <div style={{ color: 'red', marginTop: '8px' }}>{formik.errors.description}</div>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.videoType && Boolean(formik.errors.videoType)}>
                  <InputLabel id="status-label">Video Type</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="Video Type"
                    name="videoType"
                    value={formik.values.videoType || 'select'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="select" disabled>
                      Please Select
                    </MenuItem>
                    <MenuItem value="youtube">YouTube</MenuItem>
                    <MenuItem value="vimeo">Vimeo</MenuItem>
                  </Select>
                  {formik.touched.videoType && formik.errors.videoType && <FormHelperText>{formik.errors.videoType}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="Category"
                    name="category"
                    value={formik.values.category || 'select'}
                    onChange={formik.handleChange}
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
              <Grid item xs={12} sm={12}>
                <TextField
                  id="video"
                  name="video"
                  label="Video URL"
                  value={formik.values.video}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.video && Boolean(formik.errors.video)}
                  helperText={formik.touched.video && formik.errors.video}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 250 }}
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
                  'Add Course'
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
