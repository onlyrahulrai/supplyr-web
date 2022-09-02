import apiClient from "api/base";
import { OrdersApi } from "api/endpoints";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {history} from "../history"
const Swal = withReactContent(_Swal);

const OrderAddContext = createContext();

export const OrderAddProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState({});
  const [buyer, setBuyer] = useState(null);
  const [orderInfo, setOrderInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const [isOpenBuyerCreateModal, setIsOpenBuyerCreateModal] = useState(false);
  const [isOpenBuyerAddressCreateModal, setIsOpenBuyerAddressCreateModal] =
    useState(false);
  const [buyerSearchInput,setBuyerSearchInput] = useState('');
  const [isMenuOpen,setIsMenuOpen] = useState(false)
  const [isBuyerLoaded,setIsBuyerLoaded] = useState(false)

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      OrdersApi.retrieve(orderId)
        .then((response) => {
          const data = response.data;
          if (
            ["processed", "cancelled", "dispatched", "delivered"].includes(
              data.order_status
            )
          ) {
            history.push("/orders");
          }
          const variants = data.items.map(
            ({ product_variant, price, actual_price, ...rest }) => ({
              variant: product_variant,
              price: parseFloat(price),
              actual_price: parseFloat(actual_price),
              ...rest,
            })
          );
          setProducts(variants);

          setOrderInfo((prevState) => ({
            ...prevState,
            total_extra_discount: data.total_extra_discount,
            order_status: data.order_status,
          }));

          return apiClient.get(`/inventory/seller-buyers/${data.buyer_id}`);
        })
        .then((response) => {
          onChangeOrderInfo({
            address: response.data?.address[0],
            buyer_id: response.data?.id,
          });
          setBuyer(response.data);
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

  useEffect(() => {
    if(buyer){
      const getExtraDiscount = (price, discount) => {
        return discount.discount_type === "percentage"
          ? (parseFloat(price) * parseFloat(discount.discount_value)) / 100
          : discount.discount_type === "amount" ? parseFloat(discount.discount_value) : 0;
      };
      
      setProducts((products) => products.map((product) => {
        const discount = buyer.product_discounts.find((discount) => discount.product.id === product.variant.product.id)
        if(discount){
            return {...product,extra_discount:getExtraDiscount(product.price,discount)}
        }
        return {...product,extra_discount:0};
      }))
    }
  },[buyer])

  const onChangeSelectedProduct = (data) => {
    setSelectedProduct(data);
  };

  const getTotalOfProducts = () => {
    return products.reduce(
      (total, value) =>
        (parseFloat(total) + parseFloat(value.price)) *
        parseFloat(value.quantity),
      0
    );
  };

  const getTotalExtraDiscount = useMemo(
    () => {
      const productsDiscount = products.map((product) =>
          parseFloat(product.extra_discount !== '' ? product.extra_discount : 0) * parseFloat(product.quantity)
      ).reduce((total, value) => (total += value), 0);

      let genericDiscount = 0;
      if(buyer?.generic_discount && productsDiscount === 0){
        genericDiscount = buyer?.generic_discount?.discount_type === "percentage" ? (getTotalOfProducts() * parseFloat(buyer?.generic_discount?.discount_value)) / 100 : buyer?.generic_discount?.discount_value;
      }

      return Math.max(productsDiscount,genericDiscount)
    },
    [products]
  );

  const onChangeProduct = (data) => setProduct({ ...product, ...data });

  const onChangeOrderInfo = (data) =>
    setOrderInfo((prevState) => ({ ...prevState, ...data }));

  const getProductIndexById = (id) =>
    products.findIndex((product) => product?.variant?.id === id);

  const calculateExtraDiscount = (variant,offer) => {
    let discount = 0;

    if(offer?.discount_type === "percentage"){
      discount = (variant?.price * parseFloat(offer?.discount_value)) / 100;
    }else{
      discount = parseFloat(offer.discount_value)
    }
    return discount
  }
  
  const onAddProductToCart = () => {
    let _products = [...products];

    const discount = buyer?.product_discounts?.find((discount) => discount?.product.id === selectedProduct?.id)
    
    const extra_discount = discount ? Math.min(calculateExtraDiscount(product?.variant,discount),Math.max(product.extra_discount,calculateExtraDiscount(product?.variant,discount))) : product.extra_discount;

    if (!selectedProduct.set_focus) {
      _products.push({...product,extra_discount:extra_discount});
    } else {
      const { set_focus, ...rest } = selectedProduct;
      const position = getProductIndexById(set_focus);

      _products[position] = { ...product,extra_discount:extra_discount};
    }

    setProduct({});
    setSelectedProduct({});
    setProducts([..._products]);
  };

  const onRemoveProductToCart = (id) => {
    const _products = products.filter((product) => product?.variant?.id !== id);
    setProducts(_products);
  };

  const value = {
    products,
    orderId: 1,
    onAddProductToCart,
    onRemoveProductToCart,

    product,
    onChangeProduct,
    setProduct,
    setProducts,
    selectedProduct,
    onChangeSelectedProduct,
    getTotalOfProducts,
    getTotalExtraDiscount,

    orderInfo,
    orderId,
    onChangeOrderInfo,
    setOrderInfo,

    buyer,
    setBuyer,
    getProductIndexById,

    // Buyer creation modal states start
    isOpenBuyerCreateModal,
    setIsOpenBuyerCreateModal,
    isOpenBuyerAddressCreateModal,
    setIsOpenBuyerAddressCreateModal,
    // Buyer creation modal states End
    buyerSearchInput,
    setBuyerSearchInput,
    isMenuOpen,
    setIsMenuOpen,
    isBuyerLoaded,
    setIsBuyerLoaded
  };
  return (
    <OrderAddContext.Provider value={value}>
      {loading ? <Spinner /> : children}
    </OrderAddContext.Provider>
  );
};

const useOrderAddContext = () => useContext(OrderAddContext);

export default useOrderAddContext;
