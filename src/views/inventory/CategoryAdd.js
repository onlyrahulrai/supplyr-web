import { SimpleInputField } from "components/forms/fields";
import React, { useEffect, useReducer, useState } from "react";
import { ArrowLeft, Check } from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { history } from "../../history";
import { connect } from "react-redux";
import RichEditor from "./_RichEditor";
import Select from "react-select/";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import apiClient from "api/base";
import _Swal from "sweetalert2";
import { getApiURL } from "api/utils";
import ManualConditionsComponent from "components/inventory/ManualConditionsComponent";

import AutomatedCategoryComponent from "components/inventory/AutomatedCategoryComponent";
import "react-toastify/dist/ReactToastify.css";

// import { RuleValueComponent } from "components/inventory/RuleValueComponent";
import withReactContent from "sweetalert2-react-content";

const Swal = withReactContent(_Swal);

const reducer = (state, action) => {
  switch (action.type) {
    case "REMOVE_ISEDITABLE":
      return { ...state, isEditable: false };
    case "ON_CHANGE":
      return {
        ...state,
        isEditable: true,
        editableRule: {
          ...state.editableRule,
          [action.payload.name]: action.payload.value,
          // attribute_unit: action.payload.name === "weight" ? action.payload.value : "gm",
        },
      };
    case "ADD_RULE_ACTION":
      return {
        ...state,
        isEditable: true,
        editableRule: {
          setFocus: 1,
          attribute_name: "",
          comparison_type: "",
          attribute_value: "",
          attribute_unit: null,
        },
      };
    case "UPDATE_RULE_ACTION":
      console.log(action.payload);
      const rowData = state.rules.find(
        (rule, index) => index === action.payload
      );
      return {
        ...state,
        isEditable: true,
        editableRule: rowData,
        id: action.payload,
        updateRule: true,
      };
    case "ADD_RULE":
      return {
        ...state,
        isEditable: false,
        rules: [...state.rules, state.editableRule],
      };
    case "UPDATE_RULE":
      console.log("rules id >>>>> ", state.id);
      let _rules = state.rules;
      _rules[state.id] = state.editableRule;
      return {
        ...state,
        isEditable: false,
        id: null,
        rules: _rules,
        updateRule: false,
      };
    case "DELETE_RULE":
      const newRules = state.rules.filter(
        (rule, index) => index !== action.payload
      );
      return { ...state, rules: newRules, isEditable: false };
    case "INITIALIZE":
      return { ...state, rules: action.payload };
    default:
      return state;
  }
};

const CategoryAdd = (props) => {
  const [basicData, setBasicData] = useState({
    rules: [{ setFocus: 1 }],
  });
  const [categoryId, setCategoryId] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(undefined);
  const [displayImage, setDisplayImage] = useState(undefined);
  const [deleteImage, setDeleteImage] = useState(false);
  const isEditingExistingProduct = Boolean(props.match.params.categoryId);
  const [isCategoryDataLoaded, setIsCategoryDataLoaded] = useState(false);
  const operationalSubCategories = props.user.profile.sub_categories;
  const [haveSubCategory, setHaveSubCategory] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    rules: [
      {
        attribute_name: "Product title",
        comparison_type: "Is equal to",
        attribute_value: "128",
        id: 12,
      },
    ],
  });
  const [action, setAction] = useState("automated");
  const [condition, setCondition] = useState("all");

  const _categoryId = props.match.params.categoryId;
  

  function clearState() {
    if (props.match.params.categoryId) {
      setBasicData("");
      setDisplayImage(undefined);
      setIsCategoryDataLoaded(false);
    } else {
      dispatch({ type: "INITIALIZE", payload: [] });
      setBasicData({ name: "", rules: [{ setFocus: 1 }] });
      setCategoryId("");
      setDisplayImage(undefined);
      setIsCategoryDataLoaded(false);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }

  useEffect(() => {
    setIsLoading(true);

    clearState();
  }, [props.location.pathname]);

  const isPageRenderReady = !isEditingExistingProduct || isCategoryDataLoaded;

  const category = props.user.profiling_data?.categories_data.categories.filter((category) => (category.seller === props.user.name))
    .map((category) => ({  label: category.name,value: category.id}));

  useEffect(() => {
    if (_categoryId) {
      setIsLoading(true);
      setCategoryId(_categoryId);
      apiClient.get("/inventory/categories/" + _categoryId).then((response) => {
        const category = response.data;
        console.log("category data >>> ", category);
        setBasicData((state) => ({
          ...state,
          id: category.id,
          name: category.name,
          description: category.description,
          parent: category.parent,
        }));
        if (category.sub_categories.length > 0) {
          setHaveSubCategory(true);
        }
        setAction(category.action);
        setCondition( category.condition)
        dispatch({ type: "INITIALIZE", payload: category.rules });
        console.log("rules data >>> ", category.rules);
        response.data.image && setDisplayImage(getApiURL(response.data.image));
        setIsCategoryDataLoaded(true);
        setIsLoading(false);
      });
    }
  }, [props.match.params.categoryId]);

  const setBasicFieldData = (field, value) => {
    let basicDataCopy = { ...basicData };
    basicDataCopy[field] = value;
    setBasicData(basicDataCopy);
  };

  


  // console.log(" ------ category ------ ", _categoryId ,props.user.profiling_data?.categories_data.categories.filter((category) =>  ( category.id !== _categoryId && category.seller === props.user.name)))

  const validateForm = () => {
    let errors = [];
    if (!basicData.name) {
      errors.push("Category name is required!");
    }
    if (!basicData.description) {
      errors.push("Category description is required!");
    }
    if (action === "automated" && !state.rules.length) {
      errors.push("Please add at least one category Rule");
    }


    if (errors.length > 0) {
      Swal.fire(<div>
        <h1>Error !</h1>
        <h4 className="mb-1">Please correct the following errors</h4>
        {errors.map((error) => {
          return <h6 className="text-danger">{error} </h6>;
        })}
      </div>);

      return false;
    } else return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    // setIsLoading(true);
    let url = "/inventory/categories/";

    let is_valid = validateForm();

    if (is_valid) {
      Swal.fire({
        title: (
          <div className="mt-3 mb-1">
            <h2 className="text-success">All done !!</h2>
            <h3 className="text-secondary">
              <Spinner color="secondary" className="mr-1" />
              Saving your product
            </h3>
          </div>
        ),
        buttons: false,
        closeOnClickOutside: false,
        icon: "success",
      });
      let _formData = new FormData();
      _formData.append("id", basicData.id);
      _formData.append("name", basicData.name);
      _formData.append("action", action);
      _formData.append("condition", condition);
      _formData.append("rules", JSON.stringify(state.rules));
      _formData.append("description", basicData.description);
      _formData.append("seller", props.user.username);
      _formData.append("parent", basicData.parent ?? "");
      uploadedImage && _formData.append("image", uploadedImage);
      deleteImage && _formData.append("delete_image", deleteImage);
      _formData.append("selectedProducts", JSON.stringify(productIds));

      if (categoryId) {
        url += categoryId + "/";
      }
      apiClient
        .post(url, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("response >>>> ", response.status);
          setIsLoading(false);
          if(response.status >= 200 && response.status <=299){
            Swal.fire("Category Saved !", "success");
          history.push("/inventory/categories/list");
          }else{
            throw new Error(response.statusText)
          }
        })
        .catch((err) => {
          Swal.fire(`Some error have been accured!`);
        });
    }
  };

  function onImageSelect(e) {
    let file = e.target.files[0];
    console.log(file);
    setUploadedImage(file);
    // Frontend thumbnail generation
    var reader = new FileReader();
    reader.onloadend = function () {
      const img_data = reader.result;
      setDisplayImage(img_data);
    };
    file && reader.readAsDataURL(file);
    setDeleteImage(false);
  }

  function onImageRemove() {
    setUploadedImage(undefined);
    setDisplayImage(undefined);
    setDeleteImage(true);
  }

  console.log("Sub Category status >>>>> ", !haveSubCategory);

  // // if (isLoading) return <Spinner />;

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              {isLoading ? (
                <div
                  className=" py-5 text-center"
                  style={{ margin: "11rem 0" }}
                >
                  <Spinner />
                </div>
              ) : (
                <>
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
                      <form onSubmit={submitForm}>
                        <SimpleInputField
                          label="Category Name"
                          type="text"
                          name="name"
                          placeholder="Type category name.."
                          onChange={(e) =>
                            setBasicFieldData("name", e.target.value)
                          }
                          value={basicData.name || ""}
                        />

                        <h5>Category Image</h5>
                        <FormGroup row>
                          <Label for="pname"></Label>
                          <Col md="auto mr-auto">
                            <Label>
                              {displayImage ? (
                                <img
                                  src={displayImage}
                                  className="img-100"
                                  alt="selected"
                                />
                              ) : (
                                "No Image Selected"
                              )}
                            </Label>
                          </Col>
                          <Col md="auto">
                            <Label for="img-upload">
                              <Button
                                color="danger"
                                className="mr-1"
                                outline
                                onClick={(e) => setTimeout(onImageRemove)}
                              >
                                {" "}
                                {/** Done really know the cause, but without setTimeout, it's opening file upload dialog on removing an image (perhaps clicking the following button?) */}
                                Remove
                              </Button>

                              <Button
                                color="primary"
                                outline={props.is_submitted}
                                onClick={(e) =>
                                  document.getElementById("img-upload").click()
                                }
                              >
                                <span>
                                  {displayImage ? "Change" : "Upload"}
                                </span>
                              </Button>
                            </Label>

                            <Input
                              type="file"
                              // name={schema.name}
                              id="img-upload"
                              // required={schema.required} //It will clash with controlled forms if required is set (while submitting, if form empty)
                              placeholder="Upload"
                              onChange={onImageSelect}
                              className="d-none"
                              accept="image/jpeg, image/png, image/svg"
                              // value= ""
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup>
                          {isPageRenderReady && (
                            <SimpleInputField
                              label="Category Description"
                              field={
                                <RichEditor
                                  onChange={(data) =>
                                    setBasicFieldData("description", data)
                                  }
                                  defaultValue={basicData.description || ""}
                                />
                              }
                            />
                          )}
                        </FormGroup>

                        {
                          isPageRenderReady && (
                            <>
                              {
                                console.log(category.filter((c) => c.value != props.match.params.categoryId))
                              }
                                {(!(basicData.parent === null) || !haveSubCategory) && (
                                  <SimpleInputField
                                    label="Select parent category (Optional)"
                                    field={
                                      <Select
                                        onChange={(data) =>
                                          setBasicFieldData("parent", data.value)
                                        }
                                        value={
                                          category.find(
                                            (parent) =>
                                              parent.value === basicData.parent
                                          ) || ""
                                        }
                                        menuPlacement="auto"
                                        options={_categoryId ? category.filter((c) => c.value != _categoryId) : category}
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
                                )}
                            </>
                          )
                        }
                        

                        {/* {console.log(" ----- category data ------ ",categoryId,_categoryId)} */}

                        <div className="d-flex justify-content-between flex-column  mt-1">
                          <span className="text-bold-600 text-dark">
                            Collection type
                          </span>

                          <p>
                            {categoryId ? (
                              <Badge color="primary text-capitalize mt-1 mb-1">
                                {action}
                              </Badge>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>

                        {!categoryId && (
                          <div className="mt-1">
                            <Radio
                              label="Manual"
                              checked={action === "manual"}
                              name="action"
                              value="manual"
                              onChange={(e) => setAction(e.target.value)}
                            />
                            <div className="ml-2">
                              <span>
                                Add products to this collection one by one.Learn
                                more about manual collections
                              </span>
                            </div>

                            <Radio
                              label="Automated"
                              checked={action === "automated"}
                              name="action"
                              value="automated"
                              onChange={(e) => setAction(e.target.value)}
                            />
                            <div className="ml-2 ">
                              <span>
                                Existing and future products that match the
                                conditions you set will automatically be added
                                to this collection.Learn more about automated
                                collections.
                              </span>
                            </div>
                          </div>
                        )}

                        {action === "automated" && (
                          <div className="mt-1">
                            <span className="text-bold-600 text-dark">
                              Conditions
                            </span>

                            <Row className="mt-1 align-items-center">
                              <Col md="auto">
                                <span>Products must match:</span>
                              </Col>
                              <Col md="auto">
                                <Radio
                                  label="All conditions"
                                  checked={condition === "all"}
                                  name="conditions"
                                  value="all"
                                  onChange={(e) => setCondition(e.target.value)}
                                />
                              </Col>
                              <Col md="auto">
                         
                                <Radio
                                  label="Any condition"
                                  checked={condition === "any"}
                                  name="conditions"
                                  value="any"
                                  onChange={(e) => setCondition(e.target.value)}
                                />
                              </Col>
                            </Row>
                            <hr />
                            <AutomatedCategoryComponent
                              isLoading={isLoading}
                              state={state}
                              dispatch={dispatch}
                            />
                          </div>
                        )}

                        {action === "manual" && (
                          <div>
                            <span className="text-bold-600 text-dark">
                              Actions
                            </span>
                            <ManualConditionsComponent
                              operationalSubCategories={
                                operationalSubCategories
                              }
                              category={basicData.id ?? ""}
                              onChange={(event) =>
                                setProductIds(
                                  event.api
                                    .getSelectedRows()
                                    .map((product) => product.id)
                                )
                              }
                              categoryId={categoryId}
                            />
                          </div>
                        )}

                        <hr />
                        <Button
                          className="ml-auto d-block mt-1"
                          disabled={isLoading}
                          color="primary"
                          outline
                          type="submit"
                        >
                          {" "}
                          Save <Check size={19} />
                        </Button>
                      </form>
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
  };
};

export default connect(mapStateToProps)(CategoryAdd);
