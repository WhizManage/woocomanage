import Button from "@components/ui/button";
import { CommandItem } from "@components/ui/command";
import { Input } from "@components/ui/input";
import { cn } from "@nextui-org/react";
import { Check, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteApi, putApi } from "/services/services";

const MultiSelectEditItem = ({
  item,
  ItemsExist,
  setItemsExist,
  ItemsProduct,
  setItemsProduct,
  columnName,
  row,
}) => {
  const [isEditItem, setIsEditItem] = useState(false);
  const [newName, setNewName] = useState("");

  const editItem = async () => {
    const url = `${window.siteUrl}/wp-json/wc/v3/products/${columnName}/${item.id}`;
    const itemData = {
      name: newName,
    };
    try {
      const response = await putApi(url, itemData);
      const updatedItem = response.data;
      setItemsExist(
        ItemsExist.map((i) => (i.id === item.id ? updatedItem : i))
      );
      setItemsProduct(
        ItemsProduct.map((i) => (i.id === item.id ? updatedItem : i))
      );
      toast(
        <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
          <CheckCircle className="w-5 h-5 text-green-500" />
          {`The ${columnName} has been successfully updated to "${updatedItem.name}".`}
        </div>,
        { duration: 5000 }
      );
      setIsEditItem(false);
      setNewName("");
    } catch (error) {
      console.log("Error editing item", error);
    }
  };

  const deleteItem = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to permanently delete this ${columnName}?`
    );
    if (isConfirmed) {
      const url = `${window.siteUrl}/wp-json/wc/v3/products/${columnName}/${item.id}`;
      await deleteApi(url)
        .then((res) => {
          toast(
            <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
              <CheckCircle className="w-5 h-5 text-green-500" />
              The {columnName} {item.name} has been permanently deleted.
            </div>,
            { duration: 5000 }
          );
          setItemsExist(
            ItemsExist.filter((existItem) => existItem.id !== item.id)
          );
          setItemsProduct(
            ItemsProduct.filter((productItem) => productItem.id !== item.id)
          );
        })
        .catch((error) => console.log("Error deleting item", error));
    }
  };

  return (
    <CommandItem
      className="cursor-pointer dark:hover:bg-slate-700 group/item flex justify-between"
      key={item.name}
      onSelect={(value) => {
        setItemsProduct((prevItemsProduct) => {
          let newItemsProduct;
          if (
            prevItemsProduct.some(
              (existingItem) => existingItem.name === item.name
            )
          ) {
            newItemsProduct = prevItemsProduct.filter(
              (existingItem) => existingItem.name !== item.name
            );
          } else {
            newItemsProduct = [...prevItemsProduct, item];
          }
          if (row) row.original[columnName] = newItemsProduct;
          return newItemsProduct;
        });
      }}
    >
      {isEditItem ? (
        <div className="flex gap-2">
          <Input
            onChange={(e) => {
              e.stopPropagation();
              setNewName(e.target.value);
            }}
            defaultValue={item.name}
            className="h-8 w-full"
            onFocus={(event) => event.target.select()}
          />
          <Button
            variant="outline"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation();
              editItem();
              setIsEditItem(false);
            }}
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              ItemsProduct.some(
                (productElement) => productElement.name === item.name
              )
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <span className="flex-1">{item.name}</span>
          <div className="hidden group-hover/item:flex gap-1 !max-w-fit">
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditItem(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                deleteItem();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </CommandItem>
  );
};

export default MultiSelectEditItem;
