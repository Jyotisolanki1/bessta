'use client';

import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import AppBar from 'components/ui-component/extended/AppBar';

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

const headerBackground = '/assets/images/landing/bg-header.jpg';
const HeaderWrapper = styled('div')(({ theme }) => ({
  backgroundImage: `url(${headerBackground})`,
  backgroundSize: '100% 600px',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  paddingTop: 30,
  [theme.breakpoints.down('md')]: {
    paddingTop: 0
  }
}));

export default function Layout({ children }) {
  return (
    <HeaderWrapper>
      <AppBar />
      {children}
    </HeaderWrapper>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};
