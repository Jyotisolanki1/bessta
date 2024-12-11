import PropTypes from 'prop-types';

// project imports
// import Customization from './Customization';
import GuestGuard from 'utils/route-guard/GuestGuard';
import NavMotion from './NavMotion';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = ({ children }) => (
  <NavMotion>
    <GuestGuard>
      <>
        {children}
        {/* <Customization /> */}
      </>
    </GuestGuard>
  </NavMotion>
);
MinimalLayout.propTypes = {
  children: PropTypes.node
};
export default MinimalLayout;
