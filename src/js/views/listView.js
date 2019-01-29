import {elements} from './base';

export const renderShoppingItem = (item) => {
	const markup = `<li class="shopping__item" data-itemid = ${item.id}>
	        <div class="shopping__count">
	            <input type="number" value="${item.count}" step="${item.count}" class="shooping__count-value">
	            <p>${item.unit}</p>
	        </div>
	        <p class="shopping__description">${item.ingredient}</p>
	        <button class="shopping__delete btn-tiny">
	            <svg>
	                <use href="img/icons.svg#icon-circle-with-cross"></use>
	            </svg>
	        </button>
	    </li>`;
		elements.list.insertAdjacentHTML('beforeend',markup);			
}; 	

export const renderClearButton = () => {
	if (!document.querySelector('.shopping__btn--clear')) {
		const markup = ` <button class="btn-small shopping__btn--clear">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-bin"></use>
                    </svg>
                    <span>Clear shopping list</span>
                </button>`;
    	elements.list.insertAdjacentHTML('afterend',markup);
	}
	
};

export const deleteItem = id => {
	const item = document.querySelector(`[data-itemid="${id}"]`);
	if (item) item.remove();
	//item.parentNode.ChildNode(item);
};

export const clearItem = () => {
	document.querySelectorAll('.shopping__item').forEach(el => el.remove());
	document.querySelector('.shopping__btn--clear').remove();
};

export const getInputData = () => {
	let item = {};
	const count = parseFloat(elements.shoppingInputCount.value);
	const unit = elements.shoppingInputUnit.value;
	const ingredient = elements.shoppingInputIngredient.value;
	item = {count,unit,ingredient};
	return item;
};

export const clearInputField = () => {
	document.querySelectorAll('.shopping__input').forEach(el => el.value = '');
};

