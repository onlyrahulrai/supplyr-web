import Address from "components/inventory/Address";
import React from "react";
import { useSelector } from "react-redux";

const Exporter = (props) => {
  const { business_name,addresses:address } = useSelector((state) => state.auth.userInfo.profile);

  return (
    <div className="p-1">
      <small>
        <strong>{props.default ? "Seller Info: "  : "Exporter: "}</strong>
      </small>{" "}
      <br />
      <div>
        <span>
          <strong>{business_name}</strong>
        </span>
        <br />

        {!props.default ? (
          <>
            <span>
              <strong>NO.33 AND 34,, 8TH CROSS,</strong>
            </span>
            <br />
            <span>
              <strong>MUTHURAYASWAMY LAYOUT,</strong>
            </span>
            <br />
            <span>
              <strong>HULIMAVU,</strong>
            </span>
            <br />
            <span>
              <strong>BENGALURU</strong>
            </span>
            <br />
            <span>
              <strong>KARNATAKA -560076</strong>
            </span>
          </>
        ) : (
          <Address {...{...address,state:address?.state?.name}} bold />
        )}

        <br />
      </div>
    </div>
  );
};

export default Exporter;
