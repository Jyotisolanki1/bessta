'use client';

import { useCallback } from 'react';

// material-ui
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { randomCreatedDate, randomTraderName, randomUpdatedDate } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import { openSnackbar } from 'store/slices/snackbar';
import CSVExport from 'views/forms/tables/tbl-exports';
import { useDispatch } from 'store';

const useFakeMutation = () =>
  useCallback(
    (user) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (user.name?.trim() === '') {
            reject(new Error("Error while saving user: name can't be empty."));
          } else {
            resolve({ ...user, name: user.name?.toUpperCase() });
          }
        }, 200);
      }),
    []
  );

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    flex: 0.5,
    minWidth: 100,
    headerAlign: 'left'
  },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    flex: 0.75,
    minWidth: 180,
    editable: true
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    flex: 1,
    minWidth: 220,
    editable: true
  }
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  }
];

// ==============================|| SERVER VALIDATION COLUMN DATA GRID ||============================== //

export default function ServerSidePersistence() {
  const dispatch = useDispatch();
  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (newRow) => {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow);
      dispatch(
        openSnackbar({
          open: true,
          message: 'User Successfully Saved',
          variant: 'alert',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          alert: {
            color: 'success'
          }
        })
      );
      return response;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutateRow]
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    dispatch(
      openSnackbar({
        open: true,
        message: error.message,
        variant: 'alert',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        alert: {
          color: 'error'
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Server-side Validation"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={rows} filename="server-validation-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#server-side-validation" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          autoHeight
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </Box>
    </MainCard>
  );
}
