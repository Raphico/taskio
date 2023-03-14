import { createContext, useContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

type User = {
  uid: string,
  displayName: string | null,
  email: string | null
}

export type Action = 
  | { type: "SIGN_IN_USER", payload: User }
  | { type: "SIGN_OUT_USER", payload: null }
  | { type: "CHANGE_USER_NAME", payload: string }

export type State = {
  user: User | null,
  dispatch: React.Dispatch<Action>
}

const user = JSON.parse(localStorage.getItem("user") || "null")

const initialState: State = {
  user: user && Object.keys(user).length !== 0 ? user : null,
  dispatch: () => {},
}

const AuthContext = createContext(initialState)

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: {
  children: React.ReactNode
}) => {

  const [state, dispatch] = useReducer(AuthReducer, initialState)

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user))
  }, [state.user])

  return (
    <AuthContext.Provider value={{
      user: state.user,
      dispatch
    }}>
      { children }
    </AuthContext.Provider>
  )
}
