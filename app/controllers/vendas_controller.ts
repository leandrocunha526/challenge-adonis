import Venda from '#models/venda'
import Cliente from '#models/cliente'
import Produto from '#models/produto'
import type { HttpContext } from '@adonisjs/core/http'

export default class VendasController {
  // Listar todas as vendas
  public async index({ request, response }: HttpContext) {
    const { clienteId, produtoId, startDate, endDate } = request.qs()

    let query = Venda.query().preload('cliente').preload('produto').orderBy('created_at', 'desc')

    // Filtro por cliente
    if (clienteId) {
      query = query.where('cliente_id', clienteId)
    }

    // Filtro por produto
    if (produtoId) {
      query = query.where('produtoId', produtoId)
    }

    // Filtro por intervalo de datas
    if (startDate && endDate) {
      query = query.whereBetween('created_at', [startDate, endDate])
    }

    const vendas = await query
    return response.status(201).json(vendas)
  }

  // Exibir detalhes de uma venda
  public async show({ params, response }: HttpContext) {
    const { id } = params

    // Verificar se o ID é válido
    const idNumber = Number(id)
    if (isNaN(idNumber)) {
      return response.status(400).json({
        message: 'ID inválido. O parâmetro deve ser um número.'
      })
    }

    try {
      const venda = await Venda.query()
        .where('id', idNumber)
        .preload('cliente')
        .preload('produto')
        .first()

      return response.status(201).json(venda)
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao tentar encontrar a venda.',
        error: error.message
      })
    }
  }

  // Criar uma nova venda
  public async store({ request, response }: HttpContext) {
    const { clienteId, produtoId, quantidade } = request.only(['clienteId', 'produtoId', 'quantidade'])

    const cliente = await Cliente.findOrFail(clienteId)
    const produto = await Produto.findOrFail(produtoId)

    // Verificar se o produto está ativo
    if (!produto.ativo) {
      return response.badRequest('O produto não está ativo para venda.')
    }

    // Calcular valores
    const precoUnitario = produto.preco
    const precoTotal = precoUnitario * quantidade

    // Criar a venda
    const venda = await Venda.create({
      clienteId: cliente.id,
      produtoId: produto.id,
      quantidade,
      precoUnitario,
      precoTotal,
    })

    return response.created(venda)
  }

  // Atualizar uma venda existente
  public async update({ params, request, response }: HttpContext) {
    const venda = await Venda.findOrFail(params.id)

    const { clienteId, produtoId, quantidade } = request.only(['clienteId', 'produtoId', 'quantidade'])

    const produto = await Produto.findOrFail(produtoId)

    // Verificar cliente e produto
    if (clienteId) {
      await Cliente.findOrFail(clienteId)
      venda.clienteId = clienteId
    }

    if (produtoId) {
      const produto = await Produto.findOrFail(produtoId)
      venda.produtoId = produtoId
      venda.precoUnitario = produto.preco
    }

    // Atualizar quantidade e preço total
    if (quantidade) {
      venda.quantidade = quantidade
      venda.precoTotal = venda.precoUnitario * quantidade
    }

    // Verificar se o produto está ativo
    // Consulta de soft delete
    if (!produto.ativo) {
      return response.badRequest('O produto não está ativo para venda.')
    }

    await venda.save()
    return response.status(200).json(venda)
  }

  // Deletar uma venda
  public async destroy({ params, response }: HttpContext) {
    const venda = await Venda.findOrFail(params.id)
    await venda.delete()
    return response.noContent()
  }

  // GET /filtro?month=11&year=2024
  public async filterByMonthAndYear({ request, response }: HttpContext) {
    const { month, year } = request.qs()
    //console.log('Parâmetros recebidos:', { month, year });

    if (!month || !year) {
      return response.status(400).json({
        message: 'Mês e ano são obrigatórios para a filtragem.',
      })
    }

    if (month < 1 || month > 12 || year.length !== 4) {
      return response.status(400).json({
        message: 'Parâmetros de mês ou ano inválidos.',
      })
    }

    const monthFormatted = String(month).padStart(2, '0');
    const yearFormatted = String(year);
    try {
      const vendasEncontradas = await Venda.query()
        .preload('cliente')
        .preload('produto')
        .where('created_at', '>=', `${yearFormatted}-${monthFormatted}-01 00:00:00`)
        .where('created_at', '<', `${yearFormatted}-${String(Number(monthFormatted) + 1).padStart(2, '0')}-01 00:00:00`)
        .orderBy('created_at', 'asc')

      if (vendasEncontradas.length === 0) {
        return response.status(404).json({
          message: `Nenhuma venda encontrada para o mês ${monthFormatted} e ano ${yearFormatted}.`,
          error: 404,
        })
      }

      return response.json(vendasEncontradas)
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao tentar encontrar a venda.',
        error: error.message
      })
    }
  }
}
