import React, { useMemo, useState } from "react";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import Address from "components/inventory/Address";
import OrderStatus from "./OrderStatus";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import PriceDisplay from "components/utils/PriceDisplay";
import { BsCheck2Circle, BsReceipt } from "react-icons/bs";
import ShowTaxesComponent from "../orderadd/ShowTaxesComponent";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";
import { AiOutlineEdit } from "react-icons/ai";
import OrderStatusVariableDataUpdateModal from "./OrderStatusVariableDataUpdateModal";
import Swal from "utility/sweetalert";
import apiClient from "api/base";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OrderStatusChangeButton from "./OrderStatusChangeButton";
import { HiSwitchHorizontal } from "react-icons/hi";

const Sidebar = () => {
  const {
    onUpdateState,
    getButtonStatusesForOrderAction,
    items,
    isGlobalFulfillment,
    itemStatus,
    getItemsStatusesForSidebar,
    groups,
    isOrderEditable,
    isAllowedToGenerateInvoice,
    onClickToGenerateInvoice,
    isGeneratingInvoice,
    ...rest
  } = usePartialFulfillmentOrderDetailsContext();

  const [isMarkedPaid, setIsMarkedPaid] = useState(rest.is_paid);

  const { orderId } = useParams();

  const getAddress = useMemo(() => {
    return { ...rest?.address, state: rest?.address?.state?.name };
  }, [rest]);


  return (
    <div className="checkout-options">
      <Card>
        <CardBody>
          <Row className="mb-1">
            <Col>
              <h6 className="text-secondary">Order ID</h6>
              <h3>{rest.order_number}</h3>
              <h6>{rest.order_date}</h6>
            </Col>
            <Col sm="auto" className="ml-auto text-right">
              <p className="text-secondary">From</p>
              <div className="text-right text-secondary">
                <span>{`${
                  rest?.buyer?.name ? `(${rest?.buyer.name})` : ""
                }`}</span>
                <br />
                <strong className="text-light">
                  {rest?.buyer?.business_name}
                </strong>
              </div>
            </Col>
          </Row>

          <hr />
          <h6 className="text-secondary">STATUS</h6>
          <h3>
            {getItemsStatusesForSidebar(items).map((status, key) => (
              <OrderStatus
                status_code={status}
                key={`orderstatus-${key}`}
              />
            ))}
          </h3>

          <hr />
          <h6 className="text-secondary">SHIPPING ADDRESS</h6>
          {rest.address ? (
            <Address {...getAddress} />
          ) : (
            <div className="mt-1">
              <span>No Address Added!</span>
            </div>
          )}

          {rest?.toggleOrderStatusVariableDataModal ? (
            <OrderStatusVariableDataUpdateModal />
          ) : null}

          {rest?.status_variable_values?.length ? (
            <>
              <hr />

              <h6 className="text-secondary">INFORMATION</h6>

              {rest?.status_variable_values?.length ? (
                rest.status_variable_values?.map((status_variable, index) => (
                  <Row className="mt-1" key={`order_status_variable-${index}`}>
                    <Col xs={6}>
                      <strong>{status_variable.variable_name}</strong>
                      {["awaiting_approval", "approved", "processed"].includes(
                        rest?.order_status
                      ) ? (
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() =>
                            onUpdateState({
                              toggleOrderStatusVariableDataModal: true,
                              selectedOrderStatusVariable: status_variable,
                            })
                          }
                        >
                          <AiOutlineEdit size={20} />
                        </span>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col xs={6} className="text-right">
                      {status_variable.value}
                    </Col>
                  </Row>
                ))
              ) : (
                <span>No information added</span>
              )}
            </>
          ) : null}

          <hr />
          <div className="price-details">
            <p>Price Details</p>
          </div>
          <div className="detail">
            <div className="detail-title">Subtotal</div>
            <div className="detail-amt">
              <PriceDisplay amount={rest?.subtotal || 0} />
            </div>
          </div>

          <div className="detail">
            <div className="detail-title">Extra Discount</div>
            <div className="detail-amt discount-amt">
              -<PriceDisplay amount={rest?.total_extra_discount || 0} />
            </div>
          </div>

          <div className="detail">
            <div className="detail-title">Taxable Amount</div>
            <div className="detail-amt">
              <PriceDisplay amount={rest?.taxable_amount ?? 0} />
            </div>
          </div>

          <div className="detail">
            <div className="detail-title">
              Tax Amount&nbsp;
              <ShowTaxesComponent
                taxes={{
                  cgst: rest?.cgst,
                  sgst: rest?.sgst,
                  igst: rest?.igst,
                }}
              />
              :
            </div>
            <div className="detail-amt">
              <PriceDisplay amount={rest?.tax_amount} />
            </div>
          </div>

          <hr />
          <div className="detail">
            <div className="detail-title detail-total">Final Price</div>
            <div className="detail-amt total-amt">
              <PriceDisplay amount={rest?.total_amount} />
            </div>
          </div>

          <hr />

          <div className="detail">
            <div className="detail-title detail-total"></div>

            <div className="detail-amt total-amt mark-as-paid">
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
                          is_paid: true,
                        })
                        .then((response) => {
                          setIsMarkedPaid(true);

                          onUpdateState({
                            is_paid: true,
                          });

                          toast.success("Order is marked as paid");
                        })
                        .catch((error) => {
                          toast.error("Failed to mark order as paid.");
                        });
                    }
                  });
                }}
                label={isMarkedPaid ? "Marked as paid" : "Mark as paid"}
              />
            </div>
          </div>

          <h5 className="text-secondary">
            Order Mode: &nbsp;
            <b className="text-dark">
              {rest?.isPartialFulfillmentEnabled
                ? "Partial Fulfillment"
                : "Global Fulfillment"}
            </b>
            {isGlobalFulfillment(items) && isOrderEditable() ? (
              <span
                className="text-info cursor-pointer"
                onClick={() =>
                  onUpdateState({
                    isPartialFulfillmentEnabled:
                      !rest?.isPartialFulfillmentEnabled,
                  })
                }
              >
                <HiSwitchHorizontal size={24} className="ml-1" /> Switch to{" "}
                {rest?.isPartialFulfillmentEnabled ? "Global" : "Partial"}{" "}
              </span>
            ) : null}
          </h5>

          {(!rest?.isPartialFulfillmentEnabled || rest?.isPartialFulfillmentEnabled && rest?.partialOrderitemsIds?.length) ? getButtonStatusesForOrderAction(items).map((status, key) => (
            <OrderStatusChangeButton
              products={items}
              status={status}
              key={key}
            />
          )):null}

          {isAllowedToGenerateInvoice ? (
            <Button.Ripple
              color="warning"
              block
              className="btn-block"
              onClick={() => onClickToGenerateInvoice()}
              disabled={isGeneratingInvoice}
            >
              <BsReceipt size={20} color={"white"} />
              {rest?.invoice?.order ? " View Invoice" : " Generate Invoice"}
            </Button.Ripple>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

export default Sidebar;
