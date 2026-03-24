import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Zap, Coins, Award, Settings, Star, Gift, Edit2, X, ChevronRight } from "lucide-react"
import api from "../api/axios"
import { useToast } from "../contexts/ToastContext"
import { AppLayout } from "../components/layout/AppLayout"
import Button from "../components/ui/Button"
import { Card, CardHeader, CardContent } from "../components/ui/Card"

const StatCard = ({ label, value, icon: Icon, iconBg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="card card-section"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-body-sm text-neutral-500 font-medium">{label}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
    <p className="text-3xl font-bold text-neutral-900 tabular-nums">{value}</p>
  </motion.div>
)

const QuickActionCard = ({ icon: Icon, title, desc, onClick, isPrimary }) => (
  // Removed original quick action cards as per new design
  null
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editAvatar, setEditAvatar] = useState("")

  const { showToast } = useToast()

  const [recentShoutouts, setRecentShoutouts] = useState([])
  const [nextReward, setNextReward] = useState(null)
  const [loadingWidgets, setLoadingWidgets] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/users/me")
        setUser(userRes.data)
        
        if (userRes.data.role !== "admin") {
          const [shoutoutsRes, rewardsRes] = await Promise.all([
            api.get("/shoutouts/me/received"),
            api.get("/rewards/")
          ])
          
          setRecentShoutouts(shoutoutsRes.data || [])
          
          // Find the cheapest reward they can't afford yet, or the cheapest one they can
          const pts = userRes.data.redeemable_points || 0
          const sortedRewards = (rewardsRes.data || []).sort((a, b) => a.points_cost - b.points_cost)
          const next = sortedRewards.find(r => r.points_cost > pts) || sortedRewards[sortedRewards.length - 1]
          setNextReward(next)
        }
      } catch (err) {
        showToast("Failed to load dashboard data.")
      } finally {
        setLoadingWidgets(false)
      }
    }
    fetchData()
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const displayName = user.name || user.email?.split("@")[0] || "there"

  const handleSaveProfile = async () => {
    try {
      const res = await api.patch("/users/me", { name: editName || null, avatar_url: editAvatar || null })
      setUser(res.data)
      setProfileModalOpen(false)
      showToast("Profile updated successfully!", "success")
    } catch {
      showToast("Failed to update profile.")
    }
  }

  return (
    <AppLayout>
      <div className="w-full">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-2">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-neutral-100" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-body-sm text-neutral-400 font-medium mb-1">Welcome back</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-h1 text-neutral-900 capitalize">{displayName}</h1>
                  <button onClick={() => {
                    setEditName(user.name || "")
                    setEditAvatar(user.avatar_url || "")
                    setProfileModalOpen(true)
                  }} className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit Profile">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-body text-neutral-500 mt-2">Here's your recognition overview.</p>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Your Role"
            value={<span className="capitalize">{user.role || "Employee"}</span>}
            icon={Settings} iconBg="bg-neutral-100 text-neutral-600" delay={0.05}
          />
          {user.role !== "admin" && (
            <>
              <StatCard
                label="Giveable Points"
                value={user.giveable_points ?? 0}
                icon={Zap} iconBg="bg-amber-50 text-amber-600" delay={0.1}
              />
              <StatCard
                label="Redeemable Points"
                value={user.redeemable_points ?? 0}
                icon={Coins} iconBg="bg-success-50 text-success-700" delay={0.15}
              />
            </>
          )}
        </div>

        {/* Primary CTA */}
        {user.role !== "admin" && (
          <div className="mb-8 p-6 bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-2xl font-bold mb-2">Great work deserves recognition</h2>
              <p className="text-primary-100 text-body">Who went above and beyond today? Send them a shoutout and make their day.</p>
            </div>
            <button onClick={() => navigate("/shoutout")} className="relative z-10 btn bg-white text-primary-700 hover:bg-neutral-50 px-8 py-3.5 text-base font-bold shadow-md h-auto">
              <Award className="w-5 h-5" /> Give a Shoutout
            </button>
          </div>
        )}

        {/* Dashboard Widgets */}
        {user.role !== "admin" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Widget 1: Recent Recognitions */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-h3 text-neutral-800">Recent Recognitions</h2>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>
              
              {loadingWidgets ? (
                <div className="card h-48 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentShoutouts.length > 0 ? (
                <div className="space-y-4">
                  {recentShoutouts.map((s) => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card card-section flex gap-4">
                      {s.sender_avatar ? (
                        <img src={s.sender_avatar} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                          {(s.sender_email || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className="text-body-sm font-semibold text-neutral-900 capitalize leading-none">
                            {s.sender_name || s.sender_email.split("@")[0]}
                          </p>
                          <span className="badge badge-amber shrink-0">+{s.points_awarded} pts</span>
                        </div>
                        <p className="text-body text-neutral-600">{s.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="card card-section text-center py-10">
                  <Star className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                  <h3 className="text-body font-semibold text-neutral-700">No recent shoutouts</h3>
                  <p className="text-body-sm text-neutral-500 mt-1">When someone recognizes you, it will appear here!</p>
                </div>
              )}
            </div>

            {/* Widget 2: Reward Progress */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-h3 text-neutral-800">Reward Progress</h2>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>
              
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-neutral-100 bg-gradient-to-b from-neutral-50 to-white">
                  <div className="w-10 h-10 bg-success-100 text-success-700 rounded-xl mb-4 flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <p className="text-caption font-semibold text-neutral-500 tracking-wider uppercase mb-1">Your Balance</p>
                  <p className="text-3xl font-bold text-neutral-900">{user.redeemable_points ?? 0} <span className="text-base font-normal text-neutral-400">pts</span></p>
                </div>
                
                {nextReward && (
                  <div className="p-5">
                    <p className="text-body-sm font-medium text-neutral-700 mb-3">Next goal: <span className="font-bold">{nextReward.name}</span></p>
                    
                    {/* Progress bar logic */}
                    {(() => {
                      const pts = user.redeemable_points || 0;
                      const cost = nextReward.points_cost;
                      const percent = Math.min(100, Math.round((pts / cost) * 100));
                      const remaining = Math.max(0, cost - pts);
                      
                      return (
                        <>
                          <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden mb-3">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${percent}%` }} 
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${percent >= 100 ? 'bg-success-500' : 'bg-primary-500'}`} 
                            />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-neutral-700">{percent}%</span>
                            <span className="text-neutral-500">
                              {remaining > 0 ? `${remaining} pts to go` : 'You can afford this!'}
                            </span>
                          </div>
                        </>
                      )
                    })()}
                    
                    <button onClick={() => navigate("/rewards")} className="mt-6 w-full btn-neutral text-sm group flex items-center justify-center gap-2">
                      Browse Store <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="card p-8 text-center max-w-lg mx-auto mt-12">
             <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Settings className="w-8 h-8" />
             </div>
             <h2 className="text-h2 text-neutral-900 mb-2">Admin Dashboard</h2>
             <p className="text-body text-neutral-600 mb-6">Manage organization users, rewards, and monitor analytics.</p>
             <button onClick={() => navigate("/admin")} className="btn-primary">
                Open Admin Panel
             </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileModalOpen(false)} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h3 className="font-semibold text-neutral-900 text-lg">Edit Profile</h3>
                <button onClick={() => setProfileModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Display Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="input" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Avatar Image URL</label>
                  <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="input" placeholder="https://..." />
                  <p className="text-xs text-neutral-500 mt-1.5">Paste a link to any square image.</p>
                </div>
              </div>
              <div className="p-5 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
                <button onClick={() => setProfileModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Cancel</button>
                <button onClick={handleSaveProfile} className="btn-primary text-sm px-6 py-2 shadow-sm">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}

export default Dashboard