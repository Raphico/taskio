import Backdrop from "../Backdrop/Backdrop"
import { slideIn } from "../../utils/motion"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { IoMdClose } from "react-icons/io"
import Button from "../Button/Button/Button"
import { SubmitHandler, useForm } from "react-hook-form"
import "./modal.scss"
import { signOut, updateProfile } from "firebase/auth"
import { auth } from "../../config/firebase"
import { toast } from "react-hot-toast"
import mapError from "../../utils/mapError"

type Props = {
  handleClose: () => void
}

type FormData = {
  username: string,
  email: string | null
}

function Account({ handleClose }: Props) {
  const { user, dispatch } = useAuth()
  const displayName = user?.displayName?.split(" ")[0]
  const email = user?.email

  const { register, handleSubmit } = useForm<FormData>({
      defaultValues: {
        username: displayName,
        email
      }
    })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const currentUser = auth.currentUser
    
    if (currentUser) {
      toast.promise(
        updateProfile(currentUser, {
          displayName: data.username
        })
        .then(() => {
          dispatch({
            type: "CHANGE_USER_NAME",
            payload: data.username
          })
        }), {
          loading: "Updating account",
          success: "Updated",
          error: error => {
            console.log(error)
            return mapError(error.code)
          }
        }
      )
    } 
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "SIGN_OUT_USER",
          payload: null
        })
      })
      .catch(error => {
        console.log(error)
        toast.error(mapError(error.code))
      })
  }

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        variants={slideIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={e => e.stopPropagation()}
        className="modal"
      >
        <IoMdClose 
          className="close-modal"
          size={30}
          onClick={handleClose}
        />

        <h1 className="titling fs-500 fw-bold">
          Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="form grid">
          <div className="input-box">
            <input 
              id="username"
              type="text" 
              className={`form-input not-empty`}
              {...register("username", { required: true })}
            />
            <label className="form-label" htmlFor="username">
              Username
            </label>
          </div>

          <div className="input-box">
            <input 
              type="email" 
              id="email" 
              className={`form-input not-empty`}
              {...register("email", { disabled: true })}
            />
            <label className="form-label" htmlFor="email">
              Email
            </label>
          </div>

          <div className="account grid">
            <Button 
              type="submit" 
              text="Save" 
              borderColor="light" 
            />
            <Button 
              text="Sign out"
              borderColor="accent"
              onClick={handleSignOut}
            />
          </div>
        </form>
      </motion.div>
    </Backdrop>
  )
}

export default Account