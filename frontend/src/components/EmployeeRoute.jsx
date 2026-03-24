import { Navigate } from "react-router-dom"

const EmployeeRoute = ({ children }) => {
    const role = localStorage.getItem("role")

    if (role === "admin") {
        // Admins are not allowed to access employee-specific routes like /shoutout or /rewards
        return <Navigate to="/dashboard" replace />
    }

    // Not strictly protecting against unauthenticated here (handled by App.jsx), 
    // just preventing admins from entering.
    return children
}

export default EmployeeRoute
