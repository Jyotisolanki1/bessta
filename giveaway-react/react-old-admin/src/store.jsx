import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from './reducers'
import CoursecategorySlice from './slices/CoursecategorySlice'
import CourseSlice from './slices/CourseSlice'
import PlanCategorySlice from './slices/PlanCategorySlice'
import PlanSlice from './slices/PlanSlice'
import CouponSlice from './slices/CouponSlice'
import ProductCategorySlice from './slices/ProductCategorySlice'
import ProductSlice from './slices/ProductSlice'
import Orders from './slices/Orders'
import Draw from './slices/Draw'
import LoginSlice from './slices/LoginSlice'
import ChangePasswordSlice from './slices/ChangePasswordSlice'
import UserSlice from './slices/UserSlice'
import ContentsSlice from './slices/ContentsSlice'
import WinnerSlice from './slices/WinnerSlice'

const store = configureStore({
//   reducer: rootReducer,
    reducer:{
        CouriesCategories:CoursecategorySlice ,
        Courses : CourseSlice,
        planCategories:PlanCategorySlice,
        PlanSlice:PlanSlice,
        CouponSlice:CouponSlice,
        ProductCategorySlice:ProductCategorySlice,
        ProductSlice:ProductSlice,
        OrderSlice:Orders,
        DrawSlice:Draw,
        Login:LoginSlice,
        ChangePassword:ChangePasswordSlice,
        Users:UserSlice,
        Contents:ContentsSlice,
        Winners:WinnerSlice
    }
})

export default store