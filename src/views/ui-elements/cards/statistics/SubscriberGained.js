import StatisticsCards from "components/@vuexy/statisticsCard/StatisticsCard";
import React, { Component } from "react";
import { Users } from "react-feather";
import {subscribersGained,subscribersGainedSeries} from "./StatisticsData.js"

class SubscriberGained extends Component {
  render() {
    return (
      <StatisticsCards
        icon={<Users className="primary" size={22} />}
        stat="92.6k"
        statTitle="Subscribers Gained"
        options={subscribersGained}
        series={subscribersGainedSeries}
        type="area"
      />
    );
  }
}

export default SubscriberGained;
