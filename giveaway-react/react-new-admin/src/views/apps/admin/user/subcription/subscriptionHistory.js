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
import {
  Stack,
  Grid,
  MenuItem,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Select,
  Chip,
  IconButton,
  Tooltip,
  TableSortLabel
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import Avatar from 'components/ui-component/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getUser, statusChangeRequest, userSubscriptionRequest } from 'store/slices/users';
// import { FormattedMessage } from 'react-intl';
import Skeleten from 'utils/skeleten';
// import '../../../../styles/extra.css';
import '../../../../../styles/extra.css';

import moment from 'moment';
import { openSnackbar } from 'store/slices/snackbar';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

// ==============================|| USER LIST STYLE 1 ||============================== //

const Users = ({ uid, type }) => {
  const { data, loading, totalPages } = useSelector((state) => state.users);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [subscription, setSubscription] = React.useState('');

  const searchParams = new URLSearchParams(window.location.search);
  // const uid = searchParams.get('uid');
  // const type = searchParams.get('type');

  const fetchSubscription = async () => {
    if (uid) {
      const res = await dispatch(userSubscriptionRequest({ uid, type }));
      setSubscription(res);
    }
  };

  React.useEffect(() => {
    dispatch(getUser(search, page, limit));
    fetchSubscription();
  }, [status, search, page, limit, openView, uid, type]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };

  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };

  const handleClickStatus = async (row) => {
    try {
      const data = {
        id: row?._id,
        isStatus: row.isStatus === 'active' ? 'blocked' : 'active'
      };

      const res = await dispatch(statusChangeRequest(data));
      if (res?.success === true) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
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
        setStatus(!status);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
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

  const sortedSubscription = React.useMemo(() => {
    if (!orderBy) return subscription?.data || [];

    return [...subscription?.data].sort((a, b) => {
      const valueA = a?.plan_id?.[orderBy] || '';
      const valueB = b?.plan_id?.[orderBy] || '';

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc'
          ? String(valueA).localeCompare(String(valueB), undefined, { numeric: true })
          : String(valueB).localeCompare(String(valueA), undefined, { numeric: true });
      }
    });
  }, [subscription, orderBy, order]);

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">Subscription History</Typography>
          </Grid>
        </Grid>
      }
      content={false}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('intervalType')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'intervalType'} direction={orderBy === 'intervalType' ? order : 'asc'}>
                  Interval Type
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('intervalCount')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'intervalCount'} direction={orderBy === 'intervalCount' ? order : 'asc'}>
                  Interval Count
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('entries')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'entries'} direction={orderBy === 'entries' ? order : 'asc'}>
                  Entries
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('price')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'}>
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('purchaseDate')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'purchaseDate'} direction={orderBy === 'purchaseDate' ? order : 'asc'}>
                  Purchase Date
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('endDate')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel active={orderBy === 'endDate'} direction={orderBy === 'endDate' ? order : 'asc'}>
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={9} />
            ) : !sortedSubscription || sortedSubscription.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  No history found
                </TableCell>
              </TableRow>
            ) : (
              sortedSubscription.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.plan_id?.name}</TableCell>
                  <TableCell>
                    {row?.plan_id?.intervalType ? row.plan_id.intervalType.charAt(0).toUpperCase() + row.plan_id.intervalType.slice(1) : ''}
                  </TableCell>
                  <TableCell>{row?.plan_id?.intervalCount}</TableCell>
                  <TableCell>{row?.entries}</TableCell>
                  <TableCell>${row?.amount}</TableCell>
                  <TableCell>{moment(row?.createdAt).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{moment(row?.endDate).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    {row?.status === 'active'
                      ? 'Active'
                      : row?.status === 'update'
                      ? 'Updated'
                      : row?.status === 'cancel'
                      ? 'Cancelled'
                      : ''}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default Users;
