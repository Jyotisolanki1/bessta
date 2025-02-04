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

import React, { useState, forwardRef, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogContent, Grid, IconButton, Slide, TextField, Typography, CircularProgress } from '@mui/material';
import { useFormik, Field } from 'formik';
import * as yup from 'yup';
import { gridSpacing } from 'store/constant';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { sendBulkMailApi, getAllUser } from 'store/slices/users';
import { dispatch } from 'store';
import { IconArrowsDiagonal2 } from '@tabler/icons-react';
import 'react-quill/dist/quill.snow.css';
import { openSnackbar } from 'store/slices/snackbar';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// Validation schema
const validationSchema = yup.object({
  subject: yup
    .string('Enter the subject')
    .required('Subject is required')
    .test(
      'no-multi-spaces',
      'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
      (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      }
    )
    .max(100, 'Subject should be max 100 characters long.'),
  message: yup
    .string()
    .required('Message is required')
    .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.')
});

const ComposeDialog = ({ selectedUsers, onOpenChange }) => {
  const quillRef = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    onOpenChange(open);
  }, [open]);

  // eslint-disable-next-line consistent-return
  const handleClickOpen = () => {
    if (selectedUsers.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select users',
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
      return false;
    }
    formik.resetForm();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [position, setPosition] = useState(true);
  let composePosition = {};
  if (!position) {
    composePosition = {
      '& .MuiDialog-container': {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        '& .MuiPaper-root': { mb: 0, borderRadius: '12px 12px 0px 0px', maxWidth: 595 }
      }
    };
  }

  // Formik setup
  const formik = useFormik({
    initialValues: {
      subject: '',
      message: ''
    },
    validationSchema,
    // eslint-disable-next-line consistent-return
    onSubmit: async (values) => {
      if (values.message === '<p><br></p>') {
        formik.setFieldError('message', 'Message is required');
        return;
      }
      setLoading(true);
      // handle form submission
      console.log(values.message);
      const data = {
        subject: values.subject,
        message: values.message,
        userid: selectedUsers
      };

      try {
        const res = await dispatch(sendBulkMailApi(data));
        if (res?.success === true) {
          setLoading(false);

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
          await dispatch(getAllUser(''));
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
      handleCloseDialog();
    }
  });

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} sx={{ width: '100%' }} size="large" startIcon={<AddCircleOutlineTwoToneIcon />}>
        Compose
      </Button>
      <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} sx={composePosition}>
        {open && (
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={0}>
                    <Grid item sm zeroMinWidth>
                      <Typography component="div" align="left" variant="h4">
                        Send Mail
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => setPosition(!position)} size="large">
                        <IconArrowsDiagonal2 />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleCloseDialog} size="large">
                        <HighlightOffTwoToneIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ReactQuill
                    name="message"
                    ref={quillRef}
                    value={formik.values.message}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                    onChange={(value) => formik.setFieldValue('message', value)}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    style={{
                      border: formik.touched.message && formik.errors.message ? '1px solid red' : '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                    formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image']}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div style={{ color: '#fc0339', marginTop: '8px' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formik.errors.message}</div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item sx={{ flexGrow: 1 }} />
                    <Grid item>
                      <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                        {loading ? (
                          <>
                            <CircularProgress color="primary" />
                            &nbsp;Loading ...
                          </>
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ComposeDialog;
