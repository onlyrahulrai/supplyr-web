import { Component } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Container,
    Col,
    Row,
} from "reactstrap"
import { Check } from "react-feather"
import { useSelector } from "react-redux";

const Verification = () => {
    const userInfo = useSelector(state => state.auth.userInfo)
    
    return (
        <div className="mt-3">

            <Container>
                <Card>
                    <CardHeader className="mx-auto flex-column mt-5">
                        <h4><u>Email and Phone Verification</u></h4>
                        {/* <h3 className="mt-3">Your details have been verified</h3> */}
                    </CardHeader>
    
                    <CardBody className="text-center0 pt-0">
                        <Row>
                            <Col md={2}>Email</Col>
                            <Col md={10}>
                                
                                
                            </Col>
                        </Row>
                        <Button className="btn-icon btn-success rounded-circle disabled mt-2" onClick={e=>e.preventDefault()}>
                            <Check />
                        </Button>
                    </CardBody>
                </Card>
            </Container>

        </div>
    
    )
}

export default Verification