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
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addPlan, fetchPlans } from "../../slices/PlanSlice";
import { fetchPlanCategories } from "../../slices/PlanCategorySlice";
import { errorNotification, successNotification } from "../notification";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddPlan() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    category: "",
    name: "",
    intervalType: "",
    intervalCount: "",
    entries: "",
    price: "",
    discription: "",
  });

  const [disableStatus, setDisableStatus] = useState(true);

  const { planCategories } = useSelector((state) => state.planCategories);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchPlanCategories());
  }, []);

  useEffect(() => {
    if (
      data.category.trim() === "" ||
      data.name.trim() === "" ||
      data.intervalType.trim() === "" ||
      data.intervalCount.trim() === "" ||
      data.entries.trim() === "" ||
      data.price.trim() === "" ||
      data.discription.trim() === ""
    ) {
      setDisableStatus(true);
    } else {
      setDisableStatus(false);
    }
  }, [
    data.category,
    data.name,
    data.intervalType,
    data.intervalCount,
    data.entries,
    data.price,
    data.discription,
  ]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleDescription = (content, delta, source, editor) => {
    setData({ ...data, discription: content });
  };
  const handleAddPlan = async () => {
    const response = await dispatch(addPlan(data));

    if (response.payload.success) {
      setOpen(false);
      successNotification("Plan Added Successfully");
      setData({
        category: "",
        name: "",
        intervalType: "",
        intervalCount: "",
        entries: "",
        price: "",
        discription: "",
      });
      dispatch(fetchPlans());
    } else {
      errorNotification(response?.payload?.message);
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
        Add Plan
      </button>
      <Dialog
        open={open}
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
          id="customized-dialog-title">ADD PLAN </DialogTitle>
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
            value={data.name}
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
            multiline
            value={data.discription}
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          /> */}

          {planCategories && (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Plan Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={data.category}
                name="category"
                onChange={handleOnChange}
                //   onChange={handleChange}
                label="Age"
              >
                {planCategories?.data?.map((eachPlan) => {
                  return (
                    <MenuItem key={eachPlan._id} value={eachPlan._id}>
                      {eachPlan.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              Interval Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              value={data.intervalType}
              name="intervalType"
              onChange={handleOnChange}
              label="Interval Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="fixed">Fixed </MenuItem>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="intervaltype"
            name="intervalType"
            label="Interval Type"
            type="text"
            multiline
            fullWidth
            variant="standard"
            value = {data.intervalType}
            onChange={handleOnChange}
          /> */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="intervalcount"
            name="intervalCount"
            label="Interval Count"
            type="text"
            multiline
            fullWidth
            variant="standard"
            value={data.intervalCount}
            onChange={handleOnChange}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="entries"
            name="entries"
            label="Entries"
            type="text"
            multiline
            fullWidth
            variant="standard"
            value={data.entries}
            onChange={handleOnChange}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="price"
            name="price"
            label="Price"
            type="text"
            multiline
            fullWidth
            variant="standard"
            value={data.price}
            onChange={handleOnChange}
          />
          <div style={{ marginBottom: "20px !important" }}>
            <span
              style={{
                fontSize: "15px",
                paddingTop: "20px !important",
                color: "#B4B4B4",
              }}
            >
              Plan Description *
            </span>
            <ReactQuill
              theme="snow"
              value={data.discription}
              onChange={handleDescription}
              style={{ height: "200px" }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ marginTop: "20px !important" }}>
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
            onClick={handleAddPlan}
            disabled={disableStatus}
          >
            Add Plan
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
