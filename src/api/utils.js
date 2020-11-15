const apiBaseURL = process.env.REACT_APP_API_URL

function getApiURL(relativeURL) {
    let url = new URL(relativeURL, apiBaseURL)
    return url.href
}

export function getMediaURL(relativeURL) {
    return getApiURL(relativeURL)
}

export {getApiURL}