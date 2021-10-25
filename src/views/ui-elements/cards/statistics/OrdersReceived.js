import StatisticsCards from 'components/@vuexy/statisticsCard/StatisticsCard'
import React, { Component } from 'react'
import { Package } from 'react-feather'
import {ordersReceived,ordersReceivedSeries} from "./StatisticsData.js"

class OrdersReceived extends Component {
    render() {
        return (
            <div>
                <StatisticsCards
                    icon={<Package className="warning" size={22} />}
                    iconBg="warning"
                    stat="97.5k"
                    statTitle="Orders Received"
                    options={ordersReceived}
                    series={ordersReceivedSeries}
                    type="area"
                />
            </div>
        )
    }
}

export default OrdersReceived
