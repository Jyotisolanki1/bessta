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
  Grid,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'store';
import { getUser, statusChangeRequest, userSubscriptionRequest } from 'store/slices/users';
import Skeleten from 'utils/skeleten';
import '../../../../../styles/extra.css';

import moment from 'moment';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| USER LIST STYLE 1 ||============================== //

const Users = ({ uid, type }) => {
  const { loading, totalPages } = useSelector((state) => state.users);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openView, setOpenView] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [subscription, setSubscription] = React.useState({ data: [] });
  const [orderBy, setOrderBy] = React.useState('');

  const searchParams = new URLSearchParams(window.location.search);

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

  const sortedData = React.useMemo(() => {
    if (!orderBy) return subscription.data;

    return [...subscription.data].sort((a, b) => {
      const valueA = orderBy === 'purchaseDate' ? moment(a?.plan_id?.[orderBy]).valueOf() : a?.plan_id?.[orderBy];
      const valueB = orderBy === 'purchaseDate' ? moment(b?.plan_id?.[orderBy]).valueOf() : b?.plan_id?.[orderBy];

      if (order === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
      }
    });
  }, [subscription, orderBy, order]);

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">Package Membership History</Typography>
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'intervalType'}
                  direction={orderBy === 'intervalType' ? order : 'asc'}
                  onClick={() => handleRequestSort('intervalType')}
                >
                  Interval Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'intervalCount'}
                  direction={orderBy === 'intervalCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('intervalCount')}
                >
                  Interval Count
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'entries'}
                  direction={orderBy === 'entries' ? order : 'asc'}
                  onClick={() => handleRequestSort('entries')}
                >
                  Entries
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'purchaseDate'}
                  direction={orderBy === 'purchaseDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('purchaseDate')}
                >
                  Purchase Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Draw</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={8} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={8} align="center">
                  No history found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.plan_id?.name}</TableCell>
                  <TableCell>
                    {row?.plan_id?.intervalType ? row.plan_id.intervalType.charAt(0).toUpperCase() + row.plan_id.intervalType.slice(1) : ''}
                  </TableCell>
                  <TableCell>{row?.plan_id?.intervalCount}</TableCell>
                  <TableCell>{row?.entries}</TableCell>
                  <TableCell>${row?.amount}</TableCell>
                  <TableCell>{moment(row?.startDate).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row?.draw_id?.name ? row?.draw_id?.name : 'N/A'}</TableCell>
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
