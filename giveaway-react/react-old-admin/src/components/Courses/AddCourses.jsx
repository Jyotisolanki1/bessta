import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useSelector, useDispatch } from "react-redux";
import { addCourse } from "../../slices/CourseSlice";
import { fetchCourseCategories } from "../../slices/CoursecategorySlice";
import { fetchCourses } from "../../slices/CourseSlice";
import { useEffect, useState } from "react";
import { errorNotification, successNotification } from "../notification";

export default function AddCoachingVideo() {
  const [open, setOpen] = React.useState(false);

  const [data, setdata] = useState({
    name: "",
    description: "",
    video: "",
    videoType: "",
    category: "",
    tags: [],
  });

  

  const [disableStatus,setDisabledStatus] = useState(true)

  const dispatch = useDispatch();

  const { courseCategories } = useSelector((state) => state.CouriesCategories);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchCourseCategories());
  }, []);

  useEffect(() => {

    if (data.name.trim() === '' || data.description.trim() === '' || data.category.trim() === '') {
      setDisabledStatus(true);
    } else {
      setDisabledStatus(false);
    }
  }, [data.name, data.description, data.category, data.tags]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  };

  const handleAddCourse = async () => {
    console.log(data, "check data");
    const response = await dispatch(addCourse(data));
    console.log(response, "add course");
    if (response.payload.success) {
      setOpen(false);
      successNotification("Course Added Successfully")
      dispatch(fetchCourses());
    }else{
      errorNotification(response?.payload?.message)
    }
  };

 

  return (
    <React.Fragment>
      <button
        style={{
          backgroundColor: "#13375b",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "10px 20px",
          color: "#fff",
          fontSize: "!6px",
          fontWeight: "bold",
        }}
        onClick={handleClickOpen}
      >
        Add Course
      </button>
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title">
        <DialogTitle sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
          }}
          id="customized-dialog-title"> ADD COURSE </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            multiline
            maxRows={5}
            fullWidth
            variant="standard"
            onChange={handleOnChange}
            value={data.name}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            multiline
            value={data.description}
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              video type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              name="videoType"
              value={data.videoType}
              //   onChange={handleChange}
              onChange={handleOnChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="youtube">Youtube</MenuItem>
              <MenuItem value="vimeo">Vimeo</MenuItem>
              <MenuItem value="tiktok">Tik Tok</MenuItem>
            </Select>
          </FormControl>
          {courseCategories?.data?.length > 0 && (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="category"
                value={data.category}
                //   onChange={handleChange}
                onChange={handleOnChange}
                label="Age"
              >
                {courseCategories?.data?.map((eachCategory) => {
                  return (
                    <MenuItem value={eachCategory._id} key={eachCategory._id}>
                      {eachCategory.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
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
            value={data.video}
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <button style={{
                  backgroundColor: "#13375b",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: "!6px",
                  fontWeight: "bold",
                  }}onClick={handleClose}>Cancel</button>
          <button 
              style={{
                backgroundColor:disableStatus? "grey": "#13375b",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "10px 20px",
                color: "#fff",
                fontSize: "!6px",
                fontWeight: "bold",
                }}
                disabled = {disableStatus}
                
          onClick={handleAddCourse}>Add Course</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
