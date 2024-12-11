/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-body-style */
// material-ui
import { Grid, Stack, TextField, Typography, Button, CircularProgress, Autocomplete } from '@mui/material';

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
import { imgPath, countries } from 'config';
import { getProfileCompany, updateProfileCompany } from 'store/slices/auth';

const Avatar1 = '/assets/images/users/avatar-1.png';

const Profile = () => {
  const dispatch = useDispatch();
  // const profileData = useSelector((state) => state.auth);console.log(profileData);
  const imageInputRef = useRef(null);
  const [item, setItem] = useState({});
  const [status, setStatus] = useState(true);
  // const Avatar1 = `${imgPath}${item?.logo}`;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInputRefSet, setImageInputRefSet] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '', label: '', phone: '' });

  const validationSchema = yup.object({
    logo: yup
      .mixed()
      .test('fileType', <FormattedMessage id="file-type-error" />, (value) => {
        if (!value) return true; // Skip validation if logo is null
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
      .test('fileSize', <FormattedMessage id="file-size-errorror" />, (value) => {
        if (!value) return true; // Skip validation if logo is null
        return value.size <= 2048 * 1024;
      }),
    name: yup
      .string()
      .required(<FormattedMessage id="company-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="name-min-error" />)
      .max(50, <FormattedMessage id="name-max-error" />),
    owner: yup
      .string()
      .required(<FormattedMessage id="company-owner-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="alpha-error" />, (value) => {
        return value && /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="comp-owner-name-min-error" />)
      .max(50, <FormattedMessage id="comp-owner-name-max-error" />),
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
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="city-min-error" />)
      .max(100, <FormattedMessage id="city-max-error" />),
    country_code: yup.string().required(<FormattedMessage id="country-code-error" />),
    phone_number: yup
      .string()
      .required(<FormattedMessage id="phone-number-error" />)
      .test('not-all-zeros', <FormattedMessage id="phone-zero-error" />, (value) => {
        return !/^[0]*$/.test(value);
      })
      .min(5, <FormattedMessage id="phone-min-error" />)
      .max(15, <FormattedMessage id="phone-man-error" />),
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
    owner: item?.owner,
    country_code: item?.country_code,
    phone_number: item?.phone_number,
    address: item?.address,
    city: item?.city,
    state: item?.state,
    email: item?.email,
    logo: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('owner', values.owner);
      formData.append('country_code', values.country_code);
      formData.append('phone_number', values.phone_number);
      formData.append('address', values.address);
      formData.append('city', values.city);
      formData.append('state', values.state);
      if (values.logo !== null) {
        formData.append('logo', values.logo);
      }
      formData.append('id', item?.id);
      const res = await dispatch(updateProfileCompany(formData));
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
    formik.setFieldError('logo', '');
    setImageInputRefSet(false);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue('logo', file);
    }
  };

  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);

  const getData = async () => {
    const res = await dispatch(getProfileCompany());
    setItem(res?.ResponseBody);
    // localStorage.setItem('name', res?.ResponseBody?.name);
    // localStorage.setItem('profile', `${imgPath}${res?.ResponseBody?.logo}`);
  };
  useEffect(() => {
    getData();
  }, [status]);
  useEffect(() => {
    const data = countries.find((ph) => ph.phone === item?.country_code);
    setSelectedCountry(data);
  }, [item?.country_code]);

  const handleKeyDown = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([37, 38, 39, 40, 189].includes(keyCode)) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              {selectedImage ? (
                <Avatar alt="Company Logo" src={selectedImage} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
              ) : (
                <Avatar alt="Company Logo" src={`${imgPath}${item?.logo}`} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
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
                    {formik.touched.logo && formik.errors.logo && formik.errors.logo}
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
            id="owner"
            name="owner"
            label={<FormattedMessage id="owner-name" />}
            value={formik.values.owner}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.owner && Boolean(formik.errors.owner)}
            helperText={formik.touched.owner && formik.errors.owner}
            fullWidth
            autoComplete="family-name"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="address"
            name="address"
            label={<FormattedMessage id="address" />}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            fullWidth
            autoComplete="family-name"
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          {/* <TextField
            id="country_code"
            name="country_code"
            label={<FormattedMessage id="country-code" />}
            value={formik.values.country_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country_code && Boolean(formik.errors.country_code)}
            helperText={formik.touched.country_code && formik.errors.country_code}
            fullWidth
            autoComplete="family-name"
            InputLabelProps={{ shrink: true }}
          /> */}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={countries}
            // value={item?.country_code}
            value={selectedCountry}
            sx={{ width: 300 }}
            getOptionLabel={(option) => `${option.label} (${option.phone})`}
            onChange={(event, value) => {
              setSelectedCountry(value);
              formik.setFieldValue('country_code', value?.phone ? value.phone : '');
              formik.setFieldTouched('country_code', true, false); // Mark the field as touched
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country Code *"
                // value={formik.values.country_code}
                defaultValue={formik.values.country_code}
                error={formik.touched.country_code && Boolean(formik.errors.country_code)}
                helperText={formik.touched.country_code && formik.errors.country_code}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            id="phone_number"
            name="phone_number"
            label={<FormattedMessage id="phone-number" />}
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
            helperText={formik.touched.phone_number && formik.errors.phone_number}
            fullWidth
            autoComplete="family-name"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              maxLength: 15,
              type: 'number',
              inputMode: 'numeric',
              pattern: '[0-9]*',
              onKeyDown: handleKeyDown,
              style: { appearance: 'textfield', width: '100%' }
            }}
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
            <AnimateButton>
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
            </AnimateButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default Profile;
