import api from "./axios"

export const createShoutout = (data) => api.post("/shoutouts", data)
export const fetchShoutouts = () => api.get("/shoutouts")
