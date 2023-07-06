import React, { useState } from "react";
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
  Spinner
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ArrowLeft, Check, Edit3, Menu, Trash2 } from "react-feather";
import { capitalizeString } from "utility/general";
import { connect } from "react-redux";
import apiClient from "api/base";
import Radio from "../@vuexy/radio/RadioVuexy";
import useBuyerDiscountContext, { GenericDiscountDetail } from "context/useBuyerDiscountContext";
import ProductSpecificDiscount from "./ProductSpecificDiscount";
import { toast } from "react-toastify";


const GenericDiscountFormComponent = ({onToggleGenericDiscountForm,buyer}) => {
  const {state,dispatch} = useBuyerDiscountContext();
  const [genericDiscount,setGenericDiscount] = useState({
    discount_type:state?.generic_discount?.discount_type ?? "percentage",
    discount_value:state?.generic_discount?.discount_value ?? 0
  })
  const [loading,setLoading] = useState(false);

  const onCreateGenericDiscount = async (e) => {
    e.preventDefault()

    setLoading(true)

    const data = {
      ...genericDiscount,
      buyer:state?.buyer?.id
    }

    const genericDiscountPromise = state?.generic_discount ? apiClient.put(`discounts/${state?.generic_discount?.id}/`,data) : apiClient.post("discounts/",data)

    await genericDiscountPromise
    .then((response) => {
      console.log(" Data* ",response.data)
      dispatch({type:"ON_STATE_UPDATE",payload:response.data})
      onToggleGenericDiscountForm()
      setLoading(false)
      toast.info("Generic discount created successfully")
    })
    .catch((error) => {
      console.log(" Error ",error)
      setLoading(false)
    })
  }

  const onDeleteGenericDiscount = async () => {
    setLoading(true)

    await apiClient.delete(`discounts/${state?.generic_discount?.id}/`)
    .then((response) => {
      console.log(" Response Data ",response.data)
      dispatch({type:"ON_STATE_UPDATE",payload:response.data})
      onToggleGenericDiscountForm()
      toast.info("Generic discount removed successfully")
      setLoading(false)
    })
    .catch((error) => {
      console.log(" Error ",error)
      setLoading(false)
    })
  }

  const onChangeGenericDiscount = (e) => setGenericDiscount((prevState) => ({...prevState,[e.target.name]:e.target.value}))

  return (
    <Row className="mx-0">
      <Col md="12">
        <Card>
          <CardHeader>
            <div className="d-flex">
              <span
                className="mr-1 cursor-pointer"
                onClick={() => onToggleGenericDiscountForm()}
              >
                <ArrowLeft size="15" />
              </span>

              <span>
                {buyer?.generic_discount ? "Edit" : "Add"}{" "}
                  Generic Discount
              </span>
            </div>
          </CardHeader>
          <CardBody>
              <Form onSubmit={onCreateGenericDiscount}>
                <FormGroup>
                  <div className="d-inline-block mr-1 mb-h5-0">
                    <Radio
                      label="Percentage"
                      value="percentage"
                      color="primary"
                      name="discount_type"
                      className="py-50"
                      checked={genericDiscount.discount_type === "percentage"}
                      onChange={onChangeGenericDiscount}
                    />
                  </div>
                  <div className="d-inline-block mr-1 mb-h5-0">
                    <Radio
                      label="Amount"
                      value="amount"
                      color="primary"
                      name="discount_type"
                      className="py-50 mb-0"
                      checked={genericDiscount.discount_type === "amount"}
                      onChange={onChangeGenericDiscount}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="discount">
                    Discount Value ({capitalizeString(genericDiscount.discount_type)}){" "}
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter Generic Discount..."
                    value={genericDiscount?.discount_value ?? 0}
                    onChange={(e) => {
                      let num = e.target.value

                      if(genericDiscount.discount_type === "percentage"){
                        num = Math.min(100,num)
                      }
                                        
                      setGenericDiscount((prevState) => ({
                        ...prevState,
                        discount_value: num,
                      }));
                    }}
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
                      disabled={loading}
                    >
                      {state?.generic_discount?.id ? <Edit3 size={14} /> : <Check size={14} /> }
                      <span className="align-middle mx-1">{state?.generic_discount?.id ? "Edit" : "Create" }</span>
                      {loading ? <Spinner style={{width:"1rem",height:"1rem"}} /> : null}
                    </Button.Ripple>

                    <Button.Ripple
                      type="button"
                      color="danger"
                      onClick={() => {
                        onToggleGenericDiscountForm()
                      }}
                    >
                      Cancel
                    </Button.Ripple>
                  </Col>
                  <Col md="6" className="d-flex justify-content-end align-items-center">
                    {state?.generic_discount ? (
                      <Button.Ripple
                        type="button"
                        color="warning"
                        className="mr-2 text-white"
                        disabled={loading}
                        onClick={() => onDeleteGenericDiscount()}
                      >
                        <Trash2 size={14} />
                        <span className="align-middle mx-1">Remove General Discount</span>
                        {loading ? <Spinner style={{width:"1rem",height:"1rem"}} /> : null}
                      </Button.Ripple>
                    ) : null}
                  </Col>
                </FormGroup>
              </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

const BuyerDiscountMain = (props) => {
  const {state} = useBuyerDiscountContext();
  const [toggleGenericDiscountForm, setToggleGenericDiscountForm] =
    useState(false);
  const [isProductDiscountFormOpen,setIsProductDiscountFormOpen] =
    useState(false);

  return (
    <div className="content-right" style={{ height: "100%" }}>
      <Card className="mb-0 h-100-percent">
        <CardHeader>
          <CardTitle>
            <span
              className="d-lg-none mb-1"
              onClick={() => props.mainSidebar(true)}
            >
              <Menu size={24} />
            </span>
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: "1rem 0.5rem" }}>
          {
            state?.buyer ? (
              <>
                <Row className="mx-0">
                  <Col md="12">
                    <h2>{capitalizeString(state?.buyer?.business_name ?? " ")}</h2>
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
                          <h2>Generic Discount</h2>

                          <p>
                            This discount is applied across all your products unless you
                            choose to override this on per product basis below.
                          </p>

                          <h5>
                            <GenericDiscountDetail discount={state?.generic_discount} />
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
                              setToggleGenericDiscountForm(!toggleGenericDiscountForm);
                              setIsProductDiscountFormOpen(false)
                            }}
                          >
                            {state?.generic_discount ? "Edit" : "Create"}
                          </Button.Ripple>
                        </Col>
                      </Row>
                    ) : (
                      <GenericDiscountFormComponent
                        onToggleGenericDiscountForm={() =>{
                          setToggleGenericDiscountForm((prevState) => !prevState)
                        }}
                      />
                    )}
                    <div className="divider">
                      <div className="divider-text">Product Based Discount</div>
                    </div>

                    <ProductSpecificDiscount   
                      isProductDiscountFormOpen={isProductDiscountFormOpen} 
                      setIsProductDiscountFormOpen={setIsProductDiscountFormOpen} 
                      onToggleGenericDiscountForm={() => setToggleGenericDiscountForm(false)} 
                    />
                  </div>
                </PerfectScrollbar>
              </>
            ): (
              <div className="d-flex align-items-center justify-content-center h-100-percent">     
                <h1>Select the buyer from the sidebar</h1>
              </div>
            )
          } 
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
