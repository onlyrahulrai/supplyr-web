import apiClient from "api/base";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import PriceDisplay from "components/utils/PriceDisplay";
import useOrderAddContext from "context/useOrderAddContext2.0";
import React, { useState } from "react";
import { Edit3 } from "react-feather";
import { MdCreate } from "react-icons/md";
import { Button, Card, CardBody, Spinner } from "reactstrap";
import { getTwoDecimalDigit, regx } from "utility/general";
import CreateBuyerAddressModal from "./CreateBuyerAddressModal";
import { components } from "react-select";
import { toast } from "react-toastify";
import Address from "components/inventory/Address";
import CreateBuyerModal from "./CreateBuyerModal";
import Swal from "components/utils/Swal";
import { history } from "../../../history";
import ShowTaxesComponent from "./ShowTaxesComponent";
import SelectBuyerAddressModal from "./SelectBuyerAddressModal";


export const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 50,
  }),
};

const NoOptionsMessage = (props) => {
  const {
    setIsOpenBuyerCreateModal,
    buyerSearchInput,
    dispatchCart,
    setIsMenuOpen,
    setBuyerSearchInput,
    cart,
    seller_address,
    getExtraDiscount,
    getValidGstRate
  } = useOrderAddContext();

  const onToggleModal = async () => {
    const isValid =
      regx.email.test(buyerSearchInput) ||
      regx.mobileNumber.test(buyerSearchInput);
    setIsMenuOpen(false);
    if (isValid) {
      const query = new URLSearchParams({ q: buyerSearchInput }).toString();
      await apiClient
        .get(`/profile/buyers-search/?${query}`)
        .then(async (response) => {
          if (response.data.length === 0) {
            setIsOpenBuyerCreateModal((prevState) => !prevState);
          } else {
            const requestData = { buyer_id: response.data[0].id };
            await apiClient
              .post("/profile/sellers/", requestData)
              .then((response) => {
                const data = response.data;

                const address = data.address[0]

                dispatchCart({
                  type: "ON_SELECT_BUYER",
                  payload: {
                    buyer: data,
                    buyer_id: data?.id,
                    address: address,
                    address_id:address?.id
                  },
                });


                const items = cart.items.map((item) => {
                  const discount = data.product_discounts.find(
                    (discount) =>
                      discount.product.variants.includes(item?.variant?.id)
                  );

                  const isSellerAndBuyerFromSameOrigin = seller_address?.state?.id === address?.state?.id;

                  let extra_discount = discount ? getExtraDiscount(item.price,discount) * item.quantity : 0;

                  return {
                    ...item,
                    extra_discount,
                    ...getValidGstRate({...item,extra_discount},isSellerAndBuyerFromSameOrigin)
                  }
                });

                dispatchCart({
                  type: "ON_UPDATE_CART_ITEMS",
                  payload: items,
                });
                setBuyerSearchInput("");
                
                toast.success(
                  `Seller connected with buyer (${data.business_name})`
                );
              })
              .catch((error) => {
                console.log(" ---- Error ---- ", error);
              });
          }
        })
        .catch((error) => console.log(" ----- Failed to search buyer ----- ",error));
    } else {
      setIsOpenBuyerCreateModal((prevState) => !prevState);
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
    orderId,
    cart,
    buyerSearchInput,
    setBuyerSearchInput,
    isMenuOpen,
    setIsMenuOpen,
    isOpenBuyerCreateModal,
    setIsOpenBuyerCreateModal,
    isOpenBuyerAddressCreateModal,
    setIsOpenBuyerAddressCreateModal,
    dispatchCart,
    getExtraDiscount,
    getValidAddress,
    getValidGstRate,
    seller_address,
  } = useOrderAddContext();
  const [isOpenBuyerAddresses, setIsOpenBuyerAddresses] = useState(false);
  const [isBuyerLoading,setIsBuyerLoading] = useState(false)

  const {igst,sgst,cgst} = cart;

  const validateForm = () => {
    const errors = [];

    if (!cart.items.length) {
      errors.push("Please add atleast one product!");
    }

    if (!cart.buyer_id) {
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
    // const isValid = validateForm();
    const isValid = false;

    const {id,items,isFormOpen,buyer,address_id,price,tax_amount,...rest} = cart;
    
    const variants = items.map(({product,set_focus,variant,tax_amount,...rest}) => ({...rest,variant_id:variant.id})) 
    
    if (isValid) {

      const requestData = {
        ...rest,
        items: [...variants],
        address: address_id,
        address_id,
        taxable_amount:parseFloat(rest.taxable_amount.toFixed(2)),
      };

      let url = "/orders/";

      if (orderId) {
        url += orderId + "/update/";
      }

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
          {cart.buyer ? (
            <div className="apply-coupon cursor-auto">
              <p className="text-right text-dark">From</p>
              <div className="text-right text-secondary">
                <span>{`${cart?.buyer?.name ? `(${cart?.buyer.name})` : ""}`}</span>
              </div>
              <h4 className="text-light">{cart?.buyer?.business_name}</h4>
            </div>
          ) : null}
        </div>
        <hr />
        <div className="address-section">
          {!orderId ? (
            <>
              <CustomAsyncPaginate
                path="inventory/seller-buyers/"
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
                value={cart.buyer}
                onChange={async (data) => {
                  setIsBuyerLoading(true)

                  console.log(" ----- Data ----- ",data)

                  await apiClient
                  .get(`/inventory/seller-buyers/${data?.id}`)
                  .then((response) => {
                    const data = response.data;
                    
                    const address = data.address[0]

                      dispatchCart({
                        type: "ON_SELECT_BUYER",
                        payload: {
                          buyer: data,
                          buyer_id: data?.id,
                          address: address,
                          address_id:address?.id
                        },
                      });

                      setIsBuyerLoading(false)

                      const items = cart.items.map((item) => {
                        
                        const discount = data.product_discounts.find(
                          (discount) =>
                            discount.product.variants.includes(item?.variant?.id)
                        );

                        const isSellerAndBuyerFromSameOrigin = seller_address?.state?.id === address?.state?.id;

                        let extra_discount = discount ? getExtraDiscount(item.price,discount) * item.quantity : 0;

                        return {
                          ...item,
                          extra_discount,
                          ...getValidGstRate({...item,extra_discount},isSellerAndBuyerFromSameOrigin)
                        }
                      });

                      dispatchCart({
                        type: "ON_UPDATE_CART_ITEMS",
                        payload: items,
                      });

                      setIsMenuOpen(false);
                    })
                    .catch((error) => console.log(" ---- Error ---- ",error));
                }}

                menuIsOpen={isMenuOpen}
                styles={{
                  noOptionsMessage: (base) => ({ ...base }),
                  ...customStyles,
                }}
                getOptionLabel={(props) => props.name}
                getOptionValue={(props) => props.id}
                inputValue={buyerSearchInput}
                onInputChange={(data) => setBuyerSearchInput(data)}
                onBlur={(e) => {
                  setBuyerSearchInput(e.target.value);
                }}
                onMenuOpen={() => setIsMenuOpen(true)}
                onMenuClose={() => setIsMenuOpen(false)}
              />
              <CreateBuyerModal
                isOpen={isOpenBuyerCreateModal}
                onToggleModal={() =>
                  setIsOpenBuyerCreateModal(!isOpenBuyerCreateModal)
                }
                searchInput={buyerSearchInput}
              />
            </>
          ) : null}

          {(!cart.buyer && isBuyerLoading) ? (
            <div className="text-center mt-2">
              <Spinner />
            </div>
          ) : null}
          
          {cart.buyer ? (
            <div className="mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-secondary">SHIPPING ADDRESS</h6>
                {(cart?.address || cart?.buyer?.address.length > 0) ? (
                  <span>
                    <Edit3
                      size="20"
                      color="cadetblue"
                      title="Edit"
                      role="button"
                      className="pointer"
                      onClick={() =>
                        setIsOpenBuyerAddresses(!isOpenBuyerAddresses)
                      }
                    />{" "}
                    Edit
                  </span>
                ) : (
                  <>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        setIsOpenBuyerAddressCreateModal(
                          (prevState) => !prevState
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
                      isOpen={isOpenBuyerAddressCreateModal}
                      onToggleModal={() =>
                        setIsOpenBuyerAddressCreateModal(
                          (prevState) => !prevState
                        )
                      }
                    />
                  </>
                )}
              </div>

              {!cart.address ? (
                <div className="mt-1">
                  <span>No Address Added!</span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : null}

          {cart?.address ? (
            <>
              <Address
                {...getValidAddress(cart.address)}
              />

            </>
          ) : null}

            <SelectBuyerAddressModal
              isOpen={isOpenBuyerAddresses}
              onToggleModal={() =>
                  setIsOpenBuyerAddresses(!isOpenBuyerAddresses)
              }
            />
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title">Subtotal</div>
          <div className="detail-amt">
            <PriceDisplay amount={cart.price} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">Extra Discount</div>
          <div className="detail-amt discount-amt">
            -<PriceDisplay amount={cart.total_extra_discount} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">
            Taxable Amount:
          </div>
          <div className="detail-amt">
            <PriceDisplay amount={getTwoDecimalDigit(cart.taxable_amount)} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">
            Tax Amount&nbsp;<ShowTaxesComponent taxes={
              igst ? {igst} : {cgst,sgst}
            } />:
          </div>
          <div className="detail-amt">
            <PriceDisplay amount={cart.tax_amount} />
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title detail-total">Final Amount</div>
          <div className="detail-amt total-amt">
            <PriceDisplay amount={getTwoDecimalDigit(cart.total_amount)} />
          </div>
        </div>
        <Button.Ripple
          type="submit"
          block
          color="danger"
          className="btn-block"
          onClick={onSubmit}
        >
          {!orderId ? "Create Order" : "Update Order"}
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
