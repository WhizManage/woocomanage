import { cn } from "@/lib/utils";
import { Checkbox } from "@components/ui/checkbox";
import { TableCell, TableRow } from "@components/ui/table";
import { flexRender } from "@tanstack/react-table";
import {
  CheckCircle,
  ChevronsRight,
  RefreshCcw,
  Save,
  XCircle,
  BlocksIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { toast } from "sonner";
import { putApi } from "/services/services";
function RowItem({
  row,
  isEditing,
  toggleEdit,
  editAll,
  editedItems,
  setEditedItems,
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (editAll) toggleEdit(row);
  }, [editAll]);
  const updateProduct = async (row) => {
    setIsLoading(true);
    const _bodyData = row.original;
    delete _bodyData.attributes;
    const url =
    _bodyData.has_options || _bodyData.has_options == false
      ? `${window.siteUrl}/wp-json/wc/v3/products/${_bodyData.id}`
      :` ${window.siteUrl}/wp-json/wc/v3/products/${_bodyData.parent_id}/variations/${_bodyData.id}`;
      console.log(url);
    await putApi(url, _bodyData)
      .then((data) => {
        toast(
          <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-400 !border-l-4 !border-l-green-500 rounded-md flex gap-4 items-center justify-start">
            <CheckCircle className="w-5 h-5 text-green-500" />
            The product has been updated successfully
            {/* {console.log(data.data)} */}
          </div>,
          { duration: 5000 }
        );
        toggleEdit(row);
      })
      .catch((error) => {
        setIsLoading(false);
        toast(
          <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
            <XCircle className="w-5 h-5 text-red-500" />
            {error?.response?.data?.message || "Failed to update product"}
          </div>,
          { duration: 5000 }
        );
      });
    setIsLoading(false);
  };
  const dataValidation = (data) => {
    if (data.name == "") {
      toast(
        <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
          <XCircle className="w-5 h-5 text-red-500" />
          Product name is required
        </div>,
        { duration: 5000 }
      );
      return false;
    } else if (
      parseFloat(data.regular_price) < 0 ||
      parseFloat(data.sale_price) < 0
    ) {
      toast(
        <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
          <XCircle className="w-5 h-5 text-red-500" />
          Price cannot be less than 0
        </div>,
        { duration: 5000 }
      );
      return false;
    } else if (parseFloat(data.sale_price) > parseFloat(data.regular_price)) {
      toast(
        <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
          <XCircle className="w-5 h-5 text-red-500" />
          Sale price cannot be more then regular price
        </div>,
        { duration: 5000 }
      );
      return false;
    } else return true;
  };
  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className={cn(
        row.original.status === "pending" &&
          !isEditing &&
          "opacity-30 dark:opacity-20",
        isEditing &&
          "bg-slate-50 hover:bg-slate-50 shadow dark:bg-gray-800 dark:shadow-inner",
        isEditing &&
          !editAll &&
          "border-l-4 rtl:border-r-4 border-x-primary dark:!border-x-primary dark:border-b-1 dark:border-b-slate-500",
        "group",
        row.depth != 0 &&
          "bg-slate-50 hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 !border !border-slate-300 dark:!border-slate-600"
      )}
    >
      <TableCell
        className={cn(
          "p-1 sm:px-0 sticky left-0 rtl:right-0 w-full bg-transparent flex items-center justify-center",
          row.depth != 0 && "!pl-4"
        )}
        // style={{
        //   paddingLeft: `${row.depth * 2}rem`,
        // }}
      >
        <div
          className={cn(
            "h-full w-full bg-white dark:bg-slate-800 dark:group-hover:bg-gray-700 data-[state=selected]:!bg-slate-100 dark:data-[state=selected]:!bg-slate-900 p-0 flex items-center justify-center",
            row.depth == 0 &&
              "[mask-image:_linear-gradient(to_right,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)] rtl:[mask-image:_linear-gradient(to_left,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)]",
            isEditing && "bg-slate-50 bg-opacity-100 dark:bg-gray-800",
            row.depth != 0 &&
              "bg-slate-50 dark:bg-gray-800 group-hover:bg-slate-100 dark:group-hover:bg-gray-700"
          )}
          data-state={row.getIsSelected() && "selected"}
        >
          {row.depth != 0 ? (
            <span>
              {/* <BlocksIcon className="w-6 h-6 dark:text-slate-500 pr-2" /> */}
            </span>
          ) : (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          )}
        </div>
      </TableCell>
      <TableCell className="!max-w-6">
      
        <div className="w-6">
          {row.getCanExpand() ? (
            <button
              className="flex items-center"
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? (
                <ChevronsRight className="rotate-90 w-5 h-5 text-primary" />
              ) : (
                <ChevronsRight className="w-5 h-5 text-primary rtl:rotate-180" />
              )}
            </button>
          ) : row.depth == 0 ? (
            <span className="p-2">-</span>
          ) : (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label="Select row"
              className="mx-1"
            />
          )}
        </div>
      </TableCell>
      {row.getVisibleCells().map((cell, i) =>
        !isEditing ? (
          <TableCell
            key={cell.id}
            style={{
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ) : (
          <TableCell
            key={cell.id}
            style={{
              width: cell.column.getSize(),
            }}
            onClick={() => {
              if (!editedItems.includes(row.original.id)) {
                setEditedItems([...editedItems, row.original.id]);
              }
            }}
          >
            {flexRender(cell.column.columnDef.edit, cell.getContext())}
          </TableCell>
        )
      )}
      {!editAll && (
        <TableCell className="p-1 sm:px-0 sticky right-0 rtl:left-0 w-fit h-full bg-transparent flex items-center justify-center">
          <div
            className={cn(
              "h-full w-full bg-white dark:bg-slate-800 dark:group-hover:bg-gray-700 data-[state=selected]:!bg-slate-100 dark:data-[state=selected]:!bg-slate-900 p-0 flex items-center justify-center [mask-image:_linear-gradient(to_left,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)] rtl:[mask-image:_linear-gradient(to_right,transparent_0,_black_0px,_black_calc(100%-8px),transparent_100%)]",
              isEditing ? "bg-slate-50" : "",
              row.depth != 0 &&
                "bg-slate-50 dark:bg-gray-800 group-hover:bg-slate-100 dark:group-hover:bg-gray-700"
            )}
            data-state={row.getIsSelected() && "selected"}
          >
            <div
              className="w-10 h-10 rounded-full transition-all flex items-center justify-center cursor-pointer group1"
              onClick={() => toggleEdit(row, true)}
            >
              {isLoading ? (
                <RefreshCcw className="text-primary w-5 h-5 animate-spin group1-hover:!text-fuchsia-300" />
              ) : isEditing ? (
                <XCircle className="text-primary w-5 h-5 group1-hover:!text-fuchsia-300" />
              ) : (
                <MdModeEdit className="text-primary w-5 h-5 group1-hover:!text-fuchsia-300" />
              )}
            </div>
            {isEditing && (
              <div className="w-10 h-10 rounded-full transition-all flex items-center justify-center cursor-pointer group">
                <Save
                  className="text-primary w-5 h-5 group1-hover:!text-fuchsia-300"
                  onClick={() => {
                    if (!dataValidation(row.original)) return;
                    updateProduct(row);
                  }}
                />
              </div>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
export default RowItem;
