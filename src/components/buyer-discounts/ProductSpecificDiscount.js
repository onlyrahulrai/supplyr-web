import { getApiURL } from "api/utils";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import DefaultProductImage from "../../assets/img/pages/default_product_image.png";
import Radio from "../@vuexy/radio/RadioVuexy";
import { capitalizeString } from "utility/general";
import { ArrowLeft, Edit3, Plus, Trash } from "react-feather";
import apiClient from "api/base";
import useBuyerDiscountContext from "context/useBuyerDiscountContext";
import PriceDisplay from "components/utils/PriceDisplay";
import Swal from "components/utils/Swal";
import { toast } from "react-toastify";

const Product = (props) => {
  const { onEdit, ...rest } = props;
  const {dispatch} = useBuyerDiscountContext();
  const [loading,setLoading] = useState(false)

  const variant = useMemo(() => {
    return rest?.product?.has_multiple_variants ? rest?.product?.variants_data?.find((variant) => variant?.id === rest?.variant) : rest?.product?.variants_data
  },[rest])

  const onDeleteGenericDiscount = async () => {
    setLoading(true)
    await apiClient
      .delete(`discounts/${rest?.id}/`)
      .then((response) => {
        const data = response.data;
        dispatch({ type: "ON_STATE_UPDATE", payload:  {...data,discount_assigned_products_length:data?.discount_assigned_products?.length}});
        toast.info("Discount removed from the product successfully")
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(" Error ", error);
      });
  };

  return (
    <Row className=" py-2 mx-0  mt-2 border" style={{ borderRadius: "12px" }}>
      <Col md="auto">
        <img
          src={
            variant?.featured_image
              ? getApiURL(variant?.featured_image)
              : DefaultProductImage
          }
          style={{
            objectFit: "contain",
            height: "100%",
            width: "64px",
          }}
          alt=""
        />
      </Col>
      <Col md="auto">
        <h4>{variant?.title}</h4>
        <h5>
          {" "}
          {rest?.discount_type === "amount" ? (
            <span>
              Discount: <PriceDisplay amount={rest?.discount_value} />{" "}
            </span>
          ) : (
            <span> Discount: {rest?.discount_value}&#37; </span>
          )}
        </h5>
        <Button.Ripple
          type="button"
          color="primary"
          className="mr-1"
          onClick={() => onEdit(rest)}
        >
          <Edit3 size={12} className="mr-1" />
          Edit
        </Button.Ripple>
        <Button.Ripple type="button" color="danger" onClick={onDeleteGenericDiscount} disabled={loading} className="d-flex justify-content-center align-items-center" >
          <Trash size={12}  /> <span className="mx-1">Delete</span>{loading ? <Spinner style={{width:"1rem",height:"1rem"}} /> : null}
        </Button.Ripple>
      </Col>
    </Row>
  );
};

const FormatOptionLabel = (props) => {
  const { title, featured_image, quantity } = props;
  return (
    <div className="d-flex align-items-center w-100">
      <div>
        <img
          src={featured_image ? getApiURL(featured_image) : DefaultProductImage}
          alt="featured"
          className="float-left img-40"
        />
      </div>
      <div className="w-100 pr-5">
        <p className="m-0" title={title}>
          {title.length > 78 ? title.substr(0, 78) : title} - <br />
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
const initialState = {
  product: null,
  variant: null,
  discount_type: "percentage",
  discount_value: 0,
};

const ProductSpecificDiscount = ({onToggleGenericDiscountForm,isProductDiscountFormOpen,setIsProductDiscountFormOpen}) => {
  const [data, setData] = useState(initialState);
  const { state, dispatch } = useBuyerDiscountContext();
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    let errors = []

    if(!data?.product){
      errors.push("please selecte the product!")
    }

    if(!data?.id && state.discount_assigned_products.findIndex((discount) => discount?.product?.id === data?.product?.id) !== -1){
      errors.push("Discount is already assinged to this product")
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
    }}

  const onSubmitProductSpecificDiscount = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if(isValid){
      setLoading(true);

      console.log(" Data ",data)
  
      const config = {
        discount_type:data?.discount_type,
        discount_value:data?.discount_value,
        product: data?.product?.id,
        buyer: state?.buyer?.id,
      };
  
      const productSpecificDiscountPromise = data?.id
        ? apiClient.put(`discounts/${data?.id}/`, config)
        : apiClient.post("discounts/", config);
  
      await productSpecificDiscountPromise
        .then((response) => {
          const data = response.data
          dispatch({ type: "ON_STATE_UPDATE", payload: {...data,discount_assigned_products_length:data?.discount_assigned_products?.length}});
          setData(initialState);
          setIsProductDiscountFormOpen((state) => !state);
          toast.info("Discount assigned to the product successfully")
          setLoading(false);
        })
        .catch((error) => {
          console.log(" Error ", error);
          setLoading(false);
        });
    }
  };

  return (
    <React.Fragment>
      {!isProductDiscountFormOpen ? (
        <Row className="mx-0 ">
          <Col md="8">
            <h3>Product Specific Discounts</h3>
            <p>
              Products discounts you will specily here will override any general
              discoutns you have specified.
            </p>
          </Col>
          <Col md="4" className="d-flex justify-content-end align-items-center">
            <Button.Ripple
              type="button"
              color="primary"
              onClick={() => {
                setData(initialState);
                onToggleGenericDiscountForm()
                setIsProductDiscountFormOpen((prevState) => !prevState);
              }}
            >
              ADD A PRODUCT
            </Button.Ripple>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md="12" className="p-1">
            <div className="m-1">
              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <span
                      className="mr-1 cursor-pointer"
                      onClick={() => {
                        setIsProductDiscountFormOpen((prevState) => !prevState);
                      }}
                    >
                      <ArrowLeft size="15" />
                    </span>

                    <span>Product Based Discount</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={onSubmitProductSpecificDiscount}>
                    <FormGroup>
                      <Label for="item-name">Product Name</Label>

                      <CustomAsyncPaginate
                        path="inventory/products/"
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        menuPlacement="auto"
                        styles={customStyles}
                        formatOptionLabel={(props) => (
                          <FormatOptionLabel {...props} />
                        )}
                        value={null ?? data.product}
                        onChange={(product) => {
                          setData((prevState) => ({
                            ...prevState,
                            product
                          }));
                        }}
                        getOptionValue={(props) => props.id}
                      />
                    </FormGroup>

                    <FormGroup>
                      <div className="d-inline-block mr-1 mb-h5-0">
                        <Radio
                          label="Percentage"
                          value="percentage"
                          color="primary"
                          name="discount_type"
                          className="py-50"
                          onChange={(e) => setData((prevState) => ({...prevState,discount_type:e.target.value,discount_value:Math.min(100,prevState.discount_value)}))}
                          checked={data.discount_type === "percentage"}
                        />
                      </div>
                      <div className="d-inline-block mr-1 mb-h5-0">
                        <Radio
                          label="Amount"
                          value="amount"
                          color="primary"
                          name="discount_type"
                          className="py-50 mb-0"
                          onChange={onChange}
                          checked={data.discount_type === "amount"}
                        />
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="discount">
                        Discount Value ({capitalizeString(data.discount_type)}){" "}
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter Generic Discount..."
                        step="any"
                        name="discount_value"
                        required
                        min={0}
                        max={data.discount_type === "percentage" ? 100 : Infinity}
                        style={{ height: "50px" }}
                        onChange={onChange}
                        value={data.discount_value}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button.Ripple
                        className="btn-icon d-flex justify-content-center align-itmes-center"
                        color="primary"
                        outline
                        type="submit"
                        disabled={loading}
                      >
                        {data?.id ? <Edit3 size={14} /> : <Plus size={14} /> }
                        <span className="align-middle mx-1">{data?.id ? "Edit" : "Create" }</span>
                        {loading ? <Spinner style={{width:"1rem",height:"1rem"}} /> : null}
                      </Button.Ripple>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      )}

      {state.discount_assigned_products.length ? (
        <>
          {state.discount_assigned_products.map((product, key) => (
            <Product
              {...product}
              key={key}
              onEdit={(data) => {
                const variant = data?.product?.has_multiple_variants
                  ? data?.product?.variants_data.find(
                      (variant) => variant.id === data.variant
                    )
                  : data?.product?.variants_data;
                setData({ ...data, variant });
                setIsProductDiscountFormOpen(true);
              }}
            />
          ))}
        </>
      ) : null}
    </React.Fragment>
  );
};

export default ProductSpecificDiscount;
