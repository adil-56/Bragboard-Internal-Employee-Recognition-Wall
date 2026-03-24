import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, ArrowRight, Award, CheckCircle } from "lucide-react"
import api from "../api/axios"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      await api.post("/auth/register", { name, email, password, role: "employee" })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-primary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }} />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Bragboard</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Join your team's<br />recognition wall.
          </h1>
          <p className="text-primary-200 text-base leading-relaxed max-w-xs">
            Create your account and start giving meaningful recognition to your colleagues from day one.
          </p>

          <div className="mt-10 space-y-3">
            {[
              ["🏆", "Give & receive shoutouts"],
              ["⚡", "Earn redeemable points"],
              ["💬", "Engage with your team"],
              ["📊", "Track your impact"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-3 text-primary-100 text-sm font-medium">
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-primary-300 text-sm">© 2026 Bragboard. All rights reserved.</p>
      </div>

      {/* Right register form */}
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

          <h2 className="text-h2 text-neutral-900 mb-1">Create account</h2>
          <p className="text-body text-neutral-500 mb-8">Join your team on Bragboard.</p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8 gap-4"
            >
              <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-success-700" />
              </div>
              <h3 className="text-h3 text-neutral-900">Account created!</h3>
              <p className="text-body text-neutral-500">Redirecting you to login…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="field-label">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="field-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="field-label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
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
                  : <><span>Create account</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-body-sm text-neutral-400 text-center mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-primary-600 font-medium hover:underline">Sign in</a>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Register
