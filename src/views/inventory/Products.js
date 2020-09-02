import React from "react"
import { Row, Col, Card, CardBody, Badge, Button, PaginationLink, PaginationItem, Pagination, Spinner} from "reactstrap"
import {history} from "../../history"
import Breacrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import apiClient from "api/base";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Edit, PlusCircle, ChevronLeft, ChevronRight } from "react-feather";
import "assets/scss/pages/app-ecommerce-shop.scss"
import { getApiURL } from "api/utils";
import { RiCheckboxMultipleBlankLine, RiFileList3Line } from 'react-icons/ri'
import { FaShoppingCart } from 'react-icons/fa'


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
                  {product.has_multiple_variants &&
                    <Badge color="info" title="This product has multiple variants" className="badge-md">
                      <RiCheckboxMultipleBlankLine />
                    </Badge>
                  } 
                  {!product.has_multiple_variants && product.quantity > 0 && 
                    <b>Qty: <span className="text-success">{product.quantity}</span></b>
                  }
                  {!product.has_multiple_variants && product.quantity === 0 && 
                    <b className="text-danger">Out Of Stock</b>
                  }
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
                <RiFileList3Line size="16" />
                <span className="align-middle ml-50">View</span>
              </Link>
              <Link to={`/inventory/edit/${ product.id }`} className="cart">
                <Edit size={15} />
                <span className="align-middle ml-50">
                    Edit Details
                </span>
              </Link>
            </div>
          </div>
        </Card>
    )
  }
}

class ProductsList extends React.Component{
  state = {
    view: "grid-view", //Options: grid-view & list-view 
    products: {},
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
  }

  baseUrl = "inventory/products/";

  componentDidMount() {
    this.setState({ isLoading: true})
    apiClient.get(this.baseUrl)
      .then(response => {
        const _response = response.data
        console.log('resp', _response)
        this.setState({totalPages: _response.total_pages})
        this.setState({ products: 
          {1: _response.data} //Set data for page 1 on component mount
        })
        this.setState({isLoading: false})
      })
  }

  switchPage(pageNumber) {
    console.log('pn', pageNumber, this.state.products)
    window.ss = this.state.products
    if(!this.state.products[pageNumber]?.length) {
      this.setState({ isLoading: true })
      apiClient.get(this.baseUrl+`?page=${pageNumber}`)
        .then(response => {
          const _response = response.data
          // this.setState({totalPages: _response.total_pages})
          this.setState({
            totalPages: _response.total_pages,
            products: {
              ...this.state.products, [pageNumber]: _response.data
            },
            isLoading: false,
          })
        })
    }
    this.setState({
      currentPage: pageNumber
    })
  }

  render() {
    const currentPage = this.state.currentPage
    const products = this.state.products
    const currentProductsList = products[currentPage]
    let renderedCurrentProductsList = ""
    if(!currentProductsList?.length){
      if(this.state.isLoading){
        renderedCurrentProductsList = (
          <div className="text-center my-5">
            <FaShoppingCart size="200" color="#dadfe4" />
            
            <h1 className="mt-2 secondary display-4 display-flex">
            <Spinner size="lg" type="grow" color="#4443" className="mr-1 " />
            <span>Loading</span>
            </h1>
          </div>
        )
      }
      else {
        renderedCurrentProductsList = (
          <div className="text-center my-5">
            <ShoppingCart size="200" color="#4443" className='m-auto' />
            <h1 className="mt-2 secondary display-4">No Products</h1>
          </div>
        )
      }
    }
    else {
      renderedCurrentProductsList = (
        <div id="ecommerce-products" className={this.state.view}>
        {products[currentPage]?.map(product => <ProductListItem data={product} key={product.id} />)}
        </div>
        )
    }
    return (
      <React.Fragment>
        <Breacrumbs
          breadCrumbTitle="All Products"
          breadCrumbParent="Inventory"
          breadCrumbActive="Products"
          rightSection={
            <Button color="primary" onClick={e => {e.preventDefault(); history.push("/inventory/add")}}><PlusCircle size="20" className="mr-1"/> Add</Button>
          }
        />
        <div className="ecommerce-application">
          <div className="shop-content-RMV">
            <Row>
              <Col sm="12">
                  {
                    renderedCurrentProductsList
                  }
              </Col>
              <Col sm="12">
              <div className="ecommerce-pagination">
                <Pagination className="d-flex justify-content-center mt-2">
                  <PaginationItem className="prev-item" disabled={currentPage <= 1} >
                    <PaginationLink href="#" onClick={e => this.switchPage(currentPage - 1)} first>
                      <ChevronLeft />
                    </PaginationLink>
                  </PaginationItem>

                  {[...Array(this.state.totalPages+1).keys()].slice(1).map(page_no => (
                    <PaginationItem key={page_no} active={currentPage === page_no}>
                      <PaginationLink href="#" onClick={e => this.switchPage(page_no)}>{page_no}</PaginationLink>
                    </PaginationItem>    
                  ))
                  }

                  <PaginationItem href="#" className="next-item" disabled={currentPage === this.state.totalPages}>
                    <PaginationLink href="#" onClick={e => this.switchPage(currentPage + 1)} last>
                      <ChevronRight />
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
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