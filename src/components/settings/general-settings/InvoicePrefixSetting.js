import apiClient from 'api/base'
import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import Swal from 'sweetalert2'

const InvoicePrefixSetting = ({profile}) => {
    const [prefix,setPrefix] = useState(profile.invoice_prefix || "")

    const handleSubmit = async (e) => {
        e.preventDefault()
        let requestedData = {
            setting:"profile-setting",
            data: {invoice_prefix:prefix}
          }
      
          await apiClient
            .put(`/profile/seller-profile-settings/`,requestedData)
            .then((response) => {
              Swal.fire("Currency Saved", "", "success");
            })
            .catch((error) => console.log(error.data));
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Invoice Prefix</Label>
                <Input type="text" placeholder="Add prefix.." name='invoice_prefix' value={prefix} onChange={(e) => setPrefix(e.target.value)} required />
            </FormGroup>
            <Button.Ripple type="submit" color="primary">Save</Button.Ripple>
        </Form>
    )
}

export default InvoicePrefixSetting
