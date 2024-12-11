import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import EventsTable from "./EventTable";
import AddEvent from "./AddEvent";

export default function Events() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
       {/* <AddEvent/> */}
       <Box>
         <EventsTable/>
       </Box>
      </Box>
    </div>
  );
}
