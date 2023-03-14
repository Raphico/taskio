import { 
  BrowserRouter as Router,
  Routes,
  Route
 } from "react-router-dom"
import ResetPassword from "./pages/Auth/ResetPassword"
import SignIn from "./pages/Auth/SignIn"
import SignUp from "./pages/Auth/SignUp"
import Home from "./pages/Home/Home"
import NotFound from "./pages/NotFound"
import { Toaster } from "react-hot-toast"
import Dashboard from "./pages/Dashboard/Dashboard"
import { AuthProvider } from "./context/AuthContext"
import { BiErrorCircle } from "react-icons/bi"

function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/welcome-to-taskio" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#272727",
            color: "#fff"
          },
          duration: 2000,
          error: {
            icon: <BiErrorCircle size={30} color="red" />
          }
        }}
      />
    </AuthProvider>
  )
}

export default App
