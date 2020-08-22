import React from "react"
import {Home, ShoppingCart} from "react-feather"
import { RiStore2Line } from "react-icons/ri"
import { FaBoxes } from "react-icons/fa"
import {HiOutlineFolderAdd, HiOutlineFolder} from "react-icons/hi"
import {MdPlaylistAdd, MdPlaylistAddCheck} from "react-icons/md"

const navigationConfig = [
  {
    id: "home",
    title: "Home",
    type: "item",
    icon: <Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/dashboard"
  },
  {
    id: "inventory",
    title: "Inventory",
    type: "collapse",
    icon: <FaBoxes size={20} />,
    permissions: ["admin", "editor"],
    children: [
      {
        id: "products",
        title: "Products",
        type: "item",
        icon: <MdPlaylistAddCheck size={20} />,
        permissions: ["admin", "editor"],
        navLink: "/inventory"
      },
      {
        id: "add-product",
        title: "Add New Product",
        type: "item",
        icon: <MdPlaylistAdd size={20} />,
        permissions: ["admin", "editor"],
        navLink: "/inventory/add"
      },
      {
        id: "cetegories",
        title: "Categories",
        type: "item",
        icon: <HiOutlineFolder size={20} />,
        permissions: ["admin", "editor"],
        navLink: "/inventory/categories/list"
      },
      {
        id: "add-cetegory",
        title: "Add Category",
        type: "item",
        icon: <HiOutlineFolderAdd size={20} />,
        permissions: ["admin", "editor"],
        navLink: "/inventory/categories/add"
      },
    ]
  }
]

export default navigationConfig
