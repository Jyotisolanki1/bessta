import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import CourseCategoriesTable from "./CourseCategoryTable";
import AddCourseCategory from "./AddCourseCategory";


export default function CourseCategories() {

  

  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box>
            {/* <AddCourseCategory/> */}
          
            <CourseCategoriesTable/>
          
       
        </Box>
      </Box>
    </div>
  );
}
