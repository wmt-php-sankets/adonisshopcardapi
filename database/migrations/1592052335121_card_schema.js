'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments();
      table.integer('product_id').unsigned()
      table.foreign('product_id').references('products.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('qty');
      table.integer('price');
      table.integer('totalprice');
      table.timestamps();
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
