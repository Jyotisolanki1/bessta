/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
  TransitionProps,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDepartmentRequest, updateDepartmentRequest } from 'store/slices/department';
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
    departmentName: yup
      .string()
      .required(<FormattedMessage id="department-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="alpha-error" />, (value) => {
        return value && /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="dapa-min-error" />)
      .max(50, <FormattedMessage id="dapa-max-error" />)
  });

  const initialValues = {
    departmentName: item?.departmentName
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const data = {
        departmentName: values.departmentName
      };
      if (item?.id) {
        data.id = item?.id;
      }
      const res = item?.id ? await dispatch(updateDepartmentRequest(data)) : await dispatch(addDepartmentRequest(data));
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
              {item?.id ? <FormattedMessage id="edit-department" /> : <FormattedMessage id="add-department" />}
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
                  id="departmentName"
                  name="departmentName"
                  label={<FormattedMessage id="department-name" />}
                  value={formik.values.departmentName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departmentName && Boolean(formik.errors.departmentName)}
                  helperText={formik.touched.departmentName && formik.errors.departmentName}
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
