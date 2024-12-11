/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-unresolved */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Grid,
  Typography,
  IconButton,
  Divider,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableCell,
  TableHead
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath } from 'config';
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
      maxWidth="sm"
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            Order Details
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
                <Grid item xs={12} sm={12} md={12} sx={{ mb: 2 }}>
                  <Typography variant="h4">Product Details</Typography>
                </Grid>
                {item?.lineItems.map((product, index) => {
                  return (
                    <Grid container>
                      <Grid item xs={6} sm={4} md={4} sx={{ mt: 2 }}>
                        <Grid container>
                          <Avatar
                            src={`${imgPath}${product?.productData?.images[0]}`}
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: 5,
                              overflow: 'hidden',
                              bgcolor: 'background.default'
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sm={8} md={8} sx={{ mt: 2 }}>
                        <Grid container>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Name</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">{product?.productInfo?.name}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Price</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">$&nbsp;{product?.price}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Size</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">{product?.productInfo?.variableProducts[0]?.attributes[0]?.value}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Quantity</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">{product?.quantity}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sx={{ mb: 1, mt: 2 }}>
                        <Divider sx={sxDivider} />
                      </Grid>
                    </Grid>
                  );
                })}
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} sx={{ mb: 2 }}>
                      <Typography variant="h4">Price Details</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Subtotal</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">${item?.subTotal}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Delivery</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.shippingCost === 0 ? 'Free' : item?.shippingCost}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Discount</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">-${(item?.subTotal - item?.total).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Estimated Total</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">${item?.total}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Status</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">
                        {item?.status ? item?.status.charAt(0).toUpperCase() + item?.status?.slice(1) : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 1 }}>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} sx={{ mb: 2 }}>
                      <Typography variant="h4">User Details</Typography>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6} sm={4} md={4} sx={{ mt: 2 }}>
                        <Grid container>
                          <Avatar
                            src={`${imgPath}${item?.userInfo?.image}`}
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: 5,
                              overflow: 'hidden',
                              bgcolor: 'background.default'
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sm={8} md={8} sx={{ mt: 2 }}>
                        <Grid container>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Name</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">
                              {item?.userInfo?.firstname} {item?.userInfo?.lastname}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Email</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">{item?.userInfo?.email}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Phone</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">{item?.userInfo?.phone}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={4} md={4}>
                            <Typography variant="h4">Status</Typography>
                          </Grid>
                          <Grid item xs={6} sm={8} md={8}>
                            <Typography variant="h5">
                              {item?.userInfo?.isStatus
                                ? item.userInfo.isStatus.charAt(0).toUpperCase() + item.userInfo.isStatus.slice(1)
                                : ''}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sx={{ mb: 1, mt: 2 }}>
                        <Divider sx={sxDivider} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} sx={{ mb: 2 }}>
                      <Typography variant="h4">Shipping Details</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Address</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.shippingAddress?.streetAddress}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">City</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.shippingAddress?.city}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">State</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.shippingAddress?.state}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Zip</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.shippingAddress?.zipCode}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
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
