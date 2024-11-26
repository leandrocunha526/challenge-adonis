import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Endereco extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare rua: string

  @column()
  declare cidade: string

  @column()
  declare estado: string

  @column()
  declare cep: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
