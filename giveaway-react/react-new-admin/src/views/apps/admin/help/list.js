/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client'; // Not sure if 'use client' is valid syntax, maybe it should be 'use strict'?

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Tooltip
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import { getHelps, replyQuery, deleteQuery } from 'store/slices/help';
import Skeleten from 'utils/skeleten';
// import { deleteQuery } from 'store/slices/help';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { openSnackbar } from 'store/slices/snackbar';
import moment from 'moment';
import '../../../../styles/extra.css';
import ReplyTwoToneIcon from '@mui/icons-material/ReplyTwoTone';
import MailView from './MailView';

// ==============================|| USER LIST STYLE 1 ||============================== //

const Users = () => {
  // Redux state management
  const { data, loading, totalPages } = useSelector((state) => state.help);
  const [repliedRows, setRepliedRows] = React.useState(false);
  const dispatch = useDispatch();

  // Local component state
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [opendelete, setOpenDelete] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [openMail, setOpenMail] = React.useState(false);

  // Fetch data on page or limit change, or when a reply is sent
  React.useEffect(() => {
    dispatch(getHelps(page, limit));
  }, [page, limit, opendelete, openMail]);

  // Pagination handler
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Sorting handler
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleReplySent = (replyStatus) => {
    if (replyStatus) {
      console.log('Reply was successfully sent');
      // Additional actions if needed
    }
  };
  // Memoized sorted data
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
  }, [data, orderBy, order, repliedRows, opendelete]);

  const handleDeleteOpen = async (row) => {
    try {
      const alt = window.confirm('Are you sure, you want to delete query?');
      if (alt) {
        const response = await dispatch(deleteQuery(row._id));
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

  // Reply handler
  const handleClickOpenMail = (row) => {
    setItem(row);
    setOpenMail(true);
  };

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">Help Query</Typography>
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Query</TableCell>
              <TableCell sx={{ ml: 4 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={7} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={7} align="center">
                  No Query Found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.createdAt ? moment(row.createdAt).local().format('Do MMM YYYY, HH:mm:ss') : 'N/A'}</TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell>
                    <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                      {row.reply === 'true' ? (
                        <Typography style={{ color: 'green', fontWeight: '600' }}>Replied</Typography>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Reply" key="1">
                            <IconButton color="primary" className="custom-icon-button">
                              <ReplyTwoToneIcon
                                onClick={() => {
                                  handleClickOpenMail(row); // Pass index to handleReply
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete Query" key="1">
                        <IconButton color="secondary" className="custom-icon-button">
                          <DeleteTwoToneIcon
                            onClick={() => {
                              handleDeleteOpen(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
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
      {openMail && <MailView item={item} open={openMail} close={() => setOpenMail(false)} onReplySent={handleReplySent} />}
    </MainCard>
  );
};

export default Users;
