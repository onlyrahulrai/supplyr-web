import "assets/scss/pages/app-ecommerce-shop.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import {priceFormatter} from "utility/general"
import {
  Heart, Star,
  X
} from "react-feather";
import {
  Badge,
  Button, Card,
  CardBody,
  Col,
  Row
} from "reactstrap";

import { history } from "../../history"
import {OrdersApi} from "api/endpoints"
import {getMediaURL} from "api/utils"
import VariantLabel from "components/inventory/VariantLabel"
import Address from "components/inventory/Address"
import ProductDummyImage from "assets/img/svg/cart.svg"
import {BsClockHistory, BsCheckAll, BsCheck, BsTrash, BsFillCaretDownFill} from "react-icons/bs"
import {RiTruckLine} from "react-icons/ri"
import Swal from "utility/sweetalert"
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb"
import OrderTimeline from "components/common/OrderTimeline"
// import { productsList } from "./cartData";

const statusDisplayDict = {
  awaiting_approval: {
    name: "Awaiting Approval",
    getIcon: (size, color) => (<BsClockHistory size={size} color={color ?? "orange"} />),
    color: 'orange',
    buttonClass: 'light',
    buttonLabel: 'Mark Unapproved'
  },
  approved: {
    name: "Approved",
    getIcon: (size, color) => (<BsCheck size={size} color={color ?? "blue"} />),
    color: 'blue',
    buttonClass: 'primary',
    buttonLabel: 'Mark Approved'
  },
  dispatched: {
    name: "Dispatched",
    getIcon: (size, color) => (<RiTruckLine size={size} color={color ?? "blue"} />),
    color: 'blue',
    buttonClass: 'primary',
    buttonLabel: 'Mark Dispatched'
  },
  delivered: {
    name: "Delivered",
    getIcon: (size, color) => (<BsCheckAll size={size} color={color ?? "darkseagreen"} />),
    color: 'darkseagreen',
    buttonClass: 'success',
    buttonLabel: 'Mark Delivered'
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


export default function OrderDetails() {

  const {orderId} = useParams()
  console.log({orderId})

  const [orderData, setOrderData] = useState(null)

  const fetchOrderData = () => {
    OrdersApi.retrieve(orderId)
    .then(response => {
      setOrderData(response.data)
      console.log("sds ", response.data)
    })
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  let totals = orderData?.items.reduce((sum, item) => {
    const actualPrice = parseFloat(item.price) * item.quantity
    const salePrice = parseFloat(item.sale_price) * item.quantity
    const _sum = {
      price: sum.price + actualPrice,
      salePrice: sum.salePrice + salePrice,
    }
    return _sum
  },
    {
      price: 0,
      salePrice: 0
    }
  );


  const orderStatuses = ['awaiting_approval', 'approved', 'dispatched', 'delivered'] // Skipped 'cancelled' here as it has separate control
  const nextStatus = orderStatuses[orderStatuses.findIndex(s => s === orderData?.order_status) + 1]
  const nextStatusDisplayData = statusDisplayDict[nextStatus]
  const [isHiddenControlsVisible, setIsHiddenControlsVisible] = useState(null)


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



  return orderData && (
    <div className="ecommerce-application">
    <BreadCrumb
      breadCrumbTitle={"Order #" + orderId}
      breadCrumbParent= {<a href="#" onClick={e => {e.preventDefault(); history.push(`/orders/`)}}>All Orders</a>}
      breadCrumbActive = {`#${orderId} (${orderData.buyer_name})`}
    />
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
                {item.product_variant.product.has_multiple_variants &&
                  <p className="item-company">
                    <span className="company-name">
                      <VariantLabel
                        variantData={item.product_variant}
                        />
                      </span>
                  </p>
                }
                <div className="item-quantity">
                  <p className="quantity-title">Quantity: {item.quantity}</p>

                </div>
                <p className="delivery-date">{item.deliveryBy}</p>
                <p className="offers">{item.offers}</p>
              </div>
            </CardBody>
            <div className="item-options m-auto">
              <div className="item-wrapper">
                <div className="item-cost">
                  <h5 className="">{priceFormatter(item.sale_price)}</h5>
                  { item.sale_price !== item.price &&
                    <h6><del className="strikethrough text-secondary">{priceFormatter(item.price)}</del></h6>
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
            data={orderData.history.concat([
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
            <h3>#{orderId}</h3>
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
          <Address
            {...orderData.address}
          />
          <hr />
          <div className="price-details">
            <p>Price Details</p>
          </div>
          <div className="detail">
            <div className="detail-title">Total MRP</div>
            <div className="detail-amt">{priceFormatter(totals.price)}</div>
          </div>
          <div className="detail">
            <div className="detail-title">Discount</div>
            <div className="detail-amt discount-amt">{priceFormatter(totals.price - totals.salePrice)}</div>
          </div>

          <hr />
          <div className="detail">
            <div className="detail-title detail-total">Final Price</div>
            <div className="detail-amt total-amt">{priceFormatter(totals.salePrice)}</div>
          </div>

          <hr />
          {!['cancelled', 'delivered'].includes(orderData?.order_status) &&
          <>
          {nextStatus && nextStatus !== 'cancelled' &&
            <Button.Ripple
              color={nextStatusDisplayData.buttonClass}
              block
              className="btn-block"
              onClick={e => onAction('change_status', nextStatus)}
            >
              {nextStatusDisplayData.getIcon(18, 'white')}
              {" "}{nextStatusDisplayData.buttonLabel}
            </Button.Ripple>
          }
          <br />

          {!isHiddenControlsVisible &&
          <Button.Ripple
            type="submit"
            block
            color="dark"
            outline
            className="btn-block"
            onClick={() => setIsHiddenControlsVisible(true)}>
            More <BsFillCaretDownFill />
          </Button.Ripple>
          }

          {isHiddenControlsVisible && 
            <Row>
            {orderStatuses.filter(status => status!==nextStatus && status !=orderData?.order_status).map(status => {
              const _displayData = statusDisplayDict[status]  
              return (
              <Col>
              <Button.Ripple
                color={_displayData.buttonClass}
                block
                className="btn-block"
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

          </CardBody>
      </Card>
    </div>
  </div>
  </div>
  );
}
