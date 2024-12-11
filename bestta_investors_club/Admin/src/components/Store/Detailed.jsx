import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Table,Box, Grid ,Card, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
// import  from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Detailed(props) {
console.log(props.detailedData, "...............>")
const {detailedData} = props
  const [open, setOpen] = React.useState(props.showDetailed);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    props.setShowDetailed(false)
    setOpen(false);
  };

  return (
    <React.Fragment>
      
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth = {"lg"}
        
      >
        
        <DialogTitle sx={{backgroundColor:"#E0F0FA;", m: 0, p: 2,textAlign:"left",fontSize:"20px",fontWeight:"bold",color:"#13375b" }} id="customized-dialog-title">
          PRODUCT DETAILS
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent >
            <Card sx = {{height:"400px",width:"800px"}}>
              <Grid container sx = {{display:"flex",alignItems:"center",height :"200px"}}>
                  <Grid item xs = {4} sx = {{display:"flex",alignItems:"center"}}>
                      <img style = {{width:"100%"}}src = {`http://52.22.241.165:10010/${detailedData?.images[0]}`}
 alt = "image"/>
                  </Grid>
                  <Grid item  xs = {8}>
                      <h1 style = {{marginTop:"0px",marginBottom:"0px",color:"#13375b",fontSize:"35px"}}> {detailedData?.name}</h1>
                      <p style = {{marginTop:"0px",marginBottom:"0px",paddingBottom:"15px"}}>{detailedData?.description}</p>
                      <Table sx >
                            <TableHead sx = {{backgroundColor:"#DAE7FF"}}>
                              <TableRow>
                                <TableCell align= "center" sx = {{fontSize:"16px",fontWeight:"bold",color:"#13375d"}}>Size</TableCell>
                                <TableCell align = "center" sx = {{fontSize:"16px",fontWeight:"bold",color:"#13375d"}}>Price</TableCell>
                                <TableCell align = "center" sx = {{fontSize:"16px",fontWeight:"bold",color:"#13375d"}}>Stock</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                detailedData?.variableProducts?.map((each) => {
                                  return (
                                    <TableRow>
                                    <TableCell align = "center">{each?.attributes[0]?.value}</TableCell>
                                    <TableCell align = "center">{each?.price}</TableCell>
                                    <TableCell align = "center">{each?.stock}</TableCell>
                                  </TableRow>
                                  )
                                })
                            }
                          </TableBody>
                      </Table>
                  </Grid>
              </Grid>
            </Card>
        </DialogContent>
      
        
      </Dialog>
    </React.Fragment>
  );
}
