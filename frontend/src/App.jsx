import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Feed from "./pages/Feed"
import Shoutout from "./pages/Shoutout"
import Admin from "./pages/Admin"

const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}

const App = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />

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
          element={isAuthenticated() ? <Shoutout /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={isAuthenticated() ? <Admin /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  
  )
}

export default App