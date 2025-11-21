export interface KpiDefinition {
  id: string;
  label: string;
  value: number | null;
  suffix?: string;
  decimals?: number;
  trendDelta?: number | null;
}

export interface TimeSeriesPoint {
  x: string;
  y: number;
}

export interface TimeSeries {
  id: string;
  label: string;
  data: TimeSeriesPoint[];
}

export interface DistributionData {
  label: string;
  value: number;
}

export type LevelType = "brand" | "franchisee" | "store";

export interface LevelCompareMetric {
  id: string;             // e.g. "policy_adherence_rate"
  label: string;          // e.g. "Policy Adherence Rate"
  unit?: "%" | "$" | "mins" | "";
  brandValue: number;     // aggregated value at brand level
  franchiseeValue: number;// aggregated at franchisee level
  storeValue: number;     // aggregated at store level
}

export const METRIC_OPTIONS = [
  { id: 'total_sessions', label: 'Total Sessions' },
  { id: 'relevant_conversations', label: 'Relevant Conversations' },
  { id: 'pickup_orders', label: 'Pickup Orders' },
  { id: 'order_handle_time', label: 'Order Handle Time' },
  { id: 'average_check', label: 'Average Check' },
  { id: 'policy_adherence_rate', label: 'Policy Adherence Rate' },
  { id: 'upsell_attempt_rate', label: 'Upsell Attempt Rate' },
  { id: 'upsell_success_rate', label: 'Upsell Success Rate' },
  { id: 'friendliness_score', label: 'Friendliness Score' },
  { id: 'guest_sentiment_score', label: 'Guest Sentiment Score' },
  { id: 'brand_greeting_pct', label: 'Brand Greeting %' },
  { id: 'engaged_without_wait_pct', label: 'Engaged w/o wait %' },
  { id: 'personalization_pct', label: 'Personalization %' },
  { id: 'mobile_checkin_pct', label: 'Mobile Check-In %' },
  { id: 'loyalty_check_pct', label: 'Loyalty Check %' },
  { id: 'cart_confirmation_pct', label: 'Cart Confirmation %' },
  { id: 'price_confirmation_pct', label: 'Price Confirmation %' },
  { id: 'overall_upsell_attempt_pct', label: 'Overall Upsell Attempt %' },
  { id: 'overall_upsell_success_pct', label: 'Overall Upsell Success %' },
  { id: 'greeting_upsell_attempt_pct', label: 'Greeting Upsell Attempts %' },
  { id: 'greeting_upsell_success_pct', label: 'Greeting Upsell Success %' },
  { id: 'cart_upsell_attempt_pct', label: 'Cart Upsell Attempts %' },
  { id: 'cart_upsell_success_pct', label: 'Cart Upsell Success %' },
  { id: 'upsize_attempt_pct', label: 'Upsize Attempts %' },
  { id: 'upsize_success_pct', label: 'Upsize Success %' },
  { id: 'tone', label: 'Tone' },
  { id: 'responsiveness', label: 'Responsiveness' },
  { id: 'patience', label: 'Patience' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'disrespectful_language', label: 'Disrespectful Language' },
  { id: 'unfriendly_tone', label: 'Unfriendly Tone' },
  { id: 'repeated_mistakes', label: 'Repeated Mistakes' },
  { id: 'missed_allergy_disclosure', label: 'Missed Allergy Disclosure' },
  { id: 'item_unavailability', label: 'Item Unavailability' },
  { id: 'discount_requested', label: 'Discount Requested' },
  { id: 'coupon_mentioned', label: 'Coupon Mentioned' },
  { id: 'guest_complaint', label: 'Guest Complaint' },
  { id: 'price_objection', label: 'Price Objection' },
];

