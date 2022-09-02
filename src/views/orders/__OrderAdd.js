import apiClient from "api/base";
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import NetworkError from "components/common/NetworkError";
import { SimpleInputField } from "components/forms/fields";
import Address from "components/inventory/Address";
import React, { useEffect, useReducer, useState } from "react";
import { ArrowLeft, Edit3, Plus, X } from "react-feather";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { capitalizeString, priceFormatter } from "utility/general";
import { history } from "../../history";
import productImg1 from "../../assets/img/pages/eCommerce/1.png";
import productImg2 from "../../assets/img/pages/eCommerce/2.png";
import { AsyncPaginate } from "react-select-async-paginate";
import { loadProductOptions } from "components/orders/loadOptions";
import { getApiURL } from "api/utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT_ACTION":
      return {
        ...state,
        isEditable: true,
        editableProduct: {
          product_variant: "",
          quantity: "",
          price:"",
          actual_price:"",
        },
      };
    case "UPDATE_PRODUCT_ACTION":
      return state;
    case "RESET_PRODUCT_ACTION":
      return {
        isEditable: false,
      };
    case "Add_PRODUCT":
      return {
        ...state,
        isEditable: false,
        products: [...state.products, state.editableProduct],
      };
    case "UPDATE_PRODUCT":
      return state;
    case "DELETE_PRODUCT":
      return state;
    case "ON_CHANGE":
      return {
        ...state,
        isEditable: true,
        editableProduct: {
          ...state.editableProduct,
          [action.payload.name]: action.payload.value,
        },
      };
    case "INITIALIZE":
      return state;
    default:
      return state;
  }
};

const OrderAdd = (props) => {
  const buyerSlug = props.match.params.buyerId;
  const orderId = props.match.params.orderId;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const [selectAddressModal, setSelectAddressModal] = useState(false);

  const [initialData, setInitialData] = useState("");
  const [buyerData, setBuyerData] = useState(null);

  const [addNewProductBtn, setAddNewProductBtn] = useState(false);

  const [state, dispatch] = useReducer(reducer, [{}]);

  const [buyerAddress, setBuyerAddress] = useState(null);

  const [productData, setProductData] = useState(null);

  const [selectedProduct,setSelectedProduct] = useState(null)

  useEffect(() => {
    if (selectedProduct) {
      apiClient
        .get(`/inventory/product/${selectedProduct.value}`)
        .then((response) => {
          let _response = response.data
          if(response.status >= 200 && response.status < 299){
            if(!_response.variants_data.multiple){
              dispatch({type:""})
            }
          }
         
          setProductData(response?.data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (buyerSlug) {
      apiClient
        .get(`/inventory/sellers-buyer-detail/${buyerSlug}`)
        .then((response) => {
          console.log(response.data);
          setBuyerData(response.data);
          setBuyerAddress(response.data?.address);
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

  // const productQuantity =
  //   product?.allow_inventory_tracking && !product?.allow_overselling
  //     ? product?.quantity
  //     : Infinity;
  // const errorMessage =
  //   productQuantity === 0
  //     ? "Product is out of stock, please remove"
  //     : quantityLocal < product?.minimum_order_quantity
  //     ? `Error! Minimum quantity is ${product?.minimum_order_quantity}`
  //     : quantityLocal > productQuantity
  //     ? `Error! Maximum quantity is ${productQuantity}`
  //     : null;

  // const warningMessage =
  //   quantityLocal > productQuantity * 0.8
  //     ? `Max quantity: ${productQuantity}`
  //     : quantityLocal < product?.minimum_order_quantity * 1.2
  //     ? `Minimum quantity: ${product?.minimum_order_quantity}`
  //     : null;

  const toggleModal = () => {
    setSelectAddressModal(!selectAddressModal);
  };

  const handleSubmit = () => {
    setAddNewProductBtn(false);
  };

  const formatOptionLabel = ({ label, quantity, img }) => {
    return (
      <div className="select-product">
        <img
          src={getApiURL(img)}
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

  const handleAddressChange = (id) => {
    console.log("buyer address id >>> ", id);
    toggleModal();
  };

  const onProductChange = async (value, action) => {
    await apiClient
      .get(`/inventory/product/${value.id}`)
      .then((response) => {
        const name = action.name;
        dispatch({ type: "ON_CHANGE", payload: { name: name, value: value } });
      })
      .catch((error) => console.log(error));
  };

  console.log("product data >>> ", selectedProduct,productData);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && loadingError && <NetworkError error={loadingError} />}
      {!isLoading && (
        <div className="ecommerce-application">
          <BreadCrumbs
            breadCrumbTitle={orderId ? "EDIT ORDER" : "ADD NEW ORDER"}
            breadCrumbActive={initialData?.title ?? "New Order"}
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
          <div className="list-view product-checkout">
            <div className="checkout-items">
              <Card>
                <CardBody>
                  {state.length > 0 && !addNewProductBtn && (
                    <Button.Ripple
                      color="primary"
                      outline
                      className="mb-1  btn-icon "
                      onClick={() => setAddNewProductBtn(!addNewProductBtn)}
                    >
                      <Plus size="20" />{" "}
                      <span className="align-middle ml-25">
                        Add New Product
                      </span>
                    </Button.Ripple>
                  )}

                  {(!state.length || addNewProductBtn) && (
                    <Card className="select-product-input">
                      <CardHeader>
                        <div className="d-flex">
                          <span
                            className="mr-1 cursor-pointer"
                            onClick={() =>
                              setAddNewProductBtn(!addNewProductBtn)
                            }
                          >
                            <ArrowLeft size="15" />
                          </span>

                          <span>Add Product</span>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <FormGroup>
                          <Label for={`item-name`}>Product Name</Label>
                          {/* {console.log(loadProductOptions())} */}
                          <AsyncPaginate
                            additional={{ page: 1 }}
                            value={selectedProduct}
                            name="product"
                            loadOptions={loadProductOptions}
                            onChange={setSelectedProduct}
                            formatOptionLabel={formatOptionLabel}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label for={`quantity`}>Quantity</Label>

                          <Input
                            type="number"
                            placeholder="1"
                            value={state?.editableProduct?.quantity || ""}
                            name="quantity"
                            onChange={(e) => {
                              dispatch({
                                type: "ON_CHANGE",
                                payload: {
                                  name: e.target.name,
                                  value: e.target.value,
                                },
                              });
                            }}
                            // invalid
                          />
                          {/* <FormFeedback invalid>
                            Sweet! that name is available
                          </FormFeedback> */}
                        </FormGroup>

                        <Button.Ripple
                          className="btn-icon"
                          color="primary"
                          outline
                          // disabled={product?.quantity <= 0}
                          onClick={handleSubmit}
                        >
                          <Plus size={14} />
                          <span className="align-middle ml-25">Add New</span>
                        </Button.Ripple>
                      </CardBody>
                    </Card>
                  )}

                  <Card className="ecommerce-card">
                    <div
                      className="card-content"
                      style={{ gridTemplateColumns: "0.5fr 3fr 1fr" }}
                    >
                      <div className="item-img text-center">
                        <img
                          src={productImg1}
                          className="img-fluid img-100"
                          alt="Product"
                        />
                      </div>
                      <CardBody>
                        <div className="item-name">
                          <a href="#">
                            <h4>Color Block Men Round Neck Blue T-Shirt</h4>
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
                  <Card className="ecommerce-card">
                    <div
                      className="card-content"
                      style={{ gridTemplateColumns: "0.5fr 3fr 1fr" }}
                    >
                      <div className="item-img text-center">
                        <img
                          src={productImg2}
                          className="img-fluid img-100"
                          alt="Product"
                        />
                      </div>
                      <CardBody>
                        <div className="item-name">
                          <a href="#">
                            <h4>Micvir Back Cover for Realme C21Y</h4>
                          </a>
                          {/* {item.product_variant.product.has_multiple_variants && (
                        <p className="item-company">
                          <span className="company-name">
                            <VariantLabel variantData={item.product_variant} />
                          </span>
                        </p>
                      )} */}
                          <div className="item-quantity">
                            <p className="quantity-title">Quantity: 6</p>
                          </div>
                          {/* <p className="delivery-date">{}</p> */}
                          <p className="offers">{15}%</p>
                        </div>
                      </CardBody>
                      <div className="item-options m-auto">
                        <div className="item-wrapper">
                          <div className="item-cost">
                            <h5 className="">{priceFormatter(1949)}</h5>

                            <h6>
                              <del className="strikethrough text-secondary">
                                {priceFormatter(1999)}
                              </del>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <FormGroup>
                    <Label for="discount">Discount</Label>
                    <Input type="number" id={`quantity`} placeholder="1" />
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
              <Card>
                <CardBody>
                  <Row className="mb-1">
                    <Col>
                      <h6 className="text-secondary">Order ID</h6>
                      <h3>#{orderId || "New"}</h3>
                      {/* {orderId && <h6>{orderData.order_date}</h6>} */}
                    </Col>
                    <Col sm="auto" className="ml-auto text-right">
                      <h6 className="text-secondary">From</h6>
                      <h3>{capitalizeString(buyerData.owner || "")}</h3>
                    </Col>
                  </Row>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-secondary">SHIPPING ADDRESS</h6>
                    <Edit3
                      size="20"
                      color="cadetblue"
                      title="Edit"
                      role="button"
                      className="pointer"
                      onClick={toggleModal}
                    />
                  </div>

                  <Address {...buyerAddress[0]} />

                  <hr />
                  <div className="price-details">
                    <p>Price Details</p>
                  </div>
                  <div className="detail">
                    <div className="detail-title">Total MRP</div>
                    <div className="detail-amt">{priceFormatter(199)}</div>
                  </div>
                  <div className="detail">
                    <div className="detail-title">Discount</div>
                    <div className="detail-amt discount-amt">
                      {priceFormatter(199 - 149)}
                    </div>
                  </div>

                  <hr />
                  <div className="detail">
                    <div className="detail-title detail-total">Final Price</div>
                    <div className="detail-amt total-amt">
                      {priceFormatter(149)}
                    </div>
                  </div>

                  <Modal
                    isOpen={selectAddressModal}
                    toggle={toggleModal}
                    className="modal-dialog-centered select-buyer-address modal-lg"
                  >
                    <ModalHeader toggle={toggleModal}>
                      Select Buyer Address:
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        {buyerAddress?.map((address, index) => {
                          const { id, name, line1, line2, pin, city, state } =
                            address;
                          return (
                            <Col
                              md="6"
                              key={index}
                              onClick={() => handleAddressChange(id)}
                            >
                              <Card className="bg-primary text-white cursor-pointer">
                                <CardBody>
                                  <div>
                                    <strong>Address:</strong>
                                    {"   "}
                                    <span>{name}</span>
                                  </div>
                                  <div>
                                    <strong>City:</strong> <span>{city}</span>
                                  </div>
                                  <div>
                                    <strong>Line 1:</strong>
                                    {"   "}
                                    <span>{line1}</span>
                                  </div>
                                  <div>
                                    <strong>Line 2:</strong>
                                    {"   "}
                                    <span>{line2}</span>
                                  </div>

                                  <div>
                                    <strong>State:</strong>
                                    {"   "}
                                    <span>{state}</span>
                                  </div>
                                  <div>
                                    <strong>Pin Code:</strong> {"   "}
                                    <span>{pin}</span>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAdd;
