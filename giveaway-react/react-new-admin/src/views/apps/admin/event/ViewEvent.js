/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-unresolved */
'use client';

import React from 'react';
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
  Card,
  CardContent
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'components/ui-component/extended/Avatar';

import { imgPath, priceSymbol } from 'config';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const sxDivider = {
  borderColor: 'primary.light'
};

const Company = ({ open, close, item }) => {
  const theme = useTheme();
  // const Avatar1 = `${imgPath}${item?.profile_pic}`;
  const suffixes = ['1st Prize', '2nd Prize', '3rd Prize'];

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          width: '30%', // Adjust this percentage or set a fixed width (e.g., '600px')
          maxWidth: 'none'
        }
      }}
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            Winners
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
                <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                  <Divider sx={sxDivider} />
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    {item?.winner.slice(0, 3).map((winner, index) => (
                      <Grid item xs={12} key={index}>
                        <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, width: '100%' }}>
                          <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" color="primary">
                              {suffixes[index]}
                            </Typography>
                            <Typography variant="body1" sx={{ w: 100 }}>
                              {item?.prizes[index]?.description} - {winner?.firstname}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                  <Divider sx={sxDivider} />
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
