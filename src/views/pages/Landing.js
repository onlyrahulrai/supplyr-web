import React from "react"
import {Button} from "reactstrap"
import '../../assets/scss/landing/landing.scss'

class Landing extends React.Component{
  render(){
    return (
    <div id="landing-box">
        <h1 className="text-light display-4">SUPPLYR</h1>
        <h3>
            LANDING PAGE TO LAND HERE
        </h3>
        <div>
            <a href="/pages/login"><Button.Ripple outline color="light" size="lg">PROCEED TO LOGIN</Button.Ripple></a>
        </div>
    </div>
    )
  }
}

export default Landing