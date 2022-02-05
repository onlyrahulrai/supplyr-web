import React, { useEffect, useState } from "react";
import apiClient from "api/base";
import { getApiURL } from "api/utils";
import DefaultProductImage from "../../assets/img/pages/default_product_image.png";
import Select from "react-select";
import Radio from "../@vuexy/radio/RadioVuexy";
import { ArrowLeft, Plus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import _Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

const Swal = withReactContent(_Swal);

const ExclusiveDiscountFormComponent = ({
  productDiscountsForm,
  setProductDiscountsForm,
  productDiscounts,
  buyer,
  fetchDiscount,
  item,
  setItem
}) => {
  const [products, setProducts] = useState([]);
 

  // Product based discount start

  useEffect(() => {
    const fetchProducts = async () => {
      await apiClient
        .get("/inventory/products/list/")
        .then((response) => setProducts(response.data))
        .catch((error) => console.log("errors >>>> ", error));
    };

    fetchProducts();
  }, []);

  
  const renderProductsData = products.map((product) => ({
    label: product.title,
    value: product.id,
    featured_image: product.featured_image,
    quantity: product.quantity,
  }));

  const formatOptionLabel = ({ label, featured_image, quantity }) => {
    return (
      <div className="select-product">
        <img
          src={featured_image ? getApiURL(featured_image) : DefaultProductImage}
          alt="featured"
          className="float-left mr-1 img-40"
        />
        <div>{label}</div>
        <div className="text-lightgray">
          {quantity > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>
    );
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
      div: {
        overflow: "initial",
      },
    }),
  };

  const validateForm = () => {
    let errors = []

    if(!item.product){
        errors.push("please selecte the product!")
    }

    if(!item.discount_value){
        errors.push("please add the discount!")
    }

    if (errors.length > 0) {
        Swal.fire(
          <div>
            <div>Error!</div>
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
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const is_valid = validateForm()

    const requestedData = {
        setting:"product_based_discount",
        data:item
    }

    if(is_valid){
        await apiClient.post("inventory/buyer-discounts/",requestedData)
        .then((response) => {
            setProductDiscountsForm(!productDiscountsForm);
            setItem({discount_type:"amount",buyer:buyer})
            fetchDiscount(buyer)
            Swal.fire("Discount Saved!", "success");
            console.log("response from backend",response.data)
        })
        .catch((error) => console.log("error from backend",error))
    }
    
  };

  // Product based discount end

  console.log(" ------ product discounts ------ ",productDiscounts)

  return (
    <Card>
      <CardHeader>
        <div className="d-flex">
          <span
            className="mr-1 cursor-pointer"
            onClick={() => {
              setProductDiscountsForm(!productDiscountsForm);
            }}
          >
            <ArrowLeft size="15" />
          </span>

          <span>Product Based Discount</span>
        </div>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="product-name">Product Name</Label>
            <Select
              options={renderProductsData}
              formatOptionLabel={formatOptionLabel}
              onChange={(data) => {
                let product = products.find(
                  (product) => product.id === data.value
                );
                setItem((prevState) => ({
                  ...prevState,
                  product: product.id,
                }));
              }}
              value={renderProductsData.find(
                (ritem) => ritem.value === item.product
              )}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              styles={{
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
              }}
            />
          </FormGroup>
          <FormGroup>
            <div className="d-inline-block mr-1 mb-h5-0">
              <Radio
                label="Amount"
                value="amount"
                color="primary"
                onChange={(e) =>
                  setItem((prevState) => ({
                    ...prevState,
                    discount_type: e.target.value,
                  }))
                }
                name="exampleRadioSizes"
                className="py-50 mb-0"
                checked={item.discount_type === "amount"}
              />
            </div>
            <div className="d-inline-block mr-1 mb-h5-0">
              <Radio
                label="Percentage"
                value="percentage"
                color="primary"
                onChange={(e) =>
                  setItem((prevState) => ({
                    ...prevState,
                    discount_type: e.target.value,
                  }))
                }
                name="exampleRadioSizes"
                className="py-50"
                checked={item.discount_type === "percentage"}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label htmlFor={`discount-${item.type}`}>
              Discount {item.discount_type}
            </Label>

            <Input
              type="number"
              placeholder="1"
              name="discount"
              placeholder="Add discount in Amount/Percentage.."
              value={item?.discount_value || ""}
              onChange={(e) =>
                setItem((prevState) => ({
                  ...prevState,
                  discount_value: e.target.value,
                }))
              }
              className="discount-input"
            />
          </FormGroup>
          <FormGroup>
            <Button.Ripple
              className="btn-icon"
              color="primary"
              outline
              type="submit"
              // disabled={product?.quantity <= 0}
            >
              <Plus size={14} />
              <span className="align-middle ml-25">Save</span>
            </Button.Ripple>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ExclusiveDiscountFormComponent;
