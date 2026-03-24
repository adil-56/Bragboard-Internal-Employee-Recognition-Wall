import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login"
import Register from "./pages/Register"
import Dashboard from "./pages/dashboard"
import Feed from "./pages/Feed"
import Shoutout from "./pages/Shoutout"
import Admin from "./pages/Admin"
import Rewards from "./pages/Rewards"
import AdminRoute from "./components/AdminRoute"
import EmployeeRoute from "./components/EmployeeRoute"

const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/feed"
        element={isAuthenticated() ? <Feed /> : <Navigate to="/login" />}
      />

      <Route
        path="/shoutout"
        element={
          isAuthenticated()
            ? <EmployeeRoute><Shoutout /></EmployeeRoute>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/rewards"
        element={
          isAuthenticated()
            ? <EmployeeRoute><Rewards /></EmployeeRoute>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated()
            ? <AdminRoute><Admin /></AdminRoute>
            : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>

  )
}

export default App