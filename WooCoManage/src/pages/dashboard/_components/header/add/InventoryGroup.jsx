import { IconBadge } from "@components/IconBadge";
import { CustomRadio } from "@components/nextUI/CustomRadio";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox, RadioGroup, Tab, Tabs } from "@nextui-org/react";
import { Container } from "lucide-react";
import { useState } from "react";

const InventoryGroup = ({ register, updateValue }) => {
  const [menageStock, setMenageStock] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={Container} />
        <h2 className="text-xl dark:text-gray-400">Inventory</h2>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="sku">SKU</Label>
        <div className="relative h-10 border rounded-lg flex gap-1 items-center px-1 dark:bg-slate-700">
          <Input
            type="text"
            id="sku"
            placeholder="SKU"
            className="!border-none !ring-0 dark:!text-slate-300 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
            {...register("sku")}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label>Stock management</Label>
        <Checkbox
          color="primary"
          onValueChange={(isSelected) => {
            setMenageStock(isSelected);
            updateValue("manage_stock", isSelected);
          }}
          classNames={{label: "flex gap-2", base: "w-full rtl:!ml-2"}}
        >
          Track stock quantity for this product
        </Checkbox>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Tabs
          fullWidth
          size="md"
          aria-label="Tabs form"
          selectedKey={menageStock ? "Inventory tracking" : "Set status"}
          disabledKeys={menageStock ? ["Set status"] : ["Inventory tracking"]}
          classNames={{tabList: "dark:bg-slate-700",tab: "dark:group-data-[selected=true]:!bg-slate-800"}}
        >
          <Tab key="Inventory tracking" title="Inventory tracking">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative h-10 dark:bg-slate-700 border rounded-lg flex gap-1 items-center px-1">
                  <Input
                    type="number"
                    id="quantity"
                    placeholder="0"
                    className="!border-none dark:!text-slate-300 !ring-0 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                    {...register("stock_quantity",{ min: 0})}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-1.5">
                <Label>Allow backorders?</Label>
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => {
                    updateValue("backorders", value);
                  }}
                >
                  <CustomRadio value="no">Do not allow</CustomRadio>
                  <CustomRadio value="notify">
                    Allow, but notify customer
                  </CustomRadio>
                  <CustomRadio value="yes">Allow</CustomRadio>
                </RadioGroup>
              </div>
            </div>
          </Tab>
          <Tab key="Set status" title="Set status">
            <div className="grid w-full gap-1.5">
              <Label>Stock status</Label>
              <RadioGroup
                defaultValue="instock"
                onValueChange={(value) => {
                  updateValue("stock_status", value);
                }}
              >
                <CustomRadio value="instock">In stock</CustomRadio>
                <CustomRadio value="outofstock">Out of stock</CustomRadio>
                <CustomRadio value="onbackorder">On backorder</CustomRadio>
              </RadioGroup>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryGroup;
