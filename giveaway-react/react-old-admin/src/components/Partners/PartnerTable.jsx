


import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from "@mui/material/TableHead";

import partnerImage from '../../assets/partnerImage.png'

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(title, description, website,) {
  return { title, description, website  };
}

const rows = [

    createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic" ),
  createData("coach", "yoiu can get coaching video ", "basic" ),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  createData("coach", "yoiu can get coaching video ", "basic"),
  
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export default function Storetable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
        //             <TableRow sx={{ height: "80px" }}>
               <TableCell sx={{ width: "200px !important" }}>Title</TableCell>
               <TableCell sx={{ width: "200px !important" }} align="center">
                 description
               </TableCell>
               <TableCell sx={{ width: "200px !important" }} align="center">
                 website
               </TableCell>
          
               <TableCell sx={{ width: "200px !important" }} align="center">
                 partner logo
               </TableCell>
             </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row,index) => (
                         <TableRow
                 key={index}
                 sx={{
                   height: "50px",
                   "&:last-child td, &:last-child th": { border: 0 },
                 }}
               >
                 <TableCell component="th" scope="row">
                   {row.title}
                 </TableCell>
                 <TableCell align="center">{row.description}</TableCell>
                 <TableCell align="center">{row.website}</TableCell>
               
                 <TableCell align="center">

                 <img src = {partnerImage} alt = "partner logo" style = {{height:"50px",width:"150px"}}/> 
                 </TableCell>
               </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}




// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Box } from "@mui/material";
// import partnerImage from '../../assets/partnerImage.png'


// function createData(title, description, website,) {
//   return { title, description, website  };
// }

// const rows = [
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic" ),
//   createData("coach", "yoiu can get coaching video ", "basic" ),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
//   createData("coach", "yoiu can get coaching video ", "basic"),
// ];

// export default function PartnersTable() {
//   return (
//     <Box
//       sx={{
//         minHeight: "80vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         margin: "30px",
//       }}
//     >
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
//           <TableHead>
//             <TableRow sx={{ height: "80px" }}>
//               <TableCell sx={{ width: "200px !important" }}>Title</TableCell>
//               <TableCell sx={{ width: "200px !important" }} align="center">
//                 description
//               </TableCell>
//               <TableCell sx={{ width: "200px !important" }} align="center">
//                 website
//               </TableCell>
          
//               <TableCell sx={{ width: "200px !important" }} align="center">
//                 partner logo
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row,index) => (
//               <TableRow
//                 key={index}
//                 sx={{
//                   height: "50px",
//                   "&:last-child td, &:last-child th": { border: 0 },
//                 }}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.title}
//                 </TableCell>
//                 <TableCell align="center">{row.description}</TableCell>
//                 <TableCell align="center">{row.website}</TableCell>
               
//                 <TableCell align="center">

//                 <img src = {partnerImage} alt = "partner logo" style = {{height:"50px",width:"150px"}}/> 
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }
