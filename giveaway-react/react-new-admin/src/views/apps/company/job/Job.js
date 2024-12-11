/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-unresolved */
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
  TransitionProps,
  MenuItem,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addDays, isBefore, startOfDay } from 'date-fns';
import { addJobRequest } from 'store/slices/job';
import { getAllEmployee } from 'store/slices/employee';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';

import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath } from 'config';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormattedMessage } from 'react-intl';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import MapLatLong from './MapLatLong';
import { getAllDepartment } from 'store/slices/department';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Job = ({ open, close }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.employee);
  const allDepartment = useSelector((state) => state.department);
  const hours = Array.from({ length: 24 }, (_, index) => `${index}h`);
  const minutes = Array.from({ length: 60 }, (_, index) => `${index + 1}m`);

  const [loading, setLoading] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [endDateVar, setEndDateVar] = useState(false);
  const [startDateVar, setStartDateVar] = useState(false);
  const [taskDateVar, setTaskDateVar] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          formik.setFieldValue('latitude', latitude);
          formik.setFieldValue('longitude', longitude);
          formik.setValues({
            ...formik.values,
            latitude,
            longitude
          });
        },
        (error) => {
          // console.error('Error getting location:', error);
        }
      );
    } else {
      // console.error('Geolocation is not supported by this browser');
    }
  };

  // const handleGetLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         formik.setFieldValue('latitude', latitude);
  //         formik.setFieldValue('longitude', longitude);
  //         formik.setValues({
  //           ...formik.values,
  //           latitude,
  //           longitude
  //         });
  //       },
  //       (error) => {
  //         // console.error('Error getting location:', error);
  //       }
  //     );
  //   } else {
  //     // console.error('Geolocation is not supported by this browser');
  //   }
  // };

  const validationSchema = yup.object({
    task: yup
      .string()
      .required(<FormattedMessage id="job-name-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="job-name-min-error" />)
      .max(100, <FormattedMessage id="job-name-max-error" />),
    // job_code: yup
    //   .string()
    //   .required(<FormattedMessage id="job-code-name-error" />)
    //   .test('no-multi-spaces', <FormattedMessage id="no-spaces-error" />, (value) => {
    //     return value && /^\S+$/.test(value);
    //   })
    //   .min(2, <FormattedMessage id="job-code-name-min-error" />)
    //   .max(25, <FormattedMessage id="job-code-name-max-error" />),
    status: yup.string().required(<FormattedMessage id="status-error" />),
    work_type: yup.string().required(<FormattedMessage id="work-type-error" />),
    priority: yup.string().required(<FormattedMessage id="priority-error" />),
    userId: yup.string().required(<FormattedMessage id="userId-error" />),
    contact_details: yup
      .string()
      .required(<FormattedMessage id="phone-number-error" />)
      .test('not-all-zeros', <FormattedMessage id="phone-zero-error" />, (value) => {
        return !/^[0]*$/.test(value);
      })
      .min(5, <FormattedMessage id="phone-min-error" />)
      .max(15, <FormattedMessage id="phone-max-error" />),
    address: yup
      .string()
      .required(<FormattedMessage id="address-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="address-min-error" />)
      .max(100, <FormattedMessage id="address-max-error" />),
    // latitude: yup.string().required(<FormattedMessage id="latitude-error" />),
    // longitude: yup.string().required(<FormattedMessage id="longitude-error" />),
    start: yup
      .string()
      .required(<FormattedMessage id="start-date-error" />)
      .test('is-greater-start', <FormattedMessage id="start-end" />, (value) => {
        const startDate = new Date(value);
        const curentDate = new Date();
        return curentDate < startDate;
      }),
    end: yup
      .string()
      .required(<FormattedMessage id="end-date-error" />)
      .test('is-greater', <FormattedMessage id="end-start" />, (value, { parent }) => {
        const { start } = parent;
        const startDate = new Date(start);
        const endDate = new Date(value);
        return endDate > startDate;
      }),
    task_date: yup.string().required(<FormattedMessage id="task-date-error" />),
    // departmentId: yup.string().required(<FormattedMessage id="employee-department-error" />),
    work_time_h: yup.string().required(<FormattedMessage id="work-time-error" />),
    work_time_m: yup.string().required(<FormattedMessage id="work-time-error" />),
    service_unit: yup
      .string()
      .required(<FormattedMessage id="serviceunit-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="serviceunit-min-error" />)
      .max(100, <FormattedMessage id="serviceunit-max-error" />),
    quote: yup
      .string()
      .required(<FormattedMessage id="quote-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="quote-min-error" />)
      .max(250, <FormattedMessage id="quote-max-error" />),
    critical: yup
      .string()
      .required(<FormattedMessage id="critical-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="critical-min-error" />)
      .max(100, <FormattedMessage id="critical-max-error" />),
    task_details: yup
      .string()
      .required(<FormattedMessage id="taskdetails-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="taskdetails-min-error" />)
      .max(250, <FormattedMessage id="taskdetails-max-error" />),
    short_descrption: yup
      .string()
      .required(<FormattedMessage id="shortdescrption-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="shortdescrption-min-error" />)
      .max(100, <FormattedMessage id="shortdescrption-max-error" />),
    long_descrption: yup
      .string()
      .required(<FormattedMessage id="longdescrption-error" />)
      .test('no-multi-spaces', <FormattedMessage id="multi-spaces-error" />, (value) => {
        return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
      })
      .min(2, <FormattedMessage id="longdescrption-min-error" />)
      .max(250, <FormattedMessage id="longdescrption-max-error" />)
  });

  const initialValues = {
    task: '',
    job_code: '',
    work_type: '',
    status: '',
    priority: '',
    userId: '',
    contact_details: '',
    address: '',
    latitude: '',
    longitude: '',
    start: null,
    end: null,
    task_date: null,
    work_time_h: null,
    work_time_m: null,
    service_unit: '',
    quote: '',
    critical: '',
    task_details: '',
    short_descrption: '',
    long_descrption: '',
    departmentId: '',
    departmentName: ''
  };
  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const startDate = new Date(values.start);
      const startFormatedDate = startDate.toISOString().slice(0, 16);
      const endDate = new Date(values.end);
      const endFormatedDate = endDate.toISOString().slice(0, 16);
      const taskString = new Date(values.task_date);
      const taskOnly = taskString.toISOString().split('T')[0];
      const data = {
        task: values.task,
        // job_code: values.job_code,
        work_type: values.work_type,
        status: Number(values.status),
        priority: values.priority,
        userId: values.userId,
        contact_details: `${values.contact_details}`,
        address: values.address,
        // latitude: `${values.latitude}`,
        // longitude: `${values.longitude}`,
        start: startFormatedDate,
        end: endFormatedDate,
        work_time: `${values.work_time_h} ${values.work_time_m}`,
        task_date: taskOnly,
        service_unit: values.service_unit,
        quote: values.quote,
        critical: values.critical,
        task_details: values.task_details,
        short_descrption: values.short_descrption,
        long_descrption: values.long_descrption,
        departmentId: values.departmentId
      };

      const res = await dispatch(addJobRequest(data));
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

  React.useEffect(() => {
    dispatch(getAllEmployee());
    dispatch(getAllDepartment());
  }, []);

  const closeDialog = () => {
    formik.resetForm();
    close();
  };
  const handleKeyDown = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([37, 38, 39, 40, 189].includes(keyCode)) {
      event.preventDefault();
    }
  };
  return (
    <>
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
                <FormattedMessage id="add-job" />
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="task"
                    name="task"
                    label={<FormattedMessage id="job-name" />}
                    value={formik.values.task}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.task && Boolean(formik.errors.task)}
                    helperText={formik.touched.task && formik.errors.task}
                    fullWidth
                    autoComplete="given-name"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    id="job_code"
                    name="job_code"
                    label={<FormattedMessage id="job-code" />}
                    value={formik.values.job_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.job_code && Boolean(formik.errors.job_code)}
                    helperText={formik.touched.job_code && formik.errors.job_code}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 25 }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                    <InputLabel id="status-label">
                      <FormattedMessage id="status" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="status" />
                      name="status"
                      value={formik.values.status || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      <MenuItem value="1">Not Started</MenuItem>
                      <MenuItem value="2">Started</MenuItem>
                      {/* <MenuItem value="3">Completed</MenuItem> */}
                      <MenuItem value="4">Pending</MenuItem>
                    </Select>
                    {formik.touched.status && formik.errors.status && <FormHelperText>{formik.errors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.work_type && Boolean(formik.errors.work_type)}>
                    <InputLabel id="work-type-label">
                      <FormattedMessage id="job-type" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="job-type" />
                      name="work_type"
                      value={formik.values.work_type || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      <MenuItem value="Demo 1">Demo 1</MenuItem>
                      <MenuItem value="Demo 2">Demo 2</MenuItem>
                      <MenuItem value="Demo 3">Demo 3</MenuItem>
                      <MenuItem value="Demo 4">Demo 4</MenuItem>
                    </Select>
                    {/* <InputLabel id="work-type-label">
                      <FormattedMessage id="job-type" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="work-type-label" />
                      name="work_type"
                      value={formik.values.work_type || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      <MenuItem value="0">Job Type 1</MenuItem>
                      <MenuItem value="1">Job Type 2</MenuItem>
                      <MenuItem value="2">Job Type 3</MenuItem>
                      <MenuItem value="3">Job Type 4</MenuItem>
                    </Select> */}
                    {formik.touched.work_type && formik.errors.work_type && <FormHelperText>{formik.errors.work_type}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                    <InputLabel id="priority-label">
                      <FormattedMessage id="priority" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="priority" />
                      name="priority"
                      value={formik.values.priority || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      <MenuItem value="SA">SA</MenuItem>
                      <MenuItem value="ADH">ADH</MenuItem>
                      <MenuItem value="BRE">BRE</MenuItem>
                    </Select>
                    {formik.touched.priority && formik.errors.priority && <FormHelperText>{formik.errors.priority}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* <DateTimePicker
                      label={<FormattedMessage id="start-date" />}
                      id="start"
                      name="start"
                      value={formik.values.start}
                      onChange={(newValue) => {
                        // Update formik state for start date
                        formik.handleChange({
                          target: {
                            id: 'start',
                            name: 'start',
                            value: newValue
                          }
                        });

                        // Reset formik state for end date when start date changes
                        formik.handleChange({
                          target: {
                            id: 'end',
                            name: 'end',
                            value: null
                          }
                        });
                        formik.handleChange({
                          target: {
                            id: 'task_date',
                            name: 'task_date',
                            value: null
                          }
                        });
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.start && Boolean(formik.errors.start)}
                      helperText={formik.touched.start && formik.errors.start}
                      fullWidth
                      autoComplete="family-name"
                      // minDate={startOfDay(new Date())}
                      disablePast="true"
                    /> */}
                    <DateTimePicker
                      label={<FormattedMessage id="start-date" />}
                      id="start"
                      name="start"
                      defaultValue={formik.values.start}
                      onChange={(newValue) => {
                        formik.setFieldValue('start', newValue);
                        formik.setFieldValue('task_date', null);
                        formik.setFieldValue('end', null);
                        setStartDateVar(true);
                        formik.validateForm().then(() => {
                          formik.validateField('start');
                        });
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.start && Boolean(formik.errors.start)}
                      helperText={formik.touched.start && formik.errors.start}
                      fullWidth
                      autoComplete="family-name"
                      // minDate={startOfDay(new Date())}
                      disablePast="true"
                    />
                  </LocalizationProvider>
                  {(formik.touched.start || startDateVar) && formik.errors.start && (
                    <>
                      {' '}
                      <br />
                      <Typography variant="caption" color="red">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {formik.errors.start}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* <DateTimePicker
                      label={<FormattedMessage id="end-date" />}
                      id="end"
                      name="end"
                      value={formik.values.end}
                      onChange={(newValue) => {
                        // Update formik state for start date
                        formik.handleChange({
                          target: {
                            id: 'end',
                            name: 'end',
                            value: newValue
                          }
                        });
                        formik.handleChange({
                          target: {
                            id: 'task_date',
                            name: 'task_date',
                            value: null
                          }
                        });
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.end && Boolean(formik.errors.end)}
                      helperText={formik.touched.end && formik.errors.end}
                      fullWidth
                      autoComplete="family-name"
                      minDateTime={formik.values.start}
                    /> */}
                    <DateTimePicker
                      label={<FormattedMessage id="end-date" />}
                      id="end"
                      name="end"
                      value={formik.values.end}
                      onChange={(newValue) => {
                        setEndDateVar(true);
                        formik.setFieldValue('end', newValue);
                        formik.setFieldValue('task_date', null);
                        formik.validateForm().then(() => {
                          formik.validateField('end');
                        });
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.end && Boolean(formik.errors.end)}
                      helperText={formik.touched.end && formik.errors.end}
                      fullWidth
                      autoComplete="family-name"
                      minDateTime={formik.values.start}
                    />
                  </LocalizationProvider>
                  {(formik.touched.end || endDateVar) && formik.errors.end && (
                    <>
                      {' '}
                      <br />
                      <Typography variant="caption" color="red">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {formik.errors.end}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.work_time_h && Boolean(formik.errors.work_time_h)}>
                    <InputLabel id="work-time-h-label">
                      <FormattedMessage id="work-time-h" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="work-time-h" />
                      name="work_time_h"
                      value={formik.values.work_time_h || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      {hours.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.work_time_h && formik.errors.work_time_h && (
                      <FormHelperText>{formik.errors.work_time_h}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.work_time_m && Boolean(formik.errors.work_time_m)}>
                    <InputLabel id="work-time-m-label">
                      <FormattedMessage id="work-time-m" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="work-time-m" />
                      name="work_time_m"
                      value={formik.values.work_time_m || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      {minutes.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.work_time_m && formik.errors.work_time_m && (
                      <FormHelperText>{formik.errors.work_time_m}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label={<FormattedMessage id="task-date" />}
                      id="task_date"
                      name="task_date"
                      value={formik.values.task_date}
                      onChange={(newValue) => {
                        // Update formik state
                        setTaskDateVar(true);
                        formik.handleChange({
                          target: {
                            id: 'task_date',
                            name: 'task_date',
                            value: newValue
                          }
                        });
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.task_date && Boolean(formik.errors.task_date)}
                      helperText={formik.touched.task_date && formik.errors.task_date}
                      fullWidth
                      autoComplete="family-name"
                      minDate={formik.values.start}
                      maxDate={formik.values.end}
                    />
                  </LocalizationProvider>
                  {(formik.touched.end || taskDateVar) && formik.errors.task_date && (
                    <>
                      {' '}
                      <br />
                      <Typography variant="caption" color="red">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {formik.errors.task_date}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.userId && Boolean(formik.errors.userId)}>
                    <InputLabel id="userId-label">
                      <FormattedMessage id="employee" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="employee" />
                      name="userId"
                      value={formik.values.userId || 'select'}
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        const userId = event.target.value;
                        formik.handleChange(event);
                        const selectedEmployee = data.find((option) => option.id === userId);
                        if (selectedEmployee) {
                          const departmentName = selectedEmployee.departmentName;
                          const departmentId = selectedEmployee.departmentId;
                          formik.setFieldValue('departmentName', departmentName);
                          formik.setFieldValue('departmentId', departmentId);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      {data.map((option, index) => (
                        <MenuItem key={index} value={option?.id}>
                          {option?.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.userId && formik.errors.userId && <FormHelperText>{formik.errors.userId}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="contact_details"
                    name="contact_details"
                    label="Phone"
                    value={formik.values.contact_details}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contact_details && Boolean(formik.errors.contact_details)}
                    helperText={formik.touched.contact_details && formik.errors.contact_details}
                    fullWidth
                    autoComplete="family-name"
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
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}>
                    <InputLabel id="department-label">
                      <FormattedMessage id="deparment" />
                    </InputLabel>
                    <Select
                      id="demo-simple-select"
                      label=<FormattedMessage id="deparment" />
                      name="departmentId"
                      value={formik.values.departmentId || 'select'}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="select" disabled>
                        <FormattedMessage id="please-select" />
                      </MenuItem>
                      {allDepartment?.data.map((option, index) => (
                        <MenuItem key={index} value={option?.id}>
                          {option?.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.departmentId && formik.errors.departmentId && (
                      <FormHelperText>{formik.errors.departmentId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="departmentId"
                    name="departmentId"
                    label={<FormattedMessage id="deparment" />}
                    value={formik.values.departmentName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
                    helperText={formik.touched.departmentId && formik.errors.departmentId}
                    fullWidth
                    autoComplete="family-name"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
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
                    inputProps={{ maxLength: 250 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="service_unit"
                    name="service_unit"
                    label={<FormattedMessage id="serviceunit" />}
                    value={formik.values.service_unit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.service_unit && Boolean(formik.errors.service_unit)}
                    helperText={formik.touched.service_unit && formik.errors.service_unit}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="quote"
                    name="quote"
                    label={<FormattedMessage id="quote" />}
                    value={formik.values.quote}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote && Boolean(formik.errors.quote)}
                    helperText={formik.touched.quote && formik.errors.quote}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 250 }}
                    rows={4}
                    multiline
                  />
                  <span style={{ float: 'right' }}>{formik?.values?.quote?.length} / 250</span>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="critical"
                    name="critical"
                    label={<FormattedMessage id="critical" />}
                    value={formik.values.critical}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.critical && Boolean(formik.errors.critical)}
                    helperText={formik.touched.critical && formik.errors.critical}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="task_details"
                    name="task_details"
                    label={<FormattedMessage id="taskdetails" />}
                    value={formik.values.task_details}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.task_details && Boolean(formik.errors.task_details)}
                    helperText={formik.touched.task_details && formik.errors.task_details}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 250 }}
                    rows={4}
                    multiline
                  />
                  <span style={{ float: 'right' }}>{formik?.values?.task_details?.length} / 250</span>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="short_descrption"
                    name="short_descrption"
                    label={<FormattedMessage id="shortdescrption" />}
                    value={formik.values.short_descrption}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.short_descrption && Boolean(formik.errors.short_descrption)}
                    helperText={formik.touched.short_descrption && formik.errors.short_descrption}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="long_descrption"
                    name="long_descrption"
                    label={<FormattedMessage id="longdescrption" />}
                    value={formik.values.long_descrption}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.long_descrption && Boolean(formik.errors.long_descrption)}
                    helperText={formik.touched.long_descrption && formik.errors.long_descrption}
                    fullWidth
                    autoComplete="family-name"
                    inputProps={{ maxLength: 250 }}
                    rows={4}
                    multiline
                  />
                  <span style={{ float: 'right' }}>{formik?.values?.long_descrption?.length} / 250</span>
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField
                    id="latitude"
                    name="latitude"
                    label={<FormattedMessage id="latitude" />}
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                    helperText={formik.touched.latitude && formik.errors.latitude}
                    fullWidth
                    autoComplete="family-name"
                    // disabled="true"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="longitude"
                    name="longitude"
                    label={<FormattedMessage id="longitude" />}
                    value={formik.values.longitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                    helperText={formik.touched.longitude && formik.errors.longitude}
                    fullWidth
                    autoComplete="family-name"
                    // disabled="true"
                  />
                </Grid>
                <Grid item xs={12} sm={4} container alignItems="flex-start">
                  <Button
                    variant="contained"
                    sx={{ my: 1, ml: 1 }}
                    // onClick={() => {
                    //   setOpenMap(true);
                    // }}
                    onClick={handleGetLocation}
                  >
                    <FormattedMessage id="get-location" />
                  </Button>
                </Grid> */}
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
                      &nbsp;
                      <FormattedMessage id="loading" />
                      ...
                    </>
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
      {/* {openMap && <MapLatLong openMap={openMap} close={() => setOpenMap(false)} />} */}
    </>
  );
};

export default Job;
