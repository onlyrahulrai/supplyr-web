import { SimpleInputField } from "components/forms/fields";
import React, { Component, useEffect, useState } from "react";
import { ArrowLeft, Check, Edit3, Folder, FolderMinus, FolderPlus, Plus, PlusCircle, X } from "react-feather";
import Radio from "../../components/@vuexy/radio/RadioVuexy";


import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { history } from "../../history";
import RichEditor from "./_RichEditor";
import Select from "react-select";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import apiClient from "api/base";
import { matchSorter } from "match-sorter";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import CustomPagination from "components/common/CustomPagination";
import { AgGridReact } from "ag-grid-react";
import { getApiURL } from "api/utils";
import ProductDummyImage from "assets/img/svg/cart.svg";
import { priceFormatter } from "utility/general";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";


const compareByData = [
  { value: "product_title", label: "Product title" },
  { value: "product_category", label: "Product category" },
  { value: "product_vendor", label: "Product vendor" },
  { value: "product_tag", label: "Product tag" },
  { value: "compare_at_price", label: "Compare at price" },
  { value: "weight", label: "Weight" },
  { value: "inventory_stock", label: "Inventory Stock" },
  { value: "variants_title", label: "Variant's title" },
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

const AutomatedConditionsComponent = (props) => {
  const removeConditions = (index) => {
    let rulesCopy = [...props.basicData.rules];
    rulesCopy.splice(index, 1);
    props.setBasicFieldData("rules", rulesCopy);
  };

  console.log("rules data is ----> ", props.basicData.rules);

  return (
    <>
      <Row className="mt-1 align-items-center">
        <Col md="auto">
          <span>Products must match:</span>
        </Col>
        <Col md="auto">
          <Radio
            label="All conditions"
            defaultChecked={props.basicData.condition === "all" ?? false}
            name="conditions"
            value={
              props.basicData.condition === "all"
                ? props.basicData.condition
                : "all"
            }
            onChange={(e) =>
              props.setBasicFieldData("condition", e.target.value)
            }
            required={true}
          />
        </Col>
        <Col md="auto">
          <Radio
            label="Any conditions"
            defaultChecked={props.basicData.condition === "any" ?? false}
            name="conditions"
            value={
              props.basicData.condition === "any"
                ? props.basicData.condition
                : "any"
            }
            onChange={(e) =>
              props.setBasicFieldData("condition", e.target.value)
            }
            required={true}
          />
        </Col>
      </Row>

      {props.basicData.rules.map((rule, index) => (
        <Row key={index} style={{ alignItems: "center" }} className="mt-2">
          <Col md="4 m-auto">
            <SimpleInputField
              requiredIndicator
              field={
                <Select
                  options={compareByData}
                  onChange={(value, action) => {
                    let _rules = props.basicData.rules;
                    _rules[index].attribute_name = value.value;
                    props.setBasicFieldData("rules", _rules);
                  }}
                  requiredIndicator
                  required
                  defaultOptions
                  name="compareBy"
                  defaultValue={compareByData.find(
                    (item) => item.value === rule.attribute_name
                  )}
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
                  options={compareWithData.filter((item) =>
                    item.link.includes(
                      props.basicData.rules[index].attribute_name
                    )
                  )}
                  onChange={(value, action) => {
                    let _rules = props.basicData.rules;
                    _rules[index].comparison_type = value.value;
                    props.setBasicFieldData("rules", _rules);
                  }}
                  requiredIndicator
                  required
                  defaultOptions
                  name="compareWith"
                  defaultValue={compareWithData.find(
                    (item) => item.value === rule.comparison_type
                  )}
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
                let _rules = props.basicData.rules;
                _rules[index].attribute_value = e.target.value;
                props.setBasicFieldData("rules", _rules);
              }}
              requiredIndicator
              required
              iconRight={props.basicData.rules.length > 1}
              icon={<X size={15} />}
              name="compareValue"
              value={props.basicData.rules[index].attribute_value || ""}
              styles={{
                width: `${props.basicData.rules.length > 1 ? "90%" : "100%"}`,
              }}
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
        onClick={() =>
          props.setBasicFieldData("rules", [
            ...props.basicData.rules,
            { setFocus: 1 },
          ])
        }
      >
        {" "}
        <Plus size={19} className="mr-1" /> Add another condition
      </Button>
    </>
  );
};


class SubcategorySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedSubCategories: this.props.subCategories, //Currently displayed list, will be effected by search query
      selectedSubCategories: [],
      categoryModalOpen: false,
      isSubmitting: false,
      searchBarValue: "",
      displayClearSelectionButton:
        this.props.displayClearSelectionButton ?? false,
    };
  }

  toggleCategoryModal = () => {
    this.setState({ categoryModalOpen: !this.state.categoryModalOpen });
  };

  onCategoryButtonClick = () => {
    if (this.props.readyStateCheck) {
      const is_ready = this.props.readyStateCheck();
      if (!is_ready) {
        Swal.fire(this.props.notReadyMessage ?? "Not Ready", "", "info");
        return;
      }
    }
    this.toggleCategoryModal();
  };

  handleOnConfirm = (e) => {
    if (this.props.onConfirmPromise) {
      this.setState({ isSubmitting: true });
      let promise = this.props.onConfirmPromise(
        this.state.selectedSubCategories
      );
      promise
        .then(() => {
          this.setState({ isSubmitting: false });
          this.toggleCategoryModal();
          this.setState({ selectedSubCategories: [] });
        })
        .finally(() => {
          this.setState({ isSubmitting: false });
        });
    }
    if (this.props.onConfirm) {
      this.props.onConfirm(this.state.selectedSubCategories);
      this.toggleCategoryModal();
    }
  };

  onClearAllSubCategories = () => {
    this.setState({ selectedSubCategories: [] });
    this.props.onConfirm([]);
  };

  render() {
    const displayedCategories =
      this.state.displayedSubCategories?.groupBy("category") || {};
    console.log("Headers Items: ",this.props.modalTitle)
    return (
      <div className={this.props.className + " d-inline-block"}>
        <ButtonGroup>
          <Button.Ripple
            disabled={this.props.disabled}
            outline={this.state.selectedSubCategories.length === 0}
            color="dark"
            onClick={this.onCategoryButtonClick}
          >
            {this.props.buttonIcon ?? <Folder size={14} />}
            <span className="ml-50">
              {this.props.buttonLabel ?? "Categories"}
            </span>
          </Button.Ripple>
          {this.state.displayClearSelectionButton &&
            this.state.selectedSubCategories.length !== 0 && (
              <Button
                color="dark"
                outline
                className="p-50"
                onClick={(e) => this.onClearAllSubCategories()}
              >
                <X size={14} />
              </Button>
            )}
        </ButtonGroup>
        <Modal
          isOpen={this.state.categoryModalOpen}
          toggle={this.toggleCategoryModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={this.toggleCategoryModal} className="bg-dark">
            {this.props.modalTitle}
          </ModalHeader>
          <ModalBody>
            <SimpleInputField
              placeholder="search..."
              value={this.state.searchBarValue}
              onChange={(e) => {
                const val = e.target.value;
                const subCategories = this.props.subCategories;
                const match = matchSorter(subCategories, val, {
                  keys: ["name", "category"],
                });
                val && this.setState({ displayedSubCategories: match });
                !val &&
                  this.setState({ displayedSubCategories: subCategories });
                this.setState({ searchBarValue: val });
              }}
            />
            {Object.entries(displayedCategories).map(
              ([category, subCategories]) => {
                return (
                  <div key={category} className="mt-1">
                    <h6>{category}</h6>
                    {subCategories.map((sc) => {
                      return (
                        <div key={sc.id}>
                          <Checkbox
                            color="primary"
                            label={sc.name}
                            icon={<Check className="vx-icon" size={16} />}
                            defaultChecked={this.state.selectedSubCategories.includes(
                              sc.id
                            )}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const existingSelected =
                                this.state.selectedSubCategories;
                              if (checked) {
                                !existingSelected.find((i) => i === sc.id) &&
                                  this.setState({
                                    selectedSubCategories: [
                                      ...existingSelected,
                                      sc.id,
                                    ],
                                  });
                              } else {
                                existingSelected.find((i) => i === sc.id) &&
                                  this.setState({
                                    selectedSubCategories:
                                      existingSelected.filter(
                                        (i) => i !== sc.id
                                      ),
                                  });
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              }
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="dark"
              disabled={this.state.isSubmitting}
              onClick={this.handleOnConfirm}
            >
              {" "}
              {this.state.isSubmitting && (
                <Spinner
                  color="light"
                  size="sm"
                  className="reload-spinner mr-1"
                />
              )}
              {this.props.confirmButtonLabel ?? "Confirm"}
            </Button>
            <Button color="secondary" onClick={this.toggleCategoryModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

class ManualConditionsComponent extends Component {
  state = {
    filters: {},
    operationalSubCategories: this.props.operationalSubCategories,
    isLoading:false,
    requestsCache: {},
    gridReady: false,
    rowData: null,
    defaultColDef: {
      sortable: true,
    },
    columnDefs: [
      {
        headerName: "ID",
        field: "id",
        width: 150,
        // filter: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
        cellRendererFramework: (params) => {
          return (
            <div>
              <span>{params.value} </span>
              <Edit3
                size={20}
                color="cadetblue"
                title="Edit"
                role="button"
                className="pointer"
                onClick={(e) =>
                  history.push("/product/" + params.data.slug + "/edit/")
                }
              />
            </div>
          );
        },
      },
      {
        headerName: "Product Title",
        field: "title",
        // filter: true,
        width: 350,
        cellRendererFramework: (params) => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() => history.push(`/product/${params.data.slug}`)}
            >
              <img
                className="rounded mr-50"
                src={
                  params.data.featured_image
                    ? getApiURL(params.data.featured_image)
                    : ProductDummyImage
                }
                alt="user avatar"
                height="30"
                width="30"
              />
              <span>{params.data.title}</span>
            </div>
          );
        },
      },
      {
        headerName: "Quantity",
        field: "quantity",
        // filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          let compare_value = params.value;
          let display_value = params.value;

          if (params.data.has_multiple_variants) {
            compare_value = params.data.quantity_all_variants;
            display_value = `${params.data.quantity_all_variants} (across ${params.data.variants_count} variants)`;
          }
          const stock =
            compare_value >= 10 ? (
              <div className="badge badge-pill badge-light-success">
                <b>{display_value}</b>
              </div>
            ) : params.value >= 1 ? (
              <div className="badge badge-pill badge-light-warning">
                <b>{display_value}</b>
              </div>
            ) : (
              <div className="badge badge-pill badge-light-danger">
                OUT OF STOCK
              </div>
            );
          return <div>{stock}</div>;
        },
      },
      {
        headerName: "Sale Price",
        field: "price",
        // filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          let display_value = priceFormatter(params.value);
          if (
            params.data.has_multiple_variants &&
            params.data.sale_price_maximum &&
            params.data.sale_price_minimum &&
            params.data.sale_price_maximum !== params.data.sale_price_minimum
          ) {
            display_value = (
              <>
                {priceFormatter(params.data.sale_price_minimum)} {"-"}{" "}
                {priceFormatter(params.data.sale_price_maximum)}
              </>
            );
          }
          return (
            <div>
              {display_value}{" "}
              {params.data.has_multiple_variants && this.multiple_sign}
            </div>
          );
        },
      },
      {
        headerName: "Variants",
        field: "variants_count",
        // filter: true,
        width: 150,
        cellRendererFramework: (params) => {
          if (!params.data.has_multiple_variants) return "-";
          return params.value;
        },
      },
    ],
  };

  componentDidMount() {
    this.fetchProducts();
    window.addEventListener("fetchData", this.setDivSizeThrottleable);
  }

  componentWillUnmount = () => {
    window.removeEventListener("fetchData", this.setDivSizeThrottleable);
  };


  get isFiltersDataPresent() {
    const filters = this.state.filters;
    const is_missing =
      Object.keys(filters).length === 0 ||
      !Object.keys(filters)
        .map((key) => Object.values(filters[key]).length)
        .some(Boolean);
    return !is_missing;
  }

  onFilter = () => {
    if (!this.isFiltersDataPresent) {
      Swal.fire(<h4>Please add some filters first</h4>);
    } else {
      this.fetchProducts({
        filters: this.state.filters,
      });
    }
  };

  
  async fetchProducts(options) {
    const { filters, pageNumber } = options ?? {};
    const _filters = { ...filters };
    Object.keys(_filters).forEach((key) => {
      if (typeof _filters[key] === "string")
        _filters[key] = _filters[key].trim();
    });
    if (pageNumber) {
      _filters.page = pageNumber;
    }
    let queryParams = "";
    if (filters || pageNumber) {
      queryParams = "?" + new URLSearchParams(_filters).toString();
    }
    if(!options){
      queryParams = "?" + new URLSearchParams({"sub_categories":this.props.category}).toString()
    }
    let response = undefined;

    console.log(this.state.requestsCache[queryParams])
    try {
      const cached = this.state.requestsCache[queryParams];
      if (cached) {
        response = cached;
      } else {
        this.setState({ isLoading: true });
        response = await apiClient.get("inventory/products/" + queryParams);
        response = response.data;
      }

      const rowData = response.data;
      const currentPage = response.page;
      const totalPages = response.total_pages;

      this.setState({
        rowData,
        currentPage,
        totalPages,
        isLoading: false,
        filtersApplied: filters,
      });

      !cached &&
        this.setState({
          requestsCache: {
            ...this.state.requestsCache,
            [queryParams]: response,
          },
        });
    } catch (e) {
      Swal.fire("Error !", "Unable to fetch products", "error");
      console.log(e);
    }
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setState({ gridReady: true });
  };

  bulkUpdate = (operation, data) => {
    console.log("hello world!  from bulk update category:----->",operation,data)
    const selectedNodes = this.gridApi.getSelectedNodes();
    const product_ids = selectedNodes.map((node) => node.data.id);
    return apiClient
      .post("/inventory/products/bulk-update/", {
        product_ids,
        operation,
        data,
      })
      .then((response) => {
        if (response.data?.success) {
          Swal.fire("Products Updated", "", "success");
          // this.gridApi.deselectAll()
        }
      })
      .catch((err) => {
        Swal.fire("Error !", err.message, "error");
        throw err;
      });
  };


  render() {
    const { filters,rowData, columnDefs, defaultColDef  } = this.state;
    console.log(" category ------> ",this.props.category);
    return (
      <Row className="mt-2">
        <Col sm="12">
          <Card className="card-action card-reload">
            <CardBody>
              <Row className="align-items-center">
                <Col sm="12" md="auto">
                  <Row>
                    <Col sm="12" md="auto">
                      <Input
                        className="mr-1 d-inline-block"
                        type="text"
                        placeholder="Search query..."
                        value={this.state.filters.search ?? ""}
                        onChange={(e) =>
                          this.setState({
                            filters: { ...filters, search: e.target.value },
                          })
                        }
                        onKeyPress={(e) => e.charCode === 13 && this.onFilter()}
                      />
                    </Col>
                    <Col sm="12" md="auto">
                      <SubcategorySelector
                        buttonLabel="Filter By Categories"
                        buttonIcon={<Folder size={16} />}
                        modalTitle="Select Categories"
                        confirmButtonLabel="Done"
                        displayClearSelectionButton={true}
                        className=""
                        subCategories={this.state.operationalSubCategories}
                        onConfirm={(subCategories) => {
                          this.setState({
                            filters: {
                              ...filters,
                              sub_categories: subCategories,
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col
                      sm="12"
                      md="auto"
                      className="ml-auto ml-md-0 mr-0 mr-md-auto"
                    >
                      <Button.Ripple
                        color={this.isFiltersDataPresent ? "warning" : "light"}
                        onClick={this.onFilter}
                      >
                        Apply Filters
                      </Button.Ripple>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
              
              <div className="ag-grid-actions flex-wrap mb-1 border-bottom-secondary- pb-1">
                  <Row className="align-items-center">
                    <Col sm="12" md="auto">
                      <CardTitle className="pr-2 mr-1 border-right">
                        Actions
                      </CardTitle>
                    </Col>
                    <Col sm="12" md="auto">
                      <SubcategorySelector
                        subCategories={this.state.operationalSubCategories}
                        buttonLabel="Add Categories"
                        buttonIcon={<FolderPlus size={16} />}
                        modalTitle="Add Categories"
                        confirmButtonLabel="Add Selected Categories"
                        className=""
                        disabled={!this.state.gridReady}
                        readyStateCheck={() =>
                          this.gridApi.getSelectedNodes().length > 0
                        }
                        notReadyMessage="Please select some products first !"
                        onConfirmPromise={(subCategories) => {
                          return this.bulkUpdate(
                            "add-subcategories",
                            subCategories
                          );
                        }}
                      />
                    </Col>
                    <Col sm="12" md="auto">

                    <SubcategorySelector
                        subCategories={this.state.operationalSubCategories}
                        buttonLabel="Remove Categories"
                        buttonIcon={<FolderMinus size={16} />}
                        modalTitle="Remove Categories"
                        confirmButtonLabel="Remove Selected Categories"
                        className="ml-sm-1"
                        disabled={!this.state.gridReady}
                        readyStateCheck={() =>
                          this.gridApi.getSelectedNodes().length > 0
                        }
                        notReadyMessage="Please select some products first !"
                        onConfirmPromise={(subCategories) => {
                          return this.bulkUpdate(
                            "remove-subcategories",
                            subCategories
                          );
                        }}
                      />

                    </Col>
                  </Row>
                </div>
                
                
                {this.state.rowData !== null && !this.state.isLoading ? (
                  <div className="height-adjuster">
                    <AgGridReact
                      gridOptions={{}}
                      rowSelection="multiple"
                      defaultColDef={defaultColDef}
                      columnDefs={columnDefs}
                      rowData={rowData}
                      onGridReady={this.onGridReady}
                      colResizeDefault={"shift"}
                      animateRows={true}
                      // floatingFilter={true}
                      // pagination={true}
                      pivotPanelShow="always"
                      // paginationPageSize={pageSize}
                      resizable={true}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <Spinner
                      color="light"
                      size="lg"
                      className="reload-spinner mt-5"
                    />
                  </div>
                )}
              </div>
              <CustomPagination
                pageCount={this.state.totalPages}
                initialPage={1}
                onPageChange={(data) => this.switchPage(data.selected + 1)}
              />
            </CardBody>
          </Card>
        </Col>

     
      </Row>
    );
  }
}

const CategoryAdd = (props) => {
  const [basicData, setBasicData] = useState({
    name: "",
    rules: [{ setFocus: 1 }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [parentCategories, setParentCategories] = useState([]);

  function clearState() {
    if (props.match.params.categoryId) {
      setBasicData("");
    } else {
      setBasicData({ name: "", rules: [{ setFocus: 1 }] });
      setCategoryId("");
      setTimeout(() => setIsLoading(false), 100);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    clearState();
  }, [props.location.pathname]);

  function setBasicFieldData(field, value) {
    let basicDataCopy = { ...basicData };
    basicDataCopy[field] = value;
    setBasicData(basicDataCopy);
  }

  useEffect(() => {
    const _categoryId = props.match.params.categoryId;
    if (_categoryId) {
      setIsLoading(true);
      setCategoryId(_categoryId);
      apiClient.get("/inventory/categories/" + _categoryId).then((response) => {
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
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      });
    }
  }, [props.match.params.categoryId]);

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
    _formData.append("seller", props.authSeller.username);
    _formData.append("parent", basicData.parent ?? "");

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

  const category = props.profilingData?.categories_data.categories
    .filter((category) => category.seller === props.authSeller.name)
    .map((category) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  // console.log("categories data:  -----> ",category)
  // console.log(props.profilingData?.categories_data.categories)
  console.log("basic Data--------> : ", basicData);

  if (isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else {
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
                            defaultValue={basicData.description || ""}
                          />
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
                                value={category.find(
                                  (parent) => parent.value === basicData.parent
                                )}
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
                                conditions you set will automatically be added
                                to this collection.Learn more about automated
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

                            <AutomatedConditionsComponent
                              conditions={basicData.conditions}
                              basicData={basicData}
                              setBasicFieldData={setBasicFieldData}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        {basicData.action === "manual" ? (
                          <div>
                            <span className="text-bold-500 text-dark">
                              Filters
                            </span>
                            <ManualConditionsComponent 
                              operationalSubCategories={props.profile.sub_categories}
                              category={basicData.id ?? ""}
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
  }
};

const mapStateToProps = (state) => {
  return {
    authSeller: state.auth.userInfo,
    profilingData: state.auth.userInfo.profiling_data,
    profile: state.auth.userInfo.profile,
  };
};

export default connect(mapStateToProps)(CategoryAdd);
