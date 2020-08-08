import React, { Fragment, useState, useEffect } from "react";
import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css' // or scss
import apiClient from "api/base";
import { getApiURL } from "api/utils"

function App() {
    console.log('apiClient.defaults.headers.common', apiClient.defaults.headers.common)
    const [sortedRawImages, setSortedRawImages] = useState([])
    const [sortedImages, setSortedImages] = useState([])
    const [imageUIDMapping, setImageUIDMapping] = useState({})
    console.log('imageUIDMapping', imageUIDMapping)
    console.log('sortedRawImages', sortedRawImages)

    useEffect(() => {
      let _sortedImages = sortedRawImages.map(image => {
        return imageUIDMapping[image.uid]
      })
      console.log('SIIII', _sortedImages)
    }, [imageUIDMapping, sortedRawImages])
    return (
      <Fragment>
        <RUG
        //  initialState={initialState}
        // action="http://127.0.0.1:8000/inventory/add-product-image/" 
        // headers={apiClient.defaults.headers.common}
        accept = {['jpg', 'jpeg', 'png']}
        source={response => getApiURL(response.image)}
        onConfirmDelete={(currentImage, images) => {
            return window.confirm('Are you sure you want to delete?')
        }}
        onSuccess = {im => console.log("SC", im)}
        sorting = {{
            pressDelay: 50,
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
            const url = "http://127.0.0.1:8000/inventory/add-product-image/"
            let formData = new FormData();
            formData.append('image', file);
            const response = await apiClient.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data'},
                onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(uid, percentCompleted)
                }
            })
            onSuccess(uid, response.data)
            setImageUIDMapping({...imageUIDMapping, [uid]: response.data.id}) //TODO ---------- Batched updates not working
        }
        }

        // customRequest = {data => {
        //     console.log(data)
        // }}
        onChange={(images) => {
            setSortedRawImages(images)
            console.log("IM", images)
            console.log("SI", sortedRawImages)
        }}

         />
        <h1 style={style.title}>Hold Drag and Sort Items</h1>
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