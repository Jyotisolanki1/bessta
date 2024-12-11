
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

import TableHead from "@mui/material/TableHead";
import { useState ,useEffect } from 'react';
import axios from 'axios'
import Loader from '../../common/Loader';
import EditIcon from '@mui/icons-material/Edit';
import { Divider } from '@mui/material';


import { useSelector, useDispatch } from "react-redux";
import { fetchCoupons } from '../../slices/CouponSlice';
import UpdateCoupons from './UpdateCoupons';
import AddCoupon from './AddCoupon';


export default function CouponsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData ,setUpdateData] = useState('')

  const [searchText,setSearchText] = useState('')

 

  const {loader,Coupons} = useSelector((state) => state.CouponSlice)


  const dispatch = useDispatch()

  

  const rows = Coupons?.data?.filter((each) => each?.code?.toLowerCase().includes(searchText.toLowerCase()))
  // Avoid a layout jump when reaching the last page with empty rows.




  useEffect(() => {
    dispatch(fetchCoupons())
 
    
  } , [])

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditButton = (editdata) => {
    console.log("firing")
    setShowUpdateDialog(true)
    setUpdateData(editdata)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <Box>
      
      
    <div>
      < div style = {{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <input value = {searchText} onChange = {handleSearch} placeholder='Search by Coupon Code' type = "search" style = {{border:"2px solid #13375b",width:"250px",borderRadius:"4px"}}/>
          <AddCoupon/>
        </div>
   {
          loader ? <Loader/> :  <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
          <Box ><h3 style = {{color:"#13375b",paddingLeft:"10px"}}>Coupons</h3><Divider/></Box>
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead style = {{background:"#dae7ff"}}>
                <TableRow style = {{backgroundColor:"#dae7ff"}}>
                  {/* <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>S.No</TableCell> */}
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Code</TableCell>
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Description</TableCell>
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Value</TableCell>
                 
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Discount Type</TableCell>
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Status</TableCell>
                 
                  <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>Edit</TableCell>
                </TableRow>
              </TableHead >
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow key={row._id}>
                        {/* component="th" scope="row" */}
                        {/* <TableCell style={{ width: 160 }} align="center">
                          {index + 1}
                        </TableCell> */}
                        <TableCell style={{ width: 160 }} align="center">
                        {row.code}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                        {row.description}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                        {row.value}
                        </TableCell>
                     
                        <TableCell style={{ width: 160 }} align="center">
                        {row.discountType}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                          {row?.status}
                        </TableCell>
                      <TableCell sx={{ width: "200px !important",fontSize:"16px",fontWeight:"bold" }} align="center">
                      <button onClick = {() => handleEditButton(row)} style = {{backgroundColor:"transparent",border:"none",cursor:"pointer"}}><EditIcon sx= {{color:"#13375b"}}/></button>
                </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
      
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
   }
    </div>
  
  {showUpdateDialog && (
    <UpdateCoupons
      // setAction={setAction}
      // action={action}
      showDialog={showUpdateDialog}
      setShowDialog={setShowUpdateDialog}
      updateData={updateData}
      setUpdateData={setUpdateData}
    />
  )}
</Box>
  );
}




