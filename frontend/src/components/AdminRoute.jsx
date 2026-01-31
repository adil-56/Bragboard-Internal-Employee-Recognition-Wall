// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user || !user.is_admin) return <Navigate to="/dashboard" replace />
  return children
}

export default AdminRoute