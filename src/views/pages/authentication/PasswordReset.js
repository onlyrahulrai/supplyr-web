import React, { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { history } from "../../../history";
import { useSelector } from "react-redux";
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
import resetImg from "assets/img/pages/reset-password.png";
import "assets/scss/pages/authentication.scss";
import { AlertCircle } from "react-feather";
import { AuthenticationApi } from "api/endpoints";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PasswordReset(props) {
  const uid = props.match.params.uid;
  const token = props.match.params.token;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const query = useQuery();

  const url = `register/verify-email/`;

  successMessage()

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Both password fields do not match");
      return;
    }
    setIsLoading(true);

    AuthenticationApi.resetEmailPassword({
      uid,
      token,
      new_password1: password,
      new_password2: confirmPassword,
      email: query.get("email"),
    })
      .then((response) => {
        history.push("/forgot-password");
        setSuccessMessage(response.data);
        localStorage.setItem("successMessage", JSON.stringify(response.data));
      })
      .catch((error) => {
        let message =
          error.response?.data?.new_password2 ??
          error.response?.data?.new_password1;
        message = message
          ? message
          : error.response?.data?.token
          ? "Link Expired"
          : error.message;
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-5"
            >
              <img className="mx-2" src={resetImg} alt="resetImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              {!successMessage && (
                <Card className="rounded-0 mb-0 px-2 py-50">
                  <CardHeader className="pb-1 pt-1">
                    <CardTitle>
                      <h4 className="mb-0">Reset Password</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Please enter your email address and new password to
                    continue.
                  </p>

                  <CardBody className="pt-1">
                    <Alert color="danger" isOpen={!!error}>
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </Alert>
                    <br />
                    <Form>
                      <FormGroup className="form-label-group">
                        <Input
                          type="password"
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => {
                            setError(null);
                            setPassword(e.target.value);
                          }}
                          required
                        />
                        <Label>New Password</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setError(null);
                            setConfirmPassword(e.target.value);
                          }}
                          required
                        />
                        <Label>Confirm New Password</Label>
                      </FormGroup>
                      <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">
                        <Button.Ripple
                          block
                          color="primary"
                          // type="submit"
                          className="btn-block mt-1 mt-sm-0"
                          onClick={onSubmit}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Spinner
                              color="white"
                              size="sm"
                              style={{ marginRight: 5 }}
                            />
                          )}
                          Reset
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              )}

              {successMessage && (
                <div className="d-flex flex-column align-items-center justify-content-around">
                  <MdCheckCircle size={100} className="success" />
                  <br />
                  <br />
                  <h4 style={{ color: "#2196F3", textAlign: "center" }}>
                    {successMessage.message}
                  </h4>
                  <span>{successMessage.email}</span>
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
