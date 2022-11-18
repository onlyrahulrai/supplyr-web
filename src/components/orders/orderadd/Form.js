import { SimpleInputField } from "components/forms/fields";
import Translatable from "components/utils/Translatable";
import React, { memo,useMemo } from "react";
import { ArrowLeft, CheckCircle, Plus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
} from "reactstrap";
import { _products } from "./Main";
import { customStyles } from "./Sidebar";
import useOrderAddContext from "context/useOrderAddContext";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import { getApiURL } from "api/utils";
import DefaultProductImage from "../../../assets/img/pages/default_product_image.png";
import Select from "react-select";
import _Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

const Swal = withReactContent(_Swal);

function getVariantShortDescription(variant) {
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
  return <span>{desc} - <b className={`${variant?.quantity > 0 ? 'text-secondary' : 'text-danger'}`}>{variant?.quantity > 0 ? "In Stock":"Out of Stock"}</b></span>;
}

const FormatOptionLabel = (props) => {
  const { id, title, featured_image, quantity_all_variants: quantity } = props;
  const { products } = useOrderAddContext();

  const alreadyInCart = products.findIndex(
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
          <span className={`${quantity > 0 ? "text-lightgray" : "text-danger"}`}>
            {quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Form = ({ onToggleForm }) => {
  const set_focus = false;
  const {
    onAddProductToCart,
    selectedProduct,
    onChangeSelectedProduct,
    onChangeProduct,
    product,
    products,
    isSellerAndBuyerFromTheSameState,
    getValidGstRate,
    calculateGstRate
  } = useOrderAddContext();

  const isProductSelected = useMemo(
    () => (selectedProduct ? true : false),
    [selectedProduct]
  );

  const onSelectproduct = (data) => {
    
    if (selectedProduct?.set_focus) {
      data["set_focus"] = selectedProduct?.set_focus;
    }

    let variant;
    if (data.has_multiple_variants) {
      variant = data.variants_data[0];
    } else {
      variant = data.variants_data;
    }

    onChangeSelectedProduct(data);

    const {
      id,
      price,
      actual_price,
      minimum_order_quantity: quantity,
    } = variant;

    console.log(" ---- Data ---- ",getValidGstRate(data.sub_categories))
    console.log(" ---- Get GST Data ---- ",calculateGstRate(getValidGstRate(data.sub_categories)))

    const totalTaxableAmount = parseFloat((parseFloat(price) * Object.values(calculateGstRate(getValidGstRate(data.sub_categories))).reduce((sum,value) => sum + value,0))/100)

    console.log(" ---- Total Taxable Amount ---- ",totalTaxableAmount,price,Object.values(calculateGstRate(getValidGstRate(data.sub_categories))).reduce((sum,value) => sum + value,0))

    onChangeProduct({
      variant_id:id,
      id:null,
      variant,
      price:parseFloat(price),
      actual_price:parseFloat(actual_price),
      quantity:quantity,
      item_note: product?.item_note,
      extra_discount: product?.extra_discount ?? 0,
      taxable_amount:totalTaxableAmount * parseFloat(quantity),
      ...calculateGstRate(getValidGstRate(data.sub_categories))
    });
  };

  const validateForm = () => {
    let errors = [];

    if (!selectedProduct) {
      errors.push("Please select the product!");
    }

    if (!product?.price) {
      errors.push("Please fill the price field");
    }

    if (!product?.quantity) {
      errors.push("Please fill the quantity field");
    }

    if (product?.variant?.quantity <= 0) {
      errors.push("You've selected an out of stock item that is not allowed!");
    }

    if(!selectedProduct?.set_focus && products.findIndex((p) => p.variant.id === product.variant.id) !== -1){
      errors.push(" Product is already in the cart! ")
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
    const isvalid = validateForm();
    if (isvalid) {
      onAddProductToCart();
      onToggleForm(+false);
      onChangeSelectedProduct(null);
    }
  };

  const onChange = (e) => {
    const _product = { ...product, [e.target.name]: e.target.value };

    onChangeProduct(_product);
  };

  return (
    <Card className="select-product-input">
      <CardHeader>
        <div className="d-flex">
          <span className="mr-1 cursor-pointer" onClick={() => {
            onToggleForm(+false);
              onChangeSelectedProduct(null);
            }}
          >
            <ArrowLeft size="15" />
          </span>

          <span>{set_focus ? "Update" : "Add"} Product</span>
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
            defaultValue={selectedProduct ? selectedProduct : null}
            onChange={onSelectproduct}
          />
        </FormGroup>

        {selectedProduct?.has_multiple_variants && (
          <FormGroup className="variant-field">
            <Label for="variant">Variant</Label>

            <Select
              options={selectedProduct?.variants_data?.map((variant) => {
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
                      <div>
                        {getVariantShortDescription(variant)}
                        {" "}
                     
                      </div>
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
                label: getVariantShortDescription(product.variant),
                value: product.variant.id,
              }}
              onChange={({ value }) => {
                const variant = selectedProduct?.variants_data.find(
                  (v) => v.id === value
                );
                onChangeProduct({
                  variant,
                  price: variant?.price,
                  quantity: variant?.minimum_order_quantity,
                });
              }}
              styles={customStyles}
            />
          </FormGroup>
        )}

        <SimpleInputField
          label="Sale Price"
          placeholder="Sale Price..."
          type="text"
          value={product.price ?? 1}
          requiredIndicator
          min="0"
          name="price"
          onChange={onChange}
          disabled={!isProductSelected}
        />

        <SimpleInputField
          label={<Translatable text="quantity" />}
          placeholder="Quantity..."
          type="number"
          value={product.quantity ?? 1}
          requiredIndicator
          min="0"
          name="quantity"
          disabled={!isProductSelected}
          onChange={onChange}
        />

        <Button.Ripple
          className="btn-icon"
          color="primary"
          outline
          onClick={onClick}
          disabled={!isProductSelected}
        >
          <Plus size={14} />
          <span className="align-middle ml-25">
            {!selectedProduct?.set_focus ? "Add" : "Update"} Product
          </span>
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default memo(Form);
