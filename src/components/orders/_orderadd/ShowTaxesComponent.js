import PriceDisplay from "components/utils/PriceDisplay";
import useOrderAddContext from "context/useOrderAddContext2.0";
import React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";


const ShowTaxesComponent = (props) => {
  const getTotalTaxAmount = (taxes) => {
    return taxes.reduce((sum,value) => sum + value,0)
  }

  return (
    <UncontrolledButtonDropdown direction="up">
      <DropdownToggle color="flat-primary" tag="small" className="cursor-pointer text-info">
        (Show Tax Breakup)
      </DropdownToggle>
      <DropdownMenu style={{top:"-20px"}} className="p-1">
        <div className="p-0">
          <h6>Tax Breakup</h6>
        </div>
        {
          Object.entries(props.taxes || {}).map(([key,value],index) => (
            <div key={index}>
              {
                value ? (
                  <DropdownItem tag="a" className="p-0 text-uppercase">{key.split("_").join("  ")} : <PriceDisplay amount={value} /></DropdownItem>
                ):null
              }
            </div>
          ))
        }
        <hr />
        <DropdownItem tag="a" className="p-0 text-uppercase">Tax Amount : <PriceDisplay amount={getTotalTaxAmount(Object.values(props.taxes))} /></DropdownItem>
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  );
}


export default ShowTaxesComponent;