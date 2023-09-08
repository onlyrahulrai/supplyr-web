import apiClient from "api/base";
import { useOrderAddContext } from "context/OrderAddContext";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  Input,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import { regx } from "utility/general";

const defaultOptions = {
  business_name: "",
  email: "",
  mobile_number: "",
};

const CreateBuyerModal = ({ isOpen, onToggleModal, searchInput }) => {
  const [data, setData] = useState(defaultOptions);
  const [loading, setLoading] = useState(false);
  const { onChangeStateByKeyValue,onUpdateBuyer } = useOrderAddContext();

  useEffect(() => {
    if (searchInput) {
      const object = new Object();

      if (regx.email.test(searchInput)) {
        object["email"] = searchInput;
      } else if (regx.mobileNumber.test(searchInput)) {
        object["mobile_number"] = searchInput;
      } else if (regx.alpha.test(searchInput)) {
        object["business_name"] = searchInput;
      }
      setData({ ...defaultOptions, ...object });
    }
  }, [setData, searchInput]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await apiClient
      .post("/profile/buyer-create/", data)
      .then((response) => {
        const data = response.data;

        console.log(" Response Data ",data)

        onUpdateBuyer(data, () => {
          setData(defaultOptions);
          onToggleModal();
          onChangeStateByKeyValue("isOpenBuyerAddressCreateModal", false);
          setLoading(false);
          toast.success("Buyer has created successfully.");
        });
      })
      .catch((error) => {
        console.log("  Error ",error)
        toast.error("Failed to create buyer profile!.")
        setLoading(false)
      });
  };

  const onChange = (e) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <Modal
      isOpen={isOpen}
      toggle={onToggleModal}
      centered
      onClosed={() => setData(defaultOptions)}
    >
      <ModalHeader toggle={onToggleModal}>
        <span>Create New Buyer :)</span>
      </ModalHeader>
      <ModalBody className="position-relative">
        <FormGroup>
          <Label for="mobile">Buyer Mobile Number:</Label>
          <Input
            placeholder="+91 9999999999"
            value={data.mobile_number}
            onChange={onChange}
            name="mobile_number"
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Buyer Business Name:</Label>
          <Input
            placeholder="John Electronics Shop"
            value={data.business_name}
            onChange={onChange}
            name="business_name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Buyer Email:</Label>
          <Input
            placeholder="john@gmail.com"
            value={data.email}
            onChange={onChange}
            name="email"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          color="warning"
          onClick={onToggleModal}
          disabled={loading}
        >
          Cancel
        </Button>{" "}
        <Button
          type="click"
          color="primary"
          onClick={onSubmit}
          disabled={loading}
        >
          Save
        </Button>
      </ModalFooter>
      <div
        className="position-absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
      >
        {loading ? <Spinner /> : null}
      </div>
    </Modal>
  );
};

export default CreateBuyerModal;
