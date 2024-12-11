
import { toast } from 'react-toastify';


export const successNotification = (text) => {
    toast.success(text,{
        position: toast.POSITION,
        autoClose: 3000, // Automatically close after 3 seconds
      })
}


export const errorNotification = (text) => {
    toast.error(text,{
        position: toast.POSITION,
        autoClose: 3000, // Automatically close after 3 seconds
      })
}