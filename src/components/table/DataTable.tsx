import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (row: TData) => void;
};

export function DataTable<TData, TValue>({ columns, data, onRowClick }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="data-table-wrap">
            <table className="data-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td className="data-table__empty" colSpan={columns.length}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                onClick={() => onRowClick?.(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
