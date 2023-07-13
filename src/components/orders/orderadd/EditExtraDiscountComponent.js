import React from "react";
import { Edit3, X } from "react-feather";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const EditExtraDiscountComponent = ({
  isOpen,
  onToggleModal,
  onSave,
  extraDiscount,
  productPrice,
  setExtraDiscount,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggleModal} size="xs" centered>
      <ModalHeader toggle={onToggleModal} >
        <span>Edit Extra Discount</span>
      </ModalHeader>
      <ModalBody className="position-relative">
        <FormGroup className="d-flex flex-column p-2 mb-0">
          <div className="d-flex justify-content-between align-items-center">
            <Label htmlFor="extra_discount">Extra Discount</Label>
            <Input
              placeholder="Extra discount..."
              value={extraDiscount}
              name="extra_discount"
              onChange={(e) => setExtraDiscount((parseInt(e.target.value) > productPrice) ? productPrice : e.target.value)}
              type="number"
              min={0}
              style={{ width: "55%", marginLeft: "5px" }}
            />{" "}
          </div>
          <span className="text-right text-secondary">(Per Unit)</span>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color="danger" outline onClick={onToggleModal}>
          <span>
            &nbsp;&nbsp;
            <X size={16} /> Cancel
          </span>
        </Button.Ripple>
        <Button.Ripple color="primary" outline onClick={onSave}>
          <span>
            &nbsp;&nbsp;
            <Edit3 size={16} /> Save
          </span>
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  );
};

export default EditExtraDiscountComponent;
