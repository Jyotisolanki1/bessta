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
  Chip,
  TableSortLabel,
  MenuItem,

} from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';

import { useDispatch, useSelector } from 'store';
import { getCourses, getCategories, deleteCourse } from 'store/slices/courses';
import CourseAdd from './CourseAdd';
import VideoPlay from './VideoPlay';
import CourseUpdate from './CourseUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';
import { IconSearch } from '@tabler/icons-react';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'next/navigation'
// ==============================|| USER LIST STYLE 1 ||============================== //

const CourseList = () => {
  const { courseData, loading, totalPages } = useSelector((state) => state.courses);

  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(100);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openVideo, setOpenVideo] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [url, setUrl] = React.useState('');

  const searchParams = useSearchParams()
 
  const searchCategory = searchParams.get('category');



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
          <Grid item xs={12} sm={12}  sx={{ textAlign: 'right' }}>
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
            </Stack>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openVideo && <VideoPlay url={url} open={openVideo} close={() => setOpenVideo(false)} />}
      {openUpdate && <CourseUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <CourseAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </MainCard>
  );
};

export default CourseList;
