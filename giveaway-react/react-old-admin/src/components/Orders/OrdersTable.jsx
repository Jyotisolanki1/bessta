import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../common/Loader";
import EditIcon from "@mui/icons-material/Edit";
// import UpdatePlan from './UpdatePlans';
import { fetchOrders } from "../../slices/Orders";

import { useSelector, useDispatch } from "react-redux";
import UpdateOrder from "./UpdateOrders";

import { Divider } from "@mui/material";
import { DateFormatter } from "../../common/DateFormatter";

import VisibilityIcon from '@mui/icons-material/Visibility';

import OrderDetails from "./Detailed";




export default function OrdersTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState("");

  const [searchText , setSearchText] = useState('')

  const { loader, Orders } = useSelector((state) => state.OrderSlice);

  const [detailedData,setDetailedData] = useState('')
  const [showDetailed , setShowDetailed] = useState(false)
 
  // const  datat = useSelector((state) => state)
  // console.log(datat , "mm")
  const dispatch = useDispatch();

  const rows = Orders.data?.filter((each) => each?.lineItems[0]?.productData?.name?.toLowerCase().includes(searchText.toLowerCase()));
  

  console.log(Orders, "check orders")

  useEffect(() => {
    dispatch(fetchOrders());
    // getCourses()
  }, []);

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
    setShowUpdateDialog(true);
    setUpdateData(editdata);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }


  const handleClickShowDetailed = (data) => {
    setShowDetailed(prevState => !prevState)
    setDetailedData(data)
  }


 


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
            placeholder="Search by Product Name"
            value = {searchText}
            onChange={handleSearch}
            type="search"
            style={{
              border: "2px solid #13375b",
              width: "250px",
              borderRadius: "4px",
            }}
          />
          
        </div>
        {loader ? (
          <Loader />
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
            <Box>
              <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>Orders Management</h3>
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
                     Order Id
                    </TableCell>
                
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Items
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
                      Date 
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Detailed 
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
             
                        
                          <TableCell style={{ width: 460 }} align="center">
                          {row._id}
                          </TableCell>
                          <TableCell align="center">  {row?.lineItems?.length}</TableCell>
                     

                          
                          <TableCell style={{ width: 160 }} align="center">
                          {row?.status}
                          </TableCell>
                          {/* {DateFormatter(row.scheduleDate)} */}
                          <TableCell style={{ width: 160 }} align="center">
                          {DateFormatter(row?.createdAt)}
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
                             onClick = {() => handleClickShowDetailed(row)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <VisibilityIcon sx={{ color: "#13375b" }} />
                            </button>
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
                              onClick={() => handleEditButton(row)}
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
      {showUpdateDialog && (
        <UpdateOrder
          // setAction={setAction}
          // action={action}
          showDialog={showUpdateDialog}
          setShowDialog={setShowUpdateDialog}
          updateData={updateData}
          setUpdateData={setUpdateData}
        />
      )}
     

     {
    showDetailed && <OrderDetails 
    showDetailed = {showDetailed}
    setShowDetailed = {setShowDetailed}
    detailedData = {detailedData}
    />
  }
    </Box>
  );
}

