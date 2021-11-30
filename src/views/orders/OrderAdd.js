import apiClient from "api/base";
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import NetworkError from "components/common/NetworkError";
import { SimpleInputField } from "components/forms/fields";
import Address from "components/inventory/Address";
import React, { useEffect, useReducer, useState } from "react";
import { Edit3, Plus, X } from "react-feather";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
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

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT_ACTION":
      return state;
    case "UPDATE_PRODUCT_ACTION":
      return state;
    case "Add_PRODUCT":
      return state;
    case "UPDATE_PRODUCT":
      return state;
    case "DELETE_PRODUCT":
      return state;
    case "ON_CHANGE":
      return state;
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

  const [modal, setModal] = useState(false);

  const [initialData, setInitialData] = useState("");
  const [buyerData, setBuyerData] = useState(null);

  const [addNewProductBtn, setAddNewProductBtn] = useState(false);

  const [state, dispatch] = useReducer(reducer, [1]);

  const [buyerAddress, setBuyerAddress] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (buyerSlug) {
      apiClient
        .get(`/inventory/sellers-buyer-detail/${buyerSlug}`)
        .then((response) => {
          console.log(response.data);
          setBuyerData(response.data);
          setBuyerAddress(response.data?.address[0]);
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

  const toggleModal = () => {
    setModal(!modal);
  };

  const formatOptionLabel = (props) => {
    console.log(props);

    return (
      <div>
        <div className={`${"text-bold-600"}`}>{props.name}</div>
        <div className="text-lightgray">{props.city}</div>
      </div>
    );
  };

  const handleSubmit = () => {
    setAddNewProductBtn(false);
  };

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
                      onClick={() => setAddNewProductBtn(true)}
                    >
                      <Plus size="20" />{" "}
                      <span className="align-middle ml-25">
                        Add New Product
                      </span>
                    </Button.Ripple>
                  )}

                  {(!state.length || addNewProductBtn) && (
                    <Card>
                      <CardBody>
                        <h4>Add Product</h4>

                        <FormGroup>
                          <Label for={`item-name`}>Product Name</Label>
                          <AsyncPaginate
                            additional={{ page: 1 }}
                            value={product}
                            loadOptions={loadProductOptions}
                            onChange={setProduct}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label for={`quantity`}>Quantity</Label>
                          <Input
                            type="number"
                            id={`quantity`}
                            placeholder="1"
                          />
                        </FormGroup>

                        <Button.Ripple
                          className="btn-icon"
                          color="primary"
                          outline
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
                      <h3>{capitalizeString(buyerData.owner)}</h3>
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

                  <Address {...buyerData.address[0]} />

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
                    isOpen={modal}
                    toggle={toggleModal}
                    className="modal-dialog-centered select-buyer-address modal-lg"
                  >
                    <ModalHeader toggle={toggleModal}>
                      Select Buyer Address:
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col md="6" >
                          <Card className="bg-primary text-white">
                            <CardBody>
                              <div>
                                <strong>Address:</strong>
                                {"   "}
                                <span>Chandpur harvansh</span>
                              </div>
                              <div>
                                <strong>City:</strong> <span>Ayodhya</span>
                              </div>
                              <div>
                                <strong>Line 1:</strong>
                                {"   "}
                                <span>Sultan Pur Road</span>
                              </div>
                              <div>
                                <strong>Line 2:</strong>
                                {"   "}
                                <span>Ayodhya Road</span>
                              </div>

                              <div>
                                <strong>State:</strong>
                                {"   "}
                                <span>Uttar Pradesh</span>
                              </div>
                              <div>
                                <strong>Pin Code:</strong> {"   "}
                                <span>224001</span>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="6">
                          <Card>
                            <CardBody>
                              <div>
                                <strong>Address:</strong>
                                {"   "}
                                <span>Hansapur</span>
                              </div>
                              <div>
                                <strong>City:</strong>{" "}
                                <span>Ambedkar Nagar</span>
                              </div>
                              <div>
                                <strong>Line 1:</strong>
                                {"   "}
                                <span>Ambedkar Nagar Road</span>
                              </div>
                              <div>
                                <strong>Line 2:</strong>
                                {"   "}
                                <span>Sultan Pur Road</span>
                              </div>

                              <div>
                                <strong>Pin Code:</strong> {"   "}
                                <span>224122</span>
                              </div>

                              <div>
                                <strong>State:</strong>
                                {"   "}
                                <span>Telangana</span>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="6">
                          <Card>
                            <CardBody>
                              <div>
                                <strong>Address:</strong>
                                {"   "}
                                <span>Sahabganj</span>
                              </div>
                              <div>
                                <strong>City:</strong> <span>Prayag Raj</span>
                              </div>
                              <div>
                                <strong>Line 1:</strong>
                                {"   "}
                                <span>Sultan pur Road</span>
                              </div>
                              <div>
                                <strong>Line 2:</strong>
                                {"   "}
                                <span>Lucknow Road</span>
                              </div>

                              <div>
                                <strong>Pin Code:</strong> {"   "}
                                <span>224244</span>
                              </div>

                              <div>
                                <strong>State:</strong>
                                {"   "}
                                <span>Kerala</span>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="6">
                          <Card>
                            <CardBody>
                              <div>
                                <strong>Address:</strong>
                                {"   "}
                                <span>Los Angeles</span>
                              </div>
                              <div>
                                <strong>City:</strong> <span>California</span>
                              </div>
                              <div>
                                <strong>Line 1:</strong>
                                {"   "}
                                <span>
                                  Downtown cityscape. Road
                                </span>
                              </div>
                              <div>
                                <strong>Line 2:</strong>
                                {"   "}
                                <span>Norway Road</span>
                              </div>

                              <div>
                                <strong>Pin Code:</strong> {"   "}
                                <span>200987</span>
                              </div>

                              <div>
                                <strong>State:</strong>
                                {"   "}
                                <span>USA</span>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
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
