import "assets/scss/components/timeline.scss";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";

const orderStatusDisplayMapping = {
  created: { text: <b>Order Placed</b>, color: "blue" },
  approved: {
    text: (
      <>
        status changed to <b>APPROVED</b>
      </>
    ),
  },
  processed: {
    text: (
      <>
        status changed to <b>PROCESSED</b>
      </>
    ),
  },
  returned: {
    text: (
      <>
        status changed to <b>RETURNED</b>
      </>
    ),
  },
  dispatched: {
    text: (
      <>
        status changed to <b>DISPATCHED</b>
      </>
    ),
  },
  delivered: {
    text: (
      <>
        marked as <b>DELIVERED</b>
      </>
    ),
    color: "green",
  },
  awaiting_approval: {
    text: (
      <>
        Order marked as <b>AWAITING APPROVED</b>
      </>
    ),
    color: "gray",
  },
  cancelled: {
    text: (
      <>
        Order <b>CANCELLED</b>
      </>
    ),
    color: "pink",
  },
};

const OrderStatusDisplayContent = ({ status, items, order_group }) => {
  return (
    <>
      {!["created"].includes(status) && (
        <>
          {order_group ? (
            <>
              Order Group {order_group.group_index} (
              <i>{items.length > 0 && items.length} items</i>)
            </>
          ) : (
            <>
              <i>{items?.length > 0 && items?.length} items</i>
            </>
          )}
        </>
      )}{" "}
      {orderStatusDisplayMapping[status].text}
    </>
  );
};

export default function OrderTimeline({ data }) {
  const [expands, setExpands] = useState([]);
  const { getItemTitleSubstrById } = usePartialFulfillmentOrderDetailsContext();

  const onChangeExpand = (id) => {
    const action = expands.includes(id);
    if (action) {
      const indexes = expands.filter((index) => index !== id);
      setExpands(indexes);
    } else {
      setExpands((prevState) => [...prevState, id]);
    }
  };

  return (
    <div className="timeline">
      <ul>
        {data.map(
          (
            {
              time,
              order_group,
              items,
              date,
              status,
              created_by_user,
              created_by_entity,
            },
            index
          ) => {
            return (
              <div key={`parent-${index}`}>
                <li>
                  <div className="bullet grey"></div>
                  <div className="time">
                    <b>{time}</b>
                    <br />
                    {date}
                  </div>
                  <div
                    className="desc"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      items?.length > 0 ? onChangeExpand(index + 1) : null
                    }
                  >
                    <h3>
                      <OrderStatusDisplayContent
                        status={status}
                        order_group={order_group}
                        items={items}
                      />{" "}
                      {items?.length > 0 ? <ChevronDown size={18} /> : ""}
                    </h3>
                    <h4>
                      by <i>{created_by_user}</i> {created_by_user && "from"}{" "}
                      <i>{created_by_entity}</i>{" "}
                    </h4>

                    <div
                      style={{
                        display: expands.includes(index + 1) ? "block" : "none",
                        paddingLeft: "12px",
                      }}
                    >
                      <ol>
                        {items?.map((item, index) => (
                          <li key={`child-${index}`} className="mb-half">
                            {getItemTitleSubstrById(item)}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </li>
              </div>
            );
          }
        )}
      </ul>
    </div>
  );
}
