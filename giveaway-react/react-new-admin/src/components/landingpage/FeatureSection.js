import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography, Stack, CardMedia } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import SubCard from 'components/ui-component/cards/SubCard';
import Avatar from 'components/ui-component/extended/Avatar';

// assets
const Offer1 = '/assets/images/landing/offer/offer-1.png';
const Offer2 = '/assets/images/landing/offer/offer-2.png';
const Offer3 = '/assets/images/landing/offer/offer-3.png';
const Offer4 = '/assets/images/landing/offer/offer-4.png';
const Offer5 = '/assets/images/landing/offer/offer-5.png';
const Offer6 = '/assets/images/landing/offer/offer-6.png';

// =============================|| LANDING - FEATURE PAGE ||============================= //

const OfferCard = ({ title, caption, image }) => {
  const theme = useTheme();
  const AvaterSx = { background: 'transparent', color: theme.palette.secondary.main, width: 56, height: 56 };
  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.100',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.divider,
          '&:hover': { boxShadow: 'none' },
          height: '100%'
        }}
      >
        <Stack spacing={4}>
          <Avatar variant="rounded" sx={AvaterSx}>
            <CardMedia component="img" src={image} alt="Beautiful User Interface" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              {caption}
            </Typography>
          </Stack>
        </Stack>
      </SubCard>
    </FadeInWhenVisible>
  );
};

OfferCard.propTypes = {
  title: PropTypes.string,
  caption: PropTypes.string,
  image: PropTypes.string
};

const FeatureSection = () => (
  <Container>
    <Grid container spacing={7.5} justifyContent="center">
      <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              What does MyTimeTool offer?
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={5} sx={{ '&> .MuiGrid-root > div': { height: '100%' } }}>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Location Tracking"
              caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              image={Offer1}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Attendance Management"
              caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              image={Offer2}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Visit Management"
              caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              image={Offer3}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Expense Reimbursement Workflow"
              caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              image={Offer4}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Dashboard & Insights"
              caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              image={Offer5}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title="Turn-By-Turn Navigation"
              caption="Berry is a performance-centric dashboard template that is designed to deliver optimal performance for your admin panel."
              image={Offer6}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Container>
);

export default FeatureSection;
