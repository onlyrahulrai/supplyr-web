import apiClient from "api/base";
import { capitalizeString } from "utility/general";

export const loadBuyerOptions = async (q, prevOptions, { page }) => {
  // const { options, hasMore } = await loadOptions(q, page);

  const url = !q
    ? `/inventory/seller-buyers/?page=${page}`
    : `/inventory/seller-buyers/?search=${q}&page=${page}`;

  const options = [];
  let hasMore = false;

  await apiClient
    .get(url)
    .then(({ data: { results, count } }) => {
      const buyers = results.map((result) => ({
        value: result.buyer.id,
        label: capitalizeString(result.buyer.business_name),
      }));
      options.push(...buyers);
      hasMore = count > options.length;
    })
    .catch((error) => console.log(error));

  console.log("has More",hasMore)

  return {
    options: options,
    hasMore: hasMore,

    additional: {
      page: page + 1
    },
  };
};


export const loadProductOptions = async (q, prevOptions, { page }) => {
  const url = !q
    ? `/inventory/products/?page=${page}`
    : `/inventory/products/?search=${q}&page=${page}`;

  const options = [];
  let hasMore = false;

  await apiClient
    .get(url)
    .then((response) => {
      console.log("product data >>>> ", response.data);
      const products = response.data?.data.map((result) => ({
        value: result.id,
        label: capitalizeString(result.title),
        quantity:result.quantity,
        img:result.featured_image,
        is_multiple:result.has_multiple_variants
      }));
      options.push(...products);
      hasMore = response.data?.total_data_count > options.length;
    })
    .catch((error) => console.log(error));

  console.log("Options >>>> ", options);

  return {
    options: options,
    hasMore: hasMore,

    additional: {
      page: page + 1,
    },
  };
};