import React from "react"
import { Button } from "reactstrap"
import {history} from "../../history"


class Products extends React.Component{
  render(){
    return (
      <>
        <h4>This is Product List</h4>
        <Button.Ripple color="primary" onClick={e => {e.preventDefault(); history.push("/inventory/add")}}>Add Product</Button.Ripple>
      </>
    )
  }
}

export default Products