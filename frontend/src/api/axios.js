// // import axios from "axios"

// // const api = axios.create({
// //   baseURL: "http://localhost:8000",
// // })

// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token")
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`
// //   }
// //   return config
// // })

// // export default api



// // src/api/axios.js
// import axios from "axios"

// const api = axios.create({
//   baseURL: "http://localhost:8000",
// })

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.clear()
//       window.location.href = "/login"
//     }
//     return Promise.reject(err)
//   }
// )

// export default api


import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api