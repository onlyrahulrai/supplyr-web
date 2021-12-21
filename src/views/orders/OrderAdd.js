import apiClient from "api/base";
import "assets/scss/pages/app-ecommerce-shop.scss";
import { getApiURL } from "api/utils";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import NetworkError from "components/common/NetworkError";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit3, Eye, Plus, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import { priceFormatter } from "utility/general";


import { history } from "../../history";

import SidebarComponent from "components/orders/SidebarComponent";
import Select from "react-select";
import _Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";
import { OrdersApi } from "api/endpoints";

const Swal = withReactContent(_Swal);

function getVariantShortDescription(variant) {
  const desc = [
    variant.option1_value,
    variant.option2_value,
    variant.option3_value,
  ]
    .filter(Boolean)
    .map((option, index) => {
      const label = variant["option" + (index + 1) + "_name"];
      const value = variant["option" + (index + 1) + "_value"];
      return (
        <span key={index}>
          {index === 0 || ", "}
          <b>
            {" "}
            <i>{label}: </i>
          </b>
          {value}
        </span>
      );
    });
  return <div>{desc}</div>;
}

const OrderAdd = (props) => {
  const buyerSlug = props.match.params.buyerId;
  const orderId = props.match.params.orderId;

  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [fetchData, setFetchData] = useState({});

  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [orderInfo, setOrderInfo] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [toggleButton, setToggleButton] = useState(false);

  useEffect(() => {
    if (buyerSlug) {
      const fetchData = async () => {
        let fetchBuyerData = await apiClient.get(
          `/inventory/sellers-buyer-detail/${buyerSlug}`
        );
        let fetchProductData = await apiClient.get("/inventory/products/list/");
        setOrderInfo((prevState) => ({
          buyer_id: fetchBuyerData?.data?.id,
          address: fetchBuyerData?.data?.address[0],
          
        }));
        // console.log(fetchBuyerData.data)
        setFetchData({
          buyer: fetchBuyerData.data,
          products: fetchProductData.data,
        });
        setIsLoading(false);
      };
      fetchData();
    }
  }, [buyerSlug]);

  useEffect(() => {
    if (orderId) {
      OrdersApi.retrieve(orderId)
        .then((response) => {
          // console.log("orders data >>>> ",response.data)
          let _items = response.data.items.map((item) => ({
            quantity: item.quantity,
            variant: item.product_variant,
            id: item.id,
          }));
          console.log("orders items ", _items);
          setItems(_items);
        })
        .catch((error) => console.log(error.message));
    }
  }, [orderId]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
      div: {
        overflow: "initial",
      },
    }),
  };

  const validateForm = () => {
    let errors = [];
    if (!selectedProduct) {
      errors.push("Please select the product!");
    }

    if (!item?.quantity) {
      errors.push("Please enter the product quantity");
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

  const handleAdd = () => {
    let is_valid = validateForm();

    if (is_valid) {
      if (item.set_focus !== undefined) {
        let _itemsCopy = [...items];
        let { quantity, variant, set_focus, id } = item;
        _itemsCopy[set_focus] = {
          quantity: quantity,
          variant: variant,
          id: id,
        };
        setItems(_itemsCopy);
      } else {
        setItems((prevState) => [...prevState, item]);
      }

      setItem({});
      setSelectedProduct(null);
      setToggleButton(false);
    }
  };

  console.log("items >>>> ", items);

  const totals = items?.reduce(
    (sum, item) => {
      const actualPrice =
        parseFloat(item?.variant?.actual_price) * item?.quantity;
      const salePrice =
        parseFloat(item?.variant?.price || item?.variant?.actual_price) *
        item?.quantity;

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

  const SubmitForm = () => {
    let errors = [];

    if (!items.length) {
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

    let is_valid = SubmitForm();

    if (is_valid) {
      let variantData = items?.map((item) => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
        id: item?.id ?? null,
      }));

      console.log("variants data >>> ", variantData);

      const requestData = {
        id: orderId,
        items: variantData,
        address: orderInfo?.address?.id,
        buyer_id: orderInfo?.buyer_id,
        discount: orderInfo?.discount || 0,
      };

      let url = "/orders/";

      if (orderId) {
        url += orderId + "/update/";
      }

      apiClient
        .post(url, requestData)
        .then((response) => {
          console.log("response data >>>>> ", response.data);
          history.push(`/orders/${response.data.id}`);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSelectVariant = (id) => {
    const item = items[id];
    let product = fetchData.products.find(
      (product) => product.id === item.variant.product.id
    );
    setToggleButton(true);
    setSelectedProduct(product);
    setItem({ quantity: item.quantity, variant: item });
    console.log("click product >>>> ", item);
  };

  const renderProductsData = fetchData?.products?.map((product) => ({
    label: product.title,
    value: product.id,
    featured_image: product.featured_image,
    quantity: product.quantity,
    has_multiple_variants: product.has_multiple_variants,
  }));

  const formatOptionLabel = ({ label, featured_image, quantity }) => {
    return (
      <div className="select-product">
        <img
          src={getApiURL(featured_image)}
          alt="featured"
          className="float-left mr-1 img-40"
        />
        <div>{label}</div>
        <div className="text-lightgray">
          {quantity > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>
    );
  };

  const handleClick = (index) => {
    let itemsCopy = [...items]
    itemsCopy.splice(index,1)
    setItems(itemsCopy)
  }

  console.log("items  >>> ", items);

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
                    {items.length > 0 && !toggleButton && (
                      <Button.Ripple
                        color="primary"
                        outline
                        className="mb-1  btn-icon "
                        onClick={() => setToggleButton(true)}
                      >
                        <Plus size="20" />{" "}
                        <span className="align-middle ml-25">
                          Add New Product
                        </span>
                      </Button.Ripple>
                    )}

                    {(!items.length || toggleButton) && (
                      <Card className="select-product-input">
                        <CardHeader>
                          <div className="d-flex">
                            <span
                              className="mr-1 cursor-pointer"
                              onClick={() => setToggleButton(false)}
                            >
                              <ArrowLeft size="15" />
                            </span>

                            <span>Add Product</span>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <FormGroup>
                            <Label for={`item-name`}>Product Name</Label>

                            <Select
                              options={renderProductsData}
                              onChange={(data) => {
                                let product = fetchData.products.find(
                                  (product) => product.id === data.value
                                );
                                let _product = renderProductsData.find(
                                  (product) => product.value === data.value
                                );
                                if (!product.has_multiple_variants) {
                                  setItem((prevState) => ({
                                    ...prevState,
                                    variant: product.variants_data,
                                    quantity: product.variants_data.minimum_order_quantity,
                                  }));
                                } else {
                                  setItem((prevState) => ({
                                    ...prevState,
                                    variant: product.variants_data[0],
                                    quantity:product.variants_data[0].minimum_order_quantity
                                  }));
                                }
                                setSelectedProduct(product);
                              }}
                              defaultValue={
                                selectedProduct
                                  ? {
                                      label: selectedProduct?.title,
                                      value: selectedProduct?.id,
                                      featured_image:
                                        selectedProduct?.featured_image,
                                      is_multiple:
                                        selectedProduct?.has_multiple_variants,
                                    }
                                  : null
                              }
                              formatOptionLabel={formatOptionLabel}
                              styles={customStyles}
                            />

                            {/* {
                              console.log(selectedProduct)
                            } */}
                          </FormGroup>

                          {console.log(
                            "selected product >>>> ",
                            selectedProduct
                          )}
                          {selectedProduct?.has_multiple_variants && (
                            <FormGroup>
                              <Label for="variant">Variant</Label>
                              <Select
                                options={selectedProduct?.variants_data?.map(
                                  (variant) => {
                                    const label = (
                                      <div>
                                        <img
                                          src={
                                            variant.featured_image
                                              ? getApiURL(
                                                  variant.featured_image
                                                )
                                              : ""
                                          }
                                          alt="featured"
                                          className="float-left mr-1 img-40"
                                        />
                                        <div>
                                          {getVariantShortDescription(variant)}
                                        </div>
                                        <div className="text-lightgray">
                                          &#36; {variant.price}
                                        </div>
                                      </div>
                                    );
                                    return {
                                      label: label,
                                      value: variant.id,
                                    };
                                  }
                                )}
                                defaultValue={{
                                  label: getVariantShortDescription(
                                    item?.variant
                                  ),
                                  value: item.variant.id,
                                }}
                                onChange={(data) => {
                                  if (selectedProduct?.has_multiple_variants) {
                                    const variant =
                                      selectedProduct?.variants_data?.find(
                                        (variant) => variant.id === data.value
                                      );
                                    setItem((prevState) => ({
                                      ...prevState,
                                      variant: variant,
                                    }));
                                  }
                                }}
                                styles={customStyles}
                              />
                            </FormGroup>
                          )}

                          <FormGroup>
                            <Label for={`quantity`}>Quantity</Label>

                            <Input
                              type="number"
                              placeholder="1"
                              name="quantity"
                              min={selectedProduct?.minimum_order_quantity}
                              value={item?.quantity || ""}
                              bsSize="lg"
                              onChange={(e) =>
                                setItem((prevState) => ({
                                  ...prevState,
                                  quantity: parseInt(e.target.value),
                                }))
                              }
                              disabled={!selectedProduct}
                              // invalid={(item?.quantity < selectedProduct?.minimum_order_quantity)}
                            />
                            {/* <FormFeedback invalid={(item?.quantity < selectedProduct?.minimum_order_quantity)}>
                              <div className="text-danger">
                                <AlertTriangle size={14}  /> Minimun Quantity: {selectedProduct?.minimum_order_quantity}
                              </div>
                         </FormFeedback> */}
                          </FormGroup>

                          <Button.Ripple
                            className="btn-icon"
                            color="primary"
                            outline
                            onClick={handleAdd}
                            // disabled={product?.quantity <= 0}
                          >
                            <Plus size={14} />
                            <span className="align-middle ml-25">
                              Add Product
                            </span>
                          </Button.Ripple>
                        </CardBody>
                      </Card>
                    )}

                    {items?.map((item, index) => (
                      <Card className="ecommerce-card" key={index}>
                        {console.log("item data with >>>> ", item)}
                        <div
                          className="card-content"
                          style={{ gridTemplateColumns: "0.5fr 3fr 1fr" }}
                        >
                          <div className="item-img text-center">
                            <img
                              src={getApiURL(item?.variant?.featured_image)}
                              className="img-fluid img-100"
                              alt="Product"
                            />
                          </div>
                          <CardBody>
                            <div className="item-name">
                              <h4>{item?.variant?.product?.title}</h4>

                              {/* {item.product_variant.product.has_multiple_variants && (
                          <p className="item-company">
                            <span className="company-name">
                              <VariantLabel variantData={item.product_variant} />
                            </span>
                          </p>
                        )} */}
                              <div className="d-flex justify-content-between">
                                <div className="item-quantity">
                                  <p className="quantity-title">
                                    Quantity: {item?.quantity}
                                  </p>
                                </div>
                                <div>
                                  <Eye
                                    size="20"
                                    role="button"
                                    className="mx-1 text-primary"
                                    onClick={() => history.push(`/product/${item?.variant?.product?.slug}`)}
                                  />
                                  <Edit3
                                    size="20"
                                    role="button"
                                    className="mx-1 text-info"
                                    onClick={() => {
                                      handleSelectVariant(index);
                                      setItem({ ...item, set_focus: index });
                                    }}
                                  />
                                  <Trash
                                    size="20"
                                    role="button"
                                    className="mx-1 text-danger"
                                    onClick={() => handleClick(index)}
                                  />
                                </div>
                              </div>
                              {/* <p className="delivery-date">{}</p> */}
                              {/* <p className="offers">{10}%</p> */}
                            </div>
                          </CardBody>
                          <div className="item-options m-auto">
                            <div className="item-wrapper">
                              <div className="item-cost">
                                {/* {
                                item?.product?.has_multiple_variants ? console.log(item?.product?.variants_data?.find((variant) => variant.id === item?.variant)) : console.log(item?.product?.variants_data)
                              }*/}
                                <h5 className="">
                                  {priceFormatter(item?.variant?.price || 0)}
                                </h5>

                                <h6>
                                  <del className="strikethrough text-secondary">
                                    {priceFormatter(
                                      item?.variant?.actual_price || 0
                                    )}
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
                        value={orderInfo?.discount || ""}
                        onChange={(e) =>
                          setOrderInfo((prevState) => ({
                            ...prevState,
                            discount: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>

                    <Button.Ripple
                      color="primary"
                      outline
                      className="text-nowrap px-1"
                    >
                      Save
                    </Button.Ripple>
                  </CardBody>
                </Card>
              </div>

              <div className="checkout-options order-sidebar">
                <SidebarComponent
                  orderInfo={orderInfo}
                  setOrderInfo={setOrderInfo}
                  buyerData={fetchData?.buyer}
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

export default OrderAdd;
