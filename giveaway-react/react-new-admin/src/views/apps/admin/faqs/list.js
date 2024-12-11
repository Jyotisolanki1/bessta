/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-else-return */
/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
'use client';

import React, { useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/AddTwoTone';
import FaqAdd from './faqAdd';
import { Stack, Grid, CardContent, Fab, Tooltip } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { deleteFaq ,getFaqs} from 'store/slices/faqs';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useDispatch, useSelector } from 'store';
// import { getFaqs } from 'store/slices/faqs';

import FaqUpdate from './faqUpdate';
// import { FormattedMessage } from 'react-intl';
import Skeleten from '../../../../utils/skeleten';
import '../../../../styles/extra.css';

// ==============================|| USER LIST STYLE 1 ||============================== //

const FaqsList = () => {
  const { faqsData, loading } = useSelector((state) => state.faqs);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const [status, setStatus] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [search, setSearch] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('');
  const [opendelete,setOpenDelete] = React.useState(false);
  const [category, setCategory] = React.useState('select');

  const itemRefs = useRef([]);

  React.useEffect(() => {
    dispatch(getFaqs());
  }, [status,opendelete]);

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
      orderByProperty = 'category';
    }

    const isAsc = orderBy === orderByProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(orderByProperty);
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

  const handleDeleteOpen = async (row) => {
    console.log(row)
    try {
      const alt = window.confirm('Are you sure, you want to delete FAQ?');
      if (alt) {
        const response = await dispatch(deleteFaq(row._id));
        if (response?.success === true) {
          dispatch(
            openSnackbar({
              open: true,
              message: response?.message,
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
          setOpenDelete(!opendelete);
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: response?.message,
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
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickOpen = (row, index) => {
    setItem(row);
    setOpenUpdate(true);
    itemRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} style={{ fontSize: '25px', fontWeight: '600' }}>
              FAQS
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Tooltip title="Add Faq">
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
      {loading ? (
        <Skeleten count={1} style={{ width: '500px' }} />
      ) : (
        <>
          {faqsData &&
            faqsData.map((faq, index) => (
              // eslint-disable-next-line no-return-assign
              <div ref={(el) => (itemRefs.current[index] = el)} key={index}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls={`panel${index + 1}-content`}
                    id={`panel${index + 1}-header`}
                  >
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }} />

                    <Typography>
                      <EditTwoToneIcon
                        onClick={() => {
                          handleClickOpen(faq, index);
                        }}
                      />

                      <DeleteTwoToneIcon
                        onClick={() => {
                          handleDeleteOpen(faq);
                        }}
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
        </>
      )}
      {openUpdate && <FaqUpdate item={item} open={openUpdate} close={(flag) => changeUpdate(flag)} />}
      {openAdd && <FaqAdd open={openAdd} close={(flag) => changeAdd(flag)} />}
    </div>
  );
};

export default FaqsList;
