import apiClient from "api/base";
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import NetworkError from "components/common/NetworkError";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import { priceFormatter } from "utility/general";
import { history } from "../../history";
import { getApiURL } from "api/utils";
import SidebarComponent from "components/orders/SidebarComponent";
import AddProductVariant from "components/orders/AddProductVariant";
import _Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";
import { OrdersApi } from "api/endpoints";

const Swal = withReactContent(_Swal);

const OrderAdd = (props) => {
  const buyerSlug = props.match.params.buyerId;
  const orderId = props.match.params.orderId;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantsData, setVariantsData] = useState([]);
  const [selectedProductList, setSelectedProductList] = useState([]);

  const [buyerData, setBuyerData] = useState(null);
  const [orderItemInfo, setOrderItemInfo] = useState({});
  const [variantData, setVariantData] = useState({});

  const [productForm, setProductForm] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const setOrderItemInfoField = (field, value) => {
    const orderItemInfoFieldCopy = { ...orderItemInfo };
    orderItemInfoFieldCopy[field] = value;
    setOrderItemInfo(orderItemInfoFieldCopy);
  };

  useEffect(() => {
    if (selectedProduct) {
      apiClient
        .get(`/inventory/product/${selectedProduct.value}`)
        .then((response) => {
          let _response = response.data;
          if (response.status >= 200 && response.status < 299) {
            if (_response.variants_data.multiple) {
              console.log("hello world");
            } else {
              // setItems((prevState) => ([...prevState,{
              // price: "229.00",
              // actual_price: "249.00",product_variant:{}}]))
              console.log("response variants data >>>> ", _response);
              setSelectedVariant(_response.variants_data.data.id);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (buyerSlug) {
      apiClient
        .get(`/inventory/sellers-buyer-detail/${buyerSlug}`)
        .then((response) => {
          let _response = response.data;
          console.log("buyer data >> ");
          setBuyerData(_response);
          setOrderItemInfo((prevState) => ({
            ...prevState,
            address: _response.address[0].id,
            buyer: _response.id,
          }));
          // setOrderItemInfoField("address",_response.address[0].id)
        })
        .catch((error) => {
          console.log(error.response);
          setLoadingError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [buyerSlug]);

  useEffect(() => {
    if (selectedVariant) {
      apiClient
        .get(`/inventory/cart-items-info/`, {
          params: { variant_ids: selectedVariant },
        })
        .then((response) => {
          let _response = response.data;
          console.log("response variants data >>>> ", _response);
          setSelectedProductList(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedVariant]);

  const toggleProductForm = () => {
    setProductForm(!productForm);
  };

  const getVariantDetail = (id) => {
    return selectedProductList.find((product) => product.id === id);
  };

  const totals = variantsData.reduce(
    (sum, item) => {
      let variant = getVariantDetail(item.variant_id);
      const actualPrice = parseFloat(variant?.actual_price) * item.quantity;
      const salePrice =
        parseFloat(variant?.price || variant?.actual_price) * item.quantity;

      const _sum = {
        actualPrice: sum.actualPrice + actualPrice,
        salePrice: sum.salePrice + salePrice,
      };
      return _sum;
    },
    {
      actualPrice: 0,
      salePrice: 0,
    }
  );

  const validateForm = () => {
    let errors = [];

    if (!variantsData.length) {
      errors.push("Please select at least one product");
    }

    if (errors.length > 0) {
      Swal.fire(
        <div>
          <div>Error!</div>
          <h4>Please correct the following errors</h4>
          {errors.map((error, index) => (
            <h6 className="text-danger" key={index}>
              {error}{" "}
            </h6>
          ))}
        </div>
      );
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const is_valid = validateForm();

    if (is_valid) {
      const requestData = {
        items: variantsData,
        address: orderItemInfo.address,
        buyer_id: orderItemInfo.buyer,
        discount: orderItemInfo.discount || 0,
      };
      OrdersApi.create(requestData)
        .then((response) => console.log("response data >>>>> ", response.data))
        .catch((error) => console.log(error));
    }
  };

 

  console.log("requested data >>>> ", variantsData, orderItemInfo);
  // console.log("order info data",orderItemInfo)

  // console.log("variant data", variantsData);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && loadingError && <NetworkError error={loadingError} />}
      {!isLoading && (
        <div className="ecommerce-application">
          <BreadCrumbs
            breadCrumbTitle={orderId ? "EDIT ORDER" : "ADD NEW ORDER"}
            breadCrumbActive={orderId ?? "New Order"}
            breadCrumbParent={
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/orders/`);
                }}
              >
                All Orders
              </a>
            }
          />
          <Form onSubmit={handleSubmit}>
            <div className="list-view product-checkout">
              <div className="checkout-items">
                <Card>
                  <CardBody>
                    {variantsData.length > 0 && !productForm && (
                      <Button.Ripple
                        color="primary"
                        outline
                        className="mb-1  btn-icon "
                        onClick={toggleProductForm}
                      >
                        <Plus size="20" />{" "}
                        <span className="align-middle ml-25">
                          Add New Product
                        </span>
                      </Button.Ripple>
                    )}

                    {(!variantsData.length || productForm) && (
                      <AddProductVariant
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        variantData={variantData}
                        setVariantData={setVariantData}
                        setProductForm={setProductForm}
                        setVariantsData={setVariantsData}
                      />
                    )}

                    {selectedProductList?.map((product, index) => (
                      <Card className="ecommerce-card" key={index}>
                        <div
                          className="card-content"
                          style={{ gridTemplateColumns: "0.5fr 3fr 1fr" }}
                        >
                          <div className="item-img text-center">
                            <img
                              src={getApiURL(product.featured_image)}
                              className="img-fluid img-100"
                              alt="Product"
                            />
                          </div>
                          <CardBody>
                            <div className="item-name">
                              <a href="#">
                                <h4>{product.product.title}</h4>
                              </a>
                              {/* {item.product_variant.product.has_multiple_variants && (
                          <p className="item-company">
                            <span className="company-name">
                              <VariantLabel variantData={item.product_variant} />
                            </span>
                          </p>
                        )} */}
                              <div className="item-quantity">
                                <p className="quantity-title">Quantity: 2</p>
                              </div>
                              {/* <p className="delivery-date">{}</p> */}
                              <p className="offers">{10}%</p>
                            </div>
                          </CardBody>
                          <div className="item-options m-auto">
                            <div className="item-wrapper">
                              <div className="item-cost">
                                <h5 className="">{priceFormatter(129)}</h5>

                                <h6>
                                  <del className="strikethrough text-secondary">
                                    {priceFormatter(149)}
                                  </del>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <FormGroup>
                      <Label for="discount">Discount</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={orderItemInfo?.discount || 0}
                        onChange={(e) =>
                          setOrderItemInfoField("discount", e.target.value)
                        }
                      />
                    </FormGroup>

                    <Button.Ripple
                      color="primary"
                      outline
                      className="text-nowrap px-1"
                      type="submit"
                    >
                      Save
                    </Button.Ripple>
                  </CardBody>
                </Card>
              </div>

              <div className="checkout-options order-sidebar">
                <SidebarComponent
                  setOrderItemInfo={setOrderItemInfoField}
                  buyerData={buyerData}
                  orderId={orderId}
                  totals={totals}
                />
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     seller: state.auth.userInfo.profile,
//   };
// };

export default OrderAdd;
