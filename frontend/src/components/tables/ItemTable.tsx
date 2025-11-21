import { ItemRow, ColumnDef } from '../../types/tables';
import { StoreTable } from './StoreTable';

interface ItemTableProps {
  items: ItemRow[];
  title: string;
}

export function ItemTable({ items, title }: ItemTableProps) {
  const columns: ColumnDef<ItemRow>[] = [
    {
      id: 'item',
      header: 'Item',
      accessor: (row) => row.item_name,
    },
    {
      id: 'attempts',
      header: 'Attempts',
      accessor: (row) => row.attempts,
    },
    {
      id: 'success',
      header: 'Success',
      accessor: (row) => row.success,
    },
    {
      id: 'success_pct',
      header: 'Success %',
      accessor: (row) => {
        const pct = row.attempts > 0 ? (row.success / row.attempts) * 100 : 0;
        return `${pct.toFixed(1)}%`;
      },
    },
  ];

  return <StoreTable columns={columns} data={items} title={title} />;
}

