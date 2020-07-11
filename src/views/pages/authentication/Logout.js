import React, { Component } from 'react'
import { connect } from 'react-redux'

class Logout extends Component {
    render() {
        this.props.logout()
        return (
            <div>
                DONE
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: 'LOGOUT'})
    }
}

export default connect(null, mapDispatchToProps)(Logout)