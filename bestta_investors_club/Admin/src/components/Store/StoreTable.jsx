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

import TableHead from "@mui/material/TableHead";

// import { getProduct } from '../slices/storeSlice';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../slices/ProductSlice";
import Loader from "../../common/Loader";

import { Divider } from "@mui/material";
import AddProduct from "./AddProduct";

import VisibilityIcon from '@mui/icons-material/Visibility';

import Detailed from "./Detailed";

import { DateFormatter } from "../../common/DateFormatter";

import { fetchProductCategories } from '../../slices/ProductCategorySlice';

import UpdateProduct from "./UpdateProduct";

import EditIcon from '@mui/icons-material/Edit';


let rows = []
export default function Storetable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [searchText, setSearchText] = useState("");
  const [categoryName,setCategoryName] = useState('')

  const [detailedData,setDetailedData] = useState('')
  const [showDetailed , setShowDetailed] = useState(false)
  const [categories , setCategories] = useState('')

  const [action,setAction] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData,setUpdateData] = useState('')
 

  const [filterDisableStatus , setFilterDisableStatus] = useState(true)

  const dispatch = useDispatch();
  const { loader, Products } = useSelector((state) => state.ProductSlice)
 
  

  let rows = Products.data


  
   rows = rows?.filter((each) =>
    each?.name?.toLowerCase().includes(searchText.toLowerCase())
  );
if(categoryName){

 rows =  rows?.filter((each) => {
 
    if(each.category.name === categoryName){
      return each
    }
  })
}

const handleSearch = (e) => {
  setSearchText(e.target.value);
  setPage(0)
 
};

const handleSelectFilter = (e) => {
  setCategoryName(e.target.value)
  setPage(0)
}



 

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };





  const handleClickShowDetailed = (data) => {
    setShowDetailed(true)
    setDetailedData(data)
  }

  const getCategories = async  () => {
          const res =  await dispatch(fetchProductCategories())
    
          setCategories(res?.payload?.data)
  }

  useEffect(() => {
   
    if(searchText.trim() === '' && categoryName.trim() === ''){
          setFilterDisableStatus(true)
    }else{
          setFilterDisableStatus(false)
    }
  },[searchText,categoryName])
 
  const handleClearFilter =  () => {
    setSearchText("")
    setCategoryName("")
  }


  useEffect(() => {
    getCategories()
    dispatch(fetchProducts());
  }, []);

  const handleModalClick = (editdata) => {
    // setModalStatus(true)
    setUpdateData(editdata)
    setAction(true)
    setShowUpdateDialog(true)
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
          <div>
          <input
            placeholder="Search by Product  Name"
            type="search"
            value={searchText}
            onChange={handleSearch}
            style={{
              border: "2px solid #13375b",
              width: "250px",
              borderRadius: "4px",
            }}
          />
          <select  onChange = {handleSelectFilter} value = {categoryName} style = {{
            height:"40px",
            border:"2px solid #13375b",
            marginLeft:"15px",
            width:"150px",
            backgroundColor:"#eee",
            borderRadius:"4px"
          }}>
            <option value = "">Filter By Category</option>
            {
              categories && categories?.length > 0 && categories.map((each) => {
                return <option value = {each.name}>{each.name}</option>
              })
            }
          </select>
          <button onClick = {handleClearFilter} style = {{
            backgroundColor: filterDisableStatus? "grey" : "#13375b",
            padding:"10px",
            color:"#fff",
            fontSize:"15px",
            fontWeight:"bold",
            borderRadius:"5px",
            marginLeft:"20px"
          }}>Clear Filter</button>
          </div>
          <AddProduct />
        </div>
        {loader ? (
          <Loader />
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
            <Box>
              <h3 style={{ color: "#13375b", paddingLeft: "10px" }}>
                Products
              </h3>
              <Divider />
            </Box>
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead style={{ background: "#dae7ff" }}>
                  <TableRow style={{ backgroundColor: "#dae7ff" }}>
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
                     Category Type
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Product Type
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Created Date
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Image
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
                          
                          <TableCell style={{ width: 160 }} align="center">
                            {row.name}
                          </TableCell>

                          <TableCell style={{ width: 160 }} align="center">
                            {row.category?.name}
                          </TableCell>
                          {/* {DateFormatter(row.scheduleDate)} */}
                          <TableCell style={{ width: 160 }} align="center">
                            {row?.productType}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            {DateFormatter(row?.createdAt)}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            {
                              <img
                                src={`http://52.22.241.165:10010/${row.images[0]}`}
                                style={{
                                  height: "50px",
                                  width: "50px",
                                  borderRadius: "50%",
                                }}
                              />
                            }
                          </TableCell>
                          {/* KeyboardArrowDownIcon */}
                          <TableCell style={{ width: 160 }} align="center">
                              <button onClick = {() => handleClickShowDetailed(row)} style = {{backgroundColor:"transparent",cursor:"pointer"}}><VisibilityIcon sx = {{color:"#000"}}/></button>
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
   showUpdateDialog &&  <UpdateProduct
    setAction={setAction}
    action={action}
    showDialog={showUpdateDialog}
    setShowDialog={setShowUpdateDialog}
    updateData={updateData}
    setUpdateData={setUpdateData}
    />
  }
  
  {
    showDetailed && <Detailed 
    showDetailed = {showDetailed}
    setShowDetailed = {setShowDetailed}
    detailedData = {detailedData}
    />
  }
    </Box>
  );
}
