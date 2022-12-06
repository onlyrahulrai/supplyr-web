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
  setExtraDiscount,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggleModal} className="modal-xs" centered>
      <ModalHeader toggle={onToggleModal} >
        <span>Edit Extra Discount</span>
      </ModalHeader>
      <ModalBody className="position-relative">
        <div className="d-flex align-items-center justify-content-center">
          <FormGroup row className="align-items-center justify-content-center mb-0">
            <Label htmlFor="extra_discount">Extra Discount</Label>
            <Input
              placeholder="Extra discount..."
              value={extraDiscount}
              name="extra_discount"
              onChange={(e) => setExtraDiscount(e.target.value)}
              type="number"
              min={0}
              style={{ width: "55%", marginLeft: "5px" }}
            />{" "}
          </FormGroup>
        </div>
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

        {/* <span className="text-primary cursor-pointer" onClick={onSave}>
          &nbsp;&nbsp;
          <Edit3 size={16} /> Save
        </span> */}
      </ModalFooter>
    </Modal>
  );
};

export default EditExtraDiscountComponent;
