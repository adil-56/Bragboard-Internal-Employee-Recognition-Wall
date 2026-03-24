import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LogOut, Award, Users, LayoutDashboard, Gift, Shield, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export const AppLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const role = localStorage.getItem("role") || "employee"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Feed", path: "/feed", icon: Users },
    ...(role === "admin"
      ? [{ label: "Admin", path: "/admin", icon: Shield }]
      : [
          { label: "Shoutout", path: "/shoutout", icon: Award },
          { label: "Rewards", path: "/rewards", icon: Gift },
        ]),
  ]

  const handleNav = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav("/dashboard")}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900 text-lg tracking-tight">Bragboard</span>
            {role === "admin" && (
              <span className="badge badge-primary text-xs ml-0.5">Admin</span>
            )}
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path, icon: Icon }) => {
              const active = isActive(path)
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors font-medium text-sm ${
                    active
                      ? "text-primary-700 bg-primary-50"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Right side: sign out + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors rounded-md"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-neutral-100 bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(({ label, path, icon: Icon }) => {
                  const active = isActive(path)
                  return (
                    <button
                      key={path}
                      onClick={() => handleNav(path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "text-primary-700 bg-primary-50"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  )
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
