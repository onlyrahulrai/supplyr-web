import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ArrowLeft, Edit3, Menu, Trash } from "react-feather";
import { capitalizeString } from "utility/general";
import { connect } from "react-redux";
import apiClient from "api/base";
import Select from "react-select";
import { getApiURL } from "api/utils";
import DefaultProductImage from "../../assets/img/pages/default_product_image.png";
import ProductDiscountsFormComponent from "./ProductDiscountsFormComponent";
import Swal from "sweetalert2";
import PriceDisplay from "../utils/PriceDisplay";
import { SimpleInputField } from "components/forms/fields";

const discount_value_type = [
  { label: "Amount", value: "amount" },
  { label: "Percentage", value: "percentage" },
];

const BuyerDiscountMain = (props) => {
  const [toggleGenericDiscountForm, setToggleGenericDiscountForm] =
    useState(false);
  const [productDiscountsForm, setProductDiscountsForm] = useState(false);
  const [buyerData, setBuyerData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [genericDiscount, setGenericDiscount] = useState({
    discount_type: "percentage",
  });
  const [item, setItem] = useState({ discount_type: "amount" });
  const [productDiscounts, setProductDiscounts] = useState([]);

  // console.log(" ----- entire props ----- ", props);

  const fetchDiscount = async (buyer_id) => {
    setIsLoading(true);
    await apiClient
      .get(`inventory/buyer-details/${buyer_id}/`)
      .then((response) => {
        setBuyerData(response.data);
        setGenericDiscount({
          ...response.data.generic_discount,
          buyer: props.connected_buyer.buyer.id,
          seller: props.seller,
          discount_type: "percentage",
        });
        console.log("Hello world!", response.data.generic_discount);
        setItem((prevState) => ({
          ...prevState,
          buyer: props.connected_buyer.buyer.id,
          seller: props.seller,
        }));
        setProductDiscounts(response.data.product_discounts);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (props.connected_buyer) {
      fetchDiscount(props.connected_buyer.buyer.id);
    }
  }, [props]);

  const handleCreateGenericDiscount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestedData = {
      setting: "generic_discount",
      data: genericDiscount,
    };

    await apiClient
      .post("inventory/buyer-discounts/", requestedData)
      .then((response) => {
        setGenericDiscount(response.data);
        setToggleGenericDiscountForm(false);
        fetchDiscount(props.connected_buyer.buyer.id);
        Swal.fire(
          `Discount ${genericDiscount?.id ? "Updated!" : "Created!"}`,
          "success"
        );
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleEdit = (item) => {
    setItem({ ...item, product: item.product.id });
    setToggleGenericDiscountForm(false);
    setProductDiscountsForm(true);
  };

  const handleDelete = async (item) => {
    console.log("remove discount >>> ", item);
    setIsLoading(true);
    await apiClient
      .delete(`inventory/buyer-discounts/${item.id}`)
      .then((response) => {
        Swal.fire("Discount removed!", "success");
        fetchDiscount(item?.buyer);
        setIsLoading(false);
        setToggleGenericDiscountForm(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="content-right" style={{ height: "100%" }}>
      <Card className="mb-0 h-100-percent">
        <CardHeader>
          <CardTitle>
            <div
              className="d-lg-none mb-1"
              onClick={() => props.mainSidebar(true)}
            >
              <Menu size={24} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: "1rem 0.5rem" }}>
          {props.connected_buyer ? (
            <>
              <Row className="mx-0">
                <Col md="12">
                  <h2>
                    {capitalizeString(
                      props.connected_buyer.buyer.business_name
                    )}
                  </h2>
                </Col>
              </Row>

              <hr />
              <PerfectScrollbar
                className="email-user-list list-group"
                options={{
                  wheelPropagation: false,
                }}
              >
                {props.connected_buyer && (
                  <div className="pr-1">
                    {!toggleGenericDiscountForm ? (
                      <Row className="mx-0 ">
                        <Col md="8">
                          <h2>Generic Discount</h2>

                          <p>
                            This discount is applied across all your products
                            unless you choose to override this on per product
                            basis below.
                          </p>

                          <h5>
                            {buyerData?.generic_discount &&
                            buyerData?.generic_discount?.discount_type ===
                              "percentage"
                              ? `Percentage: ${buyerData?.generic_discount?.discount_value}%`
                              : buyerData?.generic_discount?.discount_type ===
                                  "amount" && (
                                  <span>
                                    Amount:
                                    <PriceDisplay
                                      amount={
                                        buyerData?.generic_discount
                                          ?.discount_value
                                      }
                                    />
                                  </span>
                                )}
                          </h5>
                        </Col>
                        <Col
                          md="4"
                          className="d-flex justify-content-end align-items-center"
                        >
                          <Button.Ripple
                            type="button"
                            color="primary"
                            onClick={() => {
                              setToggleGenericDiscountForm(
                                !toggleGenericDiscountForm
                              );
                              setProductDiscountsForm(false);
                            }}
                          >
                            {buyerData?.generic_discount ? "Edit" : "Create"}
                          </Button.Ripple>
                        </Col>
                      </Row>
                    ) : (
                      <Row className="mx-0">
                        <Col md="12">
                          <Card>
                            <CardHeader>
                              <div className="d-flex">
                                <span
                                  className="mr-1 cursor-pointer"
                                  onClick={() => {
                                    setToggleGenericDiscountForm(
                                      !toggleGenericDiscountForm
                                    );
                                    setProductDiscountsForm(false);
                                  }}
                                >
                                  <ArrowLeft size="15" />
                                </span>

                                <span>
                                  {buyerData?.generic_discount ? "Edit" : "Add"}{" "}
                                  Generic Discount
                                </span>
                              </div>
                            </CardHeader>
                            <CardBody>
                              <Form onSubmit={handleCreateGenericDiscount}>
                                <FormGroup>
                                  <Label htmlFor="discount">
                                    Discount Percentage{" "}
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Enter Generic Discount..."
                                    value={
                                      genericDiscount?.discount_value ?? ""
                                    }
                                    onChange={(e) => {

                                      let num = e.target.value
                                      if(num > 100){
                                        num = Math.min(100,num)
                                      }else if(num < 0){
                                        num = Math.max(num,1)
                                      }
                                      setGenericDiscount((prevState) => ({
                                        ...prevState,
                                        discount_value: num,
                                      }));
                                    }}
                                    min={0}
                                    max={100}
                                    step="any"
                                    required
                                  />
                                </FormGroup>

                                <FormGroup row>
                                  <Col md="6">
                                    <Button.Ripple
                                      type="submit"
                                      color="primary"
                                      className="mr-2"
                                      disabled={isLoading}
                                    >
                                      Save
                                    </Button.Ripple>

                                    <Button.Ripple
                                      type="button"
                                      color="danger"
                                      onClick={() => {
                                        setToggleGenericDiscountForm(
                                          !toggleGenericDiscountForm
                                        );
                                        setProductDiscountsForm(false);
                                      }}
                                    >
                                      Cancel
                                    </Button.Ripple>
                                  </Col>
                                  <Col
                                    md="6"
                                    className="d-flex justify-content-end"
                                  >
                                    {buyerData?.generic_discount && (
                                      <Button.Ripple
                                        type="button"
                                        color="warning"
                                        className="mr-2"
                                        disabled={isLoading}
                                        onClick={() =>
                                          handleDelete(
                                            buyerData?.generic_discount
                                          )
                                        }
                                      >
                                        Remove General Discount
                                      </Button.Ripple>
                                    )}
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    )}
                    <div className="divider">
                      <div className="divider-text">Product Based Discount</div>
                    </div>

                    {!productDiscountsForm && (
                      <Row className="mx-0 ">
                        <Col md="8">
                          <h3>Product Specific Discounts</h3>
                          <p>
                            Products discounts you will specily here will
                            override any general discoutns you have specified.
                          </p>
                        </Col>
                        <Col
                          md="4"
                          className="d-flex justify-content-end align-items-center"
                        >
                          <Button.Ripple
                            type="button"
                            color="primary"
                            onClick={() => {
                              setProductDiscountsForm(!productDiscountsForm);
                              setToggleGenericDiscountForm(false);
                            }}
                          >
                            ADD A PRODUCT
                          </Button.Ripple>
                        </Col>
                      </Row>
                    )}
                    {productDiscountsForm && (
                      <Row>
                        <Col md="12" className="p-1">
                          <div className="m-1">
                            <ProductDiscountsFormComponent
                              productDiscountsForm={productDiscountsForm}
                              setProductDiscountsForm={setProductDiscountsForm}
                              productDiscounts={productDiscounts}
                              seller={props.seller}
                              buyer={props.connected_buyer.buyer.id}
                              fetchDiscount={fetchDiscount}
                              item={item}
                              setItem={setItem}
                            />
                          </div>
                        </Col>
                      </Row>
                    )}

                    {productDiscounts?.map((item, index) => (
                      <Row className=" py-2 mx-0  mt-2 border" key={index}>
                        <Col md="auto">
                          <img
                            src={
                              item?.product?.featured_image
                                ? getApiURL(item?.product?.featured_image)
                                : DefaultProductImage
                            }
                            style={{
                              objectFit: "contain",
                              height: "100%",
                              width: "64px",
                            }}
                            alt=""
                          />
                        </Col>
                        <Col md="auto">
                          <h4>{item.product.title}</h4>
                          <h5>
                            {" "}
                            {item?.discount_type === "amount" ? (
                              <span>
                                Discount:{" "}
                                <PriceDisplay amount={item?.discount_value} />{" "}
                              </span>
                            ) : (
                              <span>
                                {" "}
                                Discount: {item?.discount_value}&#37;{" "}
                              </span>
                            )}
                          </h5>
                          <Button.Ripple
                            type="button"
                            color="primary"
                            onClick={() => handleEdit(item)}
                            className="mr-1"
                            disabled={isLoading}
                          >
                            <Edit3 size={12} className="mr-1" />
                            Edit
                          </Button.Ripple>
                          <Button.Ripple
                            type="button"
                            color="danger"
                            onClick={() => handleDelete(item)}
                            disabled={isLoading}
                          >
                            <Trash size={12} className="mr-1" /> Delete
                          </Button.Ripple>
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}
              </PerfectScrollbar>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100-percent">
              <h1>Select the buyer from the sidebar</h1>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    seller: state.auth.userInfo.profile.id,
  };
};

export default connect(mapStateToProps)(BuyerDiscountMain);
