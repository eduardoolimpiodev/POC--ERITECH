# 🚀 Guia de Testes Redis - Performance e Cache

Este guia mostra como testar o Redis e medir a performance do cache usando Insomnia.

## 📋 Pré-requisitos

1. **Iniciar a aplicação:**
```bash
npm run start:dev
```

2. **Verificar se Redis está rodando:**
```bash
# No PowerShell (Windows)
docker ps | findstr redis

# Conectar ao Redis (substitua <redis-container-name> pelo nome real)
docker exec -it erictel-redis redis-cli
```

## 🧪 Endpoints de Teste no Insomnia

### 1. **Teste de Performance Básico**
```
GET http://localhost:3000/api/v1/cache-test/crypto-performance?limit=10
```
- **Primeira chamada**: Cache MISS (mais lenta)
- **Segunda chamada**: Cache HIT (mais rápida)
- **Resposta inclui**: tempo de resposta, contagem de dados, timestamp

### 2. **Comparação de Performance Automática**
```
GET http://localhost:3000/api/v1/cache-test/performance-comparison
```
- Limpa o cache automaticamente
- Faz 2 chamadas consecutivas
- Mostra comparação de performance
- **Métricas**: percentual de melhoria, tempo economizado, fator de velocidade

### 3. **Informações do Cache**
```
GET http://localhost:3000/api/v1/cache-test/cache-info
```
- Mostra informações sobre o cache Redis
- Lista chaves armazenadas (se disponível)
- Útil para debug

### 4. **Limpar Cache**
```
DELETE http://localhost:3000/api/v1/cache-test/clear-cache
```
- Limpa todo o cache Redis
- Use para forçar cache MISS nos próximos testes

## 📊 Como Medir Performance

### Teste Manual Simples:
1. **Limpe o cache**: `DELETE /cache-test/clear-cache`
2. **Primeira chamada**: `GET /cache-test/crypto-performance?limit=10`
   - ⚡ **CACHE MISS** - Tempo: ~500-2000ms
3. **Segunda chamada**: `GET /cache-test/crypto-performance?limit=10`
   - 🚀 **CACHE HIT** - Tempo: ~5-50ms

### Teste Automático:
1. **Uma chamada**: `GET /cache-test/performance-comparison`
   - Retorna comparação completa automaticamente

## 🔍 Logs da Aplicação

Monitore os logs da aplicação para ver:
```
🚀 CACHE HIT - Response time: 15ms - Key: cryptos:all:{"limit":10}
⚡ CACHE MISS - API call completed in 1250ms - Cached 10 cryptocurrencies
```

## 📈 Resultados Esperados

| Tipo | Tempo Típico | Fonte |
|------|--------------|-------|
| **Cache HIT** | 5-50ms | Redis |
| **Cache MISS** | 500-2000ms | API Externa |
| **Melhoria** | 90-95% | Cache vs API |

## 🛠️ Comandos Redis Úteis

```bash
# Conectar ao Redis
docker exec -it erictel-redis redis-cli

# Comandos dentro do Redis CLI:
ping                    # Testa conexão
keys *                  # Ver todas as chaves
keys "cryptos:*"        # Ver chaves de crypto
ttl <chave>            # Ver tempo de vida
get <chave>            # Ver valor
flushall               # Limpar tudo (cuidado!)
info memory            # Info de memória
info stats             # Estatísticas
```

## 🎯 Cenários de Teste

### Cenário 1: Performance Básica
1. Limpar cache
2. Chamar endpoint de crypto 2x
3. Comparar tempos de resposta

### Cenário 2: Diferentes Parâmetros
```
GET /cache-test/crypto-performance?limit=5
GET /cache-test/crypto-performance?limit=10
GET /cache-test/crypto-performance?limit=20
```
Cada parâmetro diferente cria uma chave de cache diferente.

### Cenário 3: Cache Expiration
1. Fazer chamada (cria cache)
2. Aguardar 5 minutos (TTL = 300s)
3. Fazer nova chamada (cache expirado = MISS)

## 🚨 Troubleshooting

### Redis não conecta:
```bash
# Verificar containers
docker ps

# Iniciar Redis se necessário
docker-compose up redis -d
```

### Cache não funciona:
1. Verificar logs da aplicação
2. Testar conexão Redis: `GET /cache-test/cache-info`
3. Verificar variáveis de ambiente (.env)

### Performance não melhora:
1. Verificar se Redis está rodando
2. Limpar cache e testar novamente
3. Verificar logs para CACHE HIT/MISS

## 📝 Exemplo de Resposta

```json
{
  "success": true,
  "results": [
    {
      "call": 1,
      "type": "CACHE MISS",
      "responseTime": "1247ms",
      "dataCount": 5
    },
    {
      "call": 2,
      "type": "CACHE HIT",
      "responseTime": "12ms",
      "dataCount": 5
    }
  ],
  "performance": {
    "improvementPercentage": "99.0%",
    "timeSaved": "1235ms",
    "speedupFactor": "103.9x"
  }
}
```

## 🎉 Próximos Passos

1. Teste diferentes endpoints de cryptocurrency
2. Experimente com diferentes TTLs
3. Monitore uso de memória do Redis
4. Teste sob carga com múltiplas requisições simultâneas
