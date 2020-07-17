import apiClient from 'api/base'

const login = (state = { userRole: "admin" }, action) => {
  switch (action.type) {
    
    case "LOGIN": {
      if(action.token){
        localStorage.setItem('token', action.token)
        apiClient.authorize(action.token)
      }
      return { ...state, user: action.user, authenticated: true }
    }

    case "LOGOUT": {
      localStorage.clear('token');
      apiClient.deauthorize()
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