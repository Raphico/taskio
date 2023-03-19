import Button from "../../components/Button/Button/Button"
import "./auth.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../config/firebase"
import { toast } from "react-hot-toast"
import mapError from "../../utils/mapError"
import { motion } from "framer-motion"
import { fadeIn } from "../../utils/motion"

type FormData = {
  email: string,
}

function ResetPassword() {
  const navigate = useNavigate()

  const { register, handleSubmit, 
    formState: { dirtyFields } } = useForm({
    defaultValues: {
      email: "",
    }
  })

  const onSubmit: SubmitHandler<FormData> = data => {
    const { email } = data

    toast.promise(
      sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/sign-in")
      }), {
        loading: "Sending Email...",
        success: "Email Sent",
        error: error => {
          console.log(error)
          return mapError(error.code)
        }
      }
    )
  }

  return (
    <motion.div {...fadeIn} className="auth">
      <div>
        <h1 className="fs-500 text-center fw-bold">
          Welcome back!
        </h1>

        <p className="fs-300">We Will send a password reset email</p>
      </div>

      <form className="form grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box">
          <input 
            id="email"
            type="email" 
            className={`form-input 
            ${dirtyFields.email && "not-empty"}`}
            autoComplete="off"
            {...register("email", { required: true })}
          />
          <label 
            htmlFor="email" 
            className="form-label"
          >
            Email
          </label>
        </div>

        <Button 
          type="submit" 
          text="Reset Email" 
          borderColor="accent" 
        />
      </form>
    </motion.div>
  )
}

export default ResetPassword