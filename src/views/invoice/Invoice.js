import React, { useCallback, useEffect, useState } from "react"
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
  Button,
  Spinner
} from "reactstrap"
import Breadcrumbs from "components/@vuexy/breadCrumbs/BreadCrumb"
import { FileText, Download } from "react-feather"

import "../../assets/scss/pages/invoice.scss"
import { OrdersApi } from "api/endpoints"
import NetworkError from "components/common/NetworkError"
import { capitalizeString, priceFormatter } from "utility/general"
import { ToWords } from 'to-words';

const Invoice =  (props) => {
    const orderId = props.match.params.orderId;
    const [isLoading,setIsLoading] = useState(true)
    const [orderData,setOrderData] = useState(null)
    const [loadingError,setLoadingError] = useState(null)
    console.log(`Order Id is >>>>> ${orderId}`)

    const fetchOrder = useCallback(async () => {
        await OrdersApi.retrieve(orderId)
            .then((response) => {
                console.log(response.data)
                setOrderData(response.data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error.message)
                setLoadingError(error.message)
            })
    },[orderId])


    useEffect(() => {
        if(orderId){
            fetchOrder()
        }
    },[orderId,fetchOrder])

    const totals = orderData?.items.reduce((sum,item) => {
        const actualPrice  = parseFloat(item.price) * item.quantity
        const salePrice = parseFloat(item.actual_price) * item.quantity

        const _sum = {
            actualPrice: sum.actualPrice + actualPrice,
            salePrice: sum.salePrice + salePrice,
        };

        return _sum 
    },{
        actualPrice: 0,
        salePrice: 0,
    })

    const toWords = new ToWords();

    console.log(orderData,totals)

    return (
        <>
        {isLoading && <Spinner />}
        {!isLoading && loadingError && <NetworkError error={loadingError} />}
        {!isLoading && (
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
                                        <span><strong>{capitalizeString(orderData.buyer_name)}</strong></span>
                                        <br />
                                        <span><strong>{orderData.address.name.toUpperCase()}</strong></span>
                                        <br />
                                        <span><strong>{orderData.address.city.toUpperCase()}</strong></span>
                                        <br />
                                        <span><strong>{orderData.address.line1.toUpperCase()}</strong></span>
                                        <br />
                                        <span><strong>{orderData.address.line2.toUpperCase()}</strong></span>
                                        <br />
                                        <span><strong>{orderData.address.state.toUpperCase()}</strong></span>
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
                                                <span><strong>{orderId},  DATED:{" "}{orderData.order_date}</strong></span>
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
                                                <small><strong>Destination</strong></small> <br />
                                                <span><strong>{orderData.address.state.toUpperCase()}</strong></span><br />
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
                                                <small><strong>Final Destinat.</strong></small> <br />
                                                <span><strong>{`${orderData.address.name} (${orderData.address.state}) `}</strong></span><br />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm="5" className="border px-0">
                                    <div className=" p-1 border-top-0" style={{minHeight:"90px"}}>
                                        <small><strong>Terms of Delivery & Payment:</strong></small> <br /><br />
                                        <div>
                                            <strong className="pl-1">  C I F</strong> <br /><br />

                                            <span><strong>120 DAYS FROM THE DATE OF B/L ON D/A</strong></span><br /><br />
                                        </div>
                                    </div>
                                    <Table responsive className="table-hover-animation border-top">
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Variable Name</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orderData.status_variable_values.map((varibale) => (
                                                    <tr>
                                                        <td><small>{capitalizeString(varibale.status)}</small></td>
                                                        <td><small>{varibale.variable_name}</small></td>
                                                        <td><small>{varibale.value}</small></td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>

                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Table responsive className="table-hover-animation">
                                <thead>
                                    <tr>
                                        <th>
                                            <small>
                                                <strong>Marks & & </strong>
                                            </small>
                                            <div>
                                                <span><strong>Nos.</strong></span>
                                            </div>
                                        </th>
                                        <th>
                                            <small><strong>No. & Kind</strong></small>
                                            <div>
                                                <span><strong>of Packages</strong></span>
                                            </div>
                                        </th>
                                        <th>
                                            <small><strong>Description</strong></small>
                                            <div>
                                                <span><strong>of goods</strong></span>
                                            </div>
                                        </th>
                                        <th>
                                            <small><strong>Qty.</strong></small>
                                            <div>
                                                <span><strong>(SQM.)</strong></span>
                                            </div>
                                        </th>
                                        <th>
                                            <small>
                                                <strong>Rate/</strong>
                                            </small>
                                            <div>
                                                <span><strong>SQM  (US $)</strong></span>
                                            </div>
                                        </th>
                                        <th>
                                            <small>
                                                <strong>Amount </strong>
                                            </small>
                                            <div>
                                                <span><strong>(in US $)</strong></span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderData.items.map((item,index) => (
                                            <tr key={index}>
                                                <td><strong>{index + 1}</strong></td>
                                                <td colspan="2"><strong>{item.product_variant.product.title}</strong></td>
                                                <td><strong>{item.quantity}</strong></td>
                                                <td><strong>{priceFormatter(item.price)}</strong></td>
                                                <td><strong>{priceFormatter(item.quantity * item.price)}</strong></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>


                            {/* <Row className="border  pt-0 pb-0 ml-0 mr-0">
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
                                <Col sm="3">
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

                            

                            {
                                orderData.items.map((item,index) => (
                                    <Row key={index} className="border  pt-0 pb-0 ml-0 mr-0" >
                                        <Col>
                                            <span><strong>{index + 1}</strong></span>
                                        </Col>
                                        <Col sm="6">
                                            <strong>{item.product_variant.product.title}</strong>
                                        </Col>
                                        <Col className="border">
                                            <div>
                                                <span><strong>{item.quantity}</strong></span>
                                            </div>
                                        </Col>
                                        <Col className="border">
                                            <div>
                                                <span><strong>{priceFormatter(item.price)}</strong></span>
                                            </div>
                                        </Col>
                                        <Col className="border">
                                            <small>
                                            <strong>{priceFormatter(item.quantity * item.price)} </strong>
                                            </small>
                                        </Col>
                                    </Row>
                                ))
                            } */}
                            

                            <Row className="border border-bottom-0 ml-0 mr-0" style={{minHeight:"100px"}}>
                                <Col sm="8">
                                    <small><strong>Amount Chargeable (In Words)</strong></small><br />
                                    <strong>- {toWords.convert(totals?.actualPrice)}</strong>
                                </Col>
                                <Col sm="4" className="border border-left-0">
                                    <small><strong>Total:</strong></small><br />
                                    <span><strong>{"  "}{priceFormatter( totals?.actualPrice)}</strong></span>
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
      </React.Fragment>)}
      </>
    )
}

export default Invoice
