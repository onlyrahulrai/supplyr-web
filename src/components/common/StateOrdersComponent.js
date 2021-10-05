import React, { useEffect, useState } from "react";
import { StateData } from "assets/data/StateData";
import Flatpickr from "react-flatpickr";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import {
  StateOrdersChart,
} from "views/ui-elements/cards/statistics";
import apiClient from "api/base";
import { numberFormatter } from "utility/general";
import StateOrders from "./StateOrders";

const StateOrdersComponent = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [sellerStateOrder, setSellerStateOrder] = useState([]);
  const [orderFilterBtn, setOrderFilterBtn] = useState("");
  const [customButton, setCustomButton] = useState(false);
  const [durationRange, setDurationRange] = useState([new Date()]);

  const sellerStateOrders = (query) => {
    setIsLoading(true);
    apiClient
      .get("/seller-state-orders/" + `?duration=${query ?? ""}`)
      .then(({ data }) => {
        const _data = data.map((order) => {
          return {
            state: StateData[order.state],
            state_orders_count: order.state_orders_count,
          };
        });
        setSellerStateOrder(_data);
      })
      .catch((err) => setLoadingError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const unsubscribe = sellerStateOrders();
    return unsubscribe;
  }, []);


  if (isLoading) return <Spinner />;

  return (
    <>
      <h3>Global Sales by Top State</h3>
      <hr />

      <Card>
        {loadingError && (
          <div className="p-2 text-center">
            <h4>UNABLE TO FETCH</h4>
            <p>Request failed with status code 404</p>
          </div>
        )}

        {!loadingError && (
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
                          sellerStateOrders(
                            `custom&start_date=${
                              durationRange[0].toLocaleDateString() >
                              durationRange[1].toLocaleDateString()
                                ? durationRange[1].toLocaleDateString()
                                : durationRange[0].toLocaleDateString()
                            }&end_date=${
                              durationRange[1].toLocaleDateString() >
                              durationRange[0].toLocaleDateString()
                                ? durationRange[1].toLocaleDateString()
                                : durationRange[0].toLocaleDateString()
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
              <Row className="pt-1">
                {sellerStateOrder.length > 0 ? (
                  <>
                    <Col md="5" className="state-orders-count">
                      <StateOrders stateOrders={sellerStateOrder} />
                      <hr />
                      <div className="mr-2">
                        <span className=" font-medium-2 text-bold-500"> Total Sales: </span>
                        
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
                      <StateOrdersChart stateOrders={sellerStateOrder} />
                    </Col>
                  </>
                ) : (
                  <Col md="12">
                    <h4 className="text-center text-muted">
                      There is no Data for Shown
                    </h4>
                  </Col>
                )}
              </Row>
            </CardBody>
          </>
        )}
      </Card>
    </>
  );
};

export default StateOrdersComponent;
