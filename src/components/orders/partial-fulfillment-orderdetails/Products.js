import React from "react";
import { Card, CardBody } from "reactstrap";
import { getTwoDecimalDigit } from "utility/general";
import ProductDummyImage from "assets/img/svg/cart.svg";
import Translatable from "components/utils/Translatable";
import PriceDisplay from "components/utils/PriceDisplay";
import VariantLabel from "components/inventory/VariantLabel";
import { getMediaURL } from "api/utils";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";
import Checkbox from "../../@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";
import OrderStatus from "./OrderStatus";

const Products = ({ products,group }) => {
  const {
    itemStatus,
    isPartialFulfillmentEnabled,
    onSelectProduct,
    onSelectAllProducts,
    partialOrderitemsIds,
  } = usePartialFulfillmentOrderDetailsContext();
  return (
    <div>
      {products.map((item, key) => (
        <Card className="ecommerce-card" key={key}>
          <div
            className="card-content"
            style={{ gridTemplateColumns: "1fr 3fr 1.5fr" }}
          >
            <div className="d-flex flex-row justify-content-center align-items-center">
              {isPartialFulfillmentEnabled &&
                !["delivered", "cancelled"].includes(itemStatus(item)) && (
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    checked={partialOrderitemsIds.includes(item?.id)}
                    onChange={() => {
                      !item?.order_group
                        ? onSelectProduct(item?.id)
                        : onSelectAllProducts(products);
                    }}
                  />
                )}
              <div
                className="item-img text-center"
                style={{
                  width: `${true ? "75%" : "100%"} `,
                }}
              >
                <img
                  src={
                    item.product_variant.featured_image
                      ? getMediaURL(item.product_variant.featured_image)
                      : ProductDummyImage
                  }
                  alt="Product"
                  className="img-fluid img-100 rounded"
                />
              </div>
            </div>

            <CardBody>
              <div className="item-name">
                <h4>{item.product_variant.product.title}</h4>

                <p
                  className={`${
                    item.product_variant.quantity > 0
                      ? "stock-status-in"
                      : "text-danger"
                  }`}
                >
                  {item.product_variant.quantity > 0
                    ? "In Stock"
                    : "Out of stock"}
                </p>

                <div className="item-quantity">
                  <p className="quantity-title">
                    <Translatable text="quantity" />: {item.quantity}
                  </p>
                </div>
                <div className="item-quantity">
                  <p className="quantity-title mb-0">
                    Item Price (Per Unit): <PriceDisplay amount={item.price} />
                  </p>
                </div>

                <div
                  className="delivery-date mt-half w-100 d-flex flex-column"
                  style={{ marginTop: "0.5rem" }}
                >
                  {item.product_variant.product.has_multiple_variants ? (
                    <div className="item-company mb-half">
                      <div className="company-name">
                        <VariantLabel variantData={item.product_variant} />
                      </div>
                    </div>
                  ) : null}

                  {item.item_note ? (
                    <div className="item-note mb-half">
                      <b style={{ color: "#000" }}>
                        <i>Item Note:</i>{" "}
                      </b>{" "}
                      &nbsp; {item.item_note}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardBody>
            <div className="item-options text-center d-flex align-items-center justify-content-center">
              <div>
                <div className="item-cost">
                  <span className="item-price">
                    <small style={{ fontWeight: "bold" }}>
                      Price:{" "}
                      <PriceDisplay amount={item.price * item.quantity} />
                    </small>
                  </span>
                  <br />
                  <span className="item-price">
                    <small style={{ fontWeight: "bold" }}>
                      Extra Discount:{" "}
                      <PriceDisplay
                        amount={
                          item.extra_discount
                            ? getTwoDecimalDigit(
                                item.extra_discount * item.quantity
                              )
                            : 0
                        }
                      />
                    </small>
                  </span>
                  <br />

                  {
                    (isPartialFulfillmentEnabled && !group.order_group) ? (
                      <div className="item-price">
                        <OrderStatus
                          status_code={item.status}
                          key={`orderstatus-${key}`}
                          className="d-flex justify-content-center"
                        />
                      </div>
                    ):null
                  }

                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Products;
