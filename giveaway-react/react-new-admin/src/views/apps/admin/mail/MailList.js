/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  ButtonBase,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from 'store/slices/users';
import { imgPath } from 'config';
import MainCard from 'components/ui-component/cards/MainCard';
import Skeleten from '../../../../utils/skeleten';
import { gridSpacing } from 'store/constant';
import { IconSearch } from '@tabler/icons-react';

const EnhancedTableToolbar = ({ numSelected }) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main
      })
    }}
  >
    {numSelected > 0 && (
      <Typography color="inherit" variant="h4" component="div">
        {numSelected} Users Selected
      </Typography>
    )}
  </Toolbar>
);

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

function EnhancedTableHead({ selected }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="none" colSpan={5}>
          <EnhancedTableToolbar numSelected={selected.length} />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selected: PropTypes.array.isRequired
};

const MailList = ({ handleSelectedUsers, open }) => {
  const [search, setSearch] = React.useState('');
  const { data, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getAllUser(search));
  }, [dispatch, search, open]);

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [selected, setSelected] = React.useState([]);

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row._id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    handleSelectedUsers(newSelected);
  };

  useEffect(() => {
    if (!open) {
      setSelected([]);
      handleSelectedUsers([]);
    }
  }, [open]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      handleSelectedUsers(newSelecteds);
      return;
    }
    setSelected([]);
    handleSelectedUsers([]);
  };

  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
    }
  };

  const [denseTable, setDenseTable] = React.useState(false);

  return (
    <MainCard
      title={
        <Grid container justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Checkbox
              color="primary"
              indeterminate={selected.length > 0 && selected.length < data.length}
              checked={data.length > 0 && selected.length === data.length}
              onChange={handleSelectAllClick}
              style={{ marginLeft: '-20px' }}
            />
            <span>Select All</span>
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
              onChange={onSearch}
            />
          </Grid>
        </Grid>
      }
      content={false}
    >
      <Grid container spacing={matchDownSM ? 3 : 1}>
        {!loading ? (
          <Grid item xs={12}>
            {data.length ? (
              <MainCard content={false}>
                <TableContainer>
                  <Table
                    size={denseTable ? 'small' : undefined}
                    aria-labelledby="tableTitle"
                    sx={{ minWidth: 320, '& td': { whiteSpace: 'nowrap', px: 0.75, py: denseTable ? 0.5 : 1.25 } }}
                  >
                    {selected.length > 0 && <EnhancedTableHead selected={selected} />}
                    <TableBody>
                      {data.map((row) => (
                        <TableRow
                          hover
                          sx={{
                            bgcolor: '',
                            '& td:last-of-type>div': {
                              position: 'absolute',
                              top: '50%',
                              right: 5,
                              transform: 'translateY(-50%)',
                              display: 'none',
                              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                              borderRadius: '12px',
                              py: 1,
                              px: 1.75,
                              '& button + button': {
                                ml: 0.625
                              }
                            },
                            '&:hover': {
                              '& td:last-of-type>div': {
                                display: 'block'
                              }
                            }
                          }}
                          tabIndex={-1}
                          key={row._id}
                        >
                          <TableCell>
                            <Checkbox
                              color="primary"
                              checked={selected.indexOf(row._id) !== -1}
                              onChange={(event) => handleClick(event, row)}
                            />
                          </TableCell>
                          <TableCell>
                            <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                              <Grid item>
                                <Avatar
                                  sx={{
                                    width: denseTable ? 30 : 40,
                                    height: denseTable ? 30 : 40
                                  }}
                                  alt={row.firstname}
                                  src={`${imgPath}${row.image}`}
                                />
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <ButtonBase disableRipple>
                                  <Typography align="left" variant={row.isRead ? 'body2' : 'subtitle1'} component="div">
                                    {row.firstname}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <ButtonBase disableRipple>
                                  <Typography align="left" variant={row.isRead ? 'body2' : 'subtitle1'} component="div">
                                    {row.email}
                                  </Typography>
                                </ButtonBase>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="center" />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MainCard>
            ) : (
              <MainCard>
                <Typography variant="h4">User Not Found</Typography>
              </MainCard>
            )}
          </Grid>
        ) : (
          <Grid container spacing={matchDownSM ? 3 : 1}>
            <Grid item xs={12}>
              <MainCard>
                <Skeleten count={3} />
              </MainCard>
            </Grid>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

MailList.propTypes = {
  handleSelectedUsers: PropTypes.func.isRequired
};

export default MailList;
