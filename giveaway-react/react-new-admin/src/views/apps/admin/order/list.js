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
  Button,
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
  Tooltip,
  TableSortLabel,
  Stack,
  IconButton,
  TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { startOfDay, parseISO } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import Avatar from 'components/ui-component/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getOrders, statusChangeRequest } from 'store/slices/orders';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import moment from 'moment';
import { openSnackbar } from 'store/slices/snackbar';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import OrderView from './OrderView';
import OrderStatus from './OrderStatus';
// ==============================|| USER LIST STYLE 1 ||============================== //

const Users = () => {
  const { data, loading, totalPages } = useSelector((state) => state.orders);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openView, setOpenView] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [selectingEndDate, setSelectingEndDate] = React.useState(false);
  const [startError, setStartError] = React.useState('');
  const [endError, setEndError] = React.useState('');

  // React.useEffect(() => {
  //   const endDateFilter = endDate || startDate;
  //   dispatch(getOrders(page, limit, startDate, endDateFilter));
  // }, [status, page, limit, startDate, endDate, dispatch]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const clearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectingEndDate(false);
    setEndError('');
    setStartError('');
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const valueA = a[orderBy] || '';
      const valueB = b[orderBy] || '';

      if (['total'].includes(orderBy)) {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  }, [data, orderBy, order]);

  // const handleDateChange = (date, isEndDate = false) => {
  //   const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;

  //   if (isEndDate) {
  //     if (startDate && moment(date).isSameOrAfter(moment(startDate))) {
  //       setEndDate(formattedDate);
  //       setSelectingEndDate(false);
  //     } else {
  //       setEndDate(null);
  //       setSelectingEndDate(true);
  //     }
  //   } else {
  //     setStartDate(formattedDate);
  //     if (formattedDate) {
  //       setEndDate(null);
  //       setSelectingEndDate(true);
  //     }
  //   }

  //   const newStartDate = isEndDate ? startDate : formattedDate;
  //   const newEndDate = isEndDate ? formattedDate : endDate;

  //   // Trigger the API call whenever dates change
  //   dispatch(getOrders(page, limit, newStartDate, newEndDate));
  // };
  // eslint-disable-next-line consistent-return
  const handleStartDateChange = (date) => {
    const futureDate = new Date(date);

    if (futureDate > new Date()) {
      setStartError('Future date not allowed');
      return false;
    } else {
      setStartError('');
      const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;
      setStartDate(formattedDate);
      if (formattedDate && endDate && moment(endDate).isBefore(date)) {
        setEndDate(null);
        setSelectingEndDate(true);
      }
    }
  };

  // eslint-disable-next-line consistent-return
  const handleEndDateChange = (date) => {
    const futureDate = new Date(date);
    if (futureDate > new Date()) {
      setEndError('Future date not allowed');
      return false;
    } else {
      setEndError('');
      const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;
      setEndDate(formattedDate);
      if (startDate && moment(date).isBefore(moment(startDate))) {
        setStartDate(null);
      } else {
        setSelectingEndDate(false);
      }
    }
  };

  React.useEffect(() => {
    const endDateFilter = endDate || startDate;
    dispatch(getOrders(page, limit, startDate, endDateFilter));
  }, [status, page, limit, startDate, endDate, dispatch]);

  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };

  const handleClickStatus = (row) => {
    setItem(row);
    setOpenStatus(true);
  };

  const changeUpdate = (flag) => {
    setOpenStatus(false);
    if (flag === true) {
      setStatus(!status);
    }
  };

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item sx={6}>
            <Typography variant="h3">Order List</Typography>
          </Grid>
          <Grid item sx={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
                <Grid item>
                  <DatePicker
                    label="Start Date"
                    value={startDate ? parseISO(startDate) : null}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    maxDate={new Date()}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    label="End Date"
                    value={endDate ? parseISO(endDate) : null}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    maxDate={new Date()}
                    minDate={startDate ? parseISO(startDate) : null}
                  />
                </Grid>
                <Grid item>
                  {startDate ? (
                    <IconButton color="inherit">
                      <CloseIcon onClick={clearDate} />
                    </IconButton>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </LocalizationProvider>
            {startError && <Typography style={{ marginLeft: '4%', color: 'red' }}>{startError}</Typography>}
            {endError && <Typography style={{ marginLeft: '4%', color: 'red' }}>{endError}</Typography>}
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
              <TableCell onClick={() => handleRequestSort('_id')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === '_id'}
                  direction={orderBy === '_id' ? order : 'asc'}
                  onClick={() => handleRequestSort('_id')}
                >
                  Order ID
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('createdAt')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Order Date
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('lineItems')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'lineItems'}
                  direction={orderBy === 'lineItems' ? order : 'asc'}
                  onClick={() => handleRequestSort('lineItems')}
                >
                  Items
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('total')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('status')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={7} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={7} align="center">
                  No order found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?._id}</TableCell>
                  <TableCell>{moment(row?.createdAt).format('Do MMM YYYY')}</TableCell>
                  <TableCell>{row?.lineItems?.length}</TableCell>
                  <TableCell>${row?.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {row.status === 'delivered' ? (
                      <Chip
                        label="Delivered"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : row.status === 'pending' ? (
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }}
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        title="Click to change status"
                      />
                    ) : row.status === 'hold' ? (
                      <Chip
                        label="Hold"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to change status"
                      />
                    ) : row.status === 'paid' ? (
                      <Chip
                        label="Paid"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.info.light,
                          color: theme.palette.info.dark
                        }}
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to change status"
                      />
                    ) : row.status === 'shipped' ? (
                      <Chip
                        label="Shipped"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light + 60,
                          color: theme.palette.primary.dark
                        }}
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{ cursor: 'pointer' }}
                        title="Click to change status"
                      />
                    ) : (
                      <Chip
                        label="N/A"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light + 60,
                          color: theme.palette.secondary.dark
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View order details" key="1">
                          <IconButton color="primary" className="custom-icon-button">
                            <VisibilityTwoToneIcon
                              onClick={() => {
                                handleClickOpenView(row);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid item xs={12} sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Pagination count={totalPages} page={page} color="primary" onChange={handleChangePage} />
          </Grid>
          <Grid item>
            <Select
              labelId="demo-simple-select-label"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
              id="demo-simple-select"
              label="Age"
            >
              <MenuItem selected value={10}>
                Ten
              </MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
      {openStatus && <OrderStatus item={item} open={openStatus} close={(flag) => changeUpdate(flag)} />}
      {openView && <OrderView item={item} open={openView} close={() => setOpenView(false)} />}
    </MainCard>
  );
};

export default Users;
