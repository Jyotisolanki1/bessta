import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

// import  from '@mui/material';
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

export default function OrderDetails(props) {
  console.log(props, "props coming from Order table");
  const { detailedData } = props;
  const [open, setOpen] = React.useState(props.showDetailed);

  const formatOrderItems = detailedData?.lineItems?.map((eachItem) => {
    return {
      image: eachItem?.productInfo?.variableProducts[0]?.image,
      name: eachItem?.productInfo?.name,
      quantity: eachItem?.quantity,
      price: eachItem?.price,
    };
  });

  function handleClickOpen() {
    setOpen(true);
  }
  const handleClose = () => {
    props.setShowDetailed(false);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"md"}
        fullWidth
        
      >
        <DialogTitle
          sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
          }}
          id="customized-dialog-title"
        >
          ORDER DETAILS
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}>
            
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
                      Product Image
                    </TableCell>

                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: "#dae7ff",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Order Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formatOrderItems
                   
                    .map((row, index) => {
                      return (
                        <TableRow key={row._id}>
                          <TableCell style={{ width: 260 }} align="center">
                            <img src={`http://52.22.241.165:10010/${row.image}`} alt={row.name} style = {{height:"100px",width:"100px",borderRadius:"10px"}}/>
                          </TableCell>
                          <TableCell align="center" style={{ width: 260 }}> {row?.name}</TableCell>

                          <TableCell style={{ width: 160 }} align="center">
                            {row?.price}
                          </TableCell>

                          <TableCell style={{ width: 160 }} align="center">
                            {row?.quantity}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            {row?.price * row?.quantity}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </Paper>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
