import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";

const BuyerSidebarCard = ({title,discount,noOfProducts,buyerName,buyer,onClick}) => {
  console.log("Buyer comparison >>> ",buyer?.buyer?.business_name === title)
  return (
    <Card className={`cursor-pointer ${buyer?.buyer?.business_name === title ? "shadow-lg bg-primary text-light" : ""}`} onClick={onClick}>
      <CardHeader>
        <CardTitle className={`text-capitalize ${buyer?.buyer?.business_name === title ? "text-light" : ""}`}>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <h6 className={`${buyer?.buyer?.business_name === title ? "text-light" : ""}`}>{buyerName}</h6>
        <p>{discount}% General Discount</p>
      </CardBody>
      <CardFooter>
        <span>{noOfProducts} products with exclusive discount</span>
      </CardFooter>
    </Card>
  );
};

export default BuyerSidebarCard;
