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
import shirt1 from "../../../src/assets/s1.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';

import { Divider } from "@mui/material";
// import UpdateCourseCategory from "./UpdateCourseCategory";
import UpdatePlanCategory from "./UpdatePlanCategories";
import Loader from "../../common/Loader";

import { useSelector, useDispatch } from "react-redux";

import { fetchPlanCategories } from "../../slices/PlanCategorySlice";

import { DateFormatter } from "../../common/DateFormatter";
import AddPlanCategory from "./AddPlanCategories";

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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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



export default function PlanCategoriesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData,setUpdateData] = useState('')

  const [searchText , setSearchText] = useState('')
 

  const {loader ,planCategories} = useSelector((state) => state.planCategories)
  const dispatch = useDispatch()
  

  
  const rows = planCategories?.data?.filter((Each) => Each?.name?.toLowerCase().includes(searchText.toLowerCase()))
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



  useEffect(  () => {
 
    dispatch(fetchPlanCategories())
  
  }, []);

 

  const handleModalClick = (editdata) => {
    // setModalStatus(true)
    setUpdateData(editdata)
    // setAction(true)
    setShowUpdateDialog(true)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
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
        value = {searchText}
        onChange={handleSearch}
          placeholder="Search by Plan Category Type"
          type="search"
          style={{
            border: "2px solid #13375b",
            width: "250px",
            borderRadius: "4px",
          }}
        />

        <AddPlanCategory/>
        
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
          <Box>
            <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>Plan Categories</h3>
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
                   Plan Type
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
                    Created At
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
    {showUpdateDialog && (
      <UpdatePlanCategory
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


