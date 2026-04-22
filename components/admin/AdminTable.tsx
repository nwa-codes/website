import type { JSX, ReactNode } from 'react';

import styles from './AdminTable.module.css';

type AdminTableColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  keyField: keyof T;
};

/**
 * Generic admin table with thead/tbody structure.
 * Renders a custom cell via `render` when provided, otherwise falls back to String coercion.
 * Shows an empty state row when there are no records.
 */
export const AdminTable = <T,>({ columns, rows, keyField }: AdminTableProps<T>): JSX.Element => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.th}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row[keyField])} className={styles.tr}>
                {columns.map((column) => (
                  <td key={column.key} className={styles.td}>
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
