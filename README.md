## Projeto: Aplicação para publicações de histórias de voluntários na reconstrução do RS!

![Print da página inicial](.vscode/assets/home.png)
**Página inicial**

![Print da página de criação de postagem](.vscode/assets/post.png)
**Criação de postagem**

![Print da lista de perguntas padrões](.vscode/assets/questions.png)
**Perguntas padrões**

Acesso: https://herois-anonimos.vercel.app

Repositório original: https://github.com/wedersonf/herois-anonimos

#### Desenvolvedor
Wederson Fagundes, Sistemas de Informação

#### Descrição
O objetivo da aplicação é dar visibilidade para histórias de voluntários que auxiliaram durante as enchentes no RS e aos que estão ajudando na reconstrução do Rio Grande do Sul. Para utilizar basta criar uma conta e publicar os relatos.
A aplicação conta com perguntas predefinidas que podem ser incluídas, visando direcionar com que o conteúdo das publicações postadas sigam o mesmo viés.

#### Desenvolvimento
O foco do projeto foi direcionado no _backend_ visando melhorar meu conhecimento, mas mantendo uma interface simples e de fácil entendimento.

### Testes
Para testar a aplicação existem dois tipos de usuários "administradores" e "usuários".<br>
Na seção <a href="#funcionalidades">funcionalidades</a> é possível visualizar todas as funcionalidades disponíveis no sistema que podem ser testadas.

Dados de acesso:<br>
**Administrador**:
>- **E-mail:** john@example.com
>- **Senha:** 123456

**Usuário autor**:
Além do usuário abaixo, é possível criar uma conta. Todas as contas criadas através do formulário de cadastro são adicionadas como usuário comum, ou seja, autores.
>- **E-mail:** julio.von@example.com
>- **Senha:** 123456

### Rotas API
**Authors**
- ``POST /authors`` - Cadastra novos usuários
- ``GET /authors`` - Retorna todos os usuários
- ``GET /authors/:id`` - Busca os dados do usuário pelo id
- ``PUT /authors/:id`` - Atualiza os dados do usuário pelo id
- ``DELETE /authors/:id`` - Remove um usuário pelo id

**Sessions**
- ``POST /sessions`` - Recupera um token (JWT) de autenticação na aplicação.

**Posts**
- ``POST /posts`` - Cadastra uma nova publicação
- ``GET /posts`` - Retorna todas as publicações. Aceita parâmetro na rota para buscar por autor e por slug, basta informar `?author=nome` ou `?slug=test` na URL.
- ``GET /posts/:id`` - Busca por uma publicação pelo id.
- ``PUT /posts/:id`` - Atualiza os dados de uma publicação pelo id.
- ``DELETE /posts`` - Remove uma publicação pelo id.

**Questions**
- ``POST /questions`` - Adiciona uma pergunta predefinida para os autores utilização dos autores.
- ``GET /questions`` - Lista todas as perguntas predefinidas.
- ``DELETE /questions`` - Remove uma pergunta predefinida pelo id.

**Uploads**
- ``POST /uploads`` - Adiciona um arquivo no serviço de armazenamento.


### Funcionalidades
**Visitantes**
- Visualizar todas publicações;
- Visualizar uma publicação específica com acesso pelo slug;
- Cadastrar uma nova conta como autor(a);
- Realizar autenticação no sistema.

**Usuários**
- Todas funcionalidades de visitantes;
- Acessar dashboard com listagem das suas próprias publicações;
- Criar novas publicações:
  - Adicionar imagem na publicação;
  - Adicionar título e descrição;
  - Adicionar perguntas predefinidas pelos administradores;
  - Inserir uma pergunta customizada.
- Editar próprias publicações;
- Remover próprias publicações.

**Administradores**
- Todas funcionalidades de usuários;
- Acesso aos painel de gerenciamento;
- Gerenciamento de usuários:
  - Listar todos os usuários do sistema;
  - Adicionar novo usuário (administrador/autor) no sistema;
  - Atualizar usuário;
  - Remover usuário.
- Gerenciamento de publicações:
  - Listar todas as publicações do sistema;
  - Atualizar publicação;
  - Remover publicação;
- Gerenciamento de perguntas (predefinidas):
  - Listar todas as perguntas por categorias;
  - Adicionar nova pergunta em uma categoria específica;
  - Remover pergunta.

## Atualizações
<table class="table table-bordered table-hover table-condensed">
  <thead>
    <tr>
      <th">Versão</th>
      <th">Data da entrega</th>
      <th">Funcionalidade/Alterações</th>
    </tr>
  </thead>
  
  <tbody>
  <tr>
    <td align="right">0.1.0</td>
    <td>18/06/2024</td>
    <td>
      <ul>
        <li>Criação de conta para autores;</li>
        <li>Autenticação do autor;</li>
        <li>Criação de novas publicações;</li>
        <li>Listagem de publicações;</li>
        <li>Listagem de publicações por id do author;</li>
        <li>Busca de publicação por slug;</li>
        <li>Busca de publicação por id;</li>
        <li>Remover publicação.</li>
      </ul>
    </td>
  </tr>

  <tr>
    <td align="right">0.1.1</td>
    <td>25/06/2024</td>
    <td>
      <ul>
        <li>Correção dos endpoints da API;</li>
        <li>Edição de publicações;</li>
        <li>Botão para voltar para lista de publicações;</li>
        <li>Paginação da listagem de publicações na tela inicial;</li>
        <li>Carregamento estilo esqueleto na página inicial;</li>
        <li>Carregamento estilo esqueleto na listagem de publicações do autor;</li>
        <li>Incluído botão de voltar para o top quando rolagem estiver ativa.</li>
      </ul>
    </td>
  </tr>

  <tr>
    <td align="right">0.1.2</td>
    <td>02/07/2024</td>
    <td>
      <ul>
        <li>Adicionado endpoint para upload de arquivos na cloudflare;<li>
        <li>Adicionado loader de carregamento na tela de edição de publicações;</li>
        <li>Correção da ordenação das perguntas na postagem;<li>
        <li>Ajustes no arquivo seed para popular banco de dados com imagens de exemplo;</li>
        <li>Adicionado voltar para o início ao clicar na logo;</li>
        <li>Formatação da data da publicação na lista de publicações na página inicial;</li>
        <li>Adicionado nome do autor na listagem de publicações da página inicial;<li>
        <li>Ajustes na largura do conteúdo do cabeçalho e rodapé do site;<li>
        <li>Adicionado página 404 quando inserido uma url invalida.<li>
      </ul>
    <td>
  </tr>

  <tr>
    <td align="right">0.1.3</td>
    <td>09/07/2024</td>
    <td>
      <ul>
        <li>Correção do botão de cancelar no alerta de confirmação de exclusão.</li>
        <li>Ajuste de responsividade de páginas e componentes.</li>
        <li>Adicionado administradores.</li>
        <li>Adicionado menu de gerenciamento.</li>
        <li>Adicionado gerenciamento de publicações.</li>
        <li>Adicionado gerenciamento de usuários.</li>
      </ul>
    </td>
  </tr>

  <tr>
    <td align="right">1.0.0</td>
    <td>16/07/2024</td>
    <td>
      <ul>
        <li>Ajuste das margens na tela de configurações.</li>
        <li>Ajuste de layout para versão de celular.</li>
        <li>Ajuste de alinhamento de texto para esquerda na descrição e respostas das publicações.</li>
        <li>Adicionado gerenciamento de perguntas predefinidas.</li>
        <li>Alterado a listagem fixa de perguntas ao gerenciar uma publicação, para listagem cadastradas no banco de dados.</li>
        <li>Adicionado loader de carregamento das perguntas na página de criação/edição de publicação.</li>
        <li>Removido arquivo estático com perguntas predefinidas</li>
        <li>Adicionado a criação das perguntas padrões no 'seed' do banco de dados.</li>
        <li>Adicionado opção de adicionar pergunta personalizada no menu de perguntas na página de criação/edição de publicação.<li>
        <li>Ajuste de estilo do loader de carregamento da página 'minhas publicações'.</li>
        <li>Removido elemento da imagem no card de publicações quando a publicação não tem uma imagem.</li>
        <li>Removida a animação de progresso das mensagens de alerta.</li>
        <li>Deletar publicações e suas respectivas imagens ao deletar usuário.</li>
      </ul>
    </td>
  </tr>
</tbody>
</table>

#### Tecnologias
- ReactJS;
- [Radix UI - Primitives](https://www.radix-ui.com/primitives);
- [TailwindCSS](https://tailwindcss.com/);
- [NextJS](https://nextjs.org);
- [MongoDB](https://www.mongodb.com/).
- [R2 - Cloudflare](https://www.cloudflare.com/pt-br/developer-platform/r2/)

#### Ambiente de desenvolvimento
- VSCode;
- Docker.

#### Referências e créditos
- [Atlas Docs](https://www.mongodb.com/docs/atlas/).

---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2024a) em 2024a.

