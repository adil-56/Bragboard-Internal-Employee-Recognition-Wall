// // // import { useState } from "react"
// // // import { useNavigate } from "react-router-dom"
// // // import api from "../api/axios"

// // // const Login = () => {
// // //   const [email, setEmail] = useState("")
// // //   const [password, setPassword] = useState("")
// // //   const navigate = useNavigate()

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()

// // //     try {
// // //       const res = await api.post(
// // //         `/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
// // //       )

// // //       localStorage.setItem("token", res.data.access_token)
// // //       localStorage.setItem("is_admin", res.data.is_admin)

// // //       if (res.data.is_admin) {
// // //         navigate("/admin")
// // //       } else {
// // //         navigate("/dashboard")
// // //       }
// // //     } catch {
// // //       alert("Invalid credentials")
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //       <form
// // //         onSubmit={handleSubmit}
// // //         className="bg-white p-8 rounded-xl shadow w-full max-w-sm"
// // //       >
// // //         <h2 className="text-2xl font-bold mb-6 text-center">
// // //           Login
// // //         </h2>

// // //         <input
// // //           type="email"
// // //           placeholder="Email"
// // //           value={email}
// // //           onChange={e => setEmail(e.target.value)}
// // //           className="w-full border p-2 rounded mb-4"
// // //           required
// // //         />

// // //         <input
// // //           type="password"
// // //           placeholder="Password"
// // //           value={password}
// // //           onChange={e => setPassword(e.target.value)}
// // //           className="w-full border p-2 rounded mb-4"
// // //           required
// // //         />

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
// // //         >
// // //           Login
// // //         </button>
// // //       </form>
// // //     </div>
// // //   )
// // // }

// // // export default Login

// // // src/pages/Login.jsx
// // import { useState } from "react"
// // import { useNavigate } from "react-router-dom"
// // import api from "../api/axios"

// // const Login = () => {
// //   const [email, setEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const navigate = useNavigate()

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()

// //     const res = await api.post("/auth/login", null, {
// //       params: { email, password },
// //     })

// //     localStorage.setItem("token", res.data.access_token)
// //     localStorage.setItem("role", res.data.role)
// //     localStorage.setItem("name", res.data.name)
// //     localStorage.setItem("email", res.data.email)
// //     localStorage.setItem("department", res.data.department)

// //     navigate("/dashboard")
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="bg-white p-8 rounded-xl shadow w-full max-w-sm"
// //       >
// //         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={e => setEmail(e.target.value)}
// //           className="w-full border p-2 rounded mb-4"
// //           required
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={e => setPassword(e.target.value)}
// //           className="w-full border p-2 rounded mb-4"
// //           required
// //         />

// //         <button
// //           type="submit"
// //           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
// //         >
// //           Login
// //         </button>
// //       </form>
// //     </div>
// //   )
// // }

// // export default Login


// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import api from "../api/axios"

// const Login = () => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       const res = await api.post("/auth/login", null, {
//         params: { email, password },
//       })

//       localStorage.setItem("token", res.data.access_token)
//       localStorage.setItem("role", res.data.role)
//       localStorage.setItem("name", res.data.name)
//       localStorage.setItem("email", res.data.email)
//       localStorage.setItem("department", res.data.department)

//       navigate("/dashboard")
//     } catch (err) {
//       console.error(err)
//       setError("Invalid email or password. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transform transition hover:scale-[1.02] hover:shadow-xl animate-fadeIn"
//       >
//         {/* Title */}
//         <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-wide">
//           🔐 Login
//         </h2>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 text-red-600 text-sm font-medium text-center">
//             {error}
//           </div>
//         )}

//         {/* Email Input */}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//           required
//         />

//         {/* Password Input */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           className="w-full border border-gray-300 p-3 rounded-lg mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//           required
//         />

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition 
//             ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105"}
//           `}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {/* Footer */}
//         <p className="text-xs text-gray-500 text-center mt-4">
//           Secure access to your dashboard
//         </p>
//       </form>
//     </div>
//   )
// }

// export default Login



import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await api.post("/auth/login", null, {
        params: { email, password },
      })

      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("email", res.data.email)
      localStorage.setItem("department", res.data.department)

      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl 
                   bg-white/20 backdrop-blur-lg border border-white/30 
                   transform transition hover:scale-[1.02] hover:shadow-2xl animate-fadeIn"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-wide drop-shadow font-serif">
          🔐 Login
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-200 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-white/40 p-3 rounded-lg mb-4 text-sm 
                     bg-white/30 text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-white/40 p-3 rounded-lg mb-6 text-sm 
                     bg-white/30 text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-pink-600 hover:scale-105"}
          `}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-xs text-white/80 text-center mt-4 font-sans">
          Secure access to your dashboard
        </p>
      </form>
    </div>
  )
}

export default Login