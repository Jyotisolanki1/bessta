/* eslint-disable arrow-body-style */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React, { useState } from 'react';

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
  Button
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

// assets
// import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
import { getCms } from 'store/slices/cms';
import Cms from './Cms';
// import DepartmentDelete from './DepartmentDelete';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';

// ==============================|| USER LIST STYLE 1 ||============================== //

const CmsList = () => {
  const { data, loading } = useSelector((state) => state.cms);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

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
  const truncateText = (text, maxLength) => {
    const plainText = text.replace(/<[^>]+>|&[^;]+;/g, '');
    if (plainText.length <= maxLength) return [plainText, false];
    const truncatedText = plainText.slice(0, maxLength);
    return [truncatedText, true];
  };
  const truncateTextFull = (text) => {
    return text.replace(/<[^>]+>|&[^;]+;/g, '');
  };
  return (
    <MainCard title={<FormattedMessage id="cms-list" />} content={false}>
      {/* <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            &nbsp;
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
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
      </CardContent> */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <FormattedMessage id="name" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="cms-details" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="action" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={4} />
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
                  <TableCell dangerouslySetInnerHTML={{ __html: row.content }} />
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" justifyContent="center" alignItems="center">
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
      {open && <Cms item={item} open={open} close={(flag) => change(flag)} />}
    </MainCard>
  );
};

export default CmsList;
