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
import PerfectScrollbar from "react-perfect-scrollbar";
import { Menu } from "react-feather";

const BuyerDiscountMain = (props) => {
  return (
    <div className="content-right">
      <Card className="mb-0">
        <CardHeader>
          <CardTitle>
            <div
              className="d-lg-none mb-1"
              onClick={() => props.mainSidebar(true)}
            >
              <Menu size={24} />
            </div>
            Modern Electronics Store
          </CardTitle>
        </CardHeader>
        <hr />
        <CardBody>
          <div className="h-63 overflow-scroll-y buyer-discount-sidebar-users">
            <Row className="mx-0">
              <Col md="8">
                <h3>General Discount 10%</h3>
                <p>
                  This discount is applied across all your products unless you
                  choose to override this on per product basis below.
                </p>
              </Col>
              <Col
                md="4"
                className="d-flex justify-content-end align-items-center"
              >
                <Button.Ripple type="button" color="primary">
                  Change
                </Button.Ripple>
              </Col>
            </Row>
            <hr />
            <Row className="mx-0">
              <Col md="8">
                <h3>Product Specific Discounts</h3>
                <p>
                  Products discounts you will specily here will override any
                  general discoutns you have specified.
                </p>
              </Col>
              <Col
                md="4"
                className="d-flex justify-content-end align-items-center"
              >
                <Button.Ripple type="button" color="primary">
                  ADD A PRODUCT
                </Button.Ripple>
              </Col>
            </Row>
            <Row className=" py-2 mx-0  mt-2 border">
              <Col md="7">
                <h4>Hp Inspiron 14 inch laptop 256GB SSD</h4>
                <h5>&#8377; 2500 Discount</h5>
              </Col>
              <Col
                md="5"
                className="d-flex mt-2 mt-md-0 align-items-center justify-content-between"
              >
                <Button.Ripple type="button" color="primary">
                  Edit
                </Button.Ripple>
                <Button.Ripple type="button" color="danger">
                  Delete
                </Button.Ripple>
              </Col>
            </Row>
            <Row className=" py-2 mx-0 mt-2 border">
              <Col md="7">
                <h4>Apple Macbook Pro 16 M! Pro</h4>
                <h5>&#8377; 6000 Discount</h5>
              </Col>
              <Col
                md="5"
                className="d-flex mt-2 mt-md-0 align-items-center justify-content-between"
              >
                <Button.Ripple type="button" color="primary">
                  Edit
                </Button.Ripple>
                <Button.Ripple type="button" color="danger">
                  Delete
                </Button.Ripple>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BuyerDiscountMain;
