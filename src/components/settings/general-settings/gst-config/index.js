import useGstConfigSettingContext from "context/useGstConfigSettingContext";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  Form,
  Row,
  Spinner,
} from "reactstrap";
import CategoryOverrideGstFormComponent from "./CategoryOverrideGstFormComponent";
import GSTFormComponent from "./GSTFormComponent";

const GSTConfig = () => {
  const { enabled, onEnabledGST, loading } = useGstConfigSettingContext();

  return (
    <Card className="position-relative">
      <CardHeader>
        <CardTitle> GST Config Settings </CardTitle>
      </CardHeader>
      <hr />
      <CardBody>
        <div className="d-flex align-items-center">
          <span className="switch-label">Enable GST Taxes </span>{" "}
          &nbsp;&nbsp;&nbsp;
          <CustomInput
            type="switch"
            id="exampleCustomSwitch"
            name="customSwitch"
            inline
            checked={enabled}
            onChange={onEnabledGST}
          ></CustomInput>
        </div>

        {enabled ? (
          <Form className="my-3">
            <GSTFormComponent />
            <CategoryOverrideGstFormComponent />
          </Form>
        ) : null}
      </CardBody>

      {loading ? (
        <div className="position-absolute position-center">
          <Spinner />
        </div>
      ) : null}
    </Card>
  );
};

export default GSTConfig;
