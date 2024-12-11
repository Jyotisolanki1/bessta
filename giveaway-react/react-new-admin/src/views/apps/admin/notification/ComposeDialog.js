/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable no-useless-escape */

'use client';

import React, { useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogContent, Grid, IconButton, Slide, TextField, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { gridSpacing } from 'store/constant';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { sendBulkNotificationApi } from 'store/slices/users';
import { dispatch } from 'store';
import { IconArrowsDiagonal2 } from '@tabler/icons-react';
import 'react-quill/dist/quill.snow.css';
import { openSnackbar } from 'store/slices/snackbar';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// Validation schema
const validationSchema = yup.object({
  message: yup
    .string('Enter your message')
    .required('Message is required')
    .test(
      'no-multi-spaces',
      'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
      (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      }
    )
});

const ComposeDialog = ({ selectedUsers, onOpenChange }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    onOpenChange(open);
  }, [open]);

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
      return;
    }
    // Reset form values when opening the dialog
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
      message: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        message: values.message,
        userid: selectedUsers
      };
      setLoading(true);
      try {
        const res = await dispatch(sendBulkNotificationApi(data));
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
                        Send Notification
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
                    label="Message"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                    rows={6}
                    multiline
                  />
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
                          "Send"
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
