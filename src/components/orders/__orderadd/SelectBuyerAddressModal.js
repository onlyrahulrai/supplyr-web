import React from "react";
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import useOrderAddContext from "context/useOrderAddContext2.0";

const Address = (props) => {
  const {cart,dispatchCart,getValidAddress,seller_address,getExtraDiscount,getValidGstRate} = useOrderAddContext();
  const { id, name, line1, line2, pin, city, state} = getValidAddress(props.address);

  const onUpdateAddress = () => {

    const items = cart.items.map((item) => {
      const discount = cart?.buyer?.product_discounts.find(
        (discount) =>
          discount.product.variants.includes(item.variant.id)
      );

      const isSellerAndBuyerFromSameOrigin = seller_address?.state?.id === props.address?.state?.id;

      console.log(" ----- Is Seller And Buyer From Same Origin ----- ",isSellerAndBuyerFromSameOrigin)

      let extra_discount = discount ? getExtraDiscount(item.price,discount) * item.quantity : 0;

      return {
        ...item,
        extra_discount,
        ...getValidGstRate({...item,extra_discount},isSellerAndBuyerFromSameOrigin)
      }
    });

    

    dispatchCart({type:"ON_UPDATE_ADDRESS",payload:{address:props.address,address_id:id}})
    dispatchCart({type:"ON_UPDATE_CART_ITEMS",payload:items})
  }

  return (
    <Col md="6" onClick={onUpdateAddress} className={`cursor-pointer`}>
      <Card className={`${cart.address_id === id && "bg-danger text-white"}`}>
        <CardBody>
          <div>
            <strong>Address:</strong> <span>{name}</span>
          </div>
          <div>
            <strong>City:</strong>{" "}
            <span>
              {city} (Pin - {pin})
            </span>
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
        </CardBody>
      </Card>
    </Col>
  );
};

const SelectBuyerAddressModal = ({ isOpen, onToggleModal }) => {
  const {cart,getValidAddress} = useOrderAddContext()

  return (
    <Modal
      isOpen={isOpen}
      toggle={onToggleModal}
      className="modal-dialog-centered select-buyer-address modal-lg"
    >
      <ModalHeader toggle={onToggleModal}>Select Buyer Address:</ModalHeader>
      <ModalBody>
        <Row>
            
          {
            cart.buyer ? (
              <>
                {
                   cart.buyer.address.map((address, index) => (
                    <Address address={address} key={index}/>
                   ))
                }
              </>
            ):null
          }

        </Row>
      </ModalBody>
    </Modal>
  );
};

export default SelectBuyerAddressModal;
