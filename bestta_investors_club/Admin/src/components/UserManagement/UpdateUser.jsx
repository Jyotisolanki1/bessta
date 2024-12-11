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

import { updateUser } from "../../slices/UserSlice";
import { fetchUsers } from "../../slices/UserSlice";

import { useDispatch } from "react-redux";
import { successNotification } from "../notification";
import { errorNotification } from "../notification";

export default function UpdateUser(props) {
  const [data, setData] = useState({
    id: props.updateData._id,
    status: props.updateData.status,
  });

  const dispatch = useDispatch();

  const handleClose = () => {
    props.setShowDialog(false);
  };

  const updateCategory = async () => {
    const respose = await dispatch(updateUser(data));

    console.log(respose);
    if (respose.payload.success) {
      props.setShowDialog(false);
      dispatch(fetchUsers());
      successNotification("User Status updated Successfully");
    } else {
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
        maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title"
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
            UPDATE USER STATUS
          </DialogTitle>
          <DialogContent>
          <FormControl variant="standard" sx={{ width: "100%" }}>
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <button
            onClick={updateCategory}
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
          >
            Update
          </button>
          <button
            onClick={handleClose}
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
            autoFocus
          >
            Ignore
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
