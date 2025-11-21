import { ColumnDef } from '../../types/tables';

interface StoreTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  title?: string;
}

export function StoreTable<T extends Record<string, any>>({ columns, data, title }: StoreTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {title && <h3 className="text-lg font-semibold p-4 border-b border-gray-200">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

