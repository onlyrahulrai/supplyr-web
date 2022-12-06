import React from "react";
import { capitalizeString } from "utility/general";

const Consignee = ({name,address,...rest}) => {
  return (
    <div className="p-1 border-top-0" style={{ minHeight: "180px" }}>
      <small>
        <strong>{ rest.default ? "Customer Info: "  : "Consignee: "}</strong>
      </small>{" "}
      <br />
      <div>
        <span>
          <strong>{capitalizeString(name)}</strong>
        </span>
        <br />
        <span>
          <strong>{address?.name?.toUpperCase()}</strong>
        </span>
        <br />
        <span>
          <strong>{address?.city?.toUpperCase()}</strong>
        </span>
        <br />
        <span>
          <strong>{address?.line1?.toUpperCase()}</strong>
        </span>
        <br />
        <span>
          <strong>{address?.line2?.toUpperCase()}</strong>
        </span>
        <br />
        <span>
          <strong>{address?.state?.name?.toUpperCase()}</strong>
        </span>
      </div>
    </div>
  );
};

export default Consignee;
