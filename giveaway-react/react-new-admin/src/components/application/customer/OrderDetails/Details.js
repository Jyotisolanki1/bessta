// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

// project imports
import SubCard from 'components/ui-component/cards/SubCard';
import Chip from 'components/ui-component/extended/Chip';
import { gridSpacing } from 'store/constant';

// assets
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import PhoneAndroidTwoToneIcon from '@mui/icons-material/PhoneAndroidTwoTone';

const sxDivider = {
  borderColor: 'primary.light'
};

const detailsIconSX = {
  width: 15,
  height: 15,
  verticalAlign: 'text-top',
  mr: 0.5,
  mt: 0.25
};

// table data
function createData(product, description, quantity, amount, total) {
  return { product, description, quantity, amount, total };
}

const rows = [
  createData('Logo Design', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '6', '$200.00', '$1200.00'),
  createData('Landing Page', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '7', '$100.00', '$700.00'),
  createData('Admin Template', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '5', '$150.00', '$750.00')
];

const Details = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <SubCard title="Customer" secondary={<Typography variant="subtitle1">Placed on 12.07.2018 10:00</Typography>}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="body2">
                    <CalendarTodayTwoToneIcon sx={detailsIconSX} /> Sophia Hale
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <PhoneAndroidTwoToneIcon sx={detailsIconSX} /> 070 123 4567
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <EmailTwoToneIcon sx={detailsIconSX} /> example@mail.com
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={sxDivider} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2}>
                    <Typography variant="h4">Payment method</Typography>
                    <Stack spacing={0}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Credit Card
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="subtitle1">Transaction ID :</Typography>
                        <Typography variant="body2">000001-TXT</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="subtitle1">Amount :</Typography>
                        <Typography variant="body2">$2500</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2}>
                    <Typography variant="h4">Shipping method</Typography>
                    <Stack spacing={0}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Carrier
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="subtitle1">Tracking Code :</Typography>
                        <Typography variant="body2">FX-012345-6</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="subtitle1">Date :</Typography>
                        <Typography variant="body2">12.15.2018</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default Details;
