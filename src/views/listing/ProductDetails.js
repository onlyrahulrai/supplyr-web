import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { Truck, ShoppingCart } from "react-feather";
import Breacrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import macbook from "assets/img/elements/macbook-pro.png";
import "swiper/css/swiper.css";
import "assets/scss/pages/app-ecommerce-shop.scss";
import apiClient from "api/base";
import Select from "react-select";

function getVariantShortDescription(variant) {
    
    const desc = [variant.option1_value, variant.option2_value, variant.option3_value].filter(Boolean).map((option, index) => {
      const label = variant['option'+(index+1)+'_name']
      const value = variant['option'+(index+1)+'_value']
      return (
        <span key={index}>
          {index == 0 || ', '}<b> <i>{label}: </i></b>
          {value}
        </span>
      )
    })
    return <div>{desc}</div>
}

function DetailPage(props) {
  let {id: productId} = useParams()

  const [productData, setProductData] = useState({})
  const [currentVariant, setCurrentVariant] = useState({})
  const [isMultiVariant, setIsMultiVariant] = useState(false)
  useEffect(() => {
    const url = 'inventory/product/' + productId
    apiClient.get(url)
      .then(response => {
        setProductData(response.data)
        const multiVariant = response.data.variants_data.multiple
        setIsMultiVariant(multiVariant)
        setCurrentVariant(
          multiVariant ? response.data.variants_data.data[0] : response.data.variants_data.data
        )
      })
  }, [])

  const productPriceDisplay = currentVariant.sale_price
            ? (<>
              <del className="text-lightgray h6">&#8377;{currentVariant.price}</del>
              <span className="ml-1">&#8377;{currentVariant.sale_price}</span>
              </>
            )
            : (
              <span>&#8377;{currentVariant.price}</span>
            )
  
  const isProductInStock = currentVariant.quantity > 0


console.log('isMultiVariant', isMultiVariant, productData.variants_data?.multiple)

const customStyles = {
  control: base => ({
    ...base,
    height: 60,
    minHeight: 60,
    'z-index': 1111111,
    div: {
      overflow: 'initial'
    }
  })
};
  return (
    Object.keys(currentVariant).length !==0 &&
    <React.Fragment>
      <Breacrumbs
        breadCrumbTitle="Product Detail"
        breadCrumbParent={productData.owner?.business_name}
        breadCrumbActive={productData.title}
      />
      <Card className="overflow-hidden app-ecommerce-details">
        <CardBody className="pb-0">
          <Row className="mb-5 mt-2">
            <Col
              className="d-flex align-items-center justify-content-center mb-2 mb-md-0"
              sm="12"
              md="5"
            >
              <img src={macbook} alt="Google Home" height="250" width="250" />
            </Col>
            <Col md="7" sm="12">
              <h3>{productData.title}</h3>
              <p className="text-muted">by {productData.owner?.business_name}</p>
              <div className="d-flex flex-wrap">
                <h3 className="text-primary">{productPriceDisplay}</h3>
              </div>
              <hr />
              <blockquote className="blockquote pl-1 border-left-secondary border-left-3">
                <div dangerouslySetInnerHTML={{__html: productData.description}} />
              </blockquote>
              {/* <ul className="list-unstyled">
                <li className="mb-50">
                  <Truck size={15} />
                  <span className="align-middle font-weight-bold ml-50">
                    Next Day Delivery 
                  </span>
                </li>
              </ul> */}
              <hr />
              {isMultiVariant && 
              <>
                <h4>Variants</h4>
                <Select
                  options={
                    productData.variants_data.data.map(variant => {
                      const label = (
                        <div>
                          <img src="https://picsum.photos/50" className="float-left mr-1" />
                          <div>{getVariantShortDescription(variant)}</div>
                          <div className="text-gray">&#8377; {variant.price}</div>
                        </div>
                      )
                      return {
                        label: label,
                        value: variant.id
                      }
                    })
                  }
                  defaultValue = {
                    {
                      label: getVariantShortDescription(currentVariant),
                      value: currentVariant.id
                    }
                  }
                  onChange = {data => {
                    let variantId = data.value
                    let variant = productData.variants_data.data.filter(variant => variant.id === variantId)[0]
                    setCurrentVariant(variant)
                  }}
                  styles={customStyles}
                />
                <hr />
              </>
              }

              <p className="my-50">
                <span>Availablity</span>
                <span className="mx-50">-</span>
                {isProductInStock
                ? (<span className="text-success">In Stock</span>)
                : (<span className="text-danger">Out Of Stock</span>)
                  
                }
              </p>
              <div className="action-btns">
                <Button.Ripple className="mr-1 mb-1" color="primary">
                  <ShoppingCart size={15} />
                  <span className="align-middle ml-50">ADD TO CART</span>
                </Button.Ripple>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
    
  );
}
export default DetailPage;
