// // // // import { useEffect, useState } from "react"
// // // // import api from "../api/axios"

// // // // const REACTIONS = [
// // // //   { type: "clap", emoji: "👏", color: "bg-yellow-100 text-yellow-700" },
// // // //   { type: "star", emoji: "⭐", color: "bg-blue-100 text-blue-700" },
// // // //   { type: "heart", emoji: "❤️", color: "bg-pink-100 text-pink-700" }
// // // // ]

// // // // const Feed = () => {
// // // //   const [shoutouts, setShoutouts] = useState([])
// // // //   const [reactions, setReactions] = useState({})
// // // //   const [comments, setComments] = useState({})
// // // //   const [commentInput, setCommentInput] = useState({})

// // // //   useEffect(() => {
// // // //     fetchShoutouts()
// // // //   }, [])

// // // //   const fetchShoutouts = async () => {
// // // //     const res = await api.get("/shoutouts")
// // // //     setShoutouts(res.data)
// // // //     res.data.forEach((s) => {
// // // //       fetchReactions(s.id)
// // // //       fetchComments(s.id)
// // // //     })
// // // //   }

// // // //   const fetchReactions = async (id) => {
// // // //     const res = await api.get(`/reactions/shoutouts/${id}/summary`)
// // // //     setReactions((prev) => ({ ...prev, [id]: res.data }))
// // // //   }

// // // //   const react = async (id, type) => {
// // // //     await api.post(`/reactions/shoutouts/${id}`, null, {
// // // //       params: { reaction_type: type }
// // // //     })
// // // //     fetchReactions(id)
// // // //   }

// // // //   const fetchComments = async (id) => {
// // // //     const res = await api.get(`/comments/comments/shoutouts/${id}`)
// // // //     setComments((prev) => ({ ...prev, [id]: res.data }))
// // // //   }

// // // //   const postComment = async (id) => {
// // // //     if (!commentInput[id]) return
// // // //     await api.post(`/comments/shoutouts/${id}`, {
// // // //       message: commentInput[id]
// // // //     })
// // // //     setCommentInput((prev) => ({ ...prev, [id]: "" }))
// // // //     fetchComments(id)
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-100 py-10">
// // // //       <div className="max-w-4xl mx-auto px-4">
// // // //         <h1 className="text-3xl font-bold text-gray-800 mb-8">
// // // //           Shoutout Feed
// // // //         </h1>

// // // //         {shoutouts.map((s) => (
// // // //           <div
// // // //             key={s.id}
// // // //             className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
// // // //           >
// // // //             <p className="text-lg font-medium text-gray-800">
// // // //               {s.message}
// // // //             </p>
// // // //             <p className="text-sm text-gray-500 mt-1">
// // // //               {new Date(s.created_at).toLocaleString()}
// // // //             </p>

// // // //             <div className="flex gap-3 mt-4">
// // // //               {REACTIONS.map((r) => (
// // // //                 <button
// // // //                   key={r.type}
// // // //                   onClick={() => react(s.id, r.type)}
// // // //                   className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${r.color} hover:opacity-80 transition`}
// // // //                 >
// // // //                   <span>{r.emoji}</span>
// // // //                   <span>{reactions[s.id]?.[r.type] || 0}</span>
// // // //                 </button>
// // // //               ))}
// // // //             </div>

// // // //             <div className="mt-6">
// // // //               <h3 className="text-md font-semibold text-gray-700 mb-3">
// // // //                 Comments
// // // //               </h3>

// // // //               <div className="space-y-2 mb-4">
// // // //                 {(comments[s.id] || []).map((c) => (
// // // //                   <div
// // // //                     key={c.id}
// // // //                     className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700"
// // // //                   >
// // // //                     {c.message}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>

// // // //               <div className="flex gap-2">
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="Write a comment..."
// // // //                   value={commentInput[s.id] || ""}
// // // //                   onChange={(e) =>
// // // //                     setCommentInput((prev) => ({
// // // //                       ...prev,
// // // //                       [s.id]: e.target.value
// // // //                     }))
// // // //                   }
// // // //                   className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 />
// // // //                 <button
// // // //                   onClick={() => postComment(s.id)}
// // // //                   className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
// // // //                 >
// // // //                   Post
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default Feed


// // // import { useEffect, useState } from "react"
// // // import api from "../api/axios"

// // // const REACTIONS = [
// // //   { type: "clap", emoji: "👏", color: "bg-yellow-100 text-yellow-700" },
// // //   { type: "star", emoji: "⭐", color: "bg-blue-100 text-blue-700" },
// // //   { type: "heart", emoji: "❤️", color: "bg-pink-100 text-pink-700" }
// // // ]

// // // const Feed = () => {
// // //   const [shoutouts, setShoutouts] = useState([])
// // //   const [reactions, setReactions] = useState({})
// // //   const [comments, setComments] = useState({})
// // //   const [commentInput, setCommentInput] = useState({})

// // //   useEffect(() => {
// // //     fetchShoutouts()
// // //   }, [])

// // //   const fetchShoutouts = async () => {
// // //     const res = await api.get("/shoutouts")
// // //     setShoutouts(res.data)
// // //     res.data.forEach((s) => {
// // //       fetchReactions(s.id)
// // //       fetchComments(s.id)
// // //     })
// // //   }

// // //   const fetchReactions = async (id) => {
// // //     const res = await api.get(`/reactions/shoutouts/${id}/summary`)
// // //     setReactions((prev) => ({ ...prev, [id]: res.data }))
// // //   }

// // //   const react = async (id, type) => {
// // //     await api.post(`/reactions/shoutouts/${id}`, null, {
// // //       params: { reaction_type: type }
// // //     })
// // //     fetchReactions(id)
// // //   }

// // //   const fetchComments = async (id) => {
// // //     const res = await api.get(`/comments/comments/shoutouts/${id}`)
// // //     setComments((prev) => ({ ...prev, [id]: res.data }))
// // //   }

// // //   const postComment = async (id) => {
// // //     if (!commentInput[id]) return
// // //     await api.post(`/comments/shoutouts/${id}`, {
// // //       message: commentInput[id]
// // //     })
// // //     setCommentInput((prev) => ({ ...prev, [id]: "" }))
// // //     fetchComments(id)
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12">
// // //       <div className="max-w-4xl mx-auto px-4">
// // //         <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-wide animate-fadeIn">
// // //           🎉 Shoutout Feed
// // //         </h1>

// // //         {shoutouts.map((s) => (
// // //           <div
// // //             key={s.id}
// // //             className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transform transition hover:scale-[1.02] hover:shadow-xl animate-slideUp"
// // //           >
// // //             {/* Shoutout message */}
// // //             <p className="text-lg font-medium text-gray-800">
// // //               {s.message}
// // //             </p>
// // //             <p className="text-sm text-gray-500 mt-1">
// // //               {new Date(s.created_at).toLocaleString()}
// // //             </p>

// // //             {/* Reactions */}
// // //             <div className="flex gap-3 mt-4">
// // //               {REACTIONS.map((r) => (
// // //                 <button
// // //                   key={r.type}
// // //                   onClick={() => react(s.id, r.type)}
// // //                   className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${r.color} hover:scale-105 transition transform`}
// // //                 >
// // //                   <span>{r.emoji}</span>
// // //                   <span>{reactions[s.id]?.[r.type] || 0}</span>
// // //                 </button>
// // //               ))}
// // //             </div>

// // //             {/* Comments */}
// // //             <div className="mt-6">
// // //               <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-1">
// // //                 💬 Comments
// // //               </h3>

// // //               <div className="space-y-2 mb-4">
// // //                 {(comments[s.id] || []).map((c) => (
// // //                   <div
// // //                     key={c.id}
// // //                     className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 transition"
// // //                   >
// // //                     {c.message}
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {/* Comment input */}
// // //               <div className="flex gap-2">
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Write a comment..."
// // //                   value={commentInput[s.id] || ""}
// // //                   onChange={(e) =>
// // //                     setCommentInput((prev) => ({
// // //                       ...prev,
// // //                       [s.id]: e.target.value
// // //                     }))
// // //                   }
// // //                   className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
// // //                 />
// // //                 <button
// // //                   onClick={() => postComment(s.id)}
// // //                   className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transform hover:scale-105 transition"
// // //                 >
// // //                   Post
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default Feed



// // import { useEffect, useState } from "react"
// // import api from "../api/axios"

// // const REACTIONS = [
// //   { type: "clap", emoji: "👏", color: "bg-yellow-100 text-yellow-700" },
// //   { type: "star", emoji: "⭐", color: "bg-blue-100 text-blue-700" },
// //   { type: "heart", emoji: "❤️", color: "bg-pink-100 text-pink-700" }
// // ]

// // const Feed = () => {
// //   const [shoutouts, setShoutouts] = useState([])
// //   const [reactions, setReactions] = useState({})
// //   const [comments, setComments] = useState({})
// //   const [commentInput, setCommentInput] = useState({})

// //   useEffect(() => {
// //     fetchShoutouts()
// //   }, [])

// //   const fetchShoutouts = async () => {
// //     const res = await api.get("/shoutouts")
// //     setShoutouts(res.data)
// //     res.data.forEach((s) => {
// //       fetchReactions(s.id)
// //       fetchComments(s.id)
// //     })
// //   }

// //   const fetchReactions = async (id) => {
// //     const res = await api.get(`/reactions/shoutouts/${id}/summary`)
// //     setReactions((prev) => ({ ...prev, [id]: res.data }))
// //   }

// //   const react = async (id, type) => {
// //     await api.post(`/reactions/shoutouts/${id}`, null, {
// //       params: { reaction_type: type }
// //     })
// //     fetchReactions(id)
// //   }

// //   const fetchComments = async (id) => {
// //     const res = await api.get(`/comments/comments/shoutouts/${id}`)
// //     setComments((prev) => ({ ...prev, [id]: res.data }))
// //   }

// //   const postComment = async (id) => {
// //     if (!commentInput[id]) return
// //     await api.post(`/comments/shoutouts/${id}`, {
// //       message: commentInput[id]
// //     })
// //     setCommentInput((prev) => ({ ...prev, [id]: "" }))
// //     fetchComments(id)
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 font-sans">
// //       <div className="max-w-4xl mx-auto px-4">
// //         <h1 className="text-5xl font-extrabold text-gray-800 mb-10 text-center tracking-wide animate-fadeIn font-serif">
// //           🎉 Shoutout Feed
// //         </h1>

// //         {shoutouts.map((s) => (
// //           <div
// //             key={s.id}
// //             className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transform transition hover:scale-[1.02] hover:shadow-xl animate-slideUp"
// //           >
// //             {/* Shoutout message */}
// //             <p className="text-xl font-semibold text-gray-900 font-serif">
// //               {s.message}
// //             </p>
// //             <p className="text-sm text-gray-500 mt-1 font-sans">
// //               {new Date(s.created_at).toLocaleString()}
// //             </p>

// //             {/* Reactions */}
// //             <div className="flex gap-4 mt-5">
// //               {REACTIONS.map((r) => (
// //                 <button
// //                   key={r.type}
// //                   onClick={() => react(s.id, r.type)}
// //                   className={`flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${r.color} hover:scale-110 transition transform shadow-sm`}
// //                 >
// //                   <span className="text-lg">{r.emoji}</span>
// //                   <span>{reactions[s.id]?.[r.type] || 0}</span>
// //                 </button>
// //               ))}
// //             </div>

// //             {/* Comments */}
// //             <div className="mt-6">
// //               <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-1 font-sans">
// //                 💬 Comments
// //               </h3>

// //               <div className="space-y-2 mb-4">
// //                 {(comments[s.id] || []).map((c) => (
// //                   <div
// //                     key={c.id}
// //                     className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 transition font-sans"
// //                   >
// //                     {c.message}
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Comment input */}
// //               <div className="flex gap-2">
// //                 <input
// //                   type="text"
// //                   placeholder="Write a comment..."
// //                   value={commentInput[s.id] || ""}
// //                   onChange={(e) =>
// //                     setCommentInput((prev) => ({
// //                       ...prev,
// //                       [s.id]: e.target.value
// //                     }))
// //                   }
// //                   className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-sans"
// //                 />
// //                 <button
// //                   onClick={() => postComment(s.id)}
// //                   className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transform hover:scale-105 transition font-sans"
// //                 >
// //                   Post
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }

// // export default Feed

// import { useEffect, useState } from "react"
// import api from "../api/axios"

// const REACTIONS = [
//   { type: "clap", emoji: "👏", color: "bg-yellow-100" },
//   { type: "star", emoji: "⭐", color: "bg-blue-100" },
//   { type: "heart", emoji: "❤️", color: "bg-pink-100" },
// ]

// const Feed = () => {
//   const [shoutouts, setShoutouts] = useState([])
//   const [reactions, setReactions] = useState({})
//   const [comments, setComments] = useState({})
//   const [commentInput, setCommentInput] = useState({})

//   useEffect(() => {
//     fetchShoutouts()
//   }, [])

//   const fetchShoutouts = async () => {
//     const res = await api.get("/shoutouts")
//     setShoutouts(res.data)
//     res.data.forEach((s) => {
//       fetchReactions(s.id)
//       fetchComments(s.id)
//     })
//   }

//   const fetchReactions = async (id) => {
//     const res = await api.get(`/reactions/shoutouts/${id}/summary`)
//     setReactions((prev) => ({ ...prev, [id]: res.data }))
//   }

//   const react = async (id, type) => {
//     await api.post(`/reactions/shoutouts/${id}`, null, {
//       params: { reaction_type: type },
//     })
//     fetchReactions(id)
//   }

//   const fetchComments = async (id) => {
//     const res = await api.get(`/comments/comments/shoutouts/${id}`)
//     setComments((prev) => ({ ...prev, [id]: res.data }))
//   }

//   const postComment = async (id) => {
//     if (!commentInput[id]) return
//     await api.post(`/comments/shoutouts/${id}`, {
//       message: commentInput[id],
//     })
//     setCommentInput((prev) => ({ ...prev, [id]: "" }))
//     fetchComments(id)
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       {shoutouts.map((shoutout) => (
//         <div
//           key={shoutout.id}
//           className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-200"
//         >
//           {/* Message */}
//           <h3 className="text-lg font-semibold text-gray-800">
//             {shoutout.message}
//           </h3>
//           <p className="text-xs text-gray-500 mt-1">
//             {new Date(shoutout.created_at).toLocaleString()}
//           </p>

//           {/* Reactions */}
//           <div className="flex gap-3 mt-4">
//             {REACTIONS.map((r) => (
//               <button
//                 key={r.type}
//                 onClick={() => react(shoutout.id, r.type)}
//                 className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition hover:scale-105 ${r.color}`}
//               >
//                 {r.emoji} {reactions[shoutout.id]?.[r.type] || 0}
//               </button>
//             ))}
//           </div>

//           {/* Comments */}
//           <div className="mt-5">
//             <strong className="text-gray-700">Comments</strong>
//             <div className="mt-2 space-y-3">
//               {comments[shoutout.id]?.map((c) => (
//                 <div
//                   key={c.id}
//                   className="border-b border-gray-100 pb-2"
//                 >
//                   <div className="text-sm font-semibold text-gray-700">
//                     {c.user_email}
//                   </div>
//                   <div className="text-sm text-gray-800">{c.message}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Add Comment */}
//           <div className="mt-4">
//             <input
//               placeholder="Write a comment..."
//               value={commentInput[shoutout.id] || ""}
//               onChange={(e) =>
//                 setCommentInput((prev) => ({
//                   ...prev,
//                   [shoutout.id]: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={() => postComment(shoutout.id)}
//               className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
//             >
//               Post
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default Feed



import { useEffect, useState } from "react"
import api from "../api/axios"

const REACTIONS = [
  { type: "clap", emoji: "👏" },
  { type: "star", emoji: "⭐" },
  { type: "heart", emoji: "❤️" },
]

const Feed = () => {
  const [shoutouts, setShoutouts] = useState([])
  const [reactions, setReactions] = useState({})
  const [comments, setComments] = useState({})
  const [commentInput, setCommentInput] = useState({})

  useEffect(() => {
    fetchShoutouts()
  }, [])

  const fetchShoutouts = async () => {
    const res = await api.get("/shoutouts")
    setShoutouts(res.data)

    res.data.forEach(s => {
      fetchReactions(s.id)
      fetchComments(s.id)
    })
  }

  const fetchReactions = async (id) => {
    const res = await api.get(`/reactions/shoutouts/${id}/summary`)
    setReactions(prev => ({ ...prev, [id]: res.data }))
  }

  const react = async (id, type) => {
    await api.post(`/reactions/shoutouts/${id}`, null, {
      params: { reaction_type: type },
    })
    fetchReactions(id)
  }

  const fetchComments = async (id) => {
    const res = await api.get(`/comments/comments/shoutouts/${id}`)
    setComments(prev => ({ ...prev, [id]: res.data }))
  }

  const postComment = async (id) => {
    if (!commentInput[id]) return
    await api.post(`/comments/shoutouts/${id}`, {
      message: commentInput[id],
    })
    setCommentInput(prev => ({ ...prev, [id]: "" }))
    fetchComments(id)
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      {shoutouts.map(s => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            marginBottom: 20,
          }}
        >
          {/* SHOUTOUT HEADER */}
          <h3>{s.message}</h3>
          <p style={{ fontSize: 12, color: "#666" }}>
            Posted by <b>{s.sender_email}</b> · {new Date(s.created_at).toLocaleString()}
          </p>

          {/* TAGGED USERS */}
          {s.recipients?.length > 0 && (
            <p style={{ fontSize: 13 }}>
              🎯 Tagged:{" "}
              {s.recipients.map((r, i) => (
                <span key={i} style={{ fontWeight: "bold" }}>
                  {r.receiver_email}
                  {i < s.recipients.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}

          {/* REACTIONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {REACTIONS.map(r => (
              <button
                key={r.type}
                onClick={() => react(s.id, r.type)}
              >
                {r.emoji} {reactions[s.id]?.[r.type] || 0}
              </button>
            ))}
          </div>

          {/* COMMENTS */}
          <div style={{ marginTop: 15 }}>
            <strong>Comments</strong>

            {(comments[s.id] || []).map(c => (
              <div key={c.id} style={{ marginTop: 6 }}>
                <b>{c.user_email}</b>: {c.message}
              </div>
            ))}

            <input
              placeholder="Write a comment..."
              value={commentInput[s.id] || ""}
              onChange={(e) =>
                setCommentInput(prev => ({ ...prev, [s.id]: e.target.value }))
              }
              style={{ width: "100%", marginTop: 8 }}
            />
            <button onClick={() => postComment(s.id)} style={{ marginTop: 6 }}>
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Feed