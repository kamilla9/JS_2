class Param {
	constructor(element){
		this.name = element.value
		this.price = +element.dataset['price']
		this.calories = +element.dataset['calories']
	}
}

class Burger {
	constructor(size, filling,option){
		this.size = new Param(this._select(size))
		this.filling = new Param(this._select(filling))
		this.option = this._getToppings(option)
	}

	_getToppings(name){
		let result = []
		this._selectAll(name).forEach(el => result.push(new Param(el)))
		return result
	}

	_selectAll(name){
		return [...document.querySelectorAll(`input[name="${name}"]:checked`)]   // Зачем многоточие?? 
	}

	_select(name){
		return document.querySelector(`input[name="${name}"]:checked`)
	}

	showSum(price,cal){
		document.querySelector(price).textContent = this.sumPrice()
		document.querySelector(cal).textContent = this.sumCalories()
	}

	sumPrice(){
		let result = this.size.price + this.filling.price
		this.option.forEach(el => result += el.price)
		return result
	}

	sumCalories(){
		let result = this.size.calories + this.filling.calories
		this.option.forEach(el => result += el.calories)
		return result
	}
}














































