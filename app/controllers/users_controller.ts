import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, loginUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  // Método para criar um novo usuário
  public async store({ request, response }: HttpContext) {
    const data = request.all()

    // Validando os dados do usuário usando o validador
    const payload = await createUserValidator.validate(data)

    // Verifica se o email já está em uso
    const userExists = await User.findBy('email', payload.email)
    if (userExists) {
      return response.badRequest({ message: 'Email already in use' })
    }

    // Criação do usuário
    const user = await User.create({
      nome: payload.nome,
      email: payload.email,
      password: payload.password,
    })

    return response.created(user)
  }

  // Método para realização de login
  public async login({ request, response }: HttpContext) {
    const data = request.only(['email', 'password'])

    // Validando os dados do login usando o validador
    const payload = await loginUserValidator.validate(data)

    // Procurando o usuário pelo email
    const user = await User.findBy('email', payload.email)
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    // Verificando a senha
    if (!(await hash.verify(user.password, payload.password))) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    // Gerando o token de acesso
    const token = await User.accessTokens.create(user)

    return response.status(201).json({
      user,
      token: {
        type: 'bearer',
        value: token.value!.release(),
      },
    })
  }

  // List all users
  public async index({ response }: HttpContext) {
    const users = await User.query().select('id', 'email', 'createdAt')
    return response.ok(users)
  }

  // List details about user
  public async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }
    return response.status(200).json(user)
  }

  // Método para atualizar os dados do usuário
  public async update({ params, request, response }: HttpContext) {
    const data = request.all()

    // Validando os dados do usuário usando o validador
    const payload = await updateUserValidator.validate(data)

    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    // Verifica se o email já está em uso
    const userExists = await User.findBy('email', payload.email)
    if (userExists) {
      return response.badRequest({ message: 'Email already in use' })
    }

    // Atualiza o usuário
    user.merge(payload)
    await user.save()

    return response.ok({ message: 'User updated successfully', user })
  }

  // Método para excluir o usuário
  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    await user.delete()
    return response.status(200).json({ message: 'User deleted successfully' })
  }
}
