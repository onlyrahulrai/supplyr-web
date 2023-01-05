import useOrderAddContext from "context/useOrderAddContext";
import React from "react";
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const Address = (props) => {
  const { id, name, line1, line2, pin, city, state} = props.address;
  const {orderInfo} = useOrderAddContext();

  return (
    <Col md="6" onClick={() => props.onClick(id)} className={`cursor-pointer`}>
      <Card className={`${orderInfo.address.id === id && "bg-danger text-white"}`}>
        <CardBody>
          <div>
            <strong>Address:</strong> <span>{name}</span>
          </div>
          <div>
            <strong>City:</strong>{" "}
            <span>
              {city} (Pin - {pin})
            </span>
          </div>
          <div>
            <strong>Line 1:</strong>
            {"   "}
            <span>{line1}</span>
          </div>
          <div>
            <strong>Line 2:</strong>
            {"   "}
            <span>{line2}</span>
          </div>

          <div>
            <strong>State:</strong>
            {"   "}
            <span>{state}</span>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

const SelectBuyerModal = ({ isOpen, onToggleModal }) => {
  const { buyer ,onChangeOrderInfo} = useOrderAddContext();

  const onAddressClick = (id) => {
    const address = buyer.address.find((address) => address.id === id);
    onChangeOrderInfo({address:address})
    onToggleModal()
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onToggleModal}
      className="modal-dialog-centered select-buyer-address modal-lg"
    >
      <ModalHeader toggle={onToggleModal}>Select Buyer Address:</ModalHeader>
      <ModalBody>
        <Row>
          {buyer &&
            buyer.address.map((address, index) => (
              <Address address={{...address,state:address.state.name}} key={index} onClick={(id) => onAddressClick(id)} />
            ))}
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default SelectBuyerModal;
