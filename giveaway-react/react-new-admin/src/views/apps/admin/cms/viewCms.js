/* eslint-disable arrow-body-style */
import React, { useState, useEffect, Suspense } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Grid,
  Stack,
  CircularProgress,
  IconButton,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateCmsRequest } from 'store/slices/cms';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const ViewCms = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <IconButton edge="end" color="inherit" onClick={close} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon style={{ marginRight: '25px' }} />
        </IconButton>
      </DialogTitle>
      <DialogTitle>{item?.type}</DialogTitle>
      <DialogContent dangerouslySetInnerHTML={{ __html: item.content }} />
    </Dialog>
  );
};

export default ViewCms;
