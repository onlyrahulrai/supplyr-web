import { Component } from "react";
import { Input, FormGroup, Label, Col, Row, FormFeedback } from "reactstrap";
import { Field } from "formik";
import Radio from "components/@vuexy/radio/RadioVuexyEnhanced"
// import Select from 'react-select';
import classnames from "classnames"

export default class DynamicField extends Component {
    render() {
        let schema = this.props.schema;
        let fieldError = this.props.error;
        let field = "";
        if (schema.type === "integer") {
            schema.type = "number";
        }
        // eslint-disable-next-line
        switch (schema.type) {
          case "number":
          case "date":
          case "text": {
            field = (
                <FormGroup className="form-label-group">
                    <Field
                        type={schema.type}
                        name={schema.name}
                        required={schema.required}
                        as={Input}
                        placeholder={schema.label}
                        disabled={schema.disabled}
                        invalid={fieldError}
                    />
                    <Label for="nameFloating">{schema.label}</Label>
                    {fieldError &&
                        <FormFeedback>{fieldError}</FormFeedback>
                    }
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
                            required={schema.required}
                            as={Radio}
                            disabled={option.disabled}
                            
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
                        <Col md="auto text-right">
                            {options}  
                            {fieldError &&
                                <p><small className="text-danger">{fieldError}</small></p>
                            }
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
            let options = schema.options.map((option, i) => {
                return (
                        <option
                            value={option.value}
                            key={i}
                            disabled={option.disabled}
                        >
                        {option.label}
                        </option>
                  )
              })

            let selectField = (
                <Field
                    type="select"
                    className="React"
                    // classNamePrefix="select"
                    // defaultValue={(()=> {return {value: 'llp', label: 'LLP'}})()}
                    // isDisabled={schema.disabled}
                    name={schema.name}
                    
                    required= {schema.required}
                    as={Input}
                    invalid={fieldError}
                    // onChange={(e)=>{
                    //     this.props.setValue(e.value )
                    // }}
                >
                {options}

                </Field>
            )
            field = schema.horizontal
                ? (
                    <Row>
                        <Col md={`${horizontalColSplitOn} mr-auto`}>
                            <Label>{schema.label}</Label>
                        </Col>
                        <Col md={`${12-horizontalColSplitOn} mr-auto`}>
                            {selectField}
                            {fieldError &&
                                <FormFeedback>{fieldError}</FormFeedback>
                            }
                        </Col>
                    </Row>
                )
                : (
                    <FormGroup>
                        <Label for="nameVertical">{schema.label}</Label>
                        {selectField}
                        {fieldError &&
                            <FormFeedback>{fieldError}</FormFeedback>
                        }
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
                            // value= ""
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