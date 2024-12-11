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
  FormControl
} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import Avatar from 'components/ui-component/extended/Avatar';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { useDispatch, useSelector } from 'store';
import { getCourses, getCategories, deleteCourse } from 'store/slices/courses';
import CourseAdd from './CourseAdd';
import VideoPlay from './VideoPlay';
import CourseUpdate from './CourseUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/AddTwoTone';
import { openSnackbar } from 'store/slices/snackbar';
// ==============================|| USER LIST STYLE 1 ||============================== //

const CourseList = () => {
  const { courseData, loading, totalPages, categoryData } = useSelector((state) => state.courses);

  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openVideo, setOpenVideo] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  // const [id, setId] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('');
  const [category, setCategory] = React.useState('select');

  React.useEffect(() => {
    dispatch(getCourses(search, searchCategory, page, limit));
  }, [status, search, searchCategory, page, limit, openUpdate, openAdd, dispatch]);

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

  const onCategorySearch = (e) => {
    if (e.target.value.trim().length > 2 || e.target.value.trim().length === 0) {
      if (e.target.value === 'select') {
        setSearchCategory('');
      } else {
        setSearchCategory(e.target.value);
      }
      setCategory(e.target.value);
      setPage(1);
      setLimit(10);
    }
  };

  const handleRequestSort = (property) => {
    let orderByProperty = property;
    if (property === 'category.name') {
      // If sorting by category name, set orderByProperty to 'category' since it's an object
      orderByProperty = 'category';
    }
    const isAsc = orderBy === orderByProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(orderByProperty);
  };

  const sortedcourseData = React.useMemo(() => {
    if (!orderBy) return courseData;

    return [...courseData].sort((a, b) => {
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
  }, [courseData, orderBy, order]);

  const handleDeleteClick = async (row) => {
    const confirm = window.confirm('Are you sure, You want to delete this course?');
    if (confirm) {
      // Delete course logic here
      const res = await dispatch(deleteCourse({ id: row._id }));
      if (res) {
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
      setStatus(!status);
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
  const playVideo = (url) => {
    setOpenVideo(true);
    setUrl(url);
  };
  React.useEffect(() => {
    dispatch(getCategories(''));
  }, []);
  return (
    <MainCard title="Course List" content={false}>
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
            <Tooltip title="Add Course">
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
              <TableCell onClick={() => handleRequestSort('name')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('video')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'video'}
                  direction={orderBy === 'video' ? order : 'asc'}
                  onClick={() => handleRequestSort('video')}
                >
                  Video
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => handleRequestSort('videoType')} sx={{ cursor: 'pointer' }}>
                <TableSortLabel
                  active={orderBy === 'videoType'}
                  direction={orderBy === 'videoType' ? order : 'asc'}
                  onClick={() => handleRequestSort('videoType')}
                >
                  Video Type
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
            <TableCell>
            <TableSortLabel
              active={orderBy === 'Instructor'}
              direction={orderBy === 'Instructor' ? order : 'asc'} // Change 'category.name' to 'category'
              onClick={() => handleRequestSort('Instructor')}
            >
            Instructor
          </TableSortLabel>            
        </TableCell>
              <TableCell sx={{ cursor: 'pointer' }}>
                Status
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <Skeleten count={8} />
            ) : !sortedcourseData || sortedcourseData.length === 0 ? (
              <TableRow hover>
                <TableCell colSpan={8} align="center">
                  No course found
                </TableCell>
              </TableRow>
            ) : (
              sortedcourseData.length > 0 &&
              sortedcourseData.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{index + 1 + (page * limit - limit)}</TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={row?.video}
                      size="small"
                      sx={{
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                        color: theme.palette.success.dark
                      }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        playVideo(row?.video);
                      }}
                      title="Click to play video"
                    />
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{row?.videoType.replace(/t/g, 'T')}</TableCell>
                  <TableCell>{row?.category?.name}</TableCell>
                  <TableCell>{row?.instructor || 'N/A'}</TableCell>

                  <TableCell>
                    {row.status === 'active' || row.status === 'enabled' ? (
                      <Chip
                        label="Enable"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light + 60,
                          color: theme.palette.success.dark
                        }}
                      />
                    ) : row.status === 'inactive' || row.status === 'disabled' ? (
                      <Chip
                        label="Disable"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }}
                      />
                    ) : (
                      <Chip
                        label="N/A"
                        size="small"
                        sx={{
                          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light + 60,
                          color: theme.palette.orange.dark
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 3, width: '50px' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Delete Course" key="1">
                        <IconButton color="primary" className="custom-icon-button">
                          <DeleteTwoToneIcon
                            onClick={() => {
                              handleDeleteClick(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Course" key="1">
                        <IconButton color="secondary" className="custom-icon-button">
                          <EditTwoToneIcon
                            onClick={() => {
                              handleClickOpen(row);
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
      {openVideo && <VideoPlay url={url} open={openVideo} close={() => setOpenVideo(false)} />}
      {openUpdate && <CourseUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <CourseAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default CourseList;
