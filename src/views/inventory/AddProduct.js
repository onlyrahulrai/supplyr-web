import React, { useState } from 'react'
import { Container, Button, Input, Col, Row, FormGroup, Label, Card, CardTitle, CardBody, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink, CardText } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import Radio from "components/@vuexy/radio/RadioVuexy"
import RichEditor from './_RichEditor'
import Dropzone from 'components/inventory/Dropzone';
import classnames from "classnames"
import { Plus, Edit } from 'react-feather';
import Chip from 'components/@vuexy/chips/ChipComponent';

function SimpleInputField(props) {
    return (
      <FormGroup>
        <Label for={props.name}>
          <h6>{props.label}</h6>
        </Label>
        <Input
          type={props.type ?? "text"}
          id={props.name}
          name={props.name}
          placeholder={props.label}
          onChange={props.onChange}
          value={props.value}
        />
      </FormGroup>
    );
}

function FloatingInputField(props) {
    return (
      <FormGroup className="form-label-group">
        <Input
          type={props.type ?? "text"}
          id={props.name}
          name={props.name}
          placeholder={props.label}
          onChange={props.onChange}
          value={props.value}
        />
        <Label for={props.name}>{props.label}</Label>
      </FormGroup>
    );
}

function VariantFields(props) {
    return (
        <>
        <SimpleInputField
            label = "Product Actual Price"
            name="price"
            type="number"
            onChange={e => props.onChange("price", e.target.value)}
        />
        <SimpleInputField
            label = "Sale Price"
            name="sale_price"
            type="number"
            onChange={e => props.onChange("sale_price", e.target.value)}
        />
        <SimpleInputField
            label = "Quanitity Available"
            name="quantity"
            type="number"
            onChange={e => props.onChange("quantity", e.target.value)}
        />

        <Dropzone />
        </>
    )
}

function SingleVariantForm(props) {

    const [variantsData, setVariantsData] = useState({})

    function setVariantFieldData(field, value) {
        let variantsDataCopy = {...variantsData}
        variantsDataCopy[field] = value
        setVariantsData(variantsDataCopy)
        props.onChange(variantsDataCopy)
    }

    return (
        <VariantFields 
            onChange={(field, value) => setVariantFieldData(field, value)}
        />
    )
}

function VariantTabs(props) {
    const [activeTab, setActiveTab] = useState(0);
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }


    // function setTabOptionFieldData()


    return (
        <>
        <Card>
            <CardBody>
                <Nav tabs>
                    {
                        props.variantsData.map((tab, tabIndex) => {
                            return (
                                <NavItem key={tabIndex}>
                                    <NavLink
                                        className={classnames({ active: activeTab === tabIndex })}
                                        onClick={() => { toggle(tabIndex); }}
                                    >
                                        Variant {tabIndex+1}
                                    </NavLink>
                                </NavItem>
                            )
                        })
                    }

                    <NavItem>
                        <NavLink className="pb-0" >
                            <Button.Ripple size="sm" className="btn-icon" color="flat-secondary" onClick={props.addVariant}>
                                <Plus size={14} /> Add
                            </Button.Ripple>
                            
                        </NavLink>
                    </NavItem>
                    
                </Nav>
                <TabContent activeTab={activeTab}>
                {
                    props.variantsData.map((tab, tabIndex) => {
                        return (
                            <TabPane tabId={tabIndex} key={tabIndex}>
                                <Row className="mt-2">
                                    {
                                        props.params.map((param, i) => {
                                            return (
                                                <Col key={i}>
                                                    <FloatingInputField 
                                                        name={param}
                                                        label={param}
                                                        onChange={e => props.setVariantFieldData(tabIndex, "option"+(i+1), e.target.value)}
                                                    />
                                                </Col>
                                            )
                                        })    
                                    }
                                </Row>
                                
                                <VariantFields 
                                    onChange={(field, value) => props.setVariantFieldData(tabIndex, field, value)}

                                />
                            </TabPane>
                        )
                    })
                }

                </TabContent>
            </CardBody>
        </Card>
        </>
    )
}

function MultipleVariantForm(props) {

    const [param1, setParam1] = useState(undefined)
    const [param2, setParam2] = useState(undefined)
    const [param3, setParam3] = useState(undefined)
    const [variantOptionsEditable, setVariantOptionsEditable] = useState(true)

    function freezeVariantOptions() {
        setVariantOptionsEditable(false)
    }

    const params = [param1, param2, param3].filter(p => p !== undefined && typeof p === "string" && p.trim())


    const [variantsData, setVariantsData] = useState([
        {},
        {}
    ])
    function setVariantFieldData(tabIndex, field, value) {
        let variantsDataCopy = [...variantsData]
        variantsDataCopy[tabIndex][field] = value
        setVariantsData(variantsDataCopy)
        
        let variantsDataFiltered = variantsDataCopy.filter(d => Object.keys(d).length !== 0) //Filter out empty tabs
        props.onChange(variantsDataFiltered)
    }

    function addVariant() {
        setVariantsData([...variantsData, {}])
    }

    return (
        <>
        <h2>Variants Information</h2>
        <hr/>
        { variantOptionsEditable &&
            <>
                <h5>On what parameters you want to distinguish between your variants (eg., Size, Color, Weight)?</h5>
                <small>You can select upto 3 parameters</small>
                <Row className="mt-2">
                    <Col md="3">
                        <FloatingInputField
                            type="text"
                            name="param1"
                            label="Parameter 1"
                            value={param1}
                            onChange={e => setParam1(e.target.value)}
                        />
                    </Col>
                    <Col md="3">
                        <FloatingInputField
                            type="text"
                            name="param2"
                            label="Parameter 2"
                            value={param2}
                            onChange={e => setParam2(e.target.value)}
                        />
                    </Col>
                    <Col md="3">
                        <FloatingInputField
                            type="text"
                            name="param3"
                            label="Parameter 3"
                            value={param3}
                            onChange={e => setParam3(e.target.value)}
                        />
                    </Col>
                    <Col md="3">
                        <Button color="primary" onClick={freezeVariantOptions}>Next</Button>
                    </Col>
                </Row>
            </>

        }
        {!variantOptionsEditable && 
            <>
                <h6>Custom Parameters Selected</h6>
                <div className="mb-1">
                    {
                        params.map(param => (
                            <Chip color="info" className="mr-1 mb-0" text={param} />
                        ))
                    }
                    <Button color="primary" className="btn-icon btn-round" size="sm" onClick={e=>setVariantOptionsEditable(true)} ><Edit /> </Button>
                </div>

                <h6>Variants Information</h6>
                <VariantTabs
                params={params}
                setVariantFieldData = {setVariantFieldData}
                addVariant = {addVariant}
                variantsData = {variantsData}
                />
            </>
        }
        </>
    )
}

function AddProduct(props) {
    const [isMultiVariant, setIsMultiVariant] = useState("no")

    const [basicData, setBasicData] = useState({})
    const [variantsData, setVariantsData] = useState({})

    function setBasicFieldData(field, value) {
        let basicDataCopy = {...basicData}
        basicDataCopy[field] = value
        setBasicData(basicDataCopy)
    }

    let formData = {
        ...basicData,
        variants_data: variantsData
    }
    console.log('formData', formData)
    



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
                <Input type="text" id="pname" placeholder="Enter Product Title" onChange={e => setBasicFieldData('product_title', e.target.value)}/>
            </FormGroup>
            <FormGroup>
                <Label for="pname">
                    <h5>
                        Product Description
                    </h5>
                </Label>
                <RichEditor 
                    onChange={data => setBasicFieldData('product_description', data)}
                />
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
                <SingleVariantForm 
                    onChange={data => setVariantsData({
                        multiple: false,
                        data: data
                    })}
                />
            }
            {isMultiVariant === 'yes' &&
                <MultipleVariantForm
                    onChange = {data => setVariantsData({
                        multiple: true,
                        data: data
                    })}
                 />
            }

            
            </Col>
        </Row>
        </>
    )
}

export default AddProduct