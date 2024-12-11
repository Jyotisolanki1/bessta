import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";

import UsersTable from "./UserTable";

export default function Users() {
  return (
    <div style={{ display: "flex",width:"90%" ,margin:"0px auto" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1}}>
        <DrawerHeader />
          
            <UsersTable/>
          
      </Box>
    </div>
  );
}
