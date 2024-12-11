/* eslint-disable arrow-body-style */
import { Typography, Link } from '@mui/material';

const Logo = '/assets/images/logo.png';

const SearchSection = () => {
  return (
    <>
      <Typography color="primary" variant="h2">
        <Link style={{ textDecoration: 'none' }} href="#" target="_blank">
          <img src={Logo} alt="Logo" width="160px" height="50px" />
        </Link>
      </Typography>
    </>
  );
};

export default SearchSection;
