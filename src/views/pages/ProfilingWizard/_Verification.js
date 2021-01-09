import { Component, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Container,
    Col,
    Row,
    Spinner,
} from "reactstrap"
import { Check, Info, Send } from "react-feather"
import { useSelector } from "react-redux";
import apiClient from "api/base";
import {Toast} from "utility/sweetalert"
import { FloatingInputField } from "components/forms/fields";

const styles = {
    fieldTitle: {
        fontWeight: "bold",
    },
    fieldValue: {
        color: '#999'
    },
    verificationStatusIcon: {
        backgroundColor: "#1f9d57",
        borderRadius: "100%",
        padding: "3px",
    },
    verificationStatusIconUnverified: {
        backgroundColor: '#ff9f43',

    },
    verificationStatusText: {
        fontSize: 13,
        color: "#1f9d57",
    },
    verificationStatusTextUnverified: {
        color: '#ff9f43'
    },

    resendMailBtn: {
        fontSize: 12,
        color: "#2196f3"

    }
}

const VerifiedSymbol = () => (
  <>
    <Check
      style={styles.verificationStatusIcon}
      color="white"
      size={19}
    />{" "}
    <span style={styles.verificationStatusText}>Verified</span>
  </>
);

const UnverifiedSymbol = () => (
  <>
    <Info
      style={{...styles.verificationStatusIcon, ...styles.verificationStatusIconUnverified}}
      color="white"
      size={19}
    />{" "}
    <span style={{...styles.verificationStatusText, ...styles.verificationStatusTextUnverified}}>Unverified</span>
  </>
);

const OTPVerificationForm = ({otpId}) => {
    const [otpValue, setOtpValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const onClickSubmit = () => {
        if(otpValue) {
            setIsLoading(true)
            apiClient.post('/verify-mobile-verification-otp/', {otp_id: otpId, code: otpValue})
                .then((response) => {
                    
                    if(response.data?.success) {
                        Toast.fire({
                            icon: 'success',
                            title: "Mobile Number Verified Successfully"
                        })
                    }
                    else {
                        throw new Error(response.data?.message)
                    }
                })
                .catch((error) => {
                    const _errorMessage =  error.response?.data.message ?? error.message
                    Toast.fire({icon: 'error', title: _errorMessage})
                    setErrorMessage(_errorMessage)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    return (
        <Row>
            <Col sm={7}>
                <FloatingInputField
                    label = "Enter OTP"
                    type="number"
                    step='1'
                    min="0"
                    onChange={e => setOtpValue(e.target.value)}
                    value={otpValue}
                    error={errorMessage}
                />
            </Col>
            <Col sm={5}>
                <Button color="primary" disabled={isLoading} onClick={onClickSubmit}>
                    {isLoading &&
                        <Spinner color="white" size="sm" style={{marginRight: 5}} />
                    } 
                    Verify
                </Button>
            </Col>
        </Row>
    )
}


const Verification = () => {
    const userInfo = useSelector(state => state.auth.userInfo)
    const [isSendingVerificationMail, setIsSendingVerificationMail] = useState(false)
    const [otpStatus, setOtpStatus] = useState("unsent") //unsent/sending/sent
    const [otpId, setOtpId] = useState(null)

    const resendVerificationMail = () => {
        setIsSendingVerificationMail(true)

        !isSendingVerificationMail && apiClient.post('/profile/resend-verification-email/')
            .then((response) => {
                Toast.fire({
                    icon: 'success',
                    title: 'Email Successfully Sent'
                })
            })
            .catch(error => {
                const message = error.response?.data.message ?? error.message
                Toast.fire({
                    icon: 'error',
                    title: message
                  })
            })
            .finally(() => {
                setIsSendingVerificationMail(false)
            })
    }

    const onClickOtpSend = () => {
        setOtpStatus('sending')
        apiClient.post('/send-mobile-verification-otp/')
            .then((response) => {
                const _otpId = response.data?.otp_id
                if(_otpId) {
                    setOtpId(_otpId)
                    setOtpStatus('sent')
                    Toast.fire({
                        icon: 'success',
                        title: 'Verification OTP sent to your mobile'
                    })
                }
                else {
                    throw new Error()
                }
            })
            .catch((error) => {
                Toast.fire({icon: 'error', title: error.response?.data.message ?? error.message})
                setOtpStatus('unsent')
            })
    }
    
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
                            <Col md={2} style={styles.fieldTitle}>Email</Col>

                            <Col md={6}>
                                <div>
                                    <span style={styles.fieldValue}>
                                        {userInfo.email} {"  "}
                                    </span>
                                    
                                </div>
                                {userInfo.is_email_verified ? <VerifiedSymbol /> : <UnverifiedSymbol /> }
                                
                            </Col>
                            {!userInfo.is_email_verified &&
                                <Col md={4} className="text-right">
                                    {isSendingVerificationMail &&
                                        <Spinner size="sm" color="secondary" />
                                    }
                                    {!isSendingVerificationMail &&
                                        <Send size={13} color="#2196f3" />
                                    }
                                    {" "}
                                    
                                    <a style={styles.resendMailBtn} onClick={resendVerificationMail}>Resend Verification Mail</a>    
                                </Col>
                            }
                        </Row>
                        <br />
                        <br />
                        <Row>
                            <Col md={2} style={styles.fieldTitle}>Mobile Number</Col>

                            <Col md={6} style={styles.fieldValue}>
                                <div>{userInfo.mobile_number}</div>
                                {userInfo.is_mobile_verified ? <VerifiedSymbol /> : <UnverifiedSymbol /> }
                            </Col>
                            {!userInfo.is_mobile_verified &&
                                <Col md={4} className="text-right">
                                    {['unsent', 'sending'].includes(otpStatus) &&
                                        <Button color="primary" onClick={onClickOtpSend} disabled={otpStatus === 'sending'}>
                                            {otpStatus === 'sending' &&
                                                <Spinner color="white" size="sm" style={{marginRight: 5}} />
                                            }   
                                            Send OTP
                                        </Button>
                                    }
                                    {(otpStatus === 'sent') &&
                                        <OTPVerificationForm otpId={otpId} />
                                    }
                                </Col>
                            }
                        </Row>

                        <br/>
                    </CardBody>
                </Card>
            </Container>

        </div>
    
    )
}

export default Verification