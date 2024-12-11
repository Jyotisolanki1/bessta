
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { postApi } from '../components/apicalls';
import { getApi } from '../components/apicalls';

export const fetchCourseCategories = createAsyncThunk("fetchcoursecategories" , async () => {
      const res = await getApi("/admin/course-category")
      return res.data

})

export const AddCourseCategories = createAsyncThunk("Addcoursecategory",async (data) => {
      const res = await postApi("/admin/course-category",data)
      return res.data
})

export const UpdateCourseCategories = createAsyncThunk("UpdateCourseCategories",async (data) => {
      const res = await postApi("/admin/update-course-category",data)
      return res.data
})


const initialState = {
        courseCategories : [],
        loader:true,
}

const CourseCategorySlice = createSlice({
            name:'CourseCategory',
            initialState,
            reducer:{

            },
            extraReducers:(builder) => {
                    builder.addCase(fetchCourseCategories.pending,(state,action) => {
                        
                        state.loader = true
                    })
                    builder.addCase(fetchCourseCategories.fulfilled,(state,action) => {
                     
                        if(action.payload.success){
                            state.loader = false
                        state.courseCategories = action.payload
                        }
                        
                    })
                  
                    builder.addCase(AddCourseCategories.fulfilled)
                    builder.addCase(UpdateCourseCategories.fulfilled)
                    
            }
})


export default CourseCategorySlice.reducer