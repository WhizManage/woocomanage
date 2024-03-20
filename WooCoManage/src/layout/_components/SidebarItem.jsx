import { cn } from "@/lib/utils";

const SidebarItem = ({ icon, label, openSidebar, disabled, isActive }) => {
  const active = "bg-fuchsia-100 dark:bg-slate-700";
  const unActive = "";

  return (
    <div
      // onClick={onClick}
      className={cn(
        disabled ? "cursor-default" : "cursor-pointer hover:bg-fuchsia-100 dark:hover:bg-slate-700",
        isActive ? active : unActive,
        "flex items-center gap-4 p-3 mr-2 rtl:mr-0 rtl:ml-2 my-2 text-md",
        openSidebar ? "pl-6 rtl:pl-0 rtl:pr-6 rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" : "rounded-xl m-2"
      )}
    >
      <span
        className={cn(
          // isActive ? "text-white" : "text-neutral-500/95",
          disabled ? "text-slate-300 dark:text-slate-700" : "text-primary",
          "pr-0.5"
        )}
        // size={22}
      >
        {icon}
      </span>
      <h2
        className={cn(
          openSidebar ? "" : "sm:hidden",
          disabled
            ? "text-slate-300 dark:text-slate-700"
            : "dark:text-slate-300/95",
          " text-base font-normal"
        )}
      >
        {label}
      </h2>
    </div>
  );
};

export default SidebarItem;
