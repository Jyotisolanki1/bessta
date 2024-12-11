/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Tooltip,
  CardContent,
  TableSortLabel,
  Fab,
  Pagination,
  Select,
  gridSpacing,
  MenuItem,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';

// assets
// import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
// import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';

import { useDispatch, useSelector } from 'store';
import { getBranch } from 'store/slices/branch';
import Branch from './Branch';
// import BranchDelete from './BranchDelete';
// import { openSnackbar } from 'store/slices/snackbar';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
// ==============================|| USER LIST STYLE 1 ||============================== //

const CompanyList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.branch);
  const dispatch = useDispatch();
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [order, setOrder] = React.useState('asc');
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getBranch(page, limit, search));
  }, [page, limit, status, search]);
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true });
      } else {
        return b[orderBy].localeCompare(a[orderBy], undefined, { numeric: true });
      }
    });
  }, [data, orderBy, order]);

  const handleClickOpen = (row) => {
    setItem(row);
    setOpen(true);
  };

  const change = (flag) => {
    setOpen(false);
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
    <MainCard title={<FormattedMessage id="branch-list" />} content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
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
                    handleClickOpen({});
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
                  <FormattedMessage id="name" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('address')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'address'}
                  direction={orderBy === 'address' ? order : 'asc'}
                  onClick={() => handleRequestSort('address')}
                >
                  <FormattedMessage id="address" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('city')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'city'}
                  direction={orderBy === 'city' ? order : 'asc'}
                  onClick={() => handleRequestSort('city')}
                >
                  <FormattedMessage id="city" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('state')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'state'}
                  direction={orderBy === 'state' ? order : 'asc'}
                  onClick={() => handleRequestSort('state')}
                >
                  <FormattedMessage id="state" />
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={6} />
            ) : sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={6} align="center">
                  <FormattedMessage id="no-branch-found" />
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
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
      {open && <Branch item={item} open={open} close={(flag) => change(flag)} />}
    </MainCard>
  );
};

export default CompanyList;
