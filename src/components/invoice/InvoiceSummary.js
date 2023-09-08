import PriceDisplay from "components/utils/PriceDisplay";
import useInvoiceContext from "context/useInvoiceContext";
import React from "react";

const InvoiceSummary = () => {
  const { orderData,getTotals } = useInvoiceContext();

  return (
    <div>
      <div className="d-flex justify-content-between">
        <small>
          <strong>Subtotal:</strong>
        </small>
        &nbsp;
        <span>
          <strong>
            {"  "}
            <PriceDisplay amount={getTotals?.gross_amount} />
          </strong>
        </span>
      </div>
      <div className="d-flex justify-content-between">
        <small>
          <strong>Discounts:</strong>
        </small>
        &nbsp;
        <span>
          <strong>
            {"  "}
            <PriceDisplay amount={orderData?.total_extra_discount} />
          </strong>
        </span>
      </div>
      <div className="d-flex justify-content-between">
        <small>
          <strong>Taxable Amount:</strong>
        </small>
        &nbsp;
        <span>
          <strong>
            {"  "}
            <PriceDisplay amount={orderData?.taxable_amount} />
          </strong>
        </span>
      </div>
      {
        orderData?.igst ? (
          <div className="d-flex justify-content-between">
            <small>
              <strong>Total(IGST):</strong>
            </small>
            &nbsp;
            <span>
              <strong>
                {"  "}
                <PriceDisplay amount={orderData?.igst} />
              </strong>
            </span>
          </div>
        ):(
          <>
            <div className="d-flex justify-content-between">
              <small>
                <strong>Total(SGST):</strong>
              </small>
              &nbsp;
              <span>
                <strong>
                  {"  "}
                  <PriceDisplay amount={orderData?.sgst} />
                </strong>
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <small>
                <strong>Total(CGST):</strong>
              </small>
              &nbsp;
              <span>
                <strong>
                  {"  "}
                  <PriceDisplay amount={orderData?.cgst} />
                </strong>
              </span>
            </div>
          </>
        )
      }
      

      <div className="d-flex justify-content-between">
        <small>
          <strong>Final Amount:</strong>
        </small>
        &nbsp;
        <span>
          <strong>
            {"  "}
            <PriceDisplay amount={orderData?.total_amount} />
          </strong>
        </span>
      </div>
    </div>
  );
};

export default InvoiceSummary;
