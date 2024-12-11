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
  Switch,
  Select,
  Chip,
  IconButton,
  Tooltip,
  TableSortLabel,
  TextField,
  Fab
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import ProductView from './Userview';
import MailView from './SendMail';
import NotificationView from './Notification';
import ResetPassword from './resetPassword';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { startOfDay, parseISO } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/AddTwoTone';
import AddUser from './addUser';

// assets
import Avatar from 'components/ui-component/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getUser, statusChangeRequest } from 'store/slices/users';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import { imgPath } from 'config';
import { openSnackbar } from 'store/slices/snackbar';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone';
import UpdateUser from './UpdateUser';
// ==============================|| USER LIST STYLE 1 ||============================== //

const Users = () => {
  const { data, loading, totalPages } = useSelector((state) => state.users);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openView, setOpenView] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const [openResetPassword, setOpenResetPassword] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [openUser, setOpenUser] = React.useState();
  const [addUser, setAddUser] = React.useState();
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [startError, setStartError] = React.useState('');
  const [endError, setEndError] = React.useState('');

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const router = useRouter();
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickOpenView = (row) => {
    localStorage.setItem('userdetails', JSON.stringify(row));
    router.push('users/accounts');
  };
  const handleClickOpenNotification = (row) => {
    setItem(row);
    setOpenNotification(true);
  };

  const handleClickOpenResetPassword = (row) => {
    setItem(row);
    setOpenResetPassword(true);
  };
  const handleClickOpenMail = (row) => {
    setItem(row);
    setOpenMail(true);
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
  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const valueA = a[orderBy] || ''; // handle undefined or blank values
      const valueB = b[orderBy] || ''; // handle undefined or blank values

      if (order === 'asc') {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
      } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    });
  }, [data, orderBy, order]);

  const handleClickOpenUpdate = async (row) => {
    setItem(row);
    setOpenUser(true);
  };

  React.useEffect(() => {
    const endDateFilter = endDate || startDate;
    dispatch(getUser(search, page, limit, startDate, endDateFilter));
  }, [status, search, page, limit, openView, addUser, openNotification, openMail, openUser, startDate, endDate, openResetPassword]);

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
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item sx={6}>
            <Typography variant="h3">User</Typography>
          </Grid>
          <Grid item sx={6}>
            <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
              <Grid item style={{ marginBottom: '20px' }}>
                <OutlinedInput
                  id="input-search-list-style1"
                  placeholder="Search"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconSearch stroke={1.5} size="16px" />
                    </InputAdornment>
                  }
                  size="large"
                  defaultValue={search}
                  onChange={onSearch}
                />
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
                  <Typography style={{ color: 'red', minHeight: '20px', marginTop: '4px' }}>{startError || ''}</Typography>
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
                  <Typography style={{ color: 'red', minHeight: '20px', marginTop: '4px' }}>{endError || ''}</Typography>
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
              <TableCell onClick={() => handleRequestSort('firstname')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'firstname'}
                  direction={orderBy === 'firstname' ? order : 'asc'}
                  onClick={() => handleRequestSort('firstname')}
                >
                  Profile
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
              <TableCell onClick={() => handleRequestSort('dob')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'dob'}
                  direction={orderBy === 'dob' ? order : 'asc'}
                  onClick={() => handleRequestSort('dob')}
                >
                  DOB
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('createdAt')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Registration date and time
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('isStatus')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'isStatus'}
                  direction={orderBy === 'isStatus' ? order : 'asc'}
                  onClick={() => handleRequestSort('isStatus')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={8} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={8} align="center">
                  No user found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar src={`${imgPath}${row?.image}`} />
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <Typography align="left" variant="subtitle1" component="div">
                          {row?.firstname} {row?.lastname}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone || 'N/A'}</TableCell>
                  <TableCell>{row.dob ? row.dob : 'N/A'}</TableCell>

                  <TableCell>
                    <TableCell>{row.createdAt ? moment(row.createdAt).local().format('Do MMM YYYY, HH:mm:ss') : 'N/A'}</TableCell>
                  </TableCell>

                  <TableCell>
                    {row.isStatus === 'pending' ? (
                      <Chip
                        label="Not Verified"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                      />
                    ) : (
                      <>
                        <Switch
                          checked={row.isStatus === 'active'}
                          onChange={() => handleClickStatus(row)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <br />
                        {row.isStatus === 'active' ? (
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
                      </>
                    )}
                    {/* {row.isStatus === 'active'?
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                      :row.isStatus === 'blocked'?
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }}
                      />
                      :row.isStatus === 'pending'?
                      <Chip
                        label={row.isStatus}
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                      />
                      :
                      <Chip
                        label='N/A'
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                      />
                    } */}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View User" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update User" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <EditTwoToneIcon
                            onClick={() => {
                              handleClickOpenUpdate(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mail" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <EmailTwoToneIcon
                            onClick={() => {
                              handleClickOpenMail(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Notification" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <NotificationsActiveTwoToneIcon
                            onClick={() => {
                              handleClickOpenNotification(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset Password" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <LockResetTwoToneIcon
                            onClick={() => {
                              handleClickOpenResetPassword(row);
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
      {openView && <ProductView item={item} open={openView} close={() => setOpenView(false)} />}
      {openMail && <MailView item={item} open={openMail} close={() => setOpenMail(false)} />}
      {openNotification && <NotificationView item={item} open={openNotification} close={() => setOpenNotification(false)} />}
      {openResetPassword && <ResetPassword item={item} open={openResetPassword} close={() => setOpenResetPassword(false)} />}
      {openUser && <UpdateUser item={item} open={openUser} close={() => setOpenUser(false)} />}
      {addUser && <AddUser item={item} open={addUser} close={() => setAddUser(false)} />}
    </MainCard>
  );
};

export default Users;
