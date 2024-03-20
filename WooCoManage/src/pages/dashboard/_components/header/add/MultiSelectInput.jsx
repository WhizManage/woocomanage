import { cn } from "@/lib/utils";
import { getApi } from "/services/services";
import Loader from "@components/Loader";
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
} from "@components/ui/popover";
import { Chip } from "@nextui-org/react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import { postApi } from "/services/services";
import MultiSelectEditItem from "../../table/edit/MultiSelectEditItem";

const MultiSelectInput = ({ columnName, updateValue }) => {
  const [ItemsExist, setItemsExist] = useState([]);
  const [ItemsProduct, setItemsProduct] = useState([]);
  const [addItem, setAddItem] = useState(false);
  const [newItem, setNewItem] = useState("");
  useEffect(() => {
    const url = `${window.siteUrl}/wp-json/wc/v3/products/${columnName}?per_page=100`;
    getApi(url)
      .then((res) => setItemsExist(res?.data))
      .catch((error) => console.log(error));
  }, []);

  const handleClose = (itemToRemove) => {
    const newItemToRemove = ItemsProduct.filter(
      (item) => item !== itemToRemove
    );
    setItemsProduct(newItemToRemove);
    updateValue(columnName, newItemToRemove);
  };

  const addNewItem = async (item) => {
    const itemData = {
      name: item,
    };
    await postApi(
      `${window.siteUrl}/wp-json/wc/v3/products/${columnName}`,
      itemData
    )
      .then((res) => {
        setItemsExist([res?.data, ...ItemsExist]);
        setItemsProduct([...ItemsProduct, res?.data]);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 relative min-h-10 items-center">
        {ItemsProduct.map((item, index) => (
          <Chip
            key={index}
            onClose={() => handleClose(item)}
            variant="flat"
            classNames={{
              base: "bg-gradient-to-br from-fuchsia-50 dark:from-slate-100 to-fuchsia-200 dark:to-fuchsia-100 opacity-100",
              content: "text-primary",
              closeButton: "text-primary",
            }}
          >
            {item.name}
          </Chip>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-between h-10 dark:bg-slate-700 dark:hover:!bg-slate-800"
          >
            Select {columnName}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 dark:bg-slate-800" align="start">
          <Command className="dark:bg-slate-800">
            {addItem ? (
              <div className="h-12 px-1 gap-1 flex items-center justify-center">
                <div className="relative h-10 border rounded-lg flex gap-1 items-center px-1 dark:bg-slate-700">
                  <Input
                    type="text"
                    id="tagName"
                    placeholder={`new ${columnName}`}
                    className="!border-none dark:!text-slate-300 !ring-0 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-10 border-b rounded-lg"
                  onClick={() => {
                    addNewItem(newItem);
                    setAddItem(false);
                  }}
                >
                  Add
                </Button>
              </div>
            ) : (
              <div className="flex">
                <CommandInput
                  placeholder={`Find ${columnName}`}
                  className="!border-none !ring-0"
                />
                <div className="h-12 w-12 border-b dark:border-slate-700 flex justify-center items-center">
                  <Button
                    variant="ghost"
                    className="dark:hover:bg-slate-700 px-2 rounded-xl"
                    onClick={() => setAddItem(true)}
                  >
                    <Plus className="w-5 h-5 dark:text-slate-400" />
                  </Button>
                </div>
              </div>
            )}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading={`${columnName} exist`}>
                {ItemsExist.length < 1 ? (
                  <Loader />
                ) : (
                  ItemsExist.map((item) => (
                    <MultiSelectEditItem
                      item={item}
                      ItemsExist={ItemsExist}
                      setItemsExist={setItemsExist}
                      ItemsProduct={ItemsProduct}
                      setItemsProduct={setItemsProduct}
                      columnName={columnName}
                    />
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MultiSelectInput;
