import { NextUIProvider } from "@nextui-org/system";
import Layout from "./layout/Layout.jsx";
import { Toaster } from "sonner";


const App = () => {
  return (
    <NextUIProvider>
      <Toaster
        visibleToasts={3}
        expand
        toastOptions={{
          classNames: {
            toast: "bg-white !p-0 !m-0 dark:bg-slate-800 dark:text-slate-400 dark:!border-slate-700",
          },
        }}
      />

      <Layout />
    </NextUIProvider>
  );
};
export default App;
