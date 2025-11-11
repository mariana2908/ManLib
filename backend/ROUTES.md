# Documentação das Rotas da API

## Autenticação

- [X]
### Estudantes
- **POST** `/api/estudantes/login`
  - Autentica um estudante
  - Body:
    ```json
    {
      "email": "joao.silva@example.com",
      "senha": "senha123"
    }
    ```
  - Resposta de sucesso (200):
    ```json
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "nome": "João Silva",
      "email": "joao.silva@example.com",
      "matricula": "2024001",
      "turma_id": 1,
      "status": "ativo"
    }
    ```

- [X]
### Bibliotecários
- **POST** `/api/bibliotecarios/login`
  - Autentica um bibliotecário
  - Body:
    ```json
    {
      "email": "bibliotecario@example.com",
      "senha": "senha123"
    }
    ```

## Estudantes

- [X]
### Listar todos os estudantes
- **GET** `/api/estudantes`
  - Retorna todos os estudantes cadastrados
  - Não requer autenticação
  - Resposta de sucesso (200):
    ```json
    [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440003",
        "nome": "João Silva",
        "email": "joao.silva@example.com",
        "matricula": "2024001",
        "turma_id": 1,
        "status": "ativo"
      },
      ...
    ]
    ```

- [X]
### Obter um estudante específico
- **GET** `/api/estudantes/:id`
  - Retorna os dados de um estudante específico
  - Parâmetros de URL:
    - `id`: UUID do estudante
  - Resposta de sucesso (200):
    ```json
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "nome": "João Silva",
      "email": "joao.silva@example.com",
      "matricula": "2024001",
      "turma_id": 1,
      "status": "ativo"
    }
    ```

### Criar um novo estudante
- **POST** `/api/estudantes`
  - Cria um novo estudante
  - Body:
    ```json
    {
      "nome": "Novo Estudante",
      "email": "novo@example.com",
      "senha": "senha123",
      "matricula": "2024003",
      "turma_id": 1
    }
    ```
  - Resposta de sucesso (201):
    ```json
    {
      "uuid": "660e8400-e29b-41d4-a716-446655440005",
      "nome": "Novo Estudante",
      "email": "novo@example.com",
      "matricula": "2024003",
      "turma_id": 1,
      "status": "ativo"
    }
    ```

### Atualizar um estudante
- **PUT** `/api/estudantes/:id`
  - Atualiza os dados de um estudante
  - Parâmetros de URL:
    - `id`: UUID do estudante
  - Body (apenas os campos que deseja atualizar):
    ```json
    {
      "nome": "Nome Atualizado",
      "email": "atualizado@example.com"
    }
    ```
  - Resposta de sucesso (200):
    ```json
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "nome": "Nome Atualizado",
      "email": "atualizado@example.com",
      "matricula": "2024001",
      "turma_id": 1,
      "status": "ativo"
    }
    ```

### Deletar um estudante
- **DELETE** `/api/estudantes/:id`
  - Remove um estudante do sistema
  - Parâmetros de URL:
    - `id`: UUID do estudante
  - Resposta de sucesso (204): No Content

## Turmas

### Listar todas as turmas
- **GET** `/api/turmas`
  - Retorna todas as turmas cadastradas
  - Resposta de sucesso (200):
    ```json
    [
      {
        "id": 1,
        "nome": "1º Ano A",
        "codigo": "1A2024",
        "turno": "matutino",
        "serie": "1ª serie",
        "ano": 2024
      },
      ...
    ]
    ```

### Obter uma turma específica
- **GET** `/api/turmas/:id`
  - Retorna os dados de uma turma específica
  - Parâmetros de URL:
    - `id`: ID da turma

### Criar uma nova turma
- **POST** `/api/turmas`
  - Cria uma nova turma
  - Body:
    ```json
    {
      "nome": "2º Ano B",
      "codigo": "2B2024",
      "turno": "vespertino",
      "serie": "2ª serie",
      "ano": 2024
    }
    ```

## Livros

### Listar todos os livros
- **GET** `/api/livros`
  - Retorna todos os livros cadastrados

### Buscar livros
- **GET** `/api/livros/buscar?q=termo`
  - Busca livros por título, autor ou ISBN
  - Parâmetros de query:
    - `q`: Termo de busca

### Obter um livro específico
- **GET** `/api/livros/:id`
  - Retorna os dados de um livro específico
  - Parâmetros de URL:
    - `id`: ID do livro

### Empréstimos

### Listar empréstimos ativos
- **GET** `/api/emprestimos`
  - Retorna todos os empréstimos ativos

### Realizar empréstimo
- **POST** `/api/emprestimos`
  - Registra um novo empréstimo
  - Body:
    ```json
    {
      "livro_id": 1,
      "estudante_id": "550e8400-e29b-41d4-a716-446655440003",
      "data_prevista_devolucao": "2024-12-31"
    }
    ```

### Devolver livro
- **PUT** `/api/emprestimos/:id/devolver`
  - Registra a devolução de um livro
  - Parâmetros de URL:
    - `id`: ID do empréstimo

## Dados de Teste

### Estudantes
- **Email:** joao.silva@example.com
  **Senha:** senha123
  **Matrícula:** 2024001

- **Email:** maria.oliveira@example.com
  **Senha:** senha456
  **Matrícula:** 2024002
