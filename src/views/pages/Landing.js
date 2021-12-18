import { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";

import welcomeImg from "../../assets/img/pages/welcome.jpg";
import logo from "assets/img/logo/logo_md.png"

import "../../assets/scss/pages/authentication.scss";

class LandingUpdate extends Component {
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className=" login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center p-0"
              >
                <img
                  src={welcomeImg}
                  width="100%"
                  height="100%"
                  alt="loginImg"
                />
              </Col>
              <Col lg="6" md="12" className="p-0 d-flex align-items-center justify-content-center"  style={{height:"100%"}}>
                <Card className="rounded mb-0 ">
                  <CardBody>
                    <img src={logo} class='img-fluid p-3' alt="logo" />
                    <h3 className="text-center">Modernize Your Sales &amp; Purchases</h3>
                    <br />
                    <div className="mb-2 text-center">
                      <Link to="/login">
                        <Button.Ripple outlsine color="danger" size="md">
                          PROCEED TO LOGIN
                        </Button.Ripple>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
// export default Login
export default LandingUpdate;
