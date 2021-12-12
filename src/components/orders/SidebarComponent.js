import Address from "components/inventory/Address";
import React, { useState } from "react";
import { Edit3 } from "react-feather";
import { Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { capitalizeString, priceFormatter } from "utility/general";

const SidebarComponent = (props) => {
    const {setOrderInfo,buyerData,orderId,totals,orderInfo} = props
    const [modal,setModal] = useState(false)

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleAddressSelect = (id) => {
        setOrderInfo((prevState) => ({...prevState,address:buyerData.address.find((address) => address.id === id)}))
        toggleModal()
    }
    console.log("order info data >>>> ",orderInfo)
  return (
    <>
      <Card>
        <CardBody>
           <Row className="mb-1">
            <Col>
              <h6 className="text-secondary">Order ID</h6>
              <h3>#{orderId || "New"}</h3>
              {/* {orderId && <h6>{orderData.order_date}</h6>} */}
            </Col>
            <Col sm="auto" className="ml-auto text-right">
              <h6 className="text-secondary">From</h6>
              <h3>{capitalizeString(buyerData.owner || "")}</h3>
            </Col>
          </Row>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-secondary">SHIPPING ADDRESS</h6>
            <Edit3
              size="20"
              color="cadetblue"
              title="Edit"
              role="button"
              className="pointer"
              onClick={toggleModal}
            />
          </div>

          <Address {...buyerData.address[0]} />

          <hr />
          <div className="price-details">
            <p>Price Details</p>
          </div>
          <div className="detail">
            <div className="detail-title">Total MRP</div>
            <div className="detail-amt">{priceFormatter(totals.actualPrice)}</div>
          </div>
          <div className="detail">
            <div className="detail-title">Discount</div>
            <div className="detail-amt discount-amt">
              {priceFormatter(totals.actualPrice - totals.salePrice)}
            </div>
          </div>

          <hr />
          <div className="detail">
            <div className="detail-title detail-total">Final Price</div>
            <div className="detail-amt total-amt">{priceFormatter(totals.salePrice)}</div>
          </div> 

            <Modal
            isOpen={modal}
            toggle={toggleModal}
            className="modal-dialog-centered select-buyer-address modal-lg"
          >
            <ModalHeader toggle={toggleModal}>
              Select Buyer Address:
            </ModalHeader>
            <ModalBody>
              <Row>
                {buyerData.address?.map((address, index) => {
                  const { id, name, line1, line2, pin, city, state } = address;
                  return (
                    <Col
                      md="6"
                      key={index}
                      onClick={() => handleAddressSelect(id)}
                    >
                      <Card className={`cursor-pointer ${(orderInfo.address.id === id) && "bg-danger text-white"}`}>
                        <CardBody>
                          <div>
                            <strong>Address:</strong>
                            {"   "}
                            <span>{name}</span>
                          </div>
                          <div>
                            <strong>City:</strong> <span>{city}</span>
                          </div>
                          <div>
                            <strong>Line 1:</strong>
                            {"   "}
                            <span>{line1}</span>
                          </div>
                          <div>
                            <strong>Line 2:</strong>
                            {"   "}
                            <span>{line2}</span>
                          </div>

                          <div>
                            <strong>State:</strong>
                            {"   "}
                            <span>{state}</span>
                          </div>
                          <div>
                            <strong>Pin Code:</strong> {"   "}
                            <span>{pin}</span>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </ModalBody>
          </Modal> 
        </CardBody>
      </Card>
    </>
  );
};

export default SidebarComponent;
