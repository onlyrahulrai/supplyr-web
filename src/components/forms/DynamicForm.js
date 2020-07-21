import React from "react";
import { Input, FormGroup, Label, Col, Row, Button } from "reactstrap";
import { Form, Formik, Field } from "formik";
import Radio from "components/@vuexy/radio/RadioVuexyEnhanced"
import Select from 'react-select';
import classnames from "classnames"
import DynamicField from "./DynamicField"


class DynamicForm extends React.Component {

    getDynamicField(fieldSchema, values, setFieldValue) {
        let dynamicField = (
            <DynamicField
                schema={fieldSchema}
                key={fieldSchema.name}
                setValue = {value => setFieldValue(fieldSchema.name, value)}
            />
        )
        if (fieldSchema.dependentFieldsSet) {
            let renderedDependentFields = []
            fieldSchema.dependentFieldsSet.map(dependentFields => {
                if(dependentFields.displayOnValue!=undefined && values[fieldSchema.name] == dependentFields.displayOnValue){
                    renderedDependentFields = dependentFields.fields.map(dependentFieldSchema => {
                        return (
                            this.getDynamicField(dependentFieldSchema, values, setFieldValue)
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

                >
                    { ({values, isSubmitting, setFieldValue}) => {
                        let fields = this.props.schema.fields.map((fieldSchema, i) => {
                            return this.getDynamicField(fieldSchema, values, setFieldValue)
                        })
                        return (
                            <Form>
                                {fields}
                                <pre>{JSON.stringify(values, null, 2)}</pre>
                                <Button color="primary" disabled={isSubmitting} type="submit">Submit</Button>

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