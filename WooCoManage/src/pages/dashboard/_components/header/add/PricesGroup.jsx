import { IconBadge } from "@components/IconBadge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { CircleDollarSign, DollarSign } from "lucide-react";
import React from "react";

const PricesGroup = ({ register, errors }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={CircleDollarSign} />
        <h2 className="text-xl dark:text-gray-400">Product prices</h2>
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="price">Regular price</Label>
        <div className="relative h-10 border rounded-lg flex rtl:flex-row-reverse gap-1 items-center px-1 dark:bg-slate-700">
          <span
            className="text-gray-400 text-base rtl:!px-2 rtl:!pt-2.5"
            dangerouslySetInnerHTML={{ __html: window.currency }}
          />
          {/* <DollarSign className="w-4 h-4 text-gray-400" /> */}
          <Input
            type="number"
            id="price"
            placeholder="0.00"
            min={0}
            className="!border-none !ring-0 dark:!text-slate-300 invalid:border-red-500 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
            {...register("regular_price", {
              min: {
                value: 0,
                message: "Regular price cannot be less than 0",
              },
            })}
          />
        </div>
        {errors.regular_price && (
          <p className="text-red-500 dark:text-pink-500 text-sm px-2">
            {errors.regular_price.message}
          </p>
        )}
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="sale_price">Sale price (optional)</Label>
        <div className="relative h-10 border rounded-lg flex rtl:flex-row-reverse gap-1 items-center px-1 dark:bg-slate-700">
          <span
            className="text-gray-400 text-base rtl:!px-2 rtl:!pt-2.5"
            dangerouslySetInnerHTML={{ __html: window.currency }}
          />
          <Input
            type="number"
            id="sale_price"
            placeholder="0.00"
            min={0}
            className="!border-none !ring-0 dark:!text-slate-300 invalid:border-red-500 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
            {...register("sale_price", {
              min: {
                value: 0,
                message: "Sale price cannot be less than 0",
              },
            })}
          />
        </div>
        {errors.sale_price && (
          <p className="text-red-500 dark:text-pink-500 text-sm px-2">
            {errors.sale_price.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricesGroup;
