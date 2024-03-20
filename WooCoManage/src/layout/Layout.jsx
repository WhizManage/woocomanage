import { useState } from "react";
import DashboardPage from "../pages/dashboard/page";
import Navbar from "./Navbar";
import { ThemeProvider } from "./ThemeProvider";
import DesktopSidebar from "./_components/DesktopSidebar";
import FreeTrailingPopup from "./_components/FreeTrailingPopup";

export default function Layout() {
  const [view, setView] = useState("dashboard");
  let content = <DashboardPage />;
  return (
    <ThemeProvider defaultTheme="system" storageKey="'woocomanage'-ui-theme">
      <FreeTrailingPopup />
      <div className="flex max-h-screen overflow-hidden">
        <DesktopSidebar />
        <div
          className="
			bg-fuchsia-100 dark:bg-gray-900
			h-screen w-full flex-1 overflow-hidden
			"
        >
          <Navbar />
          <div
            className="
			sm:mt-0 mt-14 m-2 
			h-[calc(100vh-64px)] overflow-y-scroll
			shadow-sm bg-white rounded-md dark:bg-secondary dark:text-neutral-200
			scrollbar-none
			"
          >
            {content}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
