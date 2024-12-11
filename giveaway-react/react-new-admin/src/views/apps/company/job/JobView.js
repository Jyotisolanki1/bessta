/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-unresolved */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Grid, Typography, IconButton, Divider, Chip } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath } from 'config';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const sxDivider = {
  borderColor: 'primary.light'
};

const Company = ({ open, close, item }) => {
  const theme = useTheme();
  // const Avatar1 = `${imgPath}${item?.profile_pic}`;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="md"
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormattedMessage id="details" />
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
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h4">
                    <FormattedMessage id="job-details" />
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="job-code" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.job_code}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="priority" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.priority}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="post-date" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{moment(item?.post_date).format('Do MMM YYYY hh:mm A')}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="start-date" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{moment(item?.start).format('Do MMM YYYY hh:mm A')}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="actual-time" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.actual_job_time}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="job-type" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.work_type}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="task" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.task}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="status" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">
                        {item?.status === 1 && (
                          <Chip
                            label="Not Started"
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light + 60,
                              color: theme.palette.success.dark
                            }}
                          />
                        )}
                        {item?.status === 2 && (
                          <Chip
                            label="Started"
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                              color: theme.palette.success.dark
                            }}
                          />
                        )}
                        {item?.status === 3 && (
                          <Chip
                            label="Completed"
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 80,
                              color: theme.palette.orange.dark
                            }}
                          />
                        )}
                        {item?.status === 4 && (
                          <Chip
                            label="Pending"
                            size="small"
                            sx={{
                              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                              color: theme.palette.warning.dark
                            }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="task-date" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{moment(item?.task_date).format('Do MMM YYYY hh:mm A')}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="end-date" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{moment(item?.end).format('Do MMM YYYY hh:mm A')}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="work-time" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.work_time}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h4">
                    <FormattedMessage id="employee-details" />
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="name" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.name}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="city" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.city}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="email" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.email}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="company" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.company_name}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="deparment" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.departmentName}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="phone" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.contact_details}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="state" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">
                        <Typography variant="h5">{item?.state}</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="address" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.address}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="branch" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.branch_name}</Typography>
                    </Grid>
                    {/* <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="department" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.departmentName}</Typography>
                    </Grid> */}
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h4">
                    <FormattedMessage id="other-details" />
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="serviceunit" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.service_unit}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="critical" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.critical}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="shortdescrption" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.short_descrption}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="quote" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.quote}</Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="taskdetails" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.task_details}</Typography>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="longdescrption" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.long_descrption}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Divider sx={sxDivider} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Company;
