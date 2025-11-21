import { ExploreRow, ColumnDef } from '../../types/tables';
import { StoreTable } from './StoreTable';

interface ExploreTableProps {
  rows: ExploreRow[];
}

export function ExploreTable({ rows }: ExploreTableProps) {
  const columns: ColumnDef<ExploreRow>[] = [
    {
      id: 'datetime',
      header: 'Date/Time',
      accessor: (row) => new Date(row.call_datetime).toLocaleString(),
    },
    {
      id: 'brand',
      header: 'Brand',
      accessor: (row) => row.brand,
    },
    {
      id: 'franchise_id',
      header: 'Franchise ID',
      accessor: (row) => row.franchise_id,
    },
    {
      id: 'store_id',
      header: 'Store ID',
      accessor: (row) => row.store_id,
    },
    {
      id: 'channel',
      header: 'Channel',
      accessor: (row) => row.channel,
    },
    {
      id: 'engagement_mode',
      header: 'Engagement Mode',
      accessor: (row) => row.engagement_mode,
    },
    {
      id: 'total_sessions',
      header: 'Total Sessions',
      accessor: (row) => row.total_sessions,
    },
    {
      id: 'order_handle_time',
      header: 'Order Handle Time',
      accessor: (row) => `${row.order_handle_time.toFixed(1)} mins`,
    },
    {
      id: 'average_check',
      header: 'Average Check',
      accessor: (row) => `$${row.average_check.toFixed(2)}`,
    },
    {
      id: 'policy_adherence_rate',
      header: 'Policy Adherence Rate',
      accessor: (row) => `${row.policy_adherence_rate.toFixed(1)}%`,
    },
    {
      id: 'upsell_attempt_rate',
      header: 'Upsell Attempt %',
      accessor: (row) => `${row.upsell_attempt_rate.toFixed(1)}%`,
    },
    {
      id: 'upsell_success_rate',
      header: 'Upsell Success %',
      accessor: (row) => `${row.upsell_success_rate.toFixed(1)}%`,
    },
    {
      id: 'friendliness_score',
      header: 'Friendliness Score',
      accessor: (row) => row.friendliness_score.toFixed(1),
    },
    {
      id: 'guest_sentiment_score',
      header: 'Guest Sentiment Score',
      accessor: (row) => row.guest_sentiment_score.toFixed(1),
    },
    {
      id: 'brand_greeting',
      header: 'Brand Greeting',
      accessor: (row) => row.brand_greeting,
    },
    {
      id: 'engaged_without_wait',
      header: 'Engaged w/o wait',
      accessor: (row) => row.engaged_without_wait,
    },
    {
      id: 'personalization',
      header: 'Personalization',
      accessor: (row) => row.personalization,
    },
    {
      id: 'mobile_checkin',
      header: 'Mobile Check-In',
      accessor: (row) => row.mobile_checkin,
    },
    {
      id: 'loyalty_check',
      header: 'Loyalty Check',
      accessor: (row) => row.loyalty_check,
    },
    {
      id: 'cart_confirmation',
      header: 'Cart Confirmation',
      accessor: (row) => row.cart_confirmation,
    },
    {
      id: 'price_confirmation',
      header: 'Price Confirmation',
      accessor: (row) => row.price_confirmation,
    },
    {
      id: 'disrespectful_language',
      header: 'Disrespectful Language',
      accessor: (row) => row.disrespectful_language,
    },
    {
      id: 'unfriendly_tone',
      header: 'Unfriendly Tone',
      accessor: (row) => row.unfriendly_tone,
    },
    {
      id: 'repeated_mistakes',
      header: 'Repeated Mistakes',
      accessor: (row) => row.repeated_mistakes,
    },
    {
      id: 'missed_allergy_disclosure',
      header: 'Missed Allergy Disclosure',
      accessor: (row) => row.missed_allergy_disclosure,
    },
    {
      id: 'item_unavailability',
      header: 'Item Unavailability',
      accessor: (row) => row.item_unavailability,
    },
    {
      id: 'discount_requested',
      header: 'Discount Requested',
      accessor: (row) => row.discount_requested,
    },
    {
      id: 'coupon_mentioned',
      header: 'Coupon Mentioned',
      accessor: (row) => row.coupon_mentioned,
    },
    {
      id: 'guest_complaint',
      header: 'Guest Complaint',
      accessor: (row) => row.guest_complaint,
    },
    {
      id: 'price_objection',
      header: 'Price Objection',
      accessor: (row) => row.price_objection,
    },
    {
      id: 'recording',
      header: 'Recording',
      accessor: (row) => (
        <a
          href={row.recording_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Listen
        </a>
      ),
    },
  ];

  return <StoreTable columns={columns} data={rows} title="Explore All Sessions" />;
}

