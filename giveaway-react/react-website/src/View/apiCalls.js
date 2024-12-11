import axios from "axios";
import { REACT_API_URL } from "../../config";

const baseUrl = REACT_API_URL;


export async function postApi(path, data, heads) {
  return new Promise(async (resolve,reject) => {
    await axios.post(`${baseUrl}${path}`, data, heads)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => reject(err))
  })
}



export async function getApi(path, heads) {  
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`${baseUrl}${path}`, heads)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
