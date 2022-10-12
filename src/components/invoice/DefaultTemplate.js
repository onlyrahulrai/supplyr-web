import PriceDisplay from "components/utils/PriceDisplay";
import useInvoiceContext from "context/useInvoiceContext";
import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Consignee from "./Consignee";
import Exporter from "./Exporter";
import ProductLists from "./ProductLists";

const DefaultTemplate = () => {
  const { orderId, invoice_number } = useParams();
  const { orderData, totals, toWords} = useInvoiceContext();

  const getDate = (date) => {
    let _date = new Date(date);
    return _date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  console.log(" ----- Order Data ----- ",orderData)

  return (
    <React.Fragment>
      <h3 className="text-center">
        <u>INVOICE</u>
      </h3>
      <Row className="mt-3 ml-0 mr-0">
        <Col sm="5" className="border px-0">
          <Exporter />
        </Col>
        <Col sm="7" className="px-0">
          <Row className="ml-0 mr-0">
            <Col sm="6" className="px-0">
              <div className="p-1 border">
                <small>
                  <strong>Invoice No. & Date:</strong>
                </small>
                <br />
                <div>
                  <strong>{invoice_number}</strong>
                  <br />
                  <strong>
                    DT:&nbsp;
                    {orderData?.invoice?.created_at &&
                      getDate(orderData?.invoice?.created_at)}
                  </strong>
                  <br />
                </div>
              </div>
            </Col>
            <Col sm="6" className="pl-0 border">
              <div className="p-1">
                <small>
                  <strong>Exporter's Ref,:</strong>
                </small>
                <br />
                <br />
                <br />
              </div>
            </Col>
          </Row>
          <Row className="ml-0 mr-0">
            <Col sm="12" className="px-0 p-1  border">
              <small>
                <strong>Buyer's Order No.& Date</strong>
              </small>
              <div>
                <span>
                  <strong>
                    {orderId}, DATED: {orderData?.order_date}
                  </strong>
                </span>
              </div>
            </Col>
          </Row>
          <Row className="ml-0 mr-0">
            <Col sm="12" className="p-6 border">
              <small>
                <strong>Other Reference (s)</strong>
              </small>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="ml-0 mr-0">
        <Col sm="4" className="px-0">
          <Consignee buyer={orderData?.buyer_name ? orderData?.buyer_name : orderData?.buyer_business_name} address={orderData?.address} />
        </Col>
        <Col sm="8" className="pl-0 border">
          <div className="p-1 border-top-0">
            <small>
              IEC. NO. ----, <strong>GSTIN: ----</strong>
            </small>{" "}
            <br />
            <div>
              <span>
                <strong>Buyer (If other than consignee)</strong>
              </span>
              <br />
            </div>
          </div>

          <Row className="border-top ml-0 mr-0">
            <Col sm="6" className="px-0  border-right">
              <div className="p-1 border-top-0">
                <small>
                  <strong>Country of Origin </strong>
                </small>{" "}
                <br />
                <div>
                  <small>
                    <strong>of goods</strong>
                  </small>
                  <br />
                  <span>
                    <strong>INDIA</strong>
                  </span>
                  <br />
                  <br />
                </div>
              </div>
            </Col>
            <Col sm="6" className="px-0">
              <div className="p-1 border-top-0">
                <small>
                  <strong>Country of final </strong>
                </small>{" "}
                <br />
                <div>
                  <small>
                    <strong>Destination</strong>
                  </small>{" "}
                  <br />
                  <span>
                    <strong>
                      {orderData?.address?.state?.name?.toUpperCase()}
                    </strong>
                  </span>
                  <br />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <ProductLists products={orderData.items} />

      <Row
        className="border border-bottom-0 ml-0 mr-0"
        style={{ minHeight: "100px" }}
      >
        <Col sm="8">
          <small>
            <strong>Amount Chargeable (In Words)</strong>
          </small>
          <br />
          <strong>- {toWords.convert(totals?.actualPrice ?? "0")}</strong>
        </Col>
        <Col sm="4" className="border border-left-0">
          <small>
            <strong>Total:</strong>
          </small>
          <br />
          <span>
            <strong>
              {"  "}
              <PriceDisplay amount={totals?.actualPrice} />
            </strong>
          </span>
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
