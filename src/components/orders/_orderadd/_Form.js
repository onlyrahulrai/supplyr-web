import { SimpleInputField } from "components/forms/fields";
import Translatable from "components/utils/Translatable";
import React, { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, Plus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { _products } from "./Main";
import { customStyles } from "./Sidebar";
import Select from "react-select";
import useOrderAddContext from "context/useOrderAddContext";

const formatOptionLabel = (props) => {
  const { label,img,quantity,alreadyInCart } = props;
  return (
    <div className="d-flex align-items-center w-100">
      <div>
        <img src={img} alt="featured" className="float-left mr-1 img-40" />
      </div>
      <div className="w-100 pr-5">
        <p className="m-0" title={label}>
          {label.length > 78 ? label.substr(0,78) : label}{" "} - {" "}
          {+alreadyInCart ? (
            <span className="text-info">
              <CheckCircle size={16} /> Added
            </span>
          ) : null}{" "}
          <br />
        </p>

        <div>
          <span className="text-lightgray">
            {quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Form = ({ onToggleForm }) => {
  const set_focus = false;
  const has_multiple_variants = false;
  const { onAddProductToCart, selectedProduct, onSelectProduct,getProductIndexById} =
    useOrderAddContext();

  const isProductSelected = useMemo(
    () => (Object.keys(selectedProduct).length > 0 ? true : false),
    [selectedProduct]
  );

  const onChangeSelectProduct = (data) => {
    const product = _products.find((product) => product.id === data.value);
    let productToAdd;
    if (selectedProduct.set_focus) {
      const { price, quantity, set_focus } = selectedProduct;
      productToAdd = { ...product, price, quantity, set_focus };
    } else {
      productToAdd = { ...product };
    }
    console.log(" ----- product To Add ----- ",productToAdd)
    onSelectProduct(productToAdd);
  };

  const renderProducts = _products.map(({ name, id, ...rest }) => ({
    label: name,
    value: id,
    alreadyInCart:getProductIndexById(id) !== -1 ? true : false,
    ...rest,
  }));

  const onClick = () => {
    if (!isProductSelected) return alert(" Please fill all the information ");

    console.log(" ----- selected product ------ ",selectedProduct)

    onAddProductToCart();
    onToggleForm(+false);
    onSelectProduct({});
  };

  const onChange = (e) => {
    const product = { ...selectedProduct, [e.target.name]: e.target.value };
    onSelectProduct(product);
  };

  return (
    <Card className="select-product-input">
      <CardHeader>
        <div className="d-flex">
          <span className="mr-1 cursor-pointer" onClick={onToggleForm}>
            <ArrowLeft size="15" />
          </span>

          <span>{set_focus ? "Update" : "Add"} Product</span>
        </div>
      </CardHeader>
      <CardBody>
        <FormGroup className="item-add">
          <Label for={`item-name`}>Product Name</Label>

          <Select
            options={renderProducts}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
            onChange={onChangeSelectProduct}
            defaultValue={
              renderProducts.find(
                (product) => selectedProduct.id === product.value
              ) ?? null
            }
          />
        </FormGroup>

        {has_multiple_variants && (
          <FormGroup>
            <Label for="variant">Variant</Label>
          </FormGroup>
        )}

        <SimpleInputField
          label="Sale Price"
          placeholder="Sale Price..."
          type="text"
          value={selectedProduct.price ?? 1}
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
          value={selectedProduct.quantity ?? 1}
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

export default Form;
