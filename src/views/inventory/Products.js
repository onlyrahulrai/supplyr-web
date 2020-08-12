import React from "react"
import { Row, Col, Card, CardBody, Badge} from "reactstrap"
import {history} from "../../history"
import Breacrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import apiClient from "api/base";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "react-feather";
import "assets/scss/pages/app-ecommerce-shop.scss"



class ProductListItem extends React.Component {
  render() {
    const product = this.props.data
    return (
      <Card className="ecommerce-card">
          <div className="card-content">
            <div className="item-img text-center">
              <Link to="/ecommerce/product-detail">
                <img
                  className="img-fluid"
                  src={product.img}
                  alt={product.name}
                />
              </Link>
            </div>
            <CardBody>
              <div className="item-wrapper">
                <div className="item-rating">
                  <Badge color="primary" className="badge-md">
                    <span className="mr-50 align-middle">4</span>
                    <Star size={14} />
                  </Badge>
                </div>
                <div className="product-price">
                  <h6 className="item-price">{product.price}</h6>
                </div>
              </div>
              <div className="item-name">
                <Link to="/ecommerce/product-detail">
                  {" "}
                  <span>{product.name}</span>
                </Link>
                <p className="item-company">
                  By <span className="company-name">{product.by}</span>
                </p>
              </div>
              <div className="item-desc">
                <p className="item-description">{product.desc}</p>
              </div>
            </CardBody>
            <div className="item-options text-center">
              <div className="item-wrapper">
                <div className="item-rating">
                  <Badge color="primary" className="badge-md">
                    <span className="mr-50 align-middle">4</span>
                    <Star size={14} />
                  </Badge>
                </div>
                <div className="product-price">
                  <h6 className="item-price">{product.price}</h6>
                </div>
              </div>
              <div className="wishlist">
                <Heart

                />
                <span className="align-middle ml-50">Wishlist</span>
              </div>
              <div className="cart">
                <ShoppingCart size={15} />
                <span className="align-middle ml-50">
                    Add to cart
                </span>
              </div>
            </div>
          </div>
        </Card>
    )
  }
}

class ProductsList extends React.Component{
  state = {
    products: [],
  }

  componentDidMount() {
    apiClient.get("/inventory/products/")
      .then(response => {
        this.setState({ products: response.data})
      })
  }

  render() {
    console.log('products ', this.state.products)
    return (
      <React.Fragment>
        <Breacrumbs
          breadCrumbTitle="All Products"
          breadCrumbParent="Profile Name"
          breadCrumbActive="Products"
        />
        <div className="ecommerce-application">
          <div className="shop-content">
            <Row>
              <Col sm="12">
                <div id="ecommerce-products" className={this.state.view}>
                  {
                    this.state.products.map(product => <ProductListItem data={product} key={product.id} />)
                  }
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ProductsList