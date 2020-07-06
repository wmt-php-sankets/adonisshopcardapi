'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product');
const Card = use('App/Models/Card')
const Purchase = use('App/Models/Purchase')
const Database = use('Database')

const Mail = use('Mail')
/**
 * Resourceful controller for interacting with purchases
 */
class PurchaseController {
  async index({ auth, request, response, view }) {
    try {
      const trx = await Database.beginTransaction()
      const user = await auth.getUser();

      const userid = user.id;
      
      const card = await Card.query().where('user_id', userid).fetch();
      return response.status(200).json({
        message: "card record display",
        data: card
      });

      await trx.rollback()
    } catch (error) {
      throw error;
    }

  }

  async store({ auth, request, response}) {
    
    const user = await auth.getUser();
    const userid = user.id;
    
    const { name, address, cardholder } = request.post();

    if (user) {
      // const carddata = await Card.query().where('user_id', userid).fetch();

      const product = await Card.query().where('user_id', userid).with('product').fetch();

      const totalsum = await Card.query().getSum('totalprice');
        // return response.send(product);
       const value  =  product.toJSON();
      await Mail.send('order',{totalsum,name,value}, (message) => { 
        message.to('sankets@webmob.tech').from('shoppingcart@gmail.com')
      })

      const purc = await new Purchase();
      // purchase product 
      purc.user_id = userid;
      purc.name = name;
      purc.address = address;
      purc.cardholder = cardholder;
      purc.totalprice = totalsum;
      await purc.save();  

      return response.status(201).json({
        message: "Successful purchases",
      });
    }
  }
}

module.exports = PurchaseController
