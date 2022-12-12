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
  const {getTotals,orderData,isIgstDisplayed,
    isCgstSgstDisplayed} = useInvoiceContext()

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
          <th>
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
          </th>
          <th>Gross Amount:</th>
          <th>Discount:</th>
          <th>Taxable Amount:</th>
          {
            isIgstDisplayed ? (
              <th>IGST:</th>
            ):null
          }

          {
            isCgstSgstDisplayed ? (
              <>
                <th>CGST:</th>
                <th>SGST:</th>
              </>
            ):null
          }
           
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
            <td>
              <strong><PriceDisplay amount={item.extra_discount} /></strong>
            </td>
            <td>
              <strong><PriceDisplay amount={item.taxable_amount} /></strong>
            </td>
            {
              isIgstDisplayed ? (
                <td>
                  <strong><PriceDisplay amount={item.igst} /></strong>
                </td>
              ):null
            }

            {
              isCgstSgstDisplayed ? (
                <>
                  <td>
                    <strong><PriceDisplay amount={item.cgst} /></strong>
                  </td>
                  <td>
                    <strong><PriceDisplay amount={item.sgst} /></strong>
                  </td>
                </>
              ):null
            }
            <td>
              <strong><PriceDisplay amount={product_price_includes_taxes ?  getTwoDecimalDigit((item.quantity * item.price) - item.extra_discount) : (item.taxable_amount + item.tax_amount)} /></strong>  
            </td>
          </tr>
        ))}
        <tr style={{borderTop:"6px solid #ededed "}}>
          <td colSpan="3"></td>
          <td>
            <strong></strong>
          </td>
          <td>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={getTotals?.gross_amount} />
            </strong>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={orderData?.total_extra_discount} />
            </strong>
          </td>
          <td>
            <strong>
              <PriceDisplay amount={orderData?.taxable_amount} />
            </strong>
          </td>
          {
            isIgstDisplayed ? (
                <td>
                  <strong>
                    <PriceDisplay amount={orderData?.igst} />
                  </strong>
                </td>
            ):null
          }

          {
            isCgstSgstDisplayed ? (
              <>
                <td>
                  <strong>
                    <PriceDisplay amount={orderData?.cgst} />
                  </strong>
                </td>
                <td>
                  <strong>
                    <PriceDisplay amount={orderData?.sgst} />
                  </strong>
                </td>
              </>
            ):null
          }
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
