import React from "react"
import {Home, ShoppingCart} from "react-feather"
import { RiStore2Line } from "react-icons/ri"

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
    type: "item",
    icon: <RiStore2Line size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/inventory"
  }
]

export default navigationConfig
