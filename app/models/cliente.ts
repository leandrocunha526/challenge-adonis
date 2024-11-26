import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Venda from './venda.js'
import Endereco from './endereco.js'
import Telefone from './telefone.js'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare cpf: string

  @hasMany(() => Venda)
  declare vendas: HasMany<typeof Venda>

  @hasMany(() => Endereco)
  declare enderecos: HasMany<typeof Endereco>

  @hasMany(() => Telefone)
  declare telefones: HasMany<typeof Telefone>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
