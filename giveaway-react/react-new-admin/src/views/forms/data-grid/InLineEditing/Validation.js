'use client';

import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { DataGrid, GridEditInputCell } from '@mui/x-data-grid';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .MuiDataGrid-cell--editable': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.success.dark + 30 : theme.palette.success.light,
    '& .MuiInputBase-root': {
      height: '100%'
    }
  },
  '& .Mui-error': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.error.dark + 30 : theme.palette.error.light
  }
}));

const rows = [
  {
    id: 1,
    name: 'Damien'
  },
  {
    id: 2,
    name: 'Olivier'
  },
  {
    id: 3,
    name: 'Danail'
  },
  {
    id: 4,
    name: 'Matheus'
  },
  {
    id: 5,
    name: 'You?'
  }
];

let promiseTimeout;
function validateName(username) {
  const existingUsers = rows.map((row) => row.name.toLowerCase());
  return new Promise((resolve) => {
    promiseTimeout = setTimeout(
      () => {
        const exists = existingUsers.includes(username.toLowerCase());
        resolve(exists ? `${username} is already taken.` : null);
      },
      Math.random() * 500 + 100
    ); // simulate network latency
  });
}

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
}));

function NameEditInputCell({ error, ...others }) {
  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...others} />
    </StyledTooltip>
  );
}

NameEditInputCell.propTypes = {
  error: PropTypes.bool
};

function renderEditName(params) {
  return <NameEditInputCell {...params} />;
}

// ==============================|| VALIDTION DATA GRID ||============================== //

export default function ValidateServerNameGrid() {
  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params.props.value.toString());
    return { ...params.props, error: errorMessage };
  };

  const columns = [
    {
      field: 'name',
      headerName: 'MUI Contributor',
      width: 180,
      editable: true,
      preProcessEditCellProps,
      renderEditCell: renderEditName
    }
  ];

  React.useEffect(
    () => () => {
      clearTimeout(promiseTimeout);
    },
    []
  );

  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Validation"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={rows} filename="validation-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#validation" />
        </Stack>
      }
    >
      <StyledBox>
        <DataGrid rows={rows} columns={columns} isCellEditable={(params) => params.row.id === 5} hideFooter autoHeight />
      </StyledBox>
    </MainCard>
  );
}
