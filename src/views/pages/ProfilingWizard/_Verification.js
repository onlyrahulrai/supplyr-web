import { Component, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Container,
  Col,
  Row,
  Spinner,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { Check, Edit, Edit3, Info, Repeat, Send } from "react-feather";
import { useSelector } from "react-redux";
import apiClient from "api/base";
import { Toast } from "utility/sweetalert";
import { FloatingInputField } from "components/forms/fields";

const otpResendCountdownSeconds = 40;

const styles = {
  fieldTitle: {
    fontWeight: "bold",
  },
  fieldValue: {
    color: "#999",
  },
  verificationStatusIcon: {
    backgroundColor: "#1f9d57",
    borderRadius: "100%",
    padding: "3px",
  },
  verificationStatusIconUnverified: {
    backgroundColor: "#ff9f43",
  },
  verificationStatusText: {
    fontSize: 13,
    color: "#1f9d57",
  },
  verificationStatusTextUnverified: {
    color: "#ff9f43",
  },

  resendMailBtn: {
    fontSize: 12,
    color: "#2196f3",
  },
};

const VerifiedSymbol = () => (
  <>
    <Check style={styles.verificationStatusIcon} color="white" size={19} />{" "}
    <span style={styles.verificationStatusText}>Verified</span>
  </>
);

const UnverifiedSymbol = () => (
  <>
    <Info
      style={{
        ...styles.verificationStatusIcon,
        ...styles.verificationStatusIconUnverified,
      }}
      color="white"
      size={19}
    />{" "}
    <span
      style={{
        ...styles.verificationStatusText,
        ...styles.verificationStatusTextUnverified,
      }}
    >
      Unverified
    </span>
  </>
);

const EditButton = ({ onClick }) => (
  <a onClick={onClick}>
    <Edit3 size={13} color="#2196f3" />
    <span style={{ color: "#2196f3" }}> edit</span>
  </a>
);

const EmailEditForm = ({ onClose, onSuccess }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
    apiClient
      .post("/change-email/", { new_email: value })
      .then(() => {
        onSuccess();
        Toast.fire({
          icon: "success",
          title: "Email changed successfully",
        });
      })
      .catch((error) => {
        const message = error.response?.data.message ?? error.message;
        Toast.fire({
          icon: "error",
          title: message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <Row>
        <Col sm={6}>
          <FormGroup className="form-label-group">
            <Input
              type="email"
              placeholder="New Email"
              onChange={(e) => setValue(e.target.value)}
              value={value}
              name="email"
              maxLength={150}
              disabled={isSubmitting}
            />
            <Label for="email">New Email</Label>
          </FormGroup>
        </Col>
        <Col sm={3}>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {isSubmitting && (
              <Spinner color="white" size="sm" style={{ marginRight: 5 }} />
            )}
            Save
          </Button>
        </Col>
        <Col sm={3}>
          <Button
            type="submit"
            color="secondary"
            outline
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </form>
  );
};

const MobileEditForm = ({ onClose, onSuccess }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
    apiClient
      .post("/change-mobile/", { new_mobile: value })
      .then(() => {
        onSuccess();
        Toast.fire({
          icon: "success",
          title: "Mobile Number changed successfully",
        });
      })
      .catch((error) => {
        const message = error.response?.data.message ?? error.message;
        Toast.fire({
          icon: "error",
          title: message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <Row>
        <Col sm={6}>
          <FormGroup className="form-label-group">
            <Input
              // type="email"
              placeholder="New Mobile Number"
              onChange={(e) => setValue(e.target.value)}
              value={value}
              name="ph"
              maxLength={150}
            />
            <Label for="ph">New Mobile Number</Label>
          </FormGroup>
        </Col>
        <Col sm={3}>
          <Button type="submit" color="primary">
            Save
          </Button>
        </Col>
        <Col sm={3}>
          <Button type="submit" color="secondary" outline onClick={onClose}>
            Cancel
          </Button>
        </Col>
      </Row>
    </form>
  );
};

const OTPVerificationForm = (props) => {
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  console.log("props>> ",props)
  const onClickSubmit = () => {
    if (otpValue) {
      setIsLoading(true);
      apiClient
        .post("/verify-mobile-verification-otp/", {
          otp_id: props.otpId,
          code: otpValue,
        })
        .then((response) => {
          if (response.data?.success) {
            props.forceStepRefresh()
            Toast.fire({
              icon: "success",
              title: "Mobile Number Verified Successfully",
            });
          } else {
            throw new Error(response.data?.message);
          }
        })
        .catch((error) => {
          const _errorMessage = error.response?.data.message ?? error.message;
          Toast.fire({ icon: "error", title: _errorMessage });
          setErrorMessage(_errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Row>
      <Col sm={7}>
        <FloatingInputField
          label="Enter OTP"
          type="number"
          step="1"
          min="0"
          onChange={(e) => setOtpValue(e.target.value)}
          value={otpValue}
          error={errorMessage}
        />
      </Col>
      <Col sm={5}>
        <Button color="primary" disabled={isLoading} onClick={onClickSubmit}>
          {isLoading && (
            <Spinner color="white" size="sm" style={{ marginRight: 5 }} />
          )}
          Verify
        </Button>
      </Col>
    </Row>
  );
};

const Verification = (props) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isSendingVerificationMail, setIsSendingVerificationMail] =
    useState(false);
  const [otpStatus, setOtpStatus] = useState("unsent"); //unsent/sending/sent
  const [otpId, setOtpId] = useState(null);
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);
  const [emailEditable, setEmailEditable] = useState(false);
  const [mobileEditable, setMobileEditable] = useState(false);

  const countdown = (otpResendCountdown) => {
    return otpResendCountdown > 0 &&
    setTimeout(() => setOtpResendCountdown(otpResendCountdown - 1), 1000);
  }

  useEffect(() => {
    const otpCountdown = countdown(otpResendCountdown)
    return otpCountdown
  }, [otpResendCountdown]);

  const resendVerificationMail = () => {
    setIsSendingVerificationMail(true);

    !isSendingVerificationMail &&
      apiClient
        .post("/profile/resend-verification-email/")
        .then((response) => {
          Toast.fire({
            icon: "success",
            title: "Email Successfully Sent",
          });
        })
        .catch((error) => {
          const message = error.response?.data.message ?? error.message;
          Toast.fire({
            icon: "error",
            title: message,
          });
        })
        .finally(() => {
          setIsSendingVerificationMail(false);
        });
  };

  const onClickOtpSend = (mode) => {
    setOtpStatus(mode === "resend" ? "resending" : "sending");
    apiClient
      .post("/send-mobile-verification-otp/")
      .then((response) => {
        const _otpId = response.data?.otp_id;
        if (_otpId) {
          setOtpId(_otpId);
          setOtpStatus("sent");
          Toast.fire({
            icon: "success",
            title: "Verification OTP sent to your mobile",
          });
          setOtpResendCountdown(otpResendCountdownSeconds);
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error.response?.data.message ?? error.message,
        });
        setOtpStatus("unsent");
      });
  };


  return (
    <div className="mt-3 col-xl-6 col-lg-8 col-md-10 col-12 mx-auto">
      <Container>
        <h4>Email and Phone Verification</h4>
        <hr />
        <Card>
          <CardHeader className="">
            {/* <h3 className="mt-3">Your details have been verified</h3> */}
          </CardHeader>

          <CardBody className="text-center0 pt-0">
            <Row>
              <Col md={2} style={styles.fieldTitle}>
                Email
              </Col>

              <Col md={6}>
                <div>
                  {!emailEditable && (
                    <span style={styles.fieldValue}>
                      {userInfo.email} {"  "}
                      {!userInfo.is_email_verified && (
                        <EditButton onClick={(e) => setEmailEditable(true)} />
                      )}
                    </span>
                  )}
                  {emailEditable && (
                    <EmailEditForm
                      onClose={(e) => setEmailEditable(false)}
                      onSuccess={(e) => setEmailEditable(false)}
                    />
                  )}
                </div>
                {userInfo.is_email_verified ? (
                  <VerifiedSymbol />
                ) : (
                  <UnverifiedSymbol />
                )}
              </Col>
              {!userInfo.is_email_verified && (
                <Col md={4} className="text-right">
                  <div className="secondary small">
                    Click on the link sent to your email to verify your email
                    address.
                  </div>
                  {isSendingVerificationMail && (
                    <Spinner size="sm" color="secondary" />
                  )}
                  {!isSendingVerificationMail && (
                    <Send size={13} color="#2196f3" />
                  )}{" "}
                  <a
                    style={styles.resendMailBtn}
                    onClick={resendVerificationMail}
                  >
                    Resend Verification Mail
                  </a>
                </Col>
              )}
            </Row>
            <br />
            <br />
            <Row>
              <Col md={2} style={styles.fieldTitle}>
                Mobile Number
              </Col>

              <Col md={6} style={styles.fieldValue}>
                {!mobileEditable && (
                  <div>
                    {userInfo.mobile_number}{" "}
                    {!userInfo.is_mobile_verified && (
                      <EditButton onClick={(e) => setMobileEditable(true)} />
                    )}
                  </div>
                )}
                {mobileEditable && (
                  <MobileEditForm
                    onClose={(e) => setMobileEditable(false)}
                    onSuccess={(e) => {
                      setMobileEditable(false);
                      setOtpStatus("unsent");
                    }}
                  />
                )}
                {userInfo.is_mobile_verified ? (
                  <VerifiedSymbol />
                ) : (
                  <UnverifiedSymbol />
                )}
              </Col>
              {!userInfo.is_mobile_verified && (
                <Col md={4} className="text-right">
                  {["unsent", "sending"].includes(otpStatus) && (
                    <Button
                      color="primary"
                      onClick={onClickOtpSend}
                      disabled={otpStatus === "sending"}
                    >
                      {otpStatus === "sending" && (
                        <Spinner
                          color="white"
                          size="sm"
                          style={{ marginRight: 5 }}
                        />
                      )}
                      Send OTP
                    </Button>
                  )}
                  {["sent", "resending"].includes(otpStatus) && (
                    <>
                      <OTPVerificationForm otpId={otpId} forceStepRefresh={props.forceStepRefresh}/>
                      <div className="text-right">
                        {otpResendCountdown > 0 && (
                          <div className="small text-secondary">
                            Resend OTP in {otpResendCountdown} seconds
                          </div>
                        )}
                        {otpResendCountdown === 0 && (
                          <>
                            {otpStatus !== "resending" && (
                              <Repeat
                                size={13}
                                color="#2196f3"
                                style={{ marginRight: 5 }}
                              />
                            )}
                            {otpStatus === "resending" && (
                              <Spinner
                                color="secondary"
                                size="sm"
                                style={{ marginRight: 5 }}
                              />
                            )}
                            <a
                              className="small"
                              style={styles.resendMailBtn}
                              onClick={(e) =>
                                otpStatus !== "resending" &&
                                onClickOtpSend("resend")
                              }
                            >
                              Resend OTP
                            </a>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </Col>
              )}
            </Row>

            <br />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Verification;
