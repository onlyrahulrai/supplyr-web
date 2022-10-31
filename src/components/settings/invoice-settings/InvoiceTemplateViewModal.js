import React from "react";
import { FiSave } from "react-icons/fi";
import {AiOutlineClose} from "react-icons/ai"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const InvoiceTemplateViewModal = ({ isOpen, onToggle, template,onSave,name }) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered size="lg">
      <ModalHeader toggle={onToggle}>{template?.name}</ModalHeader>
      <ModalBody>
        <img src={template.picture} alt={template.name} className="w-100" />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" disabled={name === template.slug} onClick={() => {onSave(template);onToggle()}}>
          <FiSave /> Save
        </Button>{" "}
        <Button color="danger" className="text-white" onClick={onToggle}>
          <AiOutlineClose /> Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceTemplateViewModal;
