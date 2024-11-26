import { BaseModel, column } from "@adonisjs/lucid/orm"
import { DateTime } from 'luxon'

export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare descricao: string

  @column()
  declare categoria: string

  @column()
  declare preco: number

  @column()
  declare quantidade: number

  // Soft Delete para false não realiza venda
  @column({})
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
