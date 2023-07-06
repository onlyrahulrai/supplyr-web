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
import {useOrderAddContext} from "context/OrderAddContext";

const Address = (props) => {
  const {address,getValidAddress,onChangeBuyerAddress} = useOrderAddContext();
  const { id, name, line1, line2, pin, city, state} = getValidAddress(props.address);

  return (
    <Col md="6" onClick={() => onChangeBuyerAddress(props.address)} className={`cursor-pointer`}>
      <Card className={`${address?.id === id && "bg-danger text-white"}`}>
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

const SelectBuyerAddressModal = ({ isOpen, onToggleModal }) => {
  const {buyer} = useOrderAddContext()

  return (
    <Modal
      isOpen={isOpen}
      toggle={onToggleModal}
      className="modal-dialog-centered select-buyer-address modal-lg"
    >
      <ModalHeader toggle={onToggleModal}>Select Buyer Address:</ModalHeader>
      <ModalBody>
        <Row>
            
          {
            buyer ? (
              <>
                {
                   buyer.address.map((address, index) => (
                    <Address address={address} key={index}/>
                   ))
                }
              </>
            ):null
          }

        </Row>
      </ModalBody>
    </Modal>
  );
};

export default SelectBuyerAddressModal;
