import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { capitalizeString } from "utility/general";
import { statusDisplayDict } from "assets/data/Rulesdata";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";

const OrderStatusChangeButton = ({ status, products }) => {
  const { getIcon, buttonClass } = statusDisplayDict[status];
  const { onClickFulfillmentButton,partialOrderitemsIds,isPartialFulfillmentEnabled} =
    usePartialFulfillmentOrderDetailsContext();

  return (
    <Button.Ripple
      color={buttonClass}
      className="btn-block btn-mt-half mt-half mb-half"
      block
      onClick={() => onClickFulfillmentButton(isPartialFulfillmentEnabled ? products.filter((product) => partialOrderitemsIds.includes(product.id)) : products,status)}
    >
      {getIcon(18, "white")}{" "}
      <span className="ml-half">Mark {capitalizeString(status)}</span>
    </Button.Ripple>
  );
};

export default OrderStatusChangeButton;
