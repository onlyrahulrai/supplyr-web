import { useState, useEffect } from 'react';
import apiClient from 'api/base'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { X, Edit } from 'react-feather'
import Chip from 'components/@vuexy/chips/ChipComponent'
import {history} from '../../history'
import { getApiURL } from 'api/utils'
import Swal from 'utility/sweetalert'
import Spinner from "components/@vuexy/spinner/Loading-spinner"
import NetworkError from "components/common/NetworkError"

function CategoryListItem(props) {
    const {name, id:categoryId, image, sub_categories} = props.category
    return (
            <Card
              className="card-reload card-action"
              style={{boxShadow:"unset"}}
            >
              <CardHeader>
                <CardTitle>
                    {name}
                    <img src={getApiURL(image)} alt="" className="ml-1 img-thumbnail img-40" />
                </CardTitle>
                <div>
                    <Edit size={20} onClick={e => history.push('/inventory/categories/edit/'+categoryId)} />
                    <X size={20} className="ml-1" onClick={props.onDelete}/>
                </div>
              </CardHeader>
              <CardBody>
                {sub_categories.map(sc => (
                    <Chip text={sc.name} />
                ))}
              </CardBody>
            </Card>
    )
}

function CategoryList(props) {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)

    useEffect(() => {
        apiClient.get('/inventory/categories')
            .then((response) =>{
                const categories = response.data;
                setCategories(categories)
            })
            .catch(error => {
              setLoadingError(error.message)
            })
            .finally(() => {
              setIsLoading(false)
            })
    }, [])

    function deleteCategory(id) {
        const category = categories.find(c => c.id === id)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete category!'
          }).then(result => {
            if (result.value){
                apiClient.delete('/inventory/categories/' + id)
              .then(response => {
                if (response.status === 204){
                  setCategories(categories.filter(cat => cat.id !== id))
                  Swal.fire(`Category Deleted: ${category.name}`)
                }
              })
            }
            return false;
          })

        apiClient.delete('/inventory/categories/' + id)
            .then((response) => {
                console.log(response)
            })
    }

    return (<>
      {isLoading &&
        <Spinner />
      }
      {!isLoading && loadingError && (
        <NetworkError
          error={loadingError}
        />
      )
      }
      {!isLoading && categories &&
        <div className="card-columns">
            {categories.map(category => (<CategoryListItem category={category} onDelete={e => deleteCategory(category.id)}/>))}
        </div>
      }
        </>
    )
}

export default CategoryList
