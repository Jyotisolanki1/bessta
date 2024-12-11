'use client';

import PropTypes from 'prop-types';

// material-ui
import { Box, ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

// assets
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

function CustomUserItem({ myCustomHandler, myCustomValue }) {
  return (
    <MenuItem onClick={myCustomHandler}>
      <ListItemIcon>
        <SettingsApplicationsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{myCustomValue}</ListItemText>
    </MenuItem>
  );
}

CustomUserItem.propTypes = {
  myCustomHandler: PropTypes.func,
  myCustomValue: PropTypes.func
};

function CustomColumnMenu(props) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Add new item
        columnMenuUserItem: CustomUserItem
      }}
      slotProps={{
        columnMenuUserItem: {
          // set `displayOrder` for new item
          displayOrder: 15,
          // pass additional props
          myCustomValue: 'Do custom action',
          // eslint-disable-next-line
          myCustomHandler: () => alert('Custom handler fired')
        }
      }}
    />
  );
}

// ==============================|| ADD MENU ITEM DATA GRID ||============================== //

export default function AddMenuItem() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 8
  });

  const headers = [];
  data.columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Adding Menu Item"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={data.rows} filename="add-menu-item-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-menu/#adding-a-menu-item" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGrid autoHeight hideFooter {...data} slots={{ columnMenu: CustomColumnMenu }} />
      </Box>
    </MainCard>
  );
}
