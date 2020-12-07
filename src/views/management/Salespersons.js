import { SimpleInputField } from 'components/forms/fields';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Input, Row } from 'reactstrap';
import { SalespersonsApi } from 'api/endpoints'
import { X } from "react-feather"
import { Spinner } from "reactstrap"
import Swal from "utility/sweetalert"

export default function Salesperson() {

    const [salespersons, setSalespersons] = useState(null)
    const [newSalespersonEmail, setNewSalespersonEmail] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")

    useEffect(() => {
        SalespersonsApi.index()
            .then(({ data }) => {
                console.log(data)
                setSalespersons(data)
            })
    }, [])

    const onAddSalesperson = () => {
        setIsSubmitting(true)
        SalespersonsApi.add(newSalespersonEmail)
            .then(({ data }) => {
                setSalespersons(data)
                Swal.fire("Salesperson Added !", '', "success")
            })
            .catch(error => {
                setFormError(error.response?.data?.message ?? error.message)
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const onRemoveSalesperson = (salespersonId, salespersonName) => {

        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm remove salesperson ${salespersonName}?!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Remove!'
        }).then(result => {
            if (result.value) {
                SalespersonsApi.delete(salespersonId)
                    .then(({ data }) => {
                        setSalespersons(data)
                        Swal.fire("Salesperson Removed !", '', "success")
                    })
                    .catch(error => {
                        Swal.fire(error.response?.data?.message ?? error.message, '', "error")
                    })
            }
            return false;
        })


    }

    return (
        <Row>
            <Col md="4">
                <h3>Add New Salesperson</h3>
                <Row className='align-items-center'>
                    <Col md="9">
                        <SimpleInputField
                            label="Enter Email"
                            placeholder="Email with which salesperson is registered"
                            value={newSalespersonEmail}
                            onChange={e => setNewSalespersonEmail(e.target.value)}
                            error={formError}
                        />
                    </Col>
                    <Col md="3">
                        <Button
                            block
                            color='primary'
                            onClick={onAddSalesperson}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            {isSubmitting && <Spinner color="white" size="sm" />}
                            {" "}Add
                        </Button>
                    </Col>
                </Row>

                {salespersons?.length > 0 &&
                    <>
                        <h3>Registered Salespersons</h3>
                        {salespersons.map(salesperson => (
                            <Card>
                                <CardBody
                                    className="stats-card-body d-flex justify-content-between flex-row-reverse align-items-center"
                                >
                                    <div className="icon-section">
                                        <div
                                            className="avatar avatar-stats p-50 m-0 bg-rgba-danger"
                                            onClick={e => onRemoveSalesperson(salesperson.id, salesperson.name)}
                                        >
                                            <div className="avatar-content">
                                                <X className="danger" size={22} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="title-section">
                                        <h2 className="text-bold-600 mt-1 mb-25">{salesperson.name}</h2>
                                        <p className="mb-0">{salesperson.email}</p>
                                    </div>
                                </CardBody>

                            </Card>
                        ))}
                    </>
                }

            </Col>
        </Row>
    );
}
