import {CreditCard, Home} from "react-feather"
import { FaBoxes, FaUserTie } from "react-icons/fa"
import {HiOutlineFolderAdd, HiOutlineFolder} from "react-icons/hi"
import {MdPlaylistAddCheck, MdInput} from "react-icons/md"
import {FiSettings} from "react-icons/fi"
import { RiFoldersLine } from "react-icons/ri"
import {AiOutlineUserSwitch} from "react-icons/ai"

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
        title: "Products",
        type: "item",
        icon: <MdPlaylistAddCheck size={20} />,
        // permissions: ["admin", "editor"],
        navLink: "/products/",
        parentOf:["/products/add/","/products/:slug/edit/"]
      },

      {
        id: "cetegories",
        title: "Categories",
        type: "item",
        icon: <RiFoldersLine size={20} />,
        // permissions: ["admin", "staff"],
        navLink: "/inventory/categories/list",
        parentOf:["/inventory/categories/add","/inventory/categories/edit/:categoryId"]
      },
      // {
      //   id: "add-product",
      //   title: "Add New Product",
      //   type: "item",
      //   icon: <MdPlaylistAdd size={20} />,
      //   // permissions: ["admin", "editor"],
      //   navLink: "/products/add/"
      // },
    ]
  },

  {
    id: "orders",
    title: "Orders",
    type: "item",
    icon: <MdInput size={20} />,
    // permissions: ["admin", "editor"],
    navLink: "/orders",
    parentOf:["/orders/:buyerId/add","/orders/:buyerId/update/:orderId","/orders/:orderId"]
  },
  {
    id: "ledger",
    title: "Ledger",
    type: "item",
    icon: <CreditCard size={20} />,
    // permissions: ["admin", "editor"],
    navLink: "/ledger"
  },
  {
    id:"buyer_discount",
    title:"Buyer Discounts",
    type:"item",
    icon:<AiOutlineUserSwitch  size={20} />,
    navLink:"/buyer-discounts"
  },

  // {
  //   id: "management",
  //   title: "Management",
  //   type: "collapse",
  //   icon: <FiSettings size={20} />,
  //   // permissions: ["admin", "editor"],
  //   children: [
  //     {
  //       id: "salesperson",
  //       title: "Salespersons",
  //       type: "item",
  //       icon: <FaUserTie size={20} />,
  //       // permissions: ["admin", "staff"],
  //       navLink: "/management/salespersons"
  //     },
  //   ]
  // },


  {
    type: "groupHeader",
    groupTitle: "MANAGEMENT",
    permissions: ["general", "staff"],
  },

  {
    id: "salesperson",
    title: "Salespersons",
    type: "item",
    icon: <FaUserTie size={20} />,
    // permissions: ["admin", "staff"],
    navLink: "/management/salespersons"
  },
]

export default navigationConfig
