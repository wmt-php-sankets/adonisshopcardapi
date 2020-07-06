'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

// model 
const Product = use('App/Models/Product');
const { validate } = use('Validator')
const Database = use('Database')

const Helpers = use('Helpers')
/**
 * Resourceful controller for interacting with products
 */

class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const productdetails = await Product.all();
      if (productdetails) {
        return response.status(200).json({
          message: "successfull",
          data: productdetails
        });
      }
    } catch (error) {
      throw error
    }
  }

  async store({ request, response, params }) {

    try {

      const trx = await Database.beginTransaction()
      const { url, title, description, price } = request.post();

      const profilePic = request.file('url', {
        types: ['image'],
        size: '5mb'
      })

      await profilePic.move(Helpers.tmpPath('uploads'), {
        name: url,
        overwrite: true
      })

      const rules = {
        title: 'required|min:5  ',
        description: 'required',
        price: 'required'
      }

      const validation = await validate(request.all(), rules);

      if (!validation.fails()) {

        const productcreate = await new Product();

        productcreate.url = profilePic.clientName;
        productcreate.title = title;
        productcreate.description = description;
        productcreate.price = price;

        await productcreate.save();

        return response.status(201).json({
          message: "Successful created",
          data: productcreate
        });

      }
      else {
        return validation.messages()
      }
      await trx.commit()
    }
    catch (error) {
      throw error
    }
  }


  async update({ params, request, response, jwt }) {
    try {
      

      const { url, title, description, price } = request.post();

      const profilePic = request.file('url', {
        types: ['image'],
        size: '5mb'
      })

      await profilePic.move(Helpers.tmpPath('uploads'), {
        name: url,
        overwrite: true
      })

      const productupdate = await Product.find(params.id);

      if (productupdate) {

        productupdate.url = profilePic.clientName;
        productupdate.title = title;
        productupdate.description = description;
        productupdate.price = price;

        await productupdate.save();

        return response.status(201).json({
          message: "Successful created",
          data: productupdate
        });
      }
     
    }
    catch (error) {
      console.log(error);
    }
  }

  async destroy({ params, request, response }) {
    try {
      const trx = await Database.beginTransaction()
      const { id } = params;

      const deleteproduct = await Product.find(id);

      await deleteproduct.delete();
      return response.status(201).json({
        message: "Successful deleted",
      });
      await trx.commit()
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = ProductController
