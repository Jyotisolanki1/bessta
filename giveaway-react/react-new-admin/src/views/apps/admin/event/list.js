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
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getEvents } from 'store/slices/events';
import EventAdd from './EventAdd';
import EventUpdate from './EventUpdate';
import WheelSpin from './WheelSpin';
import ViewEvent from './ViewEvent';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/AddTwoTone';
import moment from 'moment';
import { imgPath } from 'config';
// ==============================|| USER LIST STYLE 1 ||============================== //

const EventList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.events);
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

  React.useEffect(() => {
    dispatch(getEvents(search, page, limit));
  }, [status, search, page, limit, openSpin]);

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

  const getPrizeDescription = (prizes, index) => (prizes && prizes[index] ? prizes[index].description : '');

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      let valueA;
      let valueB;

      if (orderBy.includes('prizes')) {
        const prizeIndex = parseInt(orderBy.split('.')[1], 10);
        valueA = getPrizeDescription(a.prizes, prizeIndex) || '';
        valueB = getPrizeDescription(b.prizes, prizeIndex) || '';
      } else {
        valueA = a[orderBy] || '';
        valueB = b[orderBy] || '';
      }

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

  const changeSpin = (flag) => {
    setOpenSpin(false);
    if (flag === true) {
      setStatus(!status);
    }
  };

  const changeView = (flag) => {
    setOpenView(false);
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
    <MainCard title="Draw List" content={false}>
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
            <Tooltip title="Add Draw">
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
              <TableCell>Banner</TableCell>
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('prizes.0')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'prizes.0'}
                  direction={orderBy === 'prizes.0' ? order : 'asc'}
                  onClick={() => handleRequestSort('prizes.0')}
                >
                  Prize 1
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('prizes.1')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'prizes.1'}
                  direction={orderBy === 'prizes.1' ? order : 'asc'}
                  onClick={() => handleRequestSort('prizes.1')}
                >
                  Prize 2
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('prizes.2')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'prizes.2'}
                  direction={orderBy === 'prizes.2' ? order : 'asc'}
                  onClick={() => handleRequestSort('prizes.2')}
                >
                  Prize 3
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('scheduleDate')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'scheduleDate'}
                  direction={orderBy === 'scheduleDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('scheduleDate')}
                >
                  Schedule Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <Skeleten count={9} />
            ) : !sortedData || sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  No draw found
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
                  <TableCell>{row?.name}</TableCell>
                  {/* <TableCell>{row?.discription}</TableCell> */}
                  <TableCell>{row?.prizes[0]?.description}</TableCell>
                  <TableCell>{row?.prizes[1]?.description}</TableCell>
                  <TableCell>{row?.prizes[2]?.description}</TableCell>
                  <TableCell>{row.scheduleDate ? moment(row.scheduleDate).local().format('Do MMM YYYY, HH:mm:ss') : 'N/A'}</TableCell>

                  {row?.randomDrawId === '' ? (
                    <TableCell>Scheduled </TableCell>
                  ) : (
                    <TableCell style={{ color: 'green' }}>Completed</TableCell>
                  )}

                  <TableCell>
                    <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                      {row?.randomDrawId === '' ? (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Update Draw" key="1">
                            <IconButton color="secondary" className="custom-icon-button">
                              <EditTwoToneIcon
                                onClick={() => {
                                  handleClickOpen(row);
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          {row.randomDrawId === '' && (
                            <Tooltip title="Spin the wheel" key="1">
                              <IconButton color="secondary" className="custom-icon-button">
                                <EmojiEventsTwoToneIcon
                                  onClick={() => {
                                    handleSpinWheel(row);
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Draw Winner" key="1">
                            <IconButton color="primary" className="custom-icon-button">
                              <VisibilityTwoToneIcon
                                onClick={() => {
                                  handleClickOpenView(row);
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
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
      {openUpdate && <EventUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <EventAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
      {openSpin && <WheelSpin open={openSpin} close={(flag) => changeSpin(flag)} item={item} />}
      {openView && <ViewEvent item={item} open={openView} close={(flag) => changeView(flag)} />}
    </MainCard>
  );
};

export default EventList;
