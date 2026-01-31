import { useEffect, useState } from "react"
import api from "../api/axios"

const Comments = ({ shoutoutId }) => {
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState("")

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${shoutoutId}`)
      setComments(res.data)
    } catch (err) {
      console.error("Failed to fetch comments", err)
    }
  }

  const postComment = async () => {
    if (!message.trim()) return

    try {
      await api.post("/comments", {
        shoutoutId,
        message
      })
      setMessage("")
      fetchComments()
    } catch (err) {
      console.error("Failed to post comment", err)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [shoutoutId])

  return (
    <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
      <strong>Comments</strong>

      {comments.length === 0 && <p>No comments yet</p>}

      {comments.map(c => (
        <div key={c.id} style={{ marginTop: "6px" }}>
          <b>{c.name} ({c.department})</b>
          <p style={{ margin: "2px 0" }}>{c.message}</p>
          <small>{new Date(c.created_at).toLocaleString()}</small>
        </div>
      ))}

      <div style={{ marginTop: "6px" }}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Write a comment..."
          style={{ width: "70%" }}
        />
        <button onClick={postComment} style={{ marginLeft: "6px" }}>
          Post
        </button>
      </div>
    </div>
  )
}

export default Comments
