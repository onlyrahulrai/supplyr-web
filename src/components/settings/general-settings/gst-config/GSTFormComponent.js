import useGstConfigSettingContext from "context/useGstConfigSettingContext";
import React from "react";
import Radio from "components/@vuexy/radio/RadioVuexy";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const GSTFormComponent = () => {
  const { data, onChange } = useGstConfigSettingContext();

  return (
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
                label="0%"
                className="d-flex align-items-center m-0"
                defaultChecked={data.default_gst_rate === 0}
                onChange={onChange}
                name="default_gst_rate"
                value={0}
              />
              <Radio
                label="3%"
                className="d-flex align-items-center m-0"
                defaultChecked={data.default_gst_rate === 3}
                onChange={onChange}
                name="default_gst_rate"
                value={3}
              />
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
        </Row>
      </Col>
    </Row>
  );
};

export default GSTFormComponent;
