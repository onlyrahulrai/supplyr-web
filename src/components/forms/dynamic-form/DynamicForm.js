import { Component } from "react";
import { Button, Alert } from "reactstrap";
import { Form, Formik } from "formik";
import DynamicField from "./DynamicField"
import DynamicUncontrolledField from "./DynamicUncontrolledField";
import { AlertCircle } from "react-feather"


class DynamicForm extends Component {

    getDynamicField(fieldSchema, values, errors) {
        let field_error = errors[fieldSchema.name]
        let uncontrolledFieldState = this.props.uncontrolledFieldsState?.[fieldSchema.name]
        if (fieldSchema.uncontrolled) {
            return (
                <DynamicUncontrolledField
                schema={fieldSchema}
                key={fieldSchema.name}
                error={field_error}
                {...uncontrolledFieldState}
                />
            )
        }
        let dynamicField = (
            <DynamicField
                schema={fieldSchema}
                key={fieldSchema.name}
                error={field_error}
                // setValue = {value => setFieldValue(fieldSchema.name, value)}
            />
        )
        if (fieldSchema.dependentFieldsSet) {
            let renderedDependentFields = []
            fieldSchema.dependentFieldsSet.map(dependentFields => {
                if(dependentFields.displayOnValue!==undefined && values[fieldSchema.name] === dependentFields.displayOnValue){
                    renderedDependentFields = dependentFields.fields.map(dependentFieldSchema => {
                        return (
                            this.getDynamicField(dependentFieldSchema, values, errors)
                        )
                    })
                }
            })

            return [dynamicField].concat(renderedDependentFields)
        }
        return dynamicField
    }
    
    render() {
        
        return (
            <div>
                <Formik 
                    initialValues={this.props.initialValues ?? {}}
                    onSubmit={(data, {setSubmitting}) => {
                        this.props.onSubmit(data, setSubmitting)
                    }}
                    enableReinitialize={true}

                >
                    { ({values, isSubmitting, setFieldValue}) => {
                        let fields = this.props.schema.fields.map((fieldSchema, i) => {
                            return this.getDynamicField(fieldSchema, values, this.props.errors?.fields)
                        })
                        let global_error = this.props.errors?.global
                        return (
                            <Form>
                                <Alert color="danger" isOpen={Boolean(global_error) && typeof global_error == 'string'}>
                                    <AlertCircle size={15} />
                                    {global_error}
                                </Alert>
                                {fields}
                                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                <Button color="primary" disabled={isSubmitting} className="float-right btn-lg" type="submit">{this.props.save_button_label ?? "Save Changes"}</Button>

                            </Form>
                        )
                    }
                    }
                </Formik>
            </div>
        )
    }
}




export default DynamicForm