import Button from "../../components/Button/Button"
import "./auth.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../config/firebase"
import { toast } from "react-hot-toast"
import mapError from "../../utils/mapError"
import Spinner from "../../components/Loading/Spinner"

type FormData = {
  email: string,
}

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
    }
  })

  const onSubmit: SubmitHandler<FormData> = data => {
    setIsLoading(true)

    const { email } = data

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/sign-in")
        toast.success("Email sent")
      })
      .catch(error => {
        console.log(error)
        toast.error(mapError(error.code))
      })
      .finally(() => setIsLoading(false))
  }

  if (isLoading) {
    return <Spinner msg="sending" />
  }

  return (
    <div className="auth">
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
            ${formState.dirtyFields.email && "not-empty"}`}
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
    </div>
  )
}

export default ResetPassword