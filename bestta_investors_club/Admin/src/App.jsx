import { BrowserRouter , Routes ,Route } from "react-router-dom"
import Dashboard from "./components/Dashboard/Dashboard"
import Events from "./components/Events/Events"
import Partners from "./components/Partners/Partners"
import Store from "./components/Store/Store"
import Users from "./components/UserManagement/Users"
import Winners from "./components/Winners/Winners"
import Courses from "./components/Courses/Courses"

// import Pr from "./components/Contents/PrivacyPolicy"

import ProductCatgories from "./components/ProductCategories/ProductCategories"
import CourseCategories from "./components/CourseCategories/CourseCategories"
import UpdateCourseDetails from "./components/CourseCategories/UpdateCourseCategory"

import PlanCategories from "./components/PlanCategories/PlanCategories"

import Plans from "./components/Plans/Plans"

import Coupons from "./components/Coupons/Coupons"

import Login from "./components/Login/Login"

import ProtectedRoute from "./components/ProtectedRoute"

import Orders from './components/Orders/Orders'

import SendOtp from "./components/ForgetPassword/SendOtp"
import SubmitOtp from "./components/ForgetPassword/SubmitOtp"
import ResetPassword from "./components/ForgetPassword/ResetPassword"
import ChangePassword from "./components/ChangePassword/ChangePassword"


import PrivacyPolicy from "./components/Contents/PrivacyPolicy"
import TermsAndConditions from "./components/Contents/TermsAndCondition"
import AboutUs from "./components/Contents/AboutUs"
import MembershipShipTermsAndConditions from "./components/Contents/MemberShipTermsAndCondition"
import SpinWinner from "./components/Winners/SpinWinner"


function App() {


  return (
   <BrowserRouter>
      <Routes>
      <Route exact path = "/bestta-admin/login" element = {<Login/>}/>
        <Route exact path = "/bestta-admin/sendotp" element = {<SendOtp/>}/>
        <Route exact path = "/bestta-admin/submitotp" element = {<SubmitOtp/>} />
        <Route exact path = "/bestta-admin/resetpassword" element = {<ResetPassword/>}/>
        <Route exact path = "/bestta-admin/changepassword" element = {<ChangePassword/>} />
        <Route exact path = "/bestta-admin/" element = {<ProtectedRoute element = {Dashboard}/>} />
        <Route exact path = "/bestta-admin/users" element = {<ProtectedRoute element={Users}/>} />
        <Route  exact path = "/bestta-admin/productcategories"  element = {<ProtectedRoute element = {ProductCatgories}/>}/>
        <Route exact path = "/bestta-admin/coursecategories" element = {<ProtectedRoute element={CourseCategories}/>} />
        <Route exact path = "/bestta-admin/coursecategories/:id" element = {<ProtectedRoute element = {UpdateCourseDetails}/>}/>
        <Route exact path = "/bestta-admin/coaching_videos" element = {<ProtectedRoute element={Courses}/>} />
        <Route exact path = "/bestta-admin/plan_categories" element = {<ProtectedRoute element={PlanCategories}/>}/>
        <Route exact path = "/bestta-admin/plans" element = {<ProtectedRoute element = {Plans}/>}/>
        <Route exact path = "/bestta-admin/coupons" element = {<ProtectedRoute element = {Coupons}/>}/>
        <Route exact path = "/bestta-admin/products" element = {<ProtectedRoute element={Store}/>} />

        <Route exact path = "/bestta-admin/prizes" element = {<ProtectedRoute element={Winners}/>}/>
        <Route exact path = "/bestta-admin/winners" element = {<ProtectedRoute element={SpinWinner}/>}/>

        <Route exact path = "/bestta-admin/events" element = {<ProtectedRoute element={Events}/>} />
        <Route exact path = "/bestta-admin/orders" element = {<ProtectedRoute element={Orders} />} />
        <Route exact path = "/bestta-admin/privacypolicy" element = {<ProtectedRoute element={PrivacyPolicy}/>} />
        <Route exact path = "/bestta-admin/termsandcondition" element = {<ProtectedRoute element={TermsAndConditions}/>} />
        <Route exact path = "/bestta-admin/aboutus" element = {<ProtectedRoute element={AboutUs}/>} />
        <Route exact path = "/bestta-admin/membershiptermsandcondition" element = {<ProtectedRoute element={MembershipShipTermsAndConditions}/>} /> 
      </Routes>
   </BrowserRouter>
   
 
  )
}

export default App


