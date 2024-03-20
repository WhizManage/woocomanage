import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultFilters } from "@/data/defaultFilters";
import { cn } from "@/lib/utils";
import { Checkbox } from "@components/ui/checkbox";
import { ChevronRight, ChevronsRight, UnfoldHorizontal } from "lucide-react";
import { DataTablePagination } from "../footer/DataTablePagination";
import DisplayColumns from "../header/DisplayColumns";
import StatusBarFilter from "../header/StatusBarFilter";
import TopPanel from "../header/TopPanel";
import RowItem from "./RowItem";
import SkeletonTable from "./SkeletonTable";
import Toolbar from "./Toolbar";

export function DataTable({
  data,
  setData,
  columns,
  fetchData,
  isLoading,
  isTrash,
  setIsTrash,
  columnsToVisible,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState(columnsToVisible);
  const [rowSelection, setRowSelection] = React.useState({});
  const [enableFilters, setEnableFilters] = React.useState(defaultFilters);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState({});
  const [editingRows, setEditingRows] = React.useState(new Set());
  const [editAll, setEditAll] = React.useState(false);
  const [editedItems, setEditedItems] = React.useState([]);

  const toggleEdit = (row, cancel) => {
    const rowId = row.id;
    setEditingRows((prevEditingRows) => {
      const newEditingRows = new Set(prevEditingRows);
      if (newEditingRows.has(rowId)) {
        newEditingRows.delete(rowId);
        if (cancel) {
          row.original = { ...row.temp };
          delete row.temp;
        }
      } else {
        newEditingRows.add(rowId);
        // יצירת גיבוי של האובייקט הישן לצורך שחזור במקרה של ביטול פעולת עריכה
        row.temp = { ...row.original };
      }
      return newEditingRows;
    });
  };

  const columnResizeMode = "onChange";
  const columnResizeDirection = window.user_local == "he_IL" ? "rtl" : "ltr";

  const globalFilterFn = (row, id, filterValue) => {
    const searchValue = filterValue.toLowerCase();

    const checkValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchValue);
      }
      if (Array.isArray(value)) {
        return value.some((element) => checkValue(element));
      }
      if (typeof value === "object") {
        return Object.values(value).some((innerValue) =>
          checkValue(innerValue)
        );
      }
      return false;
    };

    return Object.values(row.original).some((value) => checkValue(value));
  };

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
    globalFilterFn: globalFilterFn,
  });

  React.useEffect(() => {
    setColumnVisibility(columnsToVisible);
  }, [columnsToVisible]);

  React.useEffect(() => {
    if (!editAll && editingRows.size === 0) {
      setEditedItems([]);
    }
  }, [editAll, editingRows]);
  
// פונקציה שגורמת לכך שכאשר בוחרים את כל תתי המוצר תבחר גם שורת האב
  // React.useEffect(() => {
  //   const { rows } = table.getRowModel();
  //   rows.forEach((row) => {
  //     const allSuRowsSelected = row.subRows.length > 0 && row.subRows.every(({ getIsSelected }) => getIsSelected());
  //     if (allSuRowsSelected) {
  //       row.toggleSelected(true);
  //     }
  //   });
  // }, [rowSelection, table]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <TopPanel
        table={table}
        enableFilters={enableFilters}
        setEnableFilters={setEnableFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        fetchData={fetchData}
        isTrash={isTrash}
        setIsTrash={setIsTrash}
        editAll={editAll}
        setEditAll={setEditAll}
        setEditingRows={setEditingRows}
        editedItems={editedItems}
        setEditedItems={setEditedItems}
        data={data}
        setData={setData}
      />
      <StatusBarFilter
        enableFilters={enableFilters}
        setColumnFilters={setColumnFilters}
        data={data}
      />
      <div className="">
        <Toolbar
          setRowSelection={setRowSelection}
          table={table}
          fetchData={fetchData}
          isTrash={isTrash}
        />
        <Table
          style={{
            width:
              window.innerWidth > 640 ? table.getCenterTotalSize() : "auto",
          }}
        >
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead
                  className="!z-30 !min-h-10 pl-4 w-full group flex items-center justify-center sticky left-0 rtl:right-0 
                dark:bg-slate-900 
                [mask-image:_linear-gradient(to_right,transparent_80,_black_0px,_black_calc(100%-8px),transparent_100%)] 
                rtl:[mask-image:_linear-gradient(to_left,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)]"
                >
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                      table.toggleAllPageRowsSelected(!!value);
                    }}
                    aria-label="Select all"
                    className="m-auto"
                  />
                </TableHead>
                <TableHead className="!pl-4 pt-2 w-6">
                  <button
                    {...{
                      onClick: table.getToggleAllRowsExpandedHandler(),
                    }}
                  >
                    {table.getIsAllRowsExpanded() ? (
                      <ChevronsRight className="rotate-90 w-5 h-5 text-primary" />
                    ) : (
                      <ChevronsRight className="w-5 h-5 text-primary rtl:rotate-180" />
                    )}
                  </button>
                </TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="group shadow-sm !min-h-10"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <UnfoldHorizontal
                        className={cn(
                          header.column.getIsResizing()
                            ? "text-primary opacity-100"
                            : "text-slate-800 dark:text-slate-100 opacity-0 group-hover:opacity-50",
                          "absolute top-0 h-full w-4 !cursor-ew-resize select-none touch-none",
                          window.user_local == "he_IL" ? "left-0" : "right-0"
                        )}
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                        }}
                      />
                    </TableHead>
                  );
                })}
                {!editAll && (
                  <TableHead
                    className="!z-30 !min-h-10 w-full group flex items-center justify-center sticky right-0 rtl:left-0 dark:bg-slate-900 
                [mask-image:_linear-gradient(to_left,transparent_80,_black_0px,_black_calc(100%-8px),transparent_100%)] 
                rtl:[mask-image:_linear-gradient(to_right,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)]"
                  >
                    <DisplayColumns table={table} plusButton />
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonTable />
            ) : table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <RowItem
                    row={row}
                    isEditing={editingRows.has(row.id)}
                    toggleEdit={toggleEdit}
                    editAll={editAll}
                    editedItems={editedItems}
                    setEditedItems={setEditedItems}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
