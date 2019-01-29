//fecth might be supported by old browsers, use axios, axios automatically return json
import axios from 'axios';
import { key, proxy} from '../config';

export default class Search {
	constructor(query) {
		this.query = query;
	}
	//get rid of function keyword for defining methods
	//async methods, automatically returns a promise
	async getResults() {
		try {
			const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
			this.result = res.data.recipes;

			// for local storage when running out of api
			// localStorage.setItem('result',JSON.stringify(res.data.recipes));
			// const storage = JSON.parse(localStorage.getItem('result'));

			// this.result = storage;

		} catch(error) {
			console.log(error);
		}
}
}

// fetch('https://www.food2fork.com/api/search?key=29eb5521244e5d8c2b2829828cbaf600&q=chicken%20breast&page=2')
// .then(resp=>resp.json())
// .then(console.log)
// .catch(error=>console.log('there is an error'))
// if it does not work on the browser, use prefix 'https://crossorigin.me/'' or cors proxy 'https://cors-anywhere.herokuapp.com/'

