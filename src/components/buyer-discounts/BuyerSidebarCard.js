import apiClient from "api/base";
import useBuyerDiscountContext, { GenericDiscountDetail } from "context/useBuyerDiscountContext";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";
 
const BuyerSidebarCard = ({title,discount,noOfProducts,buyerName,buyer}) => {
  const {dispatch,state} = useBuyerDiscountContext();

  const onSelectBuyer = async () => {
    await apiClient
      .get(`discounts/seller-contact-with-buyers/${buyer.id}/`)
      .then((response) => {
        dispatch({type:"ON_STATE_UPDATE",payload:response.data})
      })
      .catch((error) => console.log(error));
  }

  return (
    <Card className={`cursor-pointer ${state?.buyer?.business_name === title ? "shadow-lg custom-bg-color text-white" : ""}`} onClick={onSelectBuyer}>
      <CardHeader>
        <CardTitle className={`text-capitalize ${state?.buyer?.business_name === title ? "text-white" : ""}`}>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <h6 className={`${state?.buyer?.business_name === title ? "text-white" : ""}`}>{buyerName}</h6>
        
        <GenericDiscountDetail discount={(state?.buyer?.business_name === title) ? (state?.generic_discount || discount) : discount} />
        
      </CardBody>
      <CardFooter>
        {
          console.log(" No of Product ",noOfProducts)
        }
        <span>{((state?.buyer?.business_name === title) ? state.discount_assigned_products.length : noOfProducts) || "No"} products with exclusive discount</span>
      </CardFooter>
    </Card>
  );
};

export default BuyerSidebarCard;
