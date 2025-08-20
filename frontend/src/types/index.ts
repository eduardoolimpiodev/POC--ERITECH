export interface User {
  id: string
  email: string
  name: string
  description?: string
  profileImage?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  description?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface Cryptocurrency {
  id: string
  name: string
  symbol: string
  rank: number
  price_usd: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  market_cap_usd: number
  volume_24h_usd: number
  circulating_supply: number
  total_supply?: number
  max_supply?: number
  last_updated: string
  type?: string
}

export interface CryptocurrencyDetails extends Cryptocurrency {
  type: string
  description: string
  open_source: boolean
  started_at: string
  development_status: string
  hardware_wallet: boolean
  proof_type: string
  org_structure: string
  hash_algorithm: string
  links: {
    explorer?: string[]
    facebook?: string[]
    reddit?: string[]
    source_code?: string[]
    website?: string[]
    youtube?: string[]
  }
  whitepaper?: {
    link: string
    thumbnail: string
  }
  first_data_at: string
  last_data_at: string
}

export interface Tag {
  id: string
  name: string
}

export interface TeamMember {
  id: string
  name: string
  position: string
}

export interface CryptocurrencyFilters {
  name?: string
  symbol?: string
  type?: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}
