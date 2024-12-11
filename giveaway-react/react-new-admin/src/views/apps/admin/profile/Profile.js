/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-body-style */
// material-ui
import { Grid, Stack, TextField, Typography, Button, CircularProgress } from '@mui/material';

// project imports
import Avatar from 'components/ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
// assets
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import { FormattedMessage } from 'react-intl';
import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { imgPath } from 'config';
import { getProfile, updateProfile } from 'store/slices/auth';

const Avatar1 = '/assets/images/users/avatar-1.png';

// ==============================|| PROFILE 2 - USER PROFILE ||============================== //

const Profile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.auth);
  const imageInputRef = useRef(null);
  const [item, setItem] = useState({});
  const [status, setStatus] = useState(true);
  // const Avatar1 = `${imgPath}${item?.logo}`;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);

  const validationSchema = yup.object({
    profile_pic: yup
      .mixed()
      .test('fileType', <FormattedMessage id="file-type-error" />, (value) => {
        if (!value) return true; // Skip validation if profile_pic is null
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', <FormattedMessage id="file-size-errorror" />, (value) => {
        if (!value) return true; // Skip validation if profile_pic is null
        return value.size <= 2048 * 1024;
      }),
    name: yup
      .string()
      .required(<FormattedMessage id="company-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="name-min-error" />)
      .max(50, <FormattedMessage id="name-max-error" />)
  });

  const initialValues = {
    name: item?.name,
    email: item?.email,
    profile_pic: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.profile_pic !== null) {
        formData.append('profile_pic', values.profile_pic);
      }
      formData.append('id', item?.id);
      const res = await dispatch(updateProfile(formData));
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
        setStatus(!status);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldError('profile_pic', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('profile_pic', file);
    }
  };

  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);

  const getData = async () => {
    const res = await dispatch(getProfile());
    setItem(res?.ResponseBody);
    localStorage.setItem('name', res?.ResponseBody?.name);
    localStorage.setItem('profile', `${imgPath}${res?.ResponseBody?.profile_pic}`);
  };
  useEffect(() => {
    getData();
  }, [status]);

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              {selectedImage ? (
                <Avatar alt="Admin Pic" src={selectedImage} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
              ) : (
                <Avatar alt="Admin Pic" src={`${imgPath}${item?.profile_pic}`} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
              )}
            </Grid>
            <Grid item sm zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Label for the file input */}
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" component="span">
                        <FormattedMessage id="upload-image" />
                      </Button>
                    </label>
                    {/* Actual file input with style display: 'none' */}
                    <input
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="contained-button-file"
                      multiple
                      type="file"
                      ref={imageInputRef}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption">
                    <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    <FormattedMessage id="img-size-dis" />
                  </Typography>
                  <br />
                  <Typography variant="caption" style={{ color: 'red' }}>
                    {formik.touched.profile_pic && formik.errors.profile_pic && formik.errors.profile_pic}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="name"
            name="name"
            label={<FormattedMessage id="name" />}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            autoComplete="given-name"
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            name="email"
            label={<FormattedMessage id="email" />}
            value={formik.values.email}
            fullWidth
            autoComplete="family-name"
            disabled="true"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
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
      </Grid>
    </form>
  );
};

export default Profile;
