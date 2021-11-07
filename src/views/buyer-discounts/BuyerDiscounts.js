import { BuyerSidebar,BuyerDiscountMain } from "components/buyer-discounts";
import React from "react";
import Sidebar from "react-sidebar";
import "../../assets/scss/pages/app-email.scss";
import { ContextLayout } from "../../utility/context/Layout";


const mql = window.matchMedia(`(min-width: 800px)`);

class BuyerDiscounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  handleMainAndComposeSidebar = () => {
    this.onSetSidebarOpen(false);
  };

  render() {
    return (
        <div className={`email-application position-relative`}>
          <div
            className={`app-content-overlay ${
              this.state.sidebarOpen ? "show" : ""
            }`}
            onClick={this.handleMainAndComposeSidebar}
          />
            <ContextLayout.Consumer>
              {(context) => (
                <Sidebar
                  sidebar={<BuyerSidebar 
                    onSetOpen={this.onSetSidebarOpen}
                  />}
                  open={this.state.sidebarOpen}
                  docked={this.state.sidebarDocked}
                  sidebarClassName="sidebar-content email-app-sidebar "
                  contentClassName="sidebar-children"
                  touch={false}
                  pullRight={context.state.direction === "rtl"}
                >
                  <button onClick={() => this.onSetSidebarOpen(true)}>
                    Open sidebar
                  </button>
                </Sidebar>
              )}
            </ContextLayout.Consumer>
            <BuyerDiscountMain 
              mainSidebar={this.onSetSidebarOpen}
            />
          </div>
    );
  }
}

export default BuyerDiscounts;
