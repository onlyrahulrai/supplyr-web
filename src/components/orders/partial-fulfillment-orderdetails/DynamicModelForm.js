import { statusDisplayDict } from "assets/data/Rulesdata";
import React, { useMemo } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import DynamicForm from "../../forms/dynamic-form/DynamicForm";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";

const DynamicModelForm = () => {
  const {
    order_status_variables,
    orderStatusUpdateByStatus,
    isStateVariableModalOpen,
    onUpdateState,
    status_variable_values,
    onChangeProductStatuses,
    partialOrderitemsIds,
    isPartialFulfillmentEnabled,
    items,
  } = usePartialFulfillmentOrderDetailsContext();

  const nextStatusVariables = order_status_variables[orderStatusUpdateByStatus];

  const nextStatusDisplayData = statusDisplayDict[orderStatusUpdateByStatus];

  const defaultVariableValue = (slug) => {
    return status_variable_values?.find(
      (value) => value.variable_slug === slug
    );
  }

  return (
    <Modal
      isOpen={isStateVariableModalOpen}
      toggle={() =>
        onUpdateState({ isStateVariableModalOpen: !isStateVariableModalOpen })
      }
      className="modal-dialog-centered"
    >
      <ModalHeader
        toggle={() =>
          onUpdateState({ isStateVariableModalOpen: !isStateVariableModalOpen })
        }
      >
        Add Relevant Information:
      </ModalHeader>
      <ModalBody>
        <DynamicForm
          orderStatusUpdateByStatus={orderStatusUpdateByStatus}
          schema={{
            fields: nextStatusVariables?.map((sv) => ({
              type: sv.data_type,
              name: sv.id,
              label: sv.name,
            })),
          }}
          save_button_label={nextStatusDisplayData?.buttonLabel}
          initialValues={nextStatusVariables?.reduce((object, variable) => {
            const defaultValue = defaultVariableValue(variable.slug);

            object[variable.id] = defaultValue ? defaultValue.value : "";

            return object;
          }, {})}
          errors={{
            fields: {},
            global: "",
          }}
          onSubmit={(data, setSubmitting) => {
            const ids = (
              isPartialFulfillmentEnabled
                ? items.filter((item) => partialOrderitemsIds.includes(item.id))
                : items
            ).map((item) => item.id);

            onChangeProductStatuses(ids, orderStatusUpdateByStatus, data);
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default DynamicModelForm;
