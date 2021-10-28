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
import { compareByData } from "assets/data/Rulesdata";
import Swal from "sweetalert2";

const AutomatedCategoryComponent = ({ state, dispatch }) => {
  const [data, setData] = useState({
    attribute_name: "",
    comparison_type: "",
    attribute_value: "",
  });

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
    console.log("handle save is clieked")
    if (
      state.editableRule.attribute_name &&
      state.editableRule.comparison_type &&
      state.editableRule.attribute_value
    ) {
      if (!state.updateRule) {
        dispatch({ type: "ADD_RULE"});
      } else {
        dispatch({ type: "UPDATE_RULE" });
      }
    } else {
      console.log("all field is required");
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({ type: "ON_CHANGE", payload: { name: name, value: value } });
  };

  return (
    <React.Fragment>
      {!state.isEditable && (
        <div>
          <Button.Ripple
            type="button"
            color="primary"
            className="mb-1"
            onClick={handleAddRuleAction}
          >
            New Rule
          </Button.Ripple>
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
              {state.rules.map((rule, index) => (
                <tr key={index}>
                  <td>{rule.attribute_name}</td>
                  <td>{rule.comparison_type}</td>
                  <td>{rule.attribute_value}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-start">
                      <span
                        className="shadow rounded-full bg-primary text-white mr-1 cursor-pointer"
                        style={{ padding: "0.85rem" }}
                        onClick={() => handleUpdateRuleAction(index)}
                      >
                        <Edit size="15" />
                      </span>
                      <span
                        className="shadow rounded-full bg-warning text-white cursor-pointer"
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
        </div>
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
                    <Input
                      type="text"
                      name="attribute_name"
                      value={state.editableRule.attribute_name}
                      onChange={handleChange}
                      placeholder="Attribute Name"
                    />
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label for="Compare By">Compare By</Label>
                    <Input
                      type="text"
                      name="comparison_type"
                      id="compareBy"
                      placeholder="Compare By"
                      value={state.editableRule.comparison_type}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label for="Attribute Value">Attribute Value</Label>
                    <Input
                      type="text"
                      name="attribute_value"
                      id="attribute_value"
                      placeholder="Attribute Value"
                      value={state.editableRule.attribute_value}
                      onChange={handleChange}
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
    </React.Fragment>
  );
};

export default AutomatedCategoryComponent;
