import React, { useState, useEffect } from 'react'
import { Container, Button, Input, Col, Row, FormGroup, Label, Card, CardTitle, CardBody, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink, CardText } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import Radio from "components/@vuexy/radio/RadioVuexy"
import RichEditor from './_RichEditor'
import Dropzone from 'components/inventory/Dropzone';
import classnames from "classnames"
import { Plus, Edit, X } from 'react-feather';
import Chip from 'components/@vuexy/chips/ChipComponent';
import MultipleOptionsInput from 'components/inventory/MultipleOptionsInput'
import CreatableOptionsSelect from 'components/inventory/CreatableOptionsSelect'

function areArraysEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => item === array2[index])
}

function SimpleInputField(props) {
    return (
      <FormGroup>
        <Label for={props.name}>
          <h6>{props.label}</h6>
        </Label>
        {props.field ??
            <Input
                type={props.type ?? "text"}
                id={props.id ?? props.name}
                name={props.name}
                placeholder={props.placeholder ?? props.label}
                onChange={props.onChange}
                value={props.value}
            />
        }
      </FormGroup>
    );
}

function FloatingInputField(props) {
    return (
      <FormGroup className="form-label-group">
        <Input
          type={props.type ?? "text"}
          id={props.id ?? props.name}
          name={props.name}
          placeholder={props.placeholder ?? props.label}
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


    const toggleTab = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        //On adding a new variant, switch tab to this new variant
        const addedTabIndex = props.variantsData.length - 1;
        toggleTab(addedTabIndex)
    }, [props.variantsData.length])

    useEffect(() => {
        if(props.variantsData.length === 0) {
            props.addVariant();
        }
    }, [])

    // function setTabOptionFieldData()


    return (
      <>
        <Card>
          <CardBody>
            <div className="nav-vertical">
              <Nav tabs className="nav-left">
                {props.variantsData.map((tab, tabIndex) => {
                  let tab_name = [tab.option1, tab.option2, tab.option3]
                    .filter((o) => o !== undefined)
                    .join("/");
                  return (
                    <NavItem key={tabIndex}>
                      <NavLink
                        className={classnames({
                          active: activeTab === tabIndex,
                        })}
                        onClick={() => {
                          toggleTab(tabIndex);
                        }}
                      >
                        {/* Variant {tabIndex+1} */}
                        {tab_name || "New Variant"}
                      </NavLink>
                    </NavItem>
                  );
                })}

                <NavItem>
                  <NavLink className="pb-0">
                    <Button.Ripple
                      size="sm"
                      className="btn-icon"
                      color="flat-secondary"
                      onClick={(e) => {
                        props.addVariant();
                      }}
                    >
                      <Plus size={14} /> Add
                    </Button.Ripple>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                {props.variantsData.map((variant, tabIndex) => {
                  return (
                    <TabPane tabId={tabIndex} key={tabIndex}>
                      <Row className="">
                        {props.options.map((option, optionIndex) => {
                          return (
                            <Col key={optionIndex}>
                              <SimpleInputField
                                label={option.title}
                                field={
                                  <CreatableOptionsSelect
                                    defaultOptions={option.values}
                                    defaultValue={variant["option" + (optionIndex + 1)]}
                                    onChange={(value) =>
                                      props.setVariantFieldData(
                                        tabIndex,
                                        "option" + (optionIndex + 1),
                                        value
                                      )
                                    }
                                    onNewValueCreation={(value) =>
                                      props.addToVariantOptionValues(
                                        optionIndex,
                                        value
                                      )
                                    }
                                  />
                                }
                              />
                            </Col>
                          );
                        })}
                      </Row>
                      <hr />

                      <VariantFields
                        onChange={(field, value) =>
                          props.setVariantFieldData(tabIndex, field, value)
                        }
                      />
                    </TabPane>
                  );
                })}
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </>
    );
}

function MultipleVariantForm(props) {

    const [options, setOptions] = useState([{}])
    const [variantOptionsEditable, setVariantOptionsEditable] = useState(true)

    function setVariantOptionTitle(optionIndex, title) {
        let optionsCopy = [...options]
        optionsCopy[optionIndex]['title'] = title
        setOptions(optionsCopy)
    }
    function setVariantOptionValues(optionIndex, values) {
        let optionsCopy = [...options]
        optionsCopy[optionIndex]['values'] = values
        setOptions(optionsCopy)
    }
    function addToVariantOptionValues(optionIndex, value) {
        console.log("OI", optionIndex, options, options[optionIndex], value)
        let current_values = options[optionIndex]['values']
        setVariantOptionValues(optionIndex, [...current_values, value])
    }

    function addVariantOption() {
        if(options.length < 3)
            setOptions([...options, {}])
    }
    function removeVariantOption(optionIndex) {
        let optionsCopy = [...options]
        optionsCopy.splice(optionIndex, 1)
        setOptions(optionsCopy)
    }
    function freezeVariantOptions() {
        setVariantOptionsEditable(false)
    }

    const options_filtered = options.filter(p => {
        if ( p === undefined || Object.keys(p).length === 0 )
            return false
        if ( !p.title )
            return false
        return true
        })
        

    const [variantsData, setVariantsData] = useState([])
    
    function setVariantFieldData(tabIndex, field, value) {
        let variantsDataCopy = [...variantsData]
        variantsDataCopy[tabIndex][field] = value
        setVariantsData(variantsDataCopy)

        console.log("VD", getVariantOptionsData(tabIndex))
        
        let variantsDataFiltered = variantsDataCopy.filter(d => Object.keys(d).length !== 0) //Filter out empty tabs
        props.onChange(variantsDataFiltered)
    }

    function getVariantOptionsData(variant_data) {
        // let variant_data = variantsData[tabIndex]
        
        let variant_options_data = []
        options.forEach((option, index) => {    //So that only countd number of options get pushed each variant
            variant_options_data.push(variant_data['option' + (index+1)])
        })
        return variant_options_data //TODO: filter undefined

    }

    function getNextPossibleVairantOptions() {
        const existing_variants_options_data = variantsData.map(variant => getVariantOptionsData(variant))
        const options_count = options.length

        if(options_count == 1){
            let leaf_value = options[0].values.find(value => {
                let is_unused = !existing_variants_options_data.some(values => areArraysEqual(values, [value]))
                return is_unused
            })
            if (leaf_value) return [leaf_value]

        }
        else {
            for (const value1 of options[0].values) {
                if(options_count === 2) {
                    let leaf_value = options[1].values.find(value2 => {
                        let is_unused = !existing_variants_options_data.some((values) =>
                            areArraysEqual(values, [value1, value2])
                        )
                        return is_unused
                    })
                    if (leaf_value) return [value1, leaf_value]
                }
                else {  //options_count = 3
                    for (const value2 of options[1].values) {
                        let leaf_value = options[2].values.find(value3 => {
                            let is_unused = !existing_variants_options_data.some((values) =>
                                areArraysEqual(values, [value1, value2, value3])
                            )
                            
                            return is_unused
                        })
                        if (leaf_value) return [value1, value2, leaf_value]
                    }
                }
            }         
        }
        return []
    }

    function addVariant() {
        const nextSuggestedOptions = getNextPossibleVairantOptions()
        const optionsDict = {}
        nextSuggestedOptions.forEach((value, index) => {
            optionsDict['option'+(index+1)] = value
        })
        setVariantsData([...variantsData, {...optionsDict}])
    }

    return (
        <>
        <h2>Variants Information</h2>
        <hr/>
        { variantOptionsEditable &&
            <>
                <h5>On what parameters you want to distinguish between your variants (eg., Size, Color, Weight)?</h5>
                <small>You can select upto 3 options</small>
                <div>
                    {
                        options.map((option, index) => {
                            return (
                                <div key={index}>
                                <hr/>
                                <h4 className="mt-1 mb-2">
                                    Option {index+1}
                                    { options.length > 1 &&
                                    <Button className="float-right btn-icon rounded-circle" color="secondary" title="Remove Option" onClick={e => removeVariantOption(index)}><X /></Button>
                                    }
                                </h4>
                                <Row>
                                    <Col md="3">
                                        <SimpleInputField
                                            type="text"
                                            name="param1"
                                            label="Option Title"
                                            placeholder="Enter option title, like 'Color'"
                                            value={option.title ?? ''}
                                            onChange={e => setVariantOptionTitle(index, e.target.value)}
                                        />
                                    </Col>
                                    <Col md="9">
                                        <SimpleInputField
                                            label="Possible Values"
                                            field={<MultipleOptionsInput
                                                onChange={values => {
                                                    setVariantOptionValues(index, values)
                                                }}
                                                defaultValues = {option.values}
                                                placeholder = "Enter possible values and press Enter, eg. 'Brown'"
                                             />}
                                        />
                                    </Col>
                                </Row>
                                </div>

                            )
                        })
                    }

                    <Row>
                        {options.length < 3 &&
                        <Col sm="auto">
                            <Button className="mr-1" onClick={addVariantOption}>Add Option</Button>
                        </Col>
                        }
                        <Col sm="auto ml-auto">
                            <Button color="primary" onClick={freezeVariantOptions}>Next</Button>
                        </Col>
                    </Row>
                </div>
            </>

        }
        {!variantOptionsEditable && 
            <>
                <h6>Custom Parameters Selected</h6>
                <div className="mb-1">
                    {
                        options_filtered.map((param, i) => (
                            <Chip color="info" className="mr-1 mb-0" text={param.title} key={i}  />
                        ))
                    }
                    <Button color="primary" className="btn-icon btn-round" size="sm" onClick={e=>setVariantOptionsEditable(true)} ><Edit /> </Button>
                </div>

                <h6>Variants Information</h6>
                <VariantTabs
                    options={options_filtered}
                    setVariantFieldData = {setVariantFieldData}
                    addVariant = {addVariant}
                    variantsData = {variantsData}
                    addToVariantOptionValues= {addToVariantOptionValues}
                />
            </>
        }
        </>
    )
}

function AddProduct(props) {
    const [isMultiVariant, setIsMultiVariant] = useState("yes")

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