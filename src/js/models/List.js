import uniqid from 'uniqid';

export default class List {
	constructor () {
		this.items = [];
	}

	addItem (count,unit,ingredient) {
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient,
		}
		this.items.push(item);
		this.persistData();
		return item;
	}

	deleteItem (id) {
		const index = this.items.findIndex(el => el.id === id);
		// [ 2, 4, 8] splice (1,1), start position and length of elements -> return 4, original array is [2,8]
		// [2, 4, 8] slice(1,1) start position and end position -> return 4, original array is [2,4,8]
		this.items.splice(index,1);// mutate the original array
		this.persistData();
	}

	updateCount (id, newCount) {
		this.items.find(el => el.id === id).count = newCount;
		this.persistData();
	}

	clearAllItem () {
		if (this.items.length > 0) {
			this.items.splice(0,this.items.length)
			this.persistData();
		}
	}

	persistData () {
		localStorage.setItem('List',JSON.stringify(this.items))
	}

	readStorage () {
		const storage = JSON.parse(localStorage.getItem('List'));
		// Restore likes from the local storage
		if(storage) this.items = storage;
	}

	checkDuplicate (newIngredient,newCount) {
		const item = this.items.find(el => el.ingredient === newIngredient);
		if (item) {
			item.count += newCount;
		}
		return item;
	}
	// 	if (result) {
	// 		//if true, only update the newCount and not update unit and ingredients
	// 		result.count += newCount;
	// 		this.persistData();
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	// }

}