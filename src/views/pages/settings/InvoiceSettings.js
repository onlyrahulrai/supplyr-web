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
import InvoicePrefixSetting from "components/settings/invoice-settings/InvoicePrefixSetting";
import { connect } from "react-redux";
import InvoiceTemplateSetting from "../../../components/settings/invoice-settings/InvoiceTemplateSetting";

const InvoiceSettings = ({profile}) => {
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

  console.log("---- seller profile ---- ",profile)

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
              Invoice Prefix
            </NavLink>
            <NavLink
              className={classnames({
                active: active === "2",
              })}
              onClick={() => {
                toggle("2");
              }}
              style={{ borderBottom: `${active === "2" && "1px solid white"}` }}
            >
              Invoice Templates
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <InvoicePrefixSetting profile={profile} />
          </TabPane>
          <TabPane tabId="2">
            <InvoiceTemplateSetting profile={profile} />
          </TabPane>
        </TabContent>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
    return {
        profile:state.auth.userInfo.profile
    }
}

export default connect(mapStateToProps)(InvoiceSettings)

