import { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import { Mail, Lock, AlertCircle } from "react-feather";
import { Link } from "react-router-dom";

import loginImg from "../../../assets/img/pages/login.png";
import { loginWithJWT } from "../../../redux/actions/auth/loginActions";
import "../../../assets/scss/pages/authentication.scss";

function validateMobileOrEmail(text) {
  const re =
    /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(^\d{10}$)$/;
  return re.test(text);
}

class Login extends Component {
  state = {
    email: "",
    password: "",
    error_msg: "",
    is_submitting: false,
    successMessage: localStorage.getItem("successMessage"),
  };
  handleError = (e) => {
    let error = e.response?.data?.non_field_errors || e.message;
    this.setState({
      error_msg: error || "Login Error! Please try again.",
      is_submitting: false,
    });
  };
  handleLogin = (e) => {
    e.preventDefault();
    this.setState({
      error_msg: "",
      is_submitting: true,
    });
    this.props.loginWithJWT(this.state, this.handleError);
  };

  onEmailChange = (e) => {
    this.setState({ email: e.target.value });
    console.log(e.target.validity.valid);
    e.target.setCustomValidity("");
    !validateMobileOrEmail(e.target.value) &&
      e.target.setCustomValidity(
        "Enter valid 10-digit Mobile Number or Email Address"
      );
  };

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
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                  <CardBody>
                    <h4>Login to Amojo</h4>
                    <p>Welcome back, please login to your account.</p>

                    <br />
                    <Alert
                      color="danger"
                      isOpen={Boolean(this.state.error_msg)}
                    >
                      <AlertCircle size={15} />
                      {this.state.error_msg}
                    </Alert>
                    <br />

                    <Form action="/" onSubmit={this.handleLogin}>
                      <Row>
                        <Col sm="12">
                          <Label>Mobile Number or Email</Label>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="text"
                              placeholder="10-digit Mobile Number or Email"
                              value={this.state.email}
                              onChange={(e) => this.onEmailChange(e)}
                              required
                            />
                            <div className="form-control-position">
                              <Mail size={15} />
                            </div>
                          </FormGroup>
                        </Col>

                        <Col sm="12">
                          <div className="d-flex justify-content-between">
                            <Label>Password</Label>
                            <Link to="/forgot-password" style={{fontSize:"13px"}}>
                              Forgot Password?
                            </Link>
                          </div>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="password"
                              placeholder="Password"
                              value={this.state.password}
                              onChange={(e) =>
                                this.setState({ password: e.target.value })
                              }
                              required
                            />
                            <div className="form-control-position">
                              <Lock size={15} />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between align-items-center">
                        {/* <Button.Ripple
                          color="primary"
                          type="submit"
                          size="md"
                          disabled={this.state.is_submitting}
                        >
                          Login
                        </Button.Ripple> */}

                        <button
                          class="btn btn-primary btn-block waves-effect waves-float waves-light"
                          disabled={this.state.is_submitting}
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                      <div className="divider">
                        <div className="divider-text">OR</div>
                      </div>
                      <div className="text-center">
                        Need an account?&nbsp;
                        <Link to="register">Sign Up</Link>
                      </div>
                    </Form>
                  </CardBody>

                  {/* 
                  <div className="auth-footer">
                    <div className="divider">
                      <div className="divider-text">OR</div>
                    </div>
                    <div className="footer-btn">
                      <Button.Ripple className="btn-facebook" color="">
                        <Facebook size={14} />
                      </Button.Ripple>
                      <Button.Ripple className="btn-twitter" color="">
                        <Twitter size={14} stroke="white" />
                      </Button.Ripple>
                      <Button.Ripple className="btn-google" color="">
                        <img src={googleSvg} alt="google" height="15" width="15" />
                      </Button.Ripple>
                      <Button.Ripple className="btn-github" color="">
                        <GitHub size={14} stroke="white" />
                      </Button.Ripple>
                    </div>
                  </div> */}
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
export default connect(null, { loginWithJWT })(Login);
