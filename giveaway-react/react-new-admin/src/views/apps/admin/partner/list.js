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
  MenuItem,
  OutlinedInput,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Select,
  FormControl,
  Chip,
  Tooltip,
  TableSortLabel,
  CardContent,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddTwoTone';
import AddPartner from './addPartner';
import { useRouter } from 'next/navigation';
// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
// assets
import Avatar from 'components/ui-component/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getPartner, statusChangeRequest } from 'store/slices/partners';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import { imgPath } from 'config';
import { openSnackbar } from 'store/slices/snackbar';
import { getBusinessCat } from 'store/slices/businessCategory';
import UpdatePartner from './UpdateUser';

// ==============================|| USER LIST STYLE 1 ||============================== //

const Partners = () => {
  const { data, loading, totalPages } = useSelector((state) => state.partner);
  const { businessCatData } = useSelector((state) => state.businessCat);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [partner, setOpenPartner] = React.useState();
  const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [searchCategory, setSearchCategory] = React.useState('');
  const [category, setCategory] = React.useState('select');
  const [openAdd, setOpenAdd] = React.useState(false);

  React.useEffect(() => {
    dispatch(getPartner(search, page, limit, searchCategory));
    dispatch(getBusinessCat());
  }, [status, search, page, limit, searchCategory,partner,openAdd]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const router = useRouter();
  const changeAdd = (flag) => {
    setOpenAdd(false);
    if (flag === true) {
      setStatus(!status);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClickOpenView = (row) => {
    localStorage.setItem('partnerdetails', JSON.stringify(row));
    router.push('partner/details');
  };
  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      let valueA;
      let valueB;

      if (orderBy === 'categoryData[0].name') {
        valueA = a.categoryData[0]?.name || '';
        valueB = b.categoryData[0]?.name || '';
      } else {
        valueA = a[orderBy];
        valueB = b[orderBy];
      }

      if (order === 'asc') {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
      } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    });
  }, [data, orderBy, order]);

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
  const handleClickOpenUpdate = async (row) => {
    console.log("row",row)
    setItem(row);
    setOpenPartner(true);
  };

  // const handleClickOpen = (row) => {
  //   setItem(row);
  //   setOpen(true);
  // };

  // const handleClickOpenView = (row) => {
  //   setItem(row);
  //   setOpenView(true);
  // };

  // const change = (flag) => {
  //   setOpen(false);
  //   if (flag === true) {
  //     setStatus(!status);
  //   }
  // };

  // const changeDelete = (flag) => {
  //   setOpenDelete(false);
  //   if (flag === true) {
  //     setStatus(!status);
  //   }
  // };

  // const handleDelete = (id) => {
  //   setId(id);
  //   setOpenDelete(true);
  // };
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
  return (
    <MainCard title="Partner List" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
          <Grid item xs={12} sm={12}>
            <Stack direction="row" spacing={2}>
              <OutlinedInput
                id="input-search-list-style1"
                placeholder="Search By City, State, Category"
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                  </InputAdornment>
                }
                size="large"
                defaultValue={search}
                onChange={onSearch}
                fullWidth
              />
              <FormControl fullWidth>
                {/* <InputLabel id="category-label">Category</InputLabel> */}
                <Select
                  id="demo-simple-select"
                  // label="Category"
                  onChange={onCategorySearch}
                  name="category"
                  value={category || 'select'}
                  sx={{ width: '100%' }}
                >
                  <MenuItem value="select">Please Select Category</MenuItem>
                  {businessCatData.map((option, index) => (
                    <MenuItem key={index} value={option?._id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <Tooltip title="Add Partner">
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
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell onClick={() => handleRequestSort('firstname')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'firstname'}
                  direction={orderBy === 'firstname' ? order : 'asc'}
                  onClick={() => handleRequestSort('firstname')}
                >
                  Profile
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('bussiness_name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'bussiness_name'}
                  direction={orderBy === 'bussiness_name' ? order : 'asc'}
                  onClick={() => handleRequestSort('bussiness_name')}
                >
                  Business Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('categoryData[0].name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'categoryData[0].name'}
                  direction={orderBy === 'categoryData[0].name' ? order : 'asc'}
                  onClick={() => handleRequestSort('categoryData[0].name')}
                >
                  Category
                </TableSortLabel>
              </TableCell>

              <TableCell onClick={() => handleRequestSort('email')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('phone')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'phone'}
                  direction={orderBy === 'phone' ? order : 'asc'}
                  onClick={() => handleRequestSort('phone')}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('address')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'address'}
                  direction={orderBy === 'address' ? order : 'asc'}
                  onClick={() => handleRequestSort('address')}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('city')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'city'}
                  direction={orderBy === 'city' ? order : 'asc'}
                  onClick={() => handleRequestSort('city')}
                >
                  City
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('state')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'state'}
                  direction={orderBy === 'state' ? order : 'asc'}
                  onClick={() => handleRequestSort('state')}
                >
                  State
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
              <Skeleten count={11} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={10} align="center">
                  No partner found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                {console.log("row",row)}
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <img src={`${imgPath}${row?.image}`} alt="loading" height={100} width={100} />
                          <Typography align="left" variant="subtitle1" component="div">
                          {row?.firstname} {row?.lastname}
                        </Typography>
                      </Grid>
      
                    </Grid>
                  </TableCell>
                  <TableCell>{row.bussiness_name}</TableCell>
                  <TableCell>{row?.categoryData[0]?.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>
                    <Switch
                      checked={row.status === 'active'}
                      onChange={() => handleClickStatus(row)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <br />
                    {row.status === 'active' ? (
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : (
                      <Chip
                        label="Inactive"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light + 60,
                          color: theme.palette.warning.dark
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Partner" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Partner" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <EditTwoToneIcon
                            onClick={() => {
                              handleClickOpenUpdate(row);
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
      {openAdd && <AddPartner open={openAdd} close={(flag) => changeAdd(flag)} />}
      {partner && <UpdatePartner item={item} open={partner} close={() => setOpenPartner(false)} />}
    </MainCard>
  );
};

export default Partners;
