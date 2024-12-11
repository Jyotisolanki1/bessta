import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import axios from 'axios'

import { useDispatch } from 'react-redux';
import { updateCourse } from '../../slices/CourseSlice';
import { fetchCourses } from '../../slices/CourseSlice';

import { errorNotification } from '../notification';
import { successNotification } from '../notification';

export default function UpdateCourses(props) {
  const dispatch = useDispatch()
  const {updateData} = props
  const [data,setData] = useState({
    id:updateData._id,
    name:updateData.name,
    description:updateData.description,
    video :updateData.video,
    videoType:updateData.videoType,
    category:updateData.category,
    tags:updateData.tags
  })
    
  const handleClose = () => {
    props.setShowDialog(false)
  };






  const handleOnChange = (e) => {
    const {name,value} = e.target
    setData({
      ...data, [name]:value
    })
  
  }

  const handleUpdateData = async () => {

    const response = await  dispatch(updateCourse(data))
    console.log(response, "from update data")
    if(response.payload.success){
      dispatch(fetchCourses())
      props.setShowDialog(false)
      successNotification("Course Updated Successfully")
    }else{
      errorNotification(response?.payload?.message)
    }
    
  }





 
  return (
    <div>
   
      <Dialog
        open={props.showDialog}
        onClose={handleClose}
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
          id="customized-dialog-title">UPDATE COURSE</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Course Name"
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
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value = {data.description}
            onChange={handleOnChange}
          />
           <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            name="video"
            label="Video Url"
            type="url"
            multiline
            fullWidth
            variant="standard"
            value = {data.video}
            onChange={handleOnChange}
          />
          <FormControl variant="standard" sx = {{width:"100%"}}>
          <InputLabel id="demo-simple-select-standard-label">video type</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={data.videoType}
          onChange={handleOnChange}
        name = "videoType"
          label=""
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="youtube">Youtube</MenuItem>
          <MenuItem value="vimeo">Vimeo</MenuItem>
          <MenuItem value="tiktok">Tik Tok</MenuItem>
        </Select>
      </FormControl>
     
          </DialogContent>
        <DialogActions >
          <button  style={{
                backgroundColor:"#13375b",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "10px 20px",
                color: "#fff",
                fontSize: "!6px",
                fontWeight: "bold",
                }} onClick = {handleUpdateData} >Update</button>

          <button  style={{
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
    </div>
  );
}
