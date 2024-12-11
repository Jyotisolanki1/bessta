/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';
import PropTypes from 'prop-types';
import React,{ useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { CardContent, Drawer, Grid, useMediaQuery } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import ComposeDialog from './ComposeDialog';
import MainCard from 'components/ui-component/cards/MainCard';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'store/constant';

// ==============================|| MAIL DRAWER ||============================== //

const MailDrawer = ({ handleDrawerOpen, openMailSidebar, selectedUsers,NotiActive }) => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const [openParent, setOpenParent] = useState(false);

  React.useEffect(() => {
    NotiActive(openParent);
  }, [openParent]);

  const handleOpenChange = (open) => {
    setOpenParent(open);
  };

  const matchDownSM = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: { xs: 1200, xl: 0 },
        '& .MuiDrawer-paper': {
          height: 'auto',
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          borderRadius: matchDownSM ? 0 : `${borderRadius}px`
        }
      }}
      variant={matchDownSM ? 'temporary' : 'persistent'}
      anchor="left"
      open={openMailSidebar}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {console.log('openMailSidebar', openMailSidebar)}
      {openMailSidebar && (
        <MainCard sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50' }} border={!matchDownSM} content={false}>
          <CardContent sx={{ height: matchDownSM ? '100vh' : 'auto' }}>
            <Grid container spacing={gridSpacing}>
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

MailDrawer.propTypes = {
  handleDrawerOpen: PropTypes.func,
  openMailSidebar: PropTypes.bool
};

export default MailDrawer;
