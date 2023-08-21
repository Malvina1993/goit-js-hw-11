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

moreLoad.addEventListener('click', loadMore);

function searchData(evn) {
    evn.preventDefault();
    
    fetchUrl(page = 1, perPage = 40)
        .then(({ data })  => { 
            // console.log(data);
            const imagData = getDataImg(data);
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            if (imagData.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                formEl.reset();
                return;
            };
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
            moreLoad.style.display = 'block';

        }).catch(error => console.log(error))
        .finally(() => formEl.reset());
    
    
}


function loadMore() {
    moreLoad.style.display = 'none';
    page += 1;

    fetchUrl(page, perPage)
        .then(({ data }) => { 
            // console.log(data.totalHits);
            const imagData = getDataImg(data);
            imgContainer.insertAdjacentHTML('beforeend', createMarcupImg(imagData));
             ligtbox.refresh();
            moreLoad.style.display = 'block';
            if (perPage !== 40) {
                moreLoad.style.display = 'none';
                document.querySelector('body').insertAdjacentHTML('beforeend',"We're sorry, but you've reached the end of search results.");
                return; 
            };

            if ((perPage * page + perPage) > data.totalHits) {
                perPage = data.totalHits - perPage * page;
            };

        }).catch(error => console.log(error));
    
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