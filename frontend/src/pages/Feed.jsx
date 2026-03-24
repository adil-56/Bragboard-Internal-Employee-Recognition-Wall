import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ThumbsUp, Zap, Award, Users, TrendingUp, Send, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useToast } from "../contexts/ToastContext"
import { AppLayout } from "../components/layout/AppLayout"

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "celebrate", emoji: "👏", label: "Celebrate" },
  { type: "support", emoji: "🤝", label: "Support" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "funny", emoji: "😂", label: "Funny" },
]

const AVATAR_COLORS = [
  "bg-primary-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-rose-600",
  "bg-amber-600",
]

const Feed = () => {
  const navigate = useNavigate()
  const [shoutouts, setShoutouts] = useState([])
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const limit = 20

  const [reactions, setReactions] = useState({})
  const [comments, setComments] = useState({})
  const [boosts, setBoosts] = useState({})
  const [boostedIds, setBoostedIds] = useState({})
  const [commentInput, setCommentInput] = useState({})
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const { showToast } = useToast()

  useEffect(() => { fetchFeed(0) }, [])

  const fetchFeed = async (currentSkip) => {
    setLoading(true)
    try {
      const res = await api.get("/shoutouts/feed", { params: { skip: currentSkip, limit } })
      if (res.data.length < limit) setHasMore(false)

      if (currentSkip === 0) {
        setShoutouts(res.data)
      } else {
        setShoutouts(prev => [...prev, ...res.data])
      }

      setReactions(prev => {
        const next = { ...prev }
        res.data.forEach(s => next[s.id] = s.reactions)
        return next
      })
      setComments(prev => {
        const next = { ...prev }
        res.data.forEach(s => next[s.id] = s.comments)
        return next
      })
      setBoosts(prev => {
        const next = { ...prev }
        res.data.forEach(s => next[s.id] = { total_points: s.total_boost_points })
        return next
      })
    } catch {
      showToast("Failed to load feed.")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const newSkip = skip + limit
    setSkip(newSkip)
    fetchFeed(newSkip)
  }

  const fetchReactions = async (id) => {
    const res = await api.get(`/reactions/shoutouts/${id}/summary`)
    setReactions(prev => ({ ...prev, [id]: res.data }))
  }

  const react = async (id, type) => {
    await api.post(`/reactions/shoutouts/${id}`, null, { params: { reaction_type: type } })
    fetchReactions(id)
  }

  const fetchBoosts = async (id) => {
    try {
      const res = await api.get(`/boosts/shoutouts/${id}/summary`)
      setBoosts(prev => ({ ...prev, [id]: res.data }))
    } catch { /* table may not exist yet */ }
  }

  const boost = async (id) => {
    try {
      await api.post(`/boosts/shoutouts/${id}`)
      setBoostedIds(prev => ({ ...prev, [id]: true }))
      fetchBoosts(id)
    } catch (err) {
      showToast(err.response?.data?.detail || "Could not boost")
    }
  }

  const fetchComments = async (id) => {
    const res = await api.get(`/comments/comments/shoutouts/${id}`)
    setComments(prev => ({ ...prev, [id]: res.data }))
  }

  const postComment = async (id) => {
    if (!commentInput[id]?.trim()) return
    await api.post(`/comments/shoutouts/${id}`, { message: commentInput[id] })
    setCommentInput(prev => ({ ...prev, [id]: "" }))
    fetchComments(id)
  }

  const totalReactions = Object.values(reactions).reduce((s, r) => s + Object.values(r || {}).reduce((a, b) => a + b, 0), 0)
  const totalBoostPoints = Object.values(boosts).reduce((s, b) => s + (b?.total_points || 0), 0)

  return (
    <AppLayout>
      <div className="flex gap-8 items-start">

        {/* Feed column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-h2 text-neutral-900">Recognition Feed</h1>
              <p className="text-body-sm text-neutral-500 mt-0.5">Latest shoutouts from your team</p>
            </div>
            <button onClick={() => navigate("/shoutout")} className="btn-primary">
              <Award className="w-4 h-4" /> Give Shoutout
            </button>
          </div>

          <AnimatePresence>
            {shoutouts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card card-section text-center py-16"
              >
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-h3 text-neutral-700 mb-1">No shoutouts yet</h3>
                <p className="text-body text-neutral-400">Be the first to recognize a colleague's great work.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {shoutouts.map((s, i) => {
                  const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length]
                  const totalRx = Object.values(reactions[s.id] || {}).reduce((a, b) => a + b, 0)
                  const commentCount = comments[s.id]?.length || 0
                  return (
                    <motion.article
                      key={s.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="card overflow-visible"
                    >
                      <div className="card-section">
                        {/* Post header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {s.sender_avatar ? (
                              <img src={s.sender_avatar} alt="avatar" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-10 h-10 rounded-lg ${avatarBg} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                                {s.sender_email.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="text-body font-semibold text-neutral-900 capitalize">
                                {s.sender_email.split("@")[0]}
                              </h4>
                              <p className="text-caption text-neutral-400">
                                {new Date(s.created_at).toLocaleString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          {boosts[s.id]?.total_points > 0 && (
                            <span className="badge badge-amber">
                              <Zap className="w-3 h-3" /> +{boosts[s.id].total_points} pts
                            </span>
                          )}
                        </div>

                        {/* Message */}
                        <p className="text-body-lg text-neutral-700 leading-relaxed mb-4 border-l-2 border-primary-300 pl-4">
                          {s.message}
                        </p>

                        {/* Recipients */}
                        {s.recipients?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {s.recipients.map((r, ri) => (
                              <span key={ri} className="badge badge-primary flex items-center gap-1.5 px-2">
                                {r.receiver_avatar ? (
                                  <img src={r.receiver_avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                ) : (
                                  <Users className="w-3 h-3" />
                                )}
                                @{r.receiver_name || r.receiver_email.split("@")[0]}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Reaction summary */}
                        {totalRx > 0 && (
                          <div className="flex items-center gap-2 py-3 border-t border-neutral-100">
                            <div className="flex -space-x-1">
                              {Object.entries(reactions[s.id] || {})
                                .filter(([_, c]) => c > 0)
                                .map(([type]) => {
                                  const rInfo = REACTIONS.find(r => r.type === type)
                                  if (!rInfo) return null
                                  return (
                                    <div key={type} className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-xs shadow-xs">
                                      {rInfo.emoji}
                                    </div>
                                  )
                                })}
                            </div>
                            <span className="text-caption text-neutral-400">
                              {s.sender_name || s.sender_email.split("@")[0]} and {totalRx} {totalRx === 1 ? "other" : "others"}
                            </span>
                          </div>
                        )}

                        {/* Action bar */}
                        <div className="flex items-center border-t border-neutral-100 mt-1 -mx-1">
                          {/* Like (with hover reaction picker) */}
                          <div className="group relative flex-1">
                            {/* Hover reaction pill */}
                            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex z-50">
                              {/* Invisible bridge to keep hover state active */}
                              <div className="absolute -bottom-4 left-0 w-full h-6 bg-transparent" />
                              <div className="flex items-center bg-white border border-neutral-200 shadow-lg rounded-full px-2 py-1.5 relative">
                                {REACTIONS.map(r => (
                                  <button
                                    key={r.type}
                                    onClick={e => { e.preventDefault(); react(s.id, r.type) }}
                                    title={r.label}
                                    className="w-9 h-9 flex items-center justify-center text-xl hover:scale-125 hover:-translate-y-1.5 transition-all duration-150"
                                  >
                                    {r.emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button className="flex w-full items-center justify-center gap-2 text-body-sm font-medium text-neutral-500 hover:text-primary-600 hover:bg-primary-50 py-2.5 rounded-lg transition-colors mx-1">
                              <ThumbsUp className="w-4 h-4" /> Like
                            </button>
                          </div>

                          {/* Comment */}
                          <button
                            onClick={() => setActiveCommentBox(activeCommentBox === s.id ? null : s.id)}
                            className="flex flex-1 items-center justify-center gap-2 text-body-sm font-medium text-neutral-500 hover:text-primary-600 hover:bg-primary-50 py-2.5 rounded-lg transition-colors mx-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Comment
                            {commentCount > 0 && (
                              <span className="badge badge-neutral text-xs">{commentCount}</span>
                            )}
                          </button>

                          {/* Boost */}
                          <button
                            onClick={() => boost(s.id)}
                            disabled={boostedIds[s.id]}
                            className={`flex flex-1 items-center justify-center gap-2 text-body-sm font-medium py-2.5 rounded-lg transition-colors mx-1
                              ${boostedIds[s.id]
                                ? "text-amber-600 bg-amber-50 cursor-not-allowed"
                                : "text-neutral-500 hover:text-amber-600 hover:bg-amber-50"}`}
                          >
                            <Zap className={`w-4 h-4 ${boostedIds[s.id] ? "fill-amber-500" : ""}`} />
                            {boostedIds[s.id] ? "Boosted!" : "Boost"}
                          </button>
                        </div>
                      </div>

                      {/* Comments section */}
                      <AnimatePresence>
                        {activeCommentBox === s.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-neutral-100"
                          >
                            <div className="px-6 py-4 bg-neutral-50 space-y-3">
                              {(comments[s.id] || []).length === 0 ? (
                                <p className="text-body-sm text-neutral-400 text-center py-2">No comments yet — be the first!</p>
                              ) : (
                                (comments[s.id] || []).map(c => (
                                  <div key={c.id} className="flex gap-3">
                                    {c.user_avatar ? (
                                      <img src={c.user_avatar} alt="avatar" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {(c.user_name || c.user_email || "U").charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div className="bg-white border border-neutral-200 rounded-xl rounded-tl-sm px-4 py-2.5 flex-1 shadow-xs">
                                      <span className="text-body-sm font-semibold text-neutral-800 capitalize block">
                                        {c.user_name || c.user_email?.split("@")[0]}
                                      </span>
                                      <span className="text-body-sm text-neutral-600">{c.message}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                              {/* Comment input */}
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Add a comment…"
                                  value={commentInput[s.id] || ""}
                                  onChange={e => setCommentInput(prev => ({ ...prev, [s.id]: e.target.value }))}
                                  onKeyDown={e => e.key === "Enter" && postComment(s.id)}
                                  className="input pr-12"
                                />
                                <button
                                  onClick={() => postComment(s.id)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                >
                                  <Send className="w-3.5 h-3.5 ml-0.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Load More Button */}
          {hasMore && shoutouts.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-neutral px-8 py-2.5 shadow-sm"
              >
                {loading ? "Loading..." : "Load Older Shoutouts"}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden xl:block w-64 flex-shrink-0 space-y-4 sticky top-6">
          {/* Stats */}
          <div className="card card-section">
            <h3 className="text-body-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-500" /> Feed Stats
            </h3>
            <div className="space-y-3">
              {[
                ["Posts", shoutouts.length],
                ["Reactions", totalReactions],
                ["Points Boosted", totalBoostPoints],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-body-sm text-neutral-500">{label}</span>
                  <span className="text-body font-bold text-neutral-900 tabular-nums">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="card card-section">
            <h3 className="text-body-sm font-semibold text-neutral-700 mb-3">How it works</h3>
            <ul className="space-y-2.5">
              {[
                ["1", "Newest posts appear first."],
                ["2", "Hover Like to react with an emoji."],
                ["⚡", "Boost transfers 10 pts to recipient."],
              ].map(([step, text]) => (
                <li key={step} className="flex items-start gap-2 text-body-sm text-neutral-500">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent */}
          {shoutouts.length > 0 && (
            <div className="card card-section">
              <h3 className="text-body-sm font-semibold text-neutral-700 mb-3">Recent recognitions</h3>
              <div className="space-y-2.5">
                {shoutouts.slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-md ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {s.sender_email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-neutral-800 truncate capitalize">{s.sender_email.split("@")[0]}</p>
                      <p className="text-caption text-neutral-400 truncate">{s.message.slice(0, 28)}…</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  )
}

export default Feed