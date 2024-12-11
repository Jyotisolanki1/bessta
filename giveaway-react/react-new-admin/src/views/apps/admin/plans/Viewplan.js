/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React, { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardContent,
  Fab,
  Chip,
  Tooltip,
  TableSortLabel,
  MenuItem,
  Typography,
  TextField,
  Switch,
  FormControl
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { startOfDay, parseISO } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getPlans, statusChangeRequest, getCategories, planDetailRequest } from 'store/slices/plans';
import PlanAdd from './PlanAdd';
import PlanUpdate from './PlanUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import { openSnackbar } from 'store/slices/snackbar';
import { priceSymbol } from 'config';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { useRouter } from 'next/navigation';
// ==============================|| USER LIST STYLE 1 ||============================== //

const PlanList = () => {
  const { planloading, planDetail, totalPages } = useSelector((state) => state.plans);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('');
  const [category, setCategory] = React.useState('select');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [startError, setStartError] = React.useState('');
  const [endError, setEndError] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState('');
  const [filter, setFilter] = React.useState('filter');

  const router = useRouter();
  React.useEffect(() => {
    const endDateFilter = endDate || startDate;
    dispatch(planDetailRequest(JSON.parse(localStorage.getItem('planid')), page, limit, searchFilter, startDate, endDateFilter));
  }, [page, limit, searchFilter, startDate, endDate]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  // useEffect(() => {
  //   setCategory(id ? id.trim() : 'select');
  //   setSearchCategory(id ? id.trim() : '');
  //   setPage(1);
  //   setLimit(10);
  // }, [id]);
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const id = searchParams.get('id');
  // console.log(id)
  //  React.useEffect(() => {
  //     if (id) {
  //       console.log(id)
  //       setSearchCategory(id);
  //       setCategory(id);
  //       setPage(1);
  //       setLimit(10);
  //     }
  //   }, [searchCategory,page,category]);

  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };

  const onCategorySearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      if (e.target.value === 'select') {
        setSearchCategory('');
      } else {
        setSearchCategory(e.target.value);
      }
      setCategory(e.target.value);
      setPage(1);
      setLimit(10);
    }
  };

  const handleClickOpenView = (row) => {
    localStorage.setItem('planid', JSON.stringify(row._id));
    router.push('plans/view');
  };

  const handleRequestSort = (property) => {
    let orderByProperty = property;
    if (property === 'category.name') {
      orderByProperty = 'category';
    }

    const isAsc = orderBy === orderByProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(orderByProperty);
  };

  // const handleRequestSort = (property) => {
  //   let orderByProperty = property;
  //   if (property === 'category.name') {
  //     orderByProperty = 'category';
  //   }

  //   const isAsc = orderBy === orderByProperty && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(orderByProperty);
  // };

  // const sortedplanData = React.useMemo(() => {
  //   if (!orderBy) return planData;

  //   return [...planData].sort((a, b) => {
  //     const valueA = a[orderBy] || ''; // handle undefined or blank values
  //     const valueB = b[orderBy] || ''; // handle undefined or blank values

  //     if (['entries', 'intervalCount'].includes(orderBy)) {
  //       // Convert values to numbers for numeric fields
  //       return order === 'asc' ? valueA - valueB : valueB - valueA;
  //     } else if (orderBy === 'price') {
  //       // Convert values to numbers for price field
  //       return order === 'asc' ? parseFloat(valueA) - parseFloat(valueB) : parseFloat(valueB) - parseFloat(valueA);
  //     } else if (typeof valueA === 'string' && typeof valueB === 'string') {
  //       // Use localeCompare for string comparison
  //       return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  //     } else {
  //       // Fallback comparison for other types
  //       return order === 'asc' ? valueA - valueB : valueB - valueA;
  //     }
  //   });
  // }, [planData, orderBy, order]);

  const sortedplanData = React.useMemo(() => {
    if (!orderBy) return planDetail;

    return [...planDetail].sort((a, b) => {
      const valueA = orderBy === 'category' ? a.category.name : a[orderBy];
      const valueB = orderBy === 'category' ? b.category.name : b[orderBy];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }, [planDetail, orderBy, order]);

  const changeUpdate = (flag) => {
    setOpenUpdate(false);
    if (flag === true) {
      setStatus(!status);
    }
  };

  const handleStartDateChange = (date) => {
    const futureDate = new Date(date);

    if (futureDate > new Date()) {
      setStartError('Future date not allowed');
      return;
    }

    setStartError('');
    const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;
    setStartDate(formattedDate);
    if (formattedDate) {
      setEndError('');
    }
    if (formattedDate && endDate && moment(endDate).isBefore(date)) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      setStartError('Please select a start date first');
      return;
    }

    const futureDate = new Date(date);
    if (futureDate > new Date()) {
      setEndError('Future date not allowed');
      return;
    }

    setEndError('');
    const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;
    setEndDate(formattedDate);
  };

  const clearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setEndError('');
    setStartError('');
  };
  const changeAdd = (flag) => {
    setOpenAdd(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  const onFilterSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      if (e.target.value === 'filter') {
        setSearchFilter('');
      } else {
        setSearchFilter(e.target.value);
      }
      setFilter(e.target.value);
      setPage(1);
      setLimit(10);
    }
  };
  const handleClickOpen = (row) => {
    setItem(row);
    setOpenUpdate(true);
  };
  const handleClickStatus = async (row) => {
    try {
      const data = {
        id: row?._id,
        status: row.status === 'active' ? 'inactive' : 'active'
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
          message: 'Something went wrong. Please try again letar.',
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
  React.useEffect(() => {
    dispatch(getCategories(''));
  }, []);
  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item sx={6}>
            <Typography variant="h3">User</Typography>
          </Grid>
          <Grid item sx={6}>
            <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
              <Grid item>
                <FormControl fullWidth>
                  {/* <InputLabel id="category-label">Category</InputLabel> */}
                  <Select
                    id="demo-simple-select"
                    // label="Category"
                    onChange={onFilterSearch}
                    name="filter"
                    value={filter || 'filter'}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="filter">Filter By</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="update">Updated</MenuItem>
                    <MenuItem value="cancel">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item>
                  <DatePicker
                    label="From"
                    value={startDate ? parseISO(startDate) : null}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    maxDate={new Date()}
                  />
                  <Typography style={{ color: 'red', marginTop: '4px' }}>{startError || ''}</Typography>
                </Grid>
                <Grid item>
                  <DatePicker
                    label="To"
                    value={endDate ? parseISO(endDate) : null}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    maxDate={new Date()}
                    minDate={startDate ? parseISO(startDate) : null}
                  />
                  <Typography style={{ color: 'red', marginTop: '4px' }}>{endError || ''}</Typography>
                </Grid>
                <Grid item style={{ marginBottom: '20px' }}>
                  {startDate ? (
                    <IconButton color="inherit" onClick={clearDate}>
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    ''
                  )}
                </Grid>
              </LocalizationProvider>
            </Grid>
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
              <TableCell sx={{ cursor: 'pointer' }}>Username</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Email</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Plan Name</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Interval Type</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Interval Count</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Entries</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Price</TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Subscription Date</TableCell>

              {/* <TableCell onClick={() => handleRequestSort('stripePlanId')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'stripePlanId'}
                  direction={orderBy === 'stripePlanId' ? order : 'asc'}
                  onClick={() => handleRequestSort('stripePlanId')}
                >
                  Stripe Id
                </TableSortLabel>
              </TableCell> */}
              <TableCell onClick={() => handleRequestSort('status')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planloading ? (
              <Skeleten count={10} />
            ) : !sortedplanData || sortedplanData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={10} align="center">
                  No plan found
                </TableCell>
              </TableRow>
            ) : (
              sortedplanData.map((row, index) => (
                <TableRow hover key={index}>
                  {console.log(row)}
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.uid?.firstname}</TableCell>
                  <TableCell>{row?.uid?.email}</TableCell>
                  <TableCell>{row?.plan_id?.name}</TableCell>
                  <TableCell>{row.plan_id.intervalType.charAt(0).toUpperCase() + row.plan_id.intervalType.slice(1)}</TableCell>
                  <TableCell>{row?.plan_id?.intervalCount}</TableCell>
                  <TableCell>{row?.entries}</TableCell>
                  <TableCell>${row?.amount}</TableCell>
                  <TableCell>
                    {' '}
                    {row?.status === 'active'
                      ? 'Active'
                      : row?.status === 'update'
                      ? 'Updated'
                      : row?.status === 'cancel'
                      ? 'Cancelled'
                      : ''}
                  </TableCell>
                  <TableCell>{row.createdAt ? moment(row.createdAt).local().format('Do MMM YYYY, HH:mm:ss') : 'N/A'}</TableCell>
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
    </MainCard>
  );
};

export default PlanList;
