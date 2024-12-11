// // import logo from "../../assets/images/logo.png";

// import React from "react";

// const Loader = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         "align-items": "center",
//         "justify-content": "center",
//         height: "70vh",
//       }}
//     >
//       {/* <CircularProgress /> */}
//       <img
//         src="https://cdn.dribbble.com/users/383277/screenshots/4858668/baseball_loading.gif"
//         height="220px"
//         width="240px"
//       />
//     </div>
//   );
// };

// export default Loader;

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}

// const Loader = () => {
//   return (
//     <div>
//       <Spinner color="primary">Loading...</Spinner>
//     </div>
//   );
// };

// export default <Loader/>
