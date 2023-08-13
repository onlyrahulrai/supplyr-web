import apiClient from "api/base";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import PriceDisplay from "components/utils/PriceDisplay";
import { useOrderAddContext } from "context/OrderAddContext";
import React, { useState } from "react";
import { Edit3 } from "react-feather";
import { MdCreate } from "react-icons/md";
import { Button, Card, CardBody } from "reactstrap";
import { getTwoDecimalDigit, regx } from "utility/general";
import CreateBuyerAddressModal from "./CreateBuyerAddressModal";
import { components } from "react-select";
import { toast } from "react-toastify";
import Address from "components/inventory/Address";
import Swal from "components/utils/Swal";
import { useHistory, useParams } from "react-router-dom";
import ShowTaxesComponent from "./ShowTaxesComponent";
import SelectBuyerAddressModel from "./SelectBuyerAddressModel";
import CreateBuyerModal from "./CreateBuyerModel";

export const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 50,
  }),
};

const NoOptionsMessage = (props) => {
  const { onChangeStateByKeyValue,buyerSearchInput,onUpdateBuyer } = useOrderAddContext();

  const onToggleModal = async () => {
    const isValid = regx.email.test(buyerSearchInput) || regx.mobileNumber.test(buyerSearchInput);
    onChangeStateByKeyValue("isMenuOpen",false)
    if (isValid) {
      const query = new URLSearchParams({ q: buyerSearchInput }).toString();

      await apiClient
        .get(`/profile/buyers-search/?${query}`)
        .then(async (response) => {
          if (response.data.length === 0) {
            onChangeStateByKeyValue("IsOpenBuyerCreateModal",false);
          } else {
            const requestData = { buyer_id: response.data[0].id };

            await apiClient
              .post("/profile/sellers/", requestData)
              .then((response) => {
                const data = response.data;

                console.log(" Data ",data)
                onUpdateBuyer(data,() => onChangeStateByKeyValue("buyerSearchInput",""))

                toast.success(
                  `Seller connected with buyer (${data?.business_name})`
                );
              })
              .catch((error) => {
                toast.error("Couldn't search buyers.");
              });
          }
          console.log(" No Option Message ",response.data)
        })
        .catch((error) => toast.error("Couldn't search buyers."));
    } else {
      onChangeStateByKeyValue("isOpenBuyerCreateModal",true);
    }
  };

  return (
    <components.NoOptionsMessage {...props}>
      <span className="text-dark">
        No Buyer Found &nbsp;
        <b>
          <q className="text-primary cursor-pointer" onClick={onToggleModal}>
            Create new one?
          </q>
        </b>
      </span>
    </components.NoOptionsMessage>
  );
};

const Sidebar = () => {
  const {
    items,
    address,
    buyer,
    isMenuOpen,
    onChangeStateByKeyValue,
    buyerSearchInput,
    onChangeBuyer,
    getValidAddress,
    ...rest
  } = useOrderAddContext();
  const [isOpenBuyerAddresses, setIsOpenBuyerAddresses] = useState(false);
  const { orderId } = useParams();
  const history = useHistory()

  const validateForm = () => {
    const errors = [];

    if (!items?.length) {
      errors.push("Please add atleast one product!");
    }

    if (!buyer) {
      errors.push("Buyer isn't selected!");
    }

    if (errors.length > 0) {
      Swal.fire(
        <div className="py-1">
          <div className="mb-1">Error!</div>
          <h4>Please correct the following errors</h4>
          {errors.map((error, index) => (
            <h6 className="text-danger" key={index}>
              {error}{" "}
            </h6>
          ))}
        </div>
      );

      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async () => {
    const isValid = validateForm();

    if (isValid) {

      const orderitems = items.map(({price,quantity,extra_discount,variant,item_note,subtotal,...rest}) => ({price,quantity,extra_discount,variant_id:variant.id,item_note,subtotal}))

      console.log(" Orderitems ",orderitems)

      const requestData = {
        items: orderitems,
        buyer_id:buyer?.id,
        address: address?.id,
      };

      let url = orderId ? `/orders/${orderId}/update/` : "/orders/";

      await apiClient
        .post(url, requestData)
        .then((response) => {
          console.log("response data >>>>> ", response.data);
          history.push(`/orders/${response.data.id}`);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "🙏We can't process your data to create new order.So please try after some time later.",
          });
        });
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="coupons">
          <div className="coupons-title">
            <p>Order ID</p>
            <h2 className="text-light">#{orderId ? orderId : "New"}</h2>
          </div>
          {buyer ? (
            <div className="apply-coupon cursor-auto">
              <p className="text-right text-dark">From</p>
              <div className="text-right text-secondary">
                <span>{`${buyer?.name ? `(${buyer?.name})` : ""}`}</span>
              </div>
              <br />
              <h4 className="text-light">{buyer?.business_name}</h4>
            </div>
          ) : null}
        </div>
        <hr />
        <div className="address-section">
          {!orderId ? (
            <>
              <CustomAsyncPaginate
                path="profile/seller-contact-with-buyers-for-order/"
                formatOptionLabel={(props) => {
                  const { name, email, business_name, mobile_number } = props;

                  return (
                    <div>
                      <div>
                        {name ? `${name} | ` : ""}
                        {business_name}
                      </div>
                      <div className="text-lightgray">
                        <span>
                          {mobile_number && `${mobile_number} | `}{" "}
                          {email && email}{" "}
                        </span>
                      </div>
                    </div>
                  );
                }}
                closeMenuOnSelect={false}
                components={{ NoOptionsMessage }}
                value={buyer}
                onChange={onChangeBuyer}
                menuIsOpen={isMenuOpen}
                styles={{
                  noOptionsMessage: (base) => ({ ...base }),
                  ...customStyles,
                }}
                name="buyerSearchInput"
                getOptionLabel={(props) => props.name}
                getOptionValue={(props) => props.id}
                inputValue={buyerSearchInput}
                onInputChange={(data) => onChangeStateByKeyValue("buyerSearchInput", data)}
                onBlur={(e) => {
                  onChangeStateByKeyValue("buyerSearchInput", e.target.value);
                }}
                onMenuOpen={() => onChangeStateByKeyValue("isMenuOpen", true)}
                onMenuClose={() => onChangeStateByKeyValue("isMenuOpen", false)}
              />
              <CreateBuyerModal
                isOpen={rest?.isOpenBuyerCreateModal}
                onToggleModal={() =>
                  onChangeStateByKeyValue(
                    "isOpenBuyerCreateModal",
                    !rest?.isOpenBuyerCreateModal
                  )
                }
                searchInput={buyerSearchInput}
              />
            </>
          ) : null}


          {buyer ? (
            <div className="mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-secondary">SHIPPING ADDRESS</h6>
                {address || buyer?.address.length > 0 ? (
                  <span>
                    <Edit3
                      size="20"
                      color="cadetblue"
                      title="Edit"
                      role="button"
                      className="pointer"
                      onClick={() =>
                        setIsOpenBuyerAddresses((prevState) => !prevState)
                      }
                    />{" "}
                    Edit
                  </span>
                ) : (
                  <>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        onChangeStateByKeyValue(
                          "isOpenBuyerAddressCreateModal",
                          !rest?.isOpenBuyerAddressCreateModal
                        )
                      }
                    >
                      <MdCreate
                        size="20"
                        color="cadetblue"
                        title="Create"
                        role="button"
                      />{" "}
                      Create
                    </span>

                    <CreateBuyerAddressModal
                      isOpen={rest?.isOpenBuyerAddressCreateModal}
                      onToggleModal={() =>
                        onChangeStateByKeyValue(
                          "isOpenBuyerAddressCreateModal",
                          !rest?.isOpenBuyerAddressCreateModal
                        )
                      }
                    />
                  </>
                )}
              </div>

              {!address ? (
                <div className="mt-1">
                  <span>No Address Added!</span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : null}

          {address ? (
            <>
              <Address {...getValidAddress(address)} />
            </>
          ) : null}

          <SelectBuyerAddressModel
            isOpen={isOpenBuyerAddresses}
            onToggleModal={() =>
              setIsOpenBuyerAddresses((prevState) => !prevState)
            }
          />
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title">Subtotal</div>
          <div className="detail-amt">
            <PriceDisplay amount={rest.subtotal} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">Extra Discount</div>
          <div className="detail-amt discount-amt">
            -<PriceDisplay amount={rest.total_extra_discount || 0} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">Taxable Amount:</div>
          <div className="detail-amt">
            <PriceDisplay amount={rest.taxable_amount} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">
            Tax Amount&nbsp;
            <ShowTaxesComponent
              taxes={
                { cgst: rest.cgst, sgst: rest.sgst,igst: rest.igst }
              }
            />
            :
          </div>
          <div className="detail-amt">
            <PriceDisplay amount={getTwoDecimalDigit(rest.igst + rest.cgst + rest.sgst)} />
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title detail-total">Final Amount</div>
          <div className="detail-amt total-amt">
            <PriceDisplay amount={rest?.total_amount} />
          </div>
        </div>
        <Button.Ripple
          type="submit"
          block
          color="danger"
          className="btn-block"
          onClick={onSubmit}
        >
          {orderId ? "Update Order" : "Create Order"}
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
