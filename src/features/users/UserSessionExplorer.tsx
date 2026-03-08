import { useEffect, useState, useMemo, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectOption } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { generateUsers, type User } from '@/services/dataGenerator'
import { Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react'

export function UserSessionExplorer() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Generate users efficiently on mount
  useEffect(() => {
    setLoading(true)
    
    // Use setTimeout to allow UI to render loading state first
    const timer = setTimeout(() => {
      const generatedUsers = generateUsers(10000)
      setUsers(generatedUsers)
      setLoading(false)
      
      console.log(`✅ Loaded ${generatedUsers.length.toLocaleString()} users`)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatar}
              alt={row.original.name}
              className="h-8 w-8 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className="text-sm">{row.original.location}</div>
        ),
      },
      {
        accessorKey: 'sessionTime',
        header: 'Session Time',
        cell: ({ row }) => {
          const minutes = Math.floor(row.original.sessionTime / 60)
          const seconds = row.original.sessionTime % 60
          return (
            <div className="font-mono text-sm">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          )
        },
      },
      {
        accessorKey: 'device',
        header: 'Device',
        cell: ({ row }) => (
          <div className="text-sm">{row.original.device}</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'active'
                ? 'success'
                : row.original.status === 'idle'
                ? 'warning'
                : 'secondary'
            }
          >
            {row.original.status}
          </Badge>
        ),
        filterFn: (row, id, value) => row.getValue(id) === value,
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ row }) => (
          <Badge variant="outline" className="uppercase">
            {row.original.plan}
          </Badge>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters: statusFilter ? [{ id: 'status', value: statusFilter }] : [],
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 50, // Larger page size for better UX
      },
    },
    // Performance optimizations
    autoResetPageIndex: false,
    autoResetExpanded: false,
  })

  const currentPage = table.getRowModel().rows

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">User Session Explorer</h1>
          <p className="mt-2 text-muted-foreground">
            Loading users...
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">User Session Explorer</h1>
        <p className="mt-2 text-muted-foreground">
          Exploring {users.length.toLocaleString()} users
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-[160px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <SelectOption value="">All Status</SelectOption>
                <SelectOption value="active">Active</SelectOption>
                <SelectOption value="idle">Idle</SelectOption>
                <SelectOption value="offline">Offline</SelectOption>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-muted-foreground">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 opacity-30" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {currentPage.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      style={{
                        animation: `fadeIn 0.2s ease-out ${index * 0.02}s both`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length.toLocaleString()} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
