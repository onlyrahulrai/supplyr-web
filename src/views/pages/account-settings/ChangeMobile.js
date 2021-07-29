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


  // This is responsible for starting the countdown timer according to otpResndCountdown on every otpResndCountdown value change. It is usually used on requesting for change mobile by an authenticated user.
  useEffect(() => {
    otpResendCountdown > 0 &&
      setTimeout(() => {
        setOtpResendCountdown(otpResendCountdown - 1);
      }, 1000);
  }, [otpResendCountdown]);

  // It is used for removing the response from the state(successMessage) after ----- otpResendCountDown value is equal to zero ------.
  const removeResponse = () => {
    setNewMobile("");
    setSuccessMessage(false);
    setError(false);
  };


  // This is responsible for requesting mobile number change for the authenticated users.
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
          setOtpResendCountdown(60);
        }
      })
      .catch((error) => console.log(error));
  };

  // This function is responsible for validating the input field.is its value is the mobile number or not.
  const onNewMobileChange = (e) => {
    setNewMobile(e.target.value);
    setError(false);
    e.target.setCustomValidity("");
    !validateMobileOrEmail(e.target.value) &&
      e.target.setCustomValidity("Enter valid 10-digit Mobile Number");
  };

  // This function is responsible for verifying the mobile number by taking OTP after requesting a mobile number change for the authenticated users.
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

  // This is a function. It is only triggered when a mobile number change becomes successful. 
  const handleAlertBox = () => {
    setHandleAlert(false);
    removeResponse();
  };

  return (
    <>
      {/* This is a form for requesting a mobile number change. */}
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
          {/* This is a countdown timer for OTP verification. It is only shown when a user requests a mobile number change. */}
          {successMessage && otpResendCountdown > 0 && (
            <div className="small text-secondary">
              OTP is valid for {otpResendCountdown} seconds
            </div>
          )}
        </div>
        <div className="col-md-5 d-flex justify-content-end align-items-center">
          {successMessage && successMessage.success && otpResendCountdown !== 0 && (
            // This is a form. It is used to verify the OTP for mobile number change.
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

          {/* This is a countdown timer for OTP verification. It is only shown when otp gets expired. */}
          {successMessage && successMessage.success && otpResendCountdown === 0 && (
            <>
              <Repeat size={13} color="#2196f3" style={{marginRight: 5}} />
              <button className="btn btn-sm btn-primary" onClick={(e) => handleOtp(e)}>Resend OTP</button>
            </>
          )}
        </div>
      </div>


      {/* This is a popup modal. It is only shown when mobile change becomes successful. */}
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
