import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  Card,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import classnames from "classnames";
import { ArrowLeft } from "react-feather";
import { history } from "../../../history";
import GeneralSettings from "./GeneralSettings";
import InvoiceSettings from "./InvoiceSettings";
import ProductSettings from "./ProductSettings";


const Settings = () => {
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <Row className="align-items-center">
            <Col lg="auto d-flex align-items-center">
              <ArrowLeft
                size="16"
                onClick={() => history.push("/")}
                className="cursor-pointer"
              />
              <CardTitle className="mb-0 pr-2 ml-1 border-right">
                Settings
              </CardTitle>
            </Col>
          </Row>
          <hr />
          <Row className="justify-content-center">
            <Col md="12">
              <Nav pills className="mb-0 nav-active-bordered-pill" style={{borderBottom:"0px"}}>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: active === "1",
                    })}
                    onClick={() => {
                      toggle("1");
                    }}
                    style={{borderBottom:`${active === "1" && "1px solid white"}`}}
                  >
                    General Settings
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: active === "2",
                    })}
                    onClick={() => {
                      toggle("2");
                    }}
                    style={{borderBottom:`${active === "2" && "2px solid white"}`}}
                  >
                    Invoice Settings
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: active === "3",
                    })}
                    onClick={() => {
                      toggle("3");
                    }}
                    style={{borderBottom:`${active === "3" && "2px solid white"}`}}
                  >
                    Product Settings
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={active}>
                <TabPane tabId="1" className="tab-border">
                  <GeneralSettings />
                </TabPane>
                <TabPane
                  className="tab-border"
                  tabId="2"
                >
                  <InvoiceSettings />
                </TabPane>
                <TabPane
                  className="tab-border"
                  tabId="3"
                >
                  <ProductSettings />
                </TabPane> 
              </TabContent>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
export default Settings;
