import React from 'react'
import { Link } from 'react-router-dom';

const checkCreatedBy = (userId,created_by) => {
    return (userId === created_by.userId) ? "you" : "buyer";   
}

const DescriptionComponent = (props) => {
    const {userId,ledger} = props;

    let description;

    if(ledger.transaction_type === "payment_added"){
        description = <p>Payment added. Payment ID: {ledger.payment.id}</p>
    }

    if(ledger.transaction_type === "order_cancelled"){
        description = <p>Order <Link to={`/orders/${ledger.order.order_number}`}>#{ledger.order.order_number}</Link> cancelled by {checkCreatedBy(userId,ledger?.order?.created_by)}</p>
    }

    if(ledger.transaction_type === "order_created"){
        description = <p>Order <Link to={`/orders/${ledger.order.order_number}`}>#{ledger.order.order_number}</Link> created by {checkCreatedBy(userId,ledger?.order?.created_by)}</p>
    }

  return description;
}



export default DescriptionComponent;