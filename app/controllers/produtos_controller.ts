import { HttpContext } from '@adonisjs/core/http'
import Produto from '#models/produto'

export default class ProdutosController {
  // Listar todos os produtos
  public async index({ response }: HttpContext) {
    const produtos = await Produto.query().orderBy('nome', 'asc') // Ordenação alfabética
    return response.json(produtos)
  }

  // Exibir detalhes de um produto
  public async show({ params, response }: HttpContext) {
    const { id } = params
    const produto = await Produto.findOrFail(id)
    return response.json(produto)
  }

  // Criar um novo produto
  public async store({ request, response }: HttpContext) {
    const dados = request.only(['nome', 'descricao', 'categoria', 'preco', 'quantidade'])
    if (!dados) {
      return response.badRequest({ message: "Os campos são obrigatórios." })
    }
    const produto = await Produto.create(dados)
    return response.created(produto)
  }

  // Atualizar um produto existente
  public async update({ params, request, response }: HttpContext) {
    const { id } = params
    const produto = await Produto.findOrFail(id)
    const dados = request.only(['nome', 'descricao', 'categoria', 'preco', 'quantidade', 'ativo'])
    produto.merge(dados)
    await produto.save()
    return response.json(produto)
  }

  // Deletar um produto
  public async destroy({ params, response }: HttpContext) {
    const { id } = params
    const produto = await Produto.findOrFail(id)
    await produto.delete()
    return response.json({ message: `O produto ${id} foi excluído com sucesso` })
  }
}
