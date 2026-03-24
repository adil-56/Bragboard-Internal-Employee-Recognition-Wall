import React, { createContext, useContext, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
              ${toast.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-neutral-900 text-white"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}
