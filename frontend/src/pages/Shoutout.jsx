import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Award, ChevronLeft, Send, Users, LayoutDashboard, Gift } from "lucide-react"
import api from "../api/axios"

const CORE_VALUES = [
  { id: 1, name: "Customer Obsession", icon: "🎯" },
  { id: 2, name: "Take Ownership", icon: "🛡️" },
  { id: 3, name: "Deliver Results", icon: "🚀" },
  { id: 4, name: "Think Big", icon: "🌟" },
]
const POINTS_PRESETS = [10, 50, 100]

const Shoutout = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState([])
  const [receiverId, setReceiverId] = useState("")
  const [coreValue, setCoreValue] = useState(1)
  const [points, setPoints] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data || [])).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/shoutouts/", null, {
        params: { message, receiver_id: receiverId, points, core_value_id: coreValue },
      })
      navigate("/feed")
    } catch {
      alert("Failed to send shoutout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = receiverId && message.trim() && !loading

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="app-nav">
        <div className="app-nav-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900 text-base">Bragboard</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { label: "Feed", path: "/feed", icon: Users },
              { label: "Shoutout", path: "/shoutout", icon: Award },
              { label: "Rewards", path: "/rewards", icon: Gift },
            ].map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 text-body px-3 py-1.5 rounded-md transition-colors font-medium
                  ${path === "/shoutout"
                    ? "text-primary-700 bg-primary-50"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"}`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </nav>
          <button onClick={() => navigate("/dashboard")} className="btn-ghost text-body-sm">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </nav>

      <div className="page-container max-w-2xl mx-auto">
        {/* Page heading */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-h1 text-neutral-900">Send a Shoutout</h1>
          <p className="text-body text-neutral-500 mt-1">Recognize a teammate's great contribution.</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card"
        >
          <form onSubmit={handleSubmit}>
            {/* Recipient */}
            <div className="card-section border-b border-neutral-100">
              <label className="field-label">Recognize someone</label>
              <select
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                required
                className="input"
              >
                <option value="" disabled>Select a teammate...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.email} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* Core Values */}
            <div className="card-section border-b border-neutral-100">
              <label className="field-label">Company value</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {CORE_VALUES.map(cv => (
                  <button
                    key={cv.id}
                    type="button"
                    onClick={() => setCoreValue(cv.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border text-left text-body-sm font-medium transition-all
                      ${coreValue === cv.id
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"}`}
                  >
                    <span className="text-xl">{cv.icon}</span>
                    <span>{cv.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Points */}
            <div className="card-section border-b border-neutral-100">
              <label className="field-label">Points to award</label>
              <div className="flex gap-2 mt-1">
                {POINTS_PRESETS.map(pts => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setPoints(pts)}
                    className={`flex-1 py-2.5 rounded-lg border font-semibold text-body transition-all
                      ${points === pts
                        ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}
                  >
                    +{pts} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="card-section border-b border-neutral-100">
              <label className="field-label">Your message</label>
              <textarea
                placeholder="What did they do that was noteworthy? Be specific and sincere."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                className="input mt-1 resize-none"
              />
              <p className="text-caption text-neutral-400 mt-1.5">{message.length} characters</p>
            </div>

            {/* Submit */}
            <div className="card-section">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`btn-primary btn-lg w-full ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Publish Shoutout</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Shoutout