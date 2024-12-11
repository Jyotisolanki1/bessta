/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable no-nested-ternary */
'use client';

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Grid,
  InputAdornment,
  Stack,
  MenuItem,
  Chip,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Select,
  IconButton,
  Tooltip,
  CardContent,
  Fab,
  TableSortLabel,
  OutlinedInput
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getEmployee } from 'store/slices/employee';
import Employee from './Employee';
import EmployeeUpdate from './EmployeeUpdate';
import EmployeeView from './EmployeeView';
// import EmployeeDelete from './EmployeeDelete';
// import { openSnackbar } from 'store/slices/snackbar';
import Avatar from 'components/ui-component/extended/Avatar';
import { imgPath } from 'config';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
// ==============================|| USER LIST STYLE 1 ||============================== //

const EmployeeList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.employee);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getEmployee(page, limit, search));
  }, [page, limit, status, search]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // const handleRequestSort = (property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const sortedData = React.useMemo(() => {
  //   if (!orderBy) return data;
  //   return [...data].sort((a, b) => {
  //     if (order === 'asc') {
  //       return a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true });
  //     } else {
  //       return b[orderBy].localeCompare(a[orderBy], undefined, { numeric: true });
  //     }
  //   });
  // }, [data, orderBy, order]);
  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const nestedPropertyA = orderBy.split('.').reduce((obj, key) => obj[key], a);
      const nestedPropertyB = orderBy.split('.').reduce((obj, key) => obj[key], b);

      if (order === 'asc') {
        return nestedPropertyA.localeCompare(nestedPropertyB, undefined, { numeric: true });
      } else {
        return nestedPropertyB.localeCompare(nestedPropertyA, undefined, { numeric: true });
      }
    });
  }, [data, orderBy, order]);

  const handleClickOpen = (row) => {
    setItem(row);
    setOpen(true);
  };

  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };

  const change = (flag) => {
    setOpen(false);
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
  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };
  return (
    <MainCard title={<FormattedMessage id="employee-list" />} content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <OutlinedInput
              id="input-search-list-style1"
              placeholder="Search"
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
            {/* <Tooltip title="Copy">
              <IconButton size="large">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton size="large">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton size="large">
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}

            {/* product add & dialog */}
            <Tooltip title={<FormattedMessage id="add" />}>
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
                  <FormattedMessage id="profile" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('email')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  <FormattedMessage id="email" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('departmentName')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'departmentName'}
                  direction={orderBy === 'departmentName' ? order : 'asc'}
                  onClick={() => handleRequestSort('departmentName')}
                >
                  <FormattedMessage id="deparment" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('branch_info.branchName')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'branch_info.branchName'}
                  direction={orderBy === 'branch_info.branchName' ? order : 'asc'}
                  onClick={() => handleRequestSort('branch_info.branchName')}
                >
                  <FormattedMessage id="branch" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('username')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleRequestSort('username')}
                >
                  <FormattedMessage id="username" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('salary_no')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'salary_no'}
                  direction={orderBy === 'salary_no' ? order : 'asc'}
                  onClick={() => handleRequestSort('salary_no')}
                >
                  <FormattedMessage id="salary" />
                </TableSortLabel>
              </TableCell>
              {/* <TableCell onClick={() => handleRequestSort('status')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  <FormattedMessage id="status" />
                </TableSortLabel>
              </TableCell> */}
              {/* <TableCell>
                <FormattedMessage id="status" />
              </TableCell> */}
              <TableCell align="center">
                <FormattedMessage id="action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={9} />
            ) : sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={8} align="center">
                  <FormattedMessage id="no-employee-found" />
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar src={`${imgPath}${row?.profile_pic}`} />
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <Typography align="left" variant="subtitle1" component="div">
                          {row?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.departmentName}</TableCell>
                  <TableCell>{row.branch_info?.branchName}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.salary_no}</TableCell>
                  {/* <TableCell>
                    {row.status === 'Active' && (
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    )}
                    {row.status === 'Rejected' && (
                      <Chip
                        label="Rejected"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 80,
                          color: theme.palette.orange.dark
                        }}
                      />
                    )}
                    {row.status === 'Pending' && (
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }}
                      />
                    )}
                  </TableCell> */}
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={<FormattedMessage id="view" />} key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={<FormattedMessage id="edit" />} key="1">
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
                <FormattedMessage id="ten" />
              </MenuItem>
              <MenuItem value={20}>
                <FormattedMessage id="twenty" />
              </MenuItem>
              <MenuItem value={30}>
                <FormattedMessage id="thirty" />
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
      {open && <EmployeeUpdate item={item} open={open} close={(flag) => change(flag)} />}
      {openAdd && <Employee open={openAdd} close={(flag) => changeAdd(flag)} />}
      {openView && <EmployeeView item={item} open={openView} close={() => setOpenView(false)} />}
    </MainCard>
  );
};

export default EmployeeList;
