import apiClient from "api/base";
import { CountryData } from "assets/data/CountryData";
import React, { useEffect, useMemo, useState } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import Swal from "../../utils/Swal";
import Select from "react-select";
import { fetchPinCodeDetails } from "api/utils";

const initialData = {
  line1: "",
  line2: "",
  pin_code: "",
  city: "",
  state_id: "",
  country: "",
};

const SellerAddressComponent = () => {
  const [data, setData] = useState(initialData);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const available_countries = useMemo(() => {
    return [...new Set(states.map((state) => state.country))];
  }, [states]);

  const countries = useMemo(
    () =>
      CountryData.filter((country) =>
        available_countries.includes(country.value)
      ),
    [available_countries]
  );

  useEffect(() => {
    setLoading(true)
    apiClient
      .get("/profile/seller-address/")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setStates(data.states_list);

        if(data.addresses.length > 0){
          const initialAddress = data.addresses.find((address) => address.is_default=true)
          const {state,...address} = {...initialAddress,state_id:initialAddress.state.id,country:initialAddress.state.country}
          setData(address)
        }

        setLoading(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch seller addresses",
        });
      });
  }, []);

  const onChange = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

    if(e.target.name === "pin_code" && (e.target.value.trim().length === 6) && data.country === "IN"){
      fetchPinCodeDetails(e.target.value)
        .then(data => {
          const state = states.find(({name,...rest}) => name.toLowerCase() === data.state.toLowerCase())

          setData((prevState) => ({...prevState,city:data.district,state_id:state?.id || ""}))
        })
        .catch((err) => {console.log("ERR ", err)})
    }
  };

  const onSubmit = async () => {
    setLoading(true)

    let url = data?.id ? `/profile/seller-address/${data?.id}/` : `/profile/seller-address/`

    await apiClient.post(url,data)
    .then((response) => {
      setData(initialData)
      return response.data
    })
    .then((data) => {
      const address = {...data,state_id:data.state.id,country:data.state.country}
      setData(address)
  
      Swal.fire({
        icon:"success",
        title:'Success',
        text:"Address Updated Successfully"
      })
      
      setLoading(false)
    })
    .catch((error) => {
      Swal.fire({
        icon:"error",
        title:"Error",
        text:"Failed to create Address"
      })
    })
  }

  return (
    <Card className="position-relative">
      <CardHeader>
        <CardTitle> Seller Address Setting </CardTitle>
      </CardHeader>
      <hr />
      <CardBody>
        <Row>
          <Col sm="12" className="border-bottom">
            <FormGroup>
              <Label for="country">Country</Label>

              <Select
                placeholder="Select country..."
                options={countries}
                value={countries.find(
                  (country) => country.value === data.country
                )}
                onChange={(data) =>
                  setData((prevState) => ({
                    ...prevState,
                    country: data.value,
                  }))
                }
              />
            </FormGroup>
          </Col>
          <Col sm="12" className="mt-1">
            <Label for="line1">House/Shop Number, Apartment/Company:</Label>
            <FormGroup className="has-icon-left position-relative">
              <Input
                type="text"
                name="line1"
                id="line1"
                placeholder="House/Shop Number, Apartment/Company..."
                value={data?.line1}
                onChange={onChange}
              />
              <div className="form-control-position">
                <BiCurrentLocation />
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <Label for="line2">Colony/Street, Additional Details:</Label>
            <FormGroup className="has-icon-left position-relative">
              <Input
                type="text"
                name="line2"
                id="line2"
                placeholder="Colony/Street, Additional Details..."
                value={data?.line2}
                onChange={onChange}
              />
              <div className="form-control-position">
                <BiCurrentLocation />
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <Row>
              <Col sm="4">
                <Label for="pincode">Pin Code</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="pin_code"
                    id="pincode"
                    placeholder="Pin Code"
                    value={data?.pin_code}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <Label for="city">City</Label>
                <FormGroup className="has-icon-left position-relative">
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="city"
                    value={data?.city}
                    onChange={onChange}
                  />
                  <div className="form-control-position">
                    <BiCurrentLocation />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="state">Select State: </Label>
                  <Select
                    placeholder="Select State..."
                    options={states.filter(
                      (st) => st.country === data.country
                    )}
                    value={states.find((st) => st.id === data.state_id)}
                    onChange={(data) =>
                      setData((prevState) => ({
                        ...prevState,
                        state_id: data.id,
                      }))
                    }
                    getOptionValue={(props) => props.id}
                    getOptionLabel={(props) => props.name}
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col sm="12">
            <Button.Ripple
              color="primary"
              type="submit"
              className="mr-1 mb-1"
              onClick={onSubmit}
            >
              {data?.id ? 'Update Address' : 'Create Address'}
            </Button.Ripple>
          </Col>
        </Row>
      </CardBody>

      {loading ? (
        <div className="position-absolute position-center">
          <Spinner />
        </div>
      ) : null}
    </Card>
  );
};

export default SellerAddressComponent;
