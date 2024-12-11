/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React ,{useState}from 'react';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, Drawer, Grid, useMediaQuery } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import ComposeDialog from './ComposeDialog';
import MainCard from 'components/ui-component/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';



const MailDrawer = ({ filter, handleDrawerOpen, handleFilter, openMailSidebar, selectedUsers, NotiActive }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('xl'));

  const [openParent, setOpenParent] = useState(false);


  React.useEffect(()=>{
    NotiActive(openParent)
  },[openParent])

  const handleOpenChange = (open) => {
    setOpenParent(open);
  };

  return (
    <Drawer
      sx={{
        width: 320,
        flexShrink: 0,
        zIndex: { xs: 1200, xl: 0 },
        '& .MuiDrawer-paper': {
          height: 'auto',
          width: 320,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          borderRadius: matchDownSM ? 0 : 12
        }
      }}
      variant={matchDownSM ? 'temporary' : 'persistent'}
      anchor="left"
      open={openMailSidebar}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {openMailSidebar && (
        <MainCard sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50' }} border={!matchDownSM} content={false}>
          <CardContent sx={{ height: matchDownSM ? '100vh' : 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ComposeDialog selectedUsers={selectedUsers} onOpenChange={handleOpenChange}/>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </Drawer>
  );
};

export default MailDrawer;