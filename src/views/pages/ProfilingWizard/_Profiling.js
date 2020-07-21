import React from "react"
import { Button } from "reactstrap"
import DynamicForm from "components/forms/DynamicForm"
import apiClient from "api/base"

const formSchema = {
  fields: [
    {
      type: "text",
      name: "business_name",
      label: "Your Entity's Business Name",
      required: true
    },
    {
      type: "radio",
      name: "entity_category",
      label: "Entity Category",
      horizontal: true,
      options: [
        {
          label: "Wholeseller",
          value: "3"
        },
        {
          label: "Distributer",
          value: "2",
        },
        {
          label: "Manufacturer",
          value: "1"
        }

      ]
    },

    {
      type: "select",
      name: "entity_type",
      label: "Entity Type",
      required: true,
      horizontal: true,
      options: [
        {
          label: "Select Entity Type",
          value: "",
          disabled: true,
          selected: true,
        },
        {
          label: "Private Limited",
          value: "pvtltd"
        },
        {
          label: "Limited Liablity Partnership",
          value: "llp",
        },
        {
          label: "Partnership",
          value: "part"
        },
        {
          label: "Proprietership",
          value: "prop"
        }
      ]
    },

    {
      type: "radio",
      name: "is_gst_enrolled",
      label: "Have you enrolled for GST ?",
      options: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],

      dependentFieldsSet: [
        {
          displayOnValue: "yes",
          fields: [
            {
              type: "text",
              label: "GSTIN",
              name: "gst_number",
              required: true,
            },
          ],
        },
      ],

    },

    {
      type: "text",
      name: "pan_number",
      label: "Your PAN number",
    },

    {
      type: "text",
      name: "tan_number",
      label: "Your entity's TAN number",
    }
  ]
}


class Profiling extends React.Component {
  render() {
    return (
      <div className="mt-3  width-600 mx-auto">
        <h4 className="mb-3">Business Details</h4>

        <DynamicForm
          schema={formSchema}
          initialValues = {{
            business_name: '',
            gst_number: '',
            entity_type: '',
            pan_number: '',
            tan_number: '',
          }}
          onSubmit = {(data, setSubmitting) => {
            console.log("DATAAA", data)
            setSubmitting(true)
            apiClient.post('/user-profiling/', data)
            .then((response) => {
              console.log(response)
              alert("Entry Saved")
              setSubmitting(false)
            })
            .catch(error => console.log(error))
          }}
        />
        <br />
        <br />
        <Button.Ripple
          className="mb-1 bg-gradient-primary mx-auto"
          color="none"
        >
          Save
        </Button.Ripple>
      </div>
    );
  }
}

export default Profiling