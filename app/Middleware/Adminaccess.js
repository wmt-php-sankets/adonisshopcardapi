'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User = use('App/Models/User');
class Adminaccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ requests,auth,params,response}, next) {
   
    try {
      
      await auth.check();
      if (auth.user.role !== 'Admin') {
        throw new Error('only access admin');
      }
    } catch (error) {
      return response.status(401).send({ message: error.message });
    }
      await next()
  }
}
module.exports = Adminaccess
