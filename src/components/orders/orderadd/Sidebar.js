import React, { useState, memo } from "react";
import { Button, Card, CardBody, Spinner } from "reactstrap";
import { Edit3 } from "react-feather";
import Address from "components/inventory/Address";
import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import useOrderAddContext from "context/useOrderAddContext";
import SelectBuyerModal from "./SelectBuyerModal";
import PriceDisplay from "components/utils/PriceDisplay";

import { components } from "react-select";

import apiClient from "api/base";
import { history } from "../../../history";
import CreateBuyerModal from "./CreateBuyerModal";
import { MdCreate } from "react-icons/md";
import CreateBuyerAddressModal from "./CreateBuyerAddressModal";
import {toast} from "react-toastify";

import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { regx } from "utility/general";

const Swal = withReactContent(_Swal);

export const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: 50,
  }),
};

const NoOptionsMessage = (props) => {
  const { setIsOpenBuyerCreateModal,buyerSearchInput,onChangeOrderInfo,setBuyer,setIsMenuOpen,setBuyerSearchInput,setIsBuyerLoaded } = useOrderAddContext();

  const onToggleModal = async () => {
    const isValid = regx.email.test(buyerSearchInput) || regx.mobileNumber.test(buyerSearchInput);
    setIsMenuOpen(false)
    if(isValid){
      const query = new URLSearchParams({q:buyerSearchInput}).toString()
      await apiClient.get(`/profile/buyers-search/?${query}`)
      .then(async (response) => {
        if(response.data.length === 0){
          setIsOpenBuyerCreateModal((prevState) => !prevState);
        }else{
          setIsBuyerLoaded(true)
          const requestData = {buyer_id:response.data[0].id}
          await apiClient.post('/profile/sellers/',requestData)
          .then((response) => {
            const data = response.data;
            onChangeOrderInfo({
              address: data?.address[0],
              buyer_id: data?.id,
            });
            setBuyer(data);
            setBuyerSearchInput("")
            setIsBuyerLoaded(false)
            toast.success(`Seller connected with buyer (${data.business_name})`)
          })
          .catch((error) => {
            console.log(" ---- Error ---- ",error)
          })
        }
      })
      .catch((error) => console.log(" ----- Failed to search buyer ----- "))
      
    }else{
      setIsOpenBuyerCreateModal((prevState) => !prevState);
    }
  }

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
    buyer,
    setBuyer,
    orderInfo,
    onChangeOrderInfo,
    getTotalOfProducts,
    products,
    orderId,
    getTotalExtraDiscount,

    // Buyer creation modal states start
    isOpenBuyerCreateModal,
    setIsOpenBuyerCreateModal,
    isOpenBuyerAddressCreateModal,
    setIsOpenBuyerAddressCreateModal,
    // Buyer creation modal states end
    buyerSearchInput,
    setBuyerSearchInput,
    isMenuOpen,
    setIsMenuOpen,
    isBuyerLoaded,
    orderData,
    getAddressWithStateName,
    totalTaxAmount,
    totalIGST,
    totalCGST,
    totalSGST,
    setProducts,
    calculateGstRate,
    getValidGstRate
  } = useOrderAddContext();
  const [isOpenBuyerAddresses, setIsOpenBuyerAddresses] = useState(false);

  const validateForm = () => {
    const errors = [];

    if (!products.length) {
      errors.push("Please add atleast one product!");
    }

    if (!orderInfo?.buyer_id) {
      errors.push("Buyer isn't selected!");
    }

    // if (orderInfo?.buyer_id && !orderInfo?.address) {
    //   errors.push("Buyer address isn't selected!");
    // }

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

    const variants = products.map(
      ({
        variant,
        extra_discount,
        price,
        actual_price,
        quantity,
        ...rest
      }) => ({
        variant_id: variant.id,
        extra_discount: parseFloat(extra_discount ?? 0),
        price: parseFloat(price),
        actual_price: parseFloat(actual_price),
        quantity: parseInt(quantity),
        ...rest,
      })
    );

    if (isValid) {
      const requestData = {
        items: [...variants],
        buyer_id: orderInfo.buyer_id,
        address: orderInfo?.address?.id,
        total_extra_discount: getTotalExtraDiscount,
        taxable_amount:totalTaxAmount,
        igst:totalIGST,
        cgst:totalCGST,
        sgst:totalSGST
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
            icon:"error",
            title:"Error",
            text:"🙏We can't process your data to create new order.So please try after some time later."
          })
        });
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="coupons">
          <div className="coupons-title">
            <p>Order ID</p>
            <h2 className="text-light">#{orderId ? orderData.order_number : "New"}</h2>
          </div>
          {buyer ? (
            <div className="apply-coupon cursor-auto">
              <p className="text-right text-dark">From</p>
              <div className="text-right text-secondary">
                <span>{`${buyer.name ? `(${buyer.name})` : ""}`}</span>
              </div>
              <h4 className="text-light">{buyer?.business_name}</h4>
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
                value={buyer}
                onChange={async (data) => {
                  await apiClient.get(`/inventory/seller-buyers/${data?.id}`)
                  .then((response) => {
                    setIsMenuOpen(false)
                    const data = response.data;
                    onChangeOrderInfo({
                          address: data?.address[0],
                          buyer_id: data?.id,
                    });
                    setBuyer(data);

                    const getExtraDiscount = (price, discount) => {
                      return discount.discount_type === "percentage"
                        ? (parseFloat(price) * parseFloat(discount.discount_value)) / 100
                        : discount.discount_type === "amount" ? parseFloat(discount.discount_value) : 0;
                    };

                    setProducts((products) => products.map((product) => {
                      const discount = data.product_discounts.find((discount) => discount.product.id === product.variant.product.id)

                      const _product = {...product,...calculateGstRate(getValidGstRate(product.variant.product.sub_categories))}
        
                      if(discount){
                          return {..._product,extra_discount:getExtraDiscount(_product.price,discount)}
                      }
                      return _product
                    }))
                  })
                  .catch((error) =>  {
                    toast.error("Failed to select this buyer.")
                  })
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
                onBlur={(e) => {setBuyerSearchInput(e.target.value)}}
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

          {
            !buyer && isBuyerLoaded ? (
              <div className="text-center mt-2">
                <Spinner />
              </div>  
            ):null 
          }
          {buyer ? (
            <div className="mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-secondary">SHIPPING ADDRESS</h6>
                {orderInfo?.address ? (
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

              {
                !orderInfo?.address ? (
                  <div className="mt-1">
                    <span>No Address Added!</span>
                  </div>
                ):""
              }
              
            </div>
          ) : null}

          {orderInfo?.address ? (
            <>
              <Address {...getAddressWithStateName} />

              <SelectBuyerModal
                isOpen={isOpenBuyerAddresses}
                onToggleModal={() =>
                  setIsOpenBuyerAddresses(!isOpenBuyerAddresses)
                }
              />
            </>
          ) : null}
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title">Total MRP</div>
          <div className="detail-amt">
            <PriceDisplay amount={getTotalOfProducts ?? 0} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">Total Taxable Amount</div>
          <div className="detail-amt">
            <PriceDisplay amount={totalTaxAmount ?? 0} />
          </div>
        </div>
        <div className="detail">
          <div className="detail-title">Extra Discount</div>
          <div className="detail-amt discount-amt">
            -<PriceDisplay amount={getTotalExtraDiscount ?? 0} />
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="detail-title detail-total">Total</div>
          <div className="detail-amt total-amt">
            <PriceDisplay
              amount={((parseFloat(getTotalOfProducts) + totalTaxAmount) - getTotalExtraDiscount).toFixed(2)}
            />
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

export default memo(Sidebar);
