import { Fragment, useState, useEffect, useReducer } from "react";
import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css' // or scss
import apiClient from "api/base";
import { getApiURL } from "api/utils"
import _Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import cloneGenerator from "rfdc"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { SimpleInputField } from "components/forms/fields";
import { v4 as uuidV4 } from 'uuid';

const Swal = withReactContent(_Swal)
const clone = cloneGenerator()


function imageUIDMappingReducer (state, action){
  return { ...state,
    [action.uid]: action.db_id
  }
}

const UploadImageFromURLModal = (props) => {
  const {isOpen,onToggle,onDispatch,setLoading,loading,setSortedRawImages} = props;
  const [image,setImage] = useState("") 

  const onClickImageUpload = async () => {
    setLoading(true)
    let file;
    const formData = new FormData()
    try{
      const response_img = await fetch(image)
      const blob = await response_img.blob()
      file = new File([blob],'image.jpg',{type:blob.type})
      formData.append("image",file)
    }catch(error){
      Swal.fire({
        icon:"warning",
        title:"Warning",
        text:"Image is not valid!"
      })
    }

    try{
      const url = "/inventory/add-product-image/";

      const response = await apiClient.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      })

      const id = uuidV4()

      onDispatch({uid:id,db_id:response?.data?.id})

      const data = {
        name:response?.data?.name,
        source:getApiURL(response?.data?.image),
        uid:id,
        remove:() => {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(result => {
            if (result.value){
              setLoading(true);

              Promise.resolve(setSortedRawImages((prevState) => {
                return prevState.filter((image) => image.uid !== id)
              }))
              .then(() => {
                setLoading(false)
              })
            }
          })
        }
      }

      setSortedRawImages((prevState) => [...prevState,data])

      setLoading(false)

      onToggle()
    }catch(error){
      Swal.fire({
        icon:"warning",
        title:"Warning",
        text:error.message
      })
    }
  }

  return (
    <div>
      <Modal
        centered
        isOpen={isOpen}
        toggle={onToggle}
      >
        <ModalHeader toggle={onToggle} className="border-bottom">
          Add Image from URL
        </ModalHeader>
        <ModalBody>
          <div className="content-middle">
            {
              loading ? <Spinner /> : null
            }
          </div>
          <SimpleInputField 
            label="Image url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={onClickImageUpload}
          >
            Add Image
          </Button>
          {' '}
          <Button onClick={onToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
   
  )
}

function App(props) {
  // initialState and effect below are used to initialize the images in case user is editing an existing product
  let getInitialState = (images) => images?.map(image => ({source: getApiURL(image.image), existingImageDbID: image.id}))

  const [sortedRawImages, setSortedRawImages] = useState(getInitialState(props.initialImages) || [])
  const [imageUIDMappingState, imageUIDMappingDispatch] = useReducer(imageUIDMappingReducer, {})
  const [isOpen,setIsOpen] = useState(false);
  const [loading,setLoading] = useState(false);
    

    useEffect(() => {
      let _sortedImages = sortedRawImages?.map(image => {
        const db_id = image.existingImageDbID || imageUIDMappingState[image.uid]
        const source = image.source
        return {db_id, source}
      })

      props.onChange(_sortedImages)
      // eslint-disable-next-line
    }, [imageUIDMappingState, sortedRawImages])
    
    const isRenderable = props.isRenderable ?? false;
    
    return (isRenderable && !loading) && (
      <Fragment>
        <RUG
        initialState={sortedRawImages}
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
                      setLoading((prevState) => !prevState)
  
                      setSortedRawImages((prevState) => {
                        return prevState.filter((image) => image.uid !== currentImage.uid)
                      })

                      setLoading((prevState) => !prevState)

                      return true
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
        }}

        onChange={(images) => {
            setSortedRawImages(clone(images))
        }}

         />

        <div className="position-absolute top-16 left-16">
          <Button.Ripple type="button" color="primary" className="w-100" onClick={() => setIsOpen(!isOpen)} outline>Add from URL</Button.Ripple>
        </div>

        <UploadImageFromURLModal 
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onDispatch={imageUIDMappingDispatch}
          setLoading={setLoading}
          loading={loading}
          setSortedRawImages={setSortedRawImages}
        />
      </Fragment>
    );
  }
  
 

  
export default App