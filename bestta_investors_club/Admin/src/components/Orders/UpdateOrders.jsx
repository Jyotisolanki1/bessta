import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderUpdate } from "../../slices/Orders";
import { fetchOrders } from "../../slices/Orders";

import { successNotification } from "../notification";
import { errorNotification } from "../notification";

export default function UpdateOrder(props) {
  const [data, setData] = useState({
    id: props.updateData._id,

    status: props.updateData.status,
  });

  const dispatch = useDispatch();

  const handleClose = () => {
    props.setShowDialog(false);
  };

  const updateCategory = async () => {
    const response = await dispatch(orderUpdate(data));
    console.log(response, "response");
    if (response.payload.success) {
      props.setShowDialog(false);
      successNotification("Order Status Updated Successfully");
      dispatch(fetchOrders());
    } else {
      errorNotification(response?.payload?.message);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div>
      <Dialog
        open={props.showDialog}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth
        aria-labelledby="customized-dialog-title"
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
          Update Order Status
        </DialogTitle>
        <DialogContent>
          <FormControl
            variant="standard"
            sx={{ width: "100%", marginTop: "10px" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              value={data.status}
              name="status"
              onChange={handleOnChange}
              label="category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="hold">Hold</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateCategory}>Update</Button>
          <Button onClick={handleClose} autoFocus>
            Ignore
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
