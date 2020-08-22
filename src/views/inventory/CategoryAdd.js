import React, { useState, useReducer, useEffect } from 'react'
import { SimpleInputField } from 'components/forms/fields'
import { Button, Row, Col } from 'reactstrap'
import apiClient from 'api/base';
import { Plus } from 'react-feather';
import Swal from 'utility/sweetalert'
import { history } from '../../history';

function subCategoryReducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, {}];
        case 'change':
            let _state= [...state]
            _state[action.index]['name'] = action.value
            return _state
        case 'initialize':
            return action.data

    //   case 'decrement':
    //     return {count: state.count - 1};
      default:
            console.log("Unknown action type: " + action.type + " in subCategoryReducer")
    }
}

function CategoryAdd(props) {
    const [categoryName, setCategoryName] = useState("")
    // const [subCategories, setSubCategories] = useState([{}])
    const [subCategoriesState, subCategoriesDispatch] = useReducer(subCategoryReducer, [{}])

    const formData = {
        name: categoryName,
        sub_categories: subCategoriesState
    }

    useEffect(() => {
        const categoryId = props.match.params.categoryId
        if(categoryId){
            apiClient.get('/inventory/categories/' + categoryId)
                .then(response => {
                    const category = response.data
                    setCategoryName(category.name)
                    subCategoriesDispatch({type: 'initialize', data: category.sub_categories})
                })
        }
    }, [])
    console.log(formData)

    function submitForm() {
        apiClient.post('/inventory/categories/', formData)
            .then(response =>{
                Swal.fire("Category Added !", 'success')
                history.push('/inventory/categories/list')
            })
    }
    
    return (
        <Row>
            <Col md="4 m-auto">
            
                <SimpleInputField
                    label="Category Name"
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                /> 
                
                <h6>Subcategories</h6>
                {subCategoriesState.map((sc, index) => {
                    return (
                        <SimpleInputField
                            key={index}
                            formGroupClassed="mb-0"
                            value={sc.name}
                            onChange={e => subCategoriesDispatch({type: 'change', index: index, value: e.target.value})}
                        />
                    )
                })}
                <Button className="ml-auto d-block mt-1" onClick={e => subCategoriesDispatch({type: 'add'})} color="primary" outline> <Plus size={19} /> Add Subcategory</Button>
                <Button className="mt-2 btn-block" size="lg" color="primary" onClick={submitForm}>Submit</Button>
            </Col> 
        </Row>
    )
}

export default CategoryAdd
