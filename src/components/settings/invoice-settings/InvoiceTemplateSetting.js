import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Badge } from "reactstrap";
import invoiceTemplateData from "../../../assets/data/InvoiceTemplateData";
import { AiOutlineEye } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import InvoiceTemplateViewModal from "components/settings/invoice-settings/InvoiceTemplateViewModal";
import apiClient from "api/base";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Check } from "react-feather";
import { useSelector } from "react-redux";

const Swal = withReactContent(_Swal);

const InvoiceTemplateSettings = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { template: template_slug } = useSelector(
    (state) => state.auth.userInfo.profile.invoice_options
  );

  const onClick = (id) => {
    const template = invoiceTemplateData.find((template) => template.id === id);
    setSelectedTemplate(template);
    setIsOpen((prevState) => !prevState);
  };

  const onSave = async (template) => {
    setLoading(true);
    const data = {
      setting: "invoice-template-setting",
      data: {
        template: template.slug,
      },
    };

    await apiClient
      .put("profile/seller-profile-settings/", data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your invoice template setting updated!",
        });
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update invoice template setting",
        });
        setLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <h2>Invoice Template Settings</h2>
      </CardHeader>
      <CardBody className="card-columns">
        {invoiceTemplateData.map((template, index) => (
          <Card key={index}>
            <img
              src={template.picture}
              alt={template.name}
              className="w-100 rounded card-img-top border"
            />
            <CardBody>
              <div className="d-flex justify-content-between">
                <h4>{template.name}</h4>

                {template_slug === template.slug ? (
                  <span className="rounded text-warning">
                    Selected <Check  />
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <Button.Ripple
                  color="warning"
                  onClick={() => onClick(template.id)}
                >
                  <AiOutlineEye /> View
                </Button.Ripple>{" "}
                <Button.Ripple
                  color="primary"
                  onClick={() => onSave(template)}
                  disabled={loading ||template_slug === template.slug }
                >
                  <FiSave /> Save
                </Button.Ripple>
              </div>
              {selectedTemplate ? (
                <InvoiceTemplateViewModal
                  isOpen={isOpen}
                  onToggle={() => setIsOpen(!isOpen)}
                  template={selectedTemplate}
                  onSave={onSave}
                  name={template_slug}
                />
              ) : null}
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
};

export default InvoiceTemplateSettings;
