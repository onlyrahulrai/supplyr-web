import apiClient from 'api/base'
import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label,Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import Swal from 'sweetalert2'
import {connect} from "react-redux"


const OrderPrefixSetting = (props) => {
    const {order_number_prefix,user_settings} = props
    const [value,setValue] = useState(order_number_prefix || "")


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(" form submitted successfully! ")
    
        let requestedData = {
          setting:"profile-setting",
          data: {order_number_prefix:value}
        }
    
        await apiClient
          .put(`/profile/seller-profile-settings/`,requestedData)
          .then((response) => {
            Swal.fire("Saved", "", "success");
          })
          .catch((error) => console.log(error.data));
      };

      // console.log("---- $ seller translation $ ---- ",translations,user_settings.translatables)
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Number Prefix Settings</CardTitle>
        </CardHeader>
        <hr />
        <CardBody>
          <Form onSubmit={handleSubmit} className='pb-2'>
              
                {
                  user_settings?.translatables.includes("order_number_prefix") && (
                    <FormGroup row className='align-item-center'>
                      <Col md="3" className='d-flex align-items-center'>
                          <Label>Order number prefix</Label>
                      </Col>
                      <Col md="9">
                        <Input type="text" placeholder="Add order number prefix..." name='order_number_prefix' onChange={(e) => setValue(e.target.value)} value={value}  />
                      </Col>
                    </FormGroup>
                  )
                }
                
              <FormGroup row>
                <Col md={{size:9,offset:3}} >
                  <Button.Ripple type="submit" color="primary">Save</Button.Ripple>
                </Col>
              </FormGroup>
          </Form>
        </CardBody>
      </Card>
    )
}

const mapStatesToProps = (state) => {
  return {
    "user_settings":state.auth.userSettings
  }
}

export default connect(mapStatesToProps)(OrderPrefixSetting)
