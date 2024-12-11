import axios from "axios";

// const baseUrl = "http://52.22.241.165:10010";

const baseUrl = "https://indoredev.webmobrildemo.com:10010"

const token = localStorage.getItem("adminToken")

// console.log(token , "token from apicalls")

const config = {
  headers: {
  "Content-Type": "Application/JSON", 
  Authorization: `Bearer ${token}`,
  },
};


const imgConfig = {
  headers: {
  'Content-Type':"multipart/form-data",
  Authorization: `Bearer ${token}`,
  },
};

export async function postApi(path, data) {
 
// console.log(data , "from post api")
  return new Promise(async (resolve,reject) => {
    await axios.post(`${baseUrl}${path}`, data, config)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => reject(err))
  })
}

export async function getApi(path) {
  
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`${baseUrl}${path}`, config)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export async function imagesApi(path , data){
  return new Promise(async (resolve, reject) => {
    await axios
      .post(`${baseUrl}${path}`, data , imgConfig)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}



