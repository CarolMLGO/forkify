//central place for all the dom strings
export const elements ={
	searchInput: document.querySelector('.search__field'),
	searchButton: document.querySelector('.search'),
	searchRes: document.querySelector('.results'),

	resultLists: document.querySelector('.results__list'),
	resPages: document.querySelector('.results__pages'),
	resLink: document.querySelector('.results__link'),
	recipe: document.querySelector('.recipe'),
	recipeIngredient: document.querySelector('.recipe__ingredients'),

	ingredientList:document.querySelector('.recipe__ingredient-list'),
	shoppingList: document.querySelector('.shopping'),
	
	list: document.querySelector('.shopping__list'),
	shoppingDeleteButton: document.querySelector('.shopping__delete'),
	shoppingClearButton: document.querySelector('.shopping__btn--clear'),
	shoppingInputCount: document.querySelector('.shopping__input-count'),
	shoppingInputUnit: document.querySelector('.shopping__input-unit'),
	shoppingInputIngredient: document.querySelector('.shopping__input-ingredient'),
	shoppingInput: document.querySelectorAll('.shopping__input'),

	likeList: document.querySelector('.likes__list'),
	likeMenu: document.querySelector('.likes__field'),

};

export const elementStrings = {
	loader: "loader",
};

//reusable piece
export const renderLoader = (parent) => {
	const loader =`
	<div class=${elementStrings.loader}>
		<svg>
			<use href="img/icons.svg#icon-cw"></use>
		</svg>
	</div>
	`;
	parent.insertAdjacentHTML('afterbegin',loader);
}

export const clearLoader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if(loader) {
		loader.remove();
	}
} 