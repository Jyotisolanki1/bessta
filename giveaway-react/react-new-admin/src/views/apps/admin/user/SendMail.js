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
  IconButton
} from '@mui/material';
import { useFormik } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { addFaqs } from 'store/slices/faqs';
import * as yup from 'yup';
import { sendMailRequest } from 'store/slices/users';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const SendMail = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const validationSchema = yup.object({
    subject: yup
      .string()
      .required('Subject is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.')
      .min(2, 'Subject must be at least 2 characters')
      .max(100, 'Subject must be at most 100 characters'),
    message: yup
      .string()
      .required('Message is required')
      .matches(/^[^\s]+(\s[^\s]+)*$/, 'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.')
  });

  const initialValues = {
    id: item._id, // eslint-disable-line no-underscore-dangle
    subject: item?.subject,
    message: item?.message
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await dispatch(sendMailRequest(values));
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
              Send Mail
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
                  id="subject"
                  name="subject"
                  label="Subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 100 }}
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
                  'Send Mail'
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

export default SendMail;
