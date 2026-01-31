
// // // // // // import { useEffect, useState } from "react"
// // // // // // import { useNavigate } from "react-router-dom"
// // // // // // import api from "../api/axios"

// // // // // // const Admin = () => {
// // // // // //   const navigate = useNavigate()

// // // // // //   const [status, setStatus] = useState("")
// // // // // //   const [data, setData] = useState([])
// // // // // //   const [view, setView] = useState("")
// // // // // //   const [error, setError] = useState("")

// // // // // //   const [commentId, setCommentId] = useState("")
// // // // // //   const [deleteMsg, setDeleteMsg] = useState("")

// // // // // //   useEffect(() => {
// // // // // //     checkAdmin()
// // // // // //   }, [])

// // // // // //   const checkAdmin = async () => {
// // // // // //     try {
// // // // // //       const res = await api.get("/admin/ping")
// // // // // //       setStatus(res.data.message)
// // // // // //     } catch {
// // // // // //       navigate("/dashboard")
// // // // // //     }
// // // // // //   }

// // // // // //   const loadTopContributors = async () => {
// // // // // //     setView("top")
// // // // // //     setError("")
// // // // // //     const res = await api.get("/admin/analytics/top-contributors")
// // // // // //     setData(res.data)
// // // // // //   }

// // // // // //   const loadMostTaggedUsers = async () => {
// // // // // //     setView("tagged")
// // // // // //     setError("")
// // // // // //     const res = await api.get("/admin/analytics/most-tagged-users")
// // // // // //     setData(res.data)
// // // // // //   }

// // // // // //   const loadReactionStats = async () => {
// // // // // //     setView("reactions")
// // // // // //     setError("")
// // // // // //     const res = await api.get("/admin/analytics/reaction-stats")
// // // // // //     setData(res.data)
// // // // // //   }

// // // // // //   const deleteComment = async () => {
// // // // // //     setDeleteMsg("")
// // // // // //     if (!commentId) {
// // // // // //       setDeleteMsg("Enter comment ID")
// // // // // //       return
// // // // // //     }
// // // // // //     try {
// // // // // //       await api.delete(`/admin/comments/${commentId}`)
// // // // // //       setDeleteMsg("Comment deleted successfully")
// // // // // //       setCommentId("")
// // // // // //     } catch {
// // // // // //       setDeleteMsg("Failed to delete comment")
// // // // // //     }
// // // // // //   }

// // // // // //   return (
// // // // // //     <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
// // // // // //       <h1 style={{ marginBottom: "5px" }}>Admin Dashboard</h1>
// // // // // //       <p style={{ color: "green", marginBottom: "30px" }}>{status}</p>

// // // // // //       {/* ACTION BUTTONS */}
// // // // // //       <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
// // // // // //         <button onClick={loadTopContributors}>Top Contributors</button>
// // // // // //         <button onClick={loadMostTaggedUsers}>Most Tagged Users</button>
// // // // // //         <button onClick={loadReactionStats}>Reaction Stats</button>
// // // // // //         <button onClick={() => navigate("/dashboard")}>Back</button>
// // // // // //       </div>

// // // // // //       {error && <p style={{ color: "red" }}>{error}</p>}

// // // // // //       {/* CONTENT CARD */}
// // // // // //       {view && (
// // // // // //         <div
// // // // // //           style={{
// // // // // //             background: "#f9f9f9",
// // // // // //             padding: "20px",
// // // // // //             borderRadius: "8px",
// // // // // //             boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// // // // // //             marginBottom: "30px",
// // // // // //           }}
// // // // // //         >
// // // // // //           {/* TOP CONTRIBUTORS */}
// // // // // //           {view === "top" && (
// // // // // //             <>
// // // // // //               <h3>Top Contributors</h3>
// // // // // //               <table width="100%" cellPadding="10">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th align="left">Email</th>
// // // // // //                     <th align="left">Shoutouts</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {data.map((u, i) => (
// // // // // //                     <tr key={i}>
// // // // // //                       <td>{u.email}</td>
// // // // // //                       <td>{u.count}</td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </table>
// // // // // //             </>
// // // // // //           )}

// // // // // //           {/* MOST TAGGED USERS */}
// // // // // //           {view === "tagged" && (
// // // // // //             <>
// // // // // //               <h3>Most Tagged Users</h3>
// // // // // //               <table width="100%" cellPadding="10">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th align="left">Email</th>
// // // // // //                     <th align="left">Tags</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {data.map((u, i) => (
// // // // // //                     <tr key={i}>
// // // // // //                       <td>{u.email}</td>
// // // // // //                       <td>{u.count}</td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </table>
// // // // // //             </>
// // // // // //           )}

// // // // // //           {/* REACTION STATS */}
// // // // // //           {view === "reactions" && (
// // // // // //             <>
// // // // // //               <h3>Reaction Stats</h3>
// // // // // //               <table width="100%" cellPadding="10">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th align="left">Reaction</th>
// // // // // //                     <th align="left">Count</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {data.map((r, i) => (
// // // // // //                     <tr key={i}>
// // // // // //                       <td>{r.reaction}</td>
// // // // // //                       <td>{r.count}</td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </table>
// // // // // //             </>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* DELETE COMMENT */}
// // // // // //       <div
// // // // // //         style={{
// // // // // //           background: "#fff4f4",
// // // // // //           padding: "20px",
// // // // // //           borderRadius: "8px",
// // // // // //           border: "1px solid #f1c0c0",
// // // // // //         }}
// // // // // //       >
// // // // // //         <h3>Moderation – Delete Comment</h3>
// // // // // //         <input
// // // // // //           type="number"
// // // // // //           placeholder="Comment ID"
// // // // // //           value={commentId}
// // // // // //           onChange={(e) => setCommentId(e.target.value)}
// // // // // //           style={{ marginRight: "10px", padding: "6px" }}
// // // // // //         />
// // // // // //         <button onClick={deleteComment}>Delete</button>
// // // // // //         {deleteMsg && <p>{deleteMsg}</p>}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default Admin



// // // // // import { useEffect, useState } from "react"
// // // // // import api from "../api/axios"

// // // // // const Admin = () => {
// // // // //   const [topContributors, setTopContributors] = useState([])
// // // // //   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
// // // // //   const [reactionStats, setReactionStats] = useState([])
// // // // //   const [shoutouts, setShoutouts] = useState([])
// // // // //   const [comments, setComments] = useState([])
// // // // //   const [loading, setLoading] = useState(true)

// // // // //   useEffect(() => {
// // // // //     const fetchAdminData = async () => {
// // // // //       try {
// // // // //         const [
// // // // //           contributorsRes,
// // // // //           taggedRes,
// // // // //           reactionsRes,
// // // // //           shoutoutsRes,
// // // // //         ] = await Promise.all([
// // // // //           api.get("/admin/analytics/top-contributors"),
// // // // //           api.get("/admin/analytics/most-tagged-users"),
// // // // //           api.get("/admin/analytics/reaction-stats"),
// // // // //           api.get("/shoutouts"),
// // // // //         ])

// // // // //         setTopContributors(contributorsRes.data || [])
// // // // //         setMostTaggedUsers(taggedRes.data || [])
// // // // //         setReactionStats(reactionsRes.data || [])
// // // // //         setShoutouts(shoutoutsRes.data || [])
// // // // //       } catch (err) {
// // // // //         console.error("Admin fetch failed", err)
// // // // //       } finally {
// // // // //         setLoading(false)
// // // // //       }
// // // // //     }

// // // // //     fetchAdminData()
// // // // //   }, [])

// // // // //   const fetchCommentsForShoutout = async (shoutoutId) => {
// // // // //     const res = await api.get(`/comments?shoutout_id=${shoutoutId}`)
// // // // //     setComments(res.data || [])
// // // // //   }

// // // // //   const deleteShoutout = async (id) => {
// // // // //     if (!window.confirm("Delete shoutout?")) return
// // // // //     await api.delete(`/admin/shoutouts/${id}`)
// // // // //     setShoutouts(prev => prev.filter(s => s.id !== id))
// // // // //   }

// // // // //   const deleteComment = async (id) => {
// // // // //     if (!window.confirm("Delete comment?")) return
// // // // //     await api.delete(`/admin/comments/${id}`)
// // // // //     setComments(prev => prev.filter(c => c.id !== id))
// // // // //   }

// // // // //   if (loading) return <p>Loading Admin Dashboard...</p>

// // // // //   return (
// // // // //     <div style={{ padding: 20 }}>
// // // // //       <h1>Admin Dashboard</h1>

// // // // //       {/* ANALYTICS */}
// // // // //       <h2>Top Contributors</h2>
// // // // //       <table border="1">
// // // // //         <thead>
// // // // //           <tr><th>Email</th><th>Count</th></tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {topContributors.map((u, i) => (
// // // // //             <tr key={i}>
// // // // //               <td>{u.email}</td>
// // // // //               <td>{u.count}</td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>

// // // // //       <h2>Most Tagged Users</h2>
// // // // //       <table border="1">
// // // // //         <thead>
// // // // //           <tr><th>Email</th><th>Tags</th></tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {mostTaggedUsers.map((u, i) => (
// // // // //             <tr key={i}>
// // // // //               <td>{u.receiver_email}</td>
// // // // //               <td>{u.tag_count}</td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>

// // // // //       <h2>Reaction Stats</h2>
// // // // //       <table border="1">
// // // // //         <thead>
// // // // //           <tr><th>Reaction</th><th>Count</th></tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {reactionStats.map((r, i) => (
// // // // //             <tr key={i}>
// // // // //               <td>{r.reaction_type}</td>
// // // // //               <td>{r.count}</td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>

// // // // //       {/* MODERATION */}
// // // // //       <h2>All Shoutouts (Moderation)</h2>
// // // // //       <table border="1">
// // // // //         <thead>
// // // // //           <tr>
// // // // //             <th>ID</th>
// // // // //             <th>Message</th>
// // // // //             <th>Action</th>
// // // // //             <th>Comments</th>
// // // // //           </tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {shoutouts.map(s => (
// // // // //             <tr key={s.id}>
// // // // //               <td>{s.id}</td>
// // // // //               <td>{s.message}</td>
// // // // //               <td>
// // // // //                 <button onClick={() => deleteShoutout(s.id)}>Delete</button>
// // // // //               </td>
// // // // //               <td>
// // // // //                 <button onClick={() => fetchCommentsForShoutout(s.id)}>
// // // // //                   View Comments
// // // // //                 </button>
// // // // //               </td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>

// // // // //       {comments.length > 0 && (
// // // // //         <>
// // // // //           <h2>Comments</h2>
// // // // //           <table border="1">
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 <th>ID</th>
// // // // //                 <th>Message</th>
// // // // //                 <th>Action</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {comments.map(c => (
// // // // //                 <tr key={c.id}>
// // // // //                   <td>{c.id}</td>
// // // // //                   <td>{c.message}</td>
// // // // //                   <td>
// // // // //                     <button onClick={() => deleteComment(c.id)}>Delete</button>
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default Admin





// // // // import { useEffect, useState } from "react"
// // // // import api from "../api/axios"

// // // // const Admin = () => {
// // // //   const [topContributors, setTopContributors] = useState([])
// // // //   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
// // // //   const [reactionStats, setReactionStats] = useState([])
// // // //   const [shoutouts, setShoutouts] = useState([])
// // // //   const [loading, setLoading] = useState(true)

// // // //   useEffect(() => {
// // // //     const fetchAdminData = async () => {
// // // //       try {
// // // //         const contributorsRes = await api.get("/admin/analytics/top-contributors")
// // // //         const taggedRes = await api.get("/admin/analytics/most-tagged-users?limit=10")
// // // //         const reactionsRes = await api.get("/admin/analytics/reaction-stats")
// // // //         const shoutoutsRes = await api.get("/shoutouts")

// // // //         console.log("Top Contributors:", contributorsRes.data)
// // // //         console.log("Most Tagged:", taggedRes.data)
// // // //         console.log("Reactions:", reactionsRes.data)
// // // //         console.log("Shoutouts:", shoutoutsRes.data)

// // // //         setTopContributors(Array.isArray(contributorsRes.data) ? contributorsRes.data : [])
// // // //         setMostTaggedUsers(Array.isArray(taggedRes.data) ? taggedRes.data : [])
// // // //         setReactionStats(Array.isArray(reactionsRes.data) ? reactionsRes.data : [])
// // // //         setShoutouts(Array.isArray(shoutoutsRes.data) ? shoutoutsRes.data : [])
// // // //       } catch (err) {
// // // //         console.error("Admin fetch failed", err)
// // // //       } finally {
// // // //         setLoading(false)
// // // //       }
// // // //     }

// // // //     fetchAdminData()
// // // //   }, [])

// // // //   const deleteShoutout = async (id) => {
// // // //     if (!window.confirm("Delete this shoutout?")) return
// // // //     await api.delete(`/admin/shoutouts/${id}`)
// // // //     setShoutouts(prev => prev.filter(s => s.id !== id))
// // // //   }

// // // //   if (loading) return <p>Loading admin dashboard…</p>

// // // //   return (
// // // //     <div style={{ padding: 30 }}>
// // // //       <h1>Admin Dashboard</h1>

// // // //       <h2>Top Contributors</h2>
// // // //       <table border="1" cellPadding="6">
// // // //         <thead>
// // // //           <tr><th>Email</th><th>Count</th></tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {topContributors.map((u, i) => (
// // // //             <tr key={i}>
// // // //               <td>{u.email}</td>
// // // //               <td>{u.count}</td>
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>

// // // //       <h2>Most Tagged Users</h2>
// // // //       <table border="1" cellPadding="6">
// // // //         <thead>
// // // //           <tr><th>Email</th><th>Tags</th></tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {mostTaggedUsers.map((u, i) => (
// // // //             <tr key={i}>
// // // //               <td>{u.receiver_email}</td>
// // // //               <td>{u.tag_count}</td>
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>

// // // //       <h2>Reaction Stats</h2>
// // // //       <table border="1" cellPadding="6">
// // // //         <thead>
// // // //           <tr><th>Reaction</th><th>Count</th></tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {reactionStats.map((r, i) => (
// // // //             <tr key={i}>
// // // //               <td>{r.reaction_type}</td>
// // // //               <td>{r.count}</td>
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>

// // // //       <h2>All Shoutouts (Moderation)</h2>
// // // //       <table border="1" cellPadding="6">
// // // //         <thead>
// // // //           <tr>
// // // //             <th>ID</th>
// // // //             <th>Message</th>
// // // //             <th>Action</th>
// // // //           </tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {shoutouts.map(s => (
// // // //             <tr key={s.id}>
// // // //               <td>{s.id}</td>
// // // //               <td>{s.message}</td>
// // // //               <td>
// // // //                 <button onClick={() => deleteShoutout(s.id)}>
// // // //                   Delete
// // // //                 </button>
// // // //               </td>
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default Admin



// // // import { useEffect, useState } from "react"
// // // import api from "../api/axios"

// // // const Admin = () => {
// // //   const [topContributors, setTopContributors] = useState([])
// // //   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
// // //   const [reactionStats, setReactionStats] = useState([])
// // //   const [shoutouts, setShoutouts] = useState([])
// // //   const [loading, setLoading] = useState(true)

// // //   useEffect(() => {
// // //     const fetchAdminData = async () => {
// // //       try {
// // //         const contributorsRes = await api.get("/admin/analytics/top-contributors")
// // //         const taggedRes = await api.get("/admin/analytics/most-tagged-users?limit=10")
// // //         const reactionsRes = await api.get("/admin/analytics/reaction-stats")
// // //         const shoutoutsRes = await api.get("/shoutouts")

// // //         setTopContributors(contributorsRes.data || [])
// // //         setMostTaggedUsers(taggedRes.data || [])
// // //         setReactionStats(reactionsRes.data || [])
// // //         setShoutouts(shoutoutsRes.data || [])
// // //       } catch (err) {
// // //         console.error(err)
// // //       } finally {
// // //         setLoading(false)
// // //       }
// // //     }

// // //     fetchAdminData()
// // //   }, [])

// // //   const deleteShoutout = async (id) => {
// // //     if (!window.confirm("Delete this shoutout?")) return
// // //     await api.delete(`/admin/shoutouts/${id}`)
// // //     setShoutouts(prev => prev.filter(s => s.id !== id))
// // //   }

// // //   if (loading) return <p style={{ padding: 30 }}>Loading Admin Dashboard...</p>

// // //   return (
// // //     <div style={styles.page}>
// // //       <h1 style={styles.title}>Admin Dashboard</h1>

// // //       <Section title="Top Contributors">
// // //         <Table
// // //           headers={["Email", "Count"]}
// // //           rows={topContributors.map(u => [u.email, u.count])}
// // //         />
// // //       </Section>

// // //       <Section title="Most Tagged Users">
// // //         <Table
// // //           headers={["Email", "Tags"]}
// // //           rows={mostTaggedUsers.map(u => [u.receiver_email, u.tag_count])}
// // //         />
// // //       </Section>

// // //       <Section title="Reaction Stats">
// // //         <Table
// // //           headers={["Reaction", "Count"]}
// // //           rows={reactionStats.map(r => [r.reaction_type, r.count])}
// // //         />
// // //       </Section>

// // //       <Section title="All Shoutouts (Moderation)">
// // //         <table style={styles.table}>
// // //           <thead>
// // //             <tr>
// // //               <th style={styles.th}>ID</th>
// // //               <th style={styles.th}>Message</th>
// // //               <th style={styles.th}>Action</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {shoutouts.map(s => (
// // //               <tr key={s.id}>
// // //                 <td style={styles.td}>{s.id}</td>
// // //                 <td style={styles.td}>{s.message}</td>
// // //                 <td style={styles.td}>
// // //                   <button
// // //                     style={styles.deleteBtn}
// // //                     onClick={() => deleteShoutout(s.id)}
// // //                   >
// // //                     Delete
// // //                   </button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </Section>
// // //     </div>
// // //   )
// // // }

// // // /* ---------- Reusable UI ---------- */

// // // const Section = ({ title, children }) => (
// // //   <div style={styles.section}>
// // //     <h2 style={styles.sectionTitle}>{title}</h2>
// // //     {children}
// // //   </div>
// // // )

// // // const Table = ({ headers, rows }) => (
// // //   <table style={styles.table}>
// // //     <thead>
// // //       <tr>
// // //         {headers.map((h, i) => (
// // //           <th key={i} style={styles.th}>{h}</th>
// // //         ))}
// // //       </tr>
// // //     </thead>
// // //     <tbody>
// // //       {rows.map((row, i) => (
// // //         <tr key={i}>
// // //           {row.map((cell, j) => (
// // //             <td key={j} style={styles.td}>{cell}</td>
// // //           ))}
// // //         </tr>
// // //       ))}
// // //     </tbody>
// // //   </table>
// // // )

// // // /* ---------- Styles ---------- */

// // // const styles = {
// // //   page: {
// // //     padding: "30px",
// // //     maxWidth: "1000px",
// // //     margin: "auto",
// // //     fontFamily: "Arial, sans-serif",
// // //   },
// // //   title: {
// // //     marginBottom: "20px",
// // //   },
// // //   section: {
// // //     marginBottom: "30px",
// // //     padding: "15px",
// // //     border: "1px solid #ddd",
// // //     borderRadius: "6px",
// // //     backgroundColor: "#fafafa",
// // //   },
// // //   sectionTitle: {
// // //     marginBottom: "10px",
// // //   },
// // //   table: {
// // //     width: "100%",
// // //     borderCollapse: "collapse",
// // //   },
// // //   th: {
// // //     borderBottom: "2px solid #ccc",
// // //     textAlign: "left",
// // //     padding: "8px",
// // //     backgroundColor: "#f0f0f0",
// // //   },
// // //   td: {
// // //     borderBottom: "1px solid #ddd",
// // //     padding: "8px",
// // //   },
// // //   deleteBtn: {
// // //     backgroundColor: "#d9534f",
// // //     color: "white",
// // //     border: "none",
// // //     padding: "6px 10px",
// // //     cursor: "pointer",
// // //     borderRadius: "4px",
// // //   },
// // // }

// // // export default Admin



// // import { useEffect, useState } from "react"
// // import api from "../api/axios"

// // const Admin = () => {
// //   // ---------- STATE ----------
// //   // Stores analytics + moderation data from backend
// //   const [topContributors, setTopContributors] = useState([])
// //   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
// //   const [reactionStats, setReactionStats] = useState([])
// //   const [shoutouts, setShoutouts] = useState([])

// //   // Used to prevent UI rendering before data loads
// //   const [loading, setLoading] = useState(true)

// //   // ---------- FETCH ADMIN DATA ----------
// //   useEffect(() => {
// //     const fetchAdminData = async () => {
// //       try {
// //         // Each API call maps to an Admin requirement
// //         const contributorsRes = await api.get("/admin/analytics/top-contributors")
// //         const taggedRes = await api.get("/admin/analytics/most-tagged-users?limit=10")
// //         const reactionsRes = await api.get("/admin/analytics/reaction-stats")
// //         const shoutoutsRes = await api.get("/shoutouts")

// //         // Safely update state (fallback prevents crashes)
// //         setTopContributors(contributorsRes.data || [])
// //         setMostTaggedUsers(taggedRes.data || [])
// //         setReactionStats(reactionsRes.data || [])
// //         setShoutouts(shoutoutsRes.data || [])
// //       } catch (err) {
// //         console.error("Admin dashboard fetch failed", err)
// //       } finally {
// //         // Ensures UI renders only AFTER data is ready
// //         setLoading(false)
// //       }
// //     }

// //     fetchAdminData()
// //   }, [])

// //   // ---------- DELETE SHOUTOUT (MODERATION) ----------
// //   const deleteShoutout = async (id) => {
// //     // Confirmation prevents accidental deletion
// //     if (!window.confirm("Delete this shoutout?")) return

// //     // Backend moderation action
// //     await api.delete(`/admin/shoutouts/${id}`)

// //     // Frontend state update (no refetch needed)
// //     setShoutouts(prev => prev.filter(s => s.id !== id))
// //   }

// //   // 🔽 ADD THIS FUNCTION INSIDE Admin COMPONENT (below deleteShoutout)

// // const exportCSV = async (type) => {
// //   try {
// //     const res = await api.get(`/admin/analytics/${type}/export`, {
// //       responseType: "blob",
// //     })

// //     const blob = new Blob([res.data], { type: "text/csv" })
// //     const url = window.URL.createObjectURL(blob)

// //     const a = document.createElement("a")
// //     a.href = url
// //     a.download = `${type}.csv`
// //     a.click()

// //     window.URL.revokeObjectURL(url)
// //   } catch (err) {
// //     alert("CSV export failed")
// //   }
// // }




// //   // ---------- LOADING STATE ----------
// //   if (loading) {
// //     return <p style={{ padding: 30 }}>Loading Admin Dashboard...</p>
// //   }

// //   // ---------- UI ----------
// //   return (
// //     <div style={styles.page}>
// //       <h1 style={styles.title}>Admin Dashboard</h1>

// //       {/* TOP CONTRIBUTORS ANALYTICS */}
// //       <Section title="Top Contributors">
// //         <Table
// //           headers={["Email", "Count"]}
// //           rows={topContributors.map(u => [u.email, u.count])}
// //         />
// //       </Section>

// //       {/* MOST TAGGED USERS ANALYTICS */}
// //       <Section title="Most Tagged Users">
// //         <Table
// //           headers={["Email", "Tags"]}
// //           rows={mostTaggedUsers.map(u => [u.receiver_email, u.tag_count])}
// //         />
// //       </Section>

// //       {/* REACTION ANALYTICS */}
// //       <Section title="Reaction Stats">
// //         <Table
// //           headers={["Reaction", "Count"]}
// //           rows={reactionStats.map(r => [r.reaction_type, r.count])}
// //         />
// //       </Section>

// //       {/* SHOUTOUT MODERATION */}
// //       <Section title="All Shoutouts (Moderation)">
// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th style={styles.th}>ID</th>
// //               <th style={styles.th}>Message</th>
// //               <th style={styles.th}>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {shoutouts.map(s => (
// //               <tr key={s.id}>
// //                 <td style={styles.td}>{s.id}</td>
// //                 <td style={styles.td}>{s.message}</td>
// //                 <td style={styles.td}>
// //                   <button
// //                     style={styles.deleteBtn}
// //                     onClick={() => deleteShoutout(s.id)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </Section>
// //     </div>
// //   )
// // }

// // /* ---------- REUSABLE LAYOUT COMPONENT ---------- */
// // // Prevents duplication and keeps layout consistent
// // const Section = ({ title, children }) => (
// //   <div style={styles.section}>
// //     <h2 style={styles.sectionTitle}>{title}</h2>
// //     {children}
// //   </div>
// // )

// // /* ---------- GENERIC TABLE COMPONENT ---------- */
// // // Used for all analytics tables
// // const Table = ({ headers, rows }) => (
// //   <table style={styles.table}>
// //     <thead>
// //       <tr>
// //         {headers.map((h, i) => (
// //           <th key={i} style={styles.th}>{h}</th>
// //         ))}
// //       </tr>
// //     </thead>
// //     <tbody>
// //       {rows.map((row, i) => (
// //         <tr key={i}>
// //           {row.map((cell, j) => (
// //             <td key={j} style={styles.td}>{cell}</td>
// //           ))}
// //         </tr>
// //       ))}
// //     </tbody>
// //   </table>
// // )

// // /* ---------- INLINE STYLES ---------- */
// // // Inline CSS ensures:
// // // 1. No Tailwind conflicts
// // // 2. Predictable layout
// // // 3. Easier debugging
// // const styles = {
// //   page: {
// //     padding: "30px",
// //     maxWidth: "1000px",
// //     margin: "auto",
// //     fontFamily: "Arial, sans-serif",
// //   },
// //   title: {
// //     marginBottom: "20px",
// //   },
// //   section: {
// //     marginBottom: "30px",
// //     padding: "15px",
// //     border: "1px solid #ddd",
// //     borderRadius: "6px",
// //     backgroundColor: "#fafafa",
// //   },
// //   sectionTitle: {
// //     marginBottom: "10px",
// //   },
// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //   },
// //   th: {
// //     borderBottom: "2px solid #ccc",
// //     textAlign: "left",
// //     padding: "8px",
// //     backgroundColor: "#f0f0f0",
// //   },
// //   td: {
// //     borderBottom: "1px solid #ddd",
// //     padding: "8px",
// //   },
// //   deleteBtn: {
// //     backgroundColor: "#d9534f",
// //     color: "white",
// //     border: "none",
// //     padding: "6px 10px",
// //     cursor: "pointer",
// //     borderRadius: "4px",
// //   },
// // }

// // export default Admin




// // import { useEffect, useState } from "react"
// // import api from "../api/axios"

// // const Admin = () => {
// //   const [topContributors, setTopContributors] = useState([])
// //   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
// //   const [reactionStats, setReactionStats] = useState([])
// //   const [shoutouts, setShoutouts] = useState([])
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     const fetchAdminData = async () => {
// //       try {
// //         const contributorsRes = await api.get("/admin/analytics/top-contributors")
// //         const taggedRes = await api.get("/admin/analytics/most-tagged-users?limit=10")
// //         const reactionsRes = await api.get("/admin/analytics/reaction-stats")
// //         const shoutoutsRes = await api.get("/shoutouts")

// //         setTopContributors(contributorsRes.data || [])
// //         setMostTaggedUsers(taggedRes.data || [])
// //         setReactionStats(reactionsRes.data || [])
// //         setShoutouts(shoutoutsRes.data || [])
// //       } catch (err) {
// //         console.error("Admin dashboard fetch failed", err)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchAdminData()
// //   }, [])

// //   const deleteShoutout = async (id) => {
// //     if (!window.confirm("Delete this shoutout?")) return
// //     await api.delete(`/admin/shoutouts/${id}`)
// //     setShoutouts(prev => prev.filter(s => s.id !== id))
// //   }

// //   const exportCSV = async (endpoint, filename) => {
// //     const res = await api.get(endpoint, { responseType: "blob" })
// //     const blob = new Blob([res.data], { type: "text/csv" })
// //     const url = window.URL.createObjectURL(blob)
// //     const a = document.createElement("a")
// //     a.href = url
// //     a.download = filename
// //     a.click()
// //     window.URL.revokeObjectURL(url)
// //   }

// //   if (loading) return <p style={{ padding: 30 }}>Loading Admin Dashboard...</p>

// //   return (
// //     <div style={styles.page}>
// //       <h1 style={styles.title}>Admin Dashboard</h1>

// //       <Section title="Top Contributors">
// //         <button
// //           style={styles.exportBtn}
// //           onClick={() =>
// //             exportCSV("/admin/analytics/top-contributors/export", "top_contributors.csv")
// //           }
// //         >
// //           Export CSV
// //         </button>
// //         <Table
// //           headers={["Email", "Count"]}
// //           rows={topContributors.map(u => [u.email, u.count])}
// //         />
// //       </Section>

// //       <Section title="Most Tagged Users">
// //         <button
// //           style={styles.exportBtn}
// //           onClick={() =>
// //             exportCSV("/admin/analytics/most-tagged-users/export", "most_tagged_users.csv")
// //           }
// //         >
// //           Export CSV
// //         </button>
// //         <Table
// //           headers={["Email", "Tags"]}
// //           rows={mostTaggedUsers.map(u => [u.receiver_email, u.tag_count])}
// //         />
// //       </Section>

// //       <Section title="Reaction Stats">
// //         <button
// //           style={styles.exportBtn}
// //           onClick={() =>
// //             exportCSV("/admin/analytics/reaction-stats/export", "reaction_stats.csv")
// //           }
// //         >
// //           Export CSV
// //         </button>
// //         <Table
// //           headers={["Reaction", "Count"]}
// //           rows={reactionStats.map(r => [r.reaction_type, r.count])}
// //         />
// //       </Section>

// //       <Section title="All Shoutouts (Moderation)">
// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th style={styles.th}>ID</th>
// //               <th style={styles.th}>Message</th>
// //               <th style={styles.th}>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {shoutouts.map(s => (
// //               <tr key={s.id}>
// //                 <td style={styles.td}>{s.id}</td>
// //                 <td style={styles.td}>{s.message}</td>
// //                 <td style={styles.td}>
// //                   <button
// //                     style={styles.deleteBtn}
// //                     onClick={() => deleteShoutout(s.id)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </Section>
// //     </div>
// //   )
// // }

// // const Section = ({ title, children }) => (
// //   <div style={styles.section}>
// //     <h2 style={styles.sectionTitle}>{title}</h2>
// //     {children}
// //   </div>
// // )

// // const Table = ({ headers, rows }) => (
// //   <table style={styles.table}>
// //     <thead>
// //       <tr>
// //         {headers.map((h, i) => (
// //           <th key={i} style={styles.th}>{h}</th>
// //         ))}
// //       </tr>
// //     </thead>
// //     <tbody>
// //       {rows.map((row, i) => (
// //         <tr key={i}>
// //           {row.map((cell, j) => (
// //             <td key={j} style={styles.td}>{cell}</td>
// //           ))}
// //         </tr>
// //       ))}
// //     </tbody>
// //   </table>
// // )

// // const styles = {
// //   page: {
// //     padding: "30px",
// //     maxWidth: "1000px",
// //     margin: "auto",
// //     fontFamily: "Arial, sans-serif",
// //   },
// //   title: {
// //     marginBottom: "20px",
// //   },
// //   section: {
// //     marginBottom: "30px",
// //     padding: "15px",
// //     border: "1px solid #ddd",
// //     borderRadius: "6px",
// //     backgroundColor: "#fafafa",
// //   },
// //   sectionTitle: {
// //     marginBottom: "10px",
// //   },
// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //   },
// //   th: {
// //     borderBottom: "2px solid #ccc",
// //     textAlign: "left",
// //     padding: "8px",
// //     backgroundColor: "#f0f0f0",
// //   },
// //   td: {
// //     borderBottom: "1px solid #ddd",
// //     padding: "8px",
// //   },
// //   deleteBtn: {
// //     backgroundColor: "#d9534f",
// //     color: "white",
// //     border: "none",
// //     padding: "6px 10px",
// //     cursor: "pointer",
// //     borderRadius: "4px",
// //   },
// //   exportBtn: {
// //     marginBottom: "10px",
// //     backgroundColor: "#0275d8",
// //     color: "white",
// //     border: "none",
// //     padding: "6px 12px",
// //     cursor: "pointer",
// //     borderRadius: "4px",
// //   },
// // }

// // export default Admin



// import { useEffect, useState } from "react"
// import api from "../api/axios"

// // =======================
// // Main Admin Component
// // =======================
// const Admin = () => {
//   const [topContributors, setTopContributors] = useState([])
//   const [mostTaggedUsers, setMostTaggedUsers] = useState([])
//   const [reactionStats, setReactionStats] = useState([])
//   const [shoutouts, setShoutouts] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Fetch all dashboard data
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const [contributorsRes, taggedRes, reactionsRes, shoutoutsRes] = await Promise.all([
//           api.get("/admin/analytics/top-contributors"),
//           api.get("/admin/analytics/most-tagged-users?limit=10"),
//           api.get("/admin/analytics/reaction-stats"),
//           api.get("/shoutouts"),
//         ])

//         setTopContributors(contributorsRes.data || [])
//         setMostTaggedUsers(taggedRes.data || [])
//         setReactionStats(reactionsRes.data || [])
//         setShoutouts(shoutoutsRes.data || [])
//       } catch (err) {
//         console.error("Admin dashboard fetch failed", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAdminData()
//   }, [])

//   // Delete shoutout
//   const deleteShoutout = async (id) => {
//     if (!window.confirm("Delete this shoutout?")) return
//     await api.delete(`/admin/shoutouts/${id}`)
//     setShoutouts(prev => prev.filter(s => s.id !== id))
//   }

//   // Export CSV utility
//   const exportCSV = async (endpoint, filename) => {
//     const res = await api.get(endpoint, { responseType: "blob" })
//     const blob = new Blob([res.data], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = filename
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   if (loading) return <p style={{ padding: 30 }}>Loading Admin Dashboard...</p>

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.title}>Admin Dashboard</h1>

//       {/* Top Contributors */}
//       <Section title="Top Contributors">
//         <ExportButton
//           onClick={() =>
//             exportCSV("/admin/analytics/top-contributors/export", "top_contributors.csv")
//           }
//         />
//         <Table
//           headers={["Email", "Count"]}
//           rows={topContributors.map(u => [u.email, u.count])}
//         />
//       </Section>

//       {/* Most Tagged Users */}
//       <Section title="Most Tagged Users">
//         <ExportButton
//           onClick={() =>
//             exportCSV("/admin/analytics/most-tagged-users/export", "most_tagged_users.csv")
//           }
//         />
//         <Table
//           headers={["Email", "Tags"]}
//           rows={mostTaggedUsers.map(u => [u.receiver_email, u.tag_count])}
//         />
//       </Section>

//       {/* Reaction Stats */}
//       <Section title="Reaction Stats">
//         <ExportButton
//           onClick={() =>
//             exportCSV("/admin/analytics/reaction-stats/export", "reaction_stats.csv")
//           }
//         />
//         <Table
//           headers={["Reaction", "Count"]}
//           rows={reactionStats.map(r => [r.reaction_type, r.count])}
//         />
//       </Section>

//       {/* Shoutouts Moderation */}
//       <Section title="All Shoutouts (Moderation)">
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>ID</th>
//               <th style={styles.th}>Message</th>
//               <th style={styles.th}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {shoutouts.map(s => (
//               <tr key={s.id}>
//                 <td style={styles.td}>{s.id}</td>
//                 <td style={styles.td}>{s.message}</td>
//                 <td style={styles.td}>
//                   <button
//                     style={styles.deleteBtn}
//                     onClick={() => deleteShoutout(s.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Section>
//     </div>
//   )
// }

// // =======================
// // Reusable Components
// // =======================
// const Section = ({ title, children }) => (
//   <div style={styles.section}>
//     <h2 style={styles.sectionTitle}>{title}</h2>
//     {children}
//   </div>
// )

// const Table = ({ headers, rows }) => (
//   <table style={styles.table}>
//     <thead>
//       <tr>
//         {headers.map((h, i) => (
//           <th key={i} style={styles.th}>{h}</th>
//         ))}
//       </tr>
//     </thead>
//     <tbody>
//       {rows.map((row, i) => (
//         <tr key={i}>
//           {row.map((cell, j) => (
//             <td key={j} style={styles.td}>{cell}</td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   </table>
// )

// const ExportButton = ({ onClick }) => (
//   <button
//     style={styles.exportBtn}
//     onClick={onClick}
//     onMouseOver={(e) => (e.target.style.backgroundColor = "#025aa5")}
//     onMouseOut={(e) => (e.target.style.backgroundColor = "#0275d8")}
//   >
//     Export CSV
//   </button>
// )

// // =======================
// // Styles
// // =======================
// const styles = {
//   page: {
//     padding: "30px",
//     maxWidth: "1000px",
//     margin: "auto",
//     fontFamily: "'Segoe UI', Arial, sans-serif",
//   },
//   title: {
//     fontSize: "48px",
//     color: "#2c3e50",
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
//     marginBottom: "30px",
//   },
//   section: {
//     marginBottom: "30px",
//     padding: "15px",
//     border: "1px solid #ddd",
//     borderRadius: "6px",
//     backgroundColor: "#fafafa",
//   },
//   sectionTitle: {
//     fontSize: "24px",
//     fontWeight: "600",
//     color: "#34495e",
//     marginBottom: "10px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     borderBottom: "2px solid #ccc",
//     textAlign: "left",
//     padding: "8px",
//     backgroundColor: "#f0f0f0",
//   },
//   td: {
//     borderBottom: "1px solid #ddd",
//     padding: "8px",
//   },
//   deleteBtn: {
//     backgroundColor: "#d9534f",
//     color: "white",
//     border: "none",
//     padding: "6px 10px",
//     cursor: "pointer",
//     borderRadius: "4px",
//   },
//   exportBtn: {
//     marginBottom: "10px",
//     backgroundColor: "#0275d8",
//     color: "white",
//     border: "none",
//     padding: "6px 12px",
//     cursor: "pointer",
//     borderRadius: "4px",
//     transition: "background-color 0.3s ease",
//   },
// }

// export default Admin




import { useEffect, useState } from "react"
import api from "../api/axios"

// =======================
// Main Admin Component
// =======================
const Admin = () => {
  const [topContributors, setTopContributors] = useState([])
  const [mostTaggedUsers, setMostTaggedUsers] = useState([])
  const [reactionStats, setReactionStats] = useState([])
  const [shoutouts, setShoutouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [contributorsRes, taggedRes, reactionsRes, shoutoutsRes] = await Promise.all([
          api.get("/admin/analytics/top-contributors"),
          api.get("/admin/analytics/most-tagged-users?limit=10"),
          api.get("/admin/analytics/reaction-stats"),
          api.get("/shoutouts"),
        ])

        setTopContributors(contributorsRes.data || [])
        setMostTaggedUsers(taggedRes.data || [])
        setReactionStats(reactionsRes.data || [])
        setShoutouts(shoutoutsRes.data || [])
      } catch (err) {
        console.error("Admin dashboard fetch failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const deleteShoutout = async (id) => {
    if (!window.confirm("Delete this shoutout?")) return
    await api.delete(`/admin/shoutouts/${id}`)
    setShoutouts(prev => prev.filter(s => s.id !== id))
  }

  const exportCSV = async (endpoint, filename) => {
    const res = await api.get(endpoint, { responseType: "blob" })
    const blob = new Blob([res.data], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return <p style={{ padding: 30 }}>Loading Admin Dashboard...</p>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>⚡ Admin Dashboard</h1>

      <Section title="Top Contributors">
        <ExportButton
          onClick={() =>
            exportCSV("/admin/analytics/top-contributors/export", "top_contributors.csv")
          }
        />
        <Table
          headers={["Email", "Count"]}
          rows={topContributors.map(u => [u.email, u.count])}
        />
      </Section>

      <Section title="Most Tagged Users">
        <ExportButton
          onClick={() =>
            exportCSV("/admin/analytics/most-tagged-users/export", "most_tagged_users.csv")
          }
        />
        <Table
          headers={["Email", "Tags"]}
          rows={mostTaggedUsers.map(u => [u.receiver_email, u.tag_count])}
        />
      </Section>

      <Section title="Reaction Stats">
        <ExportButton
          onClick={() =>
            exportCSV("/admin/analytics/reaction-stats/export", "reaction_stats.csv")
          }
        />
        <Table
          headers={["Reaction", "Count"]}
          rows={reactionStats.map(r => [r.reaction_type, r.count])}
        />
      </Section>

      <Section title="All Shoutouts (Moderation)">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {shoutouts.map(s => (
              <tr key={s.id} style={styles.rowHover}>
                <td style={styles.td}>{s.id}</td>
                <td style={styles.td}>{s.message}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteShoutout(s.id)}
                  >
                    ✖ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}

// =======================
// Reusable Components
// =======================
const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
)

const Table = ({ headers, rows }) => (
  <table style={styles.table}>
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} style={styles.th}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} style={styles.rowHover}>
          {row.map((cell, j) => (
            <td key={j} style={styles.td}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

const ExportButton = ({ onClick }) => (
  <button
    style={styles.exportBtn}
    onClick={onClick}
  >
    ⬇ Export CSV
  </button>
)

// =======================
// Styles with Animations
// =======================
const styles = {
  page: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: "linear-gradient(135deg, #f9f9f9, #eef2f3)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    animation: "fadeIn 1s ease-in-out",
  },
  title: {
    fontSize: "52px",
    color: "#2c3e50",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "2px 2px 6px rgba(0,0,0,0.2)",
    marginBottom: "40px",
    letterSpacing: "1px",
    animation: "slideDown 0.8s ease",
  },
  section: {
    marginBottom: "35px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#34495e",
    marginBottom: "15px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    borderBottom: "2px solid #ccc",
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "white",
    fontWeight: "600",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    transition: "background-color 0.3s ease",
  },
  rowHover: {
    transition: "background-color 0.3s ease",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  exportBtn: {
    marginBottom: "15px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
}

// =======================
// Keyframe Animations (inject via CSS)
// =======================
// Add this to your global CSS file:
//
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
//
// @keyframes slideDown {
//   from { transform: translateY(-30px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }
//
// button:hover {
//   transform: scale(1.05);
//   background-color: #2980b9 !important;
// }
//
// tr:hover td {
//   background-color: #f9f9f9;
// }

export default Admin