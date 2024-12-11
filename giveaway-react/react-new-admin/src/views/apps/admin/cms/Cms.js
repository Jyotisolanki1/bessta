/* eslint-disable arrow-body-style */
import React, { useState, useEffect, Suspense } from 'react';
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
  CircularProgress,
  IconButton,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateCmsRequest } from 'store/slices/cms';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';
import 'react-quill/dist/quill.snow.css';
// Dynamically import ReactQuill
const ReactQuill = React.lazy(() => import('react-quill'));

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const validationSchema = yup.object({
  content: yup
    .string()
    .required(<FormattedMessage id="content-error" />)
    .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
      return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
    })
    .min(100, <FormattedMessage id="cms-min-error" />)
});

const Cms = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    type: item?.type,
    content: item?.content
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const data = {
          content: values.content,
          type: values.type
        };
        const res = await dispatch(updateCmsRequest(data));
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
  });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <FormattedMessage id="edit-cms" />
          <IconButton edge="end" color="inherit" onClick={close} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="type"
                  name="type"
                  label={<FormattedMessage id="name" />}
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  fullWidth
                  autoComplete="given-name"
                  disabled
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={12}>
                <Suspense fallback={<CircularProgress />}>
                  <ReactQuill theme="snow" value={formik.values.content} onChange={(value) => formik.setFieldValue('content', value)} />
                </Suspense>
                {formik.errors.content && formik.touched.content && <div style={{ color: 'red' }}>{formik.errors.content}</div>}
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
                ) : (
                  <FormattedMessage id="edit" />
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

export default Cms;
