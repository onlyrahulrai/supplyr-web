import apiClient from "api/base";
import { useEffect, useState } from "react";


export const useRuleValue = (props) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const sub_categories = props.sub_categories.map((item) => {
    return {
      id:Math.floor(Math.random() * 987),
      name: item.name,
    };
  });

  const vendors = props.vendors.map((item) => {
    return {
      id:Math.floor(Math.random() * 654),
      name: item.label,
    };
  });

  const tags = props.tags.map((item) => {
    return {
      id:Math.floor(Math.random() * 321),
      name: item.label,
    };
  });

  const getProducts = async () => {
    setLoading(true);
    await apiClient
      .get("inventory/products/")
      .then((response) => {
        const products = response.data?.data.map((item) => {
          return {
            id:Math.floor(Math.random() * 987654321),
            name: item.title,
          };
        });

        setItems([
          ...items,
          ...products,
          ...vendors,
          ...tags,
          ...sub_categories,
        ]);
        setLoading(false);
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderMovieTitle = (state, val) => {
    return state?.title?.toLowerCase().indexOf(val.toLowerCase()) !== -1;
  };

  return {loading,items}
};
