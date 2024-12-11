import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import Avatar from 'components/ui-component/extended/Avatar';
import SubCard from 'components/ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconEdit } from '@tabler/icons-react';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import { useEffect, useState } from 'react';
import { imgPath } from 'config';

const Avatar3 = '/assets/images/users/avatar-3.png';

// progress
function LinearProgressWithLabel({ value, ...other }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          mr: 1
        }}
      >
        <LinearProgress value={value} {...other} />
      </Box>
      <Box
        sx={{
          minWidth: 35
        }}
      >
        <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number
};

// personal details table
/** names Don&apos;t look right */
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = () => {
  const [item, setItem] = useState({});
  const loading = false;

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const res = localStorage.getItem('partnerdetails');
    setItem(JSON.parse(res));
  }, []);
  const rows = [
    createData('Full Name', ':', `${item?.firstname} ${item.lastname}`),
    createData('Business Name', ':', item?.bussiness_name),
    createData(
      'Business Url',
      ':',
      <a href={item?.bussiness_url} target="_blank" rel="noopener noreferrer">
        {item?.bussiness_url}
      </a>
    ),
    createData('Email', ':', item?.email),
    createData('Phone', ':', item?.phone),
    createData('Address', ':', item?.address),
    createData('Category', ':', item?.categoryData ? item?.categoryData[0]?.name : '')
  ];
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item lg={2} xs={6}>
        <img src={`${imgPath}${item?.image}`} alt="loading" height={200} width={200} />
      </Grid>
      <Grid item lg={8} xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table
                    sx={{
                      '& td': {
                        borderBottom: 'none'
                      }
                    }}
                    size="small"
                  >
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell variant="head">{row.name}</TableCell>
                          <TableCell>{row.calories}</TableCell>
                          <TableCell>{row.fat}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Profile;
