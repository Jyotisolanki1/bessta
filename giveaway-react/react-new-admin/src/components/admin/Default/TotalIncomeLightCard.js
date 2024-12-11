'use client';

import PropTypes from 'prop-types';
import React from 'react';
import dynamic from 'next/dynamic';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'components/ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useSelector } from 'store';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.dark.dark : theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
        : theme.palette.primary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`
        : theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const chartOptions = {
  chart: {
    type: 'line',
    height: 90,
    sparkline: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#fff'],
  fill: {
    type: 'solid',
    opacity: 1
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  yaxis: {
    min: 0,
    max: 100
  },
  tooltip: {
    theme: 'dark',
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => 'Total Order'
      }
    },
    marker: {
      show: false
    }
  }
};

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
  const theme = useTheme();

  const data = useSelector((state) => state.dashboard);

  const [timeValue, setTimeValue] = React.useState(false);
  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary[800],
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <ShoppingCartOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                          {data?.dashboardData?.totalProduct}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.primary[200]
                          }}
                        >
                          Total Products
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
