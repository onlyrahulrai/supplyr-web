import React from "react"
import {
    Card,
    CardHeader,
    CardBody,
    Button
} from "reactstrap"
import { Check } from "react-feather"

class Verification extends React.Component{
  render(){
    return (
        <div className="mt-3">
            <h4>Email and Phone Verification</h4>

            <Card>
                <CardHeader className="mx-auto flex-column mt-5">
                    <h4>Your details have been verified</h4>
                </CardHeader>

                <CardBody className="text-center pt-0">
                    <Button className="btn-icon btn-success rounded-circle disabled mt-2" onClick={e=>e.preventDefault()}>
                        <Check />
                    </Button>
                </CardBody>
            </Card>

        </div>
    
    )
  }
}

export default Verification