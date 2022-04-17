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
import TranslationSetting from "components/settings/general-settings/TranslationSetting";
import { connect } from "react-redux";
import OrderPrefixSetting from "components/settings/general-settings/OrderPrefixSetting";

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
          windowWidth >= 769 ?  "account-setting-wrapper" : "nav-vertical"
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
            <NavLink
              className={classnames({
                active:active === "2",
              })}
              onClick={() => {
                toggle("2")
              }}
              style={{borderBottom:`${active === "2" && "1px solid white"}`}}
            >
              Translation
            </NavLink>
            <NavLink
              className={classnames({
                active:active === "3",
              })}
              onClick={() => {
                toggle("3")
              }}
              style={{borderBottom:`${active === "3" && "1px solid white"}`}}
            >
              Order Number Prefix
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <CurrencySetting profile={profile} />
          </TabPane>
          <TabPane tabId="2">
            <TranslationSetting {...profile} />
          </TabPane>
          <TabPane tabId="3" > 
            <OrderPrefixSetting {...profile} />
          </TabPane>
        </TabContent>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.auth.userInfo.profile,
  };
};

export default connect(mapStateToProps)(GeneralSettings)
