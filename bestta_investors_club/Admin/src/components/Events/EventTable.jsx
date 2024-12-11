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

// import UpdateCourses from './UpdateCourses';

import { useAsyncValue, useNavigate } from "react-router-dom";
import UpdateEvent from "./UpdateEvents";

import { Divider } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { fetchDraws } from "../../slices/Draw";
import AddEvent from "./AddEvent";
import { DateFormatter } from "../../common/DateFormatter";


import RedeemIcon from '@mui/icons-material/Redeem';


export default function CoursesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState("");

  const [searchText ,setSearchText] = useState('')
  const { loader, Draws } = useSelector((state) => state.DrawSlice);
  const dispatch = useDispatch();

  const rows = Draws?.data?.filter((each) => each?.name?.toLowerCase().includes(searchText.toLowerCase()));
  // Avoid a layout jump when reaching the last page with empty rows.


  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchDraws());
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

  function HandleDescription({ description }) {
    const [showMore, setShowMore] = useState(description?.length > 20);

    const handleText = () => {
      setShowMore((prevState) => !prevState);
    };

    const handleFullText = () => {
      setShowMore(!showMore);
    };

    return showMore ? (
      <div>
        <p onClick={handleText}>{description.substring(0, 50)}....</p>
      </div>
    ) : (
      <p onClick={handleFullText}>{description}</p>
    );
  }


  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }


  const handleOpenDraw  = (id) => {
    
          navigate("/bestta-admin/prizes",{state:id})
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
            placeholder="Search by Event Name"
            value = {searchText}
            onChange={handleSearch}
            type="search"
            style={{
              border: "2px solid #13375b",
              width: "250px",
              borderRadius: "4px",
            }}
          />
          <AddEvent />
        </div>
        {loader ? (
          <Loader />
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
            <Box>
              <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>Events Management</h3>
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
                      Name
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Prize Money
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
                      Schedule Date
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
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Open Draw
                    </TableCell>
                  </TableRow>
                </TableHead>
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
                          {row.name}
                          </TableCell>
                          <TableCell style={{ width: 460 }} align="center">
                          {<HandleDescription description={row.discription} />}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                          {row.prizes[0].description}
                          </TableCell>

                          
                          <TableCell style={{ width: 160 }} align="center">
                            {row?.status}
                          </TableCell>
                          {/* {DateFormatter(row.scheduleDate)} */}
                          <TableCell style={{ width: 160 }} align="center">
                          {DateFormatter(row.scheduleDate)}
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
                          <TableCell
                            sx={{
                              width: "200px !important",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                            align="center"
                          >
                            <button
                              onClick={() => handleOpenDraw(row._id)}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <RedeemIcon sx={{ color: "#13375b" }} />
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
        <UpdateEvent
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

