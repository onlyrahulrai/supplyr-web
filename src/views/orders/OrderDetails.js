import "assets/scss/pages/app-ecommerce-shop.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

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
import {BsClockHistory, BsCheckAll, BsCheck, BsTrash, BsReceipt, BsPencil} from "react-icons/bs"
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

function OrderStatus({status_code, size=16}) {

  const statusDisplayData = statusDisplayDict[status_code]
  return (
    <Row>
         <Col sm="auto">
          <span>{statusDisplayData.getIcon(size)} &nbsp;</span>
          <span style={{fontSize: size, color: statusDisplayData.color}}>{statusDisplayData.name}</span>
         </Col>
    </Row>
  )
}

function OrderDetails({order_status_variables,order_status_options}) {

  const {orderId} = useParams()
  // console.log({orderId})

  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(null)

  /* ------ Order Status Variable Start ----- */
  const [orderStatusVariableData,setOrderStatusVariableData] = useState(null);
  const [toggleOrderStatusVariableDataModal,setToggleOrderStatusVariableDataModal] = useState(false)
  const [isFormLoading,setIsFormLoading] = useState(false)
  /* ------ Order Status Variable End ----- */

  const fetchOrderData = () => {
    OrdersApi.retrieve(orderId)
    .then(response => {

      // replace the order state object to order state name
      const state_name = response.data?.address?.state.name;
      const _address = response.data.address ? {...response.data.address,state:state_name} : null;
      const data = {...response.data,address:_address};


      setOrderData(data)
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

  let totals = orderData?.items.reduce((sum, item) => {
    const actualPrice = parseFloat(item.actual_price) * item.quantity
    const salePrice = parseFloat(item.price) * item.quantity
    const _sum = {
      actualPrice: sum.actualPrice + actualPrice,
      salePrice: sum.salePrice + salePrice,
    }
    return _sum
  },
    {
      actualPrice: 0,
      salePrice: 0
    }
  );

  const orderStatuses = ['awaiting_approval', 'approved', 'processed', 'dispatched', 'delivered',"cancelled"] // Skipped 'cancelled' here as it has separate control

  // order status change Start
  const nextStatus = orderStatuses[orderStatuses.findIndex(s => s === orderData?.order_status) + 1]
  const orderCurrentStatusOptions = order_status_options.find((so) => so.slug === orderData?.order_status)
  // order status change End
  
  const orderStatusChangeButtons = orderCurrentStatusOptions?.transitions_possible.map((possibility) => ({button:statusDisplayDict[possibility],status:possibility}))
  const nextStatusDisplayData = statusDisplayDict[nextStatus]
  const nextStatusVariables = order_status_variables[nextStatus] 
  const [isHiddenControlsVisible, setIsHiddenControlsVisible] = useState(null)

  const [isStateVariableModalVisible, setIsStateVariableModalVisible] = useState(false)
  const toggleStateVariableModal = () => setIsStateVariableModalVisible(!isStateVariableModalVisible)


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



  const onCancel = () => {
    Swal.fire({
      title: 'Are you sure you want to cancel this order?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel Order!'
    }).then(result => {
      if (result.value){
        OrdersApi.cancel(orderId)
          .then(r => {
            fetchOrderData()
          })
      }
      return false;
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
      history.push(`/orders/${orderId}/invoice/${response.data.id}`)
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
            breadCrumbParent= {<a href="#" onClick={e => {e.preventDefault(); history.push(`/orders/`)}}>All Orders</a>}
            breadCrumbActive = {`${orderData.order_number} ${orderData.buyer_name ? `(${orderData.buyer_name})` : ""}`}
          />
        </Col>
        <Col sm="4" md="2" className="edit-order-btn">
            {
              (orderData?.order_status === "awaiting_approval" || orderData?.order_status === "approved") && (
                <Button.Ripple
                  color='primary'
                  outline
                  block
                  className="btn-block"
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
          <div className="card-content" style={{gridTemplateColumns: "0.5fr 3fr 1fr"}}>
            <div className="item-img text-center">
              <img src={item.product_variant.featured_image ? getMediaURL(item.product_variant.featured_image) : ProductDummyImage} className="img-fluid img-100" alt="Product" />
            </div>
            <CardBody>
              <div className="item-name">
                <a href="#" onClick={e => {e.preventDefault(); history.push(`/product/${item.product_variant.product.id}`)}}>
                <h3>{item.product_variant.product.title}</h3>
                </a>


                <div className="d-flex">
                  <span className="border-right pr-1"><Translatable text="quantity" />: {item?.quantity}</span>

                  {
                    Math.floor(item?.extra_discount) ? (
                      <span className="ml-1">Extra Discount: <PriceDisplay amount={item?.extra_discount || 0} /></span>
                    ):("")
                  }
                </div>
                {item.product_variant.product.has_multiple_variants &&
                  <div className="item-company">
                    <div className="company-name">
                      <VariantLabel
                        variantData={item.product_variant}
                        />
                      </div>
                  </div>
                }
              </div>

              {!!item?.item_note &&
                <div className="item-note">
                  <b style={{color: '#000'}}><i>Item Note:</i> </b> &nbsp; {item.item_note}
                </div>
                }
            </CardBody>
            <div className="item-options m-auto">
              <div className="item-wrapper">
                <div className="item-cost">
                  <h5 className=""><PriceDisplay amount={item.price} /></h5>
                  { item.actual_price !== item.price &&
                    <h6><del className="strikethrough text-secondary"><PriceDisplay amount={item.actual_price} /></del></h6>
                  }
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
            <h6 className='text-secondary'>From</h6>
            <h3>{orderData.buyer_name}</h3>
          </Col>
        </Row>

        <hr/>
        <h6 className="text-secondary">STATUS</h6>
        <h3><OrderStatus status_code={orderData.order_status} /></h3>

          <hr />
          <h6 className="text-secondary">SHIPPING ADDRESS</h6>
          {
            (orderData.address) ? (
              <Address
                {...orderData.address}
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
            <div className="detail-title">Price</div>
            <div className="detail-amt"><PriceDisplay amount={totals.salePrice} /></div>
          </div>
          {/* <div className="detail">
            <div className="detail-title">Discount</div>
            <div className="detail-amt discount-amt"><PriceDisplay amount={totals.actualPrice - totals.salePrice} /></div>
          </div> */}

          

          
              <div className="detail">
                <div className="detail-title">Extra Discount</div>
                <div className="detail-amt discount-amt"><PriceDisplay amount={orderData?.total_extra_discount || 0} /></div>
              </div>
           
          

          <hr />
          <div className="detail">
            <div className="detail-title detail-total">Final Price</div>
            <div className="detail-amt total-amt"><PriceDisplay amount={totals.salePrice - (orderData?.total_extra_discount || 0)} /></div>
          </div>

          <hr />
          {
            <>
              {
                orderStatusChangeButtons.map(({button,status},index) => (
                  <Button.Ripple
                    color={button.buttonClass}
                    block
                    className="btn-block mt-1"
                    onClick={e => onChangeStatusButtonPress(status)}
                    key={index}
                  >
                    {button.getIcon(18, 'white')}
                    {/* {console.log(" Next status display data: ",nextStatusDisplayData)} */}
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
 
              {isHiddenControlsVisible && 
                <Row>
                {orderStatuses.filter(status => status!==nextStatus && status !=orderData?.order_status).map(status => {
                  const _displayData = statusDisplayDict[status]  
                  return (
                  <Col>
                  <Button.Ripple
                    color={_displayData.buttonClass}
                    block
                    className="btn-block mb-1"
                    onClick={e => onAction('change_status', status)}
                  >
                    {_displayData.getIcon(18, 'white')}
                    {" "}{_displayData.buttonLabel}
                  </Button.Ripple>
                  </Col>
                )}
                )}
                <Col>
                  <Button.Ripple
                    color='danger'
                    block
                    className="btn-block"
                    onClick={onCancel}
                  >
                    {statusDisplayDict['cancelled'].getIcon(18, 'white')}
                    {" "}{statusDisplayDict['cancelled'].buttonLabel}
                  </Button.Ripple>
                </Col>
                </Row>
              }

            </>
          }

          {['processed', 'dispatched', 'delivered'].includes(orderData.order_status) &&
              
              <Button.Ripple color="warning" block className="btn-block mt-2" onClick={handleGenerateInvoice}>
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
  </>
}


const mapStateToProps = (state) => ({
  order_status_variables: state.auth.userInfo.profile.order_status_variables,
  order_status_options : state.auth.userInfo.profile.order_status_options,
});

export default connect(mapStateToProps)(OrderDetails);
