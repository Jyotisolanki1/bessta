import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import DialogTitle from "@mui/material/DialogTitle";

import { addCoupon } from "../../slices/CouponSlice";
import { fetchCoupons } from "../../slices/CouponSlice";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { successNotification } from "../notification";

import { errorNotification } from "../notification";

export default function AddCoupon() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    code: "",
    description: "",
    value: "",
    discountType: "",
    expirDate: "",
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
    setData({ ...data, [name]: value });
  };

  const handleAddCoupon = async () => {
    const response = await dispatch(addCoupon(data));

    if (response.payload.success) {
      setOpen(false);
      successNotification("Coupon Added Successfully");
      dispatch(fetchCoupons());
      setData({
        code: "",
        description: "",
        value: "",
        discountType: "",
        expirDate: "",
      });
    } else {
      errorNotification(response?.payload?.message);
    }
  };

  useEffect(() => {
    if (
      data.code.trim() === "" ||
      data.description.trim() === "" ||
      data.value.trim() === "" ||
      data.discountType.trim() === "" ||
      data.expirDate.trim() === ""
    ) {
      setDisableStatus(true);
    } else {
      setDisableStatus(false);
    }
  }, [
    data.code,
    data.description,
    data.value,
    data.discountType,
    data.expirDate,
  ]);

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
          fontSize: "16px",
          fontWeight: "bold",
        }}
        onClick={handleClickOpen}
      >
        Add Coupon
      </button>
      <Dialog
        open={open}
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
          ADD COUPON
        </DialogTitle>
        <DialogContent>
          <TextField
            InputLabelProps={{ shrink: true }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="code"
            label="Coupon Code"
            type="text"
            fullWidth
            variant="standard"
            value={data.code}
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
            value={data.description}
            onChange={handleOnChange}
          />
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="Discount Type"
            name="discountType"
            label="Discount Type"
            type="text"
            fullWidth
            variant="standard"
            value = {data.discountType}
            onChange={handleOnChange}
          /> */}
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              Discount Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              value={data.discountType}
              name="discountType"
              onChange={handleOnChange}
              label="Discount Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            margin="dense"
            id="value"
            name="value"
            label="Value"
            type="text"
            value={data.value}
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />
          <input
            name="expirDate"
            onChange={handleOnChange}
            value={data.expirDate}
            type="date"
            style={{
              border: "none",
              borderBottom: "1px solid",
              width: "100%",
              marginTop: "15px",
              outline: "none",
              padding: "10px 5px",
            }}
          />
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
              fontSize: "16px",
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
              fontSize: "16px",
              fontWeight: 700,
            }}
            disabled={disableStatus}
            onClick={handleAddCoupon}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
