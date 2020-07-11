

const login = (state = { userRole: "admin" }, action) => {
  switch (action.type) {
    case "LOGIN": {
      console.log("S", state)
      return { ...state, user: action.user, authenticated: true }
    }
    case "LOGOUT": {
      return { ...state, user: undefined, authenticated: false }
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}

export default login