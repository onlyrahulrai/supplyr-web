import apiClient from 'api/base';
import React, { useEffect, useState } from 'react';
import { MdVerifiedUser, MdError, MdCheck, MdCheckCircle } from 'react-icons/md'
import { history } from "../../../history"
import { useSelector } from 'react-redux';
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import resetImg from "assets/img/pages/forgot-password.png"
import "assets/scss/pages/authentication.scss"
import { AlertCircle } from 'react-feather';
import { AuthenticationApi } from 'api/endpoints'

export default function PasswordReset(props) {
    // const uid = props.match.params.uid
    // const token = props.match.params.token
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(false)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')


    const url = `register/verify-email/`

    const onSubmit = (e) => {
        e.preventDefault()
        // if(password !== confirmPassword) {
        //     setError('Both password fields do not match')
        //     return
        // }
        setIsLoading(true)

        AuthenticationApi.requestPasswordReset({
          email
        })
        .then(response => {
          setSuccessMessage(response.data?.detail ?? true)
        })
        .catch(error => {
          let message = error.response?.data?.email ?? error.message
          message = message ? message : error.response?.data?.token ? 'Link Expired' :
          setError(message)
        })
        .finally(() => {
          setIsLoading(false)
        })

    }

    
    return (
        <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-5"
              >
                <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                {!successMessage &&
                
                <Card className="rounded-0 mb-0 px-2 py-50">
                  <CardHeader className="pb-1 pt-1">
                    <CardTitle>
                      <h4 className="mb-0">Recover your password</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Please enter your email address and we'll send you instructions on how to reset your password.
                  </p>

                  <CardBody className="pt-1">
                    <Alert color="danger" isOpen={!!error}>
                        <AlertCircle size={15} />
                        <span>
                            {error}
                        </span>
                    </Alert>
                    <br />
                    <Form onSubmit={onSubmit}>
                      <FormGroup className="form-label-group">
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={e => {setError(null); setEmail(e.target.value)}}
                          required
                        />
                        <Label>Email Address</Label>
                      </FormGroup>
                      <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                        <Button.Ripple
                          block
                          className="btn-block"
                          color="primary"
                          outline
                          onClick={e => {
                            e.preventDefault()
                            history.push("/login")
                          }}
                        >
                          Go Back to Login
                        </Button.Ripple>
                        <Button.Ripple
                          block
                          color="primary"
                          type="submit"
                          className="btn-block mt-1 mt-sm-0"
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          {isLoading &&
                              <Spinner color="white" size="sm" style={{marginRight: 5}} />
                          } 
                          Reset Password
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                }

                {successMessage &&
                  <div className="d-flex flex-column align-items-center justify-content-around" style={{margin: '10%'}}>
                    <MdCheckCircle size={100} className='success' />
                    <br />
                    <br />
                    <h4 style={{ color: '#2196F3', textAlign: 'center' }}>
                        {successMessage}
                    </h4>
                  </div>
                }
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
}
