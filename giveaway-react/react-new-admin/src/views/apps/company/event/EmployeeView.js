'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Grid, Typography, IconButton, Divider } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath } from 'config';
import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const sxDivider = {
  borderColor: 'primary.light'
};

const Company = ({ open, close, item }) => {
  const Avatar1 = `${imgPath}${item?.profile_pic}`;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="sm"
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormattedMessage id="employee-details" />
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
                <Grid item xs={6} sm={4} md={4}>
                  <Avatar src={Avatar1} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
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
                        <FormattedMessage id="email" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.email}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="department" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.departmentName}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="branch" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5" sx={{ display: 'inline' }}>
                        {item?.branch_info?.branchName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="username" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.username}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="sallary" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.salary_no}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                {/* <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Status</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.status}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Sallary</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.salary_no}</Typography>
                    </Grid>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Company;
