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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardContent,
  Fab,
  Chip,
  Tooltip,
  TableSortLabel
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Link from 'next/link';

import { useDispatch, useSelector } from 'store';
import { getCategories } from 'store/slices/plans';
import CategoryAdd from './CategoryAdd';
import CourseUpdate from './CategoryUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import moment from 'moment';
import AddIcon from '@mui/icons-material/AddTwoTone';
// ==============================|| USER LIST STYLE 1 ||============================== //

const CategoryList = () => {
  const { categoryData, catloading } = useSelector((state) => state.plans);
  const theme = useTheme();
  const dispatch = useDispatch();
  // const [page, setPage] = React.useState(1);
  // const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    dispatch(getCategories(search));
  }, [status, search]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedcategoryData = React.useMemo(() => {
    if (!orderBy) return categoryData;

    return [...categoryData].sort((a, b) => {
      const valueA = a[orderBy] || ''; // handle undefined or blank values
      const valueB = b[orderBy] || ''; // handle undefined or blank values

      if (order === 'asc') {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
      } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    });
  }, [categoryData, orderBy, order]);

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
  const handleClickOpen = (row) => {
    setItem(row);
    setOpenUpdate(true);
  };
  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
    }
  };
  return (
    <MainCard title="Category List" content={false}>
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
            <Tooltip title="Add Category">
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
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('status')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('createdAt')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Create Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {catloading ? (
              <Skeleten count={5} />
            ) : !sortedcategoryData || sortedcategoryData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={5} align="center">
                  No category found
                </TableCell>
              </TableRow>
            ) : (
              sortedcategoryData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.status === 'enabled' || row.status === 'active' ? (
                      <Chip
                        label="Enable"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : row.status === 'disabled' || row.status === 'inacvite' ? (
                      <Chip
                        label="Disable"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }}
                      />
                    ) : (
                      <Chip
                        label="N/A"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{moment(row?.createdAt).format('Do MMM YYYY')}</TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Category Details" key="1">
                        <Link href={`/admin/plans?id= ${row._id}`}>
                          {' '}
                          <IconButton color="primary" className="custom-icon-button">
                            <VisibilityTwoToneIcon />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Update Category" key="2">
                          <IconButton color="secondary" className="custom-icon-button">
                            <EditTwoToneIcon
                              onClick={() => {
                                handleClickOpen(row);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Grid item xs={12} sx={{ p: 3 }}>
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
              <MenuItem value={20}>
                Twenty
              </MenuItem>
              <MenuItem value={30}>
                Thirty
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid> */}
      {openUpdate && <CourseUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <CategoryAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default CategoryList;
