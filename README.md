# ProjectManager Pro

## Descrição

**ProjectManager Pro** é uma aplicação de gerenciamento de projetos e tarefas, com funcionalidades de controle de usuários e status de progresso. Esta aplicação é uma ferramenta simples para gerenciar projetos, permitindo que os usuários criem contas, façam login e acompanhem o status de suas tarefas de maneira intuitiva.

### Funcionalidades principais:

- **Registro e Login de Usuários:** Simulação de autenticação utilizando localStorage.
- **Gerenciamento de Projetos:** Criação, edição e exclusão de projetos com edição inline (edição direta no campo do projeto).
- **Modal de Confirmação de Exclusão:** Ao excluir um projeto, um modal é exibido com a opção de confirmação.
- **Gerenciamento de Tarefas:** Atribuição de tarefas com prazos e responsáveis (funcionalidade futura).
- **Status de Tarefas:** Acompanhamento de tarefas em andamento e concluídas (funcionalidade futura).
- **Filtro de Tarefas:** Filtros por status e projetos (funcionalidade futura).

## Tecnologias Utilizadas

- **HTML5:** Estrutura da interface.
- **CSS3:** Estilos e responsividade.
- **JavaScript (ES6+):** Lógica de controle e manipulação de dados.
- **localStorage:** Armazenamento temporário de dados (login e projetos).

## Estrutura de Arquivos

- `index.html`: Página principal da aplicação.
- `login.html`: Página de login de usuários.
- `register.html`: Página de cadastro de usuários.
- `projects.html`: Página de gerenciamento de projetos.
- `css/style.css`: Arquivo de estilos.
- `js/login.js`: Script para manipulação do login.
- `js/register.js`: Script para manipulação do registro.
- `js/projects.js`: Script principal com funcionalidades de gerenciamento de projetos, modal de exclusão e edição inline.

## Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/anselmotadeu/projectmanager-pro.git

   ```

2. Abra o arquivo index.html ou qualquer outra página diretamente no navegador para iniciar o projeto.
