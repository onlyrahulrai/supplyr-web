import React from "react";
import Form from "./Form";
import { Plus } from "react-feather";
import { Button } from "reactstrap";
import { useOrderAddContext } from "context/OrderAddContext";
import Product from "./Product";

const Main = () => {
  const { items, isFormOpen, product,onChangeStateByKeyValue,cartItem } = useOrderAddContext();
  
  return (
    <>
      {items.length && !product ? (
        <Button.Ripple
          color="primary"
          outline
          className="mb-1  btn-icon"
          onClick={() => onChangeStateByKeyValue("isFormOpen",true)}
        >
          <Plus size="20" />{" "}
          <span className="align-middle ml-25">Add New Product</span>
        </Button.Ripple>
      ) : null}
      <div>{(!items.length > 0 || isFormOpen || cartItem.set_focus !== null) ? <Form /> : null}</div>

      {items.map((product, index) => (
        <Product product={product} key={index} position={index} />
      ))}
    </>
  );
};

export default Main;
