import apiClient from "api/base";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export const RuleValueComponent = ({profile,rules}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const sub_categories = profile.sub_categories.map((item) => {
    return {
      id: Math.floor(new Date() * Math.random(1, 100)),
      name: item.name,
    };
  });

  const vendors = profile.vendors.map((item) => {
    return {
      id: Math.floor(new Date() * Math.random(1, 100)),
      name: item.label,
    };
  });

  const tags = profile.tags.map((item) => {
    return {
      id: Math.floor(new Date() * Math.random(1, 100)),
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
            id: Math.floor(new Date() * Math.random(1, 100)),
            name: item.title,
          };
        });

        setItems([
          ...products,
          ...vendors,
          ...tags,
          ...sub_categories,
          ...rules.map((rule) => {
            return {
              id:Math.floor(new Date() * Math.random(768,868)),
              name:rule.attribute_value
            }
          })
        ]);
        setLoading(false);
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    const unsubscribe = getProducts();
    return unsubscribe
  }, []);

  console.log(items)

  if (loading) return <Spinner />;

  return (
    
    <h3>Hello world</h3>
  )
};
