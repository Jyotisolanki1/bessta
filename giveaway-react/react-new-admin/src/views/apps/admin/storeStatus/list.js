/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Switch } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

import { useDispatch, useSelector } from 'store';

import { getStoreStatus, storestatusChangeRequest } from 'store/slices/products';

import '../../../../styles/extra.css';

import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| USER LIST STYLE 1 ||============================== //

const PlanList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.products);
  
  React.useEffect(() => {
    dispatch(getStoreStatus());
  }, [dispatch]);

  const handleClickStatus = async () => {
    try {
      const newStatus = status === 'enable' ? 'disable' : 'enable';
      const data = { status: newStatus };

      const res = await dispatch(storestatusChangeRequest(data));
      if (res?.data?.success === true) {
        dispatch(getStoreStatus());
        dispatch(
          openSnackbar({
            open: true,
            message: res?.data?.message,
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
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.data?.message,
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
      dispatch(
        openSnackbar({
          open: true,
          message: 'Something went wrong. Please try again later.',
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
    <MainCard title="Store status" content={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ cursor: 'pointer' }}>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
            <TableCell>{status.charAt(0).toUpperCase() + status.slice(1)}</TableCell>

              <TableCell>
                <Switch
                  checked={status === 'enable'}
                  onChange={handleClickStatus}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <br />

                {status === 'enable' ? (
                  <Chip
                    label="Enable"
                    size="small"
                    sx={{
                      background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                      color: theme.palette.success.dark
                    }}
                  />
                ) : (
                  <Chip
                    label="Disable"
                    size="small"
                    sx={{
                      background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light + 60,
                      color: theme.palette.warning.dark
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default PlanList;
