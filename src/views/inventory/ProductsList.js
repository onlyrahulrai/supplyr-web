import { Component } from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";

import {
  X,
  Folder,
  Check,
  FolderPlus,
  FolderMinus,
  Filter,
  PlusCircle,
} from "react-feather";
import { history } from "../../history";
import "assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "assets/scss/pages/users.scss";
import apiClient from "api/base";
import { getApiURL } from "api/utils";
import ProductDummyImage from "assets/img/svg/cart.svg";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { connect } from "react-redux";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { SimpleInputField } from "components/forms/fields";
import { matchSorter } from "match-sorter";
import Swal from "utility/sweetalert";
import CustomPagination from "components/common/CustomPagination";
import PriceDisplay from "components/utils/PriceDisplay";
import { FiFilter } from "react-icons/fi";
import Select from "react-select";

const SortingOptions = [
  {label:"Title",value:"title"},
  {label:"Quantity (Low To High)",value:"quantity_all_variants"},
  {label:"Quantity (High To Low)",value:"-quantity_all_variants"},
  {label:"Price (Low To High)",value:"sale_price_maximum"},
  {label:"Price (High To Low)",value:"-sale_price_maximum"},
]


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

class UsersList extends Component {
  multiple_sign = (
    <>
      <RiCheckboxMultipleBlankLine
        className="ml-1"
        size={24}
        title="This product has multiple variants"
      />
    </>
  );
  state = {
    operationalSubCategories: this.props.profile.sub_categories,
    filters: {},
    filtersApplied: undefined,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    requestsCache: {},
    gridReady: false,
    rowData: null,
    // pageSize: 20,
    defaultColDef: {
      sortable: true,
    },
    columnDefs: [
      // {
      //   headerName: "ID",
      //   field: "id",
      //   width: 150,
      //   // filter: true,
      //   checkboxSelection: true,
      //   headerCheckboxSelectionFilteredOnly: true,
      //   headerCheckboxSelection: true,
      //   cellRendererFramework: (params) => {
      //     return (
      //       <div>
      //         <span>{params.value} </span>
      //         <Edit3
      //           size={20}
      //           color="cadetblue"
      //           title="Edit"
      //           role="button"
      //           className="pointer"
      //           onClick={(e) =>
      //             history.push("/product/" + params.data.slug + "/edit/")
      //           }
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: "Product Title",
        field: "title",
        // filter: true,
        width: 450,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
        cellRendererFramework: (params) => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() => history.push(`/products/${params.data.slug}/edit/`)}
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
              <span>
                {params?.data?.title.substr(0,48)}
              </span>
                {params?.data?.has_multiple_variants ? this?.multiple_sign : null}
            </div>
          );
        },
      },
      {
        headerName: `${
          this.props.profile?.user_settings?.translations?.quantity || "Quantity"
        }`,
        field: "quantity",
        // filter: true,
        width: 200,
        checkboxSelection: false,
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
          return (
            <div
              className="cursor-pointer"
              onClick={() => history.push(`/products/${params.data.slug}/edit/`)}
            >
              {stock}
            </div>
          );
        },
      },
      {
        headerName: "Sale Price",
        field: "price",
        checkboxSelection: false,
        // filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          // let display_value = priceFormatter(params.value);
          let display_value = <PriceDisplay amount={params.value} />;
          if (
            params.data.has_multiple_variants &&
            params.data.sale_price_maximum &&
            params.data.sale_price_minimum &&
            params.data.sale_price_maximum !== params.data.sale_price_minimum
          ) {
            display_value = (
              <>
                <PriceDisplay amount={params.data.sale_price_minimum} />
                {" - "} <PriceDisplay amount={params.data.sale_price_maximum} />
                {/* {priceFormatter(params.data.sale_price_minimum)} {"-"}{" "}
                {priceFormatter(params.data.sale_price_maximum)} */}
              </>
            );
          }
          return (
            <div
              className="cursor-pointer"
              onClick={() => history.push(`/products/${params.data.slug}/edit/`)}
            >
              {display_value}{" "}
              {/* {params.data.has_multiple_variants && this.multiple_sign} */}
            </div>
          );
        },
      },
      {
        headerName: "Variants",
        field: "variants_count",
        // filter: true,
        width: 150,
        checkboxSelection: false,
        cellRendererFramework: (params) => {
          // if (!params.data.has_multiple_variants) return "-";
          return (
            <span
              className="cursor-pointer"
              onClick={() => history.push(`/products/${params.data.slug}/edit/`)}
            >
              {!params.data.has_multiple_variants ? "-" : params.value}
            </span>
          );
        },
      },
    ],
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
    let response = undefined;
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
        totalPages
      },() => this.setState({
        isLoading: false,
        filtersApplied: filters,
      }));

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

  switchPage(pageNumber) {
    const options = { pageNumber };
    this.state.filtersApplied && (options.filters = this.state.filtersApplied);
    this.setState({
      currentPage:pageNumber
    },() => this.fetchProducts(options))
  }

  componentDidMount() {
    this.fetchProducts();
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setState({ gridReady: true });
  };

  get isFiltersDataPresent() {
    // Returns if filter fields like Search, SubCategory selector has already some data filled
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
      this.fetchProducts({ filters: this.state.filters });
    }
  };

  clearFilters = () => {
    this.setState({
      currentPage:1,
      filters:{}
    },() => this.fetchProducts())
  };

  bulkUpdate = (operation, data) => {
    console.log(
      "hello world!  from bulk update category:----->",
      operation,
      data
    );
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

  onChangeSortingInputField = (data) => {
    this.setState({
      filters:{...this.state.filters,order_by:data.value},
      currentPage:0,
    },() => this.onFilter())
  }
  render() {
    const { rowData, columnDefs, defaultColDef } = this.state;
    const { filters, filtersApplied,currentPage} = this.state;
    return (
      <Row className="">
        <Col sm="12">
          <Card className="card-action card-reload">
            <CardBody>
              <Row className="align-items-center">
                    <Col sm="6" md="auto">
                      <Input
                        className="mr-1 d-inline-block"
                        type="text"
                        placeholder="Filter Products"
                        onChange={(e) =>
                          this.setState({
                            filters: { ...filters, search: e.target.value },
                          })
                        }
                        value={filters.search ?? ""}
                        onKeyPress={(e) => e.charCode === 13 && this.onFilter()}
                      />
                    </Col>
                    <Col sm="6" className="d-sm-flex justify-content-sm-between" md="auto">
                      <SubcategorySelector
                        subCategories={this.state.operationalSubCategories}
                        buttonLabel="Categories"
                        buttonIcon={<Folder size={16} />}
                        modalTitle="Select Categories"
                        confirmButtonLabel="Done"
                        displayClearSelectionButton={true}
                        className=""
                        onConfirm={(subCategories) => {
                          this.setState({
                            filters: {
                              ...filters,
                              sub_categories: subCategories,
                            },
                          });
                        }}
                      />
                      <Button.Ripple
                        color={this.isFiltersDataPresent ? "warning" : "light"}
                        onClick={this.onFilter}
                        className="ml-md-1"
                      >
                        Apply Filters
                      </Button.Ripple>
                    </Col>
                </Row>
                <Row>
                  {filtersApplied && (
                    <Col sm="12" className="mt-1 primary">
                      <Filter size={18} />
                        <b> Filters Applied {">"} </b>
                        {filtersApplied.search && (
                          <>
                            <span>Search Query: </span>
                            <span className="text-gray">
                              {filtersApplied.search}
                            </span>
                          </>
                        )}
                        {
                          filtersApplied.order_by && (
                            <>
                              <span>{filtersApplied.search && ", "} Sort By: </span>
                              <span className="text-gray">
                                {SortingOptions.find((option) => option.value === filtersApplied.order_by).label ?? ""}
                              </span>
                            </>
                          )
                        }
                        {filtersApplied.sub_categories && (
                          <>
                            <span>
                              {(filtersApplied.search || filtersApplied.order_by ) && ", "}Sub Categories:{" "}
                            </span>
                            <span className="text-gray">
                              {filtersApplied.sub_categories
                                .map(
                                  (sc_id) =>
                                    this.state.operationalSubCategories.find(
                                      (sc) => sc.id === sc_id
                                    ).name
                                )
                                .limitedListFormat()}
                            </span>
                          </>
                        )}
                        <Button.Ripple
                          className="btn-icon rounded-circle ml-1 p-25"
                          title="Clear Filters"
                          color="light"
                          size="sm"
                          onClick={this.clearFilters}
                        >
                          <X />
                        </Button.Ripple>
                      </Col>
                    )}
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
                    <Col md={6} className="d-flex justify-content-sm-between justify-content-md-start" sm={12}>
                      <SubcategorySelector
                        subCategories={this.state.operationalSubCategories}
                        buttonLabel="Add to Categories"
                        buttonIcon={<FolderPlus size={16} />}
                        modalTitle="Add to Categories"
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

                      <SubcategorySelector
                        subCategories={this.state.operationalSubCategories}
                        buttonLabel="Remove from Categories"
                        buttonIcon={<FolderMinus size={16} />}
                        modalTitle="Remove from Categories"
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
                    <Col md={6} sm={12} className="d-flex justify-content-md-end justify-content-sm-between mt-sm-2 mt-md-0">
                    
                      <div  style={{width:"198px"}}>
                        <Select 
                          placeholder={
                            <div>
                              <FiFilter
                                size={14}
                                style={{
                                  left: 0
                                }}
                                className="mr-1"
                              />
                              Sort By
                            </div>}
                          options={SortingOptions}
                          value={SortingOptions.find((option) => option.value === this.state.filters?.order_by) ?? null}
                          onChange={this.onChangeSortingInputField}
                        />
                      </div>

                      <Button
                        color="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push("/products/add/");
                        }}
                        className="ml-2"
                        style={{ padding: "0.8rem 1rem" }}
                      >
                        <PlusCircle size="16"  />
                        <span className="d-sm-none d-md-inline-block ml-1">
                          Add New Product
                        </span>
                      </Button>
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
                      // onRowSelected={(e) => history.push(`/product/${e.data.slug}/edit/`)}
                      onRowClicked={(e) =>
                        history.push(`/products/${e.data.slug}/edit/`)
                      }
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
                initialPage={currentPage}
                onPageChange={(data) => this.switchPage(data.selected + 1)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.auth.userInfo.profile,
});

export default connect(mapStateToProps)(UsersList);
