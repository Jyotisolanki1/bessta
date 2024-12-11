/* eslint-disable arrow-body-style */
/* eslint-disable lines-around-directive */
/* eslint-disable no-nested-ternary */
'use client';

import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addBranchRequest, updateBranchRequest } from 'store/slices/branch';
import { useDispatch } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Company = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const [id, setId] = useState(null);
  const validationSchema = yup.object({
    name: yup
      .string()
      .required(<FormattedMessage id="branch-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="branch-min-error" />)
      .max(50, <FormattedMessage id="branch-max-error" />),
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
      .test('alphabets-only', <FormattedMessage id="alpha-error" />, (value) => {
        return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="city-min-error" />)
      .max(100, <FormattedMessage id="city-max-error" />),
    state: yup
      .string()
      .required(<FormattedMessage id="state-error" />)
      .test('alphabets-only', <FormattedMessage id="alpha-error" />, (value) => {
        return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="state-min-error" />)
      .max(100, <FormattedMessage id="state-max-error" />)
  });

  const initialValues = {
    name: item?.name,
    address: item?.address,
    city: item?.city,
    state: item?.state
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const data = {
        name: values.name,
        address: values.address,
        city: values.city,
        state: values.state
      };
      if (item?.id) {
        data.id = item?.id;
      }
      const res = item?.id ? await dispatch(updateBranchRequest(data)) : await dispatch(addBranchRequest(data));
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

  // useEffect(() => {
  //   setId(item?.id);
  // }, [item]);

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
              {item?.id ? <FormattedMessage id="edit-branch" /> : <FormattedMessage id="add-branch" />}
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
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name *"
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
                    <FormattedMessage id="loading" /> ...
                  </>
                ) : item?.id ? (
                  <FormattedMessage id="edit" />
                ) : (
                  <FormattedMessage id="add" />
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

export default Company;
