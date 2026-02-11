export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url: string
  role: 'user' | 'admin'
  credit_balance: number
  created_at: string
  updated_at: string
}

export interface ThemeColors {
  bg: string
  text: string
  gradient_color: string
  water: string
  parks: string
  road_motorway: string
  road_primary: string
  road_secondary: string
  road_tertiary: string
  road_residential: string
  road_default: string
}

export interface Theme {
  id: string
  slug: string
  display_name: string
  description: string
  colors: ThemeColors
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ResolutionPreset {
  id: string
  name: string
  label: string
  width_inches: number
  height_inches: number
  pixel_width: number
  pixel_height: number
  category: 'print' | 'digital' | 'social'
  sort_order: number
  is_active: boolean
}

export interface PricingConfig {
  id: string
  key: string
  base_credits_per_job: number
  format_multipliers: Record<string, number>
  resolution_multipliers: Record<string, number>
  distance_multipliers: Record<string, number>
  updated_at: string
}

export interface CreditPackage {
  id: string
  name: string
  description: string
  credits_amount: number
  price_cents: number
  currency: string
  stripe_price_id: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'usage' | 'refund' | 'admin_adjustment'
  description: string
  reference_id: string | null
  balance_after: number
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  credit_package_id: string
  stripe_session_id: string
  stripe_payment_intent_id: string
  amount_cents: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}

export interface PosterJob {
  id: string
  user_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  city: string
  country: string
  display_city: string
  display_country: string
  theme_slug: string
  distance: number
  width_inches: number
  height_inches: number
  output_format: 'png' | 'svg' | 'pdf'
  font_family: string
  latitude: number | null
  longitude: number | null
  credits_cost: number
  file_path: string
  thumbnail_path: string
  error_message: string
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export interface SystemSetting {
  key: string
  value: unknown
  updated_by: string | null
  updated_at: string
}
