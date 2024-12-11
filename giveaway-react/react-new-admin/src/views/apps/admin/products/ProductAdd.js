/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unknown-property */
/* eslint-disable lines-around-directive */
/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  FormHelperText,
  MenuItem,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  InputLabel,
  FormControl,
  Fab,
  Tooltip
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addProductRequest, getCategories, productImages } from 'store/slices/products';
import { useDispatch, useSelector } from 'store';

import { openSnackbar } from 'store/slices/snackbar';
import CloseIcon from '@mui/icons-material/Close';

import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Avatar from 'components/ui-component/extended/Avatar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// import { FormattedMessage } from 'react-intl';
import '../../../../styles/extra.css';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const Product = ({ open, close }) => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state.products);
  const [selectedImages, setSelectedImages] = useState([]);
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Product name is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Product name must be at least 2 characters')
      .max(100, 'Product name must be at most 100 characters'),
    slug: yup
      .string()
      .required('Slug is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Slug be at least 2 characters')
      .max(50, 'Slug must be at most 50 characters'),
    description: yup
      .string()
      .required('Description is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Tags must be at least 2 characters')
      .max(250, 'Tags must be at most 250 characters'),
    tags: yup
      .string()
      .required('Tags is required')
      .test(
        'no-multi-spaces',
        'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.',
        (value) => {
          return value && /^[^\s]+(\s[^\s]+)*$/.test(value);
        }
      )
      .min(2, 'Tags must be at least 2 characters')
      .max(50, 'Tags must be at most 50 characters'),
    // discount: yup.string().required('discount is required'),
    category: yup.string().required('Category is required'),
    size: yup.array().of(yup.string().required('Size is required')),
    price: yup.array().of(yup.string().required('Price is required').notOneOf(['0'], 'Price cannot be zero')),
    stock: yup.array().of(yup.string().required('Stock is required').notOneOf(['0'], 'Stock cannot be zero')),
    images: yup.array().min(1, 'Image is required')
  });

  const initialValues = {
    name: '',
    slug: '',
    description: '',
    // short_description: '',
    category: '',
    tags: '',
    label: '',
    size: [''],
    price: [''],
    stock: [''],
    // discount: '',
    images: []
  };
  const onSubmit = async (values, { resetForm }) => {
    // console.log(values);
    if (values) {
      const duplicates = [];
      values?.size.forEach((value, index) => {
        if (values?.size.indexOf(value, index + 1) !== -1 && duplicates.indexOf(value) === -1) {
          duplicates.push(value);
        }
      });
      if (duplicates.length > 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Same size is already added',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
        return false;
      }
    }
    setLoading(true);
    if (values.images.length === 0) {
      formik.setFieldError('images', 'Please select atleaste one file');
      setLoading(false);
    } else {
      formik.setFieldError('images', '');
      const formData = new FormData();
      values.images.forEach((image) => {
        formData.append('image', image);
      });
      try {
        const res = await dispatch(productImages(formData));
        if (res?.success === true) {
          const arrImage = [];
          res.data.forEach((item) => {
            arrImage.push(item.path);
          });
          const array = [];
          for (let i = 0; i < values.size.length; i++) {
            array.push({
              image: '',
              price: values.price[i],
              stock: values.stock[i],
              attributes: [
                {
                  label: 'size',
                  value: values.size[i]
                }
              ]
            });
          }
          const data = {
            name: values.name,
            slug: values.slug,
            description: values.description,
            short_description: ' ',
            category: values.category,
            price: 0,
            stock: 0,
            images: arrImage,
            productType: 'variable_product',
            tags: values.tags,
            attributes: [
              {
                label: 'size',
                values: values.size
              }
            ],
            discount: null,
            // values.discount,
            variableProducts: array,
            metadata: {
              title: ' ',
              description: ' '
            }
          };
          // console.log('nishant', data);
          try {
            const res = await dispatch(addProductRequest(data));
            if (res?.success === true) {
              setLoading(false);
              resetForm();
              dispatch(
                openSnackbar({
                  open: true,
                  message: res?.message,
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false,
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                  }
                })
              );
              close(true);
            } else {
              setLoading(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: res?.message,
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  },
                  close: false,
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                  }
                })
              );
            }
          } catch (error) {
            setLoading(false);
            dispatch(
              openSnackbar({
                open: true,
                message: error,
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false,
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right'
                }
              })
            );
          }
        } else {
          setLoading(false);
          dispatch(
            openSnackbar({
              open: true,
              message: res?.message,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: false,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            })
          );
        }
      } catch (error) {
        setLoading(false);
        dispatch(
          openSnackbar({
            open: true,
            message: error,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema
  });

  // const handleImageChange = (event) => {
  //   if (event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const fileName = file.name;
  //     const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
  //     const isValidType = allowedTypes.includes(file.type);
  //     if (!isValidType) {
  //       formik.setFieldError('images', 'Invalid file type. Please select a PNG, JPEG, or GIF file');
  //       return;
  //     }
  //     if (selectedImages.length === 5) {
  //       formik.setFieldError('images', 'Maximum 5 images are allowed');
  //       return;
  //     }

  //     const imageUrl = URL.createObjectURL(file);
  //     const isDuplicate = selectedImages.some((image) => image.name === fileName);
  //     if (!isDuplicate) {
  //       setSelectedImages((prevImages) => [...prevImages, { url: imageUrl, name: fileName }]);
  //       formik.setFieldValue('images', [...formik.values.images, file]);
  //       formik.setFieldError('images', '');
  //     }
  //   }
  // };
  // const handleImageChange = (event) => {
  //   if (event.target.files.length > 0) {
  //     const files = Array.from(event.target.files);
  //     const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
  //     const isValidFiles = files.every((file) => allowedTypes.includes(file.type));
  //     if (!isValidFiles) {
  //       formik.setFieldError('images', 'Invalid file type. Please select PNG, JPEG, or GIF files only.');
  //       return;
  //     }
  //     if (selectedImages.length + files.length > 5) {
  //       formik.setFieldError('images', 'Maximum 5 images are allowed.');
  //       return;
  //     }

  //     const newImages = files
  //       .filter((file) => {
  //         const fileName = file.name;
  //         const isDuplicate = selectedImages.some((image) => image.name === fileName);
  //         return !isDuplicate;
  //       })
  //       .map((file) => ({
  //         url: URL.createObjectURL(file),
  //         name: file.name
  //       }));

  //     setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  //     formik.setFieldValue('images', [...formik.values.images, ...newImages.map((image) => image.file)]);
  //     formik.setFieldError('images', '');
  //   }
  // };

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const isValidFiles = files.every((file) => allowedTypes.includes(file.type));
      if (!isValidFiles) {
        formik.setFieldError('images', 'Invalid file type. Please select PNG, JPEG, or GIF files only.');
        return;
      }
      if (selectedImages.length + files.length > 5) {
        formik.setFieldError('images', 'Maximum 5 images are allowed.');
        return;
      }

      const newImages = files.filter((file) => {
        const fileName = file.name;
        const isDuplicate = selectedImages.some((image) => image.name === fileName);
        return !isDuplicate;
      });

      const updatedImages = [
        ...selectedImages,
        ...newImages.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name
        }))
      ];

      setSelectedImages(updatedImages);

      formik.setFieldValue('images', [...formik.values.images, ...newImages]);
      formik.setFieldError('images', '');
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue('images', updatedImages);
  };

  useEffect(() => {
    formik.setFieldValue('imageInputRef', imageInputRef.current);
  }, [imageInputRef]);

  React.useEffect(() => {
    dispatch(getCategories(''));
  }, []);
  const handleAddField = () => {
    formik.setValues({
      ...formik.values,
      size: [...formik.values.size, ''], // Push an empty string into the size array
      price: [...formik.values.price, ''], // Push an empty string into the price array
      stock: [...formik.values.stock, ''] // Push an empty string into the stock array
    });
  };

  const handleRemoveField = (index) => {
    formik.setValues({
      ...formik.values,
      size: formik.values.size.filter((_, i) => i !== index), // Remove element at index from size array
      price: formik.values.price.filter((_, i) => i !== index), // Remove element at index from price array
      stock: formik.values.stock.filter((_, i) => i !== index) // Remove element at index from stock array
    });
  };
  const handleKeyDown = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([38, 40, 189, 110, 190, 109].includes(keyCode)) {
      event.preventDefault();
    }
  };
  const handleKeyDownDecimal = (event) => {
    const keyCode = event.keyCode || event.which;
    if ([38, 40, 189, 109].includes(keyCode)) {
      event.preventDefault();
    }
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth="true"
      maxWidth="md"
      aria-describedby="alert-dialog-slide-description"
    >
      <form onSubmit={formik.handleSubmit} id="validation-forms">
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              Add Product
            </Grid>
            <Grid item xs={6}>
              <IconButton
                color="inherit"
                onClick={() => {
                  close(false);
                }}
                aria-label="close"
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid container spacing={2} alignItems="center" xs="12">
                    {selectedImages.map((image, index) => (
                      <Grid item key={index}>
                        <Avatar src={image.url} sx={{ height: 120, width: 120, borderRadius: '8px' }} />
                        <IconButton onClick={() => handleRemoveImage(index)} color="error">
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item sm zeroMinWidth>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Label for the file input */}
                          <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span">
                              Upload Images
                            </Button>
                          </label>
                          {/* Actual file input with style display: 'none' */}
                          <input
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                            ref={imageInputRef}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">
                          <ErrorTwoToneIcon sx={{ height: 16, width: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                          Image size Limit should be 2048kb Max
                        </Typography>
                        <br />
                        <Typography variant="caption" style={{ color: 'red' }}>
                          {formik.touched.images && formik.errors.images && formik.errors.images}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  id="discount"
                  name="discount"
                  label="Discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.discount && Boolean(formik.errors.discount)}
                  helperText={formik.touched.discount && formik.errors.discount}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{
                    type: 'number',
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { appearance: 'textfield', width: '100%' }
                  }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  id="slug"
                  name="slug"
                  label="Slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="tags"
                  name="tags"
                  label="Tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tags && Boolean(formik.errors.tags)}
                  helperText={formik.touched.tags && formik.errors.tags}
                  fullWidth
                  autoComplete="given-name"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                  <Select
                    id="demo-simple-select"
                    name="category"
                    value={formik.values.category || 'select'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="select" disabled>
                      Please Select
                    </MenuItem>
                    {categoryData.map((option, index) => (
                      <MenuItem key={index} value={option?._id}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category && <FormHelperText>{formik.errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} sm={12}>
                <TextField
                  id="short_description"
                  name="short_description"
                  label="Short Description"
                  value={formik.values.short_description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.short_description && Boolean(formik.errors.short_description)}
                  helperText={formik.touched.short_description && formik.errors.short_description}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 250 }}
                  rows={4}
                  multiline
                />
                <span style={{ float: 'right' }}>{formik?.values?.short_description?.length} / 250</span>
              </Grid> */}
              <Grid item xs={12} sm={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                  autoComplete="family-name"
                  inputProps={{ maxLength: 250 }}
                  rows={4}
                  multiline
                />
                <span style={{ float: 'right' }}>{formik?.values?.description?.length} / 250</span>
              </Grid>
              {formik.values.size.map((sizeField, index) => (
                <>
                  {/* <Grid item xs={12} sm={3}>
                    <TextField
                      id={`size.${index}`}
                      name={`size.${index}`}
                      label={`Size ${index + 1}`}
                      value={formik.values.size[index] || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ maxLength: 2 }}
                      error={formik.touched.size && formik.touched.size[index] && Boolean(formik.errors.size && formik.errors.size[index])}
                      helperText={formik.touched.size && formik.touched.size[index] && formik.errors.size && formik.errors.size[index]}
                      fullWidth
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth error={formik.touched.size && Boolean(formik.errors.size && formik.errors.size[index])}>
                      <InputLabel id={`size-label-${index}`}>{`Size ${index + 1}`}</InputLabel>
                      <Select
                        id={`demo-simple-select-${index}`}
                        name={`size.${index}`}
                        label={`Size ${index + 1}`}
                        value={formik.values.size[index] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ width: '100%' }}
                        error={
                          formik.touched.size && formik.touched.size[index] && Boolean(formik.errors.size && formik.errors.size[index])
                        }
                        helperText={
                          formik.touched.stock && formik.touched.stock[index] && formik.errors.stock && formik.errors.stock[index]
                        }
                        fullWidth
                      >
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="XXXL">XXXL</MenuItem>
                      </Select>
                      {formik.touched.size && formik.errors.size && (
                        <FormHelperText sx={{ color: 'red' }}>{formik.errors.size[index]}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12} sm={3}>
                    <FormControl fullWidth error={formik.touched.size && Boolean(formik.errors.size && formik.errors.size[index])}>                     
                      <Select
                        id="demo-simple-select"
                        labelId={`size-label-${index}`}
                        // id={`size.${index}`}
                        name={`size.${index}`}
                        value={formik.values.size[index] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.size && formik.touched.size[index] && Boolean(formik.errors.size && formik.errors.size[index])
                        }
                        helperText={formik.touched.stock && formik.touched.stock[index] && formik.errors.stock && formik.errors.stock[index]}
                        fullWidth
                      >
                        <MenuItem value="select" disabled>
                          Please Select
                        </MenuItem>
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="XXXL">XXXL</MenuItem>
                      </Select>
                      {formik.touched.size && formik.errors.size && <FormHelperText>{formik.errors.size[index]}</FormHelperText>}
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12} sm={4}>
                    <TextField
                      id={`stock.${index}`}
                      name={`stock.${index}`}
                      label={`Stock ${index + 1}`}
                      value={formik.values.stock[index]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{
                        maxLength: 4,
                        type: 'number',
                        inputMode: 'numeric',
                        onKeyDown: handleKeyDown,
                        pattern: '[0-9]*',
                        style: { appearance: 'textfield', width: '100%' }
                      }}
                      error={
                        formik.touched.stock && formik.touched.stock[index] && Boolean(formik.errors.stock && formik.errors.stock[index])
                      }
                      helperText={formik.touched.stock && formik.touched.stock[index] && formik.errors.stock && formik.errors.stock[index]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id={`price.${index}`}
                      name={`price.${index}`}
                      label={`Price ${index + 1}`}
                      value={formik.values.price[index]}
                      onChange={(e) => {
                        const { value } = e.target;
                        // Check if the value contains more than 2 decimal places
                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                          // If the value is valid, update the state
                          formik.handleChange(e);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      inputProps={{
                        type: 'number',
                        inputMode: 'numeric',
                        onKeyDown: handleKeyDownDecimal,
                        pattern: '[0-9]*',
                        style: { appearance: 'textfield', width: '100%' }
                      }}
                      error={
                        formik.touched.price && formik.touched.price[index] && Boolean(formik.errors.price && formik.errors.price[index])
                      }
                      helperText={formik.touched.price && formik.touched.price[index] && formik.errors.price && formik.errors.price[index]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    {formik.values.size.length > 1 && (
                      <Tooltip title="Remove Size">
                        <Fab color="error" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}>
                          <RemoveIcon
                            fontSize="small"
                            onClick={() => {
                              handleRemoveField(index);
                            }}
                          />
                        </Fab>
                      </Tooltip>
                    )}
                  </Grid>
                </>
              ))}
            </Grid>
            <Grid item xs={12} sm={12} sx={{ textAlign: 'right', mr: 1 }}>
              <Tooltip title="Add More Sizes">
                <Fab color="primary" size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
                  <AddIcon
                    fontSize="small"
                    onClick={() => {
                      handleAddField();
                    }}
                  />
                </Fab>
              </Tooltip>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              {/* <AnimateButton> */}
              <Button disabled={loading} variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {loading ? (
                  <>
                    <CircularProgress color="primary" />
                    &nbsp;Loading ...
                  </>
                ) : (
                  'Add Product'
                )}
              </Button>
              {/* </AnimateButton> */}
            </Stack>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Product;
