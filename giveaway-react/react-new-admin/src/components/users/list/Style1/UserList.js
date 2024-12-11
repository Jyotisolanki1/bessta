'use client';

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  CircularProgress
} from '@mui/material';

// project imports
import Avatar from 'components/ui-component/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getUser } from 'store/slices/users';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';

const avatarImage = '/assets/images/users';

// ==============================|| USER LIST 1 ||============================== //

const UserList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [data, setData] = React.useState([]);
  const { users, loading } = useSelector((state) => state.users);

  React.useEffect(() => {
    setData(users);
  }, [users]);

  React.useEffect(() => {
    dispatch(getUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TableContainer>
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 3 }}>#</TableCell>
            <TableCell>User Profile</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Friends</TableCell>
            <TableCell>Followers</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center" sx={{ pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell sx={{ pl: 3 }}>{row.id}</TableCell>
                <TableCell>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar alt="User 1" src={`${avatarImage}/${row.avatar}`} />
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography align="left" variant="subtitle1" component="div">
                        {row.name} {row.status === 'Active' && <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />}
                      </Typography>
                      <Typography align="left" variant="subtitle2" noWrap>
                        {row.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.friends}</TableCell>
                <TableCell>{row.followers}</TableCell>
                <TableCell>
                  {row.status === 'Active' && (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                        color: theme.palette.success.dark
                      }}
                    />
                  )}
                  {row.status === 'Rejected' && (
                    <Chip
                      label="Rejected"
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 80,
                        color: theme.palette.orange.dark
                      }}
                    />
                  )}
                  {row.status === 'Pending' && (
                    <Chip
                      label="Pending"
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                        color: theme.palette.warning.dark
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip placement="top" title="Message">
                      <IconButton color="primary" aria-label="delete" size="large">
                        <ChatBubbleTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title="Block">
                      <IconButton
                        color="primary"
                        sx={{
                          color: theme.palette.orange.dark,
                          borderColor: theme.palette.orange.main,
                          '&:hover ': { background: theme.palette.orange.light }
                        }}
                        size="large"
                      >
                        <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table> */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Profile</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Friends</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow hover>
              <TableCell colSpan={3} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            data &&
            data.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
