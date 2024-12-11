/* eslint-disable dot-notation */
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
  Grid,
  Stack,
  TextField,
  CircularProgress,
  IconButton,

} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateBusinesscat } from 'store/slices/businessCategory';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';



import CloseIcon from '@mui/icons-material/Close';

// import { FormattedMessage } from 'react-intl';

import '../../../../styles/extra.css';


const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const UpdateAdd = ({ open, close ,item}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const validationSchema = yup.object({
    name: yup.string().required('Name is required')
    .test(
      'no-multi-spaces',
      'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
      (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      }
    )
  });

  const initialValues = {
    name: item?.name
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
console.log(values)

    try {
        const formData = new FormData();
       formData.append("id",item?._id)
       formData.append("name",values.name)
      const res = await dispatch(updateBusinesscat(formData));
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
    //   console.log(error);
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
              Update Business Category
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
            <Grid container spacing={3} sc={{ pt: 1 }}>  
              <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
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
                  'Update Business Category'
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

export default UpdateAdd;
