import React, { useState, useReducer, useEffect } from 'react'
import { SimpleInputField } from 'components/forms/fields'
import { Button, Row, Col, ListGroup, ListGroupItem,  FormGroup, Label, Input } from 'reactstrap'
import apiClient from 'api/base';
import { Plus, Edit2, X } from 'react-feather';
import Swal from 'utility/sweetalert'
import { history } from '../../history';
import { useRef } from 'react';
import { getApiURL } from 'api/utils';


function SubCategory(props) {

    const [isEditable, setIsEditable] = useState(false)
    const fieldRef = useRef(null)
    useEffect(() => {
        setTimeout(() => {
            if (props.setFocus) {
            setIsEditable(true)
              // eslint-disable-next-line
             let _ = fieldRef.current?.focus()
            }
        }, 0)
                
    }, [props.setFocus])
    
    useEffect(() => {
        if(!props.name) {
            setIsEditable(true)
        }
        else if(document.activeElement !== fieldRef.current){
            setIsEditable(false)
        }
    }, [props.name])



    return (
        <>
            
                {!isEditable && 
                <ListGroupItem color="light" className="d-flex justify-content-between align-items-center">
                    <span>{props.name}</span>
                    <div>
                        <Button size="sm" color="primary" title="Edit" className="round btn-icon" onClick={e => {setIsEditable(!isEditable); setTimeout(() => fieldRef.current.focus(), 0)}}><Edit2 /></Button>
                        <Button size="sm" color="light" title="Remove" outline className="round btn-icon ml-1" onClick={props.onRemove}><X /></Button>
                    </div>
                </ListGroupItem>
                }
                {isEditable &&
                <SimpleInputField
                    formGroupClasses="mb-0"
                    value={props.name ?? ''}
                    size="lg"
                    innerRef = {fieldRef}
                    onChange={e => props.onChange(e.target.value)}
                    onBlur={e => props.name && setIsEditable(false)}
                    onKeyPress={e => e.charCode === 13 && props.focusNextField()}
                />
                }
        </>
    )
}


function subCategoryReducer(state, action) {
    let _state = [...state]
    switch (action.type) {
        case 'add':
            return [...state, {setFocus: 1}];
        case 'remove':
            _state.splice(action.index, 1)
            return _state
        case 'change':
            _state[action.index]['name'] = action.value
            return _state
        case 'initialize':
            return action.data

        case 'setFocus':
            let currentFocusValue = _state[action.index]['setFocus'] ?? 0
            _state[action.index]['setFocus'] = ++currentFocusValue  //Changing focus values are only so thet react can focus an element multiple times with this method, if needed. Otherwise setting 'true' more than once won't trigger state change
            console.log("Setting focus ", _state[action.index]['setFocus'])
            return _state

    //   case 'decrement':
    //     return {count: state.count - 1};
      default:
            console.log("Unknown action type: " + action.type + " in subCategoryReducer")
    }
}

function CategoryAdd(props) {
    function clearState() {
        setCategoryName("")
        setCategoryId(undefined)
        subCategoriesDispatch({type: 'initialize', data: [{name: ""}]})
    }
    const [categoryName, setCategoryName] = useState("")
    const [categoryId, setCategoryId] = useState(undefined)
    const [uploadedImage, setUploadedImage] = useState(undefined)
    const [displayImage, setDisplayImage] = useState(undefined)
    const [deleteImage, setDeleteImage] = useState(false) // To be sent to server if user deletes existing image
    // const [subCategories, setSubCategories] = useState([{}])
    const [subCategoriesState, subCategoriesDispatch] = useReducer(subCategoryReducer, [{name: ""}])

    const formData = {
        name: categoryName,
        sub_categories: subCategoriesState.filter(sc => sc.name).map(sc => ({...sc, name: sc.name.trim()})),
        uploadedImage: uploadedImage
    }
    categoryId && (formData.id = categoryId)

    useEffect(() => {
        // To clear state when navigating from edit category to add category (Same component)
        clearState()
    }, [props.location.pathname])

    useEffect(() => {
        // Initialize state if editing existing category
        const categoryId = props.match.params.categoryId
        if(categoryId){
            apiClient.get('/inventory/categories/' + categoryId)
                .then(response => {
                    const category = response.data
                    setCategoryName(category.name)
                    setCategoryId(categoryId)
                    subCategoriesDispatch({type: 'initialize', data: category.sub_categories})
                    response.data.image && setDisplayImage(getApiURL(response.data.image))
                })
        }
    }, [props.match.params.categoryId]) //This will probably never change, however, in page lifecycle

    function focusNextField(index){
        // On enter key press,  focus on next field or add a new field if it's the last one
        const nextIndex = index+1;
        if (nextIndex < subCategoriesState.length)
            {
                subCategoriesDispatch({type: 'setFocus', index: (nextIndex)})
            }
        else {
            subCategoriesDispatch({type: 'add'})
        }
    }
    function onImageSelect(e) {
        let file = e.target.files[0]
        console.log(file)
        setUploadedImage(file)
        // Frontend thumbnail generation
        var reader  = new FileReader();
        reader.onloadend = function () {
            const img_data = reader.result;
            setDisplayImage(img_data)
        }
        file && reader.readAsDataURL(file);
        setDeleteImage(false)
        
    }

    function onImageRemove() {
        setUploadedImage(undefined)
        setDisplayImage(undefined);
        setDeleteImage(true)
    }
    console.log(formData)

    function submitForm() {
        let url ='/inventory/categories/'
        let _formData = new FormData()
        _formData.append('id', formData.id)
        _formData.append('name', formData.name)
        formData.uploadedImage && _formData.append('image', formData.uploadedImage)
        _formData.append('sub_categories', JSON.stringify(formData.sub_categories))
        deleteImage && _formData.append('delete_image', deleteImage)

        if (categoryId){
            url += (categoryId + '/')
        }
        apiClient.post(url, _formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          })
            .then(response =>{
                Swal.fire("Category Saved !", 'success')
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
                {/* <SimpleInputField
                    label="Category Image"
                    type="file"
                    onChange = {onImageSelect}
                    accept="image/jpeg, image/png, image/svg"
                /> */}

                <h6>Category Image</h6>
                <FormGroup row>
                    <Col md="auto mr-auto">
                        <Label>
                            {displayImage ? (<img src={displayImage} className="img-100" alt='selected'/>) : 'No Image Selected'}

                        </Label>
                    </Col>
                    <Col md="auto">
                    <Label for="img-upload">
                        {displayImage &&
                        <Button color="danger" className="mr-1" outline onClick={e=>setTimeout(onImageRemove)} > {/** Done really know the cause, but without setTimeout, it's opening file upload dialog on removing an image (perhaps clicking the following button?) */}
                            Remove
                        </Button>
                        }
                        <Button color="primary" outline={props.is_submitted} onClick={e=> document.getElementById("img-upload").click()}>
                            <span>
                                {displayImage ? "Change" : "Upload"}
                            </span>
                        </Button>
                    </Label>
                        
                        <Input
                            type="file"
                            // name={schema.name}
                            id="img-upload"
                            // required={schema.required} //It will clash with controlled forms if required is set (while submitting, if form empty)
                            placeholder="Upload"
                            onChange={onImageSelect}
                            className="d-none"
                            accept="image/jpeg, image/png, image/svg"
                            // value= ""
                        />
                    </Col>
                </FormGroup>
                
                <h6>Subcategories</h6>
                <ListGroup>
                    {subCategoriesState.map((sc, index) => {
                        return (
                            <SubCategory 
                                key={index}
                                onChange={value => subCategoriesDispatch({type: 'change', index: index, value: value})}
                                onRemove={() => subCategoriesDispatch({type: 'remove', index: index})}
                                focusNextField = {() => focusNextField(index)}
                                {...sc} 
                            />
                        )
                    })}
                </ListGroup>
                <Button className="ml-auto d-block mt-1" onClick={e => subCategoriesDispatch({type: 'add'})} color="primary" outline> <Plus size={19} /> Add Subcategory</Button>
                <Button className="mt-2 btn-block" size="lg" color="primary" onClick={submitForm}>Submit</Button>
            </Col> 
        </Row>
    )
}

export default CategoryAdd
