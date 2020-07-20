import React from "react";
import { Input, FormGroup, Label, Col, Row } from "reactstrap";
import { Form, Formik, Field } from "formik";
import Radio from "components/@vuexy/radio/RadioVuexy"
import Select from 'react-select';
import classnames from "classnames"

class DynamicField extends React.Component {
    render() {
        let schema = this.props.schema;
        let field = "";

        switch (schema.type) {

          case "text": {
            field = (
                <FormGroup className="form-label-group">
                    <Field
                        type="text"
                        name={schema.name}
                        required={schema.required}
                        as={Input}
                        placeholder={schema.label}
                    />
                    <Label for="nameFloating">{schema.label}</Label>
                </FormGroup>
            );
            break;
          }

          case "radio": {
              let options = schema.options.map((option, i) => {
                return (
                    <div className={classnames({
                        "d-inline-block mr-1": schema.horizontal
                    })}
                    key={i}
                    >
                        <Field
                            type="radio"
                            name={schema.name}
                            label={option.label}
                            value={option.value}
                            as={Radio}
                            
                        />
                    </div>
                  )
              })
              field = schema.horizontal
                ? (
                    <FormGroup row>
                        <Col md="auto mr-auto">
                            <Label>{schema.label}</Label>
                        </Col>
                        <Col md="auto">
                            {options}  
                        </Col>
                    </FormGroup>
                )
                : (
                    <FormGroup>
                        <Label for="nameVertical">{schema.label}</Label>
                        {options}  
                    </FormGroup>
                );
                
                break;
          }

          case "select": {
            let horizontalColSplitOn = schema.horizontalColSplitOn ?? 5
            let selectField = (
                <Field
                    type="select"
                    className="React"
                    // classNamePrefix="select"
                    // defaultValue={schema.options[2]}
                    name="color"
                    label= "Dsadsa"
                    options={schema.options}
                    as={Select}
                    onChange={(e)=>{
                        this.props.setValue(e.value )
                    }}
                />
            )
            field = schema.horizontal
                ? (
                    <Row>
                        <Col md={`${horizontalColSplitOn} mr-auto`}>
                            <Label>{schema.label}</Label>
                        </Col>
                        <Col md={`${12-horizontalColSplitOn} mr-auto`}>
                            {selectField}
                        </Col>
                    </Row>
                )
                : (
                    <FormGroup>
                        <Label for="nameVertical">{schema.label}</Label>
                        {selectField}
                    </FormGroup>
                )

                break;
          }
          case "file": {
            field = (
                <FormGroup row>
                    <Col md="auto mr-auto">
                        <Label for="nameFloating">{schema.label}</Label>
                    </Col>
                    <Col md="auto">
                        <Field
                            type="file"
                            name={schema.name}
                            required={schema.required}
                            as={Input}
                            placeholder={schema.label}
                        />
                    </Col>
                </FormGroup>
            );
            break;
          }
        }
        return (
                <div className="mt-2">
                    {field}
                </div>
        )
    }
}

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
                console.log(values[fieldSchema.name], dependentFields.displayOnValue)
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
                    initialValues={{
                        
                    }}
                    onSubmit={(data, {setSubmitting}) => {

                    }}

                >
                    { ({values, isSubmitting, setFieldValue}) => {
                        let fields = this.props.formSchema.map((fieldSchema, i) => {
                            return this.getDynamicField(fieldSchema, values, setFieldValue)
                        })
                        return (
                            <Form>
                                {fields}
                                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
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