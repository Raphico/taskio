import { signInWithPopup } from "firebase/auth"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button/Button/Button"
import { auth, googleProvider } from "../../config/firebase"
import { useAuth } from "../../context/AuthContext"
import mapError from "../../utils/mapError"
import "./home.scss"
import { motion } from "framer-motion"
import { fadeIn } from "../../utils/motion"

function Home() {
  const navigate = useNavigate()
  const { dispatch } = useAuth()

  function handleGoogleAuth() {
    signInWithPopup(auth, googleProvider)
      .then(userCredentials => {
        const user = {
          uid: userCredentials.user.uid,
          displayName: userCredentials.user.displayName,
          email: userCredentials.user.email
        }

        dispatch({
          type: "SIGN_IN_USER",
          payload: user
        })
      })
      .then(() => navigate("/"))
      .catch(error => {
        console.log(error)
        toast.error(mapError(error.code))
      })
  }

  function handleEmailAuth() {
    navigate("/sign-in")
  }

  return (
    <motion.div {...fadeIn} className="home flow">
      <h1 className="text-center fs-500 fw-bold">
        <span className="text-accent">Task</span>
        io
      </h1>

      <p className="text-center">
        Stay organized and productive with Taskio, 
        with an intuitive interface to create, 
        manage, set reminders, and prioritize your tasks.
      </p>

      <div className="grid">
        <Button 
          text="Continue with Google" 
          borderColor="grey"
          onClick={handleGoogleAuth}
        />
        <Button 
          text="Continue with Email" 
          borderColor="accent"
          onClick={handleEmailAuth}
        />
      </div>
    </motion.div>
  )
}

export default Home