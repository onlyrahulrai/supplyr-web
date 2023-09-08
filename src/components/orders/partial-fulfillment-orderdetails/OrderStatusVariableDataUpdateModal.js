import React, { useState } from "react";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Swal from "utility/sweetalert";
import apiClient from "api/base";
import { toast } from "react-toastify";

const OrderStatusVariableDataUpdateModal = () => {
  const {
    toggleOrderStatusVariableDataModal,
    onUpdateState,
    selectedOrderStatusVariable,
    fetchOrderData
  } = usePartialFulfillmentOrderDetailsContext();
  const [isFormLoading,setIsFormLoading] = useState(false);
  const params = useParams();

  const [orderStatusVariableData, setOrderStatusVariableData] = useState(
    selectedOrderStatusVariable
  );

  console.log(" Order Status Variable Data ",orderStatusVariableData)

  const onStatusVariableSubmit = async () => {
    setIsFormLoading((prevState) => !prevState);

    const requestedData = {
      order: params?.orderId,
      value: orderStatusVariableData?.value,
    };

    if(orderStatusVariableData?.order_group !== null){
      requestedData["order_group"] = orderStatusVariableData?.order_group
    }

    await apiClient
      .put(`orders/order-status-variable/${params?.orderId}/${orderStatusVariableData?.id}/`, requestedData)
      .then((response) => {
        setIsFormLoading((prevState) => !prevState);

        onUpdateState({
          toggleOrderStatusVariableDataModal: false,
          selectedOrderStatusVariable: null,
        })

        Swal.fire({
          icon: "success",
          title: "success",
          text: "Order status variable updated successfully.",
        });

        fetchOrderData();
      })
      .catch((error) => {
        setIsFormLoading(false);
        toast.error("Sorry, We couldn't update the order status variable.");
      });
  };

  return (
    <Modal
      isOpen={toggleOrderStatusVariableDataModal}
      toggle={() =>
        onUpdateState({ toggleOrderStatusVariableDataModal: false })
      }
      className="modal-dialog-centered"
    >
      <ModalHeader
        toggle={() =>
          onUpdateState({ toggleOrderStatusVariableDataModal: false })
        }
      >
        Update Order Status Variable:
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label htmlFor="value">
            {orderStatusVariableData?.variable_name}
          </Label>
          <Input
            type="text"
            value={orderStatusVariableData?.value}
            onChange={(e) =>
              setOrderStatusVariableData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }))
            }
            name="value"
            disabled={!toggleOrderStatusVariableDataModal}
          />
          {isFormLoading && <Spinner />}
        </FormGroup>
        <FormGroup>
          <Button
            outline
            color="primary"
            onClick={onStatusVariableSubmit}
          >
            Save
          </Button>
          <Button
            outline
            color="danger"
            className="ml-1"
            onClick={() =>
              onUpdateState({ toggleOrderStatusVariableDataModal: false })
            }
          >
            Cancel
          </Button>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
};

export default OrderStatusVariableDataUpdateModal;
