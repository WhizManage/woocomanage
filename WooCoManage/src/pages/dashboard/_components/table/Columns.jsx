import { convertInventory, inventoryStyles } from "@/data/inventoryStyles";
import { StatusKeys } from "@/data/statusKeys";
import { cn } from "@/lib/utils";
import { Badge } from "@components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { Avatar, Image, Switch, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { columnFilterFn } from "../header/ColumnFilter";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import ImageEdit from "./edit/Image/ImageEdit";
import InventoryEdit from "./edit/InventoryEdit";
import MultiSelectEdit from "./edit/MultiSelectEdit";
import PriceEdit from "./edit/PriceEdit";
import GalleryEdit from "./edit/gallery/GalleryEdit";
import EditorEdit from "./edit/EditorEdit";
import DimensionsEdit from "./edit/DimensionsEdit";
import Button from "@components/ui/button";

const showNormalTextForTitle = (textHtml) => {
  if(textHtml){
    const parser = new DOMParser();
    const htmlString = textHtml.toString();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent;
  }
};

export const columns = [
  {
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Image"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <Tooltip
        className="p-0 m-0"
        placement={window.user_local == "he_IL" ? "left" : "right"}
        content={
          <Image
            width={300}
            alt="NextUI hero Image"
            src={
              row.depth == 0
                ? row?.original?.images[0] != null
                  ? row.original.images[0].src
                  : "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
                : row?.original?.image != null
                ? row.original.image.src
                : "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
            }
          />
        }
      >
        <Avatar
          src={
            row.depth == 0
              ? row?.original?.images[0] != null && row.original.images[0].src
              : row?.original?.image != null && row.original.image.src
          }
          radius="sm"
          fallback={
            <img
              className="w-full h-full object-fill"
              src="https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
            />
          }
        />
      </Tooltip>
    ),
    // edit: ({ row }) => (row.original.images ||row.original.image ? <ImageEdit row={row} /> : <>r</>),
    edit: ({ row }) => <ImageEdit row={row} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Name"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <div
        title={row.original.name}
        className="capitalize !line-clamp-2 truncate text-wrap"
      >
        {row.original.name}
      </div>
    ),
    edit: ({ row }) => (
      <div className="capitalize !line-clamp-2 truncate text-wrap">
        {row.depth == 0 ?
          <Textarea
            onChange={(e) => {
              row.original.name = e.target.value;
            }}
            defaultValue={row.original.name}
            className="h-8 min-w-40 invalid:border-red-500 rounded-sm"
            onFocus={(event) => event.target.select()}
            rows="2"
            required
          />:
          row.original.name
        }
 
          {/* <Textarea
            onChange={(e) => {
              row.original.name = e.target.value;
            }}
            defaultValue={row.original.name}
            className="h-8 min-w-40 invalid:border-red-500 rounded-sm"
            onFocus={(event) => event.target.select()}
            rows="2"
            required
          /> */}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Status"}
        className="mr-1"
      />
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "capitalize font-semibold px-1 border rounded-md text-sm w-fit rtl:mr-2",
            StatusKeys[row.original.status]
          )}
        >
          {row.original.status}
        </div>
      );
    },
    edit: ({ row }) => {
      const [value, setValue] = useState(row.original.status);
      return (
        <Select
          onValueChange={(selectedValue) => {
            setValue(selectedValue);
            row.original.status = selectedValue;
          }}
        >
          <SelectTrigger
            className={cn(
              "capitalize font-semibold px-4 border rounded-md text-sm w-fit rtl:mr-2 py-0 h-8 focus-visible:ring-0 focus:ring-offset-0",
              StatusKeys[value]
            )}
          >
            <SelectValue placeholder={<span>{value}</span>} />
          </SelectTrigger>
          <SelectContent className="!p-0 min-w-fit max-w-fit dark:border-slate-600">
            {Object.keys(StatusKeys)
              .slice(0, -1)
              .map((status) => (
                <SelectItem
                  value={status}
                  className={cn(
                    "capitalize cursor-pointer font-semibold text-sm w-full rtl:mr-2 py-2 pr-0.5 hover:border-slate-500 !rounded-none",
                    StatusKeys[status]
                  )}
                >
                  <span> {status}</span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );
    },
    filterFn: columnFilterFn,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Type"} className="mr-1" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "capitalize font-semibold px-1 border rounded-md text-sm w-fit rtl:mr-2"
          )}
        >
          {row.original.type}
        </div>
      );
    },
    edit: ({ row }) => {
      const [value, setValue] = useState(row.original.type);
      const handleChange = () => {
        if (value == "variable") {
          if (row.original.has_options == true) {
            if (
              window.confirm(
                "Please confirm that you understand deleting the product variations is irreversible and cannot be undone. This action will permanently remove all variations associated with this product from the system."
              )
            ) {
              setValue("simple");
              row.original.type = "simple";
            }
          } else {
            setValue("simple");
            row.original.type = "simple";
          }
        } else {
          setValue("variable");
          row.original.type = "variable";
        }
      };
      return (
        <>
          {row.original.type ? (
            <Button
              className="flex gap-2 h-8 capitalize"
              variant="outline"
              onClick={() => handleChange()}
            >
              <Switch
                size="sm"
                isSelected={value == "variable"}
                onValueChange={() => handleChange()}
                classNames={{
                  base: "inline-flex flex-row-reverse",
                  label: "flex justify-center",
                  wrapper: "p-0 h-5 overflow-visible dark:bg-slate-500",
                  thumb: cn(
                    "w-5 h-5 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    "group-data-[selected=true]:ml-5",
                    "group-data-[pressed=true]:w-6",
                    "group-data-[selected]:group-data-[pressed]:ml-4"
                  ),
                }}
              >
                <p className={cn("w-16 text-slate-600 dark:text-slate-300")}>
                  {value}
                </p>
              </Switch>
            </Button>
          ) : (
            // <Select
            //   onValueChange={(selectedValue) => {
            //     setValue(selectedValue);
            //     row.original.type = selectedValue;
            //   }}
            // >
            //   <SelectTrigger
            //     className={cn(
            //       "capitalize font-semibold px-4 border rounded-md text-sm w-fit rtl:mr-2 py-0 h-8 focus-visible:ring-0 focus:ring-offset-0"
            //     )}
            //   >
            //     <SelectValue placeholder={<span>{value}</span>} />
            //   </SelectTrigger>
            //   <SelectContent className="!p-0 min-w-fit max-w-fit dark:border-slate-600">
            //     <SelectItem
            //       value="simple"
            //       className={cn(
            //         "capitalize cursor-pointer font-semibold text-sm w-full rtl:mr-2 py-2 pr-0.5 hover:border-slate-500 !rounded-none"
            //       )}
            //     >
            //       <span>Simple</span>
            //     </SelectItem>
            //     <SelectItem
            //       value="variable"
            //       className={cn(
            //         "capitalize cursor-pointer font-semibold text-sm w-full rtl:mr-2 py-2 pr-0.5 hover:border-slate-500 !rounded-none"
            //       )}
            //     >
            //       <span>Variable</span>
            //     </SelectItem>
            //   </SelectContent>
            // </Select>
            <>variant</>
          )}
        </>
      );
    },
    filterFn: columnFilterFn,
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Tags"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap !line-clamp-2 max-sm:!hidden">
        {row.original.tags &&
          row.original.tags.map((tag) => (
            <Badge
              variant="outline"
              className="lowercase cursor-pointer whitespace-nowrap"
            >
              #{tag.name}
            </Badge>
          ))}
      </div>
    ),
    edit: ({ row }) =>
      row.original.tags ? (
        <MultiSelectEdit row={row} columnName="tags" />
      ) : (
        <></>
      ),
    filterFn: columnFilterFn,
  },
  {
    accessorKey: "categories",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Categories"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <div className="capitalize flex flex-wrap gap-2 !line-clamp-2 max-sm:!hidden">
        {row.original.categories &&
          row.original.categories.map((item) => (
            <Badge variant="outline" className="whitespace-nowrap">
              {item.name}
            </Badge>
          ))}
      </div>
    ),
    edit: ({ row }) =>
      row.original.categories ? (
        <MultiSelectEdit row={row} columnName="categories" />
      ) : (
        <></>
      ),
    filterFn: columnFilterFn,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Price"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => {
      const formatPrice = (price) => {
        return `${Number(price).toLocaleString("en-US")}`;
      };
      if (!row.original.has_options) {
        const salePrice = row.original.sale_price;
        const regularPrice = row.original.regular_price;
        return (
          <div className="capitalize pl-2 rtl:pr-4">
            <div>
              {salePrice && (
                <span dangerouslySetInnerHTML={{ __html: window.currency }} />
              )}
              {salePrice && formatPrice(salePrice)}
            </div>
            <div className={cn(salePrice && "line-through text-slate-300")}>
              <span dangerouslySetInnerHTML={{ __html: window.currency }} />
              {formatPrice(regularPrice)}
            </div>
          </div>
        );
      } else {
        return (
          <div className="capitalize pl-2 rtl:pr-4">
            {showNormalTextForTitle(row.original.price_html)}
          </div>
        );
      }
    },
    edit: ({ row }) => {
      if (row.original.has_options) {
        return (
          <div className="capitalize pl-2 rtl:pr-4">
            {showNormalTextForTitle(row.original.price_html)}
          </div>
        );
      } else {
        return <PriceEdit row={row} />;
      }
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Description"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <div
        className="capitalize truncate description-img !line-clamp-2 text-wrap max-sm:!hidden"
        title={showNormalTextForTitle(row.original.description)}
      >
        {showNormalTextForTitle(row.original.description)}
      </div>
    ),
    edit: ({ row }) => <EditorEdit row={row.original} title={"description"} />,
  },
  {
    accessorKey: "short_description",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Short Description"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) =>
      row.depth == 0 ? (
        <div
          className="capitalize !line-clamp-2 truncate description-img text-wrap max-sm:hidden"
          title={showNormalTextForTitle(row.original.short_description)}
        >
          {showNormalTextForTitle(row.original.short_description)}
        </div>
      ) : (
        <></>
      ),
    edit: ({ row }) =>
      row.depth == 0 ? (
        <EditorEdit row={row.original} title={"short_description"} />
      ) : (
        <></>
      ),
  },
  {
    accessorKey: "stock_quantity",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Inventory"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            inventoryStyles(row.original),
            "uppercase !text-sm font-semibold"
          )}
        >
          {row.original.manage_stock
            ? row.original.stock_quantity
            : convertInventory(row.original.stock_status)}
        </div>
      );
    },
    edit: ({ row }) => <InventoryEdit row={row} />,
  },
  {
    accessorKey: "weight",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Weight"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.original.weight}</div>,
    edit: ({ row }) => (
      <div className="capitalize !line-clamp-1">
        <Input
          onChange={(e) => {
            row.original.weight = e.target.value;
          }}
          defaultValue={row.original.weight}
          className="h-8 min-w-40"
          onFocus={(event) => event.target.select()}
        />
      </div>
    ),
  },
  {
    accessorKey: "SKU",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title={"SKU"} className="mr-1" />
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.original.sku}</div>,
    edit: ({ row }) => (
      <div className="capitalize !line-clamp-1">
        <Input
          onChange={(e) => {
            row.original.sku = e.target.value;
          }}
          defaultValue={row.original.sku}
          className="h-8 min-w-40"
          onFocus={(event) => event.target.select()}
        />
      </div>
    ),
  },
  {
    accessorKey: "dimensions",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Dimensions"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-xs text-slate-400/80">
        <div className="capitalize flex gap-1">
          <span className="font-bold">Width:</span>
          <span>{row?.original?.dimensions?.width||""}</span>
        </div>
        <div className="capitalize flex gap-1">
          <span className="font-bold">Height:</span>
          <span>{row?.original?.dimensions?.height||""}</span>
        </div>
        <div className="capitalize flex gap-1">
          <span className="font-bold">Length:</span>
          <span>{row?.original?.dimensions?.length || ""}</span>
        </div>
      </div>
    ),
    edit: ({ row }) => <DimensionsEdit row={row} />,
  },
  {
    accessorKey: "images",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Product gallery"}
          className="mr-1"
        />
      );
    },
    cell: ({ row }) =>
      row.original.images ? (
        <Carousel className="w-full max-h-14">
          <CarouselContent>
            {row.original.images.length > 1 ? (
              row.original.images.slice(1).map((image, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center w-full justify-center p-1 h-14 bg-transparent">
                    <img
                      src={image.src}
                      className="max-h-full object-contain !mix-blend-hard-light rounded"
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="flex items-center w-full justify-center p-0 h-14 bg-transparent text-slate-300">
                  No images
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <></>
      ),
    edit: ({ row }) =>
      row.original.images ? <GalleryEdit row={row} /> : <></>,
  },
];
