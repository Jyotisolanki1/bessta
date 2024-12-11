'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project imports
import ChangePassword from './ChangePassword';
// import Profile from './Profile';

// assets
// import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// import { FormattedMessage } from 'react-intl';

// tabs panel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// tabs option
const tabsOption = [
  // {
  //   label: <FormattedMessage id="profile" />,
  //   icon: <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  // },
  {
    label: 'Change Password',
    icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  }
];

// ==============================|| PROFILE 1 ||============================== //

const Profile1 = () => {
  const theme = useTheme();

  const [value, setValue] = useState(1);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            // onChange={handleChange}
            aria-label="simple tabs example"
            variant="scrollable"
            sx={{
              mb: 3,
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              },
              '& a.Mui-selected': {
                color: theme.palette.primary.main
              },
              '& .MuiTabs-indicator': {
                bottom: 2
              },
              '& a > svg': {
                marginBottom: '0px !important',
                mr: 1.25
              }
            }}
          >
            {tabsOption.map((tab, index) => (
              <Tab key={index} component={Link} href="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
            ))}
          </Tabs>
          {/* <TabPanel value={value} index={0}>
            <Profile />
          </TabPanel> */}
          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Profile1;
