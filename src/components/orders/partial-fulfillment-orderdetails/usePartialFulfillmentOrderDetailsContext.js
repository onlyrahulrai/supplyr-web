import  { useContext } from "react";
import {PartialFulfillmentOrderDetailsContext} from "context/PartialFulfillmentOrderDetailsContext";

const usePartialFulfillmentOrderDetailsContext = () =>
  useContext(PartialFulfillmentOrderDetailsContext);

export default usePartialFulfillmentOrderDetailsContext;
