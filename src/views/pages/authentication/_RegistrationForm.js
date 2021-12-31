import { Component } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  Alert,
  Col,
  Row,
} from "reactstrap";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check, AlertCircle } from "react-feather";
import { connect } from "react-redux";
import { signupWithJWT } from "../../../redux/actions/auth/registerActions";
import { Link } from "react-router-dom";

class CustomFormFeedback extends Component {
  render() {
    return this.props.text ? (
      <FormFeedback>{this.props.text}</FormFeedback>
    ) : null;
  }
}

class RegisterJWT extends Component {
  state = {
    email: "",
    password1: "",
    firstName: "",
    lastName: "",
    password2: "",
    mobile_number: "",
    errors: {},
    checked: true,
    isSubmitting: false,
  };

  handleError = (e) => {
    window.er = e;
    let errors = e.response?.data;
    if (!errors) {
      errors = {
        non_field_errors: e.message,
      };
    }
    this.setState({
      errors: errors,
      isSubmitting: false,
    });
  };

  handleRegister = (e) => {
    e.preventDefault();
    if (!this.state.checked) {
      this.setState({
        errors: {
          non_field_errors: "Please select the terms and conditions",
        },
      });
    } else {
      this.setState({
        errors: {},
        isSubmitting: true,
      });
      this.props.signupWithJWT(this.state, this.handleError);
    }
  };

  render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <Alert
          color="danger"
          isOpen={Boolean(this.state.errors?.non_field_errors)}
        >
          <AlertCircle size={15} />
          {this.state.errors.non_field_errors}
        </Alert>
        <br />

        <Row>
          <Col>
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder="First Name"
                required
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
              <Label>Name</Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder="Last Name"
                required
                value={this.state.lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
              />
              <Label>Name</Label>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup className="form-label-group">
          <Input
            invalid={this.state?.errors?.mobile_number}
            pattern="[6789][0-9]{9}"
            placeholder="10 Digit Mobile Number"
            required
            value={this.state.mobile_number}
            onChange={(e) => this.setState({ mobile_number: e.target.value })}
          />
          <Label>Phone/Mobile Number</Label>
          <CustomFormFeedback text={this.state?.errors?.mobile_number} />
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            invalid={this.state?.errors?.email}
            type="email"
            placeholder="Email"
            required
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          <Label>Email</Label>
          <CustomFormFeedback text={this.state?.errors?.email} />
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            invalid={this.state?.errors?.password1}
            type="password"
            placeholder="Password"
            required
            value={this.state.password1}
            onChange={(e) => this.setState({ password1: e.target.value })}
          />
          <Label>Password</Label>
          <CustomFormFeedback text={this.state?.errors?.password1} />
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            invalid={this.state?.errors?.password2}
            type="password"
            placeholder="Confirm Password"
            required
            value={this.state.password2}
            onChange={(e) => this.setState({ password2: e.target.value })}
          />
          <Label>Confirm Password</Label>
          <CustomFormFeedback text={this.state?.errors?.password2} />
        </FormGroup>
        <FormGroup>
          <Checkbox
            color="primary"
            required
            icon={<Check className="vx-icon" size={16} />}
            label=" I accept the terms & conditions."
            defaultChecked={this.state.checked}
            onChange={(e) => this.setState({ checked: !this.state.checked })}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <button
            class="btn btn-primary btn-block waves-effect waves-float waves-light"
            disabled={this.state.isSubmitting}
            type="submit"
          >
            Register
          </button>
          
        </div>
        <div className="divider">
          <div className="divider-text">OR</div>
        </div>
        <div className="text-center">
          Already have an account? <Link to="login">Sign In</Link>
        </div>
      </Form>
    );
  }
}
// const mapStateToProps = state => {
//   return {
//     values: state.auth.register
//   }
// }
export default connect(null, { signupWithJWT })(RegisterJWT);
