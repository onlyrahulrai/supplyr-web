import { _CurrenciesData } from "assets/data/CurrenciesData";
import React, { useState } from "react";
import { connect } from "react-redux";
import apiClient from "api/base";
import Select from "react-select";
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";
import _Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content";


const Swal = withReactContent(_Swal);


const CurrenciesData = _CurrenciesData.map((currency, index) => {
  let { code: label, ...rest } = currency;
  return { value: index, label, ...rest };
});

const CurrencySettings = ({ profile }) => {
  const [sellerData, setSellerData] = useState({default_currency:profile?.default_currency,currency_representation:profile?.currency_representation});

  const formatOptionLabel = ({ label, name, symbol }) => {
    return (
      <div>
        <span>{name}</span>
        <div>
          <small>
            <strong>
              ({label}
              {symbol && ` - ${symbol}`})
            </strong>
          </small>
        </div>
      </div>
    );
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
      div: {
        overflow: "initial",
      },
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let requestedData = {
      setting:"profile-setting",
      data: sellerData
    }

    await apiClient
      .put(`/profile/seller-profile-settings/`,requestedData)
      .then((response) => {
        Swal.fire("Currency Saved", "", "success");
      })
      .catch((error) => console.log(error.data));
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="currency">Currency Type</Label>
          <Select
            defaultValue={CurrenciesData[3]}
            options={CurrenciesData}
            menuPlacement="auto"
            formatOptionLabel={formatOptionLabel}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              control: customStyles.control,
            }}
            // value={CurrenciesData.find((c) => c.code == )}
            onChange={(data) =>
              setSellerData({ ...sellerData, default_currency: data.label })
            }
            value={CurrenciesData.find(
              (c) => c.label === sellerData?.default_currency
            )}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="currency_representation">
            Currency Representation
          </Label>
          <Input
            type="text"
            placeholder="Enter your currency representation..."
            value={sellerData?.currency_representation || ""}
            onChange={(e) =>
              setSellerData({
                ...sellerData,
                currency_representation: e.target.value,
              })
            }
          />
          <FormText className="text-muted">
            Please try to typing currency representation including these word {`{{amount}}/{{amount_no_decimals}}`}
          </FormText>
        </FormGroup>

        <Button.Ripple type="submit" color="primary" className="mt-1">
          Save
        </Button.Ripple>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.auth.userInfo.profile,
  };
};

export default connect(mapStateToProps)(CurrencySettings);
