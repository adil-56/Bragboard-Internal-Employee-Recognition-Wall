// // import { useEffect, useState } from "react"
// // import { useNavigate } from "react-router-dom"
// // import api from "../api/axios"

// // const Dashboard = () => {
// //   const navigate = useNavigate()
// //   const [user, setUser] = useState(null)

// //   useEffect(() => {
// //     api.get("/users/me")
// //       .then(res => setUser(res.data))
// //       .catch(() => navigate("/login"))
// //   }, [])

// //   if (!user) {
// //     return (
// //       <div className="h-screen flex items-center justify-center text-gray-600">
// //         Loading dashboard...
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-8">
// //       <div className="max-w-5xl mx-auto">
// //         <h1 className="text-3xl font-bold mb-6 text-gray-800">
// //           Dashboard
// //         </h1>

// //         {/* USER CARD */}
// //         <div className="bg-white rounded-xl shadow p-6 mb-8">
// //           <h2 className="text-xl font-semibold mb-4">User Details</h2>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
// //             <p><span className="font-medium">Email:</span> {user.email}</p>
// //             <p><span className="font-medium">Department:</span> {user.department}</p>
// //             <p><span className="font-medium">Role:</span> {user.role}</p>

// //             {user.is_admin && (
// //               <p className="text-red-600 font-semibold">
// //                 Admin Account
// //               </p>
// //             )}
// //           </div>
// //         </div>

// //         {/* ACTION BUTTONS */}
// //         <div className="flex flex-wrap gap-4">
// //           <button
// //             onClick={() => navigate("/feed")}
// //             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
// //           >
// //             View Feed
// //           </button>

// //           <button
// //             onClick={() => navigate("/shoutout")}
// //             className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
// //           >
// //             Create Shoutout
// //           </button>

// //           {user.is_admin && (
// //             <button
// //               onClick={() => navigate("/admin")}
// //               className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
// //             >
// //               Admin Panel
// //             </button>
// //           )}

// //           <button
// //             onClick={() => {
// //               localStorage.clear()
// //               navigate("/login")
// //             }}
// //             className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Dashboard


// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import api from "../api/axios"

// const Dashboard = () => {
//   const navigate = useNavigate()
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     api.get("/users/me")
//       .then(res => setUser(res.data))
//       .catch(() => navigate("/login"))
//   }, [])

//   if (!user) {
//     return (
//       <div className="h-screen flex items-center justify-center text-gray-600">
//         Loading dashboard...
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">
//           Dashboard
//         </h1>

//         {/* USER DETAILS CARD */}
//         <div className="bg-white rounded-xl shadow p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4">
//             User Details
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//             <p>
//               <span className="font-medium">Name:</span>{" "}
//               {user.name}
//             </p>

//             <p>
//               <span className="font-medium">Email:</span>{" "}
//               {user.email}
//             </p>

//             <p>
//               <span className="font-medium">Department:</span>{" "}
//               {user.department}
//             </p>

//             <p>
//               <span className="font-medium">Role:</span>{" "}
//               {user.is_admin ? "Admin" : "User"}
//             </p>

//             {user.is_admin && (
//               <p className="text-red-600 font-semibold">
//                 Admin Account
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex flex-wrap gap-4">
//           <button
//             onClick={() => navigate("/feed")}
//             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//           >
//             View Feed
//           </button>

//           <button
//             onClick={() => navigate("/shoutout")}
//             className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
//           >
//             Create Shoutout
//           </button>

//           {user.is_admin && (
//             <button
//               onClick={() => navigate("/admin")}
//               className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
//             >
//               Admin Panel
//             </button>
//           )}

//           <button
//             onClick={() => {
//               localStorage.clear()
//               navigate("/login")
//             }}
//             className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard  



import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get("/users/me")
      .then(res => setUser(res.data))
      .catch(() => navigate("/login"))
  }, [])

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 animate-pulse">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center tracking-wide animate-fadeIn">
          ⚡ Dashboard
        </h1>

        {/* USER DETAILS CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transform transition hover:scale-[1.02] hover:shadow-xl animate-slideUp">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-2">
            User Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Department:</span> {user.department}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              {user.is_admin ? "Admin" : "User"}
            </p>

            {user.is_admin && (
              <p className="text-red-600 font-semibold animate-bounce">
                🚀 Admin Account
              </p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 justify-center">
          <ActionButton
            label="View Feed"
            color="blue"
            onClick={() => navigate("/feed")}
          />
          <ActionButton
            label="Create Shoutout"
            color="green"
            onClick={() => navigate("/shoutout")}
          />
          {user.is_admin && (
            <ActionButton
              label="Admin Panel"
              color="red"
              onClick={() => navigate("/admin")}
            />
          )}
          <ActionButton
            label="Logout"
            color="gray"
            onClick={() => {
              localStorage.clear()
              navigate("/login")
            }}
          />
        </div>
      </div>
    </div>
  )
}

// =======================
// Reusable Action Button
// =======================
const ActionButton = ({ label, color, onClick }) => {
  const base =
    "px-6 py-3 rounded-lg text-white font-semibold shadow-md transform transition hover:scale-105 focus:outline-none"
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  }

  return (
    <button onClick={onClick} className={`${base} ${colors[color]} animate-fadeIn`}>
      {label}
    </button>
  )
}

export default Dashboard