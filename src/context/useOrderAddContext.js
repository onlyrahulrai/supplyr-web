import apiClient from "api/base";
import { OrdersApi } from "api/endpoints";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {history} from "../history"
const Swal = withReactContent(_Swal);

const OrderAddContext = createContext();

const intialGSTOptions = {
  sgst:0,
  igst:0,
  cgst:0
}

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
  const order_status_options = useSelector((state) => state.auth.userInfo.profile.order_status_options)
  const [orderData,setOrderData] = useState({})

  const {profile:{default_gst_rate,addresses:seller_addresses},profiling_data:{categories_data:{override_categories:override_categories}}} = useSelector((state) => state.auth.userInfo)

  const getAddressWithStateName = useMemo(() => {
    return {...orderInfo?.address,state:orderInfo?.address?.state?.name}
  },[orderInfo])

  const isSellerAndBuyerFromTheSameState = useMemo(() => {
    return seller_addresses?.state?.id === orderInfo?.address?.state?.id
  },[seller_addresses,orderInfo])

  // Getting the Valid Gst Rate according to the product categories added. When categories added to product is overrided for gst rate than we keep taking the category whose gst rate is higher. 
  const getValidGstRate = (sub_categories) => {

    const override_category = override_categories.filter((option) => sub_categories.includes(option.category.id)).sort((option1,option2) => option2.default_gst_rate - option1.default_gst_rate).shift()

    return override_category ? parseFloat(override_category?.default_gst_rate) : parseFloat(default_gst_rate)
  }

  const calculateGstRate = (gstRate) => {
    if(isSellerAndBuyerFromTheSameState){
      return {...intialGSTOptions,cgst:(gstRate/2),sgst:(gstRate/2)} 
    }
    return {...intialGSTOptions,igst:gstRate}
  }

  const isEditable = (status) => order_status_options.find((option) => option.slug === status);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      OrdersApi.retrieve(orderId)
        .then((response) => {
          const data = response.data;

          setOrderData(data)
          if (
            !isEditable(data.order_status).editing_allowed
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

  const onChangeSelectedProduct = (data) => {
    setSelectedProduct(data);
  };

  const getTotalOfProducts = useMemo(() => {
    const totalPrice = products.reduce(
      (total, value) =>
        (parseFloat(total) + (parseFloat(value.price)) *
        parseFloat(value.quantity)),
      0
    );
    return totalPrice.toFixed(2)
  },[products])

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

    const totalTaxableAmount = parseFloat((parseFloat(product.price) * Object.values(calculateGstRate(getValidGstRate(product.variant.product.sub_categories))).reduce((sum,value) => sum + value,0))/100)

    const _product = {...product,taxable_amount:totalTaxableAmount * parseFloat(product.quantity)}

    if (!selectedProduct.set_focus) {
      _products.push({..._product,extra_discount:extra_discount});
    } else {
      const { set_focus, ...rest } = selectedProduct;
      const position = getProductIndexById(set_focus);

      _products[position] = { ..._product,extra_discount:extra_discount};
    }

    setProduct({});
    setSelectedProduct({});
    setProducts([..._products]);
  };

  const onRemoveProductToCart = (id) => {
    const _products = products.filter((product) => product?.variant?.id !== id);
    setProducts(_products);
  };

  const sumOfObjectValue = (object) => {
    return Object.values(object).reduce((sum,value) => sum + parseFloat(value),0)
  }

  const totalTaxAmount = useMemo(() => {
    return parseFloat(products.map(({taxable_amount,...rest}) => parseFloat(taxable_amount)).reduce((sum,value)=> sum + value  ,0).toFixed(2))
  },[products])

  const totalIGST = useMemo(() => {
    return products.map(({igst,quantity,...rest}) => parseFloat(igst) * parseFloat(quantity)).reduce((sum,value) => sum + value,0)
  },[products])

  const totalCGST = useMemo(() => {
    return products.map(({cgst,quantity,...rest}) => parseFloat(cgst) * parseFloat(quantity)).reduce((sum,value) => sum + value,0)
  },[products])

  const totalSGST = useMemo(() => {
    return products.map(({sgst,quantity,...rest}) => parseFloat(sgst) * parseFloat(quantity)).reduce((sum,value) => sum + value,0)
  },[products])

  const value = {
    orderData,
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
    setIsBuyerLoaded,

    getValidGstRate,
    isSellerAndBuyerFromTheSameState,
    getAddressWithStateName,
    calculateGstRate,

    totalTaxAmount,
    totalIGST,
    totalCGST,
    totalSGST,
    sumOfObjectValue
  };
  return (
    <OrderAddContext.Provider value={value}>
      {loading ? <Spinner /> : children}
    </OrderAddContext.Provider>
  );
};

const useOrderAddContext = () => useContext(OrderAddContext);

export default useOrderAddContext;
