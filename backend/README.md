# Erictel Backend API

A robust NestJS backend API for the Erictel Technical Challenge, featuring user management, cryptocurrency data integration, and file upload capabilities.

## 🚀 Features

- **User Management**: Complete CRUD operations with JWT authentication
- **Cryptocurrency Integration**: Real-time data from CoinPaprika API with Redis caching
- **File Upload**: Profile image management with validation
- **Security**: JWT authentication, rate limiting, input validation
- **Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Testing**: Unit, integration, and e2e tests
- **Docker**: Production-ready containerization

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for cryptocurrency data caching
- **Authentication**: JWT with Passport strategies
- **Validation**: Class-validator with custom pipes
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest for unit and e2e tests

## 📋 Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Redis 7+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Local Development

1. **Clone and install dependencies**:
```bash
cd backend
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start services** (MongoDB & Redis):
```bash
# Using Docker Compose
docker-compose up mongo redis -d

# Or install locally and start services
```

4. **Run the application**:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📚 API Documentation

Once running, access the Swagger documentation at:
- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost:3000/api/docs

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PATCH /api/v1/users/profile` - Update profile
- `POST /api/v1/users/profile/image` - Upload profile image
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID

### Cryptocurrencies
- `GET /api/v1/cryptocurrencies` - Get cryptocurrencies with filters
- `GET /api/v1/cryptocurrencies/top` - Get top cryptocurrencies
- `GET /api/v1/cryptocurrencies/search?q=bitcoin` - Search cryptocurrencies
- `GET /api/v1/cryptocurrencies/:id` - Get cryptocurrency by ID
- `DELETE /api/v1/cryptocurrencies/cache` - Clear cache

## 🧪 Testing

### Executar Testes

**IMPORTANTE**: Certifique-se de estar no diretório `backend` antes de executar os testes:

```bash
# Navegar para o diretório backend
cd backend

# Instalar dependências (se ainda não instalou)
npm install

# Unit tests
npm run test

# E2E tests (End-to-End)
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Cobertura de Testes

#### **Unit Tests**
- ✅ `AuthService` - Validação de usuário, login, registro
- ✅ `UserService` - CRUD de usuários, validações

#### **E2E Tests (End-to-End)**
Os testes e2e cobrem **todos os endpoints** da API:

**Authentication**
- ✅ `POST /auth/register` - Registro com sucesso
- ✅ `POST /auth/register` - Falha com email duplicado  
- ✅ `POST /auth/register` - Falha com dados inválidos
- ✅ `POST /auth/login` - Login com sucesso
- ✅ `POST /auth/login` - Falha com credenciais erradas

**Users**
- ✅ `GET /users/profile` - Perfil do usuário
- ✅ `GET /users/profile` - Falha sem autenticação
- ✅ `PATCH /users/profile` - Atualizar perfil
- ✅ `GET /users` - Listar todos os usuários
- ✅ `GET /users/:id` - Usuário por ID

**Cryptocurrencies**
- ✅ `GET /cryptocurrencies` - Listar cryptos
- ✅ `GET /cryptocurrencies/top` - Top cryptos
- ✅ `GET /cryptocurrencies/search` - Buscar cryptos
- ✅ `DELETE /cryptocurrencies/cache` - Limpar cache

**Cache Testing (Redis)**
- ✅ `GET /cache-test/crypto-performance` - Teste de performance
- ✅ `GET /cache-test/performance-comparison` - Comparação automática
- ✅ `GET /cache-test/cache-info` - Info do cache
- ✅ `DELETE /cache-test/clear-cache` - Limpar cache

**Debug**
- ✅ `GET /debug/users` - Debug de usuários

### Configuração de Teste

Os testes e2e usam:
- **MongoDB Memory Server** - Banco em memória isolado
- **JWT Authentication** - Tokens reais para autenticação
- **Eduardo Olimpio** - Dados de teste personalizados
- **Validação completa** - Cenários positivos e negativos

### Troubleshooting

Se os testes falharem:

1. **Verificar diretório**: Certifique-se de estar em `/backend`
2. **Instalar dependências**: `npm install`
3. **Verificar MongoDB**: Testes usam MongoDB Memory Server
4. **Verificar Redis**: Para testes de cache (opcional)
5. **Logs detalhados**: Use `npm run test:e2e -- --verbose`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/erictel |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `COINPAPRIKA_API_URL` | Cryptocurrency API URL | https://api.coinpaprika.com/v1 |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 5242880 |
| `UPLOAD_DEST` | Upload directory | ./uploads |

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  description: String,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Configurable request throttling
- **Input Validation**: Comprehensive DTO validation
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers middleware
- **File Upload Validation**: Type and size restrictions

## 🚀 Deployment

### Docker Production

```bash
# Build production image
docker build -t erictel-backend .

# Run with environment variables
docker run -p 3000:3000 --env-file .env erictel-backend
```

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

## 📈 Performance Features

- **Redis Caching**: Cryptocurrency data cached for 5 minutes
- **Database Indexing**: Optimized queries with proper indexes
- **Compression**: Response compression middleware
- **Connection Pooling**: MongoDB connection optimization

## 🐛 Debugging

```bash
# Debug mode
npm run start:debug

# View logs
docker-compose logs -f app

# MongoDB logs
docker-compose logs -f mongo
```

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Conventional commit messages

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for controllers
- E2E tests for complete workflows

### Error Handling
- Global exception filters
- Structured error responses
- Comprehensive logging

## 🤝 Contributing

1. Follow TypeScript and NestJS best practices
2. Write tests for new features
3. Update documentation
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/api/docs`
2. Review the logs for error details
3. Verify environment configuration
4. Check database connectivity

## 🔄 Health Checks

The application includes health check endpoints:
- **Application**: `GET /health`
- **Database**: Automatic MongoDB connection monitoring
- **Cache**: Redis connection validation
