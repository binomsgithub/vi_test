import { AlertRow, ColumnDef } from '../../types/tables';
import { StoreTable } from './StoreTable';

interface AlertsTableProps {
  alerts: AlertRow[];
}

export function AlertsTable({ alerts }: AlertsTableProps) {
  const columns: ColumnDef<AlertRow>[] = [
    {
      id: 'store_id',
      header: 'Store ID',
      accessor: (row) => row.store_id,
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
      id: 'manager_summary',
      header: 'Manager Summary',
      accessor: (row) => (
        <span className="max-w-xs truncate block" title={row.manager_summary}>
          {row.manager_summary}
        </span>
      ),
      width: '200px',
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

  return <StoreTable columns={columns} data={alerts} title="Coaching Queue" />;
}

