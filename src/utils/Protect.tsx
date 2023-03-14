import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Protect({ children }: {
  children: JSX.Element
}) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/welcome-to-taskio" />
}

export default Protect
