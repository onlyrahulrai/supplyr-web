import React, { useState, useEffect } from 'react'
import { Container, Button, Input, Col, Row, FormGroup, Label, Card, CardTitle, CardBody, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink, CardText, FormFeedback, UncontrolledTooltip } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import Radio from "components/@vuexy/radio/RadioVuexy"
import RichEditor from './_RichEditor'
import Dropzone from 'components/inventory/Dropzone';
import classnames from "classnames"
import { Plus, Edit, X, Trash2, XCircle, Info, Check, CheckCircle, Copy } from 'react-feather';
import Chip from 'components/@vuexy/chips/ChipComponent';
import MultipleOptionsInput from 'components/inventory/MultipleOptionsInput'
import CreatableOptionsSelect from 'components/inventory/CreatableOptionsSelect'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "assets/scss/inventory/add-product.scss"
import cloneGenerator from "rfdc"
import swal from '@sweetalert/with-react';


const clone = cloneGenerator()
const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });


function areArraysEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => item === array2[index])
}

function SimpleInputField(props) {
    let fieldError = props.error;
    return (
      <FormGroup>
        <Label for={props.name}>
          <h6>{props.label}
          {props.requiredIndicator && <span className="text-danger"> *</span>}
          </h6>
        </Label>
        {props.field ??
            <Input
                type={props.type ?? "text"}
                id={props.id ?? props.name}
                name={props.name}
                placeholder={props.placeholder ?? props.label}
                onChange={props.onChange}
                value={props.value}
                invalid={Boolean(fieldError)}
                required={props.required}
            />
        }
        {fieldError &&
            <FormFeedback>{fieldError}</FormFeedback>
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
            requiredIndicator
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
            requiredIndicator
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


                  let tabStatusIcon = undefined;
                  let tabStatusIconTooltip = undefined;

                  if(tab.errors?.duplicate_variant) {
                      tabStatusIcon = <Copy color="tomato" size="16" />
                      tabStatusIconTooltip = "Duplicate Variant. Please either change or remove one of the copies."
                  }
                  else if (tab.errors?.unfilled_required_fields){
                    tabStatusIcon = <Info color="darkkhaki" size="16" />
                    tabStatusIconTooltip = "Please fill all the required data (marked with *)"
                  }
                  else {
                    tabStatusIcon = <CheckCircle color="green" size="16" />
                  }

                  let tabStatusIconWrap = (<>
                        <div id={`error-tab-${tabIndex}`} className="mr-1 d-inline" >
                        {tabStatusIcon}
                        </div>
                        {tabStatusIconTooltip && 
                            <UncontrolledTooltip
                                placement="left"
                                target={`error-tab-${tabIndex}`}
                                >
                                {tabStatusIconTooltip}
                            </UncontrolledTooltip>
                        }
                  </>)

                  return (
                    <NavItem key={tabIndex}>
                      <NavLink
                        className={classnames({
                          active: activeTab === tabIndex,
                        }, 'd-flex align-items-center variantListItem')}
                        onClick={() => {
                          toggleTab(tabIndex);
                        }}
                      >
                        <div className="flex-grow-1">
                            {tabStatusIconWrap}
                            {tab_name || "New Variant"}
                        </div>
                        <div className="variantRemoveIcon"><XCircle size="15" color="lightcoral" className="invisible ml-1" onClick={e => props.removeVariant(tabIndex)} /></div>
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
                                requiredIndicator
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
                      <div className="container">
                          <Row>
                              <Col sm='auto mr-auto'>
                                <Button.Ripple color="danger" onClick={e => props.removeVariant(tabIndex)}><Trash2 size="18"/> Remove Variant</Button.Ripple>
                              </Col>
                              <Col sm='auto'>
                                <Button.Ripple color="info" onClick={props.addVariant}><Plus size="18" /> Add Another Variant</Button.Ripple>
                              </Col>
                          </Row>
                      </div>

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
        if (optionsCopy[optionIndex].errors?.title){
            optionsCopy[optionIndex]['errors']['title'] = undefined
        }
        setOptions(optionsCopy)
    }
    function setVariantOptionValues(optionIndex, values) {
        let optionsCopy = [...options]

        let updated_values = values.map(value => value.trim())
        optionsCopy[optionIndex]['values'] = updated_values
        if (optionsCopy[optionIndex].errors?.values){
                optionsCopy[optionIndex]['errors']['values'] = undefined
        }
        setOptions(optionsCopy)
    }
    function addToVariantOptionValues(optionIndex, value) { //Called when new option is created inside the variant edit form
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

    useEffect(() => {
        props.setOptions(options.map(o => o.title))
    }, [options.map(o => o.title).join()])

    function freezeVariantOptions() {
        const optionsCopy = [...options]
        let error_count = 0;
        options.forEach((option, optionIndex) => {
            let errors = {}
            if(option.title === undefined || option.title.trim().length === 0) {
                errors['title'] = "You must enter a title"
            }
            else if (options.filter((opt, ind) => opt.title?.trim() === option.title.trim() && ind !== optionIndex).length > 0) {
                errors['title'] = "This value is repeated. Please either change or remove one of the duplicates"
            }
            if(option.values === undefined || option.values.length === 0) {
                errors['values'] = "You must enter at least one possible value"
            }
            if(Object.keys(errors).length > 0) {    //TODO: Remove this check?
                error_count++;
            }
            optionsCopy[optionIndex].errors = errors
        })
        setOptions(optionsCopy)
        if (error_count === 0) {
            setVariantOptionsEditable(false)
        }
    }

    const options_filtered = options.filter(p => {
        if ( p === undefined || Object.keys(p).length === 0 )
            return false
        if ( !p.title )
            return false
        return true
        })
        

    const [variantsData, setVariantsData] = useState([])

    useEffect(() => {
        checkDuplicateVariants()
    }, [variantsData.map(v => [v.option1, v.option2, v.option3].join('|')).join() ])
    /*
    The above effect will ensure that it only runs whenever any 'option' value changes
    */

    useEffect(() => {
        validateAllVariantsRequiredFields()

        let variantsDataFiltered = variantsData.filter(d => Object.keys(d).length !== 0) //Filter out empty tabs
        props.onChange(variantsDataFiltered)

    }, [variantsData])

    function checkDuplicateVariants() {
        let variantsDataCopy = clone(variantsData);
        variantsData.forEach((variant_data, index) => {
            let option_values = getVariantOptionsData(variant_data)
            let is_duplicate = variantsData.some((_variant_data, _index) => {
                return index != _index && areArraysEqual(option_values, getVariantOptionsData(_variant_data)) && !option_values.every(value => value === undefined)
            })
            if(is_duplicate) {
                variantsDataCopy[index]['errors'] = {...variantsDataCopy[index]['errors'], 'duplicate_variant': true}
            }
            else {
                delete variantsDataCopy[index].errors?.duplicate_variant
            }

        })

        if(JSON.stringify(variantsData) !== JSON.stringify(variantsDataCopy)){
            setVariantsData(variantsDataCopy)
        }

    }
    
    function setVariantFieldData(tabIndex, field, value) {

        let variantsDataCopy = [...variantsData]
        variantsDataCopy[tabIndex][field] = value
        setVariantsData(variantsDataCopy)
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

    function removeVariant(index) {
        if (variantsData.length <=1){
            toast.error("You must have at least one variant.", {
                position: "bottom-center",
                toastId: "varaint_remove_error",
            })
            return;
        }

        let variantsDataCopy = [...variantsData]
        variantsDataCopy.splice(index, 1)
        setVariantsData(variantsDataCopy)
    }

    function validateVariantRequiredFields(variantData) {
        const required_fixed_fields = ['price', 'quantity']
        if (required_fixed_fields.some(field_name => !variantData[field_name])){
            return false;
        }

        if(options.some((option, index) => !variantData['option'+(index+1)])) {
            return false;
        }


        return true;
    }

    function validateAllVariantsRequiredFields() {
        let variantsDataCopy = clone(variantsData);
        variantsData.forEach((variant, index) => {
            let validates = validateVariantRequiredFields(variant)
            if (!validates) {
                variantsDataCopy[index]['errors'] = {...variantsDataCopy[index]['errors'], 'unfilled_required_fields': true}
            }
            else {
                delete variantsDataCopy[index].errors?.unfilled_required_fields
            }
            console.log('Var ', index, 'Validates: ', validates)
        })

        if(JSON.stringify(variantsData) !== JSON.stringify(variantsDataCopy)){
            setVariantsData(variantsDataCopy)
        }
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
                                            error={option.errors?.title}
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
                                                className={classnames({
                                                     'is-invalid': option.errors?.values
                                                })}
                                             />}
                                             error={option.errors?.values}
                                             required
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
                    removeVariant = {removeVariant}
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
    const [variantsDataContainer, setVariantsDataContainer] = useState({})

    function setBasicFieldData(field, value) {
        let basicDataCopy = {...basicData}
        basicDataCopy[field] = value
        setBasicData(basicDataCopy)
    }

    let formData = {
        ...basicData,
        variants_data: variantsDataContainer
    }
    console.log('formData', formData)
    
    function validateForm() {

        let variantsData = variantsDataContainer
        let errors = []

        if(variantsData.multiple === undefined) {
            errors.push('Add variant information')
        }
        if(variantsData.multiple === true) {
            console.log("Multiple")
            if (variantsData.options?.length === 0) {
                errors.push("Add options to customize your variants")

            }
            else if (!variantsData.data || variantsData.data.length === 0) {
                errors.push("Add information for at least one variant")
            }
            let duplicates = variantsData.data.filter(v => v.errors?.duplicate_variant).map(v => [v.option1, v.option2, v.option3].filter(x => x).join('/'))
            if(duplicates.length) {
                errors.push("Please Remove Duplicate Variants: " + listFormatter.format(new Set(duplicates)))
            }

            let unfilled_fields = variantsData.data.filter(v => v.errors?.unfilled_required_fields).map(v => [v.option1, v.option2, v.option3].filter(x => x).join('/') || 'New Variants')
            if(unfilled_fields.length) {
                errors.push("Please Fill all required data in the variants: " + listFormatter.format(new Set(unfilled_fields)))
            }
        }

        if (errors.length > 0) {
            swal(
            <div>
            <h1>Error !</h1>
            <h4 className="mb-1">Please correct the following errors</h4>
            {
                errors.map(error => {
                    return <h6 className="text-danger">{error} </h6>
                })
            }
            </div>
            )    


            return false
        }
    }

    function submitForm(e) {
        e.preventDefault()
        validateForm()
    }



    return (
        <>
        <h4>ADD A NEW PRODUCT</h4>
        <hr />
        <form onSubmit={submitForm}>
        <Row>
            <Col lg={8}>

            <SimpleInputField
                label="Product Title"
                type="text"
                name="title"
                placeholder="Enter Product Title"
                onChange={e => setBasicFieldData('product_title', e.target.value)}
                requiredIndicator
            />
            <FormGroup>
                <Label for="pname">
                    <h5>
                        Product Description
                    </h5>
                </Label>
                <RichEditor 
                    onChange={data => setBasicFieldData('product_description', data)}
                    required
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
                    <Col md="auto">
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
                    onChange={data => setVariantsDataContainer({
                        multiple: false,
                        data: data
                    })}
                />
            }
            {isMultiVariant === 'yes' &&
                <MultipleVariantForm
                    onChange={data => setVariantsDataContainer({ ...variantsDataContainer,
                        multiple: true,
                        data: data
                    })}
                    setOptions={options => setVariantsDataContainer({ ...variantsDataContainer,
                        options: options
                        })}

                 />
            }
            <hr />
            <FormGroup>
                <Button.Ripple type="submit" color="primary" size="lg">Submit</Button.Ripple>
            </FormGroup>
            </Col>
        </Row>
        </form>
        <ToastContainer />
        </>
    )
}

export default AddProduct