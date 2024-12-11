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
import { updateCourseRequest, getCategories } from 'store/slices/courses';
import { useDispatch, useSelector } from 'store';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { openSnackbar } from 'store/slices/snackbar';

import CloseIcon from '@mui/icons-material/Close';

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

const CourseUpdate = ({ open, close, item }) => {
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
      .max(50, 'Course name must be at most 50 characters'),
      description: yup.string()
      .required('Description is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .test(
        'word-count',
        'Description must be at most 250 words',
        (value) => {
            if (!value) return true; // Allow empty values
            const trimmedValue = value.trim();
            const wordCount = trimmedValue.split(/\s+/).filter(Boolean).length;
            console.log('Word count:', wordCount);
            return wordCount <= 250;
        }
    )
      .min(2, 'Description must be at least 2 characters'),
    video: yup
      .string()
      .required('Video is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Video must be at least 2 characters'),
    videoType: yup.string().required('Video type is required'),
    category: yup.string().required('Category is required')
  });
console.log(item)
  const initialValues = {
    name: item?.name,
    description: item?.description,
    video: item?.video,
    videoType: item?.videoType,
    category: item?.category?._id,
    status: item?.status,
    instructor:item?.instructor,
    instructor_intro:item?.instructor_intro
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    let videoId = 1;
    if (values.videoType === 'youtube') {
      videoId = getYoutubeVideoId(values.video);
    } else {
      videoId = getVimeoVideoId(values.video);
    }
    if (item?.video !== values.video && videoId === 1) {
      setLoading(false);
      formik.setFieldError('video', 'Video link is not valid');
    } else {
      if (videoId === 1) {
        videoId = item?.video;
      }
      try {
        const res = await dispatch(
          updateCourseRequest({
            id: item?._id,
            name: values.name,
            description: values.description,
            video: videoId,
            videoType: values.videoType,
            category: values.category,
            tags: [],
            status: values?.status,
            instructor:values?.instructor,
            instructor_intro:values?.instructor_intro
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
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Update Course
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
          <DialogContentText id="alert-dialog-slide-description" sx={{pt:1}}>
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
              
              <Grid item xs={12} sm={12} >
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
              />
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
                  multiline
                />
              </Grid>
              <Grid item xs={12} sm={12}>
              <ReactQuill
                maxWidth={20}
                ref={quillRef}
                value={formik.values.description}
                onChange={(value) => formik.setFieldValue('description', value)}
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
                    onChange={(event) => {
                      formik.handleChange(event);
                      if (event.target.value !== 'select') {
                        formik.setFieldValue('video', '');
                      }
                    }}
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
            <Grid item xs={12} sm={12} sx={{mt:2}}>
            <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                id="demo-simple-select"
                label="Status"
                name="status"
                value={formik.values.status || 'select'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ width: '100%' }}
              >
                <MenuItem value="select" disabled>
                  Please Select
                </MenuItem>
                <MenuItem value="active">Enable</MenuItem>
                <MenuItem value="inactive">Disable</MenuItem>
              </Select>
              {formik.touched.status && formik.errors.status && <FormHelperText>{formik.errors.status}</FormHelperText>}
            </FormControl>
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
                  'Update Course'
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

export default CourseUpdate;
