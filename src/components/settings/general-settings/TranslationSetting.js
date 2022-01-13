import apiClient from 'api/base'
import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label,Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import Swal from 'sweetalert2'
import {connect} from "react-redux"


const TranslationSetting = ({translations:_translations,user_settings}) => {
    const [translations,setTranslations] = useState(_translations)

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let requestedData = {
          setting:"profile-setting",
          data: {translations:translations}
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
          <CardTitle>Translation Settings</CardTitle>
        </CardHeader>
        <hr />
        <CardBody>
          <Form onSubmit={handleSubmit} className='pb-2'>
              
                {
                  user_settings?.translatables.includes("quantity") && (
                    <FormGroup row className='align-item-center'>
                      <Col md="3" className='d-flex align-items-center'>
                          <Label>Quantity Translation</Label>
                      </Col>
                      <Col md="9">
                        <Input type="text" placeholder="Add quantity translation..." name='quantity' onChange={(e) => setTranslations((prevState) => ({...prevState,quantity:e.target.value}))} value={translations?.quantity || ""} maxLength={25} required />
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

export default connect(mapStatesToProps)(TranslationSetting)