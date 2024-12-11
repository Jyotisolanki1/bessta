import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useState ,useEffect} from "react";
import { useDispatch } from "react-redux";

import { fetchPlanCategories } from "../../slices/PlanCategorySlice";
import { addPlanCategories } from "../../slices/PlanCategorySlice";
// import { errorNotification } from "../notification";

import { successNotification , errorNotification } from "../notification";

export default function AddPlanCategory() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    name:""
  });

  const [disableStatus , setDisableStatus] = useState(true)

  const [productData, setProductData] = useState("");

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData({
      [name]: value,
    });
  };

  const handleAddPlan = async () => {
    const response = await dispatch(addPlanCategories(data));
    // console.log(response, "from update plan")
    if (response.payload.success) {
      dispatch(fetchPlanCategories());
      successNotification("Plan Categorty Added Successfully");
      setData("")
      setOpen(false);
    } else {
      errorNotification(response?.payload?.message);
    }
  };


  useEffect(() => {
      if(data.name === '' || data.name.length < 4){
        setDisableStatus(true)
      }else{
        setDisableStatus(false)
      }
  },[data.name])

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
        Add Plan Category
      </button>
      <Dialog open={open} onClose={handleClose}  maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title">
        <DialogTitle sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
          }}
          id="customized-dialog-title">ADD PLAN CATEGORY </DialogTitle>
        <DialogContent>
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
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <button   style={{
          backgroundColor: "#13375b",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "10px 20px",
          color: "#fff",
          fontSize: "!6px",
          fontWeight: "bold",
        }} onClick={handleClose}>Cancel</button>
          <button   style={{
          backgroundColor: disableStatus? "grey" : "#13375b",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "10px 20px",
          color: "#fff",
          fontSize: "!6px",
          fontWeight: "bold",
          disabled : disableStatus
        }}
           onClick={handleAddPlan}>Add</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
