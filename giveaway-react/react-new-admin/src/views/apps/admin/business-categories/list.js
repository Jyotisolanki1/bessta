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
  Avatar,
  Tooltip,
  TableSortLabel,
  MenuItem
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getBusinessCat,deleteBusinessCategory } from 'store/slices/businessCategory';
import AddBusinessCategory from './categoryAdd';
import UpadteBusinessCategory from './categoryUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { openSnackbar } from 'store/slices/snackbar';
// import { deleteBusinessCategory } from 'store/slices/businessCategory';

// ==============================|| USER LIST STYLE 1 ||============================== //

const BusinessCategryList = () => {
  const { businessCatData, loading } = useSelector((state) => state.businessCat);

  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openSpin, setOpenSpin] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [opendelete, setOpenDelete] = React.useState(false);

  React.useEffect(() => {
    dispatch(getBusinessCat(search));
  }, [status, search, openUpdate, openAdd,opendelete]);

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

  const sortedData = React.useMemo(() => {
    if (!orderBy) return businessCatData;

    return [...businessCatData].sort((a, b) => {
      const valueA = a[orderBy] || '';
      const valueB = b[orderBy] || '';

      if (['value'].includes(orderBy)) {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  }, [businessCatData, orderBy, order]);

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

  const changeSpin = (flag) => {
    setOpenSpin(false);
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
  const handleSpinWheel = (row) => {
    setItem(row);
    setOpenSpin(true);
  };

  const handleDeleteOpen = async (row) => {
    try {
      const alt = window.confirm('Are you sure, you want to delete query?');
      if (alt) {
        const response = await dispatch(deleteBusinessCategory(row._id));
        if (response?.success === true) {
          dispatch(
            openSnackbar({
              open: true,
              message: response?.message,
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
          setOpenDelete(!opendelete);
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: response?.message,
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainCard title="Business Category List" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <OutlinedInput
              id="input-search-list-style1"
              placeholder="Search By Name"
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
            <Tooltip title="Add Business Category">
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
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={3} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  No Category found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end">
                      <Tooltip title="Update Business Category" key="1">
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openUpdate && <UpadteBusinessCategory item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <AddBusinessCategory open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default BusinessCategryList;
