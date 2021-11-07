import React, { useState } from "react";
import { Search } from "react-feather";
import { FormGroup, Input } from "reactstrap";
import BuyerSidebarCard from "./BuyerSidebarCard";

const BuyerSidebar = () => {
  const [value, setValue] = useState("");
  return (
    <React.Fragment>
      <div className="mr-2">
        <FormGroup className="position-relative has-icon-left mx-1 py-0 w-100">
          <Input
            className="round"
            type="text"
            placeholder="Search Buyer profiles..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="form-control-position">
            <Search size={15} />
          </div>
        </FormGroup>
      </div>

      <div className="overflow-scroll-y buyer-discount-sidebar-users h-100 px-1 mt-1">
        <BuyerSidebarCard
          title="Modern General Store"
          discount="10"
          noOfProducts={5}
          buyer="Mohan Singh (mohan@gmail.com)"
        />
        <BuyerSidebarCard
          title="Digital World Electronics"
          discount="15"
          noOfProducts={15}
          buyer="Saurabh (saurabh@gmail.com)"
        />
        <BuyerSidebarCard
          title="SK Electronics"
          discount="18"
          noOfProducts={9}
          buyer="Salman Siddiqui (salman@gmail.com)"
        />
        <BuyerSidebarCard
          title="Diamonds Electronics"
          discount="13"
          noOfProducts={18}
          buyer="King Khan (king@gmail.com)"
        />
      </div>
    </React.Fragment>
  );
};

export default BuyerSidebar;
