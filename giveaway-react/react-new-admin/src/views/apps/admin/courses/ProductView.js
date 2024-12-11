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
            Product Details
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
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h4">Details</Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Name</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.name}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Tags</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.tags}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Slug</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.slug}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4} md={4}>
                      <Typography variant="h4">Category</Typography>
                    </Grid>
                    <Grid item xs={6} sm={8} md={8}>
                      <Typography variant="h5">{item?.category?.name}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h4">Images</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {/* Map through each image and render them */}
                    {item?.images.map((image, index) => (
                      <Grid item key={index}>
                        {' '}
                        {/* Each image occupies one grid item */}
                        <Avatar src={`${imgPath}${image}`} sx={{ width: 100, height: 100 }} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h4">Varients</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Size</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item?.variableProducts.map((product, index) => {
                          return (
                            <TableRow hover key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{product?.price}</TableCell>
                              <TableCell>{product?.stock}</TableCell>
                              <TableCell>{product?.attributes[0]?.value}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
