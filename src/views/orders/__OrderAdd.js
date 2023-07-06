import React from "react";
import { ToastContainer } from 'react-toastify';
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";
import {Main,Sidebar} from "components/orders/_orderadd/";
import useOrderAddContext from "context/useOrderAddContext2.0";
import 'react-toastify/dist/ReactToastify.css';

const OrderAdd = () => {
  const { orderId } = useOrderAddContext();
  return (
    <div className="ecommerce-application">
      <BreadCrumbs
        breadCrumbTitle={orderId ? "EDIT ORDER" : "ADD NEW ORDER"}
        breadCrumbActive={orderId ? orderId : "New Order"}
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
