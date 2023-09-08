import React from "react";
import { BsCheck, BsCheckAll, BsClockHistory, BsTrash } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { RiTruckLine } from "react-icons/ri";
import { Col, Row } from "reactstrap";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";

const statusDisplayDict = {
  awaiting_approval: {
    name: "Awaiting Approval",
    getIcon: (size, color) => (
      <BsClockHistory size={size} color={color ?? "orange"} />
    ),
    color: "orange",
    buttonClass: "secondary",
    buttonLabel: "Mark Unapproved",
  },
  approved: {
    name: "Approved",
    getIcon: (size, color) => (
      <BsCheck size={size} color={color ?? "#00cfe8"} />
    ),
    color: "#00cfe8",
    buttonClass: "info",
    buttonLabel: "Approve",
  },
  processed: {
    name: "Order Processed",
    getIcon: (size, color) => (
      <BsCheck size={size} color={color ?? "#7367f0"} />
    ),
    color: "#7367f0",
    buttonClass: "primary",
    buttonLabel: "Mark Order Processed",
  },
  dispatched: {
    name: "Dispatched",
    getIcon: (size, color) => (
      <RiTruckLine size={size} color={color ?? "#ff9f43"} />
    ),
    color: "#ff9f43",
    buttonClass: "warning",
    buttonLabel: "Mark Dispatched",
  },
  delivered: {
    name: "Delivered",
    getIcon: (size, color) => (
      <BsCheckAll size={size} color={color ?? "#28c76f"} />
    ),
    color: "#28c76f",
    buttonClass: "success",
    buttonLabel: "Mark Delivered",
  },
  returned: {
    name: "Returned",
    getIcon: (size, color) => (
      <GiReturnArrow size={size} color={color ?? "#ea5455"} />
    ),
    color: "#ea5455",
    buttonClass: "danger",
    buttonLabel: "Mark Returned",
  },
  cancelled: {
    name: "Cancelled",
    getIcon: (size, color) => (
      <BsTrash size={size ?? 16} color={color ?? "tomato"} />
    ),
    color: "tomato",
    buttonClass: "danger",
    buttonLabel: "Cancel Order",
  },
};

function OrderStatus({ status_code, size = 16,...rest }) {
  const statusDisplayData = statusDisplayDict[status_code];
  const {order_status_options} = usePartialFulfillmentOrderDetailsContext();

  const orderStatus = (status) => {
    const option = order_status_options.find(
      (option) => option.slug === status
    );
    return option ? option.name : status;
  };

  return (
    <Row {...rest}>
      <Col sm="auto">
        <span>{statusDisplayData?.getIcon(size)} &nbsp;</span>
        <span style={{ fontSize: size, color: statusDisplayData?.color }}>
          {orderStatus(status_code)}
        </span>
      </Col>
    </Row>
  );
}

export default OrderStatus;
