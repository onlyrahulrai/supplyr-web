import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Media,
  Table,
  InputGroup,
  Input,
  InputGroupAddon,
  Button
} from "reactstrap"
import Breadcrumbs from "components/@vuexy/breadCrumbs/BreadCrumb"
import logo from "../../assets/img/logo/logo.png"
import { Mail, Phone, FileText, Download } from "react-feather"

import "../../assets/scss/pages/invoice.scss"

class Invoice extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Invoice"
          breadCrumbParent="Pages"
          breadCrumbActive="Invoice"
        />
        <Row>
          <Col className="mb-1 invoice-header" md="5" sm="12">
            <InputGroup>
              <Input placeholder="Email" />
              <InputGroupAddon addonType="append">
                <Button.Ripple color="primary" outline>
                  Send Invoice
                </Button.Ripple>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col
            className="d-flex flex-column flex-md-row justify-content-end invoice-header mb-1"
            md="7"
            sm="12"
          >
            <Button
              className="mr-1 mb-md-0 mb-1"
              color="primary"
              onClick={() => window.print()}
            >
              <FileText size="15" />
              <span className="align-middle ml-50">Print</span>
            </Button>
            <Button.Ripple color="primary" outline>
              <Download size="15" />
              <span className="align-middle ml-50">Download</span>
            </Button.Ripple>
          </Col>
          <Col className="invoice-wrapper" sm="12">
            <Card className="invoice-page">
              <CardBody>
              <h3 className="text-center"><u>INVOICE</u></h3>
                            <Row className="mt-3 ml-0 mr-0">
                                <Col sm="4" className="border px-0">
                                <div className="p-1">
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
                                <Col sm="8" className="px-0">
                                    <Row className="ml-0 mr-0">
                                        <Col sm="6" className="px-0">
                                        <div className="p-1 border">
                                                <small><strong>Invoice No. & Date:</strong></small><br />
                                                <div>
                                                    <strong>PGI/EXP/----/21-22</strong><br />
                                                    <strong>DT:--/--/----</strong><br />
                                                </div>
                                            </div>
                                            
                                        </Col>
                                        <Col sm="6" className="pl-0 border">
                                            <div className="p-1">
                                                <small><strong>Exporter's Ref,:</strong></small><br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="ml-0 mr-0"> 
                                        <Col sm="12" className="px-0 p-1  border">
                                            <small><strong>Buyer's Order No.& Date</strong></small>
                                            <div>
                                                <span><strong>NIL.,  DATED:--/--/----</strong></span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="ml-0 mr-0">
                                        <Col sm="12" className="p-6 border">
                                            <small><strong>Other Reference (s)</strong></small>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="ml-0 mr-0">
                            <Col sm="4" className="px-0">
                                <div className="border p-1 border-top-0" style={{minHeight:"180px"}}>
                                    <small><strong>Consignee:</strong></small> <br />

                                    <div>
                                        <strong>TO ORDER</strong> 
                                    </div>
                                </div>
                            </Col>
                            <Col sm="8" className="pl-0 border">
                                <div className="p-1 border-top-0">
                                    <small>IEC. NO. ----,  <strong>GSTIN: ----</strong></small> <br />
                                    <div>
                                        <span><strong>Buyer (If other than consignee)</strong></span><br />
                                    </div>
                                </div>

                                <Row className="border-top ml-0 mr-0">
                                    <Col sm="6" className="px-0  border-right" >
                                        <div className="p-1 border-top-0">
                                            <small><strong>Country of Origin </strong></small> <br />

                                            <div>
                                                <small><strong>of goods</strong></small><br />
                                                <span><strong>INDIA</strong></span><br /><br />
                                            </div>
                                        </div>    
                                    </Col>
                                    <Col sm="6" className="px-0" >
                                        <div className="p-1 border-top-0">
                                            <small><strong>Country of final </strong></small> <br />
                                            <div>
                                                <small><strong>Destination</strong></small> <br /><br /><br />
                                            </div>
                                        </div>   
                                    </Col>
                                </Row>
                            </Col>
                            </Row>
                            <Row className="ml-0 mr-0">
                                <Col sm="7" className="px-0">
                                    <Row className="ml-0 mr-0">
                                        <Col sm="4" className="px-0">
                                            <div className="border p-1 border-top-0">
                                                <small><strong>Pre-Carriage by:</strong></small> <br /><br />
                                                <div>
                                                    <strong>ROAD/RAIL</strong><br />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="8" className="px-0">
                                            <div className="border p-1 border-top-0">
                                                <small><strong>Place of Receiptby Pre-carrier:</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="ml-0 mr-0"> 
                                        <Col sm="4" className="px-0">
                                            <div className="border p-1 border-top-0">
                                                <small><strong>Vessel No.</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                        <Col sm="8" className="px-0">
                                            <div className="border p-1 border-top-0">
                                                <small><strong>Port of Loading</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="ml-0 mr-0">
                                        <Col sm="4" className="px-0">
                                            <div className="border p-1 border-top-0 border-bottom-0">
                                                <small><strong>Port of Disch.</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                        <Col sm="8" className="px-0">
                                            <div className="border p-1 border-top-0 border-bottom-0">
                                                <small><strong>Final Destinat.</strong></small> <br /><br /><br />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm="5" className="border px-0">
                                    <div className=" p-1 border-top-0" style={{minHeight:"180px"}}>
                                        <small><strong>Terms of Delivery & Payment:</strong></small> <br /><br />
                                        <div>
                                            <strong className="pl-1">  C I F</strong> <br /><br />

                                            <span><strong>120 DAYS FROM THE DATE OF B/L ON D/A</strong></span><br /><br />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="border  pt-0 pb-0 ml-0 mr-0" style={{minHeight:"300px"}}>
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
                            <Row className="border border-bottom-0 ml-0 mr-0" style={{minHeight:"200px"}}>
                                <Col sm="8">
                                    <small><strong>Amount Chargeable (In Words)</strong></small>
                                </Col>
                                <Col sm="4" className="border border-left-0">
                                    <small><strong>Total:</strong></small>
                                </Col>
                            </Row>
                            <Row className="border-top-0 border ml-0 mr-0">
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
      </React.Fragment>
    )
  }
}

export default Invoice
