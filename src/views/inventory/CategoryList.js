import React, { useState, useEffect } from 'react'
import apiClient from 'api/base'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { X, Edit } from 'react-feather'
import Chip from 'components/@vuexy/chips/ChipComponent'
import {history} from '../../history'

function CategoryListItem(props) {
    const {name, id:categoryId, sub_categories} = props.category
    return (
        <div>
            <Card
              className="card-reload card-action"
            >
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <div>
                    <Edit size={20} onClick={e => history.push('/inventory/categories/edit/'+categoryId)} />
                    <X size={20} className="ml-1"/>
                </div>
              </CardHeader>
              <CardBody>
                {sub_categories.map(sc => (
                    <Chip text={sc.name} />
                ))}
              </CardBody>
            </Card>
        </div>
    )
}

function CategoryList(props) {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        apiClient.get('/inventory/categories')
            .then((response) =>{
                const categories = response.data;
                setCategories(categories)
            })
    }, [])

    return (
        <div className="card-columns">
            {categories.map(category => (<CategoryListItem category={category} />))}
        </div>
    )
}

export default CategoryList
