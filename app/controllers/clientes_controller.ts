import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'
import Endereco from '#models/endereco'
import Telefone from '#models/telefone'
import Venda from '#models/venda'

export default class ClientesController {
  // Listar todos os clientes com seus endereços e telefones
  public async index({ response }: HttpContext) {
    const clientes = await Cliente.query()
      .preload('enderecos') // Carregar endereços relacionados
      .preload('telefones') // Carregar telefones relacionados
      .orderBy('nome', 'asc') // Ordem alfabética
    return response.json(clientes)
  }

  // Detalhar um cliente, seus endereços, telefones e vendas
  public async clientById({ params, response }: HttpContext) {
    const { id } = params

    const cliente = await Cliente.query()
      .where('id', id)
      .preload('enderecos') // Carregar endereços relacionados
      .preload('telefones') // Carregar telefones relacionados
      .firstOrFail()

    return response.json(cliente)
  }

  public async show({ params, response }: HttpContext) {
    const { id } = params

    // Buscar cliente e seus relacionamentos
    const cliente = await Cliente.query()
      .where('id', id)
      .preload('enderecos') // Carregar endereços relacionados
      .preload('telefones') // Carregar telefones relacionados
      .preload('vendas', (query) => {
        query.orderBy('createdAt', 'desc') // Ordenar vendas pela data, do mais recente para o mais antigo
      })
      .firstOrFail()

    // Verificar se o cliente não possui vendas
    if (!cliente.vendas || cliente.vendas.length === 0) {
      return response.status(200).json({
        message: 'O cliente não possui vendas.',
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          cpf: cliente.cpf,
          enderecos: cliente.enderecos,
          telefones: cliente.telefones,
          vendas: [], // Retorna vendas como array vazio
        },
      })
    }

    // Retornar os dados completos do cliente
    return response.json(cliente)
  }

  // Criar um cliente com endereços e telefones
  public async store({ request, response }: HttpContext) {
    const dadosCliente = request.only(['nome', 'cpf'])
    const enderecos = request.input('enderecos') // Array de endereços
    const telefones = request.input('telefones') // Array de telefones

    if (!dadosCliente.nome || !dadosCliente.cpf) {
      return response.status(400).json({
        message: 'Os campos "nome" e "cpf" são obrigatórios.',
        code: 400,
      })
    }

    const clienteExistente = await Cliente.findBy('cpf', dadosCliente.cpf)
    if (clienteExistente) {
      return response.status(400).json({
        message: 'O CPF informado já está cadastrado.',
        code: 400
      })
    }

    const cliente = await Cliente.create(dadosCliente)

    // Criar endereços relacionados
    if (enderecos && enderecos.length > 0) {
      await cliente.related('enderecos').createMany(enderecos)
    }

    // Criar telefones relacionados
    if (telefones && telefones.length > 0) {
      await cliente.related('telefones').createMany(telefones)
    }

    return response.created(cliente)
  }

  // Atualizar um cliente, seus endereços e telefones
  public async update({ params, request, response }: HttpContext) {
    const { id } = params
    const dadosCliente = request.only(['nome', 'cpf'])
    const enderecos = request.input('enderecos') // Array de endereços
    const telefones = request.input('telefones') // Array de telefones

    if (!dadosCliente.nome || !dadosCliente.cpf) {
      return response.status(400).json({
        message: 'Os campos "nome" e "cpf" são obrigatórios.',
        code: 400,
      })
    }

    const cliente = await Cliente.findOrFail(id)
    cliente.merge(dadosCliente)
    await cliente.save()

    // Atualizar endereços
    if (enderecos) {
      await cliente.related('enderecos').createMany(enderecos) // Criar novos
    }

    // Atualizar telefones
    if (telefones) {
      await cliente.related('telefones').createMany(telefones) // Criar novos
    }

    return response.json(cliente)
  }

  // Excluir um cliente (com endereços, telefones e vendas)
  public async destroy({ params, response }: HttpContext) {
    const { id } = params
    const cliente = await Cliente.findOrFail(id)

    // Excluir endereços, telefones e vendas relacionados
    await Endereco.query().where('clienteId', id).delete()
    await Telefone.query().where('clienteId', id).delete()
    await Venda.query().where('clienteId', id).delete()

    // Excluir cliente
    await cliente.delete()
    return response.noContent()
  }
}
