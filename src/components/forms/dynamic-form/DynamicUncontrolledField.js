import React from "react";
import { Input, Button, FormGroup, Label, Col, Row, FormFeedback, Spinner, Badge } from "reactstrap";
import { Check, CheckCircle } from "react-feather"
import classnames from "classnames"


export default class DynamicUncontrolledField extends React.Component {
    render() {
        let schema = this.props.schema;
        let fieldError = this.props.error;
        let field = "";

        switch (schema.type) {
            case "number":
            case "text": {
                field = (
                    <FormGroup className="form-label-group">
                        <Input
                            type={schema.type}
                            name={schema.name}
                            required={schema.required}
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

            case "file": {
                let uploadButtonText = this.props.is_submitted ? "Reupload":"Upload"
                field = (
                    <FormGroup row>
                        <Col md="auto mr-auto">
                            <Label>{schema.label}
                            {this.props.is_submitted && !this.props.is_submitting &&
                                <Badge color="light-success" className="ml-1">
                                    <CheckCircle size={12} />
                                    <span>Uploaded</span>
                                </Badge>
                            }
                            </Label>
                        </Col>
                        <Col md="auto">
                        <Label for={schema.name}>
                            <Button color="primary" outline={this.props.is_submitted} disabled={this.props.is_submitting} onClick={e=> document.getElementById(schema.name).click()}>
                                <Spinner color="white" size="sm" className={classnames({
                                    'd-none': !this.props.is_submitting
                                })} />
                                <span>
                                    {uploadButtonText}
                                </span>
                            </Button>
                        </Label>
                            
                            <Input
                                type="file"
                                name={schema.name}
                                id={schema.name}
                                // required={schema.required} //It will clash with controlled forms if required is set (while submitting, if form empty)
                                placeholder="Upload"
                                onChange={schema.onChange}
                                className="d-none"
                                // value= ""
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