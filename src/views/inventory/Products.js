import React from "react"
import { Row, Col, Card, CardBody, Badge, Button} from "reactstrap"
import {history} from "../../history"
import Breacrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import apiClient from "api/base";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Box, BookOpen, Edit } from "react-feather";
import "assets/scss/pages/app-ecommerce-shop.scss"
import { getApiURL } from "api/utils";



class ProductListItem extends React.Component {

  render() {
    const product = this.props.data
    const productPriceDisplay = (product.sale_price && product.sale_price < product.price)
    ? (<>
      <del className="text-lightgray font-small-2">&#8377;{product.price}</del>
      <span className="ml-1">&#8377;{product.sale_price}</span>
      </>
    )
    : (
      <span>&#8377;{product.price}</span>
    )
    return (
      <Card className="ecommerce-card">
          <div className="card-content">
            <div className="item-img text-center">
              <Link to={`/product/${ product.id }`}>
              { product.featured_image 
              ?
                <img
                  className="img-fluid"
                  src={getApiURL(product.featured_image)}
                  alt={product.title}
                />
              : <ShoppingCart size="150" color="#4442" className="mt-1" />
              }
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
                  <h6 className="item-price">{productPriceDisplay}</h6>
                </div>
              </div>
              <div className="item-name">
                <Link to="/ecommerce/product-detail">
                  {" "}
                  <span>{product.title}</span>
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
              <Link to={`/product/${ product.id }`} className="wishlist">
                <BookOpen />
                <span className="align-middle ml-50">View</span>
              </Link>
              <div className="cart">
                <Edit size={15} />
                <span className="align-middle ml-50">
                    Edit Details
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
    view: "grid-view",
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
          rightSection={
            <Button color="primary" onClick={e => {e.preventDefault(); history.push("/inventory/add")}}>+ Add</Button>
          }
        />
        <div className="ecommerce-application">
          <div className="shop-content-RMV">
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