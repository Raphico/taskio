import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/Button/Button"
import "./auth.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebase"
import { useAuth } from "../../context/AuthContext"
import mapError from "../../utils/mapError"
import Spinner from "../../components/Loading/Spinner"

type FormData = {
  email: string,
  password: string,
}

function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { dispatch } = useAuth()

  const { register, handleSubmit, 
    formState: { dirtyFields, errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => 
  setShowPassword(oldValue => !oldValue)

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true)

    const { email, password } = data

    signInWithEmailAndPassword(auth, email, password)
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
      .then(() => {
        navigate("/")
      })
      .catch(error => {
        console.log(error)
        toast.error(mapError(error.code))
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (errors?.password?.type === "minLength") {
      toast.error("Password is too short")
    }
  }, [errors?.password])

  if (isLoading) {
    return <Spinner msg="signing in" />
  }

  return (
    <div className="auth">
      <h1 className="fs-500 text-center fw-bold">
        Welcome back!
      </h1>

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

        <div className="input-box">
          <input 
            id="password"
            type={showPassword ? "text" : "password"}
            className={`form-input 
            ${dirtyFields.password && "not-empty"}`}
            autoComplete="off"
            {...register("password", { minLength: 6, required: true })}
          />
          <label 
            htmlFor="password" 
            className="form-label"
          >
              Password
            </label>
        </div>

        <div className="flex password-section">
          <div className="show-password flex">
            <input 
              className="form-checkbox" 
              type="checkbox"
              onClick={handleShowPassword}
            />
            <label className="fs-300" htmlFor="show-password">
              show password
            </label>
          </div>

          <Link 
            className="text-accent fw-bold fs-300" 
            to="/reset-password"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          text="Sign in" 
          borderColor="accent" 
        />
      </form>

      <Link 
        className="sign-up-link text-secondary fs-300" 
        to="/sign-up"
      >
        Don't have an account?
        <span className="fw-bold text-accent"> Sign up</span>
      </Link>
    </div>
  )
}

export default SignIn