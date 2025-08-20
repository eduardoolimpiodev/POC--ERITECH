<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ crypto.name }}</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <div class="crypto-details">
          <div class="detail-row">
            <span class="label">Símbolo:</span>
            <span class="value symbol">{{ crypto.symbol }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Ranking:</span>
            <span class="value">#{{ crypto.rank }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Tipo:</span>
            <span class="value">
              <span class="type-badge" :class="crypto.type">
                {{ crypto.type }}
              </span>
            </span>
          </div>

          <div class="detail-row" v-if="crypto.description">
            <span class="label">Descrição:</span>
            <span class="value description">{{ crypto.description }}</span>
          </div>

          <div class="detail-row" v-if="crypto.website">
            <span class="label">Website:</span>
            <span class="value">
              <a :href="crypto.website" target="_blank" class="website-link">
                {{ crypto.website }}
              </a>
            </span>
          </div>

          <div class="detail-row" v-if="crypto.started_at">
            <span class="label">Data de Criação:</span>
            <span class="value">{{ formatDate(crypto.started_at) }}</span>
          </div>

          <div class="detail-row" v-if="crypto.development_status">
            <span class="label">Status de Desenvolvimento:</span>
            <span class="value">{{ crypto.development_status }}</span>
          </div>

          <div class="detail-row" v-if="crypto.hardware_wallet">
            <span class="label">Hardware Wallet:</span>
            <span class="value">{{ crypto.hardware_wallet ? 'Sim' : 'Não' }}</span>
          </div>

          <div class="detail-row" v-if="crypto.proof_type">
            <span class="label">Tipo de Prova:</span>
            <span class="value">{{ crypto.proof_type }}</span>
          </div>

          <div class="detail-row" v-if="crypto.org_structure">
            <span class="label">Estrutura Organizacional:</span>
            <span class="value">{{ crypto.org_structure }}</span>
          </div>
        </div>

        <div class="tags-section" v-if="crypto.tags && crypto.tags.length">
          <h3>Tags</h3>
          <div class="tags-container">
            <span
              v-for="tag in crypto.tags"
              :key="tag.id"
              class="tag"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>

        <div class="team-section" v-if="crypto.team && crypto.team.length">
          <h3>Equipe</h3>
          <div class="team-grid">
            <div
              v-for="member in crypto.team"
              :key="member.id"
              class="team-member"
            >
              <div class="member-name">{{ member.name }}</div>
              <div class="member-position">{{ member.position }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="close-modal-btn">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cryptocurrency } from '@/types'

interface Props {
  crypto: Cryptocurrency
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: #2a2a2a;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid #404040;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #404040;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 1.8rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #cccccc;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #404040;
  color: #ffffff;
}

.modal-body {
  padding: 0 24px;
}

.crypto-details {
  margin-bottom: 30px;
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.label {
  font-weight: 600;
  color: #ffffff;
  min-width: 140px;
  margin-right: 16px;
}

.value {
  color: #cccccc;
  flex: 1;
}

.value.symbol {
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
}

.value.description {
  line-height: 1.5;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.type-badge.coin {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.token {
  background: #f3e5f5;
  color: #7b1fa2;
}

.website-link {
  color: #667eea;
  text-decoration: none;
  word-break: break-all;
}

.website-link:hover {
  text-decoration: underline;
}

.tags-section,
.team-section {
  margin-bottom: 30px;
}

.tags-section h3,
.team-section h3 {
  margin: 0 0 16px 0;
  color: #ffffff;
  font-size: 1.2rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #404040;
  color: #cccccc;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.team-member {
  background: #333333;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.member-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.member-position {
  color: #cccccc;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #404040;
  text-align: center;
}

.close-modal-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-modal-btn:hover {
  background: #5a6fd8;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .label {
    min-width: auto;
    margin-right: 0;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
