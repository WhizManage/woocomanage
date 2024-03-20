import { cn } from "@/lib/utils";
import { putApi } from "/services/services";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  ClosePopover,
} from "@components/ui/popover-portal";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { CheckCircle, CheckIcon } from "lucide-react";
import { toast } from "sonner";

function DisplayColumns({ table, plusButton }) {
  const handleUpdateView = async () => {
    const columnsVisibility = {};
    table.getAllColumns().forEach((column) => {
      columnsVisibility[column.id] = column.getIsVisible();
    });
    const msg = { name: "columnName", reservedData: columnsVisibility };
    const url = window.siteUrl + "/wp-json/woocomanage/v1/columns/" + msg.name;
    try {
      await putApi(url, msg);
      toast(
        <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
          <CheckCircle className="w-5 h-5 text-green-500" />
          New view has been saved successfully
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {plusButton ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 pb-1.5 data-[state=open]:bg-accent text-md text-slate-600 flex items-center rounded-full hover:bg-slate-500/10 text-3xl font-light"
          >
            +
          </Button>
        ) : (
          <Button variant="outline" className="flex gap-2">
            <EyeNoneIcon className="h-3.5 w-3.5" />
            Columns
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] max-h-fit overflow-hidden p-0 mr-4 rtl:ml-4 dark:!bg-gray-800"
        align="start"
      >
        <Command className="p-4 pb-0.5 dark:!bg-gray-800">
          <div className="pb-2 flex justify-between items-center">
            <h3 className="text-lg pl-1 dark:text-gray-400">Display columns</h3>
            <ClosePopover asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-500 dark:text-slate-400"
                onClick={handleUpdateView}
              >
                Save as default
              </Button>
            </ClosePopover>
          </div>
          <CommandInput
            placeholder="Find column to show/hide"
            className="!border-none !ring-0"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="All columns">
              <CommandItem onSelect={() => table.toggleAllColumnsVisible()}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    table.getIsAllColumnsVisible()
                      ? "bg-primary text-white"
                      : "opacity-50 [&_svg]:invisible dark:!bg-slate-400"
                  )}
                >
                  <CheckIcon className={cn("h-4 w-4")} />
                </div>
                <span className="pr-2">
                  {table.getIsAllColumnsVisible()
                    ? "Hide All Columns"
                    : "Show All Columns"}
                </span>
                <span className="ml-auto text-muted-foreground">
                  {table.getVisibleFlatColumns().length} Selected
                </span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Item columns">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const isSelected = column.getIsVisible();
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() => {
                        column.toggleVisibility(!isSelected);
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-white"
                            : "opacity-50 [&_svg]:invisible dark:!bg-slate-400"
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
                      </div>
                      <span className="pr-2">{column.id}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default DisplayColumns;
