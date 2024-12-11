import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useState, useEffect } from "react";

import { AddCourseCategories } from "../../slices/CoursecategorySlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseCategories } from "../../slices/CoursecategorySlice";
import { errorNotification, successNotification } from "../notification";

export default function AddCourseCategory() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    name: "",
  });

  const [disableStatus, setDisableStatus] = useState(true);

  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const addCourseCategory = async () => {
    const response = await dispatch(AddCourseCategories(data));
    if (response.payload.success) {
      setOpen(false);
      successNotification("Course Category Added Successfully");
      dispatch(fetchCourseCategories());
    } else {
      errorNotification(response?.payload?.message);
    }
  };

  useEffect(() => {
    if (data.name.trim() === "" || data.name.length < 4) {
      setDisableStatus(true);
    } else {
      setDisableStatus(false);
    }
  }, [data.name]);

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
        Add Course Category
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth
        aria-labelledby="customized-dialog-title"
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
          id="customized-dialog-title">ADD COURSE CATEGORY</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />

          {/* <FormControl variant="standard" sx={{width:"100%"}}>
            <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              // value={age}
              name = 'category'
              onChange={handleOnChange}
              label="category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem  value='active'>active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
              
            </Select>
          </FormControl> */}
        </DialogContent>
        <DialogActions>
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
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            style={{
              backgroundColor: disableStatus ? "grey" : "#13375b",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "!6px",
              fontWeight: "bold",
            }}
            disabled={disableStatus}
            onClick={addCourseCategory}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
