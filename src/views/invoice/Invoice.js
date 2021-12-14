import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import React,{useEffect} from "react";

import { Row, Col, Table, CardBody, Card } from "reactstrap";

// ** Styles
import "../../assets/scss/pages/invoice.scss";

const Invoice = () => {

    useEffect(() => {
        window.print()
    },[])

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
                                        <span><strong>M/S. PAT GLOBAL INC.</strong></span>
                                        <br />
                                        <span><strong>NO.33 AND 34,, 8TH CROSS,</strong></span>
                                        <br />
                                        <span><strong>MUTHURAYASWAMY LAYOUT,</strong></span>
                                        <br />
                                        <span><strong>HULIMAVU,</strong></span>
                                        <br />
                                        <span><strong>BENGALURU</strong></span>
                                        <br />
                                        <span><strong>KARNATAKA -560076</strong></span>
                                    </div>
                                    </div>
                                </Col>
                                <Col sm="8" >
                                    <Row>
                                        <Col sm="6" className="p-0">
                                        <div className="border p-half">
                                                <small><strong>Invoice No. & Date:</strong></small><br />
                                                <div>
                                                    <strong>PGI/EXP/----/21-22</strong><br />
                                                    <strong>DT:--/--/----</strong><br />
                                                </div>
                                            </div>
                                            
                                        </Col>
                                        <Col sm="6" className="p-0">
                                            <div className="border p-half">
                                                <small><strong>Exporter's Ref,:</strong></small><br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12" className="p-0 border">
                                            <small><strong>Buyer's Order No.& Date</strong></small>
                                            <div>
                                                <span><strong>NIL.,  DATED:--/--/----</strong></span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12" className="p-6 border">
                                            <small><strong>Other Reference (s)</strong></small>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                            <Col sm="4" className="p-0">
                                <div className="border border-top-0 p-half" style={{minHeight:"152px"}}>
                                    <small><strong>Consignee:</strong></small> <br />

                                    <div>
                                        <strong>TO ORDER</strong> 
                                    </div>
                                </div>
                            </Col>
                            <Col sm="8" className="p-0">
                                <div className="border border-top-0 p-half">
                                    <small>IEC. NO. ----,  <strong>GSTIN: ----</strong></small> <br />
                                    <div>
                                        <span><strong>Buyer (If other than consignee)</strong></span><br />
                                    </div>
                                </div>

                                <Row>
                                    <Col sm="6" className="pr-0" >
                                        <div className="border border-top-0 p-half">
                                            <small><strong>Country of Origin </strong></small> <br />

                                            <div>
                                                <small><strong>of goods</strong></small><br />
                                                <span><strong>INDIA</strong></span><br /><br />
                                            </div>
                                        </div>    
                                    </Col>
                                    <Col sm="6" className="pl-0" >
                                        <div className="border border-top-0 p-half">
                                            <small><strong>Country of final </strong></small> <br />
                                            <div>
                                                <small><strong>Destination</strong></small> <br /><br /><br />
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
                                                <small><strong>Pre-Carriage by:</strong></small> <br /><br />
                                                <div>
                                                    <strong>ROAD/RAIL</strong><br />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="8" className="p-0">
                                            <div className="border border-top-0 p-half">
                                                <small><strong>Place of Receiptby Pre-carrier:</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="4" className="p-0">
                                            <div className="border border-top-0 p-half">
                                                <small><strong>Vessel No.</strong></small> <br /><br />
                                            </div>
                                        </Col>
                                        <Col sm="8" className="p-0">
                                            <div className="border border-top-0 p-half">
                                                <small><strong>Port of Loading</strong></small> <br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="4" className="p-0">
                                            <div className="border border-top-0 p-half">
                                                <small><strong>Port of Disch.</strong></small> <br /><br />
                                            </div>
                                        </Col>
                                        <Col sm="8" className="p-0">
                                            <div className="border border-top-0 p-half">
                                                <small><strong>Final Destinat.</strong></small> <br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm="5" className="p-0">
                                    <div className="border border-top-0 p-half" style={{minHeight:"187px"}}>
                                        <small><strong>Terms of Delivery & Payment:</strong></small> <br /><br />
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
                                        <strong>Marks & & </strong>
                                    </small>
                                    <div>
                                        <span><strong>Nos.</strong></span>
                                    </div>
                                </Col>
                                <Col sm="2">
                                    <small><strong>No. & Kind</strong></small>
                                    <div>
                                        <span><strong>of Packages</strong></span>
                                    </div>
                                </Col>
                                <Col sm="4">
                                    <small><strong>Description</strong></small>
                                    <div>
                                        <span><strong>of goods</strong></span>
                                    </div>
                                </Col>
                                <Col className="border">
                                    <small><strong>Qty.</strong></small>
                                    <div>
                                        <span><strong>(SQM.)</strong></span>
                                    </div>
                                </Col>
                                <Col className="border">
                                    <small>
                                    <strong>Rate/</strong>
                                    </small>
                                    <div>
                                        <span><strong>SQM  (US $)</strong></span>
                                    </div>
                                </Col>
                                <Col className="border">
                                    <small>
                                    <strong>Amount </strong>
                                    </small>
                                    <div>
                                        <span><strong>(in US $)</strong></span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="border border-bottom-0" style={{minHeight:"200px"}}>
                                <Col sm="8">
                                    <small><strong>Amount Chargeable (In Words)</strong></small>
                                </Col>
                                <Col sm="4" className="border border-left-0">
                                    <small><strong>Total:</strong></small>
                                </Col>
                            </Row>
                            <Row className="border-top-0 border">
                                <Col sm="8">
                                    <small><strong><u>DECLARATION</u></strong></small><br />
                                    <small><strong>We declare that this invoice shows the actual price of the goods described</strong></small><br />
                                    <small><strong> and that all particulars are  true and correct. </strong></small>
                                </Col>
                                <Col sm="4" className="border">
                                    <small><strong>Signature & Date:</strong></small>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
            </div>
    );
};

export default Invoice;
