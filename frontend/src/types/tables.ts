import { ReactNode } from 'react';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  width?: string;
}

export interface StoreRow {
  store_id: string;
  franchisee_id?: string;
  [key: string]: any;
}

export interface ItemRow {
  item_name: string;
  attempts: number;
  success: number;
}

export interface AlertRow {
  call_id: string;
  store_id: string;
  disrespectful_language: string;
  unfriendly_tone: string;
  repeated_mistakes: string;
  missed_allergy_disclosure: string;
  item_unavailability: string;
  discount_requested: string;
  coupon_mentioned: string;
  guest_complaint: string;
  price_objection: string;
  manager_summary: string;
  recording_url: string;
}

export interface ExploreRow {
  call_id: string;
  call_datetime: string;
  brand: string;
  owner: string;
  franchise_id: string;
  store_id: string;
  channel: string;
  engagement_mode: string;
  total_sessions: number;
  order_handle_time: number;
  average_check: number;
  policy_adherence_rate: number;
  upsell_attempt_rate: number;
  upsell_success_rate: number;
  friendliness_score: number;
  guest_sentiment_score: number;
  brand_greeting: string;
  engaged_without_wait: string;
  personalization: string;
  mobile_checkin: string;
  loyalty_check: string;
  cart_confirmation: string;
  price_confirmation: string;
  disrespectful_language: string;
  unfriendly_tone: string;
  repeated_mistakes: string;
  missed_allergy_disclosure: string;
  item_unavailability: string;
  discount_requested: string;
  coupon_mentioned: string;
  guest_complaint: string;
  price_objection: string;
  recording_url: string;
}

