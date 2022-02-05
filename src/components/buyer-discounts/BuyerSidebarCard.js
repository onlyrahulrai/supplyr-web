import PriceDisplay from "components/utils/PriceDisplay";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";

const BuyerSidebarCard = ({title,discount,noOfProducts,buyerName,buyer,onClick}) => {
  console.log("Buyer comparison >>> ",buyer?.buyer?.business_name,title)
  return (
    <Card className={`cursor-pointer ${buyer?.buyer?.business_name === title ? "shadow-lg custom-bg-color text-white" : ""}`} onClick={onClick}>
      <CardHeader>
        <CardTitle className={`text-capitalize ${buyer?.buyer?.business_name === title ? "text-white" : ""}`}>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <h6 className={`${buyer?.buyer?.business_name === title ? "text-white" : ""}`}>{buyerName}</h6>
        
        {
          discount && (
            <>
              {
                discount?.discount_type === "percentage" ? (
                  <p>{Math.floor(discount?.discount_value || 0) }% General Discount</p>
                ):(
                  <PriceDisplay amount={discount?.discount_value || 0}/>
                )
              }
            </>
          )
        }
        
        
      </CardBody>
      <CardFooter>
        <span>{noOfProducts} products with exclusive discount</span>
      </CardFooter>
    </Card>
  );
};

export default BuyerSidebarCard;
