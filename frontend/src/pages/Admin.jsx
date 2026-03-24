import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings, BarChart2, Shield, MessageSquare, ShoppingBag, Trophy, Gift,
  Trash2, UserCheck, UserX, RotateCcw, Plus, Pencil, CheckCircle,
  Clock, Package, XCircle, Download, Zap, TrendingUp, Star, Inbox, Users, LayoutDashboard
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid } from "recharts"
import api from "../api/axios"
import { AppLayout } from "../components/layout/AppLayout"

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "users", label: "Users", icon: Users },
  { key: "moderation", label: "Moderation", icon: Shield },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
]

const ORDER_STATUS = ["pending", "shipped", "fulfilled", "cancelled"]
const STATUS_STYLE = {
  pending: { cls: "badge-neutral", icon: Clock },
  shipped: { cls: "badge-primary", icon: Package },
  fulfilled: { cls: "bg-success-50 text-success-700 border border-success-200", icon: CheckCircle },
  cancelled: { cls: "bg-danger-50 text-danger-700 border border-danger-200", icon: XCircle },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const exportCSV = async (endpoint, filename) => {
  const res = await api.get(endpoint, { responseType: "blob" })
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }))
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  window.URL.revokeObjectURL(url)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="card card-section"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-body-sm text-neutral-500 font-medium">{label}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
    <p className="text-3xl font-bold text-neutral-900 tabular-nums">{value ?? "—"}</p>
  </motion.div>
)

const SectionHeader = ({ title, desc, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-h2 text-neutral-900">{title}</h2>
      {desc && <p className="text-body-sm text-neutral-500 mt-0.5">{desc}</p>}
    </div>
    {action}
  </div>
)

const EmptyState = ({ icon: Icon, title, desc }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-neutral-400" />
    </div>
    <h3 className="text-h3 text-neutral-700 mb-1">{title}</h3>
    <p className="text-body-sm text-neutral-500">{desc}</p>
  </motion.div>
)

const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-body-sm font-medium
          ${toast.type === "error" ? "bg-danger-50 text-danger-700 border border-danger-200" : "bg-neutral-900 text-white"}`}
      >
        {toast.msg}
      </motion.div>
    )}
  </AnimatePresence>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const Admin = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Data state
  const [overview, setOverview] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [users, setUsers] = useState([])
  const [shoutouts, setShoutouts] = useState([])
  const [comments, setComments] = useState([])
  const [rewards, setRewards] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({ contributors: [], tagged: [], reactions: [], overTime: [] })

  // UI state
  const [rewardForm, setRewardForm] = useState({ name: "", description: "", points_cost: "", stock_quantity: -1 })
  const [editingReward, setEditingReward] = useState(null)
  const [showRewardForm, setShowRewardForm] = useState(false)

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ── Fetch all data ──────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, lb, us, sh, cm, rw, or_, ct, tg, rx, ot] = await Promise.all([
        api.get("/admin/stats/overview"),
        api.get("/admin/analytics/leaderboard?limit=20"),
        api.get("/admin/users"),
        api.get("/shoutouts"),
        api.get("/admin/comments"),
        api.get("/rewards/"),
        api.get("/admin/orders"),
        api.get("/admin/analytics/top-contributors"),
        api.get("/admin/analytics/most-tagged-users"),
        api.get("/admin/analytics/reaction-stats"),
        api.get("/admin/analytics/shoutouts-over-time")
      ])
      setOverview(ov.data)
      setLeaderboard(lb.data)
      setUsers(us.data)
      setShoutouts(sh.data)
      setComments(cm.data)
      setRewards(rw.data)
      setOrders(or_.data)
      setAnalytics({ contributors: ct.data, tagged: tg.data, reactions: rx.data, overTime: ot.data })
    } catch (e) {
      showToast("Failed to load admin data", "error")
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── User actions ────────────────────────────────────────────────────────────

  const changeRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showToast(`Role updated to ${newRole}`)
    } catch (e) {
      showToast(e.response?.data?.detail || "Failed to update role", "error")
    }
  }

  const resetPoints = async (userId, userEmail) => {
    try {
      await api.patch(`/admin/users/${userId}/reset-points`, { amount: 500 })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, giveable_points: 500 } : u))
      showToast(`Reset points for ${userEmail}`)
    } catch (e) {
      showToast("Failed to reset points", "error")
    }
  }

  // ── Moderation actions ──────────────────────────────────────────────────────

  const deleteShoutout = async (id) => {
    if (!window.confirm("Delete this shoutout permanently?")) return
    try {
      await api.delete(`/admin/shoutouts/${id}`)
      setShoutouts(prev => prev.filter(s => s.id !== id))
      showToast("Shoutout deleted")
    } catch { showToast("Delete failed", "error") }
  }

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return
    try {
      await api.delete(`/admin/comments/${id}`)
      setComments(prev => prev.filter(c => c.id !== id))
      showToast("Comment deleted")
    } catch { showToast("Delete failed", "error") }
  }

  // ── Reward actions ──────────────────────────────────────────────────────────

  const saveReward = async () => {
    if (!rewardForm.name || !rewardForm.points_cost) {
      showToast("Name and points cost are required", "error"); return
    }
    try {
      if (editingReward) {
        await api.patch(`/admin/rewards/${editingReward}`, {
          name: rewardForm.name,
          description: rewardForm.description || null,
          points_cost: Number(rewardForm.points_cost),
          stock_quantity: Number(rewardForm.stock_quantity),
        })
        showToast("Reward updated")
      } else {
        await api.post("/admin/rewards", {
          name: rewardForm.name,
          description: rewardForm.description || null,
          points_cost: Number(rewardForm.points_cost),
          stock_quantity: Number(rewardForm.stock_quantity),
        })
        showToast("Reward created")
      }
      setShowRewardForm(false); setEditingReward(null)
      setRewardForm({ name: "", description: "", points_cost: "", stock_quantity: -1 })
      const res = await api.get("/rewards/"); setRewards(res.data)
    } catch (e) {
      showToast(e.response?.data?.detail || "Failed to save reward", "error")
    }
  }

  const deleteReward = async (id) => {
    if (!window.confirm("Delete this reward?")) return
    try {
      await api.delete(`/admin/rewards/${id}`)
      setRewards(prev => prev.filter(r => r.id !== id))
      showToast("Reward deleted")
    } catch { showToast("Delete failed", "error") }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      showToast(`Order marked as ${status}`)
    } catch { showToast("Failed to update order", "error") }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <AppLayout>
      <Toast toast={toast} />

      <div>
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-h1 text-neutral-900">Admin Panel</h1>
            <p className="text-body text-neutral-500 mt-1">Manage users, content, rewards, and analytics.</p>
          </div>
          <button onClick={fetchAll} className="btn-ghost text-body-sm">
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 mb-8 w-fit flex-wrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-medium transition-all
                ${tab === key ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <KpiCard label="Total Users" value={overview?.total_users} icon={Users} color="bg-primary-50 text-primary-600" delay={0} />
                <KpiCard label="Total Shoutouts" value={overview?.total_shoutouts} icon={Award} color="bg-amber-50 text-amber-600" delay={0.05} />
                <KpiCard label="Total Reactions" value={overview?.total_reactions} icon={TrendingUp} color="bg-violet-50 text-violet-600" delay={0.1} />
                <KpiCard label="Comments" value={overview?.total_comments} icon={MessageSquare} color="bg-teal-50 text-teal-600" delay={0.15} />
                <KpiCard label="Points Awarded" value={overview?.total_points_awarded} icon={Zap} color="bg-success-50 text-success-700" delay={0.2} />
              </div>

              <SectionHeader title="Recent Shoutouts" desc="Last 5 posts on the platform" />
              <div className="space-y-3">
                {(overview?.recent_shoutouts || []).map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="card card-section flex items-start gap-4">
                    <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(s.sender_email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-neutral-900 capitalize">{s.sender_name || s.sender_email?.split("@")[0]}</p>
                      <p className="text-body-sm text-neutral-600 mt-0.5 truncate">{s.message}</p>
                      <p className="text-caption text-neutral-400 mt-1">{new Date(s.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className="badge badge-amber flex-shrink-0"><Zap className="w-3 h-3" /> +{s.points_awarded} pts</span>
                  </motion.div>
                ))}
                {(overview?.recent_shoutouts || []).length === 0 && (
                  <EmptyState icon={Star} title="No shoutouts yet" desc="Platform activity will appear here." />
                )}
              </div>
            </motion.div>
          )}

          {/* ── LEADERBOARD TAB ───────────────────────────────────────────────── */}
          {tab === "leaderboard" && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <SectionHeader
                title="Leaderboard"
                desc="Composite score: Sent×5 + Received×3 + Comments×2 + Reactions×1"
                action={
                  <button onClick={() => exportCSV("/admin/analytics/leaderboard/export/csv", "leaderboard.csv")}
                    className="btn-ghost text-body-sm">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                }
              />
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {["Rank", "Name", "Email", "Score"].map(h => (
                        <th key={h} className="text-left text-caption font-semibold text-neutral-500 uppercase tracking-wide px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {leaderboard.map((row, i) => (
                      <motion.tr key={row.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        className="hover:bg-neutral-50/80 transition-all hover:shadow-[inset_4px_0_0_0_rgb(79,70,229)]">
                        <td className="px-5 py-3.5">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-body-sm font-bold
                          ${row.rank === 1 ? "bg-amber-100 text-amber-700 shadow-sm" : row.rank === 2 ? "bg-neutral-200 text-neutral-700 shadow-sm" : row.rank === 3 ? "bg-orange-100 text-orange-700 shadow-sm" : "text-neutral-500"}`}>
                            {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : row.rank}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-body font-medium text-neutral-900 capitalize">{row.name || "—"}</td>
                        <td className="px-5 py-3.5 text-body-sm text-neutral-500">{row.email}</td>
                        <td className="px-5 py-3.5">
                          <span className="badge badge-primary font-bold"><Star className="w-3 h-3" /> {row.score}</span>
                        </td>
                      </motion.tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr><td colSpan={4}><EmptyState icon={Trophy} title="Leaderboard empty" desc="Start sending shoutouts to rank up!" /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── USERS TAB ─────────────────────────────────────────────────────── */}
          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <SectionHeader title="User Management" desc={`${users.length} total users`} />
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {["User", "Email", "Role", "Give Pts", "Redeem Pts", "Actions"].map(h => (
                        <th key={h} className="text-left text-caption font-semibold text-neutral-500 uppercase tracking-wide px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {users.map((u, i) => (
                      <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                        className="hover:bg-neutral-50/80 transition-all hover:shadow-[inset_4px_0_0_0_rgb(79,70,229)] group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                              {(u.name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-body font-medium text-neutral-900 capitalize">{u.name || "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-body-sm text-neutral-500">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`badge ${u.role === "admin" ? "badge-primary" : "badge-neutral"}`}>
                            {u.role === "admin" ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-body font-semibold tabular-nums text-amber-600">{u.giveable_points}</td>
                        <td className="px-5 py-3.5 text-body font-semibold tabular-nums text-success-700">{u.redeemable_points}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {u.role === "employee" ? (
                              <button onClick={() => changeRole(u.id, "admin")}
                                className="flex items-center gap-1 text-caption font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition-all active:scale-95">
                                <UserCheck className="w-3 h-3" /> Promote
                              </button>
                            ) : (
                              <button onClick={() => changeRole(u.id, "employee")}
                                className="flex items-center gap-1 text-caption font-medium text-neutral-500 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-lg transition-all active:scale-95">
                                <UserX className="w-3 h-3" /> Demote
                              </button>
                            )}
                            <button onClick={() => resetPoints(u.id, u.email)}
                              className="flex items-center gap-1 text-caption font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-all active:scale-95">
                              <RotateCcw className="w-3 h-3" /> Reset Pts
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={6}><EmptyState icon={Users} title="No users found" desc="Seed your database to see users." /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── MODERATION TAB ────────────────────────────────────────────────── */}
          {tab === "moderation" && (
            <motion.div key="moderation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shoutouts */}
              <div>
                <SectionHeader title="Shoutouts" desc={`${shoutouts.length} total`} />
                <div className="space-y-3">
                  {shoutouts.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="card card-section flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-neutral-400 mb-1">#{s.id} · {s.sender_email}</p>
                        <p className="text-body-sm text-neutral-700 line-clamp-2">{s.message}</p>
                      </div>
                      <button onClick={() => deleteShoutout(s.id)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-danger-600 hover:bg-danger-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {shoutouts.length === 0 && <p className="text-body-sm text-neutral-400 py-6 text-center">No shoutouts</p>}
                </div>
              </div>

              {/* Comments */}
              <div>
                <SectionHeader title="Comments" desc={`${comments.length} total`} />
                <div className="space-y-3">
                  {comments.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="card card-section flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-caption text-neutral-400 mb-1">#{c.id} · {c.user_email}</p>
                        <p className="text-body-sm text-neutral-700 line-clamp-2">{c.message}</p>
                        <p className="text-caption text-neutral-400 mt-1 truncate">On: "{c.shoutout_message}"</p>
                      </div>
                      <button onClick={() => deleteComment(c.id)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-danger-600 hover:bg-danger-50 transition-all active:scale-95">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {comments.length === 0 && <EmptyState icon={MessageSquare} title="No comments" desc="No comments to moderate." />}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── REWARDS TAB ───────────────────────────────────────────────────── */}
          {tab === "rewards" && (
            <motion.div key="rewards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-10">
              {/* Catalog */}
              <div>
                <SectionHeader
                  title="Reward Catalog"
                  desc={`${rewards.length} rewards`}
                  action={
                    <button onClick={() => { setShowRewardForm(true); setEditingReward(null); setRewardForm({ name: "", description: "", points_cost: "", stock_quantity: -1 }) }}
                      className="btn-primary">
                      <Plus className="w-4 h-4" /> Add Reward
                    </button>
                  }
                />

                {/* Reward form */}
                <AnimatePresence>
                  {showRewardForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="card card-section mb-5 overflow-hidden">
                      <h3 className="text-h3 text-neutral-900 mb-4">{editingReward ? "Edit Reward" : "New Reward"}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="field-label">Name *</label>
                          <input type="text" className="input" placeholder="e.g. Amazon Gift Card" value={rewardForm.name}
                            onChange={e => setRewardForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div>
                          <label className="field-label">Points Cost *</label>
                          <input type="number" className="input" placeholder="e.g. 500" value={rewardForm.points_cost}
                            onChange={e => setRewardForm(p => ({ ...p, points_cost: e.target.value }))} />
                        </div>
                        <div>
                          <label className="field-label">Description</label>
                          <input type="text" className="input" placeholder="Optional description" value={rewardForm.description}
                            onChange={e => setRewardForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div>
                          <label className="field-label">Stock (-1 = unlimited)</label>
                          <input type="number" className="input" placeholder="-1" value={rewardForm.stock_quantity}
                            onChange={e => setRewardForm(p => ({ ...p, stock_quantity: e.target.value }))} />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={saveReward} className="btn-primary">
                          <CheckCircle className="w-4 h-4" /> {editingReward ? "Save Changes" : "Create Reward"}
                        </button>
                        <button onClick={() => { setShowRewardForm(false); setEditingReward(null) }} className="btn-ghost">Cancel</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card card-section flex flex-col gap-3 group hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <h3 className="text-h3 text-neutral-900 group-hover:text-primary-600 transition-colors">{r.name}</h3>
                        <span className="badge badge-amber shadow-sm"><Zap className="w-3 h-3" /> {r.points_cost} pts</span>
                      </div>
                      {r.description && <p className="text-body-sm text-neutral-500">{r.description}</p>}
                      <p className="text-caption text-neutral-400">{r.stock_quantity === -1 ? "Unlimited stock" : `${r.stock_quantity} left`}</p>
                      <div className="flex gap-2 mt-auto pt-1">
                        <button onClick={() => {
                          setEditingReward(r.id)
                          setRewardForm({ name: r.name, description: r.description || "", points_cost: r.points_cost, stock_quantity: r.stock_quantity })
                          setShowRewardForm(true)
                        }} className="flex-1 flex items-center justify-center gap-1.5 text-body-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 py-2 rounded-lg transition-all active:scale-95">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deleteReward(r.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-body-sm font-medium text-danger-600 hover:text-danger-700 bg-danger-50 hover:bg-danger-100 py-2 rounded-lg transition-all active:scale-95">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {rewards.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <EmptyState icon={Gift} title="No rewards catalog" desc="Construct your company's reward selection." />
                    </div>
                  )}
                </div>
              </div>

              {/* Orders */}
              <div>
                <SectionHeader title="Order Fulfillment" desc={`${orders.length} total orders`} />
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        {["#", "User", "Reward", "Points", "Ordered", "Status", "Update"].map(h => (
                          <th key={h} className="text-left text-caption font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.map((o, i) => {
                        const { cls, icon: SIcon } = STATUS_STYLE[o.status] || STATUS_STYLE.pending
                        return (
                          <motion.tr key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                            className="hover:bg-neutral-50/80 transition-all hover:shadow-[inset_4px_0_0_0_rgb(79,70,229)]">
                            <td className="px-4 py-3.5 text-caption text-neutral-400">#{o.id}</td>
                            <td className="px-4 py-3.5 text-body-sm font-medium text-neutral-800 capitalize">{o.user_name || o.user_email.split("@")[0]}</td>
                            <td className="px-4 py-3.5 text-body-sm font-medium text-neutral-900">{o.reward_name}</td>
                            <td className="px-4 py-3.5 text-body-sm font-semibold text-amber-600">{o.points_cost} pts</td>
                            <td className="px-4 py-3.5 text-caption text-neutral-400">
                              {new Date(o.ordered_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`badge flex items-center gap-1 ${cls} shadow-sm`}><SIcon className="w-3 h-3" />{o.status}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                                className="text-caption font-medium border border-neutral-200 rounded-lg px-2 py-1.5 bg-white text-neutral-700 hover:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 cursor-pointer transition-colors shadow-sm">
                                {ORDER_STATUS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                              </select>
                            </td>
                          </motion.tr>
                        )
                      })}
                      {orders.length === 0 && (
                        <tr><td colSpan={7}><EmptyState icon={Inbox} title="No incoming orders" desc="When users redeem items, they appear here." /></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ANALYTICS TAB ─────────────────────────────────────────────────── */}
          {tab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Shoutouts Over Time Chart (Full Width) */}
              <div className="card card-section lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-h3 text-neutral-900">Shoutouts Over Time</h2>
                    <p className="text-caption text-neutral-500">Activity trend for the last 30 days</p>
                  </div>
                </div>
                <div className="h-72 mt-4">
                  {analytics.overTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.overTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={TrendingUp} title="No data" desc="Not enough activity yet." />
                  )}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="card card-section">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-h3 text-neutral-900">Top Contributors</h2>
                    <p className="text-caption text-neutral-500">Most shoutouts sent</p>
                  </div>
                  <button onClick={() => exportCSV("/admin/analytics/top-contributors/export", "top_contributors.csv")}
                    className="btn-ghost text-body-sm"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <div className="h-64 mt-4">
                  {analytics.contributors.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.contributors} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="email" formatter={(val) => val.split("@")[0]} width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={BarChart2} title="No data" desc="Not enough activity yet." />
                  )}
                </div>
              </div>

              {/* Most Tagged */}
              <div className="card card-section">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-h3 text-neutral-900">Most Recognized</h2>
                    <p className="text-caption text-neutral-500">Most core values tagged</p>
                  </div>
                  <button onClick={() => exportCSV("/admin/analytics/most-tagged-users/export", "most_tagged.csv")}
                    className="btn-ghost text-body-sm"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <div className="h-64 mt-4">
                  {analytics.tagged.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.tagged} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="receiver_email" formatter={(val) => val.split("@")[0]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="tag_count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={BarChart2} title="No data" desc="Not enough activity yet." />
                  )}
                </div>
              </div>

              {/* Reaction Stats */}
              <div className="card card-section">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-h3 text-neutral-900">Reaction Breakdown</h2>
                    <p className="text-caption text-neutral-500">Distribution of emoji reactions</p>
                  </div>
                  <button onClick={() => exportCSV("/admin/analytics/reaction-stats/export", "reactions.csv")}
                    className="btn-ghost text-body-sm"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <div className="h-64 mt-4">
                  {analytics.reactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.reactions}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="reaction_type"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {analytics.reactions.map((entry, index) => {
                            const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon={BarChart2} title="No data" desc="Not enough activity yet." />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  )
}

export default Admin