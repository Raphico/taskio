import Button from "../../components/Button/Button"
import "./auth.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../../config/firebase"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import mapError from "../../utils/mapError"
import Spinner from "../../components/Loading/Spinner"

type FormData = {
  username: string,
  email: string,
  password: string,
}

function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, 
    formState: { dirtyFields, errors } } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(oldValue => !oldValue)

  const onSubmit: SubmitHandler<FormData> = data => {
    setIsLoading(true)

    const { username, email, password } = data 
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        updateProfile(userCredentials.user, {
          displayName: username
        })
        .then(() => {
          const user = {
            uid: userCredentials.user.uid,
            displayName: userCredentials.user.displayName,
            email: userCredentials.user.email,
          }
          dispatch({
            type: "SIGN_IN_USER",
            payload: user
          })
        }).then(() => navigate("/"))
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
    return <Spinner msg="signing up" />
  }

  return (
    <div className="auth">
      <h1 className="fs-500 text-center fw-bold">
        Welcome to 
        <span className="text-accent"> Task</span>io
      </h1>

      <form className="form grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-box">
          <input 
            id="username"
            type="username" 
            className={`form-input 
            ${dirtyFields.username && "not-empty"}`}
            autoComplete="off"
            {...register("username", { required: true })}
          />
          <label 
            htmlFor="username" 
            className="form-label"
          >
            What should we call you?
          </label>
        </div>

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
            autoComplete="off"
            className={`form-input 
            ${dirtyFields.password && "not-empty"}`}
            {...register("password", { minLength: 6, required: true })}
          />
          <label 
            htmlFor="password" 
            className="form-label"
          >
              Password
            </label>
        </div>

        <div className="show-password sign-up flex">
          <input 
            className="form-checkbox" 
            type="checkbox" 
            onClick={handleShowPassword}
          />
          <label className="fs-300" htmlFor="show-password">
            show password
          </label>
        </div>

        <Button 
          type="submit" 
          text="Sign up" 
          borderColor="accent" 
        />
      </form>
    </div>
  )
}

export default SignUp