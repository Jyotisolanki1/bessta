/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
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
  Typography,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { deleteEmployeeRequest } from 'store/slices/employee';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';
import { FormattedMessage } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Employee = ({ open, close, id }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const confirmDelete = async () => {
    try {
      const data = {
        id: id
      };
      const res = await dispatch(deleteEmployeeRequest(data));
      if (res?.succeeded === true) {
        setLoading(false);
        // resetForm();
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
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage id="del-action" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body2" component="span">
            <FormattedMessage id="del-action-con" />
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pr: 2.5 }}>
        <Button
          sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
          onClick={() => {
            close();
          }}
          color="secondary"
        >
          <FormattedMessage id="cancle" />
        </Button>
        <Button variant="contained" size="small" onClick={confirmDelete} autoFocus>
          {loading ? (
            <>
              <CircularProgress color="primary" />
              &nbsp;
              <FormattedMessage id="loading" /> ...
            </>
          ) : (
            <FormattedMessage id="del-con-button" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Employee;
