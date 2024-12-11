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
  MenuItem
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getCoupons } from 'store/slices/coupons';
import CouponAdd from './CouponAdd';
import CouponUpdate from './CouponUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/AddTwoTone';
import moment from 'moment';
// ==============================|| USER LIST STYLE 1 ||============================== //

const CouponList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.coupons);
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

  React.useEffect(() => {
    dispatch(getCoupons(search, page, limit));
  }, [status, search, page, limit,openUpdate,openAdd]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sorteddata = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const valueA = a[orderBy] || '';
      const valueB = b[orderBy] || '';

      if (['value'].includes(orderBy)) {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  }, [data, orderBy, order]);

  const changeUpdate = (flag) => {
    setOpenUpdate(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  const changeAdd = (flag) => {
    setOpenAdd(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  const handleClickOpen = (row) => {
    setItem(row);
    setOpenUpdate(true);
  };
  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };
  return (
    <MainCard title="Coupon List" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <OutlinedInput
              id="input-search-list-style1"
              placeholder="Search By Code"
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="16px" />
                </InputAdornment>
              }
              size="small"
              defaultValue={search}
              onChange={onSearch}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Tooltip title="Add Coupon">
              <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}>
                <AddIcon
                  fontSize="small"
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell onClick={() => handleRequestSort('code')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'code'}
                  direction={orderBy === 'code' ? order : 'asc'}
                  onClick={() => handleRequestSort('code')}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('description')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleRequestSort('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('value')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'value'}
                  direction={orderBy === 'value' ? order : 'asc'}
                  onClick={() => handleRequestSort('value')}
                >
                  Value
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('discountType')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'discountType'}
                  direction={orderBy === 'discountType' ? order : 'asc'}
                  onClick={() => handleRequestSort('discountType')}
                >
                  Discount Type
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('expirDate')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'expirDate'}
                  direction={orderBy === 'expirDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('expirDate')}
                >
                  Expiry Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
              Status
            </TableCell>
            
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={8} />
            ) : !sorteddata || sorteddata.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={8} align="center">
                  No coupon found
                </TableCell>
              </TableRow>
            ) : (
              sorteddata.map((row, index) => {
                // Check if expiration date is in the past
                const isExpired = moment(row.expirDate).isBefore(moment());
                
                // Determine status based on expiration date and current status
                let status;
                if (isExpired) {
                  status = 'expired';
                } else {
                  status = row.status;
                }
                
                return (
                  <TableRow hover key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.code}</TableCell>
                  <TableCell>{row?.description}</TableCell>
                  <TableCell>{row?.value}</TableCell>
                  <TableCell>{row?.discountType === 'percentage' ? "Percentage" : "Fixed"}</TableCell>
                  <TableCell>{moment(row?.expirDate).format('Do MMM YYYY')}</TableCell>
                    <TableCell>
                      {status === 'active' ? (
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            background:
                              theme.palette.mode === 'dark'
                                ? theme.palette.dark.main
                                : theme.palette.success.light + 60,
                            color: theme.palette.success.dark,
                          }}
                        />
                      ) : status === 'inactive' ? (
                        <Chip
                          label="Inactive"
                          size="small"
                          sx={{
                            background:
                              theme.palette.mode === 'dark'
                                ? theme.palette.dark.main
                                : theme.palette.warning.light,
                            color: theme.palette.warning.dark,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Expired"
                          size="small"
                          sx={{
                            background:
                              theme.palette.mode === 'dark'
                                ? theme.palette.dark.main
                                : theme.palette.error.light + 60,
                            color: theme.palette.error.dark,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Update Coupon" key="1">
                        <IconButton color="secondary" className="custom-icon-button">
                          <EditTwoToneIcon
                            onClick={() => {
                              handleClickOpen(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  </TableRow>
                );
              })
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
      {openUpdate && <CouponUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <CouponAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default CouponList;
