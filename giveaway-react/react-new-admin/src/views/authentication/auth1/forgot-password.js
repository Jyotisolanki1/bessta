/* eslint-disable lines-around-directive */
/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthForgotPassword from 'components/authentication/auth-forms/AuthForgotPassword';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
// import Logo from 'components/ui-component/Logo';
import BackgroundPattern1 from 'components/ui-component/cards/BackgroundPattern1';
import AuthSlider from 'components/ui-component/cards/AuthSlider';
// import { FormattedMessage } from 'react-intl';

// assets
const AuthMultiCard = '/assets/images/auth/auth-forgot-pass-multi-card.svg';

// styles
const PurpleWrapper = styled('span')(({ theme }) => ({
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '18%',
    left: '18%',
    width: 515,
    height: 470,
    backgroundImage: `url(${AuthMultiCard})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    animation: '15s wings ease-in-out infinite',
    animationDelay: '1s',
    [theme.breakpoints.down('xl')]: {
      top: '10%',
      left: '6%',
      backgroundSize: 450
    }
  }
}));

// carousel items
const items = [
  {
    title: 'Powerful and easy to use multipurpose theme.',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  }
];
const Logo = '/assets/images/logo.png';

// ============================|| AUTH1 - FORGOT PASSWORD ||============================ //

const ForgotPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Grid
                  container
                  direction={matchDownSM ? 'column-reverse' : 'row'}
                  alignItems={matchDownSM ? 'center' : 'inherit'}
                  justifyContent={matchDownSM ? 'center' : 'space-between'}
                >
                  <Grid item>
                    <Stack justifyContent={matchDownSM ? 'center' : 'flex-start'} textAlign={matchDownSM ? 'center' : 'inherit'}>
                      <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                        Forgot Password?
                      </Typography>
                      {/* <Typography color="textPrimary" gutterBottom variant="h4">
                        Enter email to continue
                      </Typography> */}
                    </Stack>
                  </Grid>
                  <Grid item sx={{ mb: { xs: 3, sm: 0 } }}>
                    <Typography color="primary" variant="h2">
                      <Link style={{ textDecoration: 'none' }} href="#" target="_blank">
                        <img src={Logo} alt="Logo" style={{ width: '160px' }} />
                      </Link>
                    </Typography>
                    {/* <Link href="#" aria-label="theme-logo">
                      <Logo />
                    </Link> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent={matchDownSM ? 'center' : 'flex-start'}>
                  <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                    Please enter your email address below, and we'll send you a password to that email
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AuthForgotPassword />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {/* <Grid item xs={12}>
                <Grid item container direction="column" alignItems="flex-end" xs={12}>
                  <Typography component={Link} href="/signin" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    <FormattedMessage id="text-3" />
                  </Typography>
                </Grid>
              </Grid> */}
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <span />
                <PurpleWrapper />
              </Grid>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                    <AuthSlider items={items} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotPassword;
