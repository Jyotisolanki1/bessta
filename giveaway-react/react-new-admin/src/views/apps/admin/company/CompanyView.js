/* eslint-disable lines-around-directive */
/* eslint-disable no-nested-ternary */
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
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';
import { getBranch } from 'store/slices/company';

import { imgPath } from 'config';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import Skeleten from '../../../../utils/skeleten';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const sxDivider = {
  borderColor: 'primary.light'
};

const Company = ({ open, close, item }) => {
  const { branchData, branchLoading } = useSelector((state) => state.company);
  const Avatar1 = `${imgPath}${item?.logo}`;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBranch(item?.id));
  }, [item?.id]);
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
            <FormattedMessage id="company-details" />
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
                        <FormattedMessage id="owner-name" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.owner}</Typography>
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
                        <FormattedMessage id="phone" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5" sx={{ display: 'inline' }}>
                        {`${item?.country_code} - ${item?.phone_number}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="port" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.port}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="ip" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.ip}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="address" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.address}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="city" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.city}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">
                        <FormattedMessage id="state" />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.state}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h3">
                    <FormattedMessage id="branch-list" />
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>
                            <FormattedMessage id="name" />
                          </TableCell>
                          {/* <TableCell>
                            <FormattedMessage id="owner-name" />
                          </TableCell>
                          <TableCell>
                            <FormattedMessage id="email" />
                          </TableCell>
                          <TableCell>
                            <FormattedMessage id="phone" />
                          </TableCell> */}
                          <TableCell>
                            <FormattedMessage id="address" />
                          </TableCell>
                          <TableCell>
                            <FormattedMessage id="city" />
                          </TableCell>
                          <TableCell>
                            <FormattedMessage id="state" />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {branchLoading ? (
                          <Skeleten count={5} />
                        ) : !Array.isArray(branchData) || branchData.length === 0 ? (
                          <TableRow hover>
                            <TableCell colSpan={5} align="center">
                              <FormattedMessage id="no-branch-found" />
                            </TableCell>
                          </TableRow>
                        ) : (
                          branchData.map((row, index) => (
                            <TableRow hover key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.address}</TableCell>
                              <TableCell>{row.city}</TableCell>
                              <TableCell>{row.state}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider sx={sxDivider} />
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
