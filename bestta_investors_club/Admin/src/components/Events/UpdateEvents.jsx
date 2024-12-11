import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

import { addDraw } from "../../slices/Draw";
import { useSelector, useDispatch } from "react-redux";
import { fetchDraws } from "../../slices/Draw";
import { updateDraw } from "../../slices/Draw";
import { errorNotification, successNotification } from "../notification";

import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";


export default function UpdateEvent(props) {
  // console.log(props, "props trigerring");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: props.updateData.name,
    scheduleDate: props.updateData.scheduleDate,
    prize: props.updateData.prize,
    quantity: props.updateData.quantity,
    reserves: props.updateData.reserves,
    description: props.updateData.discription,
    // "prizes": [{ "quantity": 1, "reserves": 1, "description": "$1000" }],
  });

  const dispatch = useDispatch();

  const [image, setImage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setShowDialog(false);
  };

  const handleUpdateEvent = async () => {
    // console.log(data, "data")
    const prizesArr = data?.prize?.map((each) => {
  
      return  {
        quantity: data.quantity,
        reserves: data.reserves,
        description: each,
      }
    })

    const formData = new FormData();
    formData.append("id", props.updateData._id);
    formData.append("name", data.name);
    formData.append("scheduleDate", data.scheduleDate);
    formData.append("discription", data.description);
    formData.append("image", image);
    //  formData.append("prizes",JSON.stringify(prizesArr))
    prizesArr.forEach((person, index) => {
      formData.append(`prizes[${index}][quantity]`, person.quantity);
      formData.append(`prizes[${index}][reserves]`, person.reserves);
      formData.append(`prizes[${index}][description]`, person.description);
    });

    const res = await dispatch(updateDraw(formData));

    if (res.payload.success) {
      dispatch(fetchDraws());
      props.setShowDialog(false);
      successNotification("Event Updated Successfully");
    } else {
      errorNotification(res?.payload?.message);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };


  const handlePrizes = (items) => {
    console.log(items)
    setData({ ...data, "prize": items });
  }

  const minDate = new Date();

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
       Update Event
      </Button> */}
      <Dialog open={props.showDialog} onClose={handleClose}  maxWidth={'sm'} fullWidth aria-labelledby="customized-dialog-title">
        <DialogTitle sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
          }}
          id="customized-dialog-title">UPDATE EVENT </DialogTitle>
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
            value={data.name}
            fullWidth
            variant="standard"
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
            multiline
            onChange={handleOnChange}
            value={data.description}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="date"
            name="scheduleDate"
            label=""
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate.toISOString().split("T")[0] }}
            onChange={handleOnChange}
            value={data.scheduleDate}
            variant="standard"
          />
        
          <Stack spacing={3}>
            <Autocomplete
              multiple
              value = {data.prize}
              onChange={(e, value) => handlePrizes(value)}
              options={[]}
              // defaultValue={}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Prize Money"
                  sx={{ backgrounColor: "#fff !important" }}
                />
              )}
            />
          </Stack>
          <TextField
            autoFocus
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={data.quantity}
            onChange={handleOnChange}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="Reserves"
            name="reserves"
            label="Reserves"
            type="number"
            fullWidth
            onChange={handleOnChange}
            variant="standard"
            value={data.reserves}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="event banner"
            name="image"
            label="Event Banner"
            type="file"
            fullWidth
            variant="standard"
            onChange={handleFile}
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
            onClick={handleClose}
          >
            Cancel
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
            onClick={handleUpdateEvent}
          >
            Update Event
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
