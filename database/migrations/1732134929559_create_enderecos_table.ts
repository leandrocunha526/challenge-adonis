import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enderecos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('cliente_id')
        .unsigned()
        .references('id')
        .inTable('clientes')
        .onDelete('CASCADE')
      table.string('rua')
      table.string('numero')
      table.string('cidade')
      table.string('estado')
      table.string('cep')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
