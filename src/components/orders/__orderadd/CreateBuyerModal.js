import apiClient from "api/base";
import useOrderAddContext from "context/useOrderAddContext2.0";
import React, { useEffect,useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  Input,
  Spinner,
} from "reactstrap";
import {toast} from "react-toastify";
import { regx } from "utility/general";

const defaultOptions = {
  business_name:"",
  email:"",
  mobile_number:""
}

const CreateBuyerModal = ({ isOpen, onToggleModal,searchInput }) => {  
  const [data, setData] = useState(defaultOptions);
  const [loading,setLoading] = useState(false);
  const {cart,seller_address,dispatchCart,getExtraDiscount,getValidGstRate,setIsOpenBuyerAddressCreateModal} = useOrderAddContext()
  useEffect(() => {
    if(searchInput){
      const object = new Object();

      if(regx.email.test(searchInput)){
        object['email'] = searchInput
      }else if(regx.mobileNumber.test(searchInput)){
        object['mobile_number'] = searchInput
      }else if(regx.alpha.test(searchInput)){
        object['business_name'] = searchInput
      }
      setData({...defaultOptions,...object})
    }
  },[setData,searchInput])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await apiClient.post("/profile/buyer-create/",data)
    .then((response) => {
      const data = response.data;

      const address = data.address.length ? data.address[0] : null;

      const extraOptions = {
        buyer:data,
        buyer_id:data?.id,
        address:address,
        address_id:address?.id
      }

      dispatchCart({
        type: "ON_SELECT_BUYER",
        payload: extraOptions
      });

      const items = cart?.items?.map((item) => {
        const isSellerAndBuyerFromSameOrigin = seller_address?.state?.id === address?.state?.id;

        const productSpecificDiscount = data.product_discounts.find(
          (discount) =>
            discount.product.variants.includes(item?.variant?.id)
        );

        const generic_discount = data?.generic_discount;

        const extra_discount =  productSpecificDiscount ? getExtraDiscount(item?.price ,productSpecificDiscount) * item?.quantity: generic_discount ? getExtraDiscount(item?.price ,generic_discount) * item?.quantity : 0;

        return {
          ...item,
          extra_discount,
          ...getValidGstRate(item,isSellerAndBuyerFromSameOrigin)
        }
      });

      dispatchCart({
        type: "ON_UPDATE_CART_ITEMS",
        payload: items,
      });

      setData(defaultOptions)
      onToggleModal()
      setIsOpenBuyerAddressCreateModal((prevState) => !prevState)
      setLoading(false);
      toast.success("Buyer has created successfully.")
    })
    .catch((error) => toast.error("Failed to create buyer profile!."))
  }

  const onChange = (e) =>
  setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <Modal isOpen={isOpen} toggle={onToggleModal} centered onClosed={() => setData(defaultOptions)}>
      <ModalHeader toggle={onToggleModal}>
        <span>Create New Buyer :)</span>
      </ModalHeader>
      <ModalBody
        className="position-relative">
        <FormGroup>
          <Label for="mobile">Buyer Mobile Number:</Label>
          <Input
            placeholder="+91 9999999999"
            value={data.mobile_number}
            onChange={onChange}
            name="mobile_number"
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Buyer Business Name:</Label>
          <Input
            placeholder="John Electronics Shop"
            value={data.business_name}
            onChange={onChange}
            name="business_name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Buyer Email:</Label>
          <Input
            placeholder="john@gmail.com"
            value={data.email}
            onChange={onChange}
            name="email"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button 
          type="button" 
          color="warning" 
          onClick={onToggleModal}
          disabled={loading}
        >
          Cancel
        </Button>{" "}
        <Button
          type="click"
          color="primary"
          onClick={onSubmit}
          disabled={loading}
        >
          Save
        </Button>
      </ModalFooter>
      <div className="position-absolute" style={{top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
        {
          loading ? <Spinner /> : null
        }
      </div>
    </Modal>
  );
};

export default CreateBuyerModal;
