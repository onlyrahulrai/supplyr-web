import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Menu } from "react-feather";
import { capitalizeString } from "utility/general";
import { SimpleInputField } from "components/forms/fields";
import { connect } from "react-redux";
import apiClient from "api/base";
import Swal from "sweetalert2";

const BuyerDiscountMain = (props) => {
  const [toggleGenericDiscountForm, setToggleGenericDiscountForm] =
    useState(false);
  const [genericDiscount, setGenericDiscount] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setToggleGenericDiscountForm(false);
    setGenericDiscount(Math.floor(props.buyer?.generic_discount) || 0);
    setErrors({});
  }, [props]);

  const validateForm = (values) => {
    if (!values) {
      setErrors({ genericDiscount: "This field must be required!" });
      return true;
    }
    return false;
  };

  console.log(props);

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm(genericDiscount);
    if (!error) {
      console.log("form submitted successfully");
      setIsSubmitting(true);
      console.log(
        "Data >>> ",
        props.buyer.id,
        props.seller,
        props.buyer.buyer.business_name,
        genericDiscount
      );
      let _formData = new FormData();
      _formData.append("seller", props.seller);
      _formData.append("buyer", props.buyer.buyer.business_name);
      _formData.append("generic_discount", genericDiscount);
      apiClient
        .put(`inventory/buyer-discount/${props.buyer.id}/`, _formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setIsSubmitting(false);
          console.log("form response >>>> ", res);

          if (res.status >= 200 && res.status <= 299) {
            let _buyer = props.buyer;
            _buyer.generic_discount = res.data.generic_discount;
            props.updateBuyer(_buyer);
            setToggleGenericDiscountForm(false);
            Swal.fire("Generic Discount Saved !", "Success");
          }else{
            throw new Error(res.statusText)
          }
        })
        .catch((err) => console.log(err));
    }
  };

  console.log("buyers from main discount >>>>", props.buyer);

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
          {props.buyer ? (
            <>
              <Row className="mx-0">
                <Col md="12">
                  <h2>{capitalizeString(props.buyer.buyer.business_name)}</h2>
                </Col>
              </Row>

              <hr />
              <PerfectScrollbar
                className="email-user-list list-group"
                options={{
                  wheelPropagation: false,
                }}
              >
                <div className="pr-1">
                  {!toggleGenericDiscountForm ? (
                    <Row className="mx-0 ">
                      <Col md="8">
                        <h3>
                          General Discount{" "}
                          {Math.floor(props.buyer.generic_discount) || 0}%
                        </h3>
                        <p>
                          This discount is applied across all your products
                          unless you choose to override this on per product
                          basis below.
                        </p>
                      </Col>
                      <Col
                        md="4"
                        className="d-flex justify-content-end align-items-center"
                      >
                        <Button.Ripple
                          type="button"
                          color="primary"
                          onClick={() => setToggleGenericDiscountForm(true)}
                        >
                          Change
                        </Button.Ripple>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="mx-0">
                      <Col md="12">
                        <Form onSubmit={handleSubmit}>
                          <FormGroup>
                            <Label htmlFor="discount">Generic Discount</Label>
                            <SimpleInputField
                              error={errors?.genericDiscount}
                              type="number"
                              placeholder="Enter Generic Discount..."
                              value={genericDiscount}
                              onChange={(e) =>
                                setGenericDiscount(e.target.value)
                              }
                            />
                          </FormGroup>
                          <Button.Ripple
                            type="submit"
                            color="primary"
                            className="mr-2"
                            disabled={isSubmitting}
                          >
                            Save
                          </Button.Ripple>
                          <Button.Ripple
                            type="button"
                            color="danger"
                            onClick={() => setToggleGenericDiscountForm(false)}
                          >
                            Exit
                          </Button.Ripple>
                        </Form>
                      </Col>
                    </Row>
                  )}

                  <hr />
                  <Row className="mx-0 ">
                    <Col md="8">
                      <h3>Product Specific Discounts</h3>
                      <p>
                        Products discounts you will specily here will override
                        any general discoutns you have specified.
                      </p>
                    </Col>
                    <Col
                      md="4"
                      className="d-flex justify-content-end align-items-center"
                    >
                      <Button.Ripple type="button" color="primary">
                        ADD A PRODUCT
                      </Button.Ripple>
                    </Col>
                  </Row>
                  <Row className=" py-2 mx-0  mt-2 border ">
                    <Col md="7">
                      <h4>Hp Inspiron 14 inch laptop 256GB SSD</h4>
                      <h5>&#8377; 2500 Discount</h5>
                    </Col>
                    <Col
                      md="5"
                      className="d-flex mt-2 mt-md-0 align-items-center justify-content-between"
                    >
                      <Button.Ripple type="button" color="primary">
                        Edit
                      </Button.Ripple>
                      <Button.Ripple type="button" color="danger">
                        Delete
                      </Button.Ripple>
                    </Col>
                  </Row>
                  <Row className=" py-2 mx-0 mt-2 border">
                    <Col md="7">
                      <h4>Apple Macbook Pro 16 M! Pro</h4>
                      <h5>&#8377; 6000 Discount</h5>
                    </Col>
                    <Col
                      md="5"
                      className="d-flex mt-2 mt-md-0 align-items-center justify-content-between"
                    >
                      <Button.Ripple type="button" color="primary">
                        Edit
                      </Button.Ripple>
                      <Button.Ripple type="button" color="danger">
                        Delete
                      </Button.Ripple>
                    </Col>
                  </Row>
                </div>
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
    seller: state.auth.userInfo.profile.business_name,
  };
};

export default connect(mapStateToProps)(BuyerDiscountMain);
