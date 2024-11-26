/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller');
const ClientesController = () => import('#controllers/clientes_controller');
const ProdutosController = () => import('#controllers/produtos_controller');
const VendasController = () => import('#controllers/vendas_controller');

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rotas de autenticação e criação de usuário
router.post('/signup', [UsersController, 'store']) // Cadastro
router.post('/login', [UsersController, 'login']) // Login

router.get('/filtro', [VendasController, 'filterByMonthAndYear']).use(middleware.auth()) //Filtro para venda com mês e ano

// Rotas protegidas
router.group(() => {
  // Rotas para usuários
  router.group(() => {
    router.get('/', [UsersController, 'index']) // Listar usuários
    router.get('/:id', [UsersController, 'show']) // Detalhar usuário
    router.put('/:id', [UsersController, 'update']) // Atualizar usuário
    router.delete('/:id', [UsersController, 'destroy']) // Deletar usuário
  }).prefix('/usuarios');

  // Rotas para clientes
  router.group(() => {
    router.get('/', [ClientesController, 'index']) // Listar todos os clientes
    router.get('/:id', [ClientesController, 'clientById']) // Exibir um cliente específico
    router.get('/vendas/:id', [ClientesController, 'show']) // Listar vendas pra um id de cliente específico
    router.post('/', [ClientesController, 'store']) // Criar um novo cliente
    router.put('/:id', [ClientesController, 'update']) // Atualizar um cliente existente
    router.delete('/:id', [ClientesController, 'destroy']) // Deletar um cliente
  }).prefix('/clientes');

  // Rotas para produtos
  router.group(() => {
    router.get('/', [ProdutosController, 'index']) // Listar todos os produtos
    router.get('/:id', [ProdutosController, 'show']) // Exibir um produto específico
    router.post('/', [ProdutosController, 'store']) // Criar um novo produto
    router.put('/:id', [ProdutosController, 'update']) // Atualizar um produto existente
    router.delete('/:id', [ProdutosController, 'destroy']) // Deletar um produto
  }).prefix('/produtos');

  // Rotas para vendas
  router.group(() => {
    router.get('/', [VendasController, 'index']) // Listar todas as vendas
    router.get('/:id', [VendasController, 'show']) // Exibir uma venda específica
    router.post('/', [VendasController, 'store']) // Criar uma nova venda
    router.put('/:id', [VendasController, 'update']) // Atualizar uma venda existente
    router.delete('/:id', [VendasController, 'destroy']) // Deletar uma venda
  }).prefix('/vendas')
}).use(middleware.auth());
