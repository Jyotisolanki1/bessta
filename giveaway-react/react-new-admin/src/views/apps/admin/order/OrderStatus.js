/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React, { useState } from 'react';
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
  Select,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { statusChangeRequest } from 'store/slices/orders';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';

// import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Job = ({ open, close, item }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    status: yup.string().required('Status is required')
  });

  const initialValues = {
    status: item?.status
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const data = {
        id: item?._id,
        status: values.status
      };

      const res = await dispatch(statusChangeRequest(data));
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

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth="true"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit} id="validation-forms">
          <DialogTitle>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                Change Status
              </Grid>
              <Grid item xs={6}>
                <IconButton color="inherit" onClick={close} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" sx={{ marginTop: '15px' }}>
              <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={6}>
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
                      <MenuItem value="pending" style={{ display: 'none' }}>
                        Pending
                      </MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="hold">Hold</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                    </Select>
                    {formik.touched.status && formik.errors.status && <FormHelperText>{formik.errors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="center">
                {/* <AnimateButton> */}
                <Button disabled={loading} variant="contained" sx={{ my: 1, ml: 1 }} type="submit">
                  {loading ? (
                    <>
                      <CircularProgress color="primary" />
                      &nbsp; Loading ...
                    </>
                  ) : (
                    'Change Status'
                  )}
                </Button>
                {/* </AnimateButton> */}
              </Stack>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Job;
