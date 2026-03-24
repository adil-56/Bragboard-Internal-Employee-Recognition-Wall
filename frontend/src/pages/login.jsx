import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Award } from "lucide-react"
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
      const res = await api.post("/auth/login", null, { params: { email, password } })
      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("email", res.data.email)
      navigate("/dashboard")
    } catch {
      setError("Invalid email or password. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-primary-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Bragboard</span>
        </div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Recognize great<br />work, every day.
          </h1>
          <p className="text-primary-200 text-base leading-relaxed max-w-xs">
            Bragboard makes peer recognition simple, meaningful, and rewarding for everyone on your team.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              ["🏆", "Peer Recognition"],
              ["⚡", "Points & Rewards"],
              ["💬", "Team Comments"],
              ["📊", "People Insights"],
            ].map(([icon, label]) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-lg px-4 py-3">
                <span className="text-lg block mb-0.5">{icon}</span>
                <span className="text-primary-100 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-primary-300 text-sm">© 2026 Bragboard. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900 text-lg">Bragboard</span>
          </div>

          <h2 className="text-h2 text-neutral-900 mb-1">Sign in</h2>
          <p className="text-body text-neutral-500 mb-8">Enter your credentials to access your workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-danger-50 border border-danger-500/30 text-danger-700 text-body-sm rounded-lg px-4 py-3">
                <span className="mt-0.5 flex-shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-1">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Sign in</span> <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-body-sm text-neutral-400 text-center mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-primary-600 font-medium hover:underline">Create one</a>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1.5 text-body-sm text-primary-800">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono text-xs">admin@bragboard.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employee:</span>
                <span className="font-mono text-xs">adil.sharma1@bragboard.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Password:</span>
                <span className="font-mono text-xs">Bragboard@123</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login