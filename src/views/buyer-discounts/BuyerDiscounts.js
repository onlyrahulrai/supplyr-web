import { BuyerSidebar, Main } from "../../components/buyer-discounts";
import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const BuyerDiscounts = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col md="4" className="px-0">
            <BuyerSidebar />
          </Col>
          <Col md="8" >
            <Main />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BuyerDiscounts;
