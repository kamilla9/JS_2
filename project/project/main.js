
const BASE_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('notification',{
	props:['error','level'],
	computed:{
		errorModel(){
			 return this.error.message ? this.error.message : this.error;
		},
		top(){
			return `${(this.level +1) *20}px`;
		}
	},
	template:`
		<div class="notif notif-err" :style="{top:top}">
			{{errorModel}}
		</div>
	`
});

Vue.component('goods-item',{
	props:['good'],
	methods:{
		add(){
			//emit- стенная функция для связи между компонентами
			this.$emit('add', this.good.product_id);
		}
	},
	template:
	`
		<div class="goods-item">
			 <h3> {{ good.product_name }}</h3>
             <p>{{ good.price }}</p>
             <button @click="add">Добавить в корзину</button>
		</div>
	`
});

Vue.component('goods-list',{
	props:['goods'],
	computed:{
		isGoodsNotEmpty(){ 
			return this.goods.length > 0;
		}
	},
	methods:{
		addTo(productId){
			this.$emit('add', productId)
		}
	},
	template:
		`
			<div class="goods-list" v-if="isGoodsNotEmpty">
				<goods-item v-for="good in goods" @add="addTo" :good="good" :key="good.product_id">
				</goods-item> <!--key - служебное слово-->
			</div>
			<div class="goodsInCart" v-else>
	                Нет данных
	        </div>	
		`
});

Vue.component('btn-cart',{
	props:['goods'],
	// data: () => ({ // в компоненте дата - это функция , которая возвращает обьект
	// 	isVisibleCart: false
	// }),
	// computed:{
	// 	isVisibleCart(){
	// 		return this.goods.length > 0;
	// 	}	
	// },
	template:
	`
			<transition name="transition">
				<div class="cart-container"></div>
			</transition>
        
	`
});

Vue.component('search-goods',{
	props:['value'],
	computed:{
		searchModel:{
			// return 
			get(){
				return this.value;
			},
			set(newValue){
				this.$emit('input', newValue)
			}
		}
	},
	template:
	`
		<form action="#" class="search-from" @submit.prevent> <!-- @ = v-on: -->
            <input type="text" class="search-field" v-model.trim="searchModel"> 
            <button class="btn-search">
                <i class="fas fa-search"></i>
           	</button>
        </form>
	`
});


const app = new Vue({
	el:'#app',
	data:{
		goods:[],// переносим список товаров, поиск.
		searchLine:'',
		isVisibleCart: false,
		errors:[],
	},
	computed:{
		filteredGoods(){
			const regexp = new RegExp(this.searchLine, 'i');
			return this.goods.filter((good) =>{ // filter возвращает только массив
				return regexp.test(good.product_name);
			});
		},
	},
	//хуки жизненного цикла(методы), запрос списка товаров
	mounted(){// когда приложение смонтировалось
		// через this. мы обращаемся к элементу из Vue
		this.makeGETRequest(`${BASE_URL}/catalogDataa.json`) 
		.then((goods) =>{
			this.goods = goods;
		})
		.catch(err => this.addError(err));
	},
	methods:{
		addToCart(productId){
			console.log('add product to cart', productId);
		},

		toggleCartVisibility(){
			this.isVisibleCart = !this.isVisibleCart;
		},

		addError(error){
			this.errors.push(error);
			setTimeout(()=>{
				const index = this.errors.indexOf(error);
				if(index > -1) this.errors.splice(index , 1);
			}, 6000);
		},

		// searchHandler(){
		// 	const regexp = new RegExp(this.searchLine, 'i');
		// 	this.filteredGoods = this.goods.filter((good) =>{
		// 		return regexp.test(good.product_name);
		// 	});
		// },
		makeGETRequest(url){
			return new Promise((resolve,reject) =>{
				const xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');

				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4){
						try{
							const response = JSON.parse(xhr.responseText);
							if (xhr.status != 200) reject(response);
								resolve(response);
							} catch(e){
								reject(e);
							}
						}
					};
				xhr.onerror = function(e){
					reject(e);
				};
				xhr.open('GET',url);
				xhr.send();
			});
		}
	}
});





// const image = 'https://placehold.it/200x150';
// const cartImage = 'https://placehold.it/100x80';

// let   userCart = [];
// // product_name
// //Супер класс "List" , который используется в классах : ProductsList и Cart
// class List {
// 	constructor (url, container) {
// 		this.container = container;
// 		this.url = url;
// 		this.goods = [];
// 		this.allProducts = [];
// 		//this.filtered = [];
// 		this._init ()
// 	}
// 	_init () {
// 		return false 									
// 	}
// 	getJSON (url) {										// это фетч , но похож на промис 
// 		return fetch (url ? url : `${API + this.url}`)
// 			.then (result => result.json ())
// 			.catch (error => {
// 				console.log (error)
// 			})
// 	}
// 	handleData (data) {
// 		//debugger
// 		this.goods = [...data]
// 		this.render ()
// 	}
// 	render () {
// 		const block = document.querySelector(this.container)

// 		for (let product of this.goods) {
// 			const prod = new lists [this.constructor.name] (product)
// 			this.allProducts.push (prod)
// 			block.insertAdjacentHTML('beforeend', prod.render ())
// 		}
// 	}
// }
// //title
// class Item {
// 	constructor (el, img = 'https://placehold.it/200x150') {
// 		this.product_name = el.product_name;
// 		this.id_product = el.id_product;
// 		this.price = el.price;
// 		this.img = img
// 	}
// 	render () { 																// Здедсь , нажимая на кнопку "купить" , активируется id_product
// 		return `<div class="product-item" data-id="${this.id_product}">
//                         <img src="${this.img}" alt="Some img">
//                         <div class="desc">
//                             <h3>${this.product_name}</h3>
//                             <p>${this.price} $</p>
//                             <button class="buy-btn" 
//                              data-id="${this.id_product}"
//                             data-name="${this.product_name}"
//                             data-image="${this.img}"
//                             data-price="${this.price}">Купить</button>    
//                         </div>
//                     </div>`
// 	}
// }

// class ProductItem extends Item {
// 	// Все записано в родительский класс и больше ничего не нужно 
// }

// class CartItem extends Item {
// 	//+ доп. корзинные штуки
// 	constructor (el, img = 'https://placehold.it/100x80') {
// 		super (el, img)
// 		this.quantity = el.quantity
// 	}
// 	render () {
// 		return `<div class="cart-item" data-id="${this.id_product}">
// 					<div class="product-bio">
// 						<img src="${this.img}" alt="Some image">
// 						<div class="product-desc">
// 							<p class="product-title">${this.product_name}</p>
// 							<p class="product-quantity">Quantity: ${this.quantity}</p>
// 							<p class="product-single-price">${this.price} each</p>
// 						</div>
// 					</div>
// 					<div class="right-block">
// 						<p class="product-price">${this.quantity * this.price}</p>
// 						<button class="del-btn" data-id="${this.id_product}">&times;</button>
// 					</div>
// 				</div>`
// 	}
// }

// class ProductsList extends List {
// 	constructor (cart, url = '/catalogData.json', container = '.products') {
// 		super (url, container);
// 		this.cart = cart;
// 		this.getJSON()
// 			.then (data => this.handleData(data))
// 	}
// 	_init () {
// 		document.querySelector(this.container).addEventListener('click', evt => {
// 			if (evt.target.classList.contains('buy-btn')) {
// 				//evt.preventDefault()                								
// 				this.cart.addProduct (evt.target)
// 			}
// 		})
// 	}
// }

// class Cart extends List {
// 	constructor (url = '/getBasket.json', container = '.cart-block') {
// 		super (url, container);
// 		this.getJSON()
// 			.then (data => this.handleData(data.contents))
// 	}
// 	addProduct (element) {
// 		this.getJSON (`${API}/addToBasket.json`)   				// result : 1 (запрос на наличие файлов, которые точно есть)
// 			.then (data => {
// 				if (data.result) {
// 					let productId = +element.dataset['id'];
// 					let find = this.allProducts.find (product => product.id_product === productId)

// 					if (!find) {
// 						let product = {
// 							product_name: element.dataset['name'],
// 							id_product: productId,
// 							price: +element.dataset['price'],
// 							quantity: 1
// 						}
// 						this.allProducts.push(product)
//                         this.render()
// 					} else {
// 						find.quantity++
// 						this._updateCart(find)
// 					}

// 				} else {
// 					console.log ('err')
// 				}
// 			})
// 	}
// 	removeProduct (element) {
// 		this.getJSON (`${API}/deleteFromBasket.json`)			// result :1
// 			.then (data => {
// 				if (data.result) {
// 					let productId = +element.dataset['id'];
// 					let find = this.allProducts.find (product => product.id_product === productId)

// 					if (find.quantity > 1) {
// 						find.quantity--
// 						this._updateCart(find)
// 					} else {
// 						this.allProducts.splice (this.allProducts.indexOf(find), 1)
// 						document.querySelector (`.cart-item[data-id="${productId}"]`).remove ()
// 					}
// 				} else {
// 					console.log ('err')
// 				}
// 			})
// 	}
// 	_updateCart (product) {
// 		let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`)
// 		block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`
// 		block.querySelector('.product-price').textContent = `Рrice: ${product.quantity} * ${product.price}`
// 	}
// 	_init () {
// 		document.querySelector(this.container).addEventListener('click', evt => {
// 			if (evt.target.classList.contains('del-btn')) {
// 				this.removeProduct (evt.target)
// 			}
// 		})
// 		document.querySelector ('.btn-cart').addEventListener ('click', () => {
// 			document.querySelector ('.cart-block').classList.toggle ('invisible')
// 		})
// 	}
// }

// let lists = {
// 	ProductsList: ProductItem,
// 	Cart: CartItem
// }

// let cart = new Cart ();
// let products = new ProductsList (cart)

