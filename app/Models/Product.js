'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
// const Table =use('Table/');
class Product extends Model {
     cards() {
        return this.belongsTo('App/Models/Card')
      }
}

module.exports = Product
