'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Card = use('App/Models/Card');
const Product = use('App/Models/Product');
const Database = use('Database')
/**
 * Resourceful controller for interacting with cards
 */
class CardController {
  /**
   * Show a list of all cards.
   * GET cards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request,auth, response, view,params }) {
    try {
      const usersid = await auth.getUser();
      const productid = params.id;

      const carddetails = await Card.query().where('user_id', usersid.id).fetch();
      if (carddetails) {
        return response.status(200).json({
          message: "successfull",
          data: carddetails
        });
      }
    }
    catch (error) {
      throw error
    }
  }

  async update({ auth, params, request, response }) {
    try {
      const trx = await Database.beginTransaction();

      const usersid = await auth.getUser();
      const productid = params.id;

      const findproduct = await Product.find(productid);
     
      const findcard = await Card.query().where('product_id', productid).where('user_id', usersid.id).first();

      if (findcard == null) {
          console.log('in');
          Card.findOrCreate(
          { id: productid, 'user_id': usersid.id },
          { "user_id": usersid.id, "product_id": productid, "qty": 1, "price": findproduct.price, "totalprice": findproduct.price });

        return response.status(200).json({
          message: 'create record',
          data: findproduct
        });
      }

      else {

        let qty = findcard.qty;

        //update value 
        let qtyinc = 1 + qty;

        let total = findcard.totalprice + findproduct.price;

        const updatecard = await Card.query().where('product_id', productid).where('user_id', usersid.id)
          .update({ user_id: usersid.id, qty: qtyinc, price: findproduct.price, totalprice: total })

        return response.status(200).json({
          message: 'update record!',
          data: updatecard
        });
      }
      await trx.commit();
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete a card with id.
   * DELETE cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params,auth, request, response }) {
    try {
     const trx = await Database.beginTransaction();
      const usersid = await auth.getUser();

      const cardid = params.id;
     
      const deletecard = await Card.query().where('product_id', cardid).where('user_id', usersid.id).first();
     
      await deletecard.delete();
      return response.status(201).json({
        message: "Successful deleted",
      });
      await trx.commit();
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = CardController
