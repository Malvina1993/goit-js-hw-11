import axios from "axios";
const KEY = '38922670-691cd2065c98d9555aa737c91';
const formEl = document.querySelector('.search-form');

async function fetchUrl(page, value) {
    try {
      const data = await axios.get('https://pixabay.com/api/', {
        params: {
        key: `${KEY}`,
        q: value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: `${page}`,
        per_page: 40,
          }
        
      }); 
        
      return  data ;    
    } catch (err){
        console.log(err);
   }
    

    
}

export { fetchUrl };