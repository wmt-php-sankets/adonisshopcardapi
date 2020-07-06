'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Card extends Model {
    product () {
        return this.hasMany('App/Models/Product','product_id','id')
      }
      user(){
        return this.belongsTo('App/Models/User','id','user_id','product_id')
      }
    purchase(){
      return this.hasOne('App/Models/Purchase','id','product_id','user_id');
    }
    }

module.exports = Card
