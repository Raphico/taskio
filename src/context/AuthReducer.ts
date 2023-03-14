import { Action, State } from "./AuthContext";

export default (state: State, action: Action): State => {
  switch(action.type) {
    case "SIGN_IN_USER":
      return {
        ...state,
        user: action.payload
      }

    case "SIGN_OUT_USER":
      return {
        ...state,
        user: null
      }
    
    case "CHANGE_USER_NAME":
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            displayName: action.payload
          }
        }
      }
      return state

    default:
      return state
  }
}