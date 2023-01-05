import InLocation from "india-location-details";
const apiBaseURL = process.env.REACT_APP_API_URL

function getApiURL(relativeURL) {
    let url = new URL(relativeURL, apiBaseURL)
    return url.href
}

export function getMediaURL(relativeURL) {
    return getApiURL(relativeURL)
}

export {getApiURL}

const offset = 0;
const limit = 1;
const requiredFields = ["districtname", "statename"];

export const fetchPinCodeDetails = (pin) => {
    const key = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
  
    return InLocation.fetchPincodeData(
      offset,
      limit,
      pin,
      requiredFields,
      key,
    ).then(response => {
      return new Promise((resolve, reject)=>{
        if (response.data.records.length){
          const result = {
            district: response.data.records[0].districtname,
            state: response.data.records[0].statename,
          }
          return resolve(result)
        }
        return reject(new Error("No records found"))
        });
    })
  
  }