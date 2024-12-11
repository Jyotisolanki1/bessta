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
  Fab,
  TableSortLabel,
  Pagination,
  Select,
  gridSpacing,
  MenuItem,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

// assets
// import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getDepartment } from 'store/slices/department';
import Department from './Department';
// import DepartmentDelete from './DepartmentDelete';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
// ==============================|| USER LIST STYLE 1 ||============================== //

const BranchList = () => {
  const { data, loading, totalPages } = useSelector((state) => state.department);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  // const [openView, setOpenView] = React.useState(false);
  // const [openDelete, setOpenDelete] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getDepartment(page, limit, search));
  }, [page, limit, status, search]);
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  // const handleChangeRowsPerPage = (event) => {
  //   setLimit(parseInt(event.target.value, 10));
  //   setPage(1);
  // };
  const handleClickOpen = (row) => {
    setItem(row);
    setOpen(true);
  };
  // const handleClickOpenView = (row) => {
  //   setItem(row);
  //   setOpenView(true);
  // };
  const change = (flag) => {
    setOpen(false);
    if (flag === true) {
      setStatus(!status);
    }
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
        // eslint-disable-next-line no-else-return
      } else {
        return b[orderBy].localeCompare(a[orderBy], undefined, { numeric: true });
      }
    });
  }, [data, orderBy, order]);
  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };
  return (
    <MainCard title={<FormattedMessage id="department-list" />} content={false}>
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
              <TableCell onClick={() => handleRequestSort('departmentName')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'departmentName'}
                  direction={order === 'asc' ? 'asc' : 'desc'}
                  onClick={() => handleRequestSort('departmentName')}
                >
                  <FormattedMessage id="department-name" />
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={3} />
            ) : data.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={3} align="center">
                  <FormattedMessage id="no-depa-found" />
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row.departmentName}</TableCell>
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
      {open && <Department item={item} open={open} close={(flag) => change(flag)} />}
    </MainCard>
  );
};

export default BranchList;
