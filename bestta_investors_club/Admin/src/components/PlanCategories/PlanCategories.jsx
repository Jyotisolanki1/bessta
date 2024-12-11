import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";

import PlanCategoriesTable from "./PlanCategoriesTable";
import AddPlanCategory from "./AddPlanCategories";

export default function PlanCategories() {

  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box>
           
     
        
          <PlanCategoriesTable/>
         
       
        </Box>
      </Box>
    </div>
  );
}
