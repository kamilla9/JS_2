// 3 Урок продвинутый уровень JS

//ФЭЙК ЭПИ 
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const image = 'https://placehold.it/200x150';
const cartImage = 'https://placehold.it/100x80';

let   userCart = [];
// product_name
//Супер класс "List" , который используется в классах : ProductsList и Cart
class List {
	constructor (url, container) {
		this.container = container;
		this.url = url;
		this.goods = [];
		this.allProducts = [];
		//this.filtered = [];
		this._init ()
	}
	_init () {
		return false 									// Зачем используется false???
	}
	getJSON (url) {										// это фетч , но похож на промис 
		return fetch (url ? url : `${API + this.url}`)
			.then (result => result.json ())
			.catch (error => {
				console.log (error)
			})
	}
	handleData (data) {
		//debugger
		this.goods = [...data]
		this.render ()
	}
	render () {
		const block = document.querySelector(this.container)

		for (let product of this.goods) {
			const prod = new lists [this.constructor.name] (product)
			this.allProducts.push (prod)
			block.insertAdjacentHTML('beforeend', prod.render ())
		}
	}
}
//title
class Item {
	constructor (el, img = 'https://placehold.it/200x150') {
		this.product_name = el.product_name;
		this.id_product = el.id_product;
		this.price = el.price;
		this.img = img
	}
	render () { 																// Здедсь , нажимая на кнопку "купить" , активируется id_product
		return `<div class="product-item" data-id="${this.id_product}">
                        <img src="${this.img}" alt="Some img">
                        <div class="desc">
                            <h3>${this.product_name}</h3>
                            <p>${this.price} $</p>
                            <button class="buy-btn" 
                             data-id="${this.id_product}"
                            data-name="${this.product_name}"
                            data-image="${this.img}"
                            data-price="${this.price}">Купить</button>    
                        </div>
                    </div>`
	}
}

class ProductItem extends Item {
	// Все записано в родительский класс и больше ничего не нужно 
}

class CartItem extends Item {
	//+ доп. корзинные штуки
	constructor (el, img = 'https://placehold.it/100x80') {
		super (el, img)
		this.quantity = el.quantity
	}
	render () {
		return `<div class="cart-item" data-id="${this.id_product}">
					<div class="product-bio">
						<img src="${this.img}" alt="Some image">
						<div class="product-desc">
							<p class="product-title">${this.product_name}</p>
							<p class="product-quantity">Quantity: ${this.quantity}</p>
							<p class="product-single-price">${this.price} each</p>
						</div>
					</div>
					<div class="right-block">
						<p class="product-price">${this.quantity * this.price}</p>
						<button class="del-btn" data-id="${this.id_product}">&times;</button>
					</div>
				</div>`
	}
}

class ProductsList extends List {
	constructor (cart, url = '/catalogData.json', container = '.products') {
		super (url, container);
		this.cart = cart;
		this.getJSON()
			.then (data => this.handleData(data))
	}
	_init () {
		document.querySelector(this.container).addEventListener('click', evt => {
			if (evt.target.classList.contains('buy-btn')) {
				//evt.preventDefault()                								// Зачем нужен здесь метод preventDefault??
				this.cart.addProduct (evt.target)
			}
		})
	}
}

class Cart extends List {
	constructor (url = '/getBasket.json', container = '.cart-block') {
		super (url, container);
		this.getJSON()
			.then (data => this.handleData(data.contents))
	}
	addProduct (element) {
		this.getJSON (`${API}/addToBasket.json`)   				// result : 1 (запрос на наличие файлов, которые точно есть)
			.then (data => {
				if (data.result) {
					let productId = +element.dataset['id'];
					let find = this.allProducts.find (product => product.id_product === productId)

					if (!find) {
						let product = {
							product_name: element.dataset['name'],
							id_product: productId,
							price: +element.dataset['price'],
							quantity: 1
						}
						this.allProducts.push(product)
                        this.render()
					} else {
						find.quantity++
						this._updateCart(find)
					}

				} else {
					console.log ('err')
				}
			})
	}
	removeProduct (element) {
		this.getJSON (`${API}/deleteFromBasket.json`)			// result :1
			.then (data => {
				if (data.result) {
					let productId = +element.dataset['id'];
					let find = this.allProducts.find (product => product.id_product === productId)

					if (find.quantity > 1) {
						find.quantity--
						this._updateCart(find)
					} else {
						this.allProducts.splice (this.allProducts.indexOf(find), 1)
						document.querySelector (`.cart-item[data-id="${productId}"]`).remove ()
					}
				} else {
					console.log ('err')
				}
			})
	}
	_updateCart (product) {
		let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`)
		block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`
		block.querySelector('.product-price').textContent = `Рrice: ${product.quantity} * ${product.price}`
	}
	_init () {
		document.querySelector(this.container).addEventListener('click', evt => {
			if (evt.target.classList.contains('del-btn')) {
				this.removeProduct (evt.target)
			}
		})
		document.querySelector ('.btn-cart').addEventListener ('click', () => {
			document.querySelector ('.cart-block').classList.toggle ('invisible')
		})
	}
}

let lists = {
	ProductsList: ProductItem,
	Cart: CartItem
}

let cart = new Cart ();
let products = new ProductsList (cart)






// let getRequest = (url) => {
// 	return new Promise ((res, rej) => {
// 		let xhr = new XMLHttpRequest();
// 		xhr.open('GET', url, true);
// 		xhr.onreadystatechange = function () {
// 			if (xhr.readyState === 4) {
// 				if (xhr.status !== 200) {
// 					rej ('error')
// 				} else {
// 					res(xhr.responseText);
// 				}
// 			}
// 		}
// 	})
//
// } ADD

// class GoodsList {
// 	constructor () {
// 		this.goods = []
// 	}
//
// 	fetchGoods () {
// 		getRequest(`${API_URL}/catalogData.json`, (goods) => {
// 			this.goods = JSON.parse(goods)
// 		  })
// 	}
// 	render () {
// 		const block = document.querySelector ('.products')
// 		this.goods.forEach (product => {
// 			const prod = new Product (product)
// 			block.insertAdjacentHTML ('beforeend', prod.render ())
// 		})
// 	}
// }
//
// const list = new GoodsList();
// list.fetchGoods(() => {
//   list.render()
// })
//
// class Product {
// 	constructor (product) {
// 		this.id = product.id_product
// 		this.title = product.product_name
// 		this.price = product.price
// 		this.img = image
// 	}
// 	render () {
// 		return `<div class="product-item">
//                         <img src="${this.img}" alt="Some img">
//                         <div class="desc">
//                             <h3>${this.title}</h3>
//                             <p>${this.price} $</p>
//                             <button class="buy-btn"
//                             data-name="${this.title}"
//                             data-image="${this.img}"
//                             data-price="${this.price}">Купить</button>
//                         </div>
//                     </div>`
// 	}
// }
