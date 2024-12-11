/* eslint-disable no-underscore-dangle */

'use client';

import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import Membership from '../subcription/subscriptionHistory';
import Package from '../package/subscriptionHistory';
import TablePartner from './userParnter';

// tabs
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

// ==============================|| PROFILE 3 ||============================== //

const Profile3 = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [item, setItem] = React.useState({});

  React.useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const res = localStorage.getItem('userdetails');
    // console.log(JSON.parse(res));
    setItem(JSON.parse(res));
  }, []);

  return (
    <MainCard title="User Details">
      <div>
        <br />
        <br />
        <Tabs
          value={value}
          indicatorColor="primary"
          onChange={handleChange}
          sx={{
            mb: 3,
            minHeight: 'auto',
            '& button': {
              minWidth: 100
            },
            '& a': {
              minHeight: 'auto',
              minWidth: 10,
              py: 1.5,
              px: 1,
              mr: 2.25,
              color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900'
            },
            '& a.Mui-selected': {
              color: 'primary.main'
            }
          }}
          aria-label="simple tabs example"
          variant="scrollable"
        >
          <Tab component={Link} href="#" label="Basic Information" {...a11yProps(0)} />
          <Tab component={Link} href="#" label="Current Subscription" {...a11yProps(1)} />
          <Tab component={Link} href="#" label="Package Member" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {item?._id ? <TablePartner /> : ''}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {item?._id ? <Membership uid={item?._id} type="recurring" /> : ''}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {item?._id ? <Package uid={item?._id} type="fixed" /> : ''}
        </TabPanel>
      </div>
    </MainCard>
  );
};

export default Profile3;
