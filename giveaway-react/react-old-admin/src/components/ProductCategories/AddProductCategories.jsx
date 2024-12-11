import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useDispatch } from "react-redux";
import {
  addProductCategories,
  fetchProductCategories,
} from "../../slices/ProductCategorySlice";

import { successNotification } from "../notification";
import { errorNotification } from "../notification";

import { useState ,useEffect } from "react";


export default function AddProductCategory() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    slug: "",
    icon: "",
    tags: "",
  });

  const [disableStatus , setDisableStatus] = useState(true)

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

  const handleFile = (e) => {
    const { name, files } = e.target;
    setData({ ...data, [name]: files[0] });
  };

  const handleAddProductCategory = async () => {
    console.log(data, "data");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("icon", data.icon);
    formData.append("tags", data.tags);

    const response = await dispatch(addProductCategories(formData));
    console.log(response, "mm");
    if (response.payload.success) {
      setOpen(false);
      successNotification("Product Category Added Successfully")
      setData({
        name: "",
        slug: "",
        icon: "",
        tags: "",
      })
      dispatch(fetchProductCategories());
    }else{
      errorNotification(response?.payload?.message)
    }
  };


  useEffect(() => {
    
    if(data.name === "" ||
    data.slug === "" ||
    data.icon === "" ||
    data.tags === "" ){
          setDisableStatus(true)
    }else{
        setDisableStatus(false)
    }
  },[data.name , data.slug,data.icon,data.tags])

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
        Add Product Category
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
          id="customized-dialog-title">ADD PRODUCT CATEGORY</DialogTitle>
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
            value={data.name}
            onChange={handleOnChange}
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="slug"
            name="slug"
            label="Slug"
            type="text"
            fullWidth
            variant="standard"
            value={data.slug}
            onChange={handleOnChange}
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="icon"
            name="icon"
            label="Icon"
            type="file"
            fullWidth
            variant="standard"
            onChange={handleFile}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="tags"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            variant="standard"
            value={data.tags}
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <button    style={{
              backgroundColor: "#13375b",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
            }} onClick={handleClose}>Cancel</button>
          <button    style={{
              backgroundColor:disableStatus? "grey": "#13375b",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
            }} 
            disabled = {disableStatus}
            onClick={handleAddProductCategory}>Add</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
