import "assets/scss/pages/app-ecommerce-shop.scss";
import {  useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';

import {
  Button, Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from "reactstrap";
import { history } from "../../history"
import {OrdersApi} from "api/endpoints"
import {getMediaURL} from "api/utils"
import VariantLabel from "components/inventory/VariantLabel"
import Address from "components/inventory/Address"
import ProductDummyImage from "assets/img/svg/cart.svg"
import {BsClockHistory, BsCheckAll, BsCheck, BsTrash, BsReceipt, BsPencil, BsCheck2Circle} from "react-icons/bs"
import {AiOutlineEdit} from "react-icons/ai"
import {RiTruckLine} from "react-icons/ri"
import Swal from "utility/sweetalert"
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb"
import OrderTimeline from "components/common/OrderTimeline"
import Spinner from "components/@vuexy/spinner/Loading-spinner"
import NetworkError from "components/common/NetworkError"
import apiClient from "api/base";
import DynamicForm from "components/forms/dynamic-form/DynamicForm"
import { connect } from "react-redux";
import PriceDisplay from "components/utils/PriceDisplay";
import Translatable from "components/utils/Translatable";
import {GiReturnArrow} from "react-icons/gi"
import ShowTaxesComponent from "components/orders/__orderadd/ShowTaxesComponent";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// import { productsList } from "./cartData";

const statusDisplayDict = {
  awaiting_approval: {
    name: "Awaiting Approval",
    getIcon: (size, color) => (<BsClockHistory size={size} color={color ?? "orange"} />),
    color: 'orange',
    buttonClass: 'secondary',
    buttonLabel: 'Mark Unapproved'
  },
  approved: {
    name: "Approved",
    getIcon: (size, color) => (<BsCheck size={size} color={color ?? "#00cfe8"} />),
    color: '#00cfe8',
    buttonClass: 'info',
    buttonLabel: 'Approve'
  },
  processed: {
    name: "Order Processed",
    getIcon: (size, color) => (<BsCheck size={size} color={color ?? "#7367f0"} />),
    color: '#7367f0',
    buttonClass: 'primary',
    buttonLabel: 'Mark Order Processed'
  },
  dispatched: {
    name: "Dispatched",
    getIcon: (size, color) => (<RiTruckLine size={size} color={color ?? "#ff9f43"} />),
    color: '#ff9f43',
    buttonClass: 'warning',
    buttonLabel: 'Mark Dispatched'
  },
  delivered: {
    name: "Delivered",
    getIcon: (size, color) => (<BsCheckAll size={size} color={color ?? "#28c76f"} />),
    color: '#28c76f',
    buttonClass: 'success',
    buttonLabel: 'Mark Delivered'
  },
  returned: {
    name: "Returned",
    getIcon: (size, color) => (<GiReturnArrow size={size} color={color ?? "#ea5455"} />),
    color: '#ea5455',
    buttonClass: 'danger',
    buttonLabel: 'Mark Returned'
  },
  cancelled: {
    name: "Cancelled",
    getIcon: (size, color) => (<BsTrash size={size ?? 16} color={color ?? "tomato"} />),
    color: 'tomato',
    buttonClass: 'danger',
    buttonLabel: 'Cancel Order'
  }
}

function OrderStatus({status_code,name, size=16}) {
  const statusDisplayData = statusDisplayDict[status_code]
  return (
    <Row>
         <Col sm="auto">
          <span>{statusDisplayData.getIcon(size)} &nbsp;</span>
          <span style={{fontSize: size, color: statusDisplayData.color}}>{name}</span>
         </Col>
    </Row>
  )
}

function OrderDetails({order_status_variables,order_status_options,invoice_options,product_price_includes_taxes}) {

  const {orderId} = useParams()
  // console.log({orderId})

  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(null)
  const [isMarkedPaid,setIsMarkedPaid] = useState(false);

  /* ------ Order Status Variable Start ----- */
  const [orderStatusVariableData,setOrderStatusVariableData] = useState(null);
  const [toggleOrderStatusVariableDataModal,setToggleOrderStatusVariableDataModal] = useState(false)
  const [isFormLoading,setIsFormLoading] = useState(false)
  /* ------ Order Status Variable End ----- */

  const sumOfTotalItemsPrice = useMemo(() => {
    const subTotal = orderData?.items?.map(({price,quantity,...rest}) => price * quantity).reduce((sum,value) => (sum + value),0)
    return orderData ? product_price_includes_taxes ? subTotal - (orderData?.sgst + orderData?.cgst + orderData?.igst) : subTotal : 0
  },[orderData])

  const fetchOrderData = () => {
    OrdersApi.retrieve(orderId)
    .then(response => {

      // replace the order state object to order state name
      // const state_name = response.data?.address?.state.name;
      // const _address = response.data.address ? {...response.data.address,state:state_name} : null;
      
      setIsMarkedPaid(response.data.is_paid);


      setOrderData(response.data)
      // console.log("sds ", response.data)
    })
    .catch(error => {
      setLoadingError(error.message)
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  // const orderStatuses = ['awaiting_approval', 'approved', 'processed', 'dispatched', 'delivered',"cancelled"] // Skipped 'cancelled' here as it has separate control

  // order status change Start
  // const nextStatus = orderStatuses[orderStatuses.findIndex(s => s === orderData?.order_status) + 1]

  const [nextStatus,setNextStatus] = useState(null);
  const orderCurrentStatusOptions = order_status_options.find((so) => so.slug === orderData?.order_status)
  // order status change End
  
  const orderStatusChangeButtons = orderCurrentStatusOptions?.transitions_possible.map((possibility) => ({button:statusDisplayDict[possibility],status:possibility}))
  const nextStatusDisplayData = statusDisplayDict[nextStatus]
  const nextStatusVariables = order_status_variables[nextStatus] 

  const [isStateVariableModalVisible, setIsStateVariableModalVisible] = useState(false)
  const toggleStateVariableModal = () => setIsStateVariableModalVisible(!isStateVariableModalVisible)

  const getAddress = useMemo(() => {
    return {...orderData?.address,state:orderData?.address?.state?.name} 
  },[orderData])

  const onAction = (operation, data) => {

    const order_ids = [orderId]
    return OrdersApi.bulkUpdate({
      order_ids,
      operation,
      data,
    }).then((response) => {
      if(response.data?.success){
        Swal.fire("Order Updated", '', 'success')
        fetchOrderData()
      }
      
    })
    .catch(err => {
      Swal.fire("Error !", err.message, 'error')
      throw err
    })

  }

  const handleGenerateInvoice = async () => {
    setIsLoading(true)
    let data = {
      order:orderId
    }
    await apiClient.post("/orders/generate-invoice/",data)
    .then((response) => {
      setIsLoading(false)
      console.log(" ----- Invoice Data ----- ",response.data)
      // history.push(`/orders/${orderId}/invoice/${response.data.id}`)
      window.open(getMediaURL(response.data.invoice_pdf))
    })
    .catch((error) => {
      Swal.fire({
        icon:"error",
        title:"Error",
        text:" Failed to generate invoice."
      })
    })
  }
  
  const changeOrderStatus = (_nextStatus, variables) => {
    if (!variables){
      onAction('change_status', _nextStatus)
    }
    else {
      onAction('change_status_with_variables', {
        status: _nextStatus,
        variables
      })
    }
  }

  const onChangeStatusButtonPress = (_nextStatus) => {
    if (order_status_variables[_nextStatus]) {
      toggleStateVariableModal()
    }
    else {
      const order_status_option = order_status_options.find((option) => option.slug === _nextStatus)

      if(order_status_option?.confirmation_needed){
        Swal.fire({
          title:"Are you sure?",
          text:`Do you want to change status of this order to ${_nextStatus}?`,
          icon:"warning",
          showCancelButton:true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Mark ${order_status_option?.name}`
        }).then((result) => {
          if(result.isConfirmed){
            changeOrderStatus(_nextStatus)
          }
        })
      }else{
        changeOrderStatus(_nextStatus)
      }
    }
  }

  /* ------ Order Status Variable Start ----- */
  const handleUpdateStatusVariable = (id) => {
    const variable = orderData.status_variable_values.find((variable) => variable.id === id)
    setOrderStatusVariableData(variable)
    setToggleOrderStatusVariableDataModal(true)
  }

  const handleUpdateOrderStatusVariable = () => {
    setIsFormLoading(true)
    const requestedData = {
      value:orderStatusVariableData.value
    }
    apiClient.put(`orders/order-status-variable/${orderId}/${orderStatusVariableData?.id}/`,requestedData)
    .then((response) => {
      setIsFormLoading(false)
      setToggleOrderStatusVariableDataModal(false)
      fetchOrderData()
    })
    .catch((error) => {
      Swal.fire({
        icon:"error",
        title:"Error",
        text:"Failed to update status variables."
      })
    })
  }
  /* ------ Order Status Variable End ----- */

  const isEditable = (status) => {
    const option = order_status_options.find((option) => option.slug === status);
    return option ?  option.editing_allowed : false;
  }

  const orderStatus = (status) => {
    const option = order_status_options.find((option) => option.slug === status);
    return option ? option.name : status
  }

  const isAllowedToGenerateInvoice = (status) => {
    const index = order_status_options.sort((option) => option.sequence).findIndex((option) => option.slug === status)

    return order_status_options.slice(index).map((option) => option.slug).filter((status) => !['returned','cancelled'].includes(status))
  }



  return <>
  {isLoading &&
    <Spinner />
  }
  {!isLoading && loadingError && (
    <NetworkError
      error={loadingError}
    />
  )
  }
  {!isLoading && orderData && (
    <div className="ecommerce-application">
      <Row>
        <Col md="10" sm="8" >
          <BreadCrumb
            breadCrumbTitle={"Order " + orderData.order_number}
            breadCrumbParent= {<span onClick={e => {e.preventDefault(); history.push(`/orders/`)}}>All Orders</span>}
            breadCrumbActive = {`${orderData.order_number} ${orderData.buyer_name ? `(${orderData.buyer_name})` : ""}`}
          />
        </Col>
        <Col sm="4" md="2" className="edit-order-btn">
            {
              (isEditable(orderData?.order_status) && !orderData?.is_paid) && (
                <Button.Ripple
                  color='primary'
                  outline
                  block
                  className="btn-block cursor-pointer"
                  onClick={() => history.push(`/orders/update/${orderId}`)}
                >
                  <BsPencil size={16} color={"primary"} /> Edit Order
                </Button.Ripple>
              ) 
            }
        </Col>
      </Row>
    <div className="list-view product-checkout">
    <div className="checkout-items">
      {orderData?.items.map((item, i) => (
        <Card className="ecommerce-card" key={i}>
          <div
            className="card-content"
            style={{ gridTemplateColumns: "1fr 3fr 1.5fr" }}
          >
            <div className="item-img text-center">
              <img
                src={item.product_variant.featured_image ? getMediaURL(item.product_variant.featured_image) : ProductDummyImage} 
                alt="Product"
                className="img-fluid img-100 rounded"
              />
            </div>
            <CardBody>
              <div className="item-name">
                <h4>{item.product_variant.product.title}</h4>

                <p
                  className={`${
                    item.product_variant.quantity > 0 ? "stock-status-in" : "text-danger"
                  }`}
                >
                  {item.product_variant.quantity > 0 ? "In Stock" : "Out of stock"}
                </p>

                <div className="item-quantity">
                  <p className="quantity-title">
                    <Translatable text="quantity" />: {item.quantity}
                  </p>
                </div>
                <div className="item-quantity">
                  <p className="quantity-title mb-0">
                    Item Price (Per Unit): <PriceDisplay amount={item.price} />
                  </p>
                </div>
                
                <div className="delivery-date mt-half w-100 d-flex flex-column" style={{marginTop:"0.5rem"}}>

                  {
                    item.product_variant.product.has_multiple_variants ? (
                      <div className="item-company mb-half">
                        <div className="company-name">
                          <VariantLabel
                            variantData={item.product_variant}
                            />
                          </div>
                      </div>
                    ):null
                  }

                  <div className="item-note mb-half">
                    <b style={{ color: "#000" }}>
                      <i>Item Note:</i>{" "}
                    </b>{" "}
                    &nbsp; {item.item_note}
                  </div>
                    
                </div>
              </div>
            </CardBody>
            <div className="item-options text-center">
              <div className="item-wrapper">
                <div className="item-cost">
                  <span className="item-price">
                    <small style={{fontWeight:"bold"}}>Price: <PriceDisplay amount={item.price * item.quantity} /></small>
                  </span><br />
                  <span className="item-price">
                      <small style={{fontWeight:"bold"}}>
                        Extra Discount: <PriceDisplay amount={item.extra_discount ? item.extra_discount : 0} />
                      </small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Card style={{zIndex: -1}}>
        {/* zIndex -1 for timeline connector line (because of the way it is designed, it needed to) */}
        <CardBody>
          <h3>Order Timeline</h3>
          <OrderTimeline 
            data={(orderData.history??[]).concat([
              {
                status: 'created',
                date: orderData.order_date,
                time: orderData.order_time,
                created_by_user: orderData.created_by_user,
                created_by_entity: orderData.created_by_entity,
              }
            ])}
          />

        </CardBody>
      </Card>
    </div>

    <div className="checkout-options">
      <Card>
        <CardBody>
        <Row className="mb-1">
          <Col>
            <h6 className="text-secondary">Order ID</h6>
            <h3>{orderData.order_number}</h3>
            <h6>{orderData.order_date}</h6>
          </Col>
          <Col sm="auto" className="ml-auto text-right">
            <p className='text-secondary'>From</p>
            <div className="text-right text-secondary">
              <span>{`${orderData?.buyer?.name ? `(${orderData?.buyer.name})` : ""}`}</span>
              <strong className="text-light">{orderData?.buyer?.business_name}</strong>
            </div>
          </Col>
        </Row>

        <hr/>
        <h6 className="text-secondary">STATUS</h6>
        <h3><OrderStatus status_code={orderData.order_status} name={orderStatus(orderData.order_status)} /></h3>

          <hr />
          <h6 className="text-secondary">SHIPPING ADDRESS</h6>
          {
            (orderData.address) ? (
              <Address
                {...getAddress}
              />
            ):(
              <div className="mt-1">
                <span>No Address Added!</span>
              </div>
            )
          }
          {orderData.status_variable_values &&  (
          <> 
            <hr />
            {
              toggleOrderStatusVariableDataModal && (
                <Modal
                  isOpen={toggleOrderStatusVariableDataModal}
                  toggle={() => setToggleOrderStatusVariableDataModal(false)}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={() => setToggleOrderStatusVariableDataModal(false)}>
                    Update Order Status Variable:
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label htmlFor="value">{orderStatusVariableData?.variable_name}</Label>
                      <Input type="text" 
                        value={orderStatusVariableData?.value}
                        onChange={(e) => setOrderStatusVariableData((prevState) => ({...prevState,[e.target.name]:e.target.value}))}
                        name="value"
                        disabled={!toggleOrderStatusVariableDataModal}
                      />
                       {
                         isFormLoading && (
                          <Spinner />
                         )
                       }
                    </FormGroup>
                    <FormGroup>
                      <Button outline color="primary" onClick={handleUpdateOrderStatusVariable}>Save</Button>
                      <Button outline color="danger" className="ml-1" onClick={() => setToggleOrderStatusVariableDataModal(false)} >Cancel</Button>
                    </FormGroup>
                  </ModalBody>
                </Modal>
              )
            }
            <h6 className="text-secondary">INFORMATION</h6>

          
            {orderData?.status_variable_values?.length ? orderData.status_variable_values.map(status_variable => (
              <Row className="mt-1" key={status_variable.variable_slug}>
                <Col xs={6}>
                  <strong>
                  {status_variable.variable_name}
                  </strong>
                  {
                    ["awaiting_approval","approved","processed"].includes(orderData?.order_status) ? (
                      <span className="text-primary cursor-pointer" onClick={() => handleUpdateStatusVariable(status_variable.id)}>
                        <AiOutlineEdit size={20} />
                      </span>
                    ):(
                      ""
                    )
                  }
                  
                </Col>
                <Col xs={6} className='text-right'>
                  {status_variable.value}
                </Col>
              </Row>
            )):(
              <span>No information added</span>
            )}
          </>)
          }
          <hr />
          <div className="price-details">
            <p>Price Details</p>
          </div>
          <div className="detail">
            <div className="detail-title">Subtotal</div>
            <div className="detail-amt"><PriceDisplay amount={sumOfTotalItemsPrice} /></div>
          </div>

          <div className="detail">
            <div className="detail-title">Extra Discount</div>
            <div className="detail-amt discount-amt"><PriceDisplay amount={orderData?.total_extra_discount || 0} /></div>
          </div>

          <div className="detail">
            <div className="detail-title">Taxable Amount</div>
            <div className="detail-amt discount-amt">
              <PriceDisplay amount={orderData?.taxable_amount ?? 0} />
            </div>
          </div>

          <div className="detail">
            <div className="detail-title">
              Tax Amount&nbsp;
                <ShowTaxesComponent 
                  taxes={
                    orderData?.igst ? {igst:orderData?.igst} : {cgst:orderData?.cgst,sgst:orderData?.sgst}} 
                />:
            </div>
            <div className="detail-amt">
              <PriceDisplay amount={orderData?.tax_amount} />
            </div>
        </div>

          <hr />
          <div className="detail">
            <div className="detail-title detail-total">Final Price</div>
            <div className="detail-amt total-amt"><PriceDisplay amount={orderData?.total_amount} /></div>
          </div>

            <hr />

            <div className="detail">
              <div className="detail-title detail-total"></div>
              
              <div className="detail-amt total-amt mark-as-paid">
                <Checkbox
                  color="success"
                  icon={<BsCheck2Circle color="white" size={16} />}
                  checked={isMarkedPaid}
                  disabled={isMarkedPaid}
                  onChange={(e) => {
                    Swal.fire({
                      title:"Are you sure?",
                      text:`Do you want to mark this order as paid.`,
                      icon:"warning",
                      showCancelButton:true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: `Mark as paid`
                    }).then(async (result) => {
                      if(result.isConfirmed){
                        await apiClient.put(`orders/${orderId}/mark-as-paid/`,{
                          is_paid:true
                        })
                        .then((response) => {
                          setIsMarkedPaid(true);

                          setOrderData((prevState) => ({...prevState,is_paid:true}))

                          toast.success("Order is marked as paid")
                        })
                        .catch((error) => {
                          toast.error("Failed to mark order as paid.")
                        })
                      }
                    })
                  }}
                  label={isMarkedPaid ? "Marked as paid" : "Mark as paid"}
                />
              </div>
            </div>

            

          { <>              
              {orderStatusChangeButtons?.length > 0 ? <hr /> :null}

              

              {
                orderStatusChangeButtons?.map(({button,status},index) => (
                  <Button.Ripple
                    color={button.buttonClass}
                    block
                    className="btn-block mt-1"
                    onClick={e => {
                      setNextStatus(status)
                      onChangeStatusButtonPress(status)
                    }}
                    key={index}
                  >
                    {button.getIcon(18, 'white')}
                    {" "}{button.buttonLabel }
                  </Button.Ripple>
                ))
              }

              {nextStatusVariables && (
                <Modal
                  isOpen={isStateVariableModalVisible}
                  toggle={toggleStateVariableModal}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={toggleStateVariableModal}>
                    Add Relevant Information:
                  </ModalHeader>
                  <ModalBody>
                      <DynamicForm
                        schema={{
                          fields: nextStatusVariables.map(sv => ({
                            type: sv.data_type,
                            name: sv.id,
                            label: sv.name,
                          }))
                        }}
                        save_button_label = {nextStatusDisplayData.buttonLabel}
                        // initialValues={{
                        //   business_name: '',}}
                        errors= {{
                            fields: {},
                            global: "",
                          }}
                        onSubmit={(data, setSubmitting) => {
                          // setSubmitting(true);
                          changeOrderStatus(nextStatus, data)
                          toggleStateVariableModal()
                        }}
                      />

                  </ModalBody>
                </Modal>
              )}
 
            </>
          }

          {isAllowedToGenerateInvoice(invoice_options.generate_at_status).includes(orderData.order_status) && 
              <Button.Ripple color="warning" block className="btn-block mt-2" onClick={orderData?.invoice?.order ? () => window.open(getMediaURL(orderData?.invoice?.invoice_pdf),'_blank'): handleGenerateInvoice}>
              {/* <Button.Ripple color="warning" block className="btn-block mt-2" onClick={handleGenerateInvoice}> */}
                <BsReceipt size={20} color={"white"} />
                {orderData?.invoice?.order ? " View Invoice" :" Generate Invoice" }
              </Button.Ripple>
          }

          </CardBody>
      </Card>
    </div>
  </div>
  </div>
  )
  }
    <ToastContainer />
  </>
}


const mapStateToProps = (state) => ({
  order_status_variables: state.auth.userInfo.profile.order_status_variables,
  order_status_options : state.auth.userInfo.profile.order_status_options,
  product_price_includes_taxes:state.auth.userInfo.profile.product_price_includes_taxes,
  invoice_options:state.auth.userInfo.profile.invoice_options
});

export default connect(mapStateToProps)(OrderDetails);
