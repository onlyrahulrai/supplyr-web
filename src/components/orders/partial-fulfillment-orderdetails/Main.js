import React from "react";
import usePartialFulfillmentOrderDetailsContext from "./usePartialFulfillmentOrderDetailsContext";
import { Card, CardBody } from "reactstrap";
import GroupHeader from "./GroupHeader";
import Products from "./Products";

const Main = () => {
  const { groups } = usePartialFulfillmentOrderDetailsContext();

  return (
    <Card>
      <CardBody>
        {groups.map((group, index) => (
          <div key={`group-${index}`}>
            {groups.length > 1 && (
              <GroupHeader group={group} products={group.products} />
            )}
            <Products products={group.products} group={group} />
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default Main;
