import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

/***global state of the app
-Search object
-Current recipe object
-shopping list object
-liked recipes
***/
const state = {};

// //for testing, let window see state
// window.state = state;

const ctrlSearch = async () => {
	//1. get the query from view
	const query = searchView.getInput();

	// //FOR TESTING
	// const query = "pizza";

	// console.log(query)
	if(query) {
		//2. new search object and add to state
		state.search = new Search(query);

		//3. prepare UI for results
		searchView.clearInputField(); //clear the input field after submit
		searchView.clearResults();
		renderLoader(elements.searchRes);

	try {
		//4. search for recipes
		await state.search.getResults();

		//5. render results on UI, we will render it after we have the results, so we need to wait for the result, that's why we use async here
		clearLoader();
		searchView.renderResults(state.search.result);	
	} catch (err) {
		alert('something wrong with the search...');
		clearLoader(elements.searchRes);
	}

	}
	
}

elements.searchButton.addEventListener('submit',e => {
	e.preventDefault(); //page will not be automatically reloaded
	ctrlSearch();
});

// TESTING
// window.addEventListener('load',e => {
// 	e.preventDefault(); //page will not be automatically reloaded
// 	ctrlSearch();
// });

elements.resPages.addEventListener('click',e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto);
		searchView.clearResults();
		searchView.renderResults(state.search.result,goToPage);
	}
})

// one way------
// const ctrlRecipe = async (recipeId) => {
// 	//1. new recipe object and add to state
// 	if(recipeId) {
// 		state.recipe = new Recipe(recipeId);

// 		// //FOR TESTING
// 		// window.r = state.recipe;

// 	//3. prepare UI for results
// 	recipeView.clearRecipes();
// 	renderLoader(elements.recipe);

// 	//2. fetch the detailed recipes and get the results
// 	await state.recipe.getRecipe();
// 	state.recipe.calcTime();
// 	state.recipe.calcServing();
// 	state.recipe.parseIngredients();
// 	clearLoader();

// 	//4. render results on UI
// 	recipeView.renderRecipes(state.recipe)
// 	}
// }

// elements.resultLists.addEventListener("click", e => {
// 	const link = e.target.closest('.results__link').getAttribute("href");
// 	if(link) {
// 		const recipeId = link.split("#")[1]
// 		// console.log('link',recipeId)
// 		ctrlRecipe(recipeId);
// 	}
// }
// )

//-------------------------------------------------------------------------------------------

//another way---- better, when refresh the page, it will save the last recipe and reload
const ctrlRecipe = async () => {
	//get id from url
	const id = window.location.hash.replace('#','');
	if(id) {
		//prepare UI for changes
		recipeView.clearRecipes();
		renderLoader(elements.recipe);
		//create new recipe object
		state.recipe = new Recipe(id);

		searchView.highlightSelected(id);

		try {
			//get recipe data
			await state.recipe.getRecipe();

			//calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServing();
			state.recipe.parseIngredients();
			clearLoader();

			//render recipe
			recipeView.renderRecipes(state.recipe,state.likes.isLiked(id));
		} catch (err) {
			console.log(err);
			alert('error processing recipe!');
		}
	}
}

// window.addEventListener('hashchange',ctrlRecipe);
// // window.addEventListener('load',ctrlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,ctrlRecipe))
//----------------------------------------------------------------------------------------
//shopping list controller
const ctrlList = () => {
	// create a new list if there is none yet
	if (!state.list){
		state.list = new List();
	}; 

	//Add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el => {
		//check duplicate ingredients, if duplicate, simply add to the count, same for additem part
		const itemDuplicate = state.list.checkDuplicate(el.ingredient,el.count);
		if (itemDuplicate) {
			//if duplicate
			// update the count of the duplicate item
			const id = itemDuplicate.id;
			document.querySelector(`[data-itemid="${id}"] input`).value = itemDuplicate.count;

		} else {
			//if not run the following
			const item = state.list.addItem(el.count,el.unit,el.ingredient);
			listView.renderShoppingItem(item);
		}
	});	

	//add clear shopping button into UI
	addClearButton()
};

const ctrlAddItem = () => {
	//get input value from UI
	const item = listView.getInputData();
	const {count,unit,ingredient} =item;

	//after getting the value, clear input data
	listView.clearInputField();

	//prevent false inputs
	if (count !== "" && count > 0 && !isNaN(count) && ingredient !== "") {
		//check duplicate
		const itemDuplicate = state.list.checkDuplicate(ingredient,count);

		// if duplicate
		if (itemDuplicate) {
			//if duplicate
			// update the count of the duplicate item
			const id = itemDuplicate.id;
			document.querySelector(`[data-itemid="${id}"] input`).value = itemDuplicate.count;

		} else {
			//add input item into list class
			state.list.addItem(count,unit,ingredient);

			//add item into shopping list
			listView.renderShoppingItem(item);

			//add clear button
			addClearButton();
		}

	} else {
		alert('Please valid count and ingredient before adding!')
	};
};

function addClearButton() {
	listView.renderClearButton();
};


//likes controller
const ctrlLikes = () => {
	//create like class if state.likes is none
	if (!state.likes){
		state.likes = new Likes();
	};
	const currentID = state.recipe.recipe_id;
	
	// User has NOT yet liked current recipe
	if(!state.likes.isLiked(currentID)) {
		//add like to the state
		let {img,title,author} = state.recipe;
		const like = state.likes.addLike(currentID,img,title,author);
		//toggle the like button
		likeView.toggleLikeBtn(true);

		// add like to the UI list
		likeView.renderLikes(like);

	//User HAS liked current recipe
	} else {
		//remove like from the state
		state.likes.deleteLike(currentID);

		// toggle the like button
		likeView.toggleLikeBtn(false);

		//remove like from UI list
		likeView.deleteLike(currentID);
	}
	likeView.toggleLikeMenu(state.likes.getNumLikes());
};


//restore liked recipes on page load
window.addEventListener('load',() => {
	state.likes = new Likes();

	// restore likes from localstorage
	state.likes.readStorage();

	//toggle like menu button
	likeView.toggleLikeMenu(state.likes.getNumLikes());

	//render the existing likes
	state.likes.likes.forEach(like => {
		likeView.renderLikes(like);
	})
});

//restore shopping list on page load
window.addEventListener('load', () => {
	state.list = new List();

	//restore likes from local storage
	state.list.readStorage();

	//add items to shopping list
	state.list.items.forEach (item => listView.renderShoppingItem(item));

	//add clear shopping button into UI
	addClearButton()
	
})

//update ingredients by adding plus or minus servings button
elements.recipe.addEventListener("click", e => {
	if (e.target.matches('.btn-decrease,.btn-decrease *')) {
		//decrease button is clicked
		if (state.recipe.servings>0) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase,.btn-increase *')) {
		// increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
		//add ingredients to the shopping list
		ctrlList();
	} else if (e.target.matches('.recipe__love,.recipe__love *')) {
		// add likes to the likes list
		ctrlLikes();
	}
});// only recipe element was there when we load the page, we need to use event delegation
// e.closest() is not ideal, since we need to react correspondingly based on the different element chosen
//.btn-decrease *, choose all the child elements of btn-decrease, because we might click the child element, but we still need to update the servings.

//handle delete, update and clear shopping list item events
elements.list.addEventListener("click",e=> {
	if(e.target.matches('.shopping__delete, .shopping__delete *')){
		const uniquid = e.target.closest('.shopping__item').dataset.itemid;
		//delete from state
		state.list.deleteItem(uniquid);
		//delete from UI
		listView.deleteItem(uniquid);
		state.list.clearAllItem();
	} 
	else if (e.target.matches('.shooping__count-value')) {
		//handle update
		const id = e.target.closest('.shopping__item').dataset.itemid;
		const val = parseFloat(e.target.value);
		state.list.updateCount(id,val);
	}
});

elements.shoppingList.addEventListener('click',e => {
	if (e.target.matches('.shopping__btn--clear,.shopping__btn--clear *')) {
		//clear shopping list
		state.list.clearAllItem();
		listView.clearItem();
	} else if (e.target.matches('.shopping__btn--add,.shopping__btn--add *')) {
		//add item into shopping list by clicking add item button
		ctrlAddItem();
	}
});



