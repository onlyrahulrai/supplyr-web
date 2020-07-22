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
      horizontal: true,
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

  constructor(props) {
    super(props)
    this.state = {
      initialValues: {
        business_name: '',
        gst_number: '',
        entity_type: '',
        entity_category: '',
        pan_number: '',
        tan_number: '',
      },
      errors: {
        fields: {},
        global: "",
      },
    }

  }

  componentDidMount() {
    apiClient.get('/user-profiling/')
    .then((response) => {
      let initialValues = this.state.initialValues
      let data = response.data
      
      data.entity_category = data.entity_category && data.entity_category.toString()
      data.is_gst_enrolled = {true: 'yes', false: 'no'}[data.is_gst_enrolled]

      this.setState({ 
        initialValues: {...initialValues, ...data},
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <div className="mt-3  width-600 mx-auto">
        <h4 className="mb-3">Business Details</h4>

        <DynamicForm
          schema={formSchema}
          initialValues = {this.state.initialValues}
          errors={this.state.errors}
          onSubmit = {(data, setSubmitting) => {
            console.log("DATAAA", data)
            setSubmitting(true)
            apiClient.post('/user-profiling/', data)
            .then((response) => {
              console.log(response)
              alert("Entry Saved")
              setSubmitting(false)
            })
            .catch(error => {
              console.log("error", error)
              window.eeee = error

              if(error.response?.status === 400){
                this.setState({
                  errors: {...this.state.errors,
                    fields  : error.response.data,
                  }
                })
              }
              else {
                this.setState({
                  errors: { ...this.state.errors,
                    global: error.message
                  }
                })
              }

              setSubmitting(false)
            })
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