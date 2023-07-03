import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Badge, Spinner } from "reactstrap";
import { AiOutlineEye } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import InvoiceTemplateViewModal from "components/settings/invoice-settings/InvoiceTemplateViewModal";
import apiClient from "api/base";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Check } from "react-feather";
import { useSelector } from "react-redux";
import { getMediaURL } from "api/utils";

const Swal = withReactContent(_Swal);

const InvoiceTemplateSettings = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null)
  const [invoiceTemplates,setInvoiceTemplates] = useState([])

  const { invoice_template } = useSelector(
    (state) => state.auth.userInfo.profile
  );

  React.useEffect(async () => {
    setLoading(true)
    await apiClient.get('orders/invoice-templates/')
    .then((response) => {
      setInvoiceTemplates(response.data)
      setLoading(false)
    })
    .catch((error) => {
      setError(error.message)
      setLoading(false)
    })
  },[])

  const onClick = (id) => {
    const template = invoiceTemplates.find((template) => template.id === id);
    setSelectedTemplate(template);
    setIsOpen((prevState) => !prevState);
  };

  const onSave = async (template) => {
    setLoading(true);
    const data = {
      invoice_template: template.id,
    }

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
        {invoiceTemplates.map((template, index) => (
          <Card key={index}>
            <img
              src={getMediaURL(template.image_url)}
              alt={template.name}
              className="w-100 rounded card-img-top border"
            />
            <CardBody>
              <div className="d-flex justify-content-between">
                <h4>{template.name}</h4>

                {invoice_template === template.id ? (
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
                  disabled={loading || invoice_template === template.id }
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
                  invoice_template={invoice_template}
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
