'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
// models
// const user =use('app/models/User');
const user = use('App/Models/User')
const Mail = use('Mail')
/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async signin({ request, auth, response }) {

    try {
      const token = await auth.attempt(
        request.input('username'),
        request.input('password')
    )
    return response.json({
      status: 'success signin',
      data: token,
    })
    }
    catch (error) {
      throw error
    }
  }

  async signup({ request, response, auth }) {
    try {

      const { username, password,role } = request.post();
      const users = await user.create({
        username:username,
        password:password,
        role:"User"
      });

      // generate JWT token for user
      const token = await auth.generate(users) 

      await Mail.send('welcome',{users}, (message) => { 
        message.to('sankets@webmob.tech').from('shoppingcart@gmail.com')
      })
      return response.json({
          status: 'success signup',
          data: token
      })
    }
    catch (error) {
      throw error
    }
  }
}

module.exports = UserController
