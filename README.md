# Challenge Adonis

## Sobre

Trata-se de um sistema que permite cadastrar usuários externos. Ao realizarem login, estes usuários deverão poder registrar clientes, produtos e vendas.

Neste caso, o escolhido foi Adonis para o desenvolvimento deste projeto e segue sua documentação.

Veja mais em [CHALLENGE.md](CHALLENGE.md).

## Requisitos

- Node.js >= 20.6 (desenvolvido com esta versão (20.x) e é a versão exigida em [instalação no site oficial do Adonis](https://docs.adonisjs.com/guides/getting-started/installation#installation)).
- NPM.
- SGBD MariaDB ou MySQL instalado.
- Docker e Docker Compose (opcional).

## Algumas das dependências do projeto

- Adonis,
- Lucid,
- TypeScript,
- MySQL,
- Vine,
- Argon2 e
- SWC

Instale as dependências do projeto usando:

```bash
npm install
```

Veja os recursos do Ace usando:

```bash
node ace
```

Usando Docker Compose:

```bash
docker compose -f docker-compose.yml up
```

OBS: O `HOST` em `.env` é sempre `0.0.0.0` para funcionar em Docker.
Para criar um arquivo `.env` com variáveis de ambiente pode executar um `cp .env.example .env`.

Para definir o `APP_KEY` use o comando `node ace generate:key`.
O resultado seria `DONE: add APP_KEY to .env`.

OBS: Veja se as tabelas foram migradas para o banco de dados. __Caso tenha realizado a migração ocorreu com sucesso `Already up to date` irá aparecer.__

## Banco de dados

Utiliza-se como banco de dados o MySQL que pode ser os seguintes SGBDs:

- MariaDB (Eu utilizei este e você pode escolher entre este ou o outro)
- MySQL

Para migração das tabelas do banco de dados usando o Lucid rode:

```bash
node ace migration:run
```

## Execução

Para execução rode:

```bash
npm run dev
```

Porta: 3333

- Você pode alterar em .env.example para .env com suas credenciais no banco de dados como senha.

## Tests checklist

- [x] Produtos (todas as rotas)  
- [x] Clientes (todas as rotas)  
- [x] Autenticação (todas as rotas)  
- [x] Vendas (todas as rotas)  

OBS: Estes testes atestam o funcionamento dos recursos desta API.
Realizados em 26/11.

NOTE: Se o produto estiver sendo desativado pela atualização do campo updated_at (sendo atualizado pela última vez), você pode comparar a data do updated_at com a data atual. Se o produto foi atualizado recentemente, para desativá-lo (isso pode ser de acordo com o critério de negócio), você pode impedir a venda de um certo produto e nenhuma venda será salva no banco de dados (operação que assegura que as vendas antigas estejam salvas (soft delete)).

## LICENSE

Veja [LICENSE.md](LICENSE.md).
