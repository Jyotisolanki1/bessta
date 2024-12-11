/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable lines-around-directive */
/* eslint-disable import/no-unresolved */
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  Box
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { viewUserRequest } from 'store/slices/users';
import { useDispatch, useSelector } from 'store';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import Skeleten from '../../../../utils/skeleten';
import Link from 'next/link';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Company = ({ open, close, item }) => {
  const theme = useTheme();
  const { viewuser, viewLoading } = useSelector((state) => state.users);

  // const Avatar1 = `${imgPath}${item?.profile_pic}`;
  const dispatch = useDispatch();
  React.useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    dispatch(viewUserRequest(item?._id));
  }, [item]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="md"
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            User Details
          </Grid>
          <Grid item xs={6}>
            <IconButton color="inherit" onClick={close} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Field
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Value
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {viewLoading ? (
                        <Skeleten count={2} />
                      ) : !viewuser || viewuser.length === 0 ? (
                        <TableRow hover>
                          <TableCell colSpan={6} align="center">
                            No User found
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                First Name
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.firstname}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Last Name
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.lastname}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Email
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Phone
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.phone}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                DOB
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.dob || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Age
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {viewuser?.data?.user?.dob ? `${moment().diff(moment(viewuser.data.user.dob), 'years')} Years` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Bill Address
                              </Typography>
                            </TableCell>
                            <TableCell>{viewuser?.data?.user?.billing_address || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Joining date
                              </Typography>
                            </TableCell>
                            <TableCell>{moment(viewuser?.data?.user?.createdAt).format('DD/MM/YYYY')}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Current Subscription
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {viewuser?.data?.subcription ? (
                                <Box>
                                  <Typography variant="body1" fontWeight="bold">
                                    {viewuser?.data?.subcription?.plan_id?.name}
                                  </Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {viewuser?.data?.subcription?.plan_id?.entries ? (
                                      <>Entries:- {viewuser?.data?.subcription?.plan_id?.entries}</>
                                    ) : (
                                      'Entires :- N/A'
                                    )}
                                  </Typography>

                                  {viewuser?.data?.subcription?.plan_id?.status === 'active' ? (
                                    <>
                                      <Typography variant="body1">Status :- Active</Typography>
                                    </>
                                  ) : (
                                    <Typography variant="body1">Status :- Inctive</Typography>
                                  )}
                                  <Typography variant="body1" fontWeight="bold">
                                    <Link
                                      href={`/admin/users/subscription?uid=${viewuser?.data?.user?._id}&type=recurring`}
                                      target="_blank"
                                    >
                                      Membership History
                                    </Link>
                                  </Typography>
                                </Box>
                              ) : (
                                <>
                                  <Typography>N/A</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    <Link
                                      href={`/admin/users/subscription?uid=${viewuser?.data?.user?._id}&type=recurring`}
                                      target="_blank"
                                    >
                                      Membership History
                                    </Link>
                                  </Typography>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Package Member
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {viewuser?.data?.fixedData ? (
                                <Box>
                                  <Typography variant="body1" fontWeight="bold">
                                    {viewuser?.data?.fixedData?.plan_id?.name}
                                  </Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {viewuser?.data?.fixedData?.entries ? (
                                      <>Entries:- {viewuser?.data?.fixedData?.entries}</>
                                    ) : (
                                      'Entires :- N/A'
                                    )}
                                  </Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    <Link href={`/admin/users/package?uid=${viewuser?.data?.user?._id}&type=fixed`} target="_blank">
                                      Membership History
                                    </Link>
                                  </Typography>
                                </Box>
                              ) : (
                                <>
                                  <Typography>N/A</Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    <Link href={`/admin/users/package?uid=${viewuser?.data?.user?._id}&type=fixed`} target="_blank">
                                      Membership History
                                    </Link>
                                  </Typography>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Member Days
                              </Typography>
                            </TableCell>
                            <TableCell>{moment(viewuser?.data?.subcription?.endDate).diff(moment(), 'days')} Days</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Member Status
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {console.log('viewuser?.data')}
                              {viewuser?.data?.user?.isStatus === 'active' ? (
                                <Typography variant="body1">Active</Typography>
                              ) : viewuser?.data?.user?.isStatus === 'pending' ? (
                                <Typography variant="body1">Not Verified</Typography>
                              ) : (
                                <Typography variant="body1">Inactive</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                          {/* <TableRow>
                            <TableCell>
                              <Typography variant="body1" fontWeight="bold">
                                Draw History
                              </Typography>
                            </TableCell>
                            <TableCell>remaining</TableCell>
                          </TableRow> */}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Grid>
                {/* <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                  <Divider sx={sxDivider} />
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Company;
