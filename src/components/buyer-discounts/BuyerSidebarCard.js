import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";

const BuyerSidebarCard = ({title,discount,noOfProducts,buyer}) => {
  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <h6>{buyer}</h6>
        <p>{discount}% General Discount</p>
      </CardBody>
      <CardFooter>
        <span>{noOfProducts} products with exclusive discount</span>
      </CardFooter>
    </Card>
  );
};

export default BuyerSidebarCard;
