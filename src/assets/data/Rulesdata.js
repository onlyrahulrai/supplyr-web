import { BsCheck, BsCheckAll, BsClockHistory, BsTrash } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { RiTruckLine } from "react-icons/ri";

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

export const categoryRulesObjects = {
  product_title: "Product title",
  product_category: "Product Category",
  product_vendor: "Product Vendor",
  product_tag: "Product Tag",
  compare_at_price: "Compare at price",
  weight: "Weight",
  inventory_stock: "Inventory Stock",
  is_equal_to: "Is equal to",
  is_not_equal_to: "Is not equal to",
  is_greater_than: "Is greater than",
  is_less_than: "Is less than",
  starts_with: "Starts with",
  ends_with: "Ends with",
  contains: "Contains",
};

export const statusDisplayDict = {
  awaiting_approval: {
    name: "Awaiting Approval",
    getIcon: (size, color) => (
      <BsClockHistory size={size} color={color ?? "orange"} />
    ),
    color: "orange",
    buttonClass: "secondary",
    buttonLabel: "Mark Unapproved",
  },
  approved: {
    name: "Approved",
    getIcon: (size, color) => (
      <BsCheck size={size} color={color ?? "#00cfe8"} />
    ),
    color: "#00cfe8",
    buttonClass: "info",
    buttonLabel: "Mark Approve",
  },
  processed: {
    name: "Order Processed",
    getIcon: (size, color) => (
      <BsCheck size={size} color={color ?? "#7367f0"} />
    ),
    color: "#7367f0",
    buttonClass: "primary",
    buttonLabel: "Mark Processed",
  },
  dispatched: {
    name: "Dispatched",
    getIcon: (size, color) => (
      <RiTruckLine size={size} color={color ?? "#ff9f43"} />
    ),
    color: "#ff9f43",
    buttonClass: "warning",
    buttonLabel: "Mark Dispatched",
  },
  delivered: {
    name: "Delivered",
    getIcon: (size, color) => (
      <BsCheckAll size={size} color={color ?? "#28c76f"} />
    ),
    color: "#28c76f",
    buttonClass: "success",
    buttonLabel: "Mark Delivered",
  },
  returned: {
    name: "Returned",
    getIcon: (size, color) => (
      <GiReturnArrow size={size} color={color ?? "#ea5455"} />
    ),
    color: "#ea5455",
    buttonClass: "danger",
    buttonLabel: "Mark Returned",
  },
  cancelled: {
    name: "Cancelled",
    getIcon: (size, color) => (
      <BsTrash size={size ?? 16} color={color ?? "tomato"} />
    ),
    color: "tomato",
    buttonClass: "danger",
    buttonLabel: "Cancel Order",
  },
};

export const orderStatuses = [
  "awaiting_approval",
  "approved",
  "processed",
  "dispatched",
  "delivered",
  "returned",
  "cancelled",
]; // Skipped 'cancelled' here as it has separate control
