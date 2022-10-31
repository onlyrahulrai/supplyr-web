import apiClient from "api/base";
import { getApiURL } from "api/utils";
import PriceDisplay from "components/utils/PriceDisplay";
import useOrderAddContext from "context/useOrderAddContext";
import React, { memo, useState } from "react";
import { Check, Clipboard, Edit3, X } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import DefaultProductImage from "../../../assets/img/pages/default_product_image.png";
import { _products } from "./Main";
import {toast} from "react-toastify";
import Translatable from "components/utils/Translatable";

const Product = (props) => {
  const { id, variant, quantity, price, extra_discount, item_note } =
    props.product;
  const { position } = props;

  const {
    onRemoveProductToCart,
    products,
    onChangeSelectedProduct,
    onChangeProduct,
    setProduct,
    product,
    setProducts,
  } = useOrderAddContext();
  const [fieldName, setFieldName] = useState(null);

  const onClickUpdateProduct = async (variant_id) => {
    try {
      const {
        variant: {
          product: { id },
        },
      } = products.find((product) => product.variant.id === variant_id);

      const response = await apiClient(`orders/product/${id}`);

      const instance = products.find(
        (product) => product?.variant?.id === variant_id
      );

      onChangeProduct(instance);
      setFieldName(null)

      onChangeSelectedProduct({ ...response.data, set_focus: variant_id });
    } catch (error) {
      toast.warning("Failed to update this product so please try another once!")
    }
  };

  const onChange = (e) => {
    setProduct((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onClick = (name) => {
    setProduct(props.product);
    setFieldName(name);
  };

  const onClickSave = () => {
    const _products = [...products];

    const data = {...product};

    data['extra_discount'] = product.extra_discount !== '' ? product.extra_discount : 0;

    _products[position] = data;

    setProduct({});
    setProducts(_products);
    setFieldName(null);
  };

  return (
    <Card className="ecommerce-card">
      <div
       className="card-content"
        style={{ gridTemplateColumns: "1fr 3fr 1.5fr" }}
      >
        <div className="item-img text-center">
          <img
            src={
              variant.featured_image
                ? getApiURL(variant.featured_image)
                : DefaultProductImage
            }
            alt="Product"
            className="img-fluid img-100 rounded"
          />
        </div>
        <CardBody>
          <div className="item-name">
            <h4>{variant?.product?.title}</h4>
            <p className={`${variant.quantity > 0 ? 'stock-status-in' : 'text-danger'}`}>{variant.quantity > 0 ? "In Stock" : "Out of stock"}</p>
            <div className="item-quantity">
              <p className="quantity-title"><Translatable text="quantity" />: {quantity}</p>
            </div>
            <div className="delivery-date mt-1 rounded d-flex align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ width: "65%" }}
              >
                <b style={{ color: "#000" }}>
                  <i>Extra Discount:</i>{" "}
                </b>

                <span className="offers ml-1">
                  <PriceDisplay amount={extra_discount ? extra_discount : 0} />
                </span>
                {!fieldName || fieldName !== "extra_discount" ? (
                  <Edit3
                    size={24}
                    onClick={() => onClick("extra_discount")}
                    color="blue"
                    className="ml-1"
                  />
                ) : null}
              </div>
              {fieldName === "extra_discount" ? (
                <div className="d-flex align-items-center">
                  <Input
                    placeholder="Extra discount..."
                    value={product?.extra_discount ?? 0}
                    name="extra_discount"
                    onChange={onChange}
                    type="number"
                    min={0}
                    style={{ width: "55%", marginLeft: "5px" }}
                  />{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={onClickSave}
                  >
                    &nbsp;&nbsp;
                    <Edit3 size={16} /> Save
                  </span>
                </div>
              ) : null}
            </div>
            <div className="delivery-date mt-1 w-100 d-flex align-items-center">
              {!fieldName || fieldName !== "item_note" ? (
                <>
                  {!item_note ? (
                    <div
                      className="d-flex text-primary align-items-center"
                      style={{ width: "60%" }}
                    >
                      <span>
                        <Clipboard
                          size={24}
                          onClick={() => onClick("item_note")}
                          className="cursor-pointer"
                        />
                        &nbsp;
                        <strong>ADD AN NOTE ITEM</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="item-note">
                      <b style={{ color: "#000" }}>
                        <i>Item Note:</i>{" "}
                      </b>{" "}
                      &nbsp; {item_note}
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => onClick("item_note")}
                      >
                        &nbsp;&nbsp;
                        <Edit3 size={16} /> Edit
                      </span>
                    </div>
                  )}
                </>
              ) : null}
              {fieldName === "item_note" ? (
                <div className="d-flex w-100 align-items-center">
                  <FormGroup className="mb-0 flex-grow-1">
                    <Label for="note">Item Note</Label>
                    <Input
                      type="text"
                      placeholder="Notes..."
                      value={product?.item_note ?? ""}
                      name="item_note"
                      onChange={onChange}
                    />
                  </FormGroup>

                  <Check
                    size={24}
                    onClick={onClickSave}
                    className="text-primary border mt-1 ml-1 rounded-full border-primary cursor-pointer"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </CardBody>
        <div className="item-options text-center">
          <div className="item-wrapper">
            <div className="item-cost">
              <h5 className="item-price">
                <PriceDisplay amount={price * quantity} />
              </h5>
              <span className="item-price"> 
                (<PriceDisplay amount={price} /> x {quantity > 1 ? `${quantity} Units` : `${quantity} Unit` }) 
              </span>
            </div>
          </div>
          <div className="wishlist">
            <Button.Ripple color="primary" onClick={() => onClickUpdateProduct(variant?.id)}>
              <Edit3 size={15} />
            </Button.Ripple>
            <Button.Ripple color="danger" className="ml-1" onClick={() => onRemoveProductToCart(variant?.id)}>
              <X size={15} />
            </Button.Ripple>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default memo(Product);
