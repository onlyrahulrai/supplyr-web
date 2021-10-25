import React from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import { List, Lock, Phone } from "react-feather";
import ChangePassword from "./ChangePassword";
import "../../../assets/scss/pages/account-settings.scss";
import ChangeMobile from "./ChangeMobile";
import UserCategory from "./UserCategory";

class AccountSettings extends React.Component {
  state = {
    activeTab: "1",
    windowWidth: null,
  };

  toggle = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  updateWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    if (window !== undefined) {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth);
    }
  }

  render() {
    let { windowWidth } = this.state;
    return (
      <React.Fragment>
        <div
          className={`${
            windowWidth >= 769 ? "nav-vertical" : "account-setting-wrapper"
          }`}
        >
          <Nav className="account-settings-tab nav-left mr-0 mr-sm-3" tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1",
                })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <Lock size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Change Password
                </span>
              </NavLink>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2",
                })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <Phone size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  Change Mobile
                </span>
              </NavLink>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3",
                })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                <List size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">
                  User Categories
                </span>
              </NavLink>
            </NavItem>
          </Nav>
          <Card>
            <CardBody>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <ChangePassword />
                </TabPane>
                <TabPane tabId="2">
                  <ChangeMobile />
                </TabPane>
                <TabPane tabId="3">
                  <UserCategory />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default AccountSettings;
