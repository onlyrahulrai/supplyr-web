import React, { useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import "../../../assets/scss/pages/account-settings.scss";
import classnames from "classnames";
import CurrencySetting from "components/settings/general-settings/CurrencySetting";
import TranslationSetting from "components/settings/general-settings/TranslationSetting";
import { connect } from "react-redux";
import OrderPrefixSetting from "components/settings/general-settings/OrderPrefixSetting";
import GSTConfig from "components/settings/general-settings/gst-config";
import SellerAddressComponent from "components/settings/general-settings/SellerAddressComponent";
import { GstConfigSettingProvider } from "context/useGstConfigSettingContext";


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
            <NavLink
              className={classnames({
                active:active === "4",
              })}
              onClick={() => {
                toggle("4")
              }}
              style={{borderBottom:`${active === "4" && "1px solid white"}`}}
            >
              GST Config
            </NavLink>
            <NavLink
              className={classnames({
                active:active === "5",
              })}
              onClick={() => {
                toggle("5")
              }}
              style={{borderBottom:`${active === "5" && "1px solid white"}`}}
            >
              Seller Address
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
          <TabPane tabId="4" > 
            <GstConfigSettingProvider>
              <GSTConfig  />
            </GstConfigSettingProvider>
          </TabPane>
          <TabPane tabId="5" > 
            <SellerAddressComponent />
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
