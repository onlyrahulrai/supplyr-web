import { SimpleInputField } from "components/forms/fields";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, X } from "react-feather";
import Radio from "../../components/@vuexy/radio/RadioVuexy";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import { history } from "../../history";
import RichEditor from "./_RichEditor";
import Select from "react-select";

const compareByData = [
  { value: "product_title", label: "Product title" },
  { value: "product_category", label: "Product category" },
  { value: "product_vendor", label: "Product vendor" },
  { value: "product_tag", label: "Product tag" },
  { value: "compare_at_price", label: "Compare at price" },
  { value: "weight", label: "Weight" },
  { value: "inventory_stock", label: "Inventory Stock" },
  { value: "variants_title", label: "Variant's title" }
];

const compareWithData = [
  {
    value: "is_equal_to",
    label: "Is equal to",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "compare_at_price",
      "weight",
      "inventory_stock",
      "variants_title"
    ]
  },
  {
    value: "is_not_equal_to",
    label: "Is not equal to",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "compare_at_price",
      "weight",
      "inventory_stock",
      "variants_title"
    ]
  },
  {
    value: "is_greater_than",
    label: "Is greater than",
    link: ["compare_at_price", "weight", "inventory_stock"]
  },
  {
    value: "is_less_than",
    label: "Is less than",
    link: ["compare_at_price", "weight", "inventory_stock"]
  },
  {
    value: "starts_with",
    label: "Starts with",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title"
    ]
  },
  {
    value: "ends_with",
    label: "Ends with",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title"
    ]
  },
  {
    value: "contains",
    label: "Contains",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title"
    ]
  },
  {
    value: "does_not_contain",
    label: "Does not contain",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title"
    ]
  },
  { value: "is_not_empty", label: "Is not empty",link:[] },
  { value: "is_empty", label: "Is empty" ,link:[]}
];


const AddConditionsComponent = (props) => {
  const removeConditions = (index) => {
    let rulesCopy = [...props.basicData.rules];
    rulesCopy.splice(index, 1);
    props.setBasicFieldData("rules",rulesCopy);
  };
 
  return (
    <>
      <Row className="mt-1 align-items-center">
        <Col md="auto">
          <span>Products must match:</span>
        </Col>
        <Col md="auto">
          <Radio
            label="All conditions"
            defaultChecked={true}
            name="conditions"
            value={ props.basicData.condition === "all" ? props.basicData.condition : "all"}
            onChange={(e) => props.setBasicFieldData("condition",e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Radio
            label="Any conditions"
            defaultChecked={false}
            name="conditions"
            value={ props.basicData.condition === "any" ? props.basicData.condition : "any"}
            onChange={(e) => props.setBasicFieldData("condition",e.target.value)}
          />
        </Col>
      </Row>

      {props.basicData.rules.map((condition, index) => (
        <Row key={index} style={{ alignItems: "center" }} className="mt-2">
          <Col md="4 m-auto">
            <SimpleInputField
              requiredIndicator
              field={
                <Select
                  options={compareByData}
                  onChange={(value,action) => {
                    let _rules = props.basicData.rules
                    _rules[index].compareBy = value.value;
                    props.setBasicFieldData("rules",_rules)
                  }}
                  requiredIndicator
                  defaultOptions
                  name="compareBy"
                  isOptionDisabled={(option) => option.disabled}
                  menuPlacement="top"
                />
              }
            />
          </Col>
          <Col md="4 m-auto ">
            <SimpleInputField
              requiredIndicator
              field={
                <Select
                  options={compareWithData.filter((item) => item.link.includes(props.basicData.rules[index].compareBy))}
                  onChange={(value,action) => {
                    let _rules = props.basicData.rules
                    _rules[index].compareWith = value.value;
                    props.setBasicFieldData("rules",_rules)
                  }}
                  requiredIndicator
                  defaultOptions
                  name="compareWith"
                  isOptionDisabled={(option) => option.disabled}
                  menuPlacement="auto"
                />
              }
            />
          </Col>
          <Col md="4 d-flex align-items-center ">
            <SimpleInputField
              type="text"
              onChange={(e) => {
                let _rules = props.basicData.rules
                _rules[index].compareValue = e.target.value;
                props.setBasicFieldData("rules",_rules)
              }}
              requiredIndicator
              required
              iconRight={props.basicData.rules.length > 1}
              icon={<X size={15} />}
              name="compareValue"
              styles={{ width: `${props.basicData.rules.length > 1 ? "90%" : "100%"}` }}
              onClick={() => removeConditions(index)}
            />
          </Col>
        </Row>
      ))}
      <Button
        className="d-flex align-items-center"
        color="secondary"
        outline
        size="sm"
        type="button"
        onClick={() => props.setBasicFieldData("rules",[...props.basicData.rules,{setFocus:1}])}
      >
        {" "}
        <Plus size={19} className="mr-1" /> Add another condition
      </Button>
    </>
  );
};



const CategoryUpdate = () => {
  const [basicData, setBasicData] = useState({ title: "",action:"automated",condition:"all",rules:[{setFocus:1}]});
  

  function setBasicFieldData(field, value) {
    let basicDataCopy = { ...basicData };
    basicDataCopy[field] = value;
    setBasicData(basicDataCopy);
  }
  

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                <div className="ag-grid-actions flex-wrap mb-1 border-bottom-secondary- pb-1"></div>
                <Row className="align-items-center">
                  <Col lg="auto d-flex align-items-center">
                    <ArrowLeft
                      size="16"
                      onClick={() =>
                        history.push("/inventory/categories/list/")
                      }
                      className="cursor-pointer"
                    />
                    <CardTitle className="mb-0 pr-2 ml-1 border-right">
                      Create Collections
                    </CardTitle>
                  </Col>
                </Row>
                <hr />
                <Row className="justify-content-center">
                  <Col md="10">
                    <form>
                      <SimpleInputField
                        label="Category Name"
                        type="text"
                        name="name"
                        placeholder="Type category name.."
                        onChange={(e) =>
                          setBasicFieldData("title",e.target.value)
                        }
                        value={basicData.title}
                        requiredIndicator
                        required
                      />
                      <FormGroup>
                        <Label for="category-description">
                          <span className="text-bold-600">
                            Category Description
                          </span>
                        </Label>
                        <RichEditor
                          onChange={(data) =>
                            setBasicFieldData("description", data)
                          }
                          defaultValue={basicData.description}
                        />
                      </FormGroup>
                      <span className="text-bold-600 text-dark">
                        Collection type
                      </span>
                      <div className="mt-1">
                        <Radio
                          label="Manual"
                          defaultChecked={false}
                          name="action"
                          value={basicData.action === "manual" ? basicData.action : "manual"}
                          onChange={(e) => setBasicFieldData("action",e.target.value)}
                        />
                        <div className="ml-2">
                          <span>
                            Add products to this collection one by one.Learn
                            more about manual collections
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 mb-1">
                        <Radio
                          label="Automated"
                          defaultChecked={true}
                          name="action"
                          value={basicData.action === "automated" ? basicData.action : "automated"}
                          onChange={(e) => setBasicFieldData("action",e.target.value)}
                        />
                        <div className="ml-2 ">
                          <span>
                            Existing and future products that match the
                            conditions you set will automatically be added to
                            this collection.Learn more about automated
                            collections.
                          </span>
                        </div>
                      </div>

                      {basicData.action === "automated" ? (
                        <div>
                          <span className="text-bold-600 text-dark">
                            Conditions
                          </span>

                          <AddConditionsComponent
                            conditions={basicData.conditions}
                            basicData={basicData}
                            setBasicFieldData={setBasicFieldData}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <hr />
                      <Button
                        className="ml-auto d-block mt-1"
                        onClick={() => console.log("Form submitted successfully!")}
                        color="primary"
                        outline
                      >
                        {" "}
                        Save <Check size={19} />
                      </Button>
                    </form>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CategoryUpdate;
