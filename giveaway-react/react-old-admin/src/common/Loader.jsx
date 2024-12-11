import loaderImage from '../assets/loader7.gif'

export default function Loader(){
    return<div style = {{height:"70vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <img src = {loaderImage} alt = "loader"  />
       
    </div>
}