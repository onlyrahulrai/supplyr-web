export const compareByData = [
    { value: "product_title", label: "Product title" },
    { value: "product_category", label: "Product category" },
    { value: "product_vendor", label: "Product vendor" },
    { value: "product_tag", label: "Product tag" },
    { value: "compare_at_price", label: "Compare at price" },
    { value: "weight", label: "Weight" },
    { value: "inventory_stock", label: "Inventory Stock" },
  ];
  
export const compareWithData = [
    {
      value: "is_equal_to",
      label: "Is equal to",
      link: [
        "product_title",
        "product_category",
        "product_vendor",
        "product_tag",
        "compare_at_price",
        "weight",
        "inventory_stock",
        "variants_title",
      ],
    },
    {
      value: "is_not_equal_to",
      label: "Is not equal to",
      link: [
        "product_title",
        "product_category",
        "product_vendor",
        "product_tag",
        "compare_at_price",
        "weight",
        "inventory_stock",
        "variants_title",
      ],
    },
    {
      value: "is_greater_than",
      label: "Is greater than",
      link: ["compare_at_price", "weight", "inventory_stock"],
    },
    {
      value: "is_less_than",
      label: "Is less than",
      link: ["compare_at_price", "weight", "inventory_stock"],
    },
    {
      value: "starts_with",
      label: "Starts with",
      link: [
        "product_title",
        "product_category",
        "product_vendor",
        "product_tag",
        "variants_title",
      ],
    },
    {
      value: "ends_with",
      label: "Ends with",
      link: [
        "product_title",
        "product_category",
        "product_vendor",
        "product_tag",
        "variants_title",
      ],
    },
    {
      value: "contains",
      label: "Contains",
      link: [
        "product_title",
        "product_category",
        "product_vendor",
        "product_tag",
        "variants_title",
      ],
    },
  ];
 