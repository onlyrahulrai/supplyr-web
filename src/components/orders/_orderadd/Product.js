import apiClient from "api/base";
import { getApiURL } from "api/utils";
import VariantLabel from "components/inventory/VariantLabel";
import PriceDisplay from "components/utils/PriceDisplay";
import Translatable from "components/utils/Translatable";
import React, { useEffect, useState } from "react";
import { Clipboard, Check, Edit3, X } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import DefaultProductImage from "../../../assets/img/pages/default_product_image.png";
import useOrderAddContext from "../../../context/useOrderAddContext2.0";
import EditExtraDiscountComponent from "./EditExtraDiscountComponent";


const Product = (props) => {
  const { cart, dispatchCart, dispatchCartItem,getValidGstRate } = useOrderAddContext();
  const [fieldName, setFieldName] = useState("");

  const {
    variant,
    price,
    quantity,
    extra_discount,
    item_note,
  } = props.product;

  const [extraDiscount, setExtraDiscount] = useState(0);
  const [itemNote, setItemNote] = useState(item_note);

  useEffect(() => {
      setExtraDiscount(extra_discount)
  },[props])

  const onClickUpdateProduct = async (id) => {
    await apiClient(`orders/product/${id}`)
      .then((response) => {
        dispatchCartItem({
          type: "ON_LOAD_ORDER_ITEM",
          payload: {
            ...props.product,
            product: response.data,
            set_focus: props.position,
          },
        });
        dispatchCart({ type: "ON_CLICK_TOGGLE_FORM" });
      })
      .catch((error) => console.log(" ----- Error ----- ", error));
  };

  const onRemoveProductFromCart = (id) => {
    dispatchCart({ type: "ON_REMOVE_ITEM_FROM_CART", payload: id });
  };

  const onUpdateExtraDiscount = () => {
    const items = cart.items.map((item, index) => {
      if (index === props.position) {
        const _item = { ...item, extra_discount: (extraDiscount || 0) }

        return {..._item,...getValidGstRate(_item)}
      }
      return item;
    });

    dispatchCart({ type: "ON_UPDATE_CART_ITEMS", payload: items });
    setFieldName("");
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
            <h4>{variant?.title}</h4>
            <p
              className={`${
                variant.quantity > 0 ? "stock-status-in" : "text-danger"
              }`}
            >
              {variant.quantity > 0 ? "In Stock" : "Out of stock"}
            </p>
            <div className="item-quantity">
              <p className="quantity-title">
                <Translatable text="quantity" />: {quantity}
              </p>
            </div>
            <div className="item-quantity">
              <p className="quantity-title mb-0">
                Item Price (Per Unit): <PriceDisplay amount={price} />
              </p>
            </div>
            
            <div className="delivery-date w-100 d-flex flex-column" style={{marginTop:"0.5rem"}}>
              {
                variant.product.has_multiple_variants ? (
                  <div className="item-company mb-half">
                    <div className="company-name">
                      <VariantLabel
                          variantData={variant}
                          />
                    </div>
                  </div>
                ) : null
              }

              {!fieldName || fieldName !== "item_note" ? (
                <>
                  {!itemNote ? (
                    <div
                      className="d-flex text-primary align-items-center cursor-pointer"
                      style={{ width: "60%" }}
                      onClick={() => setFieldName("item_note")}
                    >
                      <span>
                        <Clipboard
                          size={24}
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
                      &nbsp; {itemNote}
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => setFieldName("item_note")}
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
                      value={itemNote}
                      name="item_note"
                      onChange={(e) => setItemNote(e.target.value)}
                    />
                  </FormGroup>

                  <Check
                    size={24}
                    onClick={() => {
                      const items = cart.items.map((item, index) => {
                        return index === props.position
                          ? { ...item, item_note: itemNote }
                          : item;
                      });
                      dispatchCart({
                        type: "ON_UPDATE_CART_ITEMS",
                        payload: items,
                      });
                      setFieldName("");
                    }}
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
              <span className="item-price">
                <small style={{fontWeight:"bold"}}>Price: <PriceDisplay amount={price * quantity} /></small>
              </span><br />
              <span className="item-price">
                  <small style={{fontWeight:"bold"}}>Extra Discount: <PriceDisplay amount={extraDiscount ? extraDiscount : 0} /></small>{!fieldName || fieldName !== "extra_discount" ? (
                    <Edit3
                      size={24}
                      onClick={() => setFieldName("extra_discount")}
                      color="blue"
                      className="ml-0"
                    />
                ) : null}
              </span>

              <EditExtraDiscountComponent isOpen={(fieldName === "extra_discount")} onToggleModal={() => setFieldName("")} onSave={onUpdateExtraDiscount} extraDiscount={extraDiscount} setExtraDiscount={setExtraDiscount} />
            </div>
          </div>
          <div className="wishlist">
            <Button.Ripple
              color="primary"
              onClick={() => {
                onClickUpdateProduct(variant?.product?.id);
              }}
            >
              <Edit3 size={15} />
            </Button.Ripple>

            <Button.Ripple
              color="danger"
              className="ml-1"
              onClick={() => onRemoveProductFromCart(props.position)}
            >
              <X size={15} />
            </Button.Ripple>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Product;
