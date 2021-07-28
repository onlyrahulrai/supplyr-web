import React, { useEffect, useState } from "react";
import {
  Button,
  FormGroup,
  Row,
  Col,
  Input,
  Label,
  Form,
  Alert,
  FormFeedback,
  InputGroup,
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { AuthenticationApi } from "api/endpoints";
import SweetAlert from "react-bootstrap-sweetalert";
import { Repeat } from "react-feather";
import { connect } from "react-redux"

const ChangeMobile = (props) => {
  const [newMobile, setNewMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [handleAlert, setHandleAlert] = useState(false);
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);


  const validateMobileOrEmail = (text) => {
    const re =
      /^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(^\d{10}$)$/;
    return re.test(text);
  };

  useEffect(() => {
    otpResendCountdown > 0 &&
      setTimeout(() => {
        setOtpResendCountdown(otpResendCountdown - 1);
      }, 1000);

  }, [otpResendCountdown]);

  const removeResponse = () => {
    setNewMobile("");
    setSuccessMessage(false);
    setError(false);
  };

  const handleOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    AuthenticationApi.ChangeMobile({ new_mobile: newMobile })
      .then((res) => {
        setIsLoading(false);
        if (!res.data.success) {
          setSuccessMessage(res.data);
          setError(true);
        } else {
          setSuccessMessage(res.data);
          setOtpResendCountdown(40);
        }
      })
      .catch((error) => console.log(error));
  };

  const onNewMobileChange = (e) => {
    setNewMobile(e.target.value);
    setError(false);
    e.target.setCustomValidity("");
    !validateMobileOrEmail(e.target.value) &&
      e.target.setCustomValidity("Enter valid 10-digit Mobile Number");
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    AuthenticationApi.VerifyOtp({
      otp_id: successMessage.otp_id,
      new_mobile: successMessage.mobile_number,
      code: otp,
    })
      .then((res) => {
        setIsLoading(false);
        setSuccessMessage(res.data);
        setHandleAlert(true);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleAlertBox = () => {
    setHandleAlert(false);
    removeResponse();
  };

  return (
    <>
      <Form onSubmit={handleOtp}>
        <h4 className="text-center">Change Mobile Number</h4>
        <hr className="mt-1 mb-2 " style={{ width: "60%" }} />

        <h5>Your Current Mobile Number: {props.user.mobile_number}</h5>

        <hr style={{ width: "18%" }} className="ml-0 border-top-primary" />

        <FormGroup>
          <Label for="validState">New Mobile Number</Label>
          <Input
            valid={error}
            type="text"
            id="validState"
            name="validState"
            placeholder="New Mobile Number"
            value={newMobile}
            onChange={onNewMobileChange}
            disabled={successMessage && successMessage.success}
          />
          <FormFeedback valid={error}>
            <p>
              {successMessage &&
                !successMessage.success &&
                successMessage.message}
              {error}
            </p>
          </FormFeedback>
        </FormGroup>

        <div className="d-flex justify-content-between">
          {(!successMessage || (!successMessage.success && !error)) && (
            <Button.Ripple color="primary" type="submit">
              Change Mobile
            </Button.Ripple>
          )}
        </div>
      </Form>
      <div className="row justify-content-end">
        <div className="col-md-7">
          {successMessage && otpResendCountdown > 0 && (
            <div className="small text-secondary">
              OTP is valid for {otpResendCountdown} seconds
            </div>
          )}
        </div>
        <div className="col-md-5 d-flex justify-content-end align-items-center">
          {successMessage && successMessage.success && otpResendCountdown !== 0 && (
            <Form onSubmit={verifyOtp}>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="number"
                    placeholder="Enter the otp..."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <Button.Ripple
                      color="primary"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Verify
                    </Button.Ripple>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Form>
          )}

          {successMessage && successMessage.success && otpResendCountdown === 0 && (
            <>
              <Repeat size={13} color="#2196f3" style={{marginRight: 5}} />
              <button className="btn btn-sm btn-primary" onClick={(e) => handleOtp(e)}>Resend OTP</button>
            </>
          )}
        </div>
      </div>

      <SweetAlert
        success
        title="Success"
        show={handleAlert}
        onConfirm={handleAlertBox}
      >
        <p className="sweet-alert-text">Mobile Number change successfully</p>
      </SweetAlert>
    </>
  );
};


const mapStateToProps = state => {
    return {
      user: state.auth.userInfo,
    }
}

export default connect(mapStateToProps)(ChangeMobile);
