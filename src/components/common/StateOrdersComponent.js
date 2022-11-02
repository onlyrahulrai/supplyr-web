import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import { StateOrdersChart } from "views/ui-elements/cards/statistics";
import apiClient from "api/base";
import { numberFormatter } from "utility/general";
import PriceDisplay from "components/utils/PriceDisplay";

const StateOrdersComponent = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [sellerStateOrder, setSellerStateOrder] = useState([]);
  const [orderFilterBtn, setOrderFilterBtn] = useState("");
  const [customButton, setCustomButton] = useState(false);
  const [durationRange, setDurationRange] = useState([new Date()]);
  const [active, setActive] = useState("1");

  const sellerStateOrders = (query) => {
    let url = null;
    setIsLoading(true);
    if (query) {
      url = `/seller-state-orders/?duration=${query}`;
    } else {
      url = `/seller-state-orders/`;
    }

    apiClient
      .get(url)
      .then(({ data }) => {
        setSellerStateOrder(data);
      })
      .catch((err) => setLoadingError(true))
      .finally(() => setIsLoading(false));
  };

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  useEffect(() => {
    const unsubscribe = sellerStateOrders();
    return unsubscribe;
  }, []);

  return (
    <>
      <h3>Global Sales by Top State</h3>
      <hr />

      <Card>
        <>
          <CardHeader style={{ justifyContent: "center" }}>
            <ButtonGroup>
              <button
                className={`btn ${
                  orderFilterBtn === "today"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } `}
                onClick={() => {
                  sellerStateOrders("today");
                  setOrderFilterBtn("today");
                }}
              >
                Today
              </button>
              <button
                className={` btn ${
                  orderFilterBtn === "yesterday"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  sellerStateOrders("yesterday");
                  setOrderFilterBtn("yesterday");
                }}
              >
                Yesterday
              </button>
              <button
                className={`btn ${
                  orderFilterBtn === "week"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } `}
                onClick={() => {
                  sellerStateOrders("week");
                  setOrderFilterBtn("week");
                }}
              >
                Week
              </button>
              <button
                className={`btn ${
                  orderFilterBtn === "month"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  sellerStateOrders("month");
                  setOrderFilterBtn("month");
                }}
              >
                Month
              </button>
              <button
                className={`btn ${
                  orderFilterBtn === "year"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  sellerStateOrders("year");
                  setOrderFilterBtn("year");
                }}
              >
                Year
              </button>

              <button
                className={`btn ${
                  orderFilterBtn === "custom"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setOrderFilterBtn("custom");
                  setCustomButton(!customButton);
                  setCustomButton(true);
                }}
              >
                Custom
              </button>
            </ButtonGroup>
          </CardHeader>
          <CardBody className="pt-1">
            {orderFilterBtn === "custom" && customButton && (
              <div className="d-flex justify-content-center">
                <div className="col-md-6 shadow-lg p-2 pb-0">
                  <h5 className="text-bold-500">Duration Range</h5>
                  <Flatpickr
                    value={durationRange}
                    className="form-control"
                    options={{ mode: "range" }}
                    onChange={(date) => setDurationRange(date)}
                  />

                  {durationRange?.length > 1 && (
                    <Button.Ripple
                      color="primary"
                      className="mt-1"
                      onClick={() => {
                        setOrderFilterBtn("custom");
                        const startDate = new Date(
                          durationRange[0]
                        ).toUTCString();
                        const endDate = new Date(
                          durationRange[1]
                        ).toUTCString();
                        sellerStateOrders(
                          `custom&start_date=${
                            startDate < endDate ? startDate : endDate
                          }&end_date=${
                            endDate > startDate ? endDate : startDate
                          }`
                        );
                        setCustomButton(!customButton);
                        setDurationRange(new Date());
                      }}
                    >
                      Search
                    </Button.Ripple>
                  )}
                </div>
              </div>
            )}

            {!isLoading ? (
              <>
                <Nav tabs className="justify-content-center">
                  <NavItem>
                    <NavLink
                      className={`${active === "1" && "active"}`}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      Sales
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`${active === "2" && "active"}`}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      Revenue
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={active}>
                  <TabPane tabId="1">
                    <Row className="pt-1">
                      {sellerStateOrder.length > 0 ? (
                        <>
                          <Col md="5" className="state-orders-count">
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
                                {sellerStateOrder
                                  .sort((a, b) =>
                                    a.state_orders_count > b.state_orders_count
                                      ? 1
                                      : b.state_orders_count >
                                        a.state_orders_count
                                      ? -1
                                      : 0
                                  )
                                  .reverse()
                                  .map((order) => (
                                    <tr key={order.state}>
                                      <td>{order.state} {order.country_code && `, ${order.country_code}`}</td>
                                      <td>{order.state_orders_count}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                            <hr />
                            <div className="mr-2">
                              <span className=" font-medium-2 text-bold-500">
                                {" "}
                                Total Sales:{" "}
                              </span>

                              <span className="text-success font-medium-2">
                                {numberFormatter(
                                  sellerStateOrder.reduce(
                                    (a, b) => a + b.state_orders_count,
                                    0
                                  )
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col md="7">
                            <StateOrdersChart
                              labels={sellerStateOrder.map(
                                (order) => `${order.state}, ${order.country_code}`
                              )}
                              series={sellerStateOrder.map(
                                (order) => order.state_orders_count
                              )}
                            />
                          </Col>
                        </>
                      ) : (
                        <Col md="12" className="py-5 my-5">
                          <h4 className="text-center text-muted">
                            There is no Data for Shown
                          </h4>
                        </Col>
                      )}
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row className="pt-1">
                      {sellerStateOrder.length > 0 ? (
                        <>
                          <Col md="5" className="state-orders-count">
                            <Table
                              responsive
                              className="table-hover-animation mb-0 mt-1"
                            >
                              <thead>
                                <tr>
                                  <th>STATE</th>
                                  <th>REVENUE</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sellerStateOrder
                                  .sort((a, b) =>
                                    a.revenue > b.revenue
                                      ? 1
                                      : b.revenue > a.revenue
                                      ? -1
                                      : 0
                                  )
                                  .reverse()
                                  .map((order) => (
                                    <tr key={order.state}>
                                      <td>{order.state}, {order.country_code}</td>
                                      <td>
                                        {/* <span>&#8377;</span>{" "}
                                        {numberFormatter(order.revenue)} */}
                                        <PriceDisplay amount={order.revenue} />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                            <hr />
                            <div className="mr-2">
                              <span className=" font-medium-2 text-bold-500">
                                {" "}
                                Total Revenues:{" "}
                              </span>

                              <span className="text-success font-medium-2">
                                {/* &#8377;{" "}
                                {numberFormatter(
                                  sellerStateOrder.reduce(
                                    (a, b) => a + b.revenue,
                                    0
                                  )
                                )} */}
                                <PriceDisplay amount={sellerStateOrder.reduce(
                                    (a, b) => a + b.revenue,
                                    0
                                  )} />
                              </span>
                            </div>
                          </Col>
                          <Col md="7">
                            <StateOrdersChart
                              labels={sellerStateOrder.map(
                                (order) => `${order.state}, ${order.country_code}`
                              )}
                              series={sellerStateOrder.map(
                                (order) => order.revenue
                              )}
                            />
                          </Col>
                        </>
                      ) : (
                        <Col md="12" className="my-5 py-5">
                          <h4 className="text-center text-muted">
                            There is no Data for Shown
                          </h4>
                        </Col>
                      )}
                    </Row>
                  </TabPane>
                </TabContent>
              </>
            ) : (
              <>
                {loadingError ? (
                  <div className="py-5 my-5  text-center">
                    <h4>UNABLE TO FETCH</h4>
                    <p>Request failed with status code 404</p>
                  </div>
                ) : (
                  <div className="text-center py-5 my-5">
                    <Spinner />
                  </div>
                )}
              </>
            )}
          </CardBody>
        </>
      </Card>
    </>
  );
};

export default StateOrdersComponent;
