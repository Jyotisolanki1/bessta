/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable lines-around-directive */
/* eslint-disable no-nested-ternary */
'use client';

import React from 'react';
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
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useDispatch, useSelector } from 'store';
import { getJob } from 'store/slices/job';
import Job from './Job';
import JobUpdate from './JobUpdate';
import JobView from './JobView';
import JobStatus from './JobStatus';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';

const JobList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.job);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getJob(page, limit, search));
  }, [page, limit, status, search]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

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
      if (orderBy === 'status') {
        return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      } else {
        return order === 'asc'
          ? a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true })
          : b[orderBy].localeCompare(a[orderBy], undefined, { numeric: true });
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

  const handleClickStatus = (row) => {
    setItem(row);
    setOpenStatus(true);
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

  const changeStatus = (flag) => {
    setOpenStatus(false);
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
    <MainCard title={<FormattedMessage id="job-list" />} content={false}>
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
              <TableCell onClick={() => handleRequestSort('task')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'task'}
                  direction={orderBy === 'task' ? order : 'asc'}
                  onClick={() => handleRequestSort('task')}
                >
                  <FormattedMessage id="task" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('contact_details')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'contact_details'}
                  direction={orderBy === 'contact_details' ? order : 'asc'}
                  onClick={() => handleRequestSort('contact_details')}
                >
                  <FormattedMessage id="phone" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  <FormattedMessage id="employee" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('work_type')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'work_type'}
                  direction={orderBy === 'work_type' ? order : 'asc'}
                  onClick={() => handleRequestSort('work_type')}
                >
                  <FormattedMessage id="job-type" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('start')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'start'}
                  direction={orderBy === 'start' ? order : 'asc'}
                  onClick={() => handleRequestSort('start')}
                >
                  <FormattedMessage id="start-date" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('end')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'end'}
                  direction={orderBy === 'end' ? order : 'asc'}
                  onClick={() => handleRequestSort('end')}
                >
                  <FormattedMessage id="end-date" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('priority')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                >
                  <FormattedMessage id="priority" />
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
              <TableCell onClick={() => handleRequestSort('branch_name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'branch_name'}
                  direction={orderBy === 'branch_name' ? order : 'asc'}
                  onClick={() => handleRequestSort('branch_name')}
                >
                  <FormattedMessage id="branch" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('status')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  <FormattedMessage id="status" />
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={12} />
            ) : sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={12} align="center">
                  <FormattedMessage id="no-job-found" />
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.task}</TableCell>
                  <TableCell>{row?.contact_details}</TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>{row?.work_type}</TableCell>
                  <TableCell>{moment(row?.start).format('Do MMM YYYY')}</TableCell>
                  <TableCell>{moment(row?.end).format('Do MMM YYYY')}</TableCell>
                  <TableCell>{row?.priority}</TableCell>
                  <TableCell>{row?.departmentName}</TableCell>
                  <TableCell>{row?.branch_name}</TableCell>
                  <TableCell>
                    {row?.status === 1 && (
                      <Tooltip
                        title={<FormattedMessage id="Change-status" />}
                        key="1"
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{
                          cursor: 'pointer'
                        }}
                      >
                        <Chip
                          label="Not Started"
                          size="small"
                          sx={{
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                            color: theme.palette.orange.dark
                          }}
                        />
                      </Tooltip>
                    )}
                    {row?.status === 2 && (
                      <Tooltip
                        title={<FormattedMessage id="Change-status" />}
                        key="1"
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{
                          cursor: 'pointer'
                        }}
                      >
                        <Chip
                          label="Started"
                          size="small"
                          sx={{
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.info.light + 60,
                            color: theme.palette.info.dark
                          }}
                        />
                      </Tooltip>
                    )}
                    {row?.status === 3 && (
                      <Chip
                        label="Completed"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 80,
                          color: theme.palette.orange.dark
                        }}
                      />
                    )}
                    {row?.status === 4 && (
                      <Tooltip
                        title={<FormattedMessage id="Change-status" />}
                        key="1"
                        onClick={() => {
                          handleClickStatus(row);
                        }}
                        style={{
                          cursor: 'pointer'
                        }}
                      >
                        <Chip
                          label="Pending"
                          size="small"
                          sx={{
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                            color: theme.palette.warning.dark
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
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
                      {row?.status !== 3 ? (
                        <Tooltip title={<FormattedMessage id="edit" />} key="1">
                          <IconButton color="secondary" className="custom-icon-button">
                            <EditTwoToneIcon
                              onClick={() => {
                                handleClickOpen(row);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <IconButton color="secondary" disabled className="custom-icon-button">
                          <EditTwoToneIcon />
                        </IconButton>
                      )}
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
      {open && <JobUpdate item={item} open={open} close={(flag) => change(flag)} />}
      {openAdd && <Job open={openAdd} close={(flag) => changeAdd(flag)} />}
      {openView && <JobView item={item} open={openView} close={() => setOpenView(false)} />}
      {openStatus && <JobStatus item={item} open={openStatus} close={(flag) => changeStatus(flag)} />}
      {/* {openDelete && <EmployeeDelete id={id} open={openDelete} close={() => setOpenDelete(false)} />} */}
    </MainCard>
  );
};

export default JobList;
