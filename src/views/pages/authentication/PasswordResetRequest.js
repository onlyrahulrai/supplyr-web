import React, { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { history } from "../../../history";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import resetImg from "assets/img/pages/forgot-password.png";
import "assets/scss/pages/authentication.scss";
import { Mail, AlertCircle, Repeat } from "react-feather";
import { AuthenticationApi } from "api/endpoints";

export default function PasswordReset(props) {
  // const uid = props.match.params.uid
  // const token = props.match.params.token
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);


  // This is responsible for starting the countdown timer according to otpResndCountdown on every otpResndCountdown value change. It is usually used on requesting for change mobile by an authenticated user.
  useEffect(() => {
    const unsubscribe =
      otpResendCountdown > 0 &&
      setTimeout(() => {
        setOtpResendCountdown(otpResendCountdown - 1);
      }, 1000);
    return unsubscribe;
  }, [otpResendCountdown]);

  // This is a function. It is only triggered when anyone request a reset password. It works according to mobile number and email.
  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    validateMobileOrEmail(value) && value.includes("@")
      ? AuthenticationApi.requestPasswordReset({
          email: value,
        })
          .then((response) => {
            console.log(response.data);
            setIsLoading(false);
            setSuccessMessage(response.data);
          })
          .catch((error) => {
            let message = error.response?.data?.email ?? error.message;
            message = message
              ? message
              : error.response?.data?.token
              ? "Link Expired"
              : "Unknown Error";
            setError(message)
            setIsLoading(false)
          })
      : AuthenticationApi.requestPasswordReset({
          mobile_number: value,
        })
          .then((response) => {
            console.log(response.data);
            setIsLoading(false);
            setSuccessMessage(response.data);
            setOtpResendCountdown(40);
          })
          .catch((error) => {
            let message = error.response?.data?.email ?? error.message;
            message = message
              ? message
              : error.response?.data?.token
              ? "Link Expired"
              : "Unknown Error";
            setError(message)
            setIsLoading(false)
          });
  };

  // This function is responsible for verifying the mobile number by taking OTP after requesting a mobile number change.
  const handleOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // setSuccessMessage(false);
    if (password1 !== password2) {
      setError("Both password fields do not match");
      setIsLoading(false);
    } else {
      AuthenticationApi.resetMobilePassword({
        otp_id: successMessage.otp_id,
        code: otp,
        new_password1: password1,
        new_password2: password2,
        mobile_number: successMessage?.mobile_number,
      })
        .then((res) => {
          console.log(res.data);
          setIsLoading(false);
          setSuccessMessage(res.data);
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
    }
  };

  // This function validates the mobile number and email.
  function validateMobileOrEmail(text) {
    const re =
      /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(^\d{10}$)$/;
    return re.test(text);
  }
  
  const onEmailChange = (e) => {
    setValue(e.target.value);
    e.target.setCustomValidity("");
    !validateMobileOrEmail(e.target.value) &&
      e.target.setCustomValidity(
        "Enter valid 10-digit Mobile Number or Email Address"
      );
  };
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
          <Row className="m-0 justify-content-center">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-5"
            >
              <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
            </Col>
            {!successMessage && (
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 py-50">
                  <CardHeader className="pb-1 pt-1">
                    <CardTitle>
                      <h4 className="mb-0">Recover your password</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Please enter your email address and we'll send you
                    instructions on how to reset your password.
                  </p>

                  <CardBody className="pt-1">
                    <Alert color="danger" isOpen={!!error}>
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </Alert>
                    <br />
                    <Form onSubmit={onSubmit}>
                      <FormGroup className="form-label-group">
                        <Input
                          type="text"
                          placeholder="10-digit Mobile Number or Email"
                          value={value}
                          onChange={onEmailChange}
                          required
                        />
                        <Label>Email Address</Label>
                      </FormGroup>
                      <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                        <Button.Ripple
                          block
                          color="primary"
                          outline
                          onClick={(e) => {
                            e.preventDefault();
                            history.push("/login");
                          }}
                          size="sm"
                          className="pt-1 pb-1"
                        >
                          Go Back to Login
                        </Button.Ripple>
                        <Button.Ripple
                          block
                          color="primary"
                          type="submit"
                          size="sm"
                          className="pt-1 pb-1"
                          // className="btn-block mt-1 mt-sm-0"
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Spinner
                              color="white"
                              size="sm"
                              style={{ marginRight: 5 }}
                            />
                          )}
                          Reset Password
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            )}

            {successMessage && successMessage.mobile_number && (
              <Col lg="6" md="12" className="p-0">
                <CardBody>
                  <h4>Validate Otp</h4>
                  <p>Welcome back, please type your Otp.</p>
                  <Alert color="danger" isOpen={!!error}>
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </Alert>
                  <br />
                  <Form onSubmit={handleOtp}>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="text"
                        placeholder="Please type your otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                      <Label>Mobile Number or Email</Label>
                    </FormGroup>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                    </FormGroup>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="password"
                        placeholder="confirm your new password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                      <Label>Mobile Number or Email</Label>
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                      {successMessage && otpResendCountdown > 0 && (
                        <>
                          <div className="small text-secondary">
                            OTP is valid for {otpResendCountdown} seconds
                          </div>

                          <Button.Ripple
                            color="primary"
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading}
                          >
                            Submit
                          </Button.Ripple>
                        </>
                      )}
                      {successMessage &&
                        successMessage.success &&
                        otpResendCountdown === 0 && (
                          <>
                            <Repeat
                              size={13}
                              color="#2196f3"
                              style={{ marginRight: 5 }}
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => onSubmit(e)}
                            >
                              Resend OTP
                            </button>
                          </>
                        )}
                    </div>
                  </Form>
                </CardBody>
              </Col>
            )}

            {successMessage &&
              successMessage.message &&
              successMessage.success &&
              !successMessage.mobile_number && (
                <Col lg="6" md="12" className="p-0">
                  <div className="d-flex flex-column align-items-center justify-content-between">
                    <MdCheckCircle size={100} className="success" />
                    <h4 style={{ color: "#2196F3", textAlign: "center" }}>
                      {successMessage.message} <br />
                      <br /> {successMessage && successMessage.email}
                      {successMessage && successMessage.name}
                    </h4>
                    <Button.Ripple
                      color="primary"
                      outline
                      onClick={() => {
                        history.push("/login");
                        localStorage.setItem(
                          "successMessage",
                          JSON.stringify(false)
                        );
                      }}
                      size="sm"
                      className="pt-1 pb-1 mt-2 mb-2"
                    >
                      Go Back To Login
                    </Button.Ripple>
                  </div>
                </Col>
              )}
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
