import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from "react-redux";
import { RateReviewApi } from '../../Slices/MyOrdersSlice';
import {  useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Rate_Review({ open, handleClose ,productId}) {
  const [value, setValue] = React.useState(2);
  const dispatch = useDispatch();
  const { id } = useParams();

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const comment = formJson.comment;
            const data = {comment,rating:value,order_id:id,product_id:productId}
           
          //  
          try {
            dispatch(RateReviewApi(data))
            toast.success('Review and rating submitted successfully')
          } catch (error) {
            // console.log(error)
          }
            handleClose();
          }
        }}
      >
        <DialogTitle style={{textAlign:"center"}}>Review and Rating</DialogTitle>
        <div style={{borderBottom:"1px solid"}}></div>
        <DialogContent>
          <DialogContentText>Rate this product</DialogContentText>
          <Box
            sx={{
              '& > legend': { mt: 2 }
            }}
          >
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />

          </Box>
          <TextField margin="dense" id="comment" name="comment" type="text"  placeholder='Write Review' fullWidth variant="standard" required style={{width:"400px", padding:"3%"}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <button className="nisoz-btn" type=''>
          <span className="nisoz-btn__shape" />
          <span className="nisoz-btn__shape" />
          <span className="nisoz-btn__shape" />
          <span className="nisoz-btn__shape" />
          <span className="nisoz-btn__text  " >
            Submit
          </span>
        </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
