import React from "react";
import Select from "react-select";
import { getApiURL } from "api/utils";
import { ArrowLeft, CheckCircle, Plus } from "react-feather";
import {useOrderAddContext} from "context/OrderAddContext";
import DefaultProductImage from "../../../assets/img/pages/default_product_image.png";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
} from "reactstrap";
import { SimpleInputField } from "components/forms/fields";
import Translatable from "components/utils/Translatable";
import Swal from "components/utils/Swal";

const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  control: (base) => ({
    ...base,
    height: 50,
    minHeight: 50,
    div: {
      overflow: "initial",
    },
  }),
};

const FormatOptionLabel = (props) => {
  const { id, title, featured_image, quantity } = props;

  const { items } = useOrderAddContext();

  const alreadyInCart = items.findIndex(
    ({ variant }) => variant?.product.id === id
  );


  return (
    <div className="d-flex align-items-center w-100">
      <div>
        <img
          src={featured_image ? getApiURL(featured_image) : DefaultProductImage}
          alt="featured"
          className="float-left mr-1 img-40"
        />
      </div>
      <div className="w-100 pr-5">
        <p className="m-0" title={title}>
          {title.length > 78 ? title.substr(0, 78) : title} -{" "}
          {alreadyInCart !== -1 ? (
            <span className="text-info">
              <CheckCircle size={16} /> Added
            </span>
          ) : null}{" "}
          <br />
        </p>

        <div>
          <span
            className={`${quantity > 0 ? "text-lightgray" : "text-danger"}`}
          >
            {quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export function getVariantShortDescription(variant) {
  const desc = [
    variant.option1_value,
    variant.option2_value,
    variant.option3_value,
  ]
    .filter(Boolean)
    .map((option, index) => {
      const label = variant["option" + (index + 1) + "_name"];
      const value = variant["option" + (index + 1) + "_value"];
      return (
        <span key={index}>
          {index === 0 || ", "}
          <b>
            {" "}
            <i>{label}: </i>
          </b>
          {value}
        </span>
      );
    });
  return (
    <span>
      {desc} -{" "}
      <b
        className={`${
          variant?.quantity > 0 ? "text-secondary" : "text-danger"
        }`}
      >
        {variant?.quantity > 0 ? "In Stock" : "Out of Stock"}
      </b>
    </span>
  );
}

const initialState = {
  variant: null,
  product: null,
  quantity: 0,
  price: 0,
  item_note:"",
  extra_discount:0,
  set_focus:null
};

const Form = () => {
  const {items, onAddProductToCart,cartItem,setCartItem,onFormClose,getProductExtraValues} = useOrderAddContext();

  const onChangeProduct = (product) => {
    const variant = product.has_multiple_variants
      ? product?.variants_data[0]
      : product?.variants_data;

    console.log(" Product ",product)

    setCartItem({
      product,
      variant,
      quantity: variant?.minimum_order_quantity,
      price: variant?.price,
    });
  };

  const validateForm = () => {
    let errors = [];

    if (!cartItem.product) {
      errors.push("Please select the product!");
    }

    if (!cartItem.price && cartItem.price !== 0) {
      errors.push("Please fill the price field");
    }

    if (!cartItem.quantity) {
      errors.push("Please fill the quantity field");
    }

    if (cartItem.product.quantity <= 0) {
      errors.push("You've selected an out of stock item that is not allowed!");
    }

    if((cartItem?.set_focus === null) && items.findIndex((p) => p?.variant?.id === cartItem.variant.id) !== -1){
      errors.push(" Product is already in the cart! ")
    }

    if(cartItem.quantity && (cartItem.quantity < cartItem?.variant?.minimum_order_quantity)){
      errors.push(`Minimum ${cartItem?.variant?.minimum_order_quantity} quantity of this item is required!`)
    }

    if (errors.length > 0) {
      Swal.fire(
        <div className="py-1">
          <div className="mb-1">Error!</div>
          <h4>Please correct the following errors</h4>
          {errors.map((error, index) => (
            <h6 className="text-danger" key={index}>
              {error}{" "}
            </h6>
          ))}
        </div>
      );

      return false;
    } else {
      return true;
    }
  };

  const onClick = () => {
    const isValid = validateForm()

    if(isValid){
      onAddProductToCart(cartItem,() => {
        setCartItem(initialState)
      })
    }
  }

  return (
    <Card className="select-product-input" id="order">
      <CardHeader>
        <div className="d-flex">
          <span className="mr-1 cursor-pointer" onClick={onFormClose}>
            <ArrowLeft size="15" />
          </span>

          <span>{false ? "Update" : "Add"} Product</span>
        </div>
      </CardHeader>
      <CardBody>
        <FormGroup className="item-add">
          <Label for={`item-name`}>Product Name</Label>

          <CustomAsyncPaginate
            path="inventory/products/"
            styles={customStyles}
            formatOptionLabel={(props) => <FormatOptionLabel {...props} />}
            getOptionValue={(props) => props.id}
            onChange={onChangeProduct}
            value={cartItem.product}
          />
        </FormGroup>

        {cartItem?.product?.has_multiple_variants && (
          <FormGroup className="variant-field">
            <Label for="variant">Variant</Label>

            <Select
              options={cartItem?.product?.variants_data?.map((variant) => {
                const label = (
                  <div className="d-flex">
                    <div>
                      <img
                        src={
                          variant.featured_image
                            ? getApiURL(variant.featured_image)
                            : ""
                        }
                        alt="featured"
                        className="float-left mr-1 img-40"
                      />
                    </div>

                    <div className="w-100">
                      <div>{getVariantShortDescription(variant)} </div>
                      <div className="text-lightgray">
                        &#36; {variant.price}
                      </div>
                    </div>
                  </div>
                );
                return {
                  label: label,
                  value: variant.id,
                };
              })}
              defaultValue={{
                label: getVariantShortDescription(cartItem?.variant),
                value: cartItem?.variant?.id,
              }}
              onChange={({ value }) => {
                const variant = cartItem?.product?.variants_data.find(
                  (variant) => variant.id === value
                );

                setCartItem({variant,price:variant?.price,quantity:variant?.minimum_order_quantity})
              }}
              styles={customStyles}
            />
          </FormGroup>
        )}

        <SimpleInputField
          label="Sale Price"
          placeholder="Sale Price..."
          type="text"
          requiredIndicator
          name="price"
          min={0}
          value={cartItem?.price}
          onChange={(e) => setCartItem({[e.target.name]:e.target.value ? Math.max(0,parseFloat(e.target.value)) : 0})}
          disabled={!cartItem.product}
        />

        {
          console.log(" CartItem ",cartItem)
        }

        <SimpleInputField
          label={<Translatable text="quantity" />}
          placeholder="Quantity..."
          type="number"
          requiredIndicator
          name="quantity"
          onChange={(e) => setCartItem({[e.target.name]:Math.max(cartItem?.variant?.minimum_order_quantity,parseInt(e.target.value))})}
          value={cartItem?.quantity}
          disabled={!cartItem.product}
        />

        <Button.Ripple
          className="btn-icon"
          color="primary"
          outline
          onClick={onClick}
        >
          <Plus size={14} />
          <span className="align-middle ml-25">
            {(cartItem.set_focus !== null) ? "Update" : "Add"} Product
          </span>
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default Form;
