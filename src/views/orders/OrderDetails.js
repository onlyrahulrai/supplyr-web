import "assets/scss/pages/app-ecommerce-shop.scss";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
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

import {OrdersApi} from "api/endpoints"
import {getMediaURL} from "api/utils"
import VariantLabel from "components/inventory/VariantLabel"
import Address from "components/inventory/Address"
import ProductDummyImage from "assets/img/svg/cart.svg"
// import { productsList } from "./cartData";



export default function OrderDetails() {

  const {orderId} = useParams()
  console.log({orderId})

  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    OrdersApi.retrieve(orderId)
      .then(response => {
        setOrderData(response.data)
        console.log("sds ", response.data)
      })
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


  return orderData && (
    <div className="ecommerce-application">

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
                <h3>{item.product_variant.product.title}</h3>
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
    </div>










    <div className="checkout-options">
      <Card>
        <CardBody>
        <Row className="mb-1">
          <Col>
            <h6 className="text-secondary">Order ID</h6>
            <h3>#{orderId}</h3>
          </Col>
          <Col sm="auto" className="ml-auto text-right">
            <h6 className='text-secondary'>From</h6>
            <h3>{orderData.buyer_name}</h3>
          </Col>
        </Row>

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
          <Button.Ripple
            type="submit"
            block
            color="primary"
            className="btn-block"
            onClick={() => this.handleActiveStep(1)}>
            Place Order
          </Button.Ripple>
        </CardBody>
      </Card>
    </div>
  </div>
  </div>
  );
}
