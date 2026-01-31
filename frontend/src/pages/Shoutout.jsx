// // import { useState } from "react"
// // import api from "../api/axios"

// // const Shoutout = () => {
// //   const [message, setMessage] = useState("")

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()

// //     try {
// //       await api.post(
// //         "/shoutouts",
// //         null,
// //         {
// //           params: { message }
// //         }
// //       )

// //       alert("Shoutout sent 🎉")
// //       setMessage("")
// //     } catch (err) {
// //       console.error(err)
// //       alert("Failed to send shoutout")
// //     }
// //   }

// //   return (
// //     <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
// //       <h2>Send Shoutout</h2>

// //       <form onSubmit={handleSubmit}>
// //         <textarea
// //           placeholder="Write your shoutout message"
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //           required
// //           style={{ width: "100%", height: "100px", marginBottom: "10px" }}
// //         />

// //         <button type="submit" style={{ width: "100%" }}>
// //           Send Shoutout
// //         </button>
// //       </form>
// //     </div>
// //   )
// // }

// // export default Shoutout


// import { useState } from "react"
// import api from "../api/axios"

// const Shoutout = () => {
//   const [message, setMessage] = useState("")
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       await api.post("/shoutouts", null, { params: { message } })
//       setMessage("")
//       alert("🎉 Shoutout sent successfully!")
//     } catch (err) {
//       console.error(err)
//       alert("❌ Failed to send shoutout")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 transform transition hover:scale-[1.02] hover:shadow-xl animate-fadeIn">
//         {/* Title */}
//         <h2 className="text-2xl font-bold text-center text-blue-700 mb-6 tracking-wide">
//           🚀 Send a Shoutout
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <textarea
//             placeholder="Write your shoutout message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//             className="w-full h-28 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm transition"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition 
//               ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105"}
//             `}
//           >
//             {loading ? "Sending..." : "Send Shoutout 🎉"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Shoutout




import { useState, useEffect } from "react"
import api from "../api/axios"

const Shoutout = () => {
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState([])
  const [receiverId, setReceiverId] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users")
      setUsers(res.data || [])
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/shoutouts", null, {
        params: {
          message,
          receiver_id: receiverId,
        },
      })
      setMessage("")
      setReceiverId("")
      alert("🚀 Shoutout sent successfully!")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to send shoutout")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          🚀 Send a Shoutout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your shoutout message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full h-28 p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Shoutout 🎉"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Shoutout