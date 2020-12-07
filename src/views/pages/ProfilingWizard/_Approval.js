import { Component } from "react";
import {
    Card,
    CardHeader,
    CardBody,
} from "reactstrap"
import { Clock } from "react-feather"

class Page2 extends Component{
  render(){
    return (
        <div className="mt-3 col-lg-6 mx-auto">
         
            <Card>
                <CardHeader className="mx-auto flex-column mt-5">
                    <Clock size="50" className="mb-3" />
                    <h4>Your account is pending approval</h4>
                    <br />
                    <h5 className="light">It usually takes 24-48 hours.</h5>
                </CardHeader>

                <CardBody className="text-center pt-0">
                </CardBody>
            </Card>

    
        </div>
    )
  }
}

export default Page2