import React from "react"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { AuthenticationApi } from "api/endpoints"
import Swal from 'utility/sweetalert'
import { history } from "../../../history"


const formSchema = Yup.object().shape({
  old_password: Yup.string().required("Required"),
  new_password1: Yup.string().required("Required"),
  new_password2: Yup.string()
    .oneOf([Yup.ref("new_password1"), null], "Passwords must match")
    .required("Required")
})
class ChangePassword extends React.Component {
  state = {
    general_error: ""
  }

  render() {
    return (
      <React.Fragment>
        <Row className="pt-1">
          <Col sm="12">
            {this.state.general_error &&
              <div className="danger mb-1"><b>Error: </b>{this.state.general_error}</div>
            }
            <Formik
              initialValues={{
                old_password: "",
                new_password1: "",
                new_password2: ""
              }}
              validationSchema={formSchema}
              onSubmit={(values, { setSubmitting, setErrors }) => {
                this.setState({ general_error: null })
                AuthenticationApi.passwordChange(values)
                  .then((response) => {
                    console.log(response)
                    Swal.fire("Password Changed Successfully", '', "success")
                    history.push('/')
                  })
                  .catch(error => {
                    console.log(error.response)
                    if (error.response?.data) {
                      setErrors(error.response.data)
                    }
                    else {
                      this.setState({ general_error: error.message })
                      console.log(error.message)
                    }


                  })
                  .finally(() => {
                    setSubmitting(false)
                  })
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <FormGroup>
                    <Field
                      name="old_password"
                      id="old_password"
                      type="password"
                      className={`form-control ${errors.old_password &&
                        touched.old_password &&
                        "is-invalid"}`}
                      placeholder="Old Password"
                    />
                    {errors.old_password && touched.old_password ? (
                      <div className="text-danger">{errors.old_password}</div>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="new_password1"
                      placeholder="New Password"
                      id="new_password1"
                      type="password"
                      className={`form-control ${errors.new_password1 &&
                        touched.new_password1 &&
                        "is-invalid"}`}
                    />
                    {errors.new_password1 && touched.new_password1 ? (
                      <div className="text-danger">{errors.new_password1}</div>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="new_password2"
                      id="new_password2"
                      type="password"
                      className={`form-control ${errors.new_password2 &&
                        touched.new_password2 &&
                        "is-invalid"}`}
                      placeholder="Confirm Password"
                    />
                    {errors.new_password2 && touched.new_password2 ? (
                      <div className="text-danger">{errors.new_password2}</div>
                    ) : null}
                  </FormGroup>
                  <div className="d-flex justify-content-start flex-wrap">
                    <Button.Ripple
                      className="mr-1 mb-1"
                      color="primary"
                      type="submit"
                    >
                      Change Password
                    </Button.Ripple>
                    {/* <Button.Ripple
                      className="mb-1"
                      color="danger"
                      type="reset"
                      outline
                    >
                      Cancel
                    </Button.Ripple> */}
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default ChangePassword
