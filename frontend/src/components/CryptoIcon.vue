<template>
  <div class="crypto-icon" :class="symbol.toLowerCase()">
    <div class="icon-circle" :style="{ backgroundColor: getIconColor(symbol) }">
      <span class="icon-text">{{ getIconText(symbol) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  symbol: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const getIconColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    'BTC': '#f7931a',
    'ETH': '#627eea',
    'LTC': '#345d9d',
    'XRP': '#23292f',
    'EOS': '#000000',
    'ADA': '#0033ad',
    'DOT': '#e6007a',
    'LINK': '#2a5ada',
    'BNB': '#f3ba2f',
    'SOL': '#9945ff'
  }
  return colors[symbol.toUpperCase()] || '#666666'
}

const getIconText = (symbol: string): string => {
  return symbol.slice(0, 2).toUpperCase()
}
</script>

<style scoped>
.crypto-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.icon-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.crypto-icon.small .icon-circle {
  width: 24px;
  height: 24px;
}

.crypto-icon.small .icon-text {
  font-size: 10px;
}

.crypto-icon.large .icon-circle {
  width: 56px;
  height: 56px;
}

.crypto-icon.large .icon-text {
  font-size: 18px;
}
</style>
