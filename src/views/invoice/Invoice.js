import React, { useMemo } from "react"
import {
  Row,
  Col,
  Button,
  Spinner,
  CardBody,
  Card
} from "reactstrap"
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb"
import { FileText, Download } from "react-feather"
import { history } from "../../history"

import "../../assets/scss/pages/invoice.scss"
import NetworkError from "components/common/NetworkError"
import useInvoiceContext from "context/useInvoiceContext"
import { useSelector } from "react-redux"
import invoiceTemplateData from "../../assets/data/InvoiceTemplateData"

const Invoice =  () => {
    const {orderId,loading,loadingError} = useInvoiceContext();
    const {template:template_name} = useSelector((state) => state.auth.userInfo.profile.invoice_options)

    const template = useMemo(() => {
        return invoiceTemplateData.find((template) => template.slug ===  template_name)
    },[template_name])

    return (
        <>
        {loading && <Spinner />}
        {!loading && loadingError && <NetworkError error={loadingError} />}
        {!loading && (
            <React.Fragment>
                <BreadCrumb
                    breadCrumbTitle={"Invoice for Order #" + orderId}
                    breadCrumbParent= {<a href="#" onClick={e => {e.preventDefault(); history.push(`/orders/`)}}>All Orders</a>}
                    breadCrumbActive = {<a href="#" onClick={e => {e.preventDefault(); history.push(`/orders/${orderId}`)}}>{`Order #${orderId}`}</a>}
                />
                <Row>
                <Col className="mb-1 invoice-header" md="5" sm="12">
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
                        <CardBody className="p-5">
                            {
                                template ? template.component : (
                                    <h3 className="text-center">
                                        <u>INVOICE</u>
                                    </h3>
                                )
                            }
                        </CardBody>
                    </Card>
                </Col>
                </Row>
            </React.Fragment>
        )}
      </>
    )
}

export default Invoice;
