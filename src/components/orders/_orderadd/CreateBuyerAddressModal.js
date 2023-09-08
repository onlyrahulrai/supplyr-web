import apiClient from "api/base";
import useOrderAddContext from "context/useOrderAddContext";
import React, { useMemo, useState } from "react";
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
import { CountryData } from "assets/data/CountryData";
import Select from 'react-select'
import {toast} from "react-toastify";

const initialData = {
    name: "",
    line1: "",
    line2: "",
    city:"",
    pin:"",
    state_id:"",
    phone:"",
    is_default:true
  }

const CreateBuyerAddressModal = ({ isOpen, onToggleModal }) => {
  const [country,setCountry] = useState("");  
  const { buyer,setBuyer,onChangeOrderInfo, setIsOpenBuyerAddressCreateModal } = useOrderAddContext();
  const [data, setData] = useState({...initialData,name:buyer?.name,phone:buyer?.mobile_number});
  const [loading,setLoading] = useState(false)

  const _available_countries = useMemo(() => buyer && [...new Set(buyer?.states?.map(st=>st.country))] ,[buyer])

  const countries = useMemo(() => buyer && CountryData.filter((country) => _available_countries.includes(country.value)) ,[buyer])

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await apiClient.post(`/profile/buyer-address/?buyer_id=${buyer?.id}`,data)
    .then((response) => {
        const data = response.data;
        const address = {...data,state:data.state.name}
        const addresses = [...buyer.address,address]
        setBuyer((prevState) => ({...prevState,address:addresses}))
        onChangeOrderInfo({address:address})
        setIsOpenBuyerAddressCreateModal((prevState) => !prevState)
        setData(initialData)
        setLoading(false)
        toast.success("Buyer address has created successfully.")
    })
    .catch((error) => {
      toast.error("Failed to create buyer address!.")
    })
  };

  const onChange = (e) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  return (
    <Modal isOpen={isOpen} toggle={onToggleModal} centered>
      <ModalHeader toggle={onToggleModal}>
        <span>Create New Buyer Address :)</span>
      </ModalHeader>
      <ModalBody className="position-relative">
        <FormGroup>
          <Label for="mobile">Select Country:</Label>
          <Select 
            placeholder="Select country..."
            options={countries}
            value={country}
            onChange={setCountry}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Buyer Name:</Label>
          <Input
            type="text"
            placeholder="John Doe"
            name="name"
            value={data.name}
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">House/Shop Number, Apartment/Company:</Label>
          <Input
            type="text"
            placeholder="House/Shop Number, Apartment/Company..."
            value={data.line1}
            name="line1"
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Colony/Street, Additional Details:</Label>
          <Input
            type="text"
            placeholder="Colony/Street, Additional Details..."
            value={data.line2}
            name="line2"
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Pin Code:</Label>
          <Input
            type="text"
            placeholder="Pin Code"
            value={data.pin}
            name="pin"
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">City/Town:</Label>
          <Input
            type="text"
            placeholder="City/Town"
            name="city"
            value={data.city}
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Select State:</Label>
          
          <Select
            placeholder="Select State..."
            options={buyer?.states?.filter((st) => st.country === country.value)}
            value={buyer?.states?.find((st) => st.id === data.state_id)}
            onChange={(data) => setData((prevState) => ({...prevState,state_id:data.id}))}
            getOptionValue={(props) => props.id}
            getOptionLabel={(props) => props.name}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobile">Phone/Mobile Number:</Label>
          <Input
            type="text"
            placeholder="Phone/Mobile Number"
            value={data.phone}
            name="phone"
            onChange={onChange}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="warning" disabled={loading} onClick={onToggleModal}>
          Cancel
        </Button>{" "}
        <Button type="click" color="primary" disabled={loading} onClick={onSubmit}>
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

export default CreateBuyerAddressModal;
