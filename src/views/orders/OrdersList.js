import { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  FormGroup,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";

import { X, Filter, Edit3, PlusCircle } from "react-feather";
import { history } from "../../history";
import "assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "assets/scss/pages/users.scss";
import { RiCheckLine, RiCheckDoubleLine, RiTruckLine } from "react-icons/ri";
import { connect } from "react-redux";
import Swal from "utility/sweetalert";
import CustomPagination from "components/common/CustomPagination";
import { OrdersApi } from "api/endpoints";
import Select from "react-select";
import { capitalizeString, priceFormatter } from "utility/general";
import apiClient from "api/base";
import PriceDisplay from "components/utils/PriceDisplay";

const orderStatusLabels = {
  awaiting_approval: "Awaiting Approval",
  cancelled: "Cancelled",
  approved: "Approved",
  delivered: "Delivered",
  dispatched: "Dispatched",
};

class OrdersList extends Component {

  isBulkOrderProcessingEnabled = false;
  
  isEditable = (status) => this.props.profile.order_status_options.find((option) => option.slug === status)
  state = {
    filters: {},
    filtersApplied: undefined,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    // requestsCache: {},
    gridReady: false,

    rowData: null,
    defaultColDef: {
      sortable: true,
    },
    columnDefs: [
      {
        headerName: "ID",
        field: "order_number",
        width: 150,
        // filter: true,

        checkboxSelection: this.isBulkOrderProcessingEnabled,     //enable these three if bulk actions to be enabled
        headerCheckboxSelectionFilteredOnly: this.isBulkOrderProcessingEnabled,
        headerCheckboxSelection: this.isBulkOrderProcessingEnabled,
        cellRendererFramework: (params) => {
          return (
            <div>
              <span>{params.value} </span>
              {
                this.isEditable(params?.data?.order_status).editing_allowed && (
                  <Edit3
                    size={20}
                    color="cadetblue"
                    title="Edit"
                    role="button"
                    className="pointer"
                    onClick={() => history.push(`orders/update/${params.value}`)}
                  />
                ) 
              }
              
            </div>
          );
        },
      },
      {
        headerName: "Buyer",
        field: "buyer_name",
        // filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() => history.push(`/orders/${params.data.id}`)}
            >
              <span>{params.value}</span>
            </div>
          );
        },
      },

      {
        headerName:"Items",
        field:"short_items_description",
        width:400,
        cellRendererFramework:(params) => {
          return (
            <span>{params.value}</span>
          )
        }
      },

      {
        headerName: "Total Amount",
        field: "total_amount",
        // filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return <div>
            <PriceDisplay amount={params.value} />
          </div>;
        },
      },

      {
        headerName: "Status",
        field: "order_status",
        // filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          // ["dispatched", "approved"].includes(params.value)
          const stock = params.value === "approved" ? (
            <div className="badge badge-pill badge-light-info">
              <b>{params.value}</b>
            </div>
          ) : params.value === "awaiting_approval" ? (
            <div className="badge badge-pill badge-light-secondary">
              <b>{params.value}</b>
            </div>
          ) : params.value === "delivered" ? (
            <div className="badge badge-pill badge-light-success">
              <b>{params.value}</b>
            </div>
          ) : params.value === "cancelled" ? (
            <div className="badge badge-pill badge-light-danger">
              <b>{params.value}</b>
            </div>
          ) : params.value === "dispatched" ? (
            <div className="badge badge-pill badge-light-warning">
              <b>{params.value}</b>
            </div>
          ): params.value === "processed" ? (
            <div className="badge badge-pill badge-light-primary">
              <b>{params.value}</b>
            </div>
          ): params.value === "returned" && (
            <div className="badge badge-pill badge-light-danger">
              <b>{params.value}</b>
            </div>
          ) ;
          return <div> {stock} </div>;
        },
      },
    ],
    modal: false,
    buyer: null,
    error:false,
    buyersData:[]
  };

  async fetchOrders(options) {
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
      this.setState({ isLoading: true });
      response = await OrdersApi.index(queryParams);
      response = response.data;

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
    } catch (e) {
      Swal.fire("Error !", "Unable to fetch orders", "error");
      console.log(e);
    }
  }

  async fetchBuyers(){
    let response = undefined
    try{
      this.setState({isLoading:true})
      response = await apiClient("/inventory/_seller-buyers/")
      response = response.data
      const buyersData = response.results
      this.setState({
        isLoading: false,
        buyersData:buyersData
      });
    }catch(error){
      Swal.fire("Error !", "Unable to fetch orders", "error");
      console.log(error);
    }
  }



  switchPage(pageNumber) {
    const options = { pageNumber };
    this.state.filtersApplied && (options.filters = this.state.filtersApplied);
    this.fetchOrders(options);
  }

  componentDidMount() {
    this.fetchOrders();
    this.fetchBuyers()
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
      this.fetchOrders({ filters: this.state.filters });
    }
  };

  clearFilters = () => {
    this.fetchOrders();
  };

  onBulkAction = (operation, data) => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    console.log("SN ", this.gridApi.getSelectedNodes());
    if (selectedNodes.length === 0) {
      Swal.fire("Please select some orders first", "", "info");
      return;
    }
    const order_ids = selectedNodes.map((node) => node.data.id);
    return OrdersApi.bulkUpdate({
      order_ids,
      operation,
      data,
    })
      .then((response) => {
        if (response.data?.success) {
          Swal.fire("Orders Updated", "", "success");
          this.fetchOrders(); //TODO: include filters, current page
          // this.gridApi.deselectAll()
        }
      })
      .catch((err) => {
        Swal.fire("Error !", err.message, "error");
        throw err;
      });
  };

  toggleModal = () => {
    this.setState((prevState) => ({ modal: !prevState.modal }));
  };

  buyerSelect = () => {
    if(!this.state.buyer){
      this.setState({error:true})
    }else{
      this.toggleModal()
      history.push(`/orders/${this.state.buyer.value}/add`)
    }
  }

  customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
      div: {
        overflow: "initial",
      },
    }),
  };

  render() {
    const { rowData, columnDefs, defaultColDef } = this.state;
    const { filters, filtersApplied } = this.state;
    return (
      <Row className="">
        <Col sm="12">
          <Card className="card-action card-reload">
            <CardBody>
              <Row className="align-items-center">
                <Col sm="12" md="auto">
                  <CardTitle className="pr-2 mr-1 border-right">
                    Filters
                  </CardTitle>
                </Col>
                <Col>
                  <Row>
                    <Col sm="8" md="3">
                      Order Status
                      <Select
                        options={[
                          "awaiting_approval",
                          "approved",
                          "dispatched",
                          "delivered",
                          "cancelled",
                        ].map((status) => ({
                          label: orderStatusLabels[status],
                          value: status,
                        }))}
                        onChange={(e) =>
                          this.setState({
                            filters: { ...filters, order_status: e.value },
                          })
                        }
                      />
                    </Col>
                    <Col
                      sm="4"
                      md="2"
                      className="ml-auto ml-md-0 mr-0 mr-md-auto align-self-end"
                    >
                      <Button.Ripple
                        color={this.isFiltersDataPresent ? "warning" : "light"}
                        onClick={this.onFilter}
                      >
                        Apply
                      </Button.Ripple>
                    </Col>
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
                        {filtersApplied.order_status && (
                          <>
                            <span>
                              {filtersApplied.search && ", "}Order Status:{" "}
                            </span>
                            <span className="text-gray">
                              {orderStatusLabels[filtersApplied.order_status] ??
                                filtersApplied.order_status}
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
                    {this.isBulkOrderProcessingEnabled &&
                    <Col lg="auto mr-auto">
                      <Button.Ripple
                        color="info"
                        className="mr-1"
                        onClick={(e) =>
                          this.onBulkAction("change_status", "approved")
                        }
                      >
                        <RiCheckLine size={16} style={{ marginRight: 10 }} />
                        Approve
                      </Button.Ripple>

                      <Button.Ripple
                        color="primary"
                        className="mr-1"
                        onClick={(e) =>
                          this.onBulkAction("change_status", "processed")
                        }
                      >
                        <RiCheckLine size={16} style={{ marginRight: 10 }} />
                        Mark Processed
                      </Button.Ripple>

                      <Button.Ripple
                        color="warning"
                        className="mr-1"
                        onClick={(e) =>
                          this.onBulkAction("change_status", "dispatched")
                        }
                      >
                        <RiTruckLine size={16} style={{ marginRight: 10 }} />
                        Mark Dispatched
                      </Button.Ripple>

                      <Button.Ripple
                        color="success"
                        className="mr-1"
                        onClick={(e) =>
                          this.onBulkAction("change_status", "delivered")
                        }
                      >
                        <RiCheckDoubleLine
                          size={16}
                          style={{ marginRight: 10 }}
                        />
                        Mark Delivered
                      </Button.Ripple>
                    </Col>
                    }
                    <Col lg="auto">
                      {/* Right aligned button */}
                      <Button color="primary" onClick={() => history.push('/orders/add')}>
                        <PlusCircle size="15" className="mr-1" /> New Order
                      </Button>

                      <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggleModal}
                        className="modal-dialog-centered"
                      >
                        <ModalHeader toggle={this.toggleModal}>
                          Select Buyer:
                        </ModalHeader>
                        <ModalBody>
                          <FormGroup>
                            <Select 
                              options={this.state.buyersData.map((result) => ({
                                value: result.buyer.id,
                                label: capitalizeString(result.buyer.name),
                                email:result.buyer.email,
                                business_name:capitalizeString(result.buyer.business_name),
                                mobile_number:result.buyer.mobile_number
                              }))}
                              formatOptionLabel={(props) => {
                                const { label, email,business_name,mobile_number } = props;

                                return (
                                  <div>
                                    <div>
                                      {label} {" "} ({business_name})
                                    </div>
                                    <div className="text-lightgray">
                                      <span>{mobile_number}</span> | <span>{email} </span>
                                    </div>
                                  </div>
                                )
                              }}
                              value={this.state.buyer}
                              onChange={(value) => this.setState({ buyer: value })}
                              styles={this.customStyles}
                            />
                            {this.state.error && (<small className="text-danger mt-1 text-sm">Please! select the buyer. This is required.</small>)}
                          </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            outline
                            onClick={this.buyerSelect}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </Modal>
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

const mapStateToProps = (state) => ({
  profile: state.auth.userInfo.profile,
});

export default connect(mapStateToProps)(OrdersList);
