import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = (isLiked) => {
	const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
	document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numLikes) => {
	elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';  //single style property, do not need to toggle a class, simply choose that style
};

export const renderLikes = (item) => {
	const markup = `        
		<li>
	        <a class="likes__link" href="#${item.id}">
	            <figure class="likes__fig">
	                <img src="${item.img}" alt="${item.title}">
	            </figure>
	            <div class="likes__data">
	                <h4 class="likes__name">${limitRecipeTitle(item.title)}</h4>
	                <p class="likes__author">${item.author}</p>
	            </div>
	        </a>
	    </li>`
	elements.likeList.insertAdjacentHTML('beforeend',markup);
};

export const deleteLike = (id) => {
	const item = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
	if (item) item.remove();
};

