import React from "react"
import { connect } from "react-redux"

class Home extends React.Component{
  
  render(){
    // const userName = props => <p>{ user.name }</p>
    const msg = this.props.user?.name ?
        <div> You are logged in as <b style={{textTransform: 'capitalize', color: 'red'}}>{ this.props.user.name }</b></div>
        :
        <div>You are not logged in</div>

    return <h4>You're Home. { msg }</h4>
  }
}

// export default Home

const mapStateToProps = state => {
  return {
    user: state.auth.userInfo
  }
}
export default connect(mapStateToProps)(Home)