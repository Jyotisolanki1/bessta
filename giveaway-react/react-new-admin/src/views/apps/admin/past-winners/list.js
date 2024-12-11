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
import { gridSpacing } from 'store/constant';
// import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getEvents } from 'store/slices/events';
import WinnerAdd from './winnerAdd';
import WinnerUpdate from './winnerUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { getPasWinners } from 'store/slices/pastWinner';
import moment from 'moment';
import { imgPath } from 'config';
// ==============================|| USER LIST STYLE 1 ||============================== //

const List = () => {
  const { winnerData, loading } = useSelector((state) => state.pastWinner);
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

  // React.useEffect(() => {
  //   dispatch(getEvents(search, page, limit));
  // }, [status, search, page, limit]);

  React.useEffect(() => {
    dispatch(getPasWinners());
  }, [status]);

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
    if (!orderBy) return winnerData;

    return [...winnerData].sort((a, b) => {
      const valueA = a[orderBy] || '';
      const valueB = b[orderBy] || '';

      if (['value'].includes(orderBy)) {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  }, [winnerData, order, orderBy]);

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

  return (
    <MainCard title="Past winners list" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>
            <Tooltip title="Add Past Winners">
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
              <TableCell>Image</TableCell>
              <TableCell>Winners</TableCell>
              <TableCell onClick={() => handleRequestSort('year')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'year'}
                  direction={orderBy === 'year' ? order : 'asc'}
                  onClick={() => handleRequestSort('year')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              {/* <TableCell onClick={() => handleRequestSort('discription')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'discription'}
                  direction={orderBy === 'discription' ? order : 'asc'}
                  onClick={() => handleRequestSort('discription')}
                >
                  Description
                </TableSortLabel>
              </TableCell> */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={5} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={5} align="center">
                  No winners found
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
                    </Grid>
                  </TableCell>
                  <TableCell>
                    {row?.winners?.map((winner, index) => (
                      <React.Fragment key={index}>
                        <div>
                          {winner?.name} - {winner?.prize}
                        </div>
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell>{row.year ? moment(row.year).local().format('Do MMM YYYY') : 'N/A'}</TableCell>
                  <TableCell>
                    <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Update Past Winners" key="1">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openUpdate && <WinnerUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <WinnerAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default List;
