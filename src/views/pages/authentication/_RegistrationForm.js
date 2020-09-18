import React from "react"
import { Form, FormGroup, Input, Label, Button, FormFeedback, Alert, Col, Row } from "reactstrap"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check, AlertCircle } from "react-feather"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../redux/actions/auth/registerActions"
import { history } from "../../../history"

class CustomFormFeedback extends React.Component {
  render() {
    return this.props.text
      ? (<FormFeedback>{this.props.text}</FormFeedback>)
      : null
  }
}

class RegisterJWT extends React.Component {
  state = {
    email: "",
    password1: "",
    firstName: "",
    lastName: "",
    password2: "",
    errors: {},

    isSubmitting: false,
  }

  handleError = (e) => {
    window.er = e
    let errors = e.response?.data
    if (!errors) {
      errors = {
        "non_field_errors": e.message
      }
    }
    this.setState({ 
      errors: errors,
      isSubmitting: false,
    })
  }

  handleRegister = e => {
    e.preventDefault();
    this.setState({ 
      errors: {},
      isSubmitting: true,
    })
    this.props.signupWithJWT(this.state, this.handleError)
  }

  render() {
    return (
      
      <Form action="/" onSubmit={this.handleRegister}>
        <Alert color="danger" isOpen={Boolean(this.state.errors?.non_field_errors)}>
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
                onChange={e => this.setState({ firstName: e.target.value })}
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
                onChange={e => this.setState({ lastName: e.target.value })}
              />
              <Label>Name</Label>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup className="form-label-group">
          <Input
            invalid={this.state?.errors?.email}
            type="email"
            placeholder="Email"
            required
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
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
            onChange={e => this.setState({ password1: e.target.value })}
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
            onChange={e => this.setState({ password2: e.target.value })}
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
            defaultChecked={true}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/login")
            }}
          >
            Login
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit" disabled={this.state.isSubmitting}>
            Register
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
// const mapStateToProps = state => {
//   return {
//     values: state.auth.register
//   }
// }
export default connect(null, { signupWithJWT })(RegisterJWT)
