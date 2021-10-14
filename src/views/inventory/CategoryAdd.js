import { SimpleInputField } from "components/forms/fields";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Plus, X } from "react-feather";
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
} from "reactstrap";
import { history } from "../../history";
import { connect } from "react-redux";
import RichEditor from "./_RichEditor";
import Select from "react-select/";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import apiClient from "api/base";
import Swal from "sweetalert2";
import { getApiURL } from "api/utils";
import { priceFormatter } from "utility/general";
import ProductDummyImage from "assets/img/svg/cart.svg";
import { Edit3 } from "react-feather";
import ManualConditionsComponent from "components/inventory/ManualConditionsComponent";

const compareByData = [
  { value: "product_title", label: "Product title" },
  { value: "product_category", label: "Product category" },
  { value: "product_vendor", label: "Product vendor" },
  { value: "product_tag", label: "Product tag" },
  { value: "compare_at_price", label: "Compare at price" },
  { value: "weight", label: "Weight" },
  { value: "inventory_stock", label: "Inventory Stock" },
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
      "variants_title",
    ],
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
      "variants_title",
    ],
  },
  {
    value: "is_greater_than",
    label: "Is greater than",
    link: ["compare_at_price", "weight", "inventory_stock"],
  },
  {
    value: "is_less_than",
    label: "Is less than",
    link: ["compare_at_price", "weight", "inventory_stock"],
  },
  {
    value: "starts_with",
    label: "Starts with",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title",
    ],
  },
  {
    value: "ends_with",
    label: "Ends with",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title",
    ],
  },
  {
    value: "contains",
    label: "Contains",
    link: [
      "product_title",
      "product_category",
      "product_vendor",
      "product_tag",
      "variants_title",
    ],
  },
];

const CategoryAdd = (props) => {
  const [basicData, setBasicData] = useState({
    rules: [{ setFocus: 1 }],
    images: [],
  });
  const [categoryId, setCategoryId] = useState("");
  const [productIds, setProductIds] = useState([]);
  const [requestsCache, setRequestsCache] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(undefined);
  const [displayImage, setDisplayImage] = useState(undefined);
  const [deleteImage, setDeleteImage] = useState(false);
  const isEditingExistingProduct = Boolean(props.match.params.categoryId);
  const [isCategoryDataLoaded, setIsCategoryDataLoaded] = useState(false);

  const operationalSubCategories = props.user.profile.sub_categories;

  function clearState() {
    if (props.match.params.categoryId) {
      setBasicData("");
      setDisplayImage(undefined);
      setIsCategoryDataLoaded(false);
    } else {
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

  useEffect(() => {
    const _categoryId = props.match.params.categoryId;
    if (_categoryId) {
      setIsLoading(true);
      setCategoryId(_categoryId);
      apiClient.get("/inventory/categories/" + _categoryId).then((response) => {
        console.log(
          "response Data >>>>>>>>>>>>>>>>>--------------->>>>>>>>>>>",
          response.data
        );
        const category = response.data;
        setBasicData((state) => ({
          ...state,
          id: category.id,
          name: category.name,
          action: category.action,
          condition: category.condition,
          rules: category.rules,
          description: category.description,
          parent: category.parent,
        }));
        response.data.image && setDisplayImage(getApiURL(response.data.image));
        setIsCategoryDataLoaded(true);
      });
    }
  }, [props.match.params.categoryId]);

  const setBasicFieldData = (field, value) => {
    let basicDataCopy = { ...basicData };
    basicDataCopy[field] = value;
    setBasicData(basicDataCopy);
  };

  const category = props.user.profiling_data?.categories_data.categories
    .filter((category) => category.seller === props.user.name)
    .map((category) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  const removeConditions = (index) => {
    let rulesCopy = [...basicData.rules];
    rulesCopy.splice(index, 1);
    setBasicFieldData("rules", rulesCopy);
  };

  const submitForm = (e) => {
    e.preventDefault();
    let url = "/inventory/categories/";
    let _formData = new FormData();
    _formData.append("id", basicData.id);
    _formData.append("name", basicData.name);
    _formData.append("action", basicData.action);
    _formData.append("condition", basicData.condition);
    _formData.append("rules", JSON.stringify(basicData.rules));
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
        Swal.fire("Category Saved !", "success");
        history.push("/inventory/categories/list");
      });
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

  console.log("Basic Data is >>>>>>>> ", basicData.rules);

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col lg="auto d-flex align-items-center">
                  <ArrowLeft
                    size="16"
                    onClick={() => history.push("/inventory/categories/list/")}
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
                      requiredIndicator
                      required
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
                            <span>{displayImage ? "Change" : "Upload"}</span>
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
                      <Label for="pname">
                        <h5>Category Description</h5>
                      </Label>
                      {isPageRenderReady && (
                        <RichEditor
                          onChange={(data) =>
                            setBasicFieldData("description", data)
                          }
                          defaultValue={basicData.description || ""}
                        />
                      )}
                    </FormGroup>

                    {basicData.parent === null ? (
                      ""
                    ) : (
                      <SimpleInputField
                        label="Select parent category (Optional)"
                        field={
                          <Select
                            onChange={(data) =>
                              setBasicFieldData("parent", data.value)
                            }
                            value={
                              category.find(
                                (parent) => parent.value === basicData.parent
                              ) || ""
                            }
                            menuPlacement="auto"
                            options={category}
                          />
                        }
                      />
                    )}

                    <div className="d-flex justify-content-between flex-column">
                      <span className="text-bold-600 text-dark">
                        Collection type
                      </span>

                      <p>
                        {categoryId ? (
                          <Badge color="primary text-capitalize mt-1 mb-1">
                            {basicData.action}
                          </Badge>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>

                    {!categoryId ? (
                      <div className="mt-1">
                        <Radio
                          label="Manual"
                          defaultChecked={
                            basicData.action === "manual" ? true : false
                          }
                          name="action"
                          value={
                            basicData.action === "manual"
                              ? basicData.action
                              : "manual"
                          }
                          onChange={(e) =>
                            setBasicFieldData("action", e.target.value)
                          }
                          required={true}
                        />
                        <div className="ml-2">
                          <span>
                            Add products to this collection one by one.Learn
                            more about manual collections
                          </span>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {!categoryId ? (
                      <div className="mt-1 mb-1">
                        <Radio
                          label="Automated"
                          defaultChecked={
                            basicData.action === "automated" ? true : false
                          }
                          name="action"
                          value={
                            basicData.action === "automated"
                              ? basicData.action
                              : "automated"
                          }
                          onChange={(e) =>
                            setBasicFieldData("action", e.target.value)
                          }
                          required={true}
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
                    ) : (
                      ""
                    )}

                    {basicData.action === "automated" ? (
                      <div>
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
                              defaultChecked={
                                basicData.condition === "all" ?? false
                              }
                              name="conditions"
                              value={
                                basicData.condition === "all"
                                  ? basicData.condition
                                  : "all"
                              }
                              onChange={(e) =>
                                setBasicFieldData("condition", e.target.value)
                              }
                              required={true}
                            />
                          </Col>
                          <Col md="auto">
                            <Radio
                              label="Any conditions"
                              defaultChecked={
                                basicData.condition === "any" ?? false
                              }
                              name="conditions"
                              value={
                                basicData.condition === "any"
                                  ? basicData.condition
                                  : "any"
                              }
                              onChange={(e) =>
                                setBasicFieldData("condition", e.target.value)
                              }
                              required={true}
                            />
                          </Col>
                        </Row>
                        {basicData.rules.map((rule, index) => (
                          <div key={rule.id}>
                            <Row
                              style={{ alignItems: "center" }}
                              className="mt-2"
                            >
                              <Col md="4 m-auto">
                                <SimpleInputField
                                  requiredIndicator
                                  field={
                                    <Select
                                      options={compareByData}
                                      onChange={(value, action) => {
                                        let _rules = basicData.rules;
                                        _rules[index].attribute_name =
                                          value.value;
                                        setBasicFieldData("rules", _rules);
                                      }}
                                      requiredIndicator
                                      required
                                      defaultOptions
                                      name="compareBy"
                                      defaultValue={compareByData.find(
                                        (item) =>
                                          item.value === rule.attribute_name
                                      )}
                                      isOptionDisabled={(option) =>
                                        option.disabled
                                      }
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
                                      options={compareWithData.filter((item) =>
                                        item.link.includes(
                                          basicData.rules[index].attribute_name
                                        )
                                      )}
                                      onChange={(value, action) => {
                                        let _rules = basicData.rules;
                                        _rules[index].comparison_type =
                                          value.value;
                                        setBasicFieldData("rules", _rules);
                                      }}
                                      requiredIndicator
                                      required
                                      defaultOptions
                                      name="compareWith"
                                      defaultValue={compareWithData.find(
                                        (item) =>
                                          item.value === rule.comparison_type
                                      )}
                                      isOptionDisabled={(option) =>
                                        option.disabled
                                      }
                                      menuPlacement="auto"
                                    />
                                  }
                                />
                              </Col>

                              <Col md="4 d-flex align-items-center ">
                                <SimpleInputField
                                  type="text"
                                  onChange={(e) => {
                                    let _rules = basicData.rules;
                                    _rules[index].attribute_value =
                                      e.target.value;
                                    setBasicFieldData("rules", _rules);
                                  }}
                                  requiredIndicator
                                  required
                                  iconRight={basicData.rules.length > 1}
                                  icon={<X size={15} />}
                                  name="compareValue"
                                  value={
                                  basicData.rules[index].attribute_value || ""
                                  }
                                  styles={{
                                    width: `${
                                      basicData.rules.length > 1
                                        ? "90%"
                                        : "100%"
                                    }`,
                                  }}
                                  onClick={() => removeConditions(index)}
                                />
                              </Col>

                              <Col md="12">
                                {(rule.attribute_name === "weight" && rule.attribute_value )? (
                                  <Row className="mb-1 align-items-center ">
                                    <Col md="auto">
                                      <span>Select weight unit: </span>
                                    </Col>
                                    <Col md="auto rulesweightoptions mt--1">
                                      <div className="d-inline-block mr-1">
                                        <Radio
                                          label="Kilogram"
                                          color="primary"
                                          defaultChecked={rule.attribute_unit === "kg" || false}
                                          name="rulesweightoptions"
                                          value={
                                            basicData.attribute_unit === "kg"
                                              ? basicData.attribute_unit
                                              : "kg"
                                          }
                                          onChange={(e) => {
                                            let _rules = basicData.rules;
                                            _rules[index].attribute_unit =
                                              e.target.value;
                                            setBasicFieldData("rules", _rules);
                                          }}
                                        />
                                      </div>
                                      <div className="d-inline-block mr-1">
                                        <Radio
                                          label="Gram"
                                          color="primary"
                                          defaultChecked={rule.attribute_unit === "gm" || false }
                                          name="rulesweightoptions"
                                          value={
                                            rule.attribute_unit === "gm"
                                              ? rule.attribute_unit
                                              : "gm"
                                          }
                                          onChange={(e) => {
                                            let _rules = basicData.rules;
                                            _rules[index].attribute_unit =
                                              e.target.value;
                                            setBasicFieldData("rules", _rules);
                                          }}
                                        />
                                      </div>
                                      <div className="d-inline-block mr-1">
                                        <Radio
                                          label="Milligram"
                                          color="primary"
                                          defaultChecked={rule.attribute_unit === "mg" || false }
                                          name="rulesweightoptions"
                                          value={
                                            rule.attribute_unit === "mg"
                                              ? rule.attribute_unit
                                              : "mg"
                                          }
                                          onChange={(e) => {
                                            let _rules = basicData.rules;
                                            _rules[index].attribute_unit =
                                              e.target.value;
                                            setBasicFieldData("rules", _rules);
                                          }}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                ) : (
                                  ""
                                )}
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          className="d-flex align-items-center"
                          color="secondary"
                          outline
                          size="sm"
                          type="button"
                          onClick={() =>
                            setBasicFieldData("rules", [
                              ...basicData.rules,
                              { setFocus: 1 },
                            ])
                          }
                        >
                          {" "}
                          <Plus size={19} className="mr-1" /> Add another
                          condition
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}

                    {basicData.action === "manual" ? (
                      <div>
                        <span className="text-bold-600 text-dark">Actions</span>
                        <ManualConditionsComponent
                          operationalSubCategories={operationalSubCategories}
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
                    ) : (
                      ""
                    )}

                    <hr />
                    <Button
                      className="ml-auto d-block mt-1"
                      onClick={() =>
                        console.log("Form submitted successfully!")
                      }
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
