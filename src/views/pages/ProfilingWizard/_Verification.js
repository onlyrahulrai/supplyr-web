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

const Verification = () => {
    const userInfo = useSelector(state => state.auth.userInfo)
    const [isSendingVerificationMail, setIsSendingVerificationMail] = useState(false)

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
    
    return (
        <div className="mt-3">

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

                            <Col md={10} style={styles.fieldValue}>
                                <div>{userInfo.mobile_number}</div>
                                {userInfo.is_mobile_verified ? <VerifiedSymbol /> : <UnverifiedSymbol /> }
                            </Col>
                        </Row>

                        <br/>
                    </CardBody>
                </Card>
            </Container>

        </div>
    
    )
}

export default Verification