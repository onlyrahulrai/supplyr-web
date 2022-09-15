import React from "react";
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import {Main,Sidebar} from "components/orders/orderadd/";
import useOrderAddContext from "context/useOrderAddContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OrderAdd = () => {
  const {orderId,orderData} = useOrderAddContext()
  return (
    <div className="ecommerce-application">
      <BreadCrumbs
        breadCrumbTitle={orderId ? "EDIT ORDER" : "ADD NEW ORDER"}
        breadCrumbActive={orderId ? orderData.order_number : "New Order"}
        breadCrumbParent={<a href="#">All Orders</a>}
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
