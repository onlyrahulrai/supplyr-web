import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

const Main = () => {
  return (
    <Card className="h-100 mt-5 overflow-scroll-y buyer-discount-sidebar-main">
      <CardHeader>
        <CardTitle>Modern Electronics Store</CardTitle>
      </CardHeader>
      <hr />
      <CardBody>
        <Row>
          <Col md="8">
            <h3>General Discount 10%</h3>
            <p>
              This discount is applied across all your products unless you
              choose to override this on per product basis below.
            </p>
          </Col>
          <Col md="4" className="d-flex justify-content-end align-items-center">
            <Button.Ripple type="button" color="primary">
              Change
            </Button.Ripple>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md="8">
            <h3>Product Specific Discounts</h3>
            <p>
              Products discounts you will specily here will override any general
              discoutns you have specified.
            </p>
          </Col>
          <Col md="4" className="d-flex justify-content-end align-items-center">
            <Button.Ripple type="button" color="primary">
              ADD A PRODUCT
            </Button.Ripple>
          </Col>
        </Row>
        <Row className=" py-2  mt-2 border">
          <Col md="7">
            <h4>Hp Inspiron 14 inch laptop 256GB SSD</h4>
            <h5>&#8377; 2500 Discount</h5>
          </Col>
          <Col
            md="5"
            className="d-flex align-items-center justify-content-between"
          >
            <Button.Ripple type="button" color="primary">
              Edit
            </Button.Ripple>
            <Button.Ripple type="button" color="danger">
              Delete
            </Button.Ripple>
          </Col>
        </Row>
        <Row className=" py-2 mt-2 border">
          <Col md="7">
            <h4>Apple Macbook Pro 16 M! Pro</h4>
            <h5>&#8377; 6000 Discount</h5>
          </Col>
          <Col
            md="5"
            className="d-flex align-items-center justify-content-between"
          >
            <Button.Ripple type="button" color="primary">
              Edit
            </Button.Ripple>
            <Button.Ripple type="button" color="danger">
              Delete
            </Button.Ripple>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Main;
