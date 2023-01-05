import PriceDisplay from "components/utils/PriceDisplay";
import useInvoiceContext from "context/useInvoiceContext";
import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Consignee from "./Consignee";
import Exporter from "./Exporter";
import InvoiceProductLists from "./InvoiceProductLists";
import InvoiceSummary from "./InvoiceSummary";

const DefaultTemplate = () => {
  const { orderId, invoiceNumber:invoice_number } = useParams();
  const { orderData, getTotals, toWords} = useInvoiceContext();

  const getDate = (date) => {
    let _date = new Date(date);
    return _date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <React.Fragment>
      <h3 className="text-center">
        <u>INVOICE</u>
      </h3>

      <Row>
        <Col md="5" className="border-right">
          <Exporter default />
        </Col>
        <Col className="border-right">
          <div className="p-1">
            <small>
              <strong>Invoice No. - {invoice_number}</strong>
            </small>
            <div>
              <small>
                <strong>
                  DATE - &nbsp;
                  {orderData?.invoice?.created_at &&
                    getDate(orderData?.invoice?.created_at)}
                </strong>
              </small>
              <br />
              <br />
            </div>
          </div>

          <div className="px-0 p-1 border-top">
            <small>
              <strong>Buyer's Order No. - {orderId}</strong>
            </small>
            <div>
              <small>
                <strong>
                  DATE - {orderData?.order_date}
                </strong>
              </small>
            </div>
            <br />
          </div>
        </Col>
        <Col>
          <Consignee 
            default
            name={orderData?.buyer_name ? orderData?.buyer_name : orderData?.buyer_business_name} 
            address={orderData?.address} 
          />
        </Col>
      </Row>
    
      <InvoiceProductLists products={orderData.items} default />

      <Row
        className="border border-bottom-0 ml-0 mr-0"
        style={{ minHeight: "100px" }}
      >
        <Col sm="8" className="p-2">
          <small>
            <strong>Amount Chargeable (In Words)</strong>
          </small>
          <br />
          <strong>- {toWords.convert(orderData?.total_amount ?? "0")}</strong>
        </Col>
        <Col sm="4" className="border border-left-0 p-2">
          <InvoiceSummary />
        </Col>
      </Row>
      <Row className="border-top-0 border ml-0 mr-0">
        <Col sm="8">
          <small>
            <strong>
              <u>DECLARATION</u>
            </strong>
          </small>
          <br />
          <small>
            <strong>
              We declare that this invoice shows the actual price of the goods
              described
            </strong>
          </small>
          <br />
          <small>
            <strong> and that all particulars are true and correct. </strong>
          </small>
        </Col>
        <Col sm="4" className="border">
          <small>
            <strong>Signature & Date:</strong>
          </small>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DefaultTemplate;
