import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import Radio from "components/@vuexy/radio/RadioVuexy";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";

const initialData = {
  gst_number: "",
  default_gst_rate: "",
  address: "",
};

const GSTSetting = () => {
  const [enabled, setEnabled] = useState(false);
  const [isOverideGSTEnabled, setIsOverideGSTEnabled] = useState(false);
  const [data, setData] = useState(initialData);

  const onChange = (e) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <Card>
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
            value={enabled}
            onChange={() => setEnabled((prevState) => !prevState)}
          ></CustomInput>
        </div>

        {enabled ? (
          <Form className="my-3">
            <Row>
              <Col sm="4">
                <span>GST Config</span>
              </Col>
              <Col sm="8">
                <Row>
                  <Col sm="12">
                    <Label for="nameVerticalIcons">GST Number</Label>
                    <FormGroup className="has-icon-left position-relative">
                      <Input
                        type="text"
                        name="gst_number"
                        id="gst_number"
                        placeholder="GST Number"
                        value={data.gst_number}
                        onChange={onChange}
                      />
                      <div className="form-control-position">
                        <FaRegMoneyBillAlt />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="12">
                    <Label for="default_gst_rate">Default GST Rate</Label>
                    <FormGroup className="d-flex align-items-center justify-content-between has-icon-left position-relative default_gst_rate">
                      <Radio
                        label="5%"
                        className="d-flex align-items-center m-0"
                        defaultChecked={data.default_gst_rate === 5}
                        onChange={onChange}
                        name="default_gst_rate"
                        value={5}
                      />
                      <Radio
                        label="12%"
                        className="d-flex align-items-center"
                        defaultChecked={data.default_gst_rate === 12}
                        onChange={onChange}
                        name="default_gst_rate"
                        value={12}
                      />
                      <Radio
                        label="18%"
                        className="d-flex align-items-center"
                        defaultChecked={data.default_gst_rate === 18}
                        onChange={onChange}
                        name="default_gst_rate"
                        value={18}
                      />
                      <Radio
                        label="28%"
                        className="d-flex align-items-center"
                        defaultChecked={data.default_gst_rate === 28}
                        onChange={onChange}
                        name="default_gst_rate"
                        value={28}
                      />
                    </FormGroup>
                  </Col>

                  <Col sm="12" className="mb-1">
                    <div className="d-flex align-items-center">
                      <span className="switch-label">Add Override GST </span>{" "}
                      &nbsp;&nbsp;&nbsp;
                      <CustomInput
                        type="switch"
                        id="override"
                        name="override"
                        inline
                        value={isOverideGSTEnabled}
                        onChange={() => setIsOverideGSTEnabled((prevState) => !prevState)}
                      ></CustomInput>
                    </div>
                    {isOverideGSTEnabled ? (
                      <div className="override">
                        <CustomAsyncPaginate 
                          path="inventory/seller-categories/"
                          getOptionLabel={(props) => props.name}
                          getOptionValue={(props) => props.id}
                          className="my-1"
                          menuPortalTarget={document.body} 
                          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                      </div>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>

           
          </Form>
        ) : null}
      </CardBody>
    </Card>
  );
};

export default GSTSetting;
