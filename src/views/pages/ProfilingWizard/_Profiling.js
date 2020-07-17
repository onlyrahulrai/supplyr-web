import React from "react"
import { Button } from "reactstrap"
class Page2 extends React.Component{
  render(){
    return (
    <div className="mt-3 text-center">
        <h4>Profession Details</h4>

        <h5 className='text-center mt-4 text-light'>&lt; Profiling Form Elements &gt;</h5>
        <br />
        <br />
        <Button.Ripple className="mb-1 bg-gradient-primary mx-auto" color="none">Save</Button.Ripple>


    </div>
    )
  }
}

export default Page2