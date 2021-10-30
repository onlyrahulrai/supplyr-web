import Select from "react-select";
import { SimpleInputField } from "components/forms/fields";
import React, { useEffect, useReducer, useState } from "react";
import { ArrowLeft, Edit, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import {
  categoryRulesObjects,
  compareByData,
  compareWithData,
} from "assets/data/Rulesdata";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import Swal from "sweetalert2";

const AutomatedCategoryComponent = ({ state, dispatch, isLoading }) => {

  useEffect(() => {
    if(state.rules.length === 0){
      dispatch({type:"ADD_RULE_ACTION"})
    }
  },[])

  const handleAddRuleAction = () => {
    dispatch({ type: "ADD_RULE_ACTION" });
  };

  const handleUpdateRuleAction = (id) => {
    dispatch({ type: "UPDATE_RULE_ACTION", payload: id });
  };

  const handleDeleteRule = (id) => {
    dispatch({ type: "DELETE_RULE", payload: id });
  };

  const handleSave = () => {
    console.log("handle save is clieked");
    if (
      state.editableRule.attribute_name &&
      state.editableRule.comparison_type &&
      state.editableRule.attribute_value
    ) {
      if (state.updateRule) {
        dispatch({ type: "UPDATE_RULE" });
      } else {
        console.log("category rule is clicked ")
        dispatch({ type: "ADD_RULE" });
      }
    } else {
      Swal.fire(`<span>Please fill the all the rule fields</span>`)
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({ type: "ON_CHANGE", payload: { name: name, value: value } });
  };

  return (
    <React.Fragment>
      {!isLoading && (
        <>
          <div>
          {!state.isEditable && (
            
              <Button.Ripple
                type="button"
                color="primary"
                className="mb-1"
                onClick={handleAddRuleAction}
              >
                New Rule
              </Button.Ripple>
          )}

{state.isEditable && (
            <Card>
              <CardHeader>
                <div className="d-flex">
                  <span
                    className="mr-1 cursor-pointer"
                    onClick={() => dispatch({ type: "REMOVE_ISEDITABLE" })}
                  >
                    <ArrowLeft size="15" />
                  </span>

                  <span>Define Category Rule</span>
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <Row>
                    <Col sm="12">
                      <FormGroup>
                        <Label for="Rule Name">Attribute Name</Label>
                        <SimpleInputField
                          requiredIndicator
                          error="Hello world"
                          field={
                            <Select
                              options={compareByData}
                              onChange={(value, action) => {
                                const name = action.name;
                                const val = value.value;
                                dispatch({
                                  type: "ON_CHANGE",
                                  payload: { name: name, value: val },
                                });
                              }}
                              defaultOptions
                              name="attribute_name"
                              defaultValue={compareByData.find(
                                (item) =>
                                  item.value ===
                                  state.editableRule.attribute_name
                              )}
                              isOptionDisabled={(option) => option.disabled}
                              menuPlacement="top"
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          }
                        />
                      </FormGroup>

                      {state.editableRule.attribute_name === "weight" && (
                        <FormGroup>
                          <Label for="weight_unit">Select weight unit:</Label>
                          <Radio
                            label="Milligram"
                            color="primary"
                            onChange={handleChange}
                            checked={state.editableRule.attribute_unit === "mg"}
                            name="attribute_unit"
                            value="mg"
                          />
                          <Radio
                            label="Gram"
                            color="primary"
                            name="attribute_unit"
                            checked={state.editableRule.attribute_unit === "gm"}
                            value="gm"
                            onChange={handleChange}
                          />
                          <Radio
                            label="Kilogram"
                            color="primary"
                            name="attribute_unit"
                            checked={state.editableRule.attribute_unit === "kg"}
                            value="kg"
                            onChange={handleChange}
                          />
                        </FormGroup>
                      )}
                    </Col>
                    <Col sm="12">
                      <FormGroup>
                        <Label for="Compare By">Compare By</Label>
                        <SimpleInputField
                          requiredIndicator
                          field={
                            <Select
                              options={compareWithData.filter((item) =>
                                item.link.includes(
                                  state.editableRule.attribute_name
                                )
                              )}
                              onChange={(value, action) => {
                                
                                const name = action.name;
                                const val = value.value;
                                console.log("Camparison is changed >>>",name,val)
                                dispatch({
                                  type: "ON_CHANGE",
                                  payload: { name: name, value: val },
                                });
                              }}
                              requiredIndicator
                              required
                              defaultOptions
                              name="comparison_type"
                              defaultValue={compareWithData.find(
                                (item) =>
                                  item.value ===
                                  state.editableRule.comparison_type
                              )}
                              isOptionDisabled={(option) => option.disabled}
                              menuPlacement="auto"
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <FormGroup>
                        <Label for="Attribute Value">Attribute Value</Label>
                        <Input
                          type={`${
                            [
                              "product_title",
                              "product_category",
                              "product_vendor",
                              "product_tag",
                            ].includes(state.editableRule.attribute_name)
                              ? "text"
                              : "number"
                          }`}
                          name="attribute_value"
                          id="attribute_value"
                          placeholder="Attribute Value"
                          value={state.editableRule.attribute_value}
                          onChange={handleChange}
                          disabled={!state.editableRule.attribute_name}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <FormGroup>
                        <Button.Ripple
                          color="primary"
                          type="save"
                          className="mr-1 mb-1"
                          onClick={handleSave}
                          type="button"
                        >
                          Save
                        </Button.Ripple>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          )}

          { state.rules.length > 0 && (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Attribute Name</th>
                    <th>Compare By</th>
                    <th>Attribute Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state?.rules?.map((rule, index) => (
                    <tr key={index}>
                      <td>{categoryRulesObjects[rule.attribute_name]}</td>
                      <td>{categoryRulesObjects[rule.comparison_type]}</td>
                      <td>{rule.attribute_value}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-start">
                          <span
                            className="shadow rounded-full bg-primary  d-flex text-white mr-1 cursor-pointer"
                            style={{ padding: "0.85rem" }}
                            onClick={() => handleUpdateRuleAction(index)}
                          >
                            <Edit size="15" />
                          </span>
                          <span
                            className="shadow rounded-full bg-warning d-flex text-white cursor-pointer"
                            style={{ padding: "0.85rem" }}
                            onClick={() => handleDeleteRule(index)}
                          >
                            <Trash size="15" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          )}
          </div>
          
        </>
      )}
    </React.Fragment>
  );
};

export default AutomatedCategoryComponent;
