import { Fragment, useState, useEffect, useReducer } from "react";
import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css' // or scss
import apiClient from "api/base";
import { getApiURL } from "api/utils"
import _Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import cloneGenerator from "rfdc"

const Swal = withReactContent(_Swal)
const clone = cloneGenerator()


function imageUIDMappingReducer (state, action){
  return { ...state,
    [action.uid]: action.db_id
  }
}


function App(props) {
    const [sortedRawImages, setSortedRawImages] = useState([])
    const [imageUIDMappingState, imageUIDMappingDispatch] = useReducer(imageUIDMappingReducer, {})
    

    // initialState and effect below are used to initialize the images in case user is editing an existing product
    let initialState = props.initialImages?.map(image => ({source: getApiURL(image.image), existingImageDbID: image.id}))



    useEffect(() => {
      let _sortedImages = sortedRawImages.map(image => {
        const db_id = image.existingImageDbID || imageUIDMappingState[image.uid]
        const source = image.source
        return {db_id, source}
      })
      props.onChange(_sortedImages)
      // eslint-disable-next-line
    }, [imageUIDMappingState, sortedRawImages])

    
    const isRenderable = props.isRenderable ?? true;
    
    return isRenderable && (
      <Fragment>
        <RUG
         initialState={initialState}
         inOrder={true}
        // action="http://127.0.0.1:8000/inventory/add-product-image/" 
        accept = {['jpg', 'jpeg', 'png']}
        source={response => getApiURL(response.image)}
        onConfirmDelete={(currentImage, images) => {
            return Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                  }).then(result => {
                    if (result.value){
                      return true;
                    }
                    return false;
                  })
        }}
        onSuccess = {im => console.log("SC", im)}
        sorting = {{
            pressDelay: 0,
            distance: 10,
        }}

        customRequest={async ({
            uid,
            file,
            data, // blob
            send,
            action,
            headers,
            onProgress,
            onSuccess,
            onError
        }) => {
            const url = "/inventory/add-product-image/"
            let formData = new FormData();
            formData.append('image', file);
            try {
            const response = await apiClient.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data'},
                onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(uid, percentCompleted)
                }
            })
            onSuccess(uid, response.data)
            imageUIDMappingDispatch({uid: uid, db_id: response.data.id})
            }
            catch (err) {
              Swal.fire("Error uploading image", err.message.toString(), "error")
              onError(uid, {
                action,
                
                response: err.response
              })
            }
        }
        }

        onChange={(images) => {
            setSortedRawImages(clone(images))
        }}

         />
        {/* <h1 style={style.title}>Hold Drag and Sort Items</h1> */}
      </Fragment>
    );
  }
  
  const style = {
    title: {
      textAlign: "center",
      fontFamily: "Helvetica",
      marginTop: 50
    }
  };

  
export default App