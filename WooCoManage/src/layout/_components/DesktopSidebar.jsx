import { dataMenuTop } from "@/data/dataMenu";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Link } from "@nextui-org/react";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import SidebarItem from "./SidebarItem";

function DesktopSidebar() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [active, setActive] = useState("Products");
  const updateSize = () => setScreenSize(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (screenSize <= 1080) {
      setOpenSidebar(false);
    } else {
      setOpenSidebar(true);
    }
  }, [screenSize]);
  return (
    <div
      className={cn(
        openSidebar ? "w-64" : "w-16",
        "hidden sm:block z-50 duration-500 select-none scrollbar-none"
      )}
    >
      <div className="bg-white dark:bg-secondary w-full h-full">
        <div className=" h-screen flex flex-col dark:divide-y dark:divide-slate-700/70">
          <div className="sm:flex items-center justify-between min-h-30 hidden shadow-sm md:sticky md:top-0 bg-white dark:bg-secondary">
            <div></div>
            {openSidebar ? (
              <div>
                <div className="p-4 pb-2 dark:hidden">
                  <img
                    src={
                      window.siteUrl +
                      "/wp-content/plugins/woocomanage/assets/images/logo/main-logo.png"
                    }
                    alt="logo"
                  />
                </div>
                <div className="p-2 pt-4 pb-2 hidden dark:block">
                  <img
                    src={
                      window.siteUrl +
                      "/wp-content/plugins/woocomanage/assets/images/logo/main-logo-dark.png"
                    }
                    alt="logo"
                  />
                </div>
                <div className="flex items-end justify-between p-4 pt-2 w-full h-full">
                  <h2 className="text-2xl font-semibold truncate text-center flex-1 dark:text-slate-400">
                    {window.store_name}
                  </h2>
                  <span
                    className={cn(
                      "text-slate-400 cursor-pointer rtl:rotate-180",
                    )}
                    onClick={() => setOpenSidebar(!openSidebar)}
                  >
                    <MdMenuOpen className="w-6 h-6 text-fuchsia-300 dark:text-slate-400 hover:text-primary transition-all" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div className="p-3 pt-4">
                  <img
                    src={
                      window.siteUrl +
                      "/wp-content/plugins/woocomanage/assets/images/logo/symbol.png"
                    }
                    alt="logo"
                  />
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-slate-400 rotate-180 cursor-pointer rtl:rotate-180 my-4"
                    onClick={() => setOpenSidebar(!openSidebar)}
                  >
                    <MdMenuOpen className="w-6 h-6 text-fuchsia-300 dark:text-slate-400 hover:text-primary transition-all" />
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto md:hover:overflow-auto scrollbar-none">
            {dataMenuTop.map((item, i) => {
              return (
                <div key={i} className="pt-0.5">
                  <SidebarItem
                    openSidebar={openSidebar}
                    label={item.name}
                    icon={item.svgOut}
                    disabled={!item.visible}
                    isActive={item.name == active}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col w-full items-center justify-center scrollbar-none py-2">
            <Link href={window.siteUrl + "/wp-admin"}>
              <Button
                variant="outline"
                className="gap-4 text-gray-600 dark:text-slate-300 dark:bg-slate-700"
              >
                <Undo2 className="text-primary w-4 h-4" />
                {openSidebar && "Back to wordpress"}
              </Button>
            </Link>
            <p
              className={cn(
                "text-gray-600 dark:text-slate-400 m-1 text-center flex gap-1 items-center justify-center",
                openSidebar ? "flex-row" : "flex-col"
              )}
            >
              <span>Version</span>
              <span
                className={cn(
                  "!truncate text-nowrap",
                  openSidebar ? "!max-w-full" : "pl-2 !max-w-16"
                )}
              >
                {window.version}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopSidebar;
