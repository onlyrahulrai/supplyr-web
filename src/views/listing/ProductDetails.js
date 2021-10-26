import { useParams } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Button,  } from "reactstrap";
import { ShoppingCart, Edit3, PlusCircle, Trash } from "react-feather";
// import "swiper/css/swiper.css";
import "assets/scss/pages/app-ecommerce-shop.scss";
import apiClient from "api/base";
import Select from "react-select";
import { history } from "../../history";
import { getApiURL } from "api/utils"
import _Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb"
import NetworkError from "components/common/NetworkError"
import Spinner from "components/@vuexy/spinner/Loading-spinner"

const Swal = withReactContent(_Swal)

function getVariantShortDescription(variant) {
    
    const desc = [variant.option1_value, variant.option2_value, variant.option3_value].filter(Boolean).map((option, index) => {
      const label = variant['option'+(index+1)+'_name']
      const value = variant['option'+(index+1)+'_value']
      return (
        <span key={index}>
          {index === 0 || ', '}<b> <i>{label}: </i></b>
          {value}
        </span>
      )
    })
    return <div>{desc}</div>
}

function DetailPage(props) {
  let {slug: productSlug} = useParams()

  const [productData, setProductData] = useState({})
  const [currentVariant, setCurrentVariant] = useState({})
  const [isMultiVariant, setIsMultiVariant] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(null)
  useEffect(() => {
    const url = 'inventory/product/' + productSlug
    apiClient.get(url)
      .then(response => {
        setProductData(response.data)
        const multiVariant = response.data.variants_data.multiple
        setIsMultiVariant(multiVariant)
        setCurrentVariant(
          multiVariant ? response.data.variants_data.data[0] : response.data.variants_data.data
        )
      })
      .catch(error => {
        setLoadingError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const productPriceDisplay = currentVariant.price
            ? (<>
              <del className="text-lightgray h6">&#8377;{currentVariant.actual_price}</del>
              <span className="ml-1">&#8377;{currentVariant.price}</span>
              </>
            )
            : (
              <span>&#8377;{currentVariant.actual_price}</span>
            )
  
  const isProductInStock = currentVariant.quantity > 0


console.log('isMultiVariant', isMultiVariant, productData.variants_data?.multiple)

const customStyles = {
  control: base => ({
    ...base,
    height: 60,
    minHeight: 60,
    div: {
      overflow: 'initial'
    }
  })
};
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
  
  {Object.keys(currentVariant).length !==0 &&
  <Fragment>
        <BreadCrumb
          breadCrumbTitle="Product Details"
          breadCrumbParent= {<a href="#" onClick={e => {e.preventDefault(); history.push(`/products/`)}}>All Products</a>}
          breadCrumbActive = {productData.title}
          rightSection={<>
            <Button.Ripple className="mr-1 mb-1" color="warning" onClick={e => history.push('/product/' + productData.slug + '/edit/')}>
              <Edit3 size={15} />
              <span className="align-middle ml-50">Edit</span>
            </Button.Ripple>

            <Button.Ripple className="mr-1 mb-1" color="danger" onClick={(e) => {
              return Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, delete product!'
              }).then(result => {
                if (result.value) {
                  apiClient.post('/inventory/delete/', {
                    id: productData.id
                  })
                    .then(result => {
                      if (result.data.success) {
                        history.push('/inventory')
                        Swal.fire("Product Deleted !")
                      }
                    })
                }
                return false;
              })
            }}>
              <Trash size={15} />
              <span className="align-middle ml-50">Delete Product</span>
            </Button.Ripple>

            <Button.Ripple className="mr-1 mb-1" color="success" onClick={e => history.push('/products/add/')}>
              <PlusCircle size={15} />
              <span className="align-middle ml-50">Add New Product</span>
            </Button.Ripple>

          </>}
        />
    <Card className="app-ecommerce-details">
      <CardBody className="pb-0">
        <Row className="mb-5 mt-2">
          <Col
            className="d-flex align-items-center justify-content-center mb-2 mb-md-0"
            sm="12"
            md="5"
          >
            {productData.images.length > 0 &&

            <Row>
            {productData.images.map(image => {
              return (<Col md="4">
                <img className="w-100" alt='' src={getApiURL(image.image)} />
              </Col>)
            })}
            </Row>
            }
            {productData.images.length === 0 && 
            <ShoppingCart size="300" color="#4442" />
            }
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
                        <img src={variant.featured_image ? getApiURL(productData.images?.find(image => image.id === variant.featured_image)?.image ) : ''} alt='featured' className="float-left mr-1 img-40" />
                        <div>{getVariantShortDescription(variant)}</div>
                        <div className="text-lightgray">&#8377; {variant.price}</div>
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
              <span>Quanitities</span>
              <span className="mx-50">-</span>
              {isProductInStock
              ? (<strong className="text-success">{currentVariant.quantity} Units</strong>)
              : (<span className="text-danger">Out Of Stock</span>)
                
              }
            </p>

          </Col>
        </Row>
      </CardBody>
    </Card>
  </Fragment>
  }
  </>
}
export default DetailPage;
