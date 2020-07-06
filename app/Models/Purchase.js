'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Card = use('App/Models/Card')

class Purchase extends Model {
  static boot() {
    super.boot()

    this.addHook('afterSave', async (Instance) => {
      const cart = await Card.query().where('user_id', Instance.user_id).delete()
    })
  }

  card() {
    return this.belongsTo('App/Models/Card');
  }
}

module.exports = Purchase
