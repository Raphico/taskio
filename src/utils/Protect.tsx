import { Navigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { useAuth } from "../context/AuthContext"

function Protect({ children }: {
  children: JSX.Element
}) {
  const { user } = useAuth()
  if (!auth.currentUser) {
    localStorage.removeItem("user")
  }

  return user ? children : <Navigate to="/welcome-to-taskio" />
}

export default Protect
