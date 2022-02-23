import { Component } from "react";
import { CardBody, Card } from "reactstrap"
import DynamicForm from "components/forms/dynamic-form/DynamicForm"
import apiClient from "api/base"



class Profiling extends Component {

  formSchema = {
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
        required: true,
        options: [
          {
            label: "Wholeseller",
            value: "W"
          },
          {
            label: "Distributer",
            value: "D",
          },
          {
            label: "Manufacturer",
            value: "M"
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
  
              {
                type: "file",
                label: "GST Certificate",
                name: "gst_certificate",
                uncontrolled: true,
                onChange: e => {
                  this.setUncontrolledFieldProp('gst_certificate', {is_submitting: true})
                  const file  =  e.currentTarget.files[0];
                  let formData = new FormData();
                  formData.append('gst_certificate', file);
                  apiClient.post('/profile/user-profiling-documents/',
                    formData,
                    {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      }
                    }
                  ).then(response => {
                    console.log("SUCCESS", response)
                    if(response.data?.['gst_certificate']) {
                      this.setUncontrolledFieldProp('gst_certificate', {is_submitting: false, is_submitted: true})
                    }
                    else {
                      throw new Error('Error: Seems file is not uploaded')
                    }
                    
                  }).catch(error => {
                    this.setUncontrolledFieldProp('gst_certificate', {is_submitting: false})
                    console.log("File Upload Error", error)
                  })
                }
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

  setUncontrolledFieldProp = (field_name, new_values) => {
    let new_state = {
      uncontrolledFieldsState: 
        {...this.state.uncontrolledFieldsState} //It will also create an empty object if key not present
    }
    new_state.uncontrolledFieldsState[field_name] = {...this.state.uncontrolledFieldsState?.[field_name], ...new_values}

    this.setState(new_state)
  }

  constructor(props) {
    super(props)
    this.state = {
      initialValues: {
        business_name: '',
        gst_number: '',
        entity_type: '',
        entity_category: null,
        pan_number: '',
        tan_number: '',
      },
      errors: {
        fields: {},
        global: "",
      },
      uncontrolledFieldsState: {
        // 'gst_certificate': {
        //   is_submitting: false,
        // }
      }
    }

    let existingData = this.props.entityDetails
    if(existingData) {
      existingData.entity_category = existingData.entity_category && existingData.entity_category.toString()
      existingData.is_gst_enrolled = {true: 'yes', false: 'no'}[existingData.is_gst_enrolled]
      
      this.state.initialValues = existingData

      if(existingData.gst_certificate) {
        this.state.uncontrolledFieldsState['gst_certificate'] = {is_submitted: true}
      }
    }

  }

  render() {
    return (
      <div className="mt-3 col-xl-6 col-lg-8 col-md-10 col-12 mx-auto">
        <h4 className="">Business Details</h4>
        <hr />
        <h6 className="text-bold-400 mb-2 text-gray">
          <small>Please fill the details about your business.</small>
        </h6>
        <Card>
          <CardBody>
            <DynamicForm
              schema={this.formSchema}
              initialValues={this.state.initialValues}
              errors={this.state.errors}
              uncontrolledFieldsState={this.state.uncontrolledFieldsState}
              onSubmit={(data, setSubmitting) => {
                setSubmitting(true);
                apiClient
                  .post("/profile/user-profiling/", data)
                  .then((response) => {
                    setSubmitting(false);
                    this.props.forceStepRefresh()
                  })
                  .catch((error) => {
                    if (error.response?.status === 400) {
                      this.setState({
                        errors: {
                          ...this.state.errors,
                          fields: error.response.data,
                          global: error.response?.data?.non_field_errors?.join(
                            ", "
                          ),
                        },
                      });
                    } else {
                      this.setState({
                        errors: { ...this.state.errors, global: error.message },
                      });
                    }
                    setSubmitting(false);
                  });
              }}
            />
          </CardBody>
        </Card>
        <br />
        <br />
      </div>
    );
  }
}

export default Profiling