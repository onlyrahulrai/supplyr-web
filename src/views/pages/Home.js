import { Component, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { RiCheckLine, RiCheckDoubleLine, RiTruckLine, RiStarLine, RiMoneyDollarCircleLine, RiUserReceived2Line } from "react-icons/ri"
import Chart from "react-apexcharts"
import { MdInput } from "react-icons/md"
import { FaBoxes } from "react-icons/fa"
import { DashboardApi } from "api/endpoints"
import { numberFormatter } from "utility/general"
import Spinner from "components/@vuexy/spinner/Loading-spinner"
import NetworkError from "components/common/NetworkError"

const StatsSmallCard = (props) => {
  const { title, description, icon, color } = props;
  
  return (
    <Card>
      <CardBody
        className="stats-card-body d-flex justify-content-between flex-row-reverse align-items-center"
      >
        <div className="icon-section">
          <div
            className={`avatar avatar-stats p-50 m-0 bg-rgba-${color ?? 'primary'}`}
          >
            <div className="avatar-content">
              {icon}
            </div>
          </div>
        </div>
        <div className="title-section">
          <h2 className="text-bold-600 mt-1 mb-25">{title}</h2>
          <p className="mb-0">{description}</p>
        </div>
      </CardBody>

    </Card>
  )
}

const LineChart = (props) => {
  const { data, xaxis_labels, unit } = props;
  const state = {
    options: {
      chart: {
        toolbar: {
          show: false
        },
        animations: {
          enabled: false
        }
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 8],
        width: [4, 2]
      },
      grid: {
        borderColor: "#eee" //this.props.labelColor
      },
      legend: {
        show: false
      },
      colors: ['#f89', '#333'], //[this.props.dangerLight, this.props.strokeColor],

      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          inverseColors: false,
          gradientToColors: ["#33f", "#44e"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: "#333" //this.props.strokeColor
          }
        },
        axisTicks: {
          show: false
        },
        categories: xaxis_labels,
        axisBorder: {
          show: false
        },
        tickPlacement: "on"
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            color: "#333" //this.props.strokeColor
          },
          formatter: val => {
            return val > 999 ? (val / 1000).toFixed(1) + "k" : val
          }
        },
      },
      tooltip: {
        x: { show: true }
      }
    },
    series: [
      data
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="d-flex justify-content-start mb-1">
          <div className="mr-2">
            <p className="mb-50 text-bold-600">Total</p>
            <h2 className="text-bold-400">
              <sup className="font-medium-1 mr-50">{unit}</sup>
              <span className="text-success">{numberFormatter(data.data.reduce((x, y) => (x + y), 0))}</span>
            </h2>
          </div>
        </div>
        <Chart
          options={state.options}
          series={state.series}
          type="line"
          height={260}
        />
      </CardBody>
    </Card>
  )
}

const Dashboard = () => {
  const userInfo = useSelector(state => state.auth.userInfo)

  const [isLoading, setIsLoading] = useState(true)
  const [sellerStats, setSellerStats] = useState(null)
  const [loadingError, setLoadingError] = useState(null)

  const { daily_order_stats, weekly_order_stats, order_status_counts, products_count, buyers_count } = sellerStats ?? {}

  const weekly_order_stats_list = weekly_order_stats && {
    date: weekly_order_stats.map(s => s.date),
    orders_count: weekly_order_stats.map(s => s.count),
    amount: weekly_order_stats.map(s => s.amount)
  }

  useEffect(() => {
    DashboardApi.stats()
      .then(({ data }) => {
        setSellerStats(data)
      })
      .catch(error => setLoadingError(error.message))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])



  return (
    <>
      {isLoading &&
        <Spinner />
      }
      {!isLoading &&
        <>
        {loadingError &&
            <NetworkError
              error={loadingError}
            />
        }
        {!loadingError && sellerStats &&
        <>
          <h3>Orders</h3>
          <hr />
          <Row>
            <Col>
              <StatsSmallCard
                title={order_status_counts.awaiting_approval}
                description="New"
                color="warning"
                icon={<RiStarLine className="warning" size={22} />}
              />
            </Col>
            <Col>
              <StatsSmallCard
                title={order_status_counts.approved}
                description="Approved"
                color="primary"
                icon={<RiCheckLine className="primary" size={22} />}
              />
            </Col>
            <Col>
              <StatsSmallCard
                title={order_status_counts.dispatched}
                description="Dispatched"
                color="primary"
                icon={<RiTruckLine className="primary" size={22} />}
              />
            </Col>
            <Col>
              <StatsSmallCard
                title={order_status_counts.delivered}
                description="Delivered"
                color="success"
                icon={<RiCheckDoubleLine className="success" size={22} />}
              />
            </Col>
          </Row>

          <h3>Weekly Overview</h3>
          <hr />
          <Row>
            <Col>
              <LineChart
                data={{
                  name: "Orders",
                  data: weekly_order_stats_list.orders_count
                }}
                xaxis_labels={weekly_order_stats_list.date}
                unit=""
              />
            </Col>
            <Col>
              <LineChart
                data={{
                  name: "Revenue",
                  data: weekly_order_stats_list.amount
                }}
                xaxis_labels={weekly_order_stats_list.date}
                unit={<span>&#8377;</span>}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Daily Overview</h3>
              <hr />
              <Row>
                <Col>
                  <StatsSmallCard
                    title={daily_order_stats.count}
                    description="Orders Received Today"
                    color="info"
                    icon={<MdInput size={22} className="info" />}
                  />
                </Col>
                <Col>
                  <StatsSmallCard
                    title={<><span>&#8377;</span> {numberFormatter(daily_order_stats.amount)}</>}
                    description="Revenue Today"
                    color="success"
                    icon={<RiMoneyDollarCircleLine className="success" size={22} />}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <h3>Other Statistics</h3>
              <hr />
              <Row>
                <Col>
                  <StatsSmallCard
                    title={products_count}
                    description="Products Added"
                    color="warning"
                    icon={<FaBoxes className="warning" size={22} />}
                  />
                </Col>
                <Col>
                  <StatsSmallCard
                    title={buyers_count}
                    description="Buyers Added You"
                    color="primary"
                    icon={<RiUserReceived2Line className="primary" size={22} />}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          </>
        }
        </>
      }
    </>
  )
}

// export default Home

const mapStateToProps = state => {
  return {
    user: state.auth.userInfo
  }
}
// export default connect(mapStateToProps)(Home)

export default Dashboard