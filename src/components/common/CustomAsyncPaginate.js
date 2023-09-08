import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import PropTypes from "prop-types";
import apiClient from "api/base";



const CustomAsyncPaginate = ({ path, value,onChange, ...rest }) => {
  const defaultOptions = {
    page: 1,
  };

  
  
  const loadOptions = async (search, page) => {   
    const url =
      search.length || page
        ? `${path}?${new URLSearchParams({ search, page })}`
        : path;

    let options = [];
    let hasMore = false;

    try {
      const response = await apiClient.get(url);
      const response_data = response.data;
      options = response_data.data;
      hasMore = response_data.total_pages > page;
    } catch (e) {
      console.log(" ----- Error ----- ", e);
    }

    return {
      options: options,
      hasMore: hasMore,
    };
  };

 const loadPageOptions = async (q, prevOptions, { page }) => {
    const { options, hasMore } = await loadOptions(q, page);
    console.log(" Custom Async Paginate ",q)
    return {
      options,
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <React.Fragment>
      <AsyncPaginate
        cacheOptions
        additional={defaultOptions}
        value={value}
        onChange={onChange}
        loadOptions={loadPageOptions}
        debounceTimeout={400}
        {...rest}
      />
    </React.Fragment>
  );
};

CustomAsyncPaginate.prototype = {
    path:PropTypes.string.isRequired,
    value:PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired,
    getOptionValue:PropTypes.func,
    getOptionLabel:PropTypes.func,
    styles:PropTypes.object,
};

export default CustomAsyncPaginate;


