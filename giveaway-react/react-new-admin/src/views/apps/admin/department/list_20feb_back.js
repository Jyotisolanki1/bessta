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
  Fab
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

// ==============================|| USER LIST STYLE 1 ||============================== //

const CompanyList = () => {
  const { data, loading } = useSelector((state) => state.department);
  const dispatch = useDispatch();
  // const [page, setPage] = React.useState(1);
  // const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  // const [openView, setOpenView] = React.useState(false);
  // const [openDelete, setOpenDelete] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);

  React.useEffect(() => {
    dispatch(getDepartment());
  }, [status]);
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
  // const handleDelete = (id) => {
  //   setId(id);
  //   setOpenDelete(true);
  // };
  return (
    <MainCard title={<FormattedMessage id="department-list" />} content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
              placeholder="Search Product"
              value={search}
              size="small"
            /> */}
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
              <TableCell>
                <FormattedMessage id="department-name" />
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
              data.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.departmentName}</TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      {/* <IconButton color="primary" size="large" aria-label="edit">
                        <Tooltip title="View Company" key="1">
                          <IconButton color="primary" size="large">
                            <VisibilityTwoToneIcon
                              onClick={() => {
                                handleClickOpenView(row);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </IconButton> */}
                      <IconButton color="primary" size="large" aria-label="edit">
                        <Tooltip title={<FormattedMessage id="edit" />} key="1">
                          <IconButton color="secondary" size="large">
                            <EditTwoToneIcon
                              onClick={() => {
                                handleClickOpen(row);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </IconButton>
                      {/* <IconButton color="primary" size="large" aria-label="edit">
                        <Tooltip title="Delete Department" key="1">
                          <IconButton color="error" size="large">
                            <ClearTwoToneIcon
                              onClick={() => {
                                handleDelete(row?.id);
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </IconButton> */}
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
            <Pagination count={totalPages} page={page} color="primary" onChange={handleChangeRowsPerPage} />
          </Grid>
          <Grid item>
            <Select
              labelId="demo-simple-select-label"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
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
      </Grid> */}
      {open && <Department item={item} open={open} close={(flag) => change(flag)} />}
      {/* {openView && <CompanyView item={item} open={openView} close={() => setOpenView(false)} />} */}
      {/* {openDelete && <DepartmentDelete id={id} open={openDelete} close={() => setOpenDelete(false)} />} */}
    </MainCard>
  );
};

export default CompanyList;
