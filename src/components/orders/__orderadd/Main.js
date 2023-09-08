import useOrderAddContext from "context/useOrderAddContext2.0";
import React from "react";
import { Plus } from "react-feather";
import { Button } from "reactstrap";
import Form from "./Form";
import Product from "./Product";

const Main = () => {
  const {cart,cartItem,dispatchCart} = useOrderAddContext();

  return (
    <div>
      {(cart.items.length && !cartItem.product) ? (
        <Button.Ripple
          color="primary"
          outline
          className="mb-1  btn-icon"
          onClick={() => dispatchCart({type:"ON_CLICK_TOGGLE_FORM"})}
        >
          <Plus size="20" />{" "}
          <span className="align-middle ml-25">Add New Product</span>
        </Button.Ripple>
      ) : null}

      {(!cart.items.length > 0 || cart.isFormOpen || cartItem.product) ? (
        <Form />
      ) : null}

      {cart.items.map((product, index) => (
        <Product product={product} key={index} position={index} />
      ))}
    </div>
  );
};

export default Main;
