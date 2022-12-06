import { OrdersApi } from "api/endpoints";
import React, { useContext, createContext, useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ToWords } from 'to-words';

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { orderId, invoice_number } = useParams();
  const [loadingError, setLoadingError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const fetchOrder = useCallback(async () => {
    await OrdersApi.retrieve(orderId)
      .then((response) => {
        console.log(response.data);
        setOrderData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoadingError(error.message);
      });
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  // const totals = orderData?.items.reduce(
  //   (sum, item) => {
  //     const actualPrice = parseFloat(item.price) * item.quantity;
  //     const salePrice = parseFloat(item.actual_price) * item.quantity;

  //     const _sum = {
  //       actualPrice: sum.actualPrice + actualPrice,
  //       salePrice: sum.salePrice + salePrice,
  //     };

  //     return _sum;
  //   },
  //   {
  //     actualPrice: 0,
  //     salePrice: 0,
  //   }
  // );

  const toWords = new ToWords();

  const getDate = (date) => {
    let _date = new Date(date);
    return _date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const variables = orderData?.status_variable_values?.reduce(
    (a, v) => ({ ...a, [v.variable_slug.replace(/-/g, "")]: v }),
    {}
  ); // We Are generate an object by using a list of objects coming from the order details API. to use as custom invoice variables.

  const getTotals = useMemo(() => {
    return orderData?.items
      ?.map(
        ({
          price,
          product_variant,
          quantity,
          ...rest
        }) => ({
          unit_price: product_variant.price,
          gross_amount: price * quantity,
          quantity
        })
      )
      ?.reduce(
        (sum, object) => {
          for (let [key, value] of Object.entries(object)) {
            sum[key] += value;
          }
  
          return sum;
        },
        {
          unit_price: 0,
          gross_amount: 0,
          quantity:0
        }
      );
  }, [orderData]);
  
  const value = {
    orderId,
    invoice_number,
    loading,
    loadingError,
    variables,
    getDate,
    toWords,
    orderData,
    getTotals
  };
  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

const useInvoiceContext = () => useContext(InvoiceContext);

export default useInvoiceContext;
