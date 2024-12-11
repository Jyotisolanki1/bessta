

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
import shirt1 from '../../../src/assets/s1.jpg'
import shirt2 from '../../../src/assets/s2.jpg'
import EditIcon from '@mui/icons-material/Edit';
import { Divider } from '@mui/material';
import { fetchProductCategories } from '../../slices/ProductCategorySlice';

import {  useSelector , useDispatch } from 'react-redux'

import UpdatePlanCategory from './UpdateProductCategory';

import { useState , useEffect ,useCallback } from 'react';
import Loader from '../../common/Loader';
import AddProductCategory from './AddProductCategories';





export default function ProductCategoriesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [action,setAction] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData,setUpdateData] = useState('')


  const [searchText ,setSearchText] = useState('')


 const dispatch = useDispatch()
 const {loader,ProductCategories} = useSelector((state) => state.ProductCategorySlice)

// console.log(ProductCategories, 'nnn')

const rows = ProductCategories?.data?.filter((each) => each?.name?.toLowerCase().includes(searchText.toLowerCase()))

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


  useEffect(() => {
    // getProductCategories()
    dispatch(fetchProductCategories())
  },[])
  
  const handleModalClick = (editdata) => {
    // setModalStatus(true)
    setUpdateData(editdata)
    setAction(true)
    setShowUpdateDialog(true)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }


  console.log("rows")



  return (
    <Box>
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search by Product Category Name"
          value={searchText}
          onChange={handleSearch}
          type="search"
          style={{
            border: "2px solid #13375b",
            width: "260px",
            borderRadius: "4px",
          }}
        />
        <AddProductCategory/>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
          <Box>
            <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>Product Categories</h3>
            <Divider />
          </Box>
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead style={{ background: "#dae7ff" }}>
                <TableRow style={{ backgroundColor: "#dae7ff" }}>
                  {/* <TableCell align="center" style = {{backgroundColor:"#dae7ff",fontSize:"16px",fontWeight:"bold"}}>S.No</TableCell> */}
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor: "#dae7ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                   Category Name
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor: "#dae7ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                   Slug
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor: "#dae7ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                     Icon
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      backgroundColor: "#dae7ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                     Status
                  </TableCell>
                   <TableCell
                    align="center"
                    style={{
                      backgroundColor: "#dae7ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow key={row._id}>
           
                        <TableCell style={{ width: 160 }} align="center">
                        {row.name}
                        </TableCell>
                        
                   
                        
                        <TableCell style={{ width: 160 }} align="center">
                        {row.slug}
                        </TableCell>
                        {/* {DateFormatter(row.scheduleDate)} */}
                        <TableCell style={{ width: 160 }} align="center">
                        {<img src = {`http://52.22.241.165:10010/${row.icon}`} style= {{height:"30px",width:"30px",borderRadius:"50%"}}/>}
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                        {row.status}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "200px !important",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                          align="center"
                        >
                          <button
                            onClick={() => handleModalClick(row)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <EditIcon sx={{ color: "#13375b" }} />
                          </button>
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
      )}
    </div>
    {
   showUpdateDialog &&  <UpdatePlanCategory
    setAction={setAction}
    action={action}
    showDialog={showUpdateDialog}
    setShowDialog={setShowUpdateDialog}
    updateData={updateData}
    setUpdateData={setUpdateData}
    />
  }
  </Box>
  );
}







