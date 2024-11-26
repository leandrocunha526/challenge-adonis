import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Cliente from './cliente.js'
import Produto from './produto.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Venda extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare produtoId: number

  @column()
  declare quantidade: number

  @column()
  declare precoUnitario: number

  @column()
  declare precoTotal: number

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Produto, {
    onQuery: (query) => {
      query.orderBy('nome', 'asc') // Ordenar os produtos por nome em ordem alfabética
    },
  })
  declare produto: BelongsTo<typeof Produto>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
