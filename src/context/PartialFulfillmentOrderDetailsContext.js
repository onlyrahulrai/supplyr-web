import apiClient from "api/base";
import { OrdersApi } from "api/endpoints";
import { getMediaURL } from "api/utils";
import { orderStatuses } from "assets/data/Rulesdata";
import ComponentSpinner from "components/@vuexy/spinner/Loading-spinner";
import React, { Component, createContext } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { capitalizeString } from "utility/general";
import Swal from "utility/sweetalert";

export const PartialFulfillmentOrderDetailsContext = createContext();

class PartialFulfillmentOrderDetailsProvider extends Component {
  constructor(props) {
    super(props);

    const { order_status_variables, order_status_options } = this.props;

    this.state = {
      items: [],
      groups: [],
      partialOrderitemsIds: [],
      loading: false,
      error: null,
      toggleOrderStatusVariableDataModal: false,
      selectedOrderStatusVariable: null,
      isPartialFulfillmentEnabled: false,
      isStateVariableModalOpen: false,
      order_status_options,
      order_status_variables,
      isGeneratingInvoice:false
    };
  }

  fetchOrderData = async () => {
    await OrdersApi.retrieve(this.props.match.params.orderId)
      .then((response) => {
        this.setState({
          ...response.data,
          groups: this.getItemsByGroup(response.data.items),
          isPartialFulfillmentEnabled: !this.isGlobalFulfillment(
            response.data.items
          ),
        });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.fetchOrderData();
  }

  onUpdateState = (data) => this.setState(data);

  isGlobalFulfillment = (items) => {
    return (
      this.getUniqueItems(items.map((item) => this.itemStatus(item))).length ===
      1
    );
  };

  isOrderEditable = () => {
    return !this.state.items.some((item) => item.order_group)
  }

  isAllowedToGenerateInvoice = () => {
    return this.isGlobalFulfillment(this.state.items) && !this.state.order_status_options.find((option) => option.slug === this.state.order_status).editing_allowed && !['returned','cancelled'].includes(this.state.order_status)
  }

  onSelectAllProducts = (products, callback) => {
    let _ids;

    const ids = products.map((product) => product.id);

    const action = ids.every((id) =>
      this.state.partialOrderitemsIds.includes(id)
    );

    if (action) {
      _ids = this.state.partialOrderitemsIds.filter((id) => !ids.includes(id));
    } else {
      _ids = [...new Set([...this.state.partialOrderitemsIds, ...ids])];
    }

    this.setState({ partialOrderitemsIds: _ids }, callback);
  };

  onSelectProduct = (id, callback) => {
    const action = this.state.partialOrderitemsIds.includes(id);

    let _ids;

    if (action) {
      _ids = this.state.partialOrderitemsIds.filter((_id) => _id !== id);
    } else {
      _ids = [...this.state.partialOrderitemsIds, id];
    }

    this.setState({ partialOrderitemsIds: _ids }, callback);
  };

  getUniqueItems = (items) => {
    return [...new Set(items)];
  };

  itemStatus = (item) => {
    return item.order_group ? item.order_group.status : item.status;
  };

  getButtonStatusesForOrderAction = (orderitems) => {
    const items = orderitems?.filter((item) =>
      this.state.partialOrderitemsIds.length
        ? this.state.partialOrderitemsIds.includes(item.id)
        : true
    );

    return this.getUniqueItems(
      this.state.order_status_options
        .filter((option) =>
          this.getUniqueItems(
            items.map((item) => this.itemStatus(item))
          ).includes(option.slug)
        )
        .map((option) => option.transitions_possible)
        .reduce((prev, curr) => prev.concat(curr), [])
    ).sort(
      (option1, option2) =>
        orderStatuses.indexOf(option1) - orderStatuses.indexOf(option2)
    );
  };

  getItemsByGroup = (items) => {
    return Object.entries(
      items.reduce((acc, { order_group, status, ...rest }) => {
        const grouping = order_group !== null ? order_group.id : 0;

        if (!acc[grouping]) {
          acc[grouping] = {
            products: [],
            invoice: null,
            order_group: null,
            status: "",
          };
        }

        acc[grouping]["products"].push({ status, order_group, ...rest });
        acc[grouping]["order_group"] = order_group;
        acc[grouping]["status"] = !order_group ? status : order_group.status;
        return acc;
      }, {})
    ).map(([label, options], index) => ({
      id: index,
      label,
      ...options,
    }));
  };

  getSelectedGroupProductsSize = (products) => {
    const product_ids = products.map((product) => product.id);

    const ids = this.state.partialOrderitemsIds.filter((id) =>
      product_ids.includes(id)
    );

    return ids.length > 0 ? ids.length : 0;
  };

  getWarningMessage = (statuses) => {
    if (statuses.length === 1) {
      return `${statuses[0]}.`;
    } else if (statuses.length === 2) {
      return [
        `${statuses[statuses.length - 2]} and ${
          statuses[statuses.length - 1]
        }.`,
      ];
    } else {
      return (
        statuses.slice(0, statuses.length - 2).join(", ") +
        ", " +
        statuses.slice(statuses.length - 2).join(" and ") +
        "."
      );
    }
  };

  getPrevStatus = (status) => {
    const statusIndex = orderStatuses.indexOf(status);
    return orderStatuses.find((status, index) => index === statusIndex - 1);
  };

  getItemsActionPosibilities = (status) => {
    return this.state.order_status_options
      .filter((option) => option.transitions_possible.includes(status))
      .map((option) => option.slug);
  };

  getValidProductIds = (products, status) => {
    let ids;

    if (this.state.isPartialFulfillmentEnabled) {
      if (!this.state.partialOrderitemsIds.length) {
        return {
          html: (
            <div>
              <h5>Warning ! No items selected</h5>
              <span>Please select some items to mark as {status}</span>
            </div>
          ),
        };
      } else {
        const _products = products.filter((product) =>
          this.state.partialOrderitemsIds.includes(product.id)
        );

        console.log(" Products  ",_products)

        const isValidProducts = _products.every((product) =>
          this.getItemsActionPosibilities(status).includes(
            this.itemStatus(product)
          )
        );
        console.log(" Is Valid Products ",isValidProducts)

        if (isValidProducts) {
          ids = this.state.items
            .filter((product) =>
              this.state.partialOrderitemsIds.includes(product.id)
            )
            .map((item) => item.id);

          if (!ids.length) {
            return {
              title: "Warning",
              text: "No items are selected from this group",
            };
          }
        } else {
          const __products = products.filter((product) =>
            this.state.partialOrderitemsIds.includes(product.id)
          );

          const statuses = this.getUniqueItems(
            __products.map((product) => this.itemStatus(product))
          )
            .filter((item_status) => item_status !== this.getPrevStatus(status))
            .sort((a, b) => orderStatuses.indexOf(a) - orderStatuses.indexOf(b))
            .map((status) => capitalizeString(status.replace("_", " ")));

          return {
            html: (
              <div>
                <h5 style={{ lineHeight: 1.7 }}>
                  {statuses.length > 1 ? "Statuses" : "Status"} of some selected
                  items are{" "}
                  <mark style={{ backgroundColor: "yellow" }}>
                    {this.getWarningMessage(statuses)}
                  </mark>
                  which can not be marked as {status}.
                </h5>
                <span>Please unselect these items to proceed.</span>
              </div>
            ),
          };
        }
      }
    } else {
      ids = products
        .filter((product) =>
          this.getItemsActionPosibilities(status).includes(
            this.itemStatus(product)
          )
        )
        .map((product) => product.id);
    }

    return ids;
  };

  onAction = async (operation, data) => {
    await apiClient
      .post(
        `/orders/bulk-update-orderitems/${this.props.match.params.orderId}/`,
        {
          operation,
          data,
        }
      )
      .then((response) => {
        this.fetchOrderData();

        const items = this.state.items.filter((item) =>
          data?.order_ids.includes(item.id)
        );

        const partialOrderitemsIds = this.state.partialOrderitemsIds.filter((id) => !data.order_ids.includes(id))

        this.setState({ isStateVariableModalOpen: false,partialOrderitemsIds });

        Swal.fire({
          icon: "success",
          title: `${data?.order_ids.length >= 2 ? "Items" : "Item"} Updated!`,
          html: (
            <ol style={{ textAlign: "left", listStyleType: "none" }}>
              {items.map((item, index) => (
                <li key={index}>
                  <span style={{ fontSize: "12px" }}>
                    {items.length > 1
                      ? `${item.product_variant.product.title.substr(0, 55)}...`
                      : item.product_variant.product.title}
                  </span>
                </li>
              ))}
            </ol>
          ),
        });
      })
      .catch((error) => {
        Swal.fire("Error !", error.message, "error");
      });
  };

  performItemsStatusChange = (ids, _nextStatus, variables) => {
    if (!variables) {
      this.onAction("change_status", {
        status: _nextStatus,
        order_ids: ids,
      });
    } else {
      this.onAction("change_status_with_variables", {
        status: _nextStatus,
        order_ids: ids,
        variables,
      });
    }
  };

  onChangeProductStatuses = (ids, _nextStatus, variables) => {
    const currentStatusAction = this.state.order_status_options.find(
      (option) => option.slug === _nextStatus
    );

    if (currentStatusAction?.confirmation_needed) {
      Swal.fire({
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        title: "Are you sure?",
        text: `Do you want to change status of this order to ${_nextStatus}?`,
        confirmButtonText: `Mark ${currentStatusAction?.name}`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.performItemsStatusChange(ids, _nextStatus, variables);
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        title: "Are you sure?",
        text: `Do you want to change ${
          this.state.partialOrderitemsIds.length <= 0 ? "all" : ""
        } order items status to ${_nextStatus}?`,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          this.performItemsStatusChange(ids, _nextStatus, variables);
        } else if (result.isDenied) {
          console.log("Order and Orderitem not updated!");
        }
      });
    }
  };

  onClickFulfillmentButton = (products, status) => {
    const nextStatusVariables = this.props.order_status_variables[status];

    const _ids = this.getValidProductIds(products, status);

    if (Array.isArray(_ids)) {
      if (nextStatusVariables) {
        console.log(" Status Variable To Enter ", status);

        this.setState({
          orderStatusUpdateByStatus: status,
          isStateVariableModalOpen: true,
        });
      } else {
        this.onChangeProductStatuses(_ids, status);
      }
    } else {
      if (_ids) {
        Swal.fire({
          ..._ids,
          icon: "warning",
        });
      }
    }
  };

  getItemsStatusesForSidebar = (items) => {
    return this.getUniqueItems(items.map((item) => this.itemStatus(item)));
  };

  getItemTitleSubstrById = (id) => {
    return `${this.state?.items
      .find((item) => item.id === id)
      ?.product_variant?.product?.title.substr(0, 56)}...`;
  };

  onClickToGenerateInvoice = async (group=null) => {
    this.setState({isGeneratingInvoice:true})
    let data = {
      order:this.props.match.params.orderId,
      order_group:group ? group : null
    }
    await apiClient.post("/orders/generate-invoice/",data)
    .then((response) => {
      this.setState({isGeneratingInvoice:false})
      this.fetchOrderData();
      // history.push(`/orders/${orderId}/invoice/${response.data.id}`)
      window.open(getMediaURL(response.data.invoice_pdf))
    })
    .catch((error) => {
      console.log(" Error ",error)
      Swal.fire({
        icon:"error",
        title:"Error",
        text:" Failed to generate invoice."
      })
    })
  }

  render() {
    console.log(" State ",this.state)
    return (
      <PartialFulfillmentOrderDetailsContext.Provider
        value={{
          ...this.state,
          onUpdateState: this.onUpdateState,
          getButtonStatusesForOrderAction: this.getButtonStatusesForOrderAction,
          itemStatus: this.itemStatus,
          isGlobalFulfillment: this.isGlobalFulfillment,
          onSelectAllProducts: this.onSelectAllProducts,
          onSelectProduct: this.onSelectProduct,
          getSelectedGroupProductsSize: this.getSelectedGroupProductsSize,
          onClickFulfillmentButton: this.onClickFulfillmentButton,
          onChangeProductStatuses: this.onChangeProductStatuses,
          getItemsStatusesForSidebar: this.getItemsStatusesForSidebar,
          getItemTitleSubstrById: this.getItemTitleSubstrById,
          isOrderEditable:this.isOrderEditable,
          isAllowedToGenerateInvoice:this.isAllowedToGenerateInvoice(),
          onClickToGenerateInvoice:this.onClickToGenerateInvoice,
          fetchOrderData:this.fetchOrderData
        }}
      >
        {this.state.loading ? <ComponentSpinner /> : this.props.children}
      </PartialFulfillmentOrderDetailsContext.Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  order_status_variables: state.auth.userInfo.profile.order_status_variables,
  order_status_options: state.auth.userInfo.profile.order_status_options,
  product_price_includes_taxes:
    state.auth.userInfo.profile.product_price_includes_taxes,
  invoice_options: state.auth.userInfo.profile.invoice_options,
});

export default connect(mapStateToProps)(
  withRouter(PartialFulfillmentOrderDetailsProvider)
);
