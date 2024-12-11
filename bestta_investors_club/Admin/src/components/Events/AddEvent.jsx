import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";

import { addDraw } from "../../slices/Draw";
import { useSelector, useDispatch } from "react-redux";
import { fetchDraws } from "../../slices/Draw";
import { errorNotification, successNotification } from "../notification";


import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";

export default function AddEvent() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    scheduleDate: "",
    prize: [],
    quantity: "",
    reserves: "",
    description: "",
    // "prizes": [{ "quantity": 1, "reserves": 1, "description": "$1000" }],
  });



  const dispatch = useDispatch();

  const [image, setImage] = useState("");

  const [disableStatus, setDisableStatus] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // "name": "",
  // "scheduleDate": "",
  // "discription": "",
  // "prizes": [{ "quantity": 1, "reserves": 1, "description": "$1000" }],
  // "image": ""

  const handleAddEvent = async () => {
    
    
    const prizesArr = data?.prize?.map((each) => {
      console.log(each)
      return  {
        quantity: data.quantity,
        reserves: data.reserves,
        description: each,
      }
    })

   
    const formData = new FormData();
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

    console.log(formData.getAll("prizes"));
    const res = await dispatch(addDraw(formData));
    console.log(res, "cje");
    if (res.payload.success) {
      dispatch(fetchDraws());
      setData({
        name: "",
        scheduleDate: "",
        prize: "",
        quantity: "",
        reserves: "",
        description: "",
      });
      successNotification("Event Added Successfully");
      setOpen(!open);
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

  useEffect(() => {
    if (
      data.name.trim() === "" ||
      data.scheduleDate.trim() === "" ||
      data.prize.length === 0 ||
      data.quantity.trim() === "" ||
      data.reserves.trim() === "" ||
      data.description.trim() === ""
    ) {
      setDisableStatus(true);
    } else {
      setDisableStatus(false);
    }
  }, [
    data.name,
    data.scheduleDate,
    data.prize,
    data.quantity,
    data.reserves,
    data.description,
  ]);

  const minDate = new Date();

 

  const handlePrizes = (items) => {
    
    setData({ ...data, "prize": items });
  }

  
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
        Add Event
      </button>
      <Dialog
        open={open}
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
          ADD EVENT{" "}
        </DialogTitle>
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
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate.toISOString().split("T")[0] }}
            onChange={handleOnChange}
            value={data.scheduleDate}
            variant="standard"
          />
          {/* <DatePicker
            label="Date"
            slotProps={{ textField: { variant: "filled" } }}
          /> */}
         
          <Stack spacing={3}>
            <Autocomplete
              multiple
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
              fontWeight: "bold",
            }}
            disabled={disableStatus}
            onClick={handleAddEvent}
          >
            Add Event
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
