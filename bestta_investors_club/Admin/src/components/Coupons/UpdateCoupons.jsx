import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";

import DatePicker from "react-date-picker";

import { useState } from "react";

import { useDispatch } from "react-redux";
import { fetchCoupons } from "../../slices/CouponSlice";
import { updateCoupon } from "../../slices/CouponSlice";
import { errorNotification, successNotification } from "../notification";

export default function UpdateCoupons(props) {
  const dispatch = useDispatch();

  const { updateData } = props;
  const [data, setData] = useState({
    id: updateData._id,
    code: updateData.code,
    description: updateData.description,
    value: updateData.value,
    discountType: updateData.discountType,
    expirDate: updateData.expirDate,
  });

  const handleClose = () => {
    props.setShowDialog(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleUpdateData = async () => {
    console.log(data);
    const response = await dispatch(updateCoupon(data));
    console.log(response, "from update data");
    if (response.payload.success) {
      dispatch(fetchCoupons());
      successNotification("Updated Coupon Details");
      props.setShowDialog(false);
    } else {
      errorNotification(response?.payload?.message);
    }
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
              textAlign: "left",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#13375b",
            }}
            id="customized-dialog-title"
          >
            UPDATE COUPON
          </DialogTitle>
          <DialogContent >
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="code"
            label="Course Name"
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
          <TextField
            autoFocus
            required
            margin="dense"
            id="Discount Type"
            name="Discount Type"
            label="Discount Type"
            type="text"
            fullWidth
            variant="standard"
            value={data.discountType}
            onChange={handleOnChange}
          />
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
              fontSize: "!6px",
              fontWeight: "bold",
            }}
            onClick={handleUpdateData}
          >
            Update
          </button>
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
            Ignore
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
