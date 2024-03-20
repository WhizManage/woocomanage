import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className="relative 
    shadow dark:shadow-xl rounded-lg
    border border-neutral-200 dark:border-slate-700 
    h-[calc(100vh-304px)] sm:h-[calc(100vh-206px)] 
    overflow-auto scroll-smooth select-none scrollbar-none
    min-w-full"
  >
    <table
      ref={ref}
      className={cn("text-sm table-auto min-w-full", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "sm:[&_tr]:border-b [&_tr]:bg-gray-100 dark:[&_tr]:bg-slate-900 w-full dark:hover:[&_tr]:bg-slate-900 z-10 sticky top-0",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y dark:divide-slate-700 w-full", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "relative w-full bg-white/50 dark:bg-slate-800 dark:hover:bg-gray-700 hover:bg-white/10 hover:shadow-lg dark:hover:!shadow-2xl data-[state=selected]:!bg-slate-200/40 dark:data-[state=selected]:!bg-slate-900",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "relative w-full bg-gray-100 dark:bg-slate-900 pr-4 pl-2 text-left align-middle whitespace-nowrap font-medium text-muted-foreground dark:text-slate-300",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          "sm:px-4 sm:h-16 max-sm:w-fit align-middle text-slate-500 dark:text-slate-300/90 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
