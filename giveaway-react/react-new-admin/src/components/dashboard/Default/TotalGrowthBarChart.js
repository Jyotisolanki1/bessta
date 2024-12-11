'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'components/ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getChart } from 'store/slices/dashboard';
import { useDispatch, useSelector } from 'store';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// chart data
const chartOptions = {
  chart: {
    height: 480,
    type: 'bar',
    id: 'bar-chart',
    stacked: true,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%'
    }
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  legend: {
    show: true,
    fontFamily: `'Roboto', sans-serif`,
    position: 'bottom',
    offsetX: 20,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: 5
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  },
  fill: {
    type: 'solid'
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    show: true
  }
};

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const [series, setSeries] = useState([]);
  const dispatch = useDispatch();
  const [value, setValue] = useState('today');
  const theme = useTheme();
  const { navType, rtlLayout } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  const [options, setOptions] = useState(chartOptions);

  useEffect(() => {
    const getChatapi = async () => {
      const res = await dispatch(getChart());
      if (res) {
        setSeries(res.data);
      }
    };
    getChatapi();
  }, []);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: navType === 'dark' ? darkLight + 20 : grey200
      },
      tooltip: {
        theme: navType === 'dark' ? 'dark' : 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    }));
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ '& .apexcharts-legend-text': { marginLeft: rtlLayout ? '8px' : 'initial' } }}>
              <ReactApexChart options={options} series={series} type="bar" height={480} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
