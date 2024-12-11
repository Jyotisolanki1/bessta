import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi } from "../components/apicalls";

export const fetchCourses = createAsyncThunk("fetchCourses" , async () => {
                const res = await getApi("/admin/course")
                return res.data
})

export const addCourse = createAsyncThunk("addcourse" , async (data) => {
                const res = await postApi("/admin/add-course",data)
                return res.data
})

export const updateCourse = createAsyncThunk("updatecourse" , async (data) => {
                const res = await postApi("/admin/update-course",data)
                return res.data
})




const initialState = {
    loader:true,
    courses:[]
}


const CourseSlice = createSlice({
    name:"CourseSlice",
    initialState,
    reducer:{

    },
    extraReducers:(builder) => {
                builder.addCase(fetchCourses.pending,(state,action) => {
                        state.loader = true
                })
                builder.addCase(fetchCourses.fulfilled,(state,action) => {
                        if(action.payload.success){
                            state.courses = action.payload
                            state.loader = false
                        }
                })
              
                builder.addCase(addCourse.fulfilled)
               
                builder.addCase(updateCourse.fulfilled)
    }
})


export default CourseSlice.reducer