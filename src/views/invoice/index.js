import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import React from "react";

import { Row, Col, Table, CardBody, Card } from "reactstrap";

// ** Styles
import "../../assets/scss/pages/invoice.scss";

const index = () => {
  return (
    <div>
      <BreadCrumbs
        breadCrumbTitle="Invoice"
        breadCrumbParent="Orders"
        breadCrumbActive="Invoice"
      />

        
            <Row>
                <Col className="invoice-wrapper">
                <Card className="invoice-page">
                    <CardBody>
                        <h3 className="text-center"><u>INVOICE</u></h3>
                        <Row className="mt-3">
                            <Col sm="4" className="p-0">
                            <div className="border p-half">
                                <small><strong>Exporter:</strong></small> <br />
                            
                                <div>
                                    <span>M/S. PAT GLOBAL INC.</span>
                                    <br />
                                    <span>NO.33 AND 34,, 8TH CROSS,</span>
                                    <br />
                                    <span>MUTHURAYASWAMY LAYOUT,</span>
                                    <br />
                                    <span>HULIMAVU,</span>
                                    <br />
                                    <span>BENGALURU</span>
                                    <br />
                                    <span>KARNATAKA -560076</span>
                                </div>
                                </div>
                            </Col>
                            <Col sm="8" >
                                <Row>
                                    <Col sm="6" className="p-0">
                                    <div className="border p-half">
                                            <small>Invoice No. & Date:</small><br />
                                            <div>
                                                <span>PGI/EXP/----/21-22</span><br />
                                                <span>DT:--/--/----</span><br />
                                            </div>
                                        </div>
                                        
                                    </Col>
                                    <Col sm="6" className="p-0">
                                        <div className="border p-half">
                                            <small>Exporter's Ref,:</small><br /><br /><br />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" className="p-0 border">
                                        <small>Buyer's Order No.& Date</small>
                                        <div>
                                            <span>NIL.,  DATED:--/--/----</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" className="p-6 border">
                                        <small>Other Reference (s)</small>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                        <Col sm="4" className="p-0">
                            <div className="border border-top-0 p-half" style={{minHeight:"152px"}}>
                                <small>Consignee:</small> <br />

                                <div>
                                    <strong>TO ORDER</strong> 
                                </div>
                            </div>
                        </Col>
                        <Col sm="8" className="p-0">
                            <div className="border border-top-0 p-half">
                                <small>IEC. NO. ----,  <strong>GSTIN: ----</strong></small> <br />
                                <div>
                                    <span>Buyer (If other than consignee)</span><br />
                                </div>
                            </div>

                            <Row>
                                <Col sm="6" className="pr-0" >
                                    <div className="border border-top-0 p-half">
                                        <small>Country of Origin </small> <br />

                                        <div>
                                            <small>of goods</small><br />
                                            <span><strong>INDIA</strong></span><br /><br />
                                        </div>
                                    </div>    
                                </Col>
                                <Col sm="6" className="pl-0" >
                                    <div className="border border-top-0 p-half">
                                        <small>Country of final </small> <br />
                                        <div>
                                            <small>Destination</small> <br /><br /><br />
                                        </div>
                                    </div>   
                                </Col>
                            </Row>
                        </Col>
                        </Row>
                        <Row>
                            <Col sm="7">
                                <Row>
                                    <Col sm="4" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Pre-Carriage by:</small> <br /><br />
                                            <div>
                                                <strong>ROAD/RAIL</strong><br />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="8" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Place of Receiptby Pre-carrier:</small> <br /><br /><br />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="4" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Vessel No.</small> <br /><br />
                                        </div>
                                    </Col>
                                    <Col sm="8" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Port of Loading</small> <br /><br />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="4" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Port of Disch.</small> <br /><br />
                                        </div>
                                    </Col>
                                    <Col sm="8" className="p-0">
                                        <div className="border border-top-0 p-half">
                                            <small>Final Destinat.</small> <br /><br />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm="5" className="p-0">
                                <div className="border border-top-0 p-half" style={{minHeight:"187px"}}>
                                    <small>Terms of Delivery & Payment:</small> <br /><br />
                                    <div>
                                        <strong className="pl-1">  C I F</strong> <br /><br />

                                        <span><strong>120 DAYS FROM THE DATE OF B/L ON D/A</strong></span><br /><br />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="border  pt-0 pb-0" style={{minHeight:"300px"}}>
                            <Col sm="2">
                                <small>
                                    Marks & & 
                                </small>
                                <div>
                                    <span>Nos.</span>
                                </div>
                            </Col>
                            <Col sm="2">
                                <small>No. & Kind</small>
                                <div>
                                    <span>of Packages</span>
                                </div>
                            </Col>
                            <Col sm="4">
                                <small>Description</small>
                                <div>
                                    <span>of goods</span>
                                </div>
                            </Col>
                            <Col className="border">
                                <small>Qty.</small>
                                <div>
                                    <span>(SQM.)</span>
                                </div>
                            </Col>
                            <Col className="border">
                                <small>
                                    Rate/
                                </small>
                                <div>
                                    <span>SQM  (US $)</span>
                                </div>
                            </Col>
                            <Col className="border">
                                <small>
                                    Amount 
                                </small>
                                <div>
                                    <span>(in US $)</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className="border border-bottom-0" style={{minHeight:"200px"}}>
                            <Col sm="8">
                                <small>Amount Chargeable (In Words)</small>
                            </Col>
                            <Col sm="4" className="border border-left-0">
                                <small>Total:</small>
                            </Col>
                        </Row>
                        <Row className="border-top-0 border">
                            <Col sm="8">
                                <small><u>DECLARATION</u></small><br />
                                <small>We declare that this invoice shows the actual price of the goods described</small><br />
                                <small> and that all particulars are  true and correct.</small>
                            </Col>
                            <Col sm="4" className="border">
                                <small>Signature & Date:</small>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                </Col>
            </Row>
        </div>
  );
};

export default index;
