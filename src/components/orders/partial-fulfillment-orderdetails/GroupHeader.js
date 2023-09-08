import { statusDisplayDict } from "assets/data/Rulesdata";
import React, { useState } from "react";
import { Check, ChevronDown } from "react-feather";
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
  Row,
  UncontrolledButtonDropdown,
} from "reactstrap";
import { capitalizeString } from "utility/general";
import Checkbox from "../../@vuexy/checkbox/CheckboxesVuexy";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";
import { AiOutlineEdit } from "react-icons/ai";

const GroupHeader = ({ group, products }) => {
  const { order_group, status } = group;
  const {
    getButtonStatusesForOrderAction,
    getSelectedGroupProductsSize,
    onSelectAllProducts,
    onClickFulfillmentButton,
    onClickToGenerateInvoice,
    onUpdateState,
  } = usePartialFulfillmentOrderDetailsContext();
  const { getIcon, color } = statusDisplayDict[status];

  return (
    <ListGroup className="list-group-horizontal-sm mb-1">
      {!["delivered", "cancelled"].includes(status) ? (
        <ListGroupItem className="d-flex align-items-center flex-fill">
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            checked={getSelectedGroupProductsSize(products) === products.length}
            onChange={() => onSelectAllProducts(products)}
          />
          <span className="ml-1">
            {getSelectedGroupProductsSize(products)} Selected
          </span>
        </ListGroupItem>
      ) : null}

      {order_group ? (
        <>
          <ListGroupItem className="d-flex align-items-center justify-content-center flex-fill">
            Order Group &nbsp; {order_group.group_index}
          </ListGroupItem>
          <ListGroupItem className="d-flex align-items-center justify-content-center flex-fill">
            {getIcon(18, color)}
            <span
              style={{
                color: color,
                marginLeft: "6px",
              }}
            >
              {capitalizeString(status)}
            </span>
          </ListGroupItem>

          {!["returned", "cancelled"].includes(status) ? (
            <ListGroupItem className="d-flex align-items-center justify-content-center flex-fill">
              <Button.Ripple
                color="warning"
                outline
                onClick={() => onClickToGenerateInvoice(order_group?.id)}
              >
                {order_group?.invoice ? "View Invoice" : "Generate Invoice"}
              </Button.Ripple>
            </ListGroupItem>
          ) : null}
        </>
      ) : (
        ""
      )}

      {order_group?.status_variable_values.length > 0 ? (
        <ListGroupItem className="d-flex align-items-center justify-content-center flex-fill">
          <UncontrolledButtonDropdown>
            <DropdownToggle outline color="primary" caret>
              Information
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu style={{ width: "368px", padding: "12px" }}>
              {order_group?.status_variable_values?.map((variable, index) => (
                <DropdownItem
                  key={`group-variable-${index}`}
                  style={{ cursor: "auto" }}
                  tabIndex={index}
                >
                  <Row key={`information-${index}`}>
                    <Col xs={6}>
                      <strong>{variable.variable_name}</strong>

                      { !order_group?.invoice ? (
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() =>
                            onUpdateState({
                              toggleOrderStatusVariableDataModal: true,
                              selectedOrderStatusVariable: variable,
                            })
                          }
                        >
                          <AiOutlineEdit size={20} />
                        </span>
                        ):null }
                    </Col>
                    <Col xs={6} className="text-right">
                      {variable.value}
                    </Col>
                  </Row>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </ListGroupItem>
      ) : null}

      {!["delivered", "cancelled"].includes(status) && (
        <ListGroupItem className="d-flex align-items-center justify-content-end flex-fill">
          <UncontrolledButtonDropdown>
            <DropdownToggle outline color="primary" caret>
              Action
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              {getButtonStatusesForOrderAction(products).map(
                (_status, index) => {
                  const { color, getIcon } = statusDisplayDict[_status];
                  return (
                    <DropdownItem
                      tag="a"
                      className="py-half"
                      style={{ color: color }}
                      key={index}
                      onClick={() =>
                        onClickFulfillmentButton(products, _status)
                      }
                    >
                      <span>{getIcon(18, color)}</span>
                      <span style={{ marginLeft: "6px" }}>
                        Mark {capitalizeString(_status)}
                      </span>
                    </DropdownItem>
                  );
                }
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </ListGroupItem>
      )}

      {/* {(order_group && !["returned","cancelled"].includes(status)) ? (
        <ListGroupItem className="d-flex align-items-center justify-content-end flex-fill">
          <Checkbox
            color="success"
            icon={<BsCheck2Circle color="white" size={16} />}
            checked={isMarkedPaid}
            disabled={isMarkedPaid}
            onChange={(e) => {
              Swal.fire({
                title: "Are you sure?",
                text: `Do you want to mark this order as paid.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Mark as paid`,
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await apiClient
                    .put(`orders/${orderId}/mark-as-paid/`, {
                      order_group:order_group ? order_group?.id : null,
                      is_paid: true,
                    })
                    .then((response) => {
                      rest.setState(
                        {
                          is_paid: true,
                        },
                        () => {
                          setIsMarkedPaid(true);
                          toast.success("Order is marked as paid");
                        }
                      );
                    })
                    .catch((error) => {
                      console.log(" ----- Error ----- ", error);
                      toast.error("Failed to mark order as paid.");
                    });
                }
              });
            }}
            label={isMarkedPaid ? "Marked as paid" : "Mark as paid"}
          />
        </ListGroupItem>
      ) : null} */}
    </ListGroup>
  );
};

export default GroupHeader;
