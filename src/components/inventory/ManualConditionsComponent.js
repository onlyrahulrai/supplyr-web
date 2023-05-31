import { Check, Edit3, Folder, FolderPlus, X } from "react-feather";
import { history } from "../../history";
import { AgGridReact } from "ag-grid-react";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import { Component } from "react";
import { getApiURL } from "api/utils";
import ProductDummyImage from "assets/img/svg/cart.svg";
import Swal from "sweetalert2";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import CustomPagination from "components/common/CustomPagination";
import apiClient from "api/base";
import { SimpleInputField } from "components/forms/fields";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { matchSorter } from "match-sorter";
import PriceDisplay from "components/utils/PriceDisplay";
import { connect } from "react-redux";

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
    this.props.fetchProducts();
  };

  render() {
    const displayedCategories =
      this.state.displayedSubCategories?.groupBy("category") || {};
    console.log("Headers Items: ", this.props.modalTitle);
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

class ManualActionCompoment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSubCategories: [this.props.category],
    };
  }

  onCategoryButtonClick = () => {
    if (this.props.readyStateCheck) {
      const is_ready = this.props.readyStateCheck();
      if (!is_ready) {
        Swal.fire(this.props.notReadyMessage ?? "Not Ready", "", "info");
        return;
      }
    }
    console.log("hello world from category add button >>>>>>>... ");
    if (this.props.onConfirmPromise) {
      this.setState({ isSubmitting: true });
      let promise = this.props.onConfirmPromise(
        this.state.selectedSubCategories
      );
      promise
        .then(() => {
          this.setState({ isSubmitting: false });
          this.setState({ selectedSubCategories: [] });
          this.props.fetchProducts();
        })
        .finally(() => {
          this.setState({ isSubmitting: false });
        });
    }
  };

  render() {
    return (
      <div className={this.props.className + " d-inline-block"}>
        <ButtonGroup>
          <Button.Ripple
            disabled={this.props.disabled}
            outline={true}
            color="dark"
            onClick={this.onCategoryButtonClick}
          >
            {this.props.buttonIcon ?? <Folder size={14} />}
            <span className="ml-50">
              {this.props.buttonLabel ?? "Categories"}
            </span>
          </Button.Ripple>
        </ButtonGroup>
      </div>
    );
  }
}

class ManualConditionsComponent extends Component {
  state = {
    filters: {},
    operationalSubCategories: this.props.operationalSubCategories,
    isLoading: false,
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
              <div
                className={`${params.data.sub_categories.includes(this.props.category) && "product-tic"}`}
                style={{ width: "fit-content", height: "fit-content" }}
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
              </div>
              <span>{params.data.title}</span>
            </div>
          );
        },
      },
      {
        headerName:   `${
          this.props.translations?.quantity || "Quantity"
        }`,
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
          let display_value = <PriceDisplay amount={params.value} />
          if (
            params.data.has_multiple_variants &&
            params.data.sale_price_maximum &&
            params.data.sale_price_minimum &&
            params.data.sale_price_maximum !== params.data.sale_price_minimum
          ) {
            display_value = (
              <>
                <PriceDisplay amount={params.data.sale_price_minimum} /> {"-"}{" "}
                <PriceDisplay amount={params.data.sale_price_maximum} />
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
    console.log("hello world");
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
    if (!options) {
      queryParams =
        "?" +
        new URLSearchParams({ sub_categories: this.props.category }).toString();
    }
    let response = undefined;

    console.log(this.state.requestsCache[queryParams]);
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
    console.log(
      "hello world!  from bulk update category:----->",
      operation,
      data
    );
    this.setState({isLoading:true})
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
          history.push("/inventory/categories/list");
          Swal.fire("Products Updated", "", "success");
          this.gridApi.deselectAll();
          this.setState({ filters: {} });
        }
      })
      .catch((err) => {
        Swal.fire("Error !", err.message, "error");
        throw err;
      });
  };

  
  

  render() {
    const { filters, rowData, columnDefs, defaultColDef } = this.state;
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
                        fetchProducts={() => this.fetchProducts()}
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
                    {this.props.categoryId ? (
                      <>
                        <Col sm="12" md="auto">
                          <ManualActionCompoment
                            buttonIcon={<FolderPlus size={16} />}
                            buttonLabel="Add Category"
                            className="ml-sm-1"
                            disabled={!this.state.gridReady}
                            readyStateCheck={() =>
                              this.gridApi.getSelectedNodes().length > 0
                            }
                            notReadyMessage="Please select some products
                                              first!"
                            category={this.props.category}
                            onConfirmPromise={(subCategories) => {
                              return this.bulkUpdate(
                                "add-subcategories",
                                subCategories
                              );
                            }}
                            fetchProducts={() => this.fetchProducts()}
                          />
                        </Col>
                        <Col sm="12" md="auto">
                          <ManualActionCompoment
                            buttonIcon={<FolderPlus size={16} />}
                            buttonLabel="Remove Category"
                            className="ml-sm-1"
                            disabled={!this.state.gridReady}
                            readyStateCheck={() =>
                              this.gridApi.getSelectedNodes().length > 0
                            }
                            notReadyMessage="Please select some products
                                              first!"
                            category={this.props.category}
                            onConfirmPromise={(subCategories) => {
                              return this.bulkUpdate(
                                "remove-subcategories",
                                subCategories
                              );
                            }}
                            fetchProducts={() => this.fetchProducts()}
                          />
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
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
                      onSelectionChanged={(event) => this.props.onChange(event)}
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

const mapStatesToProps = (state) => {
  return {
    translations:state.auth?.userInfo?.profile?.translations
  }
}

export default connect(mapStatesToProps)(ManualConditionsComponent);
