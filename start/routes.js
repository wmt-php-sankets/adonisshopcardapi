'use strict'
const Mail = use('Mail')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/', () => {
//   return 'success is always for you';
// })
//user ragistation and login
Route.post('/signin', 'UserController.signin').middleware('throttle:3,20');
Route.post('/signup', 'UserController.signup');

// product 
Route.get('/product/index', 'ProductController.index').middleware('admin');
Route.post('  /product/store', 'ProductController.store').middleware('admin');
Route.post('/product/update/:id', 'ProductController.update').middleware('admin');
Route.get('/product/delete/:id', 'ProductController.destroy').middleware('admin')

//card
Route.get('/card/index', 'CardController.index').middleware('auth');
Route.post('/card/add/:id', 'CardController.update').middleware('auth');
Route.get('/card/delete/:id', 'CardController.destroy').middleware('auth')

// purchase product
Route.get('/purchase/index', 'PurchaseController.index').middleware('auth'); // display   avalable product in card for users
Route.post('/purchase/purchasecard', 'PurchaseController.store').middleware('auth'); // purchase avalable product in card

// order show
Route.get('/profile/index', 'ProfileController.index').middleware('auth'); // purchase avalable product in card


// social login
Route.on('/').render('welcome')
Route.get('/logout', 'LoginController.logout').as('logout')
Route.get('/auth/:provider', 'LoginController.redirectToProvider').as('social.login')
Route.get('/authenticated/:provider', 'LoginController.handleProviderCallback').as('social.login.callback')
