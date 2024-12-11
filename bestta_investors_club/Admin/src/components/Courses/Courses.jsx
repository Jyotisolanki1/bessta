import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import CoursesTable from "./CoursesTable";

export default function CoachingVideos() {

  return (
    <div style = {{display:"flex",width:"95%" ,margin:"0px auto"}}>
    <PersistentDrawerLeft />
        <Box component="main" sx={{ flexGrow: 1 }}>
            <DrawerHeader/>
                <CoursesTable/>
        </Box>
    </div>
  );
}
