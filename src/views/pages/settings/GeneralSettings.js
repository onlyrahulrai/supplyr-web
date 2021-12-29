import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import "../../../assets/scss/pages/account-settings.scss";
import classnames from "classnames";
import {_CurrenciesData} from "../../../assets/data/CurrenciesData"
import CurrencySetting from "components/settings/general-settings/CurrencySetting";

const GeneralSettings = ({profile}) => {
  const [active, setActive] = useState("1");
  const [windowWidth, setWindowWidth] = useState(null);

  const updateWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const toggle = (tab) => {
    setActive(tab);
  };

  return (
    <React.Fragment>
      <div
        className={`${
          windowWidth >= 769 ? "account-setting-wrapper" : "nav-vertical"
        }`}
      >
        <Nav className="account-settings-tab nav-left mr-0 mr-sm-3" tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: active === "1",
              })}
              onClick={() => {
                toggle("1");
              }}
              style={{ borderBottom: `${active === "1" && "1px solid white"}` }}
            >
              Currency
            </NavLink>
          </NavItem>
        </Nav>
        <Card>
          <CardBody>
            <TabContent activeTab={active}>
              <TabPane tabId="1">
                <CurrencySetting />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};



export default GeneralSettings
