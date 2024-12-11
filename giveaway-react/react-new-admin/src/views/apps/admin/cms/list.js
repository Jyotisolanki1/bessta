/* eslint-disable arrow-body-style */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React, { useState } from 'react';

import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

// assets
// import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getCms } from 'store/slices/cms';
import Cms from './Cms';
import ViewCms from './viewCms';
// import DepartmentDelete from './DepartmentDelete';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

// ==============================|| USER LIST STYLE 1 ||============================== //

const ProductList = () => {
  const { data, loading } = useSelector((state) => state.cms);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openView, setOpenView] = React.useState(false);

  const handleReadMore = (index) => {
    setExpandedRow(index === expandedRow ? null : index);
  };

  React.useEffect(() => {
    dispatch(getCms());
  }, [status]);
  // const handleChangeRowsPerPage = (event) => {
  //   setLimit(parseInt(event.target.value, 10));
  //   setPage(1);
  // };
  const handleClickOpen = (row) => {
    setItem(row);
    setOpen(true);
  };
  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };
  // const handleClickOpenView = (flag) => {
  //   setOpenView(false);F
  //   if (flag === true) {
  //     setStatus(!status);
  //   }
  // };
  const change = (flag) => {
    setOpen(false);
    setOpenView(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  // const handleDelete = (id) => {
  //   setId(id);
  //   setOpenDelete(true);
  // };

  return (
    <MainCard title="CMS" content={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={3} />
            ) : !data || data.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={4} align="center">
                  <FormattedMessage id="no-cms-found" />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={`View ${row.type}`} key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Update ${row.type}`} key="1" style={{ marginRight: '5px' }}>
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

      {open && <Cms item={item} open={open} close={(flag) => change(flag)} />}
      {openView && <ViewCms item={item} open={openView} close={(flag) => change(flag)} />}
    </MainCard>
  );
};

export default ProductList;
