import React, { useState } from 'react'
import { Container, Button, Input, Col, Row, FormGroup, Label, Card, CardTitle, CardBody, CardHeader } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import Radio from "components/@vuexy/radio/RadioVuexy"
import RichEditor from './_RichEditor'
import Dropzone from 'components/inventory/Dropzone';

function VariantFields(props) {
    return (
        <>
        <FormGroup>
            <Label for="pname">
                <h6>
                    Product Actual Price
                </h6>
            </Label>
            <Input type="number" id="pname" placeholder="Enter Product Title" />
        </FormGroup>

        <FormGroup>
            <Label for="pname">
                <h6>
                    Sale Price
                </h6>
            </Label>
            <Input type="number" id="pname" placeholder="Enter Product Title" />
        </FormGroup>

        <FormGroup>
            <Label for="pname">
                <h6>
                    Quanitity Available
                </h6>
            </Label>
            <Input type="number" id="pname" placeholder="Enter Product Title" />
        </FormGroup>

        <Dropzone />
        </>
    )
}

function MultipleVariantForm(props) {
    return (
        <>
        <h5>On what parameters you want to distinguish between your variants (eg., Size, Color, Weight)?</h5>
        <small>You can select upto 3 parameters</small>
        <Row className="mt-2">
            <Col md="3">
                <FormGroup className="form-label-group">
                    <Input
                    type="text"
                    name="name"
                    id="nameFloating"
                    placeholder="Parameter 1"
                    />
                    <Label for="nameFloating">Parameter 1</Label>
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup className="form-label-group">
                    <Input
                    type="text"
                    name="name"
                    id="nameFloating"
                    placeholder="Parameter 2"
                    />
                    <Label for="nameFloating">Parameter 2</Label>
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup className="form-label-group">
                    <Input
                    type="text"
                    name="name"
                    id="nameFloating"
                    placeholder="Parameter 2"
                    />
                    <Label for="nameFloating">Parameter 2</Label>
                </FormGroup>
            </Col>
            <Col md="3">
                <Button color="primary">Next</Button>
            </Col>
        </Row>
        </>
    )
}

function AddProduct(props) {
    const [isMultiVariant, setIsMultiVariant] = useState("no")
    return (
        <>
        <h4>ADD A NEW PRODUCT</h4>
        <hr />
        <Row>
            <Col lg={8}>
            <FormGroup>
                <Label for="pname">
                    <h5>
                        Product Name
                    </h5>
                </Label>
                <Input type="text" id="pname" placeholder="Enter Product Title" />
            </FormGroup>
            <FormGroup>
                <Label for="pname">
                    <h5>
                        Product Description
                    </h5>
                </Label>
                <RichEditor />
            </FormGroup>

            <FormGroup>
                <Row>
                    <Col md="auto mr-auto">
                        <Label for="pname">
                            <h5>
                                Does the product have multiple variants?
                            </h5>
                        </Label>
                    </Col>
                    <Col md="auto text-">
                        <div className="d-inline-block mr-1">
                            <Radio label="No" value="no" defaultChecked={isMultiVariant === 'no'} onChange={e=>setIsMultiVariant(e.currentTarget.value)} name="exampleRadio" />
                        </div>
                        <div className="d-inline-block mr-1">
                            <Radio label="Yes" value="yes" defaultChecked={isMultiVariant === 'yes'} onChange={e=>setIsMultiVariant(e.currentTarget.value)} name="exampleRadio" />
                        </div>
                        
                    </Col>
                </Row>
            </FormGroup>

            {isMultiVariant === 'no' &&
                <VariantFields />
            }
            {isMultiVariant === 'yes' &&
                <MultipleVariantForm />
            }

            
            </Col>
        </Row>
        </>
    )
}

export default AddProduct