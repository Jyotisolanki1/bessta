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
  Switch,
  FormControl
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getPlans, statusChangeRequest, getCategories, deletePlan } from 'store/slices/plans';
import PlanAdd from './PlanAdd';
import PlanUpdate from './PlanUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { priceSymbol } from 'config';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import Viewplan from './Viewplan';
import { useRouter } from 'next/navigation';

// ==============================|| USER LIST STYLE 1 ||============================== //

const PlanList = () => {
  const { planData, loading, totalPages, categoryData } = useSelector((state) => state.plans);
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
  const [searchFilter, setSearchFilter] = React.useState('');
  const [opendelete, setOpenDelete] = React.useState(false);
  const [category, setCategory] = React.useState('select');
  const [filter, setFilter] = React.useState('filter');
  const router = useRouter();
  React.useEffect(() => {
    dispatch(getPlans(search, searchCategory, searchFilter, page, limit));
  }, [status, search, searchCategory, page, limit, openUpdate, openAdd, openView, opendelete,searchFilter]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  useEffect(() => {
    setCategory(id ? id.trim() : 'select');
    setSearchCategory(id ? id.trim() : '');
    setPage(1);
    setLimit(10);
  }, [id]);
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
  const handleClickOpenView = (row) => {
    localStorage.setItem('planid', JSON.stringify(row._id));
    router.push('plans/view');
  };
  const handleDeleteOpen = async (row) => {
    console.log(row);
    try {
      const alt = window.confirm('Are you sure, you want to delete plan?');
      if (alt) {
        const response = await dispatch(deletePlan(row._id));
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
    if (!orderBy) return planData;

    return [...planData].sort((a, b) => {
      const valueA = orderBy === 'category' ? a.category.name : a[orderBy];
      const valueB = orderBy === 'category' ? b.category.name : b[orderBy];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }, [planData, orderBy, order]);

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
    <MainCard title="Plan List" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Stack direction="row" spacing={1}>
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
                  {categoryData.map((option, index) => (
                    <MenuItem key={index} value={option?._id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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

                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="true">Popular</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
            <Tooltip title="Add Plan">
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
              <TableCell onClick={() => handleRequestSort('intervalType')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'intervalType'}
                  direction={orderBy === 'intervalType' ? order : 'asc'}
                  onClick={() => handleRequestSort('intervalType')}
                >
                  Interval Type
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('intervalCount')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'intervalCount'}
                  direction={orderBy === 'intervalCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('intervalCount')}
                >
                  Interval Count
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('entries')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'entries'}
                  direction={orderBy === 'entries' ? order : 'asc'}
                  onClick={() => handleRequestSort('entries')}
                >
                  Entries
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('price')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('category')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'category.name'}
                  direction={orderBy === 'category.name' ? order : 'asc'}
                  onClick={() => handleRequestSort('category.name')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={9} />
            ) : !sortedplanData || sortedplanData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  No plan found
                </TableCell>
              </TableRow>
            ) : (
              sortedplanData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{row?.intervalType}</TableCell>
                  <TableCell>{row?.intervalCount}</TableCell>
                  <TableCell>{row?.entries}</TableCell>
                  <TableCell>
                    {priceSymbol} {row?.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{row?.category?.name}</TableCell>
                  {/* <TableCell>{row?.stripePlanId}</TableCell> */}
                  <TableCell>
                    <Switch
                      checked={row.status === 'active' || row.status === 'enabled'}
                      onChange={() => handleClickStatus(row)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <br />

                    {row.status === 'active' || row.status === 'enabled' ? (
                      <Chip
                        label="Enabled"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : (
                      <Chip
                        label="Disabled"
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
                      <Tooltip title="View plan details" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Plan" key="1">
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
      {openUpdate && <PlanUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <PlanAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
      {openView && <Viewplan item={item} open={openView} close={() => setOpenView(false)} />}
    </MainCard>
  );
};

export default PlanList;
