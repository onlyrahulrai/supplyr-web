import apiClient from "api/base";
import "assets/scss/pages/app-ecommerce-shop.scss";
import { getApiURL } from "api/utils";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import NetworkError from "components/common/NetworkError";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clipboard,
  Edit3,
  Eye,
  Plus,
  Trash,
} from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import {
  calculateTotals,
  calculate_extra_discount,
  extraDiscounts,
  priceFormatter,
} from "utility/general";

import { history } from "../../history";

import SidebarComponent from "components/orders/SidebarComponent";
import Select from "react-select";
import _Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";
import { OrdersApi } from "api/endpoints";
import DefaultProductImage from "../../assets/img/pages/default_product_image.png";
import PriceDisplay from "components/utils/PriceDisplay";
import Translatable from "components/utils/Translatable";
import { SimpleInputField } from "components/forms/fields";

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
  const [activeNoteItem, setActiveNoteItem] = useState("");

  const [activeExtraDiscount, setActiveExtraDiscount] = useState(null);

  useEffect(() => {
    if (buyerSlug) {
      const fetchData = async () => {
        let fetchBuyerData = await apiClient.get(
          `/inventory/sellers-buyer-detail/${buyerSlug}`
        );
        let fetchProductData = await apiClient.get("/inventory/products/list/");
        setOrderInfo((prevState) => ({
          ...prevState,
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
      setIsLoading(true);
      OrdersApi.retrieve(orderId)
        .then((response) => {
          let _items = response.data.items.map((item) => ({
            ...item,
            variant: item.product_variant,
          }));
          // console.log("orders items ", _items);
          setItems(_items);
          setOrderInfo((prevState) => ({
            ...prevState,
            total_extra_discount: response.data?.total_extra_discount,
          }));
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

  const extra_discount_per_product = (product_id, price) => {
    const product_discount = fetchData?.buyer?.product_discounts.find(
      (discount_product) => discount_product.product.id === product_id
    );

    console.log(product_id, price, product_discount);

    const calculate_discount = (discount, price) => {
      console.log(
        " <<<<<------>>>>> discount type <<<<<-------->>>>>  ",
        discount
      );
      let extra_discount = 0;
      if (discount?.discount_type === "percentage") {
        extra_discount = (
          (price * parseFloat(discount?.discount_value)) /
          100
        ).toFixed(2);
      } else {
        extra_discount = parseFloat(discount?.discount_value);
      }

      return extra_discount;
    };

    if (product_discount) {
      return calculate_discount(product_discount, price);
    } else if (fetchData?.buyer?.generic_discount) {
      console.log(
        " ---- fetch buyer generic discount ---- ",
        fetchData?.buyer?.generic_discount
      );
      return calculate_discount(fetchData?.buyer?.generic_discount, price);
    } else {
      return 0;
    }
  };

  const handleAdd = () => {
    const is_valid = validateForm();

    if (is_valid) {
      let _itemsCopy = [...items];

      if (item?.set_focus !== undefined) {
        _itemsCopy[item?.set_focus] = {
          ...item,
          extra_discount: (
            extra_discount_per_product(
              item.variant.product.id,
              parseFloat(item.price)
            ) * item.quantity
          ).toFixed(2),
        };
      } else {
        _itemsCopy = [
          ...items,
          {
            ...item,
            extra_discount: (
              extra_discount_per_product(
                item.variant.product.id,
                parseFloat(item.price)
              ) * item.quantity
            ).toFixed(2),
          },
        ];
      }

      setItems(_itemsCopy);

      const total_extra_discount = _itemsCopy.reduce(
        (total, item) => total + parseFloat(item.extra_discount),
        0
      );

      setOrderInfo((prevState) => ({
        ...prevState,
        total_extra_discount: total_extra_discount,
      }));

      setItem({});
      setSelectedProduct(null);
      setToggleButton(false);
    }
  };

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
      console.log(" -------- items on submit ------- ", items);
      let variantData = items?.map((item) => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
        id: item?.id ?? null,
        extra_discount: item?.extra_discount,
        price: item?.price,
        actual_price: item?.actual_price,
        item_note: item?.item_note ?? "",
      }));

      console.log("variants data >>> ", variantData);

      const requestData = {
        id: orderId,
        items: variantData,
        address: orderInfo?.address?.id,
        buyer_id: orderInfo?.buyer_id,
        total_extra_discount: orderInfo?.total_extra_discount,
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
        {/* {console.log("image url -------> ",featured_image ?? "name")} */}
        <img
          src={featured_image ? getApiURL(featured_image) : DefaultProductImage}
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
    let itemsCopy = [...items];
    itemsCopy.splice(index, 1);
    setItems(itemsCopy);
  };

  const handleChangeExtraDiscount = () => {
    setActiveExtraDiscount(null);

    const checkDiscount = items.every(
      (item) => item.extra_discount === "0.00" || item.extra_discount === "0"
    );

    if (!checkDiscount) {
      const total_extra_discount = items.reduce(
        (sum, item) => sum + parseFloat(item.extra_discount),
        0
      );

      setOrderInfo((prevState) => ({
        ...prevState,
        total_extra_discount: total_extra_discount,
      }));
    }
  };

  console.log(" ------ items list ------  ", items);

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

                            <span>
                              {item?.set_focus !== undefined ? "Update" : "Add"}{" "}
                              Product
                            </span>
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

                                if (!product.has_multiple_variants) {
                                  setItem((prevState) => ({
                                    ...prevState,
                                    variant: product.variants_data,
                                    quantity:
                                      product.variants_data
                                        .minimum_order_quantity,
                                    price: product.variants_data.price,
                                    actual_price:
                                      product.variants_data.actual_price,
                                  }));
                                } else {
                                  setItem((prevState) => ({
                                    ...prevState,
                                    variant: product.variants_data[0],
                                    quantity:
                                      product.variants_data[0]
                                        .minimum_order_quantity,
                                    price: product.variants_data[0].price,
                                    actual_price:
                                      product.variants_data[0].actual_price,
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

                          {console.log(
                            " <-------- selected product ------> ",
                            selectedProduct
                          )}

                          <SimpleInputField
                            label="Sale Price"
                            placeholder="Sale Price..."
                            type="number"
                            value={item?.price || ""}
                            onChange={(e) => {
                              setItem((prevState) => ({
                                ...prevState,
                                price: e.target.value,
                              }));
                            }}
                            requiredIndicator
                            min="0"
                          />

                          <FormGroup>
                            <Label for={`quantity`}>
                              <Translatable text="quantity" />
                            </Label>

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
                                  quantity: Math.max(
                                    parseInt(e.target.value),
                                    selectedProduct?.minimum_order_quantity
                                  ),
                                }))
                              }
                              disabled={!selectedProduct}
                              // invalid={(item?.quantity < selectedProduct?.minimum_order_quantity)}
                            />
                          </FormGroup>

                          <Button.Ripple
                            className="btn-icon"
                            color="primary"
                            outline
                            onClick={handleAdd}
                          >
                            <Plus size={14} />
                            <span className="align-middle ml-25">
                              {item?.set_focus !== undefined ? "Update" : "Add"}{" "}
                              Product
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
                          <div className="item-img d-flex align-items-start mt-2">
                            <img
                              src={
                                item?.variant?.featured_image
                                  ? getApiURL(item?.variant?.featured_image)
                                  : DefaultProductImage
                              }
                              className="img-fluid img-100 rounded"
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
                                <div className="item-quantity d-flex flex-column">
                                  <p className="quantity-title">
                                    <Translatable text="quantity" />:{" "}
                                    {item?.quantity}
                                  </p>

                                  {!(activeExtraDiscount === index) && (
                                    <div className="d-flex">
                                      <p className="quantity-title">
                                        Extra Discount:{" "}
                                        <PriceDisplay
                                          amount={item?.extra_discount}
                                        />
                                      </p>

                                      <div
                                        className="ml-1 text-primary cursor-pointer"
                                        onClick={() =>
                                          setActiveExtraDiscount(index)
                                        }
                                      >
                                        <Edit3 size={18} />
                                        Edit
                                      </div>
                                    </div>
                                  )}

                                  {activeExtraDiscount === index && (
                                    <Row>
                                      <Col md="7">
                                        <FormGroup>
                                          <Label htmlFor="extra-discount">
                                            Extra Discount:{" "}
                                          </Label>
                                          <Input
                                            type="number"
                                            placeholder="Enter extra discount..."
                                            value={item?.extra_discount || ""}
                                            onChange={(e) => {
                                              const copyItems = [...items];
                                              copyItems[index].extra_discount =
                                                e.target.value;
                                              setItems(copyItems);
                                            }}
                                            min={1}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col
                                        md="auto"
                                        className="d-flex align-items-center"
                                      >
                                        <FormGroup className="mt-1">
                                          <Button
                                            type="button"
                                            color="primary"
                                            size="sm"
                                            onClick={handleChangeExtraDiscount}
                                          >
                                            <Check size={16} />
                                          </Button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  )}


                                </div>
                                <div>
                                  <Eye
                                    size="20"
                                    role="button"
                                    className="mx-1 text-primary"
                                    onClick={() =>
                                      history.push(
                                        `/product/${item?.variant?.product?.slug}`
                                      )
                                    }
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

                            {!(activeNoteItem === index) ? (
                                <>
                                  {!item?.item_note ? (
                                    <div
                                      className="d-flex align-items-center text-primary cursor-pointer"
                                      onClick={() =>
                                        setActiveNoteItem(index)
                                      }
                                    >
                                      <Clipboard size={16} />
                                      &nbsp;
                                      <p className="mb-0">
                                        <strong>ADD AN NOTE ITEM</strong>
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="item-note">
                                      <b style={{color: '#000'}}><i>Item Note:</i> </b> &nbsp; {item.item_note}

                                      <span className="text-primary cursor-pointer" onClick={() =>  setActiveNoteItem(index)}>
                                        &nbsp;&nbsp;<Edit3 size={16}/> Edit
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="d-flex align-items-center">
                                  <FormGroup className="mb-0 flex-grow-1">
                                    <Label for="note">Item Note</Label>
                                    <Input
                                      type="text"
                                      placeholder="Notes..."
                                      value={item?.item_note || ""}
                                      onChange={(e) => {
                                        const copyItems = [...items];
                                        copyItems[index].item_note =
                                          e.target.value;
                                        setItems(copyItems);
                                      }}
                                    />
                                  </FormGroup>
                                  <FormGroup
                                    className="mb-0 bg-primary mt-1 ml-1 rounded-full"
                                    style={{ padding: "5.5px" }}
                                  >
                                    <Check
                                      size={18}
                                      className="text-white cursor-pointer"
                                      onClick={() =>  setActiveNoteItem("")}
                                    />
                                  </FormGroup>
                                </div>
                              )}
                          </CardBody>
                          <div className="item-options m-auto">
                            <div className="item-wrapper">
                              <div className="item-cost">
                                {/* {
                                item?.product?.has_multiple_variants ? console.log(item?.product?.variants_data?.find((variant) => variant.id === item?.variant)) : console.log(item?.product?.variants_data)
                              }*/}
                                <h5 className="">
                                  <PriceDisplay amount={item?.price || 0} />
                                </h5>

                                <h6>
                                  <del className="strikethrough text-secondary">
                                    <PriceDisplay
                                      amount={item?.actual_price || 0}
                                    />
                                  </del>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* <FormGroup>
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
                    </FormGroup> */}

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
                  totals={calculateTotals(items)}
                  items={items}
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
