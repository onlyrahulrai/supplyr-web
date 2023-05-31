import apiClient from "api/base";
import { getApiURL } from "api/utils";
import useOrderAddContext from "context/useOrderAddContext";
import React from "react";
import { Heart, Star, X } from "react-feather";
import NumericInput from "react-numeric-input";
import { Badge, Card, CardBody } from "reactstrap";
import DefaultProductImage from "../../../assets/img/pages/default_product_image.png";
import { _products } from "./Main";

export const mobileStyle = {
  wrap: {
    background: "#E2E2E2",
    fontSize: 14,
  },
  "input.mobile": {
    color: "5f5f5f",
    padding: "0",
    border: 0,
    display: "block",
    fontWeight: 400,
    backgroundColor: "#f8f8f8",
    height: "26px",
  },
  "input:focus": {
    outline: "none",
  },
  arrowUp: {
    borderBottomColor: "#fff",
  },
  arrowDown: {
    borderTopColor: "#fff",
  },
  plus: {
    background: "white",
  },
  minus: {
    background: "white",
  },
  "btnUp.mobile": {
    background: "#7367F0",
    borderRadius: "5px",
    height: "22px",
    width: "22px",
    top: "2px",
    cursor: "pointer",
  },
  "btnDown.mobile": {
    background: "#7367F0",
    borderRadius: "5px",
    height: "22px",
    width: "22px",
    top: "2px",
    cursor: "pointer",
  },
};


const Product = (props) => {
  const {id,name,img, quantity,price } = props.product;

  const {onRemoveProductToCart,onSelectProduct} = useOrderAddContext()

  const onClickUpdateProduct = (id) => {
    const product = _products.find((product) => product.id === id)
    onSelectProduct({...product,set_focus:id})
  }

  return (
    <Card className="ecommerce-card">
      <div 
        className="card-content"
        style={{ gridTemplateColumns: "1fr 3fr 1.5fr" }} 
      >
        <div className="item-img text-center">
          <img src={img ? img : DefaultProductImage} alt="Product"  className="img-fluid img-100 rounded" />
        </div>
        <CardBody>
          <div className="item-name">
            <span>{name}</span>
            <p className="item-company">
              By <span className="company-name">Titan</span>
            </p>
            <p className="stock-status-in">In Stock</p>
            <div className="item-quantity">
              <p className="quantity-title">Quantity</p>
              <NumericInput
                min={0}
                max={10}
                value={quantity}
                mobile
                style={mobileStyle}
              />
            </div>
            <p className="delivery-date">John Doe</p>
            <p className="offers">15%</p>
          </div>
        </CardBody>
        <div className="item-options text-center">
          <div className="item-wrapper">
            <div className="item-rating">
              <Badge color="primary" className="badge-md mr-25">
                <span className="align-middle">4</span> <Star size={15} />
              </Badge>
            </div>
            <div className="item-cost">
              <h6 className="item-price">{price}</h6>
            </div>
          </div>
          <div className="wishlist">
            <X size={15} />
            <span className="align-middle ml-25" onClick={() => onRemoveProductToCart(id)}>Remove</span>
          </div>
          <div className="cart" onClick={() => onClickUpdateProduct(id)}>
            <Heart size={15} />
            <span className="align-middle ml-25">Update</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Product;





