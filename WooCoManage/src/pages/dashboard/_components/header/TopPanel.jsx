import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Filter, Trash2, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import DisplayColumns from "./DisplayColumns";
import EditAll from "./EditAll";
import AddProduct from "./add/AddProduct";
function TopPanel({
  table,
  enableFilters,
  setEnableFilters,
  globalFilter,
  setGlobalFilter,
  fetchData,
  isTrash,
  setIsTrash,
  editAll,
  setEditAll,
  setEditingRows,
  editedItems,
  setEditedItems,
  data,
  setData,
}) {
  useEffect(() => {
    fetchData();
  }, [isTrash]);
  return (
    <div>
      <div className="flex flex-wrap-reverse items-center justify-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-2 sm:px-4 flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Array.isArray(enableFilters)
                ? enableFilters.map((column) => (
                    <DropdownMenuCheckboxItem
                      className="capitalize"
                      checked={
                        enableFilters.find(
                          (filter) => filter.column === column.column
                        ).enable
                      }
                      onCheckedChange={() => {
                        setEnableFilters((currentFilters) =>
                          currentFilters.map((filter) =>
                            filter.column === column.column
                              ? {
                                  ...filter,
                                  enable: !filter.enable,
                                }
                              : filter
                          )
                        );
                      }}
                    >
                      {column.column}
                    </DropdownMenuCheckboxItem>
                  ))
                : console.log(enableFilters)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className={cn(
              isTrash
                ? "ring-primary ring-1 ring-offset-1 ring-offset-white dark:!ring-offset-slate-700 !bg-fuchsia-50/50 dark:!bg-slate-900/70"
                : "",
              "px-2 sm:px-4 flex gap-2"
            )}
            onClick={() => {
              setIsTrash((isTrash) => !isTrash);
            }}
          >
            {isTrash ? (
              <Undo2 className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isTrash ? "Back to Products" : "Trash"}
          </Button>
          <EditAll
            table={table}
            data={data}
            setData={setData}
            editAll={editAll}
            setEditAll={setEditAll}
            setEditingRows={setEditingRows}
            editedItems={editedItems}
            setEditedItems={setEditedItems}
          />
          <DisplayColumns table={table} />
          <div className="relative h-10 w-60 border rounded-lg flex gap-1 items-center px-2 dark:bg-slate-700">
            <IoIosSearch className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            <Input
              placeholder="Search..."
              type="search"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="!border-none !ring-0 text-gray-500 dark:!text-gray-300 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
            />
          </div>
        </div>
        <div className="sm:ml-auto flex rtl:flex-row-reverse rtl:sm:mr-auto rtl:ml-0">
          <AddProduct fetchData={fetchData} />
          {/* <Button
            variant="outline"
            className="rounded-r-none flex gap-2 border-r-0"
          >
            <TfiImport className="ml-2 h-4 w-4" />
            Import
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default TopPanel;
