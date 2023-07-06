import React from "react";
import "assets/scss/pages/app-ecommerce-shop.scss";
import { Main, Sidebar } from "components/orders/orderadd/";
import BreadCrumbs from "components/@vuexy/breadCrumbs/BreadCrumb";


const OrderAdd = () => {
  return (
      <div className="ecommerce-application">
        <BreadCrumbs
          breadCrumbTitle={false ? "EDIT ORDER" : "ADD NEW ORDER"}
          breadCrumbActive={false ? 3 : "New Order"}
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
      </div>
  );
};

export default OrderAdd;
