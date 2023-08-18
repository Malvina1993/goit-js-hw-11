import { fetchUrl } from "./axios";

const formEl = document.querySelector('.search-form');

formEl.addEventListener('submit', searchData);



function searchData(evn) {
    evn.preventDefault();
    fetchUrl().then(resp => console.log(resp))
        .catch(error => console.log(error));
    
    formEl.reset();
}


