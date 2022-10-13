import PriceDisplay from "components/utils/PriceDisplay";
import Translatable from "components/utils/Translatable";
import React from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";

const InvoiceProductLists = ({ products }) => {
  const { default_currency } =
    useSelector((state) => state.auth.userInfo.profile);

  return (
    <Table responsive className="table-hover-animation">
      <thead>
        <tr>
          <th>
            <small>
              <strong>Marks & & </strong>
            </small>
            <div>
              <span>
                <strong>Nos.</strong>
              </span>
            </div>
          </th>
          <th>
            <small>
              <strong>Title</strong>
            </small>
            <div>
              <span>
                <strong>(Package Name)</strong>
              </span>
            </div>
          </th>
          <th></th>
          <th>
            <small>
              <strong>
                <Translatable text="quantity" />
              </strong>
            </small>
            <div>
              <span>
                <strong></strong>
              </span>
            </div>
          </th>
          <th>
            <small>
              <strong>Rate/</strong>
            </small>
            <div>
              <span>
                <strong>
                  (<Translatable
                    prefix={default_currency}
                  />)
                </strong>
              </span>
            </div>
          </th>
          <th>
            <small>
              <strong>Amount </strong>
            </small>
            <div>
              <span>
                <strong>
                  (<Translatable
                    prefix={`in ${default_currency}`}
                  />)
                </strong>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, index) => (
          <tr key={index}>
            <td>
              <strong>{index + 1}</strong>
            </td>
            <td colSpan="2">
              <div className="d-flex align-items-center">
                <strong>
                  {item?.product_variant?.product?.title}
                  {" - "}
                  {
                    item.product_variant.product.has_multiple_variants ? (
                      <>
                        (
                          {
                            item.product_variant.option1_name ? `${item.product_variant.option1_name.toUpperCase()}:${item.product_variant.option1_value.toUpperCase()}` : ''
                          }
                          {
                            item.product_variant.option2_name ? `, ${item.product_variant.option2_name.toUpperCase()}:${item.product_variant.option2_value.toUpperCase()}` : ''
                          }
                          {
                            item.product_variant.option3_name ? `, ${item.product_variant.option3_name.toUpperCase()}:${item.product_variant.option3_value.toUpperCase()}` : ''
                          }
                        )
                      </>
                    ) : null
                  }
                </strong>
              </div>
            </td>
            <td>
              <strong>{item.quantity}</strong>
            </td>
            <td>
              <strong>
                <PriceDisplay amount={item.price} />
              </strong>
            </td>
            <td>
              <strong>
                <PriceDisplay amount={item.quantity * item.price} />
              </strong>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InvoiceProductLists;
