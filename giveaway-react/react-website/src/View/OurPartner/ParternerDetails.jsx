/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { REACT_API_URL } from '../../../config';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export default function PartnerDetails({ active, setActive, partnerContent }) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setActive(false);
  };
  const handleClickAddress = () => {
    const address = partnerContent?.address;
    if (address) {
      // Encode the address to make sure it's correctly formatted in the URL
      const encodedAddress = encodeURIComponent(address);
      // Construct the URL to open the map or navigation application
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog onClose={handleClose} maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title" open={active}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Partner Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            overflowY: 'scroll',
            scrollbarWidth: 'none'
            // scrollbarColor: "orange transparent",
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={`${REACT_API_URL}${partnerContent?.image}`} height={200} width={200} />
          </div>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Name</b> : {partnerContent?.firstname + ' ' + partnerContent?.lastname}
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Business Name </b> : {partnerContent?.bussiness_name}
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Business Url </b> :{' '}
            <a target="_blank" href={`${partnerContent?.bussiness_url}`}>
              {' '}
              {partnerContent?.bussiness_url}
            </a>
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Email </b> <a href={`mailto:${partnerContent?.email}`}>: {partnerContent?.email}</a>
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Phone Number </b> : <a href={`tel:${partnerContent?.phone}`}> {partnerContent?.phone}</a>
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Address</b>:{' '}
            {partnerContent?.address ? (
              <span
                style={{
                  cursor: 'pointer', // Optionally add cursor pointer to indicate it's clickable
                  color: '#0d6efd' // Apply color only to address text
                }}
                onClick={handleClickAddress}
              >
                {partnerContent.address}
              </span>
            ) : null}
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            <b>Category Name</b> : {partnerContent?.categoryData[0]?.name}
          </Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
