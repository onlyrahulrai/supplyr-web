import apiClient from 'api/base'

const login = (state = { userRole: "admin" }, action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.user, authenticated: true }
    }
    case "LOGOUT": {
      localStorage.clear('token');
      delete apiClient.defaults.headers.common['Authorization'];
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