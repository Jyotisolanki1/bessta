
import { Navigate } from 'react-router-dom'

const ProtectedRoute =  ( {element:Element}) =>  {
		const details = (localStorage?.getItem("adminToken"))
		
		return  details?  <Element/> : <Navigate to = "/bestta-admin/login"/>

}

export default ProtectedRoute 