import React from "react"
import {Home} from "react-feather"
import { FaBoxes } from "react-icons/fa"
import {HiOutlineFolderAdd, HiOutlineFolder} from "react-icons/hi"
import {MdPlaylistAdd, MdPlaylistAddCheck, MdInput} from "react-icons/md"

const navigationConfig = [
  {
    id: "home",
    title: "Home",
    type: "item",
    icon: <Home size={20} />,
    // permissions: ["admin", "editor"],
    navLink: "/dashboard"
  },
  {
    id: "orders",
    title: "Orders",
    type: "item",
    icon: <MdInput size={20} />,
    // permissions: ["admin", "editor"],
    navLink: "/orders"
  },
  {
    id: "inventory",
    title: "Inventory",
    type: "collapse",
    icon: <FaBoxes size={20} />,
    // permissions: ["admin", "editor"],
    children: [
      // {
      //   id: "products",
      //   title: "Products",
      //   type: "item",
      //   icon: <MdPlaylistAddCheck size={20} />,
      //   permissions: ["admin", "editor"],
      //   navLink: "/inventory"
      // },
      {
        id: "products-list",
        title: "Products List",
        type: "item",
        icon: <MdPlaylistAddCheck size={20} />,
        // permissions: ["admin", "editor"],
        navLink: "/inventory/list"
      },
      {
        id: "add-product",
        title: "Add New Product",
        type: "item",
        icon: <MdPlaylistAdd size={20} />,
        // permissions: ["admin", "editor"],
        navLink: "/inventory/add"
      },
      {
        id: "cetegories",
        title: "Categories",
        type: "item",
        icon: <HiOutlineFolder size={20} />,
        permissions: ["admin", "staff"],
        navLink: "/inventory/categories/list"
      },
      {
        id: "add-cetegory",
        title: "Add Category",
        type: "item",
        icon: <HiOutlineFolderAdd size={20} />,
        permissions: ["admin", "staff"],
        navLink: "/inventory/categories/add"
      },
    ]
  }
]

export default navigationConfig
