import React from "react";
import { FiSave } from "react-icons/fi";
import {AiOutlineClose} from "react-icons/ai"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { getMediaURL } from "api/utils";

const InvoiceTemplateViewModal = ({ isOpen, onToggle, template,onSave,invoice_template }) => {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered size="lg">
      <ModalHeader toggle={onToggle}>{template?.name}</ModalHeader>
      <ModalBody>
        <img src={getMediaURL(template.image_url)} alt={template.name} className="w-100" />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" disabled={invoice_template === template.id} onClick={() => {onSave(template);onToggle()}}>
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
