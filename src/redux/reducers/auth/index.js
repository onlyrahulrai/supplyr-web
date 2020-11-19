import apiClient from 'api/base'

const login = (state = { userRole: "general" }, action) => {
  switch (action.type) {
    
    case "LOGIN": {
      if(action.token){
        localStorage.setItem('token', action.token)
        apiClient.authorize(action.token)
      }
      return { ...state, authenticated: true }
    }

    case "LOGOUT": {
      localStorage.clear('token');
      apiClient.deauthorize()
      return { ...state, userInfo: undefined, authenticated: false }
    }

    case "SET_USER_INFO": {
      return { ...state, userInfo: action.userInfo}
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