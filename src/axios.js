import axios from "axios";
const KEY = '38922670-691cd2065c98d9555aa737c91';
const formEl = document.querySelector('.search-form');


function fetchUrl() {
    return axios.get('https://pixabay.com/api/', {
        params: {
        key: `${KEY}`,
        q: `${formEl.elements.searchQuery.value}`,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        }
});
}

export { fetchUrl };