
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
import { useState ,useEffect } from 'react';
import axios from 'axios'
import Loader from '../../common/Loader';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import UpdateCourses from './UpdateCourses';
import CourseVideo from './CourseVideo';
import AddCoachingVideo from './AddCourses';

import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from '../../slices/CourseSlice';

import { Divider } from '@mui/material';


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




export default function CoursesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData ,setUpdateData] = useState('')
  const [showCourse , setShowCourse] = useState(false)
  const [cousreData , setCourseData] = useState('')

  const {loader,courses} = useSelector((state) => state.Courses)
  const dispatch = useDispatch()
  const [searchText , setSearchText] = useState('')

  // const [rows,setRows] = useState([])


const rows = courses?.data?.filter((each) => each.name.toLowerCase().includes(searchText.toLowerCase()))


  const handleSearchText = (e) => {
    setSearchText(e.target.value)
    // setRows(rows.filter((each) => each.name.toLowerCase().includes(searchText.toLowerCase())))
  }


  

  useEffect(() => {
    // getData()
    dispatch(fetchCourses())
    
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


  function HandleDescription({description}){
    
    const [showMore , setShowMore] = useState(description?.length > 20)
  
    const handleText = () => {
   
      setShowMore((prevState) => !prevState)
    }

    const handleFullText = () => {
        setShowMore(!showMore)
    }

    return showMore ? <div>
      <p onClick = {handleText} >{description.substring(0,50)}....</p>
      
    </div>: <p onClick={handleFullText }>{description}</p>
   
  }

  const handleCousreVideo = (videoid) => {
  
      setShowCourse(!showCourse)
      setCourseData(videoid)
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
          placeholder="Search by Course Name"
          type="search"
          value ={searchText}
          onChange={handleSearchText}
          style={{
            border: "2px solid #13375b",
            width: "250px",
            borderRadius: "4px",
          }}
        />
        <AddCoachingVideo/>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
          <Box>
            <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>Courses</h3>
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
                    Title
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
                    Video 
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
                        <HandleDescription  description={row.description}/>
                        </TableCell>
                        <TableCell style={{ width: 160 }} align="center">
                        <button onClick={() => handleCousreVideo(row?.video)} style = {{border:"none",cursor:"pointer",backgroundColor:"transparent"}}> <PlayCircleIcon sx = {{color:"#00c853"}}/></button>
                        </TableCell>
                        {/* <button onClick={() => handleCousreVideo(row?.video)} style = {{border:"none",cursor:"pointer",backgroundColor:"transparent"}}> <PlayCircleIcon sx = {{color:"#00c853"}}/></button> */}
                        <TableCell style={{ width: 160 }} align="center">
                        {row?.status}
                        </TableCell>
                        {/* {DateFormatter(row.scheduleDate)} */}
                 
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
    {showUpdateDialog && <UpdateCourses
 // setAction={setAction}
 // action={action}
 showDialog={showUpdateDialog}
 setShowDialog={setShowUpdateDialog}
 updateData={updateData}
 setUpdateData={setUpdateData}
/>}   
{
 showCourse && <CourseVideo 
 showCourse = {showCourse}
 setShowCourse = {setShowCourse}
 cousreData = {cousreData}
 />
}
  </Box>
  );
}



