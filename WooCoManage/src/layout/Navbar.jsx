import Button from "@components/ui/button";
import { Link } from "@nextui-org/react";
import { MessageCircleQuestion, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import MobileSidebar from "./_components/MobileSidebar";
import { getApiOut } from "/services/services";

const Navbar = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersion, setNnwVersion] = useState("");
  const checkNumberVersion = async () => {
    try {
      const url = "https://woocomanage.com/wp-json/woocomanage/v1/version/";
      const response = await getApiOut(url);
      setNnwVersion(response.data);
      if (response.data !== window.version) {
        setIsUpdateAvailable(true);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };
  useEffect(() => {
    checkNumberVersion();
  }, []);
  return (
    <div className="fixed top-0 sm:static dark:bg-dark z-50 h-14 w-full p-0">
      
      <div className="h-full w-full flex items-center gap-2 justify-between px-2 relative">
        <div className="flex h-full gap-2 items-center justify-center">
          <MobileSidebar />
          <ModeToggle />
        </div>
        {/* <div className="max-w-24">
        <button className="inline-flex animate-shimmer h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Shimmer
        </button>
        </div> */}
        {isUpdateAvailable && (
          <div
            // variant="primary"
            className="flex sm:items-center max-w-fit h-fit sm:h-10 max-sm:absolute top-2 max-sm:mr-2 bg-white dark:bg-slate-700 px-4 rounded-lg gap-2 dark:text-slate-300"
          >
            {/* <PlusCircle className="h-4 w-4" /> */}
            <span className="max-sm:mt-0.5">✨</span>
            <div className="sm:flex gap-4 justify-center items-center sm:h-6">
              <p className="sm:h-6 text-base text-slate-500 dark:text-slate-400">
                There is a new version available (version number {newVersion})
              </p>
              <a
              onClick={()=>console.log("")}
                href={window.siteUrl+'/wp-admin/plugins.php/'}
                // target="_blank"
                className="underline text-primary font-semibold text-base"
              >
                Update now
              </a>
              <div
                className="sm:w-6 sm:h-6 max-sm:pb-2 flex items-center justify-center rounded-full hover:bg-fuchsia-100 dark:hover:bg-slate-700 cursor-pointer text-primary hover:text-fuchsia-700 dark:text-slate-400 dark:hover:text-slate-300"
                onClick={() => setIsUpdateAvailable(false)}
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-500" />
              </div>
            </div>
          </div>
        )}
        <a href="https://woocomanage.com/#Get%20In%20Touch" target="_blank">
          <Button variant="outline" className="border-0">
            <MessageCircleQuestion className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" />
            <span>Help</span>
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
