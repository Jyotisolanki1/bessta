import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";

import { useDispatch } from 'react-redux';
import { updatePlan } from '../../slices/PlanSlice';
import { fetchPlans } from '../../slices/PlanSlice';
import { useState } from 'react';
import axios from 'axios'
import { errorNotification, successNotification } from '../notification';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import parse from 'html-react-parser';

export default function UpdatePlan(props) {
// console.log(props, "skskskk")
  const {updateData} = props
  const [data,setData] = useState({
    id:updateData._id,
    name:updateData.name,
    discription:updateData.discription,
    entries:updateData.entries
  })

  const dispatch = useDispatch()
    
  const handleClose = () => {
    props.setShowDialog(false)
  };




  const handleOnChange = (e) => {
    const {name,value} = e.target
    setData({
      ...data, [name]:value
    })
  
  }


  const handleDescription = (content, delta, source, editor) => {
    console.log(content);
    setData({...data,discription:content})
  };

  const handleUpdateData = async () => {

    const response = await dispatch(updatePlan(data))
    if(response.payload.success){
      props.setShowDialog(false)
      successNotification("Plans Updated Successfully")
      dispatch(fetchPlans())
    }
    else{
        errorNotification(response?.payload?.message)
    }
  }





 
  return (
    <React.Fragment>
   
      <Dialog
        open={props.showDialog}
        onClose={handleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
        maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title"
      >
        
       
        <DialogTitle sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
          }}
          id="customized-dialog-title">UPDATE PLAN</DialogTitle>
           <DialogContent >
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Plan Name"
            type="text"
            fullWidth
            variant="standard"
            value = {data.name}
            onChange={handleOnChange}
          />
            <TextField
            autoFocus
            required
            margin="dense"
            id="entries"
            name="entries"
            label="Entries"
            type="number"
            fullWidth
            variant="standard"
            value = {data.entries}
            onChange={handleOnChange}
          />
           {/* <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="discription"
            label="Description"
            type="text"
            
            fullWidth
            variant="standard"
            value = {data.discription}
            onChange={handleOnChange}
          /> */}

          <div>
            <span style = {{fontSize:"13px",paddingTop:"20px !important",color:"#B4B4B4"}}>Plan Description *</span>
          <ReactQuill
              theme="snow"
              value={(data.discription)}
              onChange={handleDescription}
              style={{ height: "200px"}}
            />
            </div>
     
     
          </DialogContent>
        <DialogActions sx = {{marginTop:"20px"}} >
          <button style={{
                  backgroundColor: "#13375b",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: "!6px",
                  fontWeight: "bold",
          }} onClick = {handleUpdateData} >Update</button>
          <button style={{
                backgroundColor: "#13375b",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "10px 20px",
                color: "#fff",
                fontSize: "!6px",
                fontWeight: "bold",
                }} autoFocus onClick={handleClose}>
            Ignore
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
