import axios from 'axios';
import { key, proxy} from '../config';
import Fraction from 'fraction.js';

export default class Recipe {
	constructor(recipe_id) {
		this.recipe_id = recipe_id;
	}

	async getRecipe() {
		try {
			const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.recipe_id}`)
			// console.log(res.data.recipe)
			// localStorage.setItem('res',JSON.stringify(res));
			// const res = JSON.parse(localStorage.getItem('res'));

			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			
		} catch(error) {
			console.log(error);
			alert("something went wrong :(")
		}
	}
	//method to calculate a rough time based on ingredients, assuming that we need 15 min for each 3 ingredients
	calcTime() {
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods*15;
	}

	//assuming it's 4
	calcServing () {
		this.servings = 4;
	}

	//standardize recipe, units and get rid of parentheses
	parseIngredients () {
		const unitsLong = ['tablespoons','tablespoon','ounce','ounces','teaspoons','teaspoon','cups','pounds'];
		const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
		const units = [...unitsShort,'kg','g'];
		const newIngredients = this.ingredients.map (el => {
		// 1) uniform units
		let ingredient = el.toLowerCase();
		unitsLong.forEach( (unit,i) => {
			if(ingredient.includes(unit)) {
				ingredient = ingredient.replace(unit,unitsShort[i])
			}
		});

		///2. remove parentheses
		ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); // * arbitary, \(, left parentheses, [^)]*, arbitary numbe of non-), \), right parentheses

		//3. parse ingredients into count, unit and ingredient (hardest part)
		//case 1, no number, no unit, only text
		const arrIng = ingredient.split(' ');
		const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

		let objIng;
		if (unitIndex > -1) {
			// there is a unit
			const arrCount = arrIng.slice(0,unitIndex);

			let count;
			if(arrCount.length === 1) {
				count = eval(arrIng[0].replace('-','+'));
			} else {
				count = eval( arrIng.slice(0,unitIndex).join('+'));
			}

			objIng = {
				count,
				unit: arrIng[unitIndex],
				ingredient: arrIng.slice(unitIndex+1).join(' ')
			}

		} else if (parseInt(arrIng[0])) {
			// there is no unit, but 1st element is number
			objIng = {
				count: parseInt(arrIng[0]),
				unit:'',
				ingredient: arrIng.slice(1).join(' ')
			}
		}

		else if (unitIndex === -1) {
			// there is no unit, 1st element is not a number
			objIng = {
				count: 1,
				unit: '',
				ingredient: ingredient
			}
		}

		// let num = ingredient.match(/\d*[\s+\d+/\d+]/g)

		// if (ingredient) {
		// 	num = ingredient.join(" ")

		// } 
		
		return objIng;
		})

	this.ingredients = newIngredients;	
	}

	updateServings (type) {
		//servings
		// const newServings = type === 'dec' ? this.servings -1: this.servings +1;
		let newServings;
		// the smallest number of servings is 1
		if (type === 'dec') {
			newServings = this.servings > 1 ? this.servings -1 : this.servings;
		} else {
			newServings = this.servings +1;
		}

		//ingredients
		this.ingredients.forEach (ing => {
			// const num = new Fraction(ing.count * (newServings/this.servings)).simplify(0.00001);
			// ing.count = num.toFraction(true);
			ing.count *= newServings/this.servings;

		})
		this.servings = newServings;
	}

}