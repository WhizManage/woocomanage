import { inventoryStyles, convertInventory } from "@/data/inventoryStyles";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import React, { useEffect, useState } from "react";

const InventoryEdit = ({ row }) => {
  const [manage, setManage] = useState(row.original.manage_stock);
  const [quantity, setQuantity] = useState(row.original.stock_quantity);
  const [status, setStatus] = useState(row.original.stock_status);
  useEffect(() => {
    row.original.manage_stock = manage;
  }, [manage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(inventoryStyles(row.original), "h-8 uppercase !px-2")}
        >
          {manage ? quantity : convertInventory(status)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <Label htmlFor="airplane-mode" className="flex-1 h-full">
            Manage stock
          </Label>
          <Switch
            className=""
            id="airplane-mode"
            checked={manage}
            onCheckedChange={() => {
              setManage(!manage);
            }}
          />
        </DropdownMenuLabel>
        <DropdownMenuLabel
          className="flex items-center justify-between"
          value=""
        >
          <Input
            type="number"
            min={0}
            onChange={(e) => {
              setQuantity(e.target.value);
              row.original.stock_quantity = e.target.value;
            }}
            defaultValue={quantity}
            className="h-8 min-w-40"
            onFocus={(event) => event.target.select()}
            disabled={!manage}
          />
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={manage}
            onSelect={(e) => {
              setStatus("instock");
              row.original.stock_status = "instock";
            }}
            className="text-green-500 hover:!text-green-600 disabled:text-muted"
          >
            In stock
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={manage}
            onSelect={(e) => {
              setStatus("outofstock");
              row.original.stock_status = "outofstock";
            }}
            className="text-pink-500 hover:!text-pink-600 disabled:text-muted"
          >
            Out of stock
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={manage}
            onSelect={(e) => {
              setStatus("onbackorder");
              row.original.stock_status = "onbackorder";
            }}
            className="text-yellow-500 hover:!text-yellow-600 disabled:text-muted"
          >
            On backorder
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InventoryEdit;
