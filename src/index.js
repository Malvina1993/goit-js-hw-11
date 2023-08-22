import { fetchUrl } from './axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";



const formEl = document.querySelector('.search-form');
const imgContainer = document.querySelector('.gallery');
const moreLoad = document.querySelector('.load-more');



formEl.addEventListener('submit', searchData);



let page = 1;
let perPage = 40;
let ligtbox = new SimpleLightbox('.gallery a'); 
let searchValue = '';

window.addEventListener('scroll', loadMore);



async function searchData(evn) {
    evn.preventDefault();
    searchValue = formEl.elements.searchQuery.value;
    try {
        return await fetchUrl(page, perPage, searchValue)
            .then(({ data }) => {
                // console.log(data);
                const imagData = getDataImg(data);
                if (imagData.length === 0) {
                    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                    formEl.reset();
                    return;
                };
                Notify.success(`Hooray! We found ${data.totalHits} images.`);

                // console.log(imagData);
                imgContainer.innerHTML = createMarcupImg(imagData);
                const { height: cardHeight } = document
                    .querySelector(".gallery")
                    .firstElementChild.getBoundingClientRect();

                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: "smooth",
                });
                ligtbox.refresh();
                page += 1;
            })
    } catch (error) { 
      console.log(error)
 
    } finally {
       formEl.reset() 
    };
    
    
}


function loadMore() {
  
    const docRect = document.documentElement.getBoundingClientRect();

    if (docRect.bottom < document.documentElement.clientHeight + 150) {
        window.removeEventListener('scroll', loadMore);

       fetchUrl(page, perPage, searchValue)
           .then(({ data }) => { 
            

            page += 1;
            // console.log(page, perPage);
            const imagData = getDataImg(data);
            imgContainer.insertAdjacentHTML('beforeend', createMarcupImg(imagData));
             ligtbox.refresh();
            
            if (perPage !== 40) {
                
                document.querySelector('body').insertAdjacentHTML('beforeend', "We're sorry, but you've reached the end of search results.");
                return; 
            };

            if ((perPage * page + perPage) > data.totalHits) {
                perPage = data.totalHits - perPage * page;
               };
            
            window.addEventListener('scroll', loadMore);


        }).catch(error => console.log(error)); 
    }
    
    
}

function getDataImg({ hits }) {
    
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    })
};

function createMarcupImg(imgData) {
    return imgData.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return (`<div class="photo-card">
                     <a class="image-cont" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes </b>
                            <span>${likes}</span>
                        </p>
                        <p class="info-item">
                            <b>Views </b>
                            <span>${views}</span>
                        </p>
                        <p class="info-item">
                            <b>Comments </b>
                            <span>${comments}</span>
                        </p>
                        <p class="info-item">
                            <b>Downloads </b>
                            <span>${downloads}</span>
                        </p>
                    </div>
                </div>`)
    }).join("");
}
    

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.