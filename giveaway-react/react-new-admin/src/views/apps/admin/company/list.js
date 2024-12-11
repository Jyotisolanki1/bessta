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
  Button,
  Grid,
  InputAdornment,
  Stack,
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
  CircularProgress,
  Select,
  IconButton,
  Tooltip,
  TableSortLabel
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';

import { useDispatch, useSelector } from 'store';
import { getCompany } from 'store/slices/company';
import Company from './Company';
import CompanyView from './CompanyView';
import CompanyDelete from './CompanyDelete';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
// ==============================|| USER LIST STYLE 1 ||============================== //

const CompanyList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getCompany(page, limit, search));
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

  const changeDelete = (flag) => {
    setOpenDelete(false);
    if (flag === true) {
      setStatus(!status);
    }
  };

  const handleDelete = (id) => {
    setId(id);
    setOpenDelete(true);
  };
  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };
  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">
              <FormattedMessage id="company-list" />
            </Typography>
          </Grid>
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
        </Grid>
      }
      content={false}
    >
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
              <TableCell onClick={() => handleRequestSort('owner')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'owner'}
                  direction={orderBy === 'owner' ? order : 'asc'}
                  onClick={() => handleRequestSort('owner')}
                >
                  <FormattedMessage id="owner-name" />
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
              <TableCell onClick={() => handleRequestSort('country_code')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'country_code'}
                  direction={orderBy === 'country_code' ? order : 'asc'}
                  onClick={() => handleRequestSort('country_code')}
                >
                  <FormattedMessage id="phone" />
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
              <Skeleten count={9} />
            ) : sortedData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  <FormattedMessage id="no-company-found" />
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{`${row.country_code}-${row.phone_number}`}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
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
                      {/* <Tooltip title={<FormattedMessage id="delete" />} key="1">
                        <IconButton color="error" className="custom-icon-button">
                          <ClearTwoToneIcon
                            onClick={() => {
                              handleDelete(row?.id);
                            }}
                          />
                        </IconButton>
                      </Tooltip> */}
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
      {open && <Company item={item} open={open} close={(flag) => change(flag)} />}
      {openView && <CompanyView item={item} open={openView} close={() => setOpenView(false)} />}
      {openDelete && <CompanyDelete id={id} open={openDelete} close={(flag) => changeDelete(flag)} />}
    </MainCard>
  );
};

export default CompanyList;
