import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch, useSelector } from "react-redux";
// import { addProduct } from "../slices/storeSlice";
import { fetchProducts, imageApi } from "../../slices/ProductSlice";
import { useState, useEffect } from "react";

import { fetchProductCategories } from "../../slices/ProductCategorySlice";
import { addProducts } from "../../slices/ProductSlice";

import { successNotification } from "../notification";
import { errorNotification } from "../notification";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

function Chips({ eachItem, handleFilter ,setProductInfos}) {
  const handleClick = (size,price,stock) => {
    // console.info("You clicked the Chip.");
    setProductInfos({
      size,
      price,
      stock,
    })
  };

  const handleDelete = (sizes) => {
    // console.info("You clicked the delete icon.");
    handleFilter(sizes);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ marginBottom: "15px", marginTop: "10px" }}
    >
      <Chip
        label={`Size - ${eachItem.size} Price - ${eachItem.price} Stock - ${eachItem.stock}`}
        onClick={() => handleClick (eachItem.size,eachItem.price,eachItem.stock)}
        onDelete={() => handleDelete(eachItem.size)}
      />
    </Stack>
  );
}

export default function AddProduct() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const [disableStatus,setDisableStatus] = useState(true)

  const [images, setImages] = useState([]);

  const [addItemDisableStatus , setAddItemDisableStatus] = useState(true)

  const { ProductCategories } = useSelector(
    (state) => state.ProductCategorySlice
  );

  useEffect(() => {
    if(data.name.trim() === '' || data.slug.trim() === '' || data.description.trim() === '' || data.category.trim() === ''){
          setDisableStatus(true)
    }else{
      setDisableStatus(false)
    }
  },[data.name,data.slug,data.description,data.category])

  const [productInfos, setProductInfos] = useState({
    size: "",
    price: "",
    stock: "",
  });

  // ['S','M','L','XL','XXL']

  useEffect(() => {
    if(productInfos.size.trim() === '' || productInfos.price.trim() === '' || productInfos.stock.trim() === ''){
          setAddItemDisableStatus(true)
    }else{
          setAddItemDisableStatus(false)
    }
  },[productInfos.size,productInfos.price,productInfos.stock])

  const [sizeArray, setSizeArray] = useState("");

  const [productArray, setProductArray] = useState([]);

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

  const handleAddProduct = async () => {
    // Data
    //  console.log(data , "afetr")

    const variableProducts = productArray.map((each) => {
      return {
        image: images[0],
        price: each.price,
        stock: each.stock,
        attributes: [
          {
            label: "size",
            value: each.size,
          },
        ],
      };
    });



    const dataFormmatter = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      short_description: " ",
      category: data.category,
      price: 0,
      stock: 0,
      images: images,
      productType: "variable_product",
      tags: ["tshirt", "Hoodie"],
      attributes: [
        {
          label: "size",
          values: ["S", "M", "L", "XL", "2XL", "3XL"],
        },
      ],
      discount: null,
      variableProducts: variableProducts,
      metadata: {
        title: "Bessta+ OG Black T-Shirt",
        description: "Bessta+ OG Black T-Shirt",
      },
    };

    const res = await dispatch(addProducts(dataFormmatter));
    console.log(res);
    if (res.payload.success) {
      setOpen(!open);
      successNotification("Product Added Successfully")
      setProductArray([])
      dispatch(fetchProducts());
    }else{
      errorNotification(res?.payload?.message)
    }
  };

  const handleSizeOnChnage = (e) => {
    setSizeArray([...sizeArray, e.target.value]);
  };

  // console.log(sizeArray, "chekc array")

  const handleSize = (e) => {
    const { name, value } = e.target;
    if (sizeArray.includes(value)) {
      setProductInfos({ ...productInfos, [name]: value });
    } else {
      setSizeArray([...sizeArray, value]);
      setProductInfos({ ...productInfos, [name]: value });
    }
  };

  const handlePrice = (e) => {
    const { name, value } = e.target;
    setProductInfos({ ...productInfos, [name]: value });
  };

  const handleStock = (e) => {
    const { name, value } = e.target;
    setProductInfos({ ...productInfos, [name]: value });
  };

  const handleAddItem = () => {
    if (productArray.length > 0) {
      const filteredPro = productArray.filter(
        (eachItem) => eachItem.size !== productInfos.size
      );

      // console.log(filteredPro, "hdhdhhd")

      // const fil = productArray.filter((eachItem) => {
      //   if(eachItem.size === productInfos.size){
      //           eachItem.size = productInfos.size
      //           eachItem.price = productInfos.price
      //           eachItem.stock = productInfos.stock 

      //           return eachItem
      //   }else{
      //           return eachItem 
      //   }
      // })

      // console.log(fil , "Check for ")
      // console.log([...fil ])

      setProductArray([...filteredPro, productInfos]);
     
      setProductInfos({ size: "", price: "", stock: "" });
    } else {
      setProductArray([...productArray, productInfos]);
      setProductInfos({ size: "", price: "", stock: "" });
    }
  };

  const handleFilter = (size) => {
    const filterArray = productArray.filter(
      (eachItem) => eachItem.size !== size
    );
    setProductArray(filterArray);
  };

  const handleFile = async (e) => {
    // const fileData = new FormData()
    // const data = e.target.files[0]
    // fileData.append("image" , data)
    const fileData = new FormData();
    const data = e.target.files;

    for (let i = 0; i < data?.length; i++) {
      fileData.append("image", data[i]);
    }
    const res = await dispatch(imageApi(fileData));
    const filterImagesArray = res?.payload?.data.map((each) => each.path);
    setImages([...images, ...filterImagesArray]);
    // setData(images:res?.payload?.data})
  };

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, []);

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
          // textTransform:"none"
        }}
        onClick={handleClickOpen}
      >
        Add Product
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{
            backgroundColor: "#E0F0FA;",
            m: 0,
            p: 2,
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#13375b",
            
          }}
          id="customized-dialog-title">ADD PRODUCT</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="product name"
            type="text"
            fullWidth
            variant="standard"
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
            onChange={handleOnChange}
          />

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              // value={age}
              name="category"
              onChange={handleOnChange}
              label="category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ProductCategories &&
                ProductCategories?.data?.length > 0 &&
                ProductCategories.data.map((each) => (
                  <MenuItem value={each._id}>{each.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="description"
            label="product description"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />
          <div style={{ marginTop: "5px" }}>
            <input
              multiple
              style={{
                borderBottom: "1px solid grey",
                width: "100%",
                marginTop: "10px",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
              type="file"
              onChange={handleFile}
            />
          </div>
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              Sizes
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="category"
              value={productInfos.size}
              name="size"
              onChange={handleSize}
              label="sizes"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="price"
            label="price"
            type="number"
            fullWidth
            variant="standard"
            onChange={handlePrice}
            value={productInfos.price}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="stock"
            label="stock"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleStock}
            value={productInfos.stock}
          />
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="file"
            name="image"
            label="image"
            type="file"
            fullWidth
            multiple
            variant="standard"
          /> */}

          <button
            onClick={handleAddItem}
            style={{
              color: "#fff",
              backgroundColor:addItemDisableStatus ? "grey": "#13375b",
              width: "100%",
              padding: "10px 20px",
              borderRadius: "5px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            disabled = {addItemDisableStatus}
          >
            Add Size
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            {productArray.length > 0
              ? productArray.map((eachItem, index) => (
                  <Chips
                    eachItem={eachItem}
                    handleFilter={handleFilter}
                    key={index}
                    setProductInfos = {setProductInfos}
                  />
                ))
              : ""}
          </div>
        </DialogContent>
        <DialogActions>
          <button  style={{
              backgroundColor: "#13375b",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "10px 20px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
            }}  onClick={handleClose}>Cancel</button>
          <button style={{
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
            onClick={handleAddProduct}>Add Product</button>
          {/* <Button onClick = {handleAddItem}>Add Item</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
