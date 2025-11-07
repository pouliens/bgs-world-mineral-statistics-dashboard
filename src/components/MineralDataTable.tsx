import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpDown, Download } from 'lucide-react';
import type { MineralProperties } from '@/types/minerals';

interface MineralDataTableProps {
  data: MineralProperties[];
  onExport: () => void;
}

export function MineralDataTable({ data, onExport }: MineralDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'YEAR', desc: true }]);

  const columns: ColumnDef<MineralProperties>[] = [
    {
      accessorKey: 'YEAR',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'COUNTRY_NAME',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Country
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.COUNTRY_NAME || row.original.COUNTRY || '-';
      },
    },
    {
      accessorKey: 'PROD_AMOUNT',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Production
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.PROD_AMOUNT;
        const unit = row.original.PROD_UNIT;
        return value ? `${value.toLocaleString()}${unit ? ' ' + unit : ''}` : '-';
      },
    },
    {
      accessorKey: 'IMP_AMOUNT',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Imports
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.IMP_AMOUNT;
        const unit = row.original.IMP_UNIT;
        return value ? `${value.toLocaleString()}${unit ? ' ' + unit : ''}` : '-';
      },
    },
    {
      accessorKey: 'EXP_AMOUNT',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Exports
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.EXP_AMOUNT;
        const unit = row.original.EXP_UNIT;
        return value ? `${value.toLocaleString()}${unit ? ' ' + unit : ''}` : '-';
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <div>
          <CardTitle className="text-lg font-bold">Mineral Data</CardTitle>
          <CardDescription>Detailed records of all mineral statistics</CardDescription>
        </div>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-[#002E40]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-[#002E40] border-b-0">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-white font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-[#002E40]/5 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
