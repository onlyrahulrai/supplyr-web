import { OrdersApi } from "api/endpoints";
import Swal from "components/utils/Swal";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, CardBody, Spinner } from "reactstrap";
import { getTwoDecimalDigit } from "utility/general";
import { history } from "../history";

const LoaderComponent = () => (
  <Card>
    <CardBody className="h-75 d-flex align-items-center justify-content-center">
      <Spinner />
    </CardBody>
  </Card>
);

const cartItemState = {
  id: null,
  product: null,
  variant: null,
  sgst: 0,
  igst: 0,
  cgst: 0,
  price: 0,
  extra_discount: 0,
  taxable_amount: 0,
  quantity: 0,
  item_note: "",
  set_focus: null,
};

const cartState = {
  id: null,
  isFormOpen: false,
  items: [],
  buyer: null,
  buyer_id: null,
  address: null,
  address_id: null,
  igst: 0,
  cgst: 0,
  sgst: 0,
  price:0,
  tax_amount:0,
  total_amount: 0,
  taxable_amount: 0,
  total_extra_discount: 0,
  product_price_includes_taxes:false,
};

const getExtraOptions = (items) => {
  const {
    price,
    taxable_amount,
    total_extra_discount,
    igst,
    cgst,
    sgst,
    tax_amount,
    total_amount
  } = items.map(
    ({
      price,
      extra_discount,
      taxable_amount,
      igst,
      cgst,
      sgst,
      quantity,
      ...rest
    }) => ({
      price: price * parseInt(quantity),
      taxable_amount,
      total_extra_discount:parseFloat(extra_discount),
      igst,
      cgst,
      sgst,
      tax_amount: (igst + cgst + sgst),
      total_amount: taxable_amount + (igst + cgst + sgst),
    })
  )
    .reduce(
      (sum, object) => {
        for (let [key, value] of Object.entries(object)) {
          sum[key] += value;
        }
        return sum;
      },
      {
        price: 0,
        taxable_amount: 0,
        total_extra_discount: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        tax_amount:0,
        total_amount:0
      }
    );

  return {
      price: getTwoDecimalDigit(price),
      taxable_amount: getTwoDecimalDigit(taxable_amount),
      total_extra_discount: getTwoDecimalDigit(total_extra_discount),
      igst: getTwoDecimalDigit(igst),
      cgst: getTwoDecimalDigit(cgst),
      sgst: getTwoDecimalDigit(sgst),
      tax_amount:getTwoDecimalDigit(tax_amount),
      total_amount:getTwoDecimalDigit(total_amount)
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ON_CLICK_TOGGLE_FORM":
      return {
        ...state,
        isFormOpen: !state.isFormOpen,
      };

    case "ON_ADD_ITEM_TO_CART": {
      const items =
        action.payload.set_focus !== null
          ? state.items.map((item, index) => {
              if (index === action.payload.set_focus) {
                return action.payload;
              }
              return item;
            })
          : [...state.items, action.payload];

      return {
        ...state,
        items: items,
        ...getExtraOptions(items),
        isFormOpen: false,
      };
    }
    case "ON_UPDATE_CART_ITEMS":
      return {
        ...state,
        items: action.payload,
        ...getExtraOptions(action.payload),
      };
    case "ON_REMOVE_ITEM_FROM_CART":
      const cartItems = state.items.filter(
        (item, index) => index !== action.payload
      );

      return {
        ...state,
        items: cartItems,
        ...getExtraOptions(cartItems),
      }
    case "ON_SELECT_BUYER":
    case "ON_UPDATE_ADDRESS":
      return {
        ...state,
        ...action.payload,
      };
    case "ON_LOAD_ORDER_DATA":
    case "ON_CREATE_BUYER":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const cartItemReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_PRODUCT":
    case "UPDATE_PRODUCT":
    case "ON_LOAD_ORDER_ITEM":
      return {
        ...state,
        ...action.payload,
      };
      
    case "RESET":
      return {
        ...state,
        ...cartItemState,
      };
    default:
      return state;
  }
};

const intialGSTOptions = {
  sgst: 0,
  igst: 0,
  cgst: 0,
  taxable_amount: 0,
};

export const OrderAddContext = createContext();

export const OrderAddProvider = ({ children }) => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [cart, dispatchCart] = useReducer(cartReducer, cartState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItem, dispatchCartItem] = useReducer(
    cartItemReducer,
    cartItemState
  );
  const { override_categories } = useSelector(
    (state) => state.auth.userInfo.profiling_data.categories_data
  );
  const { addresses: seller_address, default_gst_rate } = useSelector(
    (state) => state.auth.userInfo.profile
  );

  const [buyerSearchInput, setBuyerSearchInput] = useState("");
  const [isOpenBuyerCreateModal, setIsOpenBuyerCreateModal] = useState(false);
  const [isOpenBuyerAddressCreateModal, setIsOpenBuyerAddressCreateModal] =
    useState(false);
  const [buyer, setBuyer] = useState(null);

  const { product_price_includes_taxes: productPriceIncludesTaxes } =
    useSelector((state) => state.auth.userInfo.profile);

  const order_status_options = useSelector(
    (state) => state.auth.userInfo.profile.order_status_options
  );

  const isEditable = (status) =>
    order_status_options.find((option) => option.slug === status);

  useEffect(async () => {
    if (orderId) {
      setLoading(true);
      await OrdersApi.retrieve(orderId)
        .then((response) => {
          const data = response.data;

          if (!isEditable(data.order_status).editing_allowed) {
            history.push("/orders");
          }else if(data.is_paid){
            history.push(`/orders/${orderId}/`);
          }

          const {
            order_date,
            order_time,
            order_number,
            seller_name,
            order_status,
            created_by_user,
            created_by_entity,
            invoice,
            status_variable_values,
            items,
            igst,
            sgst,
            cgst,
            ...rest
          } = data;

          const cartItems = items.map(
            ({ product_variant: variant, ...rest }) => ({
              variant,
              ...rest,
            })
          );

          const sumOfTotalItemsPrice = items.map((item) => item.price * item.quantity).reduce((sum,value) => (sum + value),0)

          dispatchCart({
            type: "ON_LOAD_ORDER_DATA",
            payload: {
              ...rest,
              address_id: rest?.address?.id,
              items: cartItems,
              igst,
              sgst,
              cgst,
              price:sumOfTotalItemsPrice,
            },
          });

          setLoading(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: error.message,
          });
        });
    }
  }, [orderId]);

  const isSellerAndBuyerFromTheSameState = useMemo(() => {
    return seller_address?.state?.id === cart?.address?.state?.id;
  }, [seller_address, cart]);

  useEffect(() => {
    dispatchCart({type:"ON_LOAD_ORDER_DATA",payload:{product_price_includes_taxes:productPriceIncludesTaxes}})
  },[])

  const getGstRate = (price, percentage) =>
    productPriceIncludesTaxes
      ? price - (price * 100) / (percentage + 100)
      : (price * percentage) / 100;

  const getValidGstRate = (product, address = null) => {
    const sellerAndBuyerFromTheSameState = (address !== null)
      ? address
      : isSellerAndBuyerFromTheSameState;

    const override_category = override_categories
      .filter((option) =>
        product.variant?.product?.sub_categories.includes(option.category.id)
      )
      .sort(
        (option1, option2) =>
          option2.default_gst_rate - option1.default_gst_rate
      )
      .shift();

    const gstRate = override_category
      ? parseFloat(override_category?.default_gst_rate)
      : parseFloat(default_gst_rate);

    const price = product.extra_discount
      ? (product.price * product.quantity) - parseInt(product.extra_discount)
      : (product.price * product.quantity);

    let tax_amount = getTwoDecimalDigit(getGstRate(price, gstRate));


    let taxable_amount = productPriceIncludesTaxes ? getTwoDecimalDigit(price - tax_amount) : getTwoDecimalDigit(price)

    return sellerAndBuyerFromTheSameState
      ? {
          ...intialGSTOptions,
          taxable_amount,
          cgst: getTwoDecimalDigit(tax_amount / 2),
          sgst: getTwoDecimalDigit(tax_amount / 2),
        }
      : { ...intialGSTOptions, taxable_amount,igst: tax_amount };
  };

  const getVariantById = (id) => {
    return cartItem?.selectCartProduct?.has_multiple_variants
      ? cartItem?.selectCartProduct?.variants_data?.find(
          (variant) => variant.id === id
        )
      : cartItem?.selectCartProduct?.variants_data;
  };

  const getProductByVariantId = (id) => {
    return cart.items.find((item) => {
      return item.selectCartProduct.has_multiple_variants
        ? item.selectCartProduct.variants_data
            .map((variant) => variant.id)
            .includes(id)
        : item.selectCartProduct.variants_data.id === id;
    });
  };

  const getExtraDiscount = (price, discount) => {
    return discount.discount_type === "percentage"
      ? getTwoDecimalDigit(
          (parseFloat(price) * parseFloat(discount.discount_value)) / 100
        )
      : discount.discount_type === "amount"
      ? parseFloat(discount.discount_value)
      : 0;
  };

  const getValidAddress = (address) => ({
    ...address,
    state: address?.state?.name,
  });

  const getValidTaxableAmount = (taxes) => {
    return Object.values(taxes).reduce((sum, value) => sum + value, 0);
  };

  const value = {
    cart,
    isMenuOpen,
    isOpenBuyerCreateModal,
    isOpenBuyerAddressCreateModal,
    dispatchCart,
    cartItem,
    dispatchCartItem,
    loading,
    orderId,
    override_categories,
    seller_address,
    getValidGstRate,
    getVariantById,
    buyerSearchInput,
    setBuyerSearchInput,
    setIsMenuOpen,
    setIsOpenBuyerCreateModal,
    setIsOpenBuyerAddressCreateModal,

    buyer,
    setBuyer,
    getProductByVariantId,
    getExtraDiscount,
    getValidAddress,
    getValidTaxableAmount,
    getTwoDecimalDigit,
    productPriceIncludesTaxes,
    seller_address,
  };

  return (
    <OrderAddContext.Provider value={value}>
      {loading ? <LoaderComponent /> : children}
    </OrderAddContext.Provider>
  );
};

const useOrderAddContext = () => useContext(OrderAddContext);

export default useOrderAddContext;
