import { getApiURL } from "api/utils";
import React from "react";
import { ArrowLeft, Plus } from "react-feather";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import _Swal from "sweetalert2";
import { loadProductOptions } from "./loadOptions";

import withReactContent from "sweetalert2-react-content";
import Select from "react-select";

const Swal = withReactContent(_Swal);

const AddProductVariant = (props) => {
  const {
    selectedProduct,
    setSelectedProduct,
    item,
    setItem,
    setToggleButton,
    setItems,
    products,
    variants,
    setVariants,
  } = props;


  const formatOptionLabel = ({}) => {
    return (
      <div className="select-product">
        <img
          src={getApiURL(props.featured_image)}
          alt="featured"
          className="float-left mr-1 img-40"
        />
        <div>{props.title}</div>
        <div className="text-lightgray">
          {props.quantity > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>
    );
  };


  // const validateForm = () => {
  //   let errors = [];
  //   console.log("variant data >>>>>>> ", variantData);
  //   if (!variantData?.variant_id) {
  //     errors.push("Please select the product!");
  //   }
  //   if (!variantData?.quantity) {
  //     errors.push("Please add the quantity");
  //   }
  //   if (errors.length > 0) {
  //     Swal.fire(
  //       <div>
  //         <div>Error!</div>
  //         <h4>Please correct the following errors</h4>
  //         {errors.map((error, index) => (
  //           <h6 className="text-danger" key={index}>
  //             {error}{" "}
  //           </h6>
  //         ))}
  //       </div>
  //     );
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

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

  const handleClick = () => {
    // const is_valid = validateForm();
    // if (is_valid) {
    setItems((prevState) => [...prevState, item]);
    setItem({});
    setSelectedProduct("");
    setToggleButton(false);
    // }
  };

  console.log("products >>>>> ",products );

  return (
    <Card className="select-product-input">
      <CardHeader>
        <div className="d-flex">
          <span
            className="mr-1 cursor-pointer"
            onClick={() => setToggleButton(false)}
          >
            <ArrowLeft size="15" />
          </span>

          <span>Add Product</span>
        </div>
      </CardHeader>
      <CardBody>
        <FormGroup>
          <Label for={`item-name`}>Product Name</Label>
          {/* {console.log(loadProductOptions())} */}
          <Select
            additional={{ page: 1 }}
            name="product"
            value={selectedProduct}
            onChange={(data) => {
              
              setSelectedProduct(data)
            }}
            options={products.map((product) => {
              let label = (
                <div className="select-product">
                  <img
                    src={getApiURL(product.featured_image)}
                    alt="featured"
                    className="float-left mr-1 img-40"
                  />
                  <div>{product.title}</div>
                  <div className="text-lightgray">
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
              );
                return {
                  label: label,
                  value: product.id
                }

            })}
            styles={customStyles}
          />
        </FormGroup>

        {selectedProduct.is_multiple  && item && (
          // <>
          // {
          //   console.log("selectedData product >>>>>>>>>> ",productData?.variants_data?.data.map((variant) => ))
          // }
          // </>
          // <FormGroup className="ml-1">
          //   <Label for="">Variants</Label>
          //   <Select
          //     options={productData?.variants_data?.data.map((variant) => {
          //       const label = (
          //         <div>
          //           <img
          //             src={
          //               variant.featured_image
          //                 ? getApiURL(
          //                     productData.images?.find(
          //                       (image) => image.id === variant.featured_image
          //                     )?.image
          //                   )
          //                 : ""
          //             }
          //             alt="featured"
          //             className="float-left mr-1 img-40"
          //           />
          //           <div>{getVariantShortDescription(variant)}</div>
          //           <div className="text-lightgray">
          //             &#8377; {variant.price}
          //           </div>
          //         </div>
          //       );
          //       return {
          //         label: label,
          //         value: variant.id,
          //       };
          //     })}
          //     defaultValue={
          //       {
          //         label:getVariantShortDescription( item.product_variant),
          //         value: item?.product_variant?.id
          //       }
          //     }
          //     onChange={(data) => {
          //       let variantId = data.value
          //       fetchVariantDetail(variantId)
          //     }}
          //     styles={customStyles}
          //   />
          //   {console.log("item from add product variant >>> ")}
          // </FormGroup>
          <h3>Hello world</h3>
        )}

        <FormGroup>
          <Label for={`quantity`}>Quantity</Label>

          <Input
            type="number"
            placeholder="1"
            name="quantity"
            value={item?.quantity || ""}
            onChange={(e) =>
              setItem((prevState) => ({
                ...prevState,
                [e.target.name]: parseInt(e.target.value),
              }))
            }
          />
          {/* <FormFeedback invalid>
              Sweet! that name is available
            </FormFeedback> */}
        </FormGroup>

        <Button.Ripple
          className="btn-icon"
          color="primary"
          outline
          onClick={handleClick}
          // disabled={product?.quantity <= 0}
        >
          <Plus size={14} />
          <span className="align-middle ml-25">Add New</span>
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default AddProductVariant;
