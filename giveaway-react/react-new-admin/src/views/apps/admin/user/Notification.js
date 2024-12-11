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
import { sendNotificationRequest } from 'store/slices/users';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as yup from 'yup';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const SendNotification = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const validationSchema = yup.object({
    message: yup
      .string()
      .required('Message is required')
      .test('no-consecutive-spaces', 'Consecutive spaces are not allowed', (value) => value && !/\s\s/.test(value))
      .min(2, 'Message must be at least 2 characters')
      .max(100, 'Message must be at most 100 characters')
  });

  const initialValues = {
    message: '',
    id: item?._id // eslint-disable-line no-underscore-dangle
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await dispatch(sendNotificationRequest(values));
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
      aria-describedby="alert-dialog-slide-description"
      fullWidth="true"
      maxWidth="lg"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Send Notification
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
                  id="message"
                  name="message"
                  label="Message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
                  multiline
                  rows={4} // You can change the number of rows to whatever fits your needs
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;Loading ...
                  </>
                ) : (
                  'Send Notification'
                )}
              </Button>
            </Stack>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SendNotification;
