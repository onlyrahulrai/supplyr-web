import React from "react";
import Chart from "react-apexcharts";


class StateOrdersChart extends React.Component {
    state = {
        options: {
          colors: this.props.labels.map(() => '#' + (Math.random().toString(16) + '0000000').slice(2, 8)),
          labels: this.props.labels,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 350
                },
                legend: {
                  position: "bottom"
                },
              }
            }
          ],
          tooltip:{
            // enabled:false,
            fillSeriesColor: "#fff",
            theme: false,
            style:{
              fontSize: '12px',
              colors: ["white"]
            }
          }
        },
        series: this.props.series,
      }

  render() {
    return (
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="pie"
            height={350}
          />
    );
  }
}

export default StateOrdersChart;
