import React, { createContext, useContext } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import apiClient from "api/base";
import { getTwoDecimalDigit } from "utility/general";
import { OrdersApi } from "api/endpoints";
import Swal from "components/utils/Swal";
import { withRouter } from "react-router-dom";
import ComponentSpinner from "components/@vuexy/spinner/Loading-spinner";

const OrderAddContext = createContext();

const initialCartItemState = {
  variant: null,
  product: null,
  quantity: 0,
  price: 0,
  item_note: "",
  extra_discount: 0,
  set_focus: null,
};

class OrderAddProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      buyer: null,
      address: null,
      extra_discount: 0,
      igst: 0,
      sgst: 0,
      cgst: 0,
      total_amount: 0,
      taxable_amount: 0,
      subTotal: 0,
      cartItem: initialCartItemState,
      isMenuOpen: false,
      isOpenBuyerCreateModal: false,
      buyerSearchInput: "",
      isOpenBuyerCreateModal: false,
      isOpenBuyerAddressCreateModal: false,
      isFormOpen: false,
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.orderId) {
      this.setState({ loading: true });

      OrdersApi.retrieve(this.props.match.params.orderId)
        .then((response) => {
          const {total_extra_discount,...rest} = response.data;

          if (!this.isEditable(rest.order_status).editing_allowed) {
            this.props.history.push(`/orders/${this.props.match.params.orderId}/`);
          } else if (rest.is_paid) {
            this.props.history.push(`/orders/${this.props.match.params.orderId}/`);
          }

          const subTotal = rest.items.reduce((previousItem,currentItem) => previousItem + (parseFloat(currentItem.price) * parseFloat(currentItem.quantity)) ,0)

          const items = rest.items.map(({product_variant,...rest}) => ({...rest,variant:product_variant}))

          this.setState({ ...rest,extra_discount:total_extra_discount,subTotal,items }, () => this.setState({ loading: false }));
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: error.message,
          });
        });
    }
  }

  isEditable = (status) =>
    this.props.user.profile.order_status_options.find(
      (option) => option.slug === status
    );

  onChangeStateByKeyValue = (key, value) =>
    this.setState(
      (prevState) => ({ ...prevState, [key]: value }),
      () => console.log(" State ", this.state)
    );

  onChangeBuyer = async (data) => {
    await apiClient
      .get(`profile/seller-contact-with-buyers-for-order/${data?.id}`)
      .then((response) => {
        const data = response.data;

        const address = data.address[0];

        this.setState({ isMenuOpen: false }, () =>
          this.setState(
            {
              address,
              buyer: data,
            },
            () => {
              const orderitems = this.state.items.map((item) => ({
                ...item,
                ...this.getProductExtraValues(item),
              }));

              this.setState({
                ...this.getCartExtraValues(orderitems),
                items: orderitems,
              });
            }
          )
        );
      })
      .catch((error) => {
        console.log(" Error Data ", error);
        toast.error("couldn't select the buyer...");
      });
  };

  getValidAddress = (address) => ({
    ...address,
    state: address?.state?.name,
  });

  getExtraDiscount = (price, discount) => {
    return discount?.discount_type == "percentage"
      ? (price * discount?.discount_value) / 100
      : discount?.discount_type == "amount"
      ? discount?.discount_value
      : 0;
  };

  getGstAmount = (price, default_gst_rate) => {
    console.log(" Price and Default GST Rate ", price, typeof default_gst_rate);
    return this.props.user.profile.product_price_includes_taxes
      ? price - (price * 100) / (default_gst_rate + 100)
      : (price * default_gst_rate) / 100;
  };

  getProductExtraValues = (item) => {
    const discountAssignedProduct = this.state.buyer?.product_discounts?.find(
      (discount) => discount.product.id === item?.product?.id
    );

    const price = parseFloat(item.price)

    const subTotal = price * parseInt(item.quantity);

    const genericDiscount = this.state.buyer?.generic_discount || {};

    const buyerDiscount = discountAssignedProduct
      ? discountAssignedProduct
      : genericDiscount;

    const extra_discount = item.extra_discount ? parseFloat(item.extra_discount) :  getTwoDecimalDigit(
      this.getExtraDiscount(price, buyerDiscount) * parseInt(item.quantity)
    )

    const priceAfterExtraDiscount = (subTotal - extra_discount);

    const subCategories = item?.variant?.product?.sub_categories;

    const gstAssignedCategory =
      this.props?.user?.profiling_data?.categories_data?.override_categories?.find(
        (overrideCategory) =>
          subCategories.includes(overrideCategory?.category?.id)
      );

    const defaultGstRate = gstAssignedCategory
      ? parseFloat(gstAssignedCategory?.default_gst_rate)
      : parseFloat(this.props.user.profile.default_gst_rate);

    const gstAmount = this.getGstAmount(
      priceAfterExtraDiscount,
      parseFloat(defaultGstRate)
    );

    console.log(" Extra Discount, Price After Extra Discount, GST Amount and Default gst rate ",extra_discount,priceAfterExtraDiscount,gstAmount,defaultGstRate)

    const taxable_amount = getTwoDecimalDigit(
      (this.props.user.profile.product_price_includes_taxes
        ? (priceAfterExtraDiscount - gstAmount)
        : priceAfterExtraDiscount)
    );

    const taxes =
      this.props.user.profile.addresses.state.id ===
      this.state?.address?.state?.id
        ? {
            cgst: getTwoDecimalDigit(gstAmount / 2),
            sgst: getTwoDecimalDigit(gstAmount / 2),
            igst: 0,
          }
        : { cgst: 0, sgst: 0, igst: getTwoDecimalDigit(gstAmount) };

    const total_amount = getTwoDecimalDigit(
      (taxable_amount + gstAmount)
    );

    return {
      taxable_amount,
      extra_discount,
      total_amount,
      subTotal,
      ...taxes,
    };
  };

  getCartExtraValues = (items) => {
    const extraValues = items.reduce(
      (previousItem, currentItem) => {
        let object = { ...previousItem };

        for (let key in currentItem) {
          if (
            [
              "subTotal",
              "price",
              "taxable_amount",
              "total_amount",
              "igst",
              "sgst",
              "cgst",
              "extra_discount",
            ].includes(key)
          ) {
            if (!object.hasOwnProperty(key)) {
              object[key] = 0;
            }

            object[key] += currentItem[key] 
          }
        }

        return object;
      },
      {
        price: 0,
        taxable_amount: 0,
        total_amount: 0,
        igst: 0,
        sgst: 0,
        cgst: 0,
        extra_discount: 0,
        subTotal:0,
      }
    );

    return {
      igst: getTwoDecimalDigit(extraValues.igst),
      cgst: getTwoDecimalDigit(extraValues.cgst),
      sgst: getTwoDecimalDigit(extraValues.sgst),
      extra_discount: getTwoDecimalDigit(extraValues.extra_discount),
      taxable_amount: getTwoDecimalDigit(extraValues.taxable_amount),
      total_amount: getTwoDecimalDigit(extraValues.total_amount),
      subTotal: extraValues.subTotal,
      isFormOpen: false,
    };
  };

  onChangeBuyerAddress = (address, callback) => {
    this.setState({ address }, () => {
      this.setState((prevState) => {
        const orderitems = prevState.items.map((item) => ({
          ...item,
          ...this.getProductExtraValues(item),
        }));
        return { ...prevState, ...this.getCartExtraValues(orderitems) };
      }, callback);
    });
  };

  onAddProductToCart = (cartitem, callback) => {
    console.log(" Cart Item ",cartitem)

    const items =
      (cartitem.set_focus !== null)
        ? this.state.items.map((item, index) => {
            if (index === cartitem.set_focus) {
              return { ...cartitem,...this.getProductExtraValues(cartitem) ,set_focus: false };
            }
            return item;
          })
        : [...this.state.items, {...cartitem,...this.getProductExtraValues(cartitem)}];

    this.setState({ items }, () =>
      this.setState({ ...this.getCartExtraValues(items) }, callback)
    );
  };

  onChangeInItemsValue = (items) => {
    this.setState({ items }, () =>
      this.setState((prevState) => this.getCartExtraValues(prevState.items))
    );
  };

  onUpdateBuyer = (data, callback) => {
    const address = data.address[0];
    this.setState({ buyer: data, address }, () => {
      const items = this.state.items.map((item) => ({
        ...item,
        ...this.getProductExtraValues(item),
      }));
      this.setState({ ...this.getCartExtraValues(items), items }, callback);
    });
  };

  setCartItem = (data) => {
    this.setState({ cartItem: { ...this.state.cartItem, ...data } });
  };

  onClickUpdateProduct = async (id, data, position) => {
    await apiClient(`orders/product/${id}`)
      .then((response) => {
        const responseData = {
          ...data,
          set_focus: position,
          product: response.data,
        };

        this.setCartItem(responseData);
      })
      .catch((error) => console.log(" ----- Error ----- ", error));
  };

  onFormClose = () => {
    this.setState({ isFormOpen: false }, () =>
      this.setState({ cartItem: initialCartItemState })
    );
  };

  onRemoveItemFromCart = (id) => {
    console.log(" Id and items ",id,this.state.items)
    const items = this.state.items.filter((item,index) => index !== id);

    this.setState({ items, ...this.getCartExtraValues(items) });
  };

  render() {
    return (
      <OrderAddContext.Provider
        value={{
          ...this.state,
          onChangeStateByKeyValue: this.onChangeStateByKeyValue,
          onChangeCartByKeyValue: this.onChangeCartByKeyValue,
          onChangeBuyer: this.onChangeBuyer,
          getValidAddress: this.getValidAddress,
          getProductExtraValues: this.getProductExtraValues,
          onAddProductToCart: this.onAddProductToCart,
          onUpdateBuyer: this.onUpdateBuyer,
          onChangeInItemsValue: this.onChangeInItemsValue,
          onChangeBuyerAddress: this.onChangeBuyerAddress,
          setCartItem: this.setCartItem,
          onFormClose: this.onFormClose,
          onRemoveItemFromCart: this.onRemoveItemFromCart,
          product_price_includes_taxes:this.props.user.profile.product_price_includes_taxes
        }}
      >
        {this.state.loading ? <ComponentSpinner /> : this.props.children}
      </OrderAddContext.Provider>
    );
  }
}

const OrderAddContextConsumer = OrderAddContext.Consumer;

const useOrderAddContext = () => useContext(OrderAddContext);

export { useOrderAddContext, OrderAddContextConsumer };

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
  };
};

export default connect(mapStateToProps)(withRouter(OrderAddProvider));
