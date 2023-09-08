import React, { useState,memo } from "react";

import Product from "./Product";
import Form from "./Form";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import useOrderAddContext from "context/useOrderAddContext";


const Main = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products,selectedProduct} =
 useOrderAddContext();

  const onToggleForm = (value) => {
    setIsOpen(value);
  };


  return (
    <div>
      {products.length ? (
        <Button.Ripple
          color="primary"
          outline
          className="mb-1  btn-icon"
          onClick={() => onToggleForm(+true)}
        >
          <Plus size="20" />{" "}
          <span className="align-middle ml-25">Add New Product</span>
        </Button.Ripple>
      ) : null}

      {!products.length > 0 || isOpen || selectedProduct ? (
        <Form onToggleForm={onToggleForm} />
      ) : null}

      {products.map((product, index) => (
        <Product product={product} key={index} position={index} />
      ))}
    </div>
  );
};

export default memo(Main);
