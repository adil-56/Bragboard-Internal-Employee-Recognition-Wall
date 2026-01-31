// TOKEN
export const getToken = () => {
  return localStorage.getItem("token")
}

export const setToken = (token) => {
  localStorage.setItem("token", token)
}

// USER
export const getUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// AUTH CHECKS
export const isAuthenticated = () => {
  return !!getToken()
}

export const isAdmin = () => {
  const user = getUser()
  return user?.is_admin === true
}

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}