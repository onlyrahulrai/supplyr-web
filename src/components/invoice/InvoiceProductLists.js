import PriceDisplay from "components/utils/PriceDisplay";
import Translatable from "components/utils/Translatable";
import useInvoiceContext from "context/useInvoiceContext";
import React from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { getTwoDecimalDigit } from "utility/general";

const InvoiceProductLists = ({ products,...rest }) => {
  const { default_currency,product_price_includes_taxes } =
    useSelector((state) => state.auth.userInfo.profile);
  const {getTotals,orderData} = useInvoiceContext()

  return (
    <Table responsive className="table-hover-animation">
      <thead>
        <tr>
          <th>
            {
              rest.default ? (
                  <strong>
                    S. No.
                  </strong>
              ):(
                <>
                    <strong>Marks & & </strong>
                  <div>
                    <span>
                      <strong>Nos.</strong>
                    </span>
                  </div>
                </>
              )
            }
            
          </th>
          <th>
              <strong>Title</strong>
            <div>
              <span>
                <strong>(Package Name)</strong>
              </span>
            </div>
          </th>
          <th></th>
          <th>
            <strong>
              <Translatable text="quantity" />
            </strong>
            <div>
              <span>
                <strong></strong>
              </span>
            </div>
          </th>
          {/* <th>
            <strong>Unit Price</strong>
            <div>
            <span>
                <strong>
                  (<Translatable
                    prefix={default_currency}
                  />)
                </strong>
              </span>
            </div>
          </th> */}
          <th>Amount:</th>
          <th>Tax:</th>
           
          <th>
            <strong>Total Amount</strong>
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
              {index + 1}
            </td>
            <td colSpan="2">
              <div className="d-flex align-items-center">
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
              </div>
            </td>
            <td>
              {item.quantity}
            </td>
            <td>
              <PriceDisplay amount={item.taxable_amount} />
            </td>
            <td>
              <PriceDisplay amount={item.igst + item.cgst + item.sgst} />
            </td>
              
            <td>
              <PriceDisplay amount={product_price_includes_taxes ?  getTwoDecimalDigit((item.quantity * item.price) - item.extra_discount) : (item.taxable_amount + item.tax_amount)} />
            </td>
          </tr>
        ))}
        <tr style={{borderTop:"6px solid #ededed "}}>
          <td colSpan="2">
            <strong>Total</strong>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={orderData?.taxable_amount} />
            </strong>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={orderData?.igst + orderData?.cgst + orderData?.sgst} />
            </strong>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={orderData?.total_amount} />
            </strong>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default InvoiceProductLists;
