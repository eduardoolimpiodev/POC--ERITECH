# 📡 Guia da Coleção Insomnia - Erictel API

Este guia explica como usar a coleção do Insomnia para testar a API do Erictel Backend.

## 🚀 Importando a Coleção

1. **Abra o Insomnia**
2. **Clique em "Import/Export"** ou use `Ctrl+Shift+I`
3. **Selecione "Import Data"**
4. **Escolha o arquivo** `insomnia-collection.json`
5. **Clique em "Import"**

## 🌍 Configuração de Ambientes

A coleção inclui dois ambientes pré-configurados:

### Development (Padrão)
```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "authToken": ""
}
```

### Production
```json
{
  "baseUrl": "https://your-production-domain.com/api/v1",
  "authToken": ""
}
```

## 🔐 Fluxo de Autenticação

### 1. Registrar Usuário
**Endpoint**: `POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "description": "Senior developer with 5 years experience"
}
```

**Resposta**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "name": "John Doe",
      "description": "Senior developer with 5 years experience",
      "profileImage": null,
      "isActive": true,
      "createdAt": "2025-08-18T22:30:00.000Z",
      "updatedAt": "2025-08-18T22:30:00.000Z"
    },
    "token_type": "Bearer",
    "expires_in": 604800
  }
}
```

### 2. Login
**Endpoint**: `POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Configurar Token
Após login/registro:
1. **Copie o `access_token`** da resposta
2. **Vá para o ambiente** (Development/Production)
3. **Cole o token no campo `authToken`**
4. **Salve o ambiente**

## 👤 Endpoints de Usuários

### Obter Perfil
**Endpoint**: `GET /users/profile`
- **Autenticação**: Bearer Token obrigatório
- **Retorna**: Informações do usuário atual

### Atualizar Perfil
**Endpoint**: `PATCH /users/profile`
```json
{
  "name": "John Doe Updated",
  "description": "Updated description with new experience"
}
```

### Upload de Imagem
**Endpoint**: `POST /users/profile/image`
- **Tipo**: Multipart/form-data
- **Campo**: `file` (JPEG, PNG, GIF - máx 5MB)

### Listar Usuários (Admin)
**Endpoint**: `GET /users`
- **Retorna**: Lista de todos os usuários ativos

## 💰 Endpoints de Criptomoedas

### Todas as Criptomoedas
**Endpoint**: `GET /cryptocurrencies`

**Parâmetros opcionais**:
- `limit`: Número de resultados (padrão: 10)
- `offset`: Pular resultados (padrão: 0)
- `name`: Filtrar por nome
- `symbol`: Filtrar por símbolo
- `type`: Filtrar por tipo

**Exemplo**:
```
GET /cryptocurrencies?limit=5&name=bitcoin
```

### Top Criptomoedas
**Endpoint**: `GET /cryptocurrencies/top`

**Parâmetros**:
- `limit`: Número de top criptomoedas (padrão: 10)

### Buscar Criptomoedas
**Endpoint**: `GET /cryptocurrencies/search`

**Parâmetros**:
- `q`: Termo de busca (nome ou símbolo)

**Exemplo**:
```
GET /cryptocurrencies/search?q=bitcoin
```

### Criptomoeda por ID
**Endpoint**: `GET /cryptocurrencies/{id}`

**Exemplo**:
```
GET /cryptocurrencies/btc-bitcoin
```

### Limpar Cache
**Endpoint**: `DELETE /cryptocurrencies/cache`
- **Limpa**: Cache de dados de criptomoedas

## 📋 Exemplos de Uso Completo

### 1. Fluxo Completo de Teste

```bash
# 1. Registrar usuário
POST /auth/register
{
  "email": "test@erictel.com",
  "password": "test123",
  "name": "Test User"
}

# 2. Copiar token da resposta e configurar no ambiente

# 3. Obter perfil
GET /users/profile

# 4. Buscar top 5 criptomoedas
GET /cryptocurrencies/top?limit=5

# 5. Buscar Bitcoin
GET /cryptocurrencies/search?q=bitcoin

# 6. Atualizar perfil
PATCH /users/profile
{
  "description": "Updated after testing API"
}
```

### 2. Teste de Upload de Imagem

1. **Selecione o endpoint** "Upload Profile Image"
2. **No body, selecione o arquivo** no campo `file`
3. **Envie a requisição**
4. **Verifique a resposta** com a URL da imagem

## 🔧 Dicas de Uso

### Variáveis de Ambiente
- **`{{ _.baseUrl }}`**: URL base da API
- **`{{ _.authToken }}`**: Token de autenticação

### Headers Automáticos
- **Content-Type**: Configurado automaticamente
- **Authorization**: Bearer token aplicado automaticamente

### Tratamento de Erros
A API retorna erros estruturados:

```json
{
  "statusCode": 401,
  "timestamp": "2025-08-18T22:30:00.000Z",
  "path": "/api/v1/users/profile",
  "method": "GET",
  "message": "Unauthorized",
  "error": "Invalid token"
}
```

### Status Codes Comuns
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado
- **404**: Não encontrado
- **409**: Conflito (usuário já existe)
- **500**: Erro interno do servidor

## 🚨 Troubleshooting

### Token Expirado
**Erro**: `401 Unauthorized`
**Solução**: Faça login novamente e atualize o token

### Servidor Offline
**Erro**: `Connection refused`
**Solução**: Verifique se o servidor está rodando em `localhost:3000`

### Validação de Dados
**Erro**: `400 Bad Request`
**Solução**: Verifique os campos obrigatórios e formatos

### Cache de Criptomoedas
**Problema**: Dados desatualizados
**Solução**: Use o endpoint `DELETE /cryptocurrencies/cache`

## 📊 Monitoramento

### Logs do Servidor
Monitore os logs do NestJS para debug:
```bash
npm run start:dev
```

### Performance
- **Cache**: Dados de criptomoedas ficam em cache por 5 minutos
- **Rate Limiting**: 100 requests por minuto por IP

## 🔄 Atualizações

Para atualizar a coleção:
1. **Baixe a nova versão** do `insomnia-collection.json`
2. **Re-importe** no Insomnia
3. **Reconfigure** os tokens se necessário

---

**🎉 Pronto!** Agora você pode testar toda a API do Erictel Backend de forma eficiente com o Insomnia!
