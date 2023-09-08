import PriceDisplay from 'components/utils/PriceDisplay';
import React,{createContext,useContext,useReducer} from 'react';

export const BuyerDiscountContext = createContext();

export const GenericDiscountDetail = ({discount}) => {
    return (
      <>
        {
          discount?.discount_type === "percentage" ? (
            <p>{(discount?.discount_value || 0)}% General Discount </p>
          ): discount?.discount_type === "amount" ? (
              <>
                General Discount: <PriceDisplay amount={discount?.discount_value || 0}/> 
              </>
          ) : null
        }
      </>
    )
  }

const initialState = {}

const reducer = (state,action) => {
    switch(action.type){
        case "ON_RESET_BUYER":
            return {...state,buyer:null}
        case "ON_STATE_UPDATE":
            return {...state,...action.payload}
        case "ON_RETRIVE_BUYER_DETAIL":
            console.log(" Buyer Detail ",action.payload)
            return {...state,buyerDetail:action.payload}
        default:
            return state
    }
}

export const BuyerDiscountProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialState)

    const value = {
        state,
        dispatch
    }

    return (
        <BuyerDiscountContext.Provider value={value}>
            {children}
        </BuyerDiscountContext.Provider>
    )
}

const useBuyerDiscountContext = () => useContext(BuyerDiscountContext);

export default useBuyerDiscountContext