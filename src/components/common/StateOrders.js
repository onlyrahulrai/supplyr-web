import React, { Component } from "react";
import { Table } from "reactstrap";

class StateOrders extends Component {
  render() {
    const stateOrders = this.props.stateOrders;
    console.log(stateOrders);
    return (
        <Table
          responsive
          className="table-hover-animation mb-0 mt-1"
        >
          <thead>
            <tr>
              <th>STATE</th>
              <th>SALES</th>
            </tr>
          </thead>
          <tbody>
            {stateOrders.map((order) => (
              <tr key={order.state}>
                <td>{order.state}</td>
                <td>{order.state_orders_count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    );
  }
}

export default StateOrders;
