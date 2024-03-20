import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { getApi, putApi } from "/services/services";

export function DataTablePagination({ table }) {
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    fetchRowsPerPage();
  }, [table]);

  useEffect(() => {
    updateRowsPerPage();
  }, [rowsPerPage]);

  
 

  const fetchRowsPerPage = async () => {
    const url = window.siteUrl + "/wp-json/woocomanage/v1/columns/perPage";
    const response = await getApi(url);
    const newRowsPerPage = Number(response.data[0].reservedData);
    setRowsPerPage(newRowsPerPage);
    table.setPageSize(newRowsPerPage);
  };

  const updateRowsPerPage = async () => {
    const msg = { name: "perPage", reservedData: rowsPerPage };
    const url = window.siteUrl + "/wp-json/woocomanage/v1/columns/" + msg.name;
    try {
      await putApi(url, msg);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between sm:px-2">
      <div className="flex text-sm text-muted-foreground max-sm:hidden">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-2 rtl:flex-row-reverse">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2 rtl:flex-row-reverse">
        <p className="text-sm text-muted-foreground max-sm:hidden">
          Rows per page
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            const newPageSize = Number(value);
            table.setPageSize(newPageSize);
            setRowsPerPage(newPageSize);
          }}
        >
          <SelectTrigger className="h-8 w-fit">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[100, 50, 20, 10].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
