import React from "react";
import "assets/scss/pages/app-ecommerce-shop.scss";
import {Main,Sidebar} from "components/orders/orderadd/";
import useOrderAddContext from "context/useOrderAddContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";


const OrderAdd = () => {
  const {orderId,orderData} = useOrderAddContext()
  return (
    <div className="ecommerce-application">
      <BreadCrumbs
        breadCrumbTitle={orderId ? "EDIT ORDER" : "ADD NEW ORDER"}
        breadCrumbActive={orderId ? orderData.order_number : "New Order"}
        breadCrumbParent={<span>All Orders</span>}
      />

      <div className="list-view product-checkout">
        <div className="checkout-items">
            <Main />
        </div>
        <div className="checkout-options">
            <Sidebar />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderAdd;
