
'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PurchaseSchema extends Schema {
  up() {
    this.create('purchases', (table) => {
      table.increments();
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id').onDelete('cascade').onUpdate('cascade');
      table.string('name', 10);
      table.string('address', 200);
      table.string('cardholder', 200);
      table.integer('totalprice');
      table.timestamps();
    })
  }
  down() {
    this.drop('purchases')
  }
}

module.exports = PurchaseSchema
