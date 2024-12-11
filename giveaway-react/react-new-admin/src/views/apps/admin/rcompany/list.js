/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
// eslint-disable-next-line lines-around-directive
'use client';
import React from 'react';
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
  Select,
  IconButton,
  Tooltip,
  TableSortLabel
} from '@mui/material';
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { IconSearch } from '@tabler/icons-react';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useDispatch, useSelector } from 'store';
import { getRcompany } from 'store/slices/company';
import RequestCompany from './RequestCompany';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';

const RequestedCompany = () => {
  const { data, loading, totalPages } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getRcompany(page, limit, search));
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
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">
              <FormattedMessage id="requested-company-list" />
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
              <TableCell onClick={() => handleRequestSort('company_name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'company_name'}
                  direction={orderBy === 'company_name' ? order : 'asc'}
                  onClick={() => handleRequestSort('company_name')}
                >
                  <FormattedMessage id="name" />
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('company_owner')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'company_owner'}
                  direction={orderBy === 'company_owner' ? order : 'asc'}
                  onClick={() => handleRequestSort('company_owner')}
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
                  <TableCell>{row.company_name}</TableCell>
                  <TableCell>{row.company_owner}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{`${row.country_code}-${row.phone_number}`}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell align="center" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={<FormattedMessage id="approve-company" />} key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VerifiedOutlinedIcon
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
      {open && <RequestCompany item={item} open={open} close={(flag) => change(flag)} />}
    </MainCard>
  );
};

export default RequestedCompany;
