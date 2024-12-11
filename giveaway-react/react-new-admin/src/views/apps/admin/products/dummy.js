/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardContent,
  Fab,
  Chip,
  Tooltip,
  TableSortLabel,
  MenuItem,
  FormControl,
  Switch
} from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { deleteProduct } from 'store/slices/product';

// assets
import Avatar from 'components/ui-component/extended/Avatar';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import { useDispatch, useSelector } from 'store';
import { getProducts, getCategories,statusChangeRequest } from 'store/slices/products';
import ProductAdd from './ProductAdd';
import ProductView from './ProductView';
import ProductUpdate from './ProductUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import { imgPath } from 'config';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| USER LIST STYLE 1 ||============================== //

const ProductList = () => {
  const { productData, loading, totalPages, categoryData } = useSelector((state) => state.products);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('');
  const [category, setCategory] = React.useState('select');

  React.useEffect(() => {
    dispatch(getProducts(search, searchCategory, page, limit));
  }, [status, search, searchCategory, page, limit,openAdd,openUpdate]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const onSearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      setSearch(e.target.value.trim());
      setPage(1);
      setLimit(10);
    }
  };

  const handleClickStatus = async (row) => {
    try {
      const data = {
        id: row?._id,
        status: row.status === 'published' ? 'unpublished' : 'active'
      };

      const res = await dispatch(statusChangeRequest(data));
      if (res?.success === true) {
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
        setStatus(!status);
      } else {
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
      dispatch(
        openSnackbar({
          open: true,
          message: 'Something went wrong. Please try again letar.',
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
  };

  const onCategorySearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      if(e.target.value==='select'){
        setSearchCategory('');
      }else{
        setSearchCategory(e.target.value);
      }
      setCategory(e.target.value)
      setPage(1);
      setLimit(10);
    }
  };

  // const handleRequestSort = (property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };
  const handleRequestSort = (property) => {
    let orderByProperty = property;
  if (property === 'category.name') {
    orderByProperty = 'category'; // Change orderByProperty to 'category'
  }
  const isAsc = orderBy === orderByProperty && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(orderByProperty);
};
  

  const sortedproductData = React.useMemo(() => {
    if (!orderBy) return productData;
  
    return [...productData].sort((a, b) => {
      let valueA = a[orderBy] || ''; // handle undefined or blank values
      let valueB = b[orderBy] || ''; // handle undefined or blank values
  
      // For sorting by category name, access the name property of the category object
      if (orderBy === 'category') {
        valueA = a.category.name;
        valueB = b.category.name;
      }
  
      if (order === 'asc') {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
      } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    });

    
    // if (!orderBy) return productData;

    // return [...productData].sort((a, b) => {
    //   const valueA = a[orderBy] || ''; // handle undefined or blank values
    //   const valueB = b[orderBy] || ''; // handle undefined or blank values

    //   if (order === 'asc') {
    //     return valueA.localeCompare(valueB, undefined, { numeric: true });
    //   } else {
    //     return valueB.localeCompare(valueA, undefined, { numeric: true });
    //   }
    // });
  }, [productData, orderBy, order]);

  const handleDeleteClick = async(row) => {
   const confirm = window.confirm("Are you sure, You want to delete this product");
   if(confirm){
// Delete course logic here
    const res = await dispatch(deleteProduct(row?._id));
    if(res){
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
    }
    setStatus(!status)
   }
    
  };

  const changeUpdate = (flag) => {
    setOpenUpdate(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  const changeAdd = (flag) => {
    setOpenAdd(false);
    if (flag === true) {
      setStatus(!status);
    }
  };
  const handleClickOpen = (row) => {
    setItem(row);
    setOpenUpdate(true);
  };
  const handleClickOpenView = (row) => {
    setItem(row);
    setOpenView(true);
  };
  React.useEffect(() => {
    dispatch(getCategories(''));
  }, []);
  return (
    <MainCard title="Product List" content={false}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1}>
              <OutlinedInput
                id="input-search-list-style1"
                placeholder="Search By Name"
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                  </InputAdornment>
                }
                size="small"
                defaultValue={search}
                onChange={onSearch}
              />
              <FormControl fullWidth>
                {/* <InputLabel id="category-label">Category</InputLabel> */}
                <Select
                  id="demo-simple-select"
                  // label="Category"
                  onChange={onCategorySearch}
                  name="category"
                  value={category || 'select'}
                  sx={{ width: '100%' }}
                >
                  <MenuItem value="select">Please Select Category</MenuItem>
                  {categoryData.map((option, index) => (
                    <MenuItem key={index} value={option?._id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Tooltip title="Add Product">
              <Fab color="primary" size="small" sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}>
                <AddIcon
                  fontSize="small"
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('slug')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'slug'}
                  direction={orderBy === 'slug' ? order : 'asc'}
                  onClick={() => handleRequestSort('slug')}
                >
                  Slug
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'} // Change 'category.name' to 'category'
                  onClick={() => handleRequestSort('category.name')}
                >
                Category
              </TableSortLabel>            
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={6} />
            ) : !sortedproductData || sortedproductData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={6} align="center">
                  No product found
                </TableCell>
              </TableRow>
            ) : (
              sortedproductData.length > 0 && sortedproductData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar src={`${imgPath}${row?.images[0]}`} />
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>{row?.slug}</TableCell>
                  <TableCell>{row?.category?.name}</TableCell>
                    <TableCell>
                    <Switch
                      checked={row.status === 'published' || row.status === 'unpublished'}
                      onChange={() => handleClickStatus(row)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <br />
                  
                    {row.status === 'published' || row.status === 'unpublished' ? (
                      <Chip
                        label="Enabled"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : (
                      <Chip
                        label="Disabled"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light + 60,
                          color: theme.palette.warning.dark
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Product" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <VisibilityTwoToneIcon
                            onClick={() => {
                              handleClickOpenView(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Product" key="1">
                        <IconButton color="secondary" className="custom-icon-button">
                          <EditTwoToneIcon
                            onClick={() => {
                              handleClickOpen(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product" key="1">
                      <IconButton color="primary" className="custom-icon-button">
                        <DeleteTwoToneIcon
                          onClick={() => {
                            handleDeleteClick(row);
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid item xs={12} sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Pagination count={totalPages} page={page} color="primary" onChange={handleChangePage} />
          </Grid>
          <Grid item>
            <Select
              labelId="demo-simple-select-label"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
              id="demo-simple-select"
              label="Age"
            >
              <MenuItem selected value={10}>
                Ten
              </MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
      {openUpdate && <ProductUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <ProductAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
      {openView && <ProductView item={item} open={openView} close={() => setOpenView(false)} />}
    </MainCard>
  );
};

export default ProductList;
