import React, { useState } from "react";
import { Col, FormGroup, Input, Label, Row, Button } from "reactstrap";

const SellerAddressComponent = () => {
  const [data, setData] = useState({});

  const onChange = (e) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  return (
    <Row>
      <Col sm="4">
        <span>Address</span>
      </Col>
      <Col sm="8">
        <Row>
          <Col sm="12">
            <Label for="line1">House/Shop Number, Apartment/Company:</Label>
            <FormGroup className="has-icon-left position-relative">
              <Input
                type="text"
                name="line1"
                id="line1"
                placeholder="House/Shop Number, Apartment/Company..."
                value={data?.line1}
                onChange={onChange}
              />
              <div className="form-control-position">
                <BiCurrentLocation />
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <Label for="line2">Colony/Street, Additional Details:</Label>
            <FormGroup className="has-icon-left position-relative">
              <Input
                type="text"
                name="line2"
                id="line2"
                placeholder="Colony/Street, Additional Details..."
                value={data?.line2}
                onChange={onChange}
              />
              <div className="form-control-position">
                <BiCurrentLocation />
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <Row>
              <Col sm="6">
                <Label for="pincode">Pin Code</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="pincode"
                    id="pincode"
                    placeholder="Pin Code"
                    value={data?.pincode}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <Label for="city">City</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="city"
                    value={data?.city}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col sm="12">
            <Row>
              <Col sm="6">
                <Label for="state">State</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State"
                    value={data?.state}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <Label for="country">Country</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Country"
                    value={data?.country}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup className="has-icon-left position-relative">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={(e) => e.preventDefault()}
                  >
                    Save
                  </Button.Ripple>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SellerAddressComponent;
