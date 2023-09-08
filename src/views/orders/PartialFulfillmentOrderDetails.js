import React from "react";
import "assets/scss/pages/app-ecommerce-shop.scss";
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb";
import {
  Main,
  Sidebar,
} from "components/orders/partial-fulfillment-orderdetails";
import { history } from "../../history";
import usePartialFulfillmentOrderDetailsContext from "components/orders/partial-fulfillment-orderdetails/usePartialFulfillmentOrderDetailsContext";
import DynamicModelForm from "components/orders/partial-fulfillment-orderdetails/DynamicModelForm";
import { Card, CardBody } from "reactstrap";
import OrderTimeline from "components/orders/partial-fulfillment-orderdetails/OrderTimeline";

function PartialFulfillmentOrderDetails(props) {
  const { order_number, buyer_name, isStateVariableModalOpen,...rest} =
    usePartialFulfillmentOrderDetailsContext();

  return (
    <div className="ecommerce-application">
      <BreadCrumb
        breadCrumbTitle={"Order " + 1}
        breadCrumbParent={
          <span
            onClick={(e) => {
              e.preventDefault();
              history.push(`/orders/`);
            }}
          >
            All Orders
          </span>
        }
        breadCrumbActive={`${order_number} ${
          buyer_name ? `(${buyer_name})` : ""
        }`}
      />

      <div className="list-view product-checkout">
        <div className="checkout-items">
          <Main />

          {/* ---------- Order timeline Start --------- */}
          <Card style={{ zIndex: 1 }}>
            {/* zIndex -1 for timeline connector line (because of the way it is designed, it needed to) */}
            <CardBody>
              <h3>Order Timeline</h3>

              <OrderTimeline
                data={(rest?.history ?? []).concat([
                  {
                    status: "created",
                    items: [],
                    date: rest?.order_date,
                    time: rest?.order_time,
                    created_by_user: rest?.created_by_user,
                    created_by_entity: rest?.created_by_entity,
                  },
                ])}
              />
            </CardBody>
          </Card>
          {/* ---------- Order timeline End --------- */}
        </div>
        <div className="checkout-options">
          <Sidebar />
        </div>

        {isStateVariableModalOpen ? <DynamicModelForm /> : null}
      </div>
    </div>
  );
}

export default PartialFulfillmentOrderDetails;
