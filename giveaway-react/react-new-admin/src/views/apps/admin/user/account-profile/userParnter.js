/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-unresolved */
'use client';

import React, { useState } from 'react';
import {
  Slide,
  Grid,
  Typography,
  IconButton,
  Divider,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  Switch,
  Chip
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { viewUserRequest } from 'store/slices/users';
import { useDispatch, useSelector } from 'store';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import Skeleten from '../../../../../utils/skeleten';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Company = () => {
  const theme = useTheme();
  const [item, setItem] = useState({});
  const loading = false;
  // const Avatar1 = `${imgPath}${item?.profile_pic}`;
  const dispatch = useDispatch();
  React.useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const res = localStorage.getItem('userdetails');
    setItem(JSON.parse(res));
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Member Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={8} />
            ) : !item ? (
              <TableRow hover>
                <TableCell colSpan={7} align="center">
                  No user found
                </TableCell>
              </TableRow>
            ) : (
              <TableRow hover>
                <TableCell>{`${item.firstname} ${item.lastname}`} </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone ? item.phone : 'N/A'}</TableCell>
                <TableCell>{item.dob ? item.dob : 'N/A'}</TableCell>
                <TableCell> {item?.dob ? `${moment().diff(moment(item?.dob), 'years')} Years` : 'N/A'}</TableCell>
                <TableCell>{moment(item?.createdAt).format('DD/MM/YYYY')}</TableCell>
                <TableCell>
                  {item?.isStatus === 'active' ? (
                    <Typography variant="body1">Active</Typography>
                  ) : item?.isStatus === 'pending' ? (
                    <Typography variant="body1">Not Verified</Typography>
                  ) : (
                    <Typography variant="body1">Inactive</Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Company;
