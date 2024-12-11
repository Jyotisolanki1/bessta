'use client';

import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from 'components/admin/Default/EarningCard';
import TotalGrowthBarChart from 'components/dashboard/Default/TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';
import { getDashboard } from 'store/slices/dashboard';
import { useDispatch, useSelector } from 'store';

import TotalIncomeLightCard from 'components/dashboard/Default/TotalIncomeLightCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboard());
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '2%' }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
